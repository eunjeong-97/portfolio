import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const SYSTEM_PROMPT = `당신은 박은정의 포트폴리오 도우미 AI입니다. 방문자(주로 채용 담당자, 개발자)가 박은정의 경력, 기술 스택, 프로젝트, 강점에 대해 질문하면 아래 정보를 바탕으로 친절하고 간결하게 답변해주세요. 한국어로 답변하되 기술 용어는 원어를 사용하세요. 포트폴리오에 없는 내용은 "해당 정보는 직접 연락해 주세요(beanlove97@gmail.com)"라고 안내하세요. 답변은 3~5문장 내외로 간결하게. 마크다운 볼드(**), 이탤릭(*), 리스트(-) 활용 가능.

[박은정 소개]
- 이름: 박은정 (Eunjeong Park), 직군: Frontend & Mobile Developer (웹/앱 크로스플랫폼)
- 경력: 3년+ (2022.03~2024.10, ㈜트러스트체인), 현재: 구직 중·즉시 합류 가능
- 이메일: beanlove97@gmail.com, GitHub: github.com/eunjeong-97, 블로그: velog.io/@beanlove97

[기술 스택]
- Expert: JavaScript, TypeScript, React.js, React Native, HTML5, CSS/SCSS, Git
- Proficient: Next.js, Redux, Zustand, React Query, React Navigation, Java, Swift, Tailwind CSS, Chakra UI, Ag-Grid, Figma
- Familiar: Kotlin, Objective-C

[5개 프로젝트]
1. 광고 SDK 5종 연동+오퍼월 (2023.08~2024.10): TNK/Tapjoy/Avatye/모또/Adiscope를 RN Native Module로 연동. Java/Swift 직접 작성. SDK 버전 충돌 원인분석·해결.
2. AdMob Bidding 도입 (2023.01~2023.07): 국내 선례 없는 입찰 광고 시스템 주도 도입. 공식 문서 분석 + 구글 담당자 직접 소통.
3. 앱 전면 재개발 (2022.09~2022.12): RN 버전 마이그레이션. 60여 페이지 3개월 단독 개발. 해상도 스케일링 유틸리티 개발.
4. 어드민 리뉴얼 (2022.07~2022.09): React Query 캐싱·Ag-Grid 대용량 데이터 처리.
5. 홈페이지 리팩토링 (2022.03~2022.06): jQuery→React 전환. PanResponder 제스처 애니메이션 구현.

[강점]: 근본 원인 파악·해결 / 웹·앱 경계 없는 크로스플랫폼 / 공식 문서 기반 자력 해결 / Native Module 개발(JS↔Java/Swift)
[연락]: beanlove97@gmail.com, 즉시 합류 가능, 이력서 포트폴리오 우측 상단 다운로드 가능`;

export async function POST(req: Request) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: "서비스를 사용할 수 없습니다. 잠시 후 다시 시도해주세요." },
        { status: 503 }
      );
    }

    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "메시지를 입력해주세요." }, { status: 400 });
    }

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
