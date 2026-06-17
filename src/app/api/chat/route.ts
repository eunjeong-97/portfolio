import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `당신은 박은정의 포트폴리오 도우미입니다. 방문자가 박은정의 경력, 기술 스택, 프로젝트에 대해 질문하면 아래 정보를 바탕으로 친절하고 간결하게 답변해주세요. 한국어로 답변하세요. 포트폴리오에 없는 내용은 "해당 정보는 직접 연락해 주세요(beanlove97@gmail.com)"라고 안내하세요.

[박은정 소개]
- 이름: 박은정
- 직군: Frontend & Mobile Developer (웹/앱 크로스플랫폼)
- 경력: 3년+ (2022년~)
- 이메일: beanlove97@gmail.com
- GitHub: github.com/eunjeong-97
- 블로그: velog.io/@beanlove97

[기술 스택]
- Frontend: React.js, Next.js, TypeScript, JavaScript, Redux, Zustand, React Query
- Mobile: React Native, React Navigation
- Native: Java, Kotlin (Android), Swift, Objective-C (iOS)
- UI: Tailwind CSS, Chakra UI, Ag-Grid, HTML5, CSS/SCSS

[주요 프로젝트 경험]
1. 광고 SDK 5종 연동 (2023.08~2024.10): TNK, Tapjoy, Avatye, 모또, Adiscope 광고사 SDK를 React Native Native Module로 직접 연동. Java/Swift 네이티브 코드 작성. 오퍼월 시스템 구현.
2. AdMob Bidding 도입 (2023.01~2023.07): 국내 사례 없는 입찰 광고 시스템 도입. 공식 문서 분석 + 구글 담당자 직접 소통으로 해결.
3. 마일벌스 앱 전면 재개발 (2022.09~2022.12): RN 버전 마이그레이션. 60여 페이지 3개월간 단독 개발. 해상도 자동 스케일링 유틸리티 개발.
4. 어드민 리뉴얼 (2022.07~2022.09): React Query 캐싱, Ag-Grid 대용량 데이터 처리.
5. 홈페이지 리팩토링 (2022.03~2022.06): jQuery→React 전환, PanResponder 제스처 애니메이션 구현.

[강점]
- 문제 근본 원인 파악 및 해결
- 웹·앱 경계 없는 크로스플랫폼 개발
- 생소한 기술도 공식 문서로 자력 해결
- Native Module 개발 (JS↔Java/Swift 연동)`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch {
    return NextResponse.json(
      { error: "답변을 생성하지 못했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
