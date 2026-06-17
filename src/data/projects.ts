export interface Project {
  id: string;
  title: string;
  period: string;
  problem: string;
  role: string;
  decision: string;
  impact: string;
  tags: string[];
  highlights: string[];
}

export const projects: Project[] = [
  {
    id: "app-rebuild",
    title: "마일벌스 앱 전면 재개발",
    period: "2022.09 - 2022.12 · 3개월",
    problem: "React Native 버전 노후화로 최신 라이브러리 업그레이드가 불가능해진 앱을 전면 재개발해야 했습니다.",
    role: "새 프로젝트 환경 설정부터 60여 개 페이지 프론트엔드 개발을 3개월간 혼자 주도했습니다.",
    decision: "단순 코드 이전이 아닌 불필요한 모듈 제거와 구조 전반 리팩토링을 병행해 유지보수성을 높였습니다. 다양한 디바이스 해상도 문제를 해결하기 위해 자동 스케일링 유틸리티도 직접 개발했습니다.",
    impact: "3개월 내 60+ 페이지 완료, 최신 RN 환경 마이그레이션 성공, 팀 전체가 사용하는 해상도 유틸리티 공통 적용",
    tags: ["React Native", "TypeScript", "Migration", "Refactoring"],
    highlights: ["60+ 페이지 단독 개발", "3개월 완료", "해상도 유틸리티 개발"],
  },
  {
    id: "sdk-integration",
    title: "광고 SDK 5종 연동 및 오퍼월 구현",
    period: "2023.08 - 2024.10 · 약 1년",
    problem: "단일 광고 소스(애드몹)에 의존하던 앱의 수익 한계를 해결하기 위해 다수의 광고사 SDK 연동이 필요했습니다.",
    role: "TNK, Tapjoy, Avatye, 모또, Adiscope 5개 광고사 SDK를 Native Module 방식으로 직접 연동하고, 유저가 광고를 시청하고 보상받는 오퍼월 시스템을 설계·구현했습니다.",
    decision: "각 SDK의 Android(Java/Kotlin), iOS(Swift) 네이티브 가이드를 직접 분석해 React Native Native Module을 작성했습니다. SDK 간 라이브러리 버전 충돌은 네이티브 레이어에서 원인을 파악하고 호환 설정으로 해결했습니다.",
    impact: "5개 광고사 연동 완료로 광고 소스 다변화, 오퍼월 기능을 통한 새로운 수익 채널 확보",
    tags: ["React Native", "Native Module", "Java/Kotlin", "Swift", "SDK Integration"],
    highlights: ["5개 광고사 연동", "네이티브 모듈 직접 작성", "iOS · Android 동시 대응"],
  },
  {
    id: "admob-bidding",
    title: "AdMob Bidding 시스템 도입",
    period: "2023.01 - 2023.07 · 7개월",
    problem: "단일 광고 소스로 인한 광고 매칭률 저하와 낮은 eCPM 문제를 해결해야 했습니다.",
    role: "국내 개발 사례가 거의 없는 AdMob Bidding 시스템 도입을 주도하고, 기술적 이슈를 자력으로 해결했습니다.",
    decision: "스택오버플로우나 블로그에서 실제 구현 사례를 찾기 어려운 상황에서, 공식 문서를 직접 분석하고 구글 담당자에게 이메일로 직접 소통하여 설정 이슈를 해결했습니다. JS 광고 로직의 네이티브 변환 라이브러리 내부 코드도 직접 분석했습니다.",
    impact: "여러 광고사 실시간 경쟁 입찰 도입으로 광고 소스 다양화, 광고 매칭률 및 수익성 개선 기여",
    tags: ["Google AdMob", "Bidding", "React Native", "Revenue Optimization"],
    highlights: ["국내 선례 없는 기술 자력 도입", "구글 담당자 직접 소통", "광고 수익성 개선"],
  },
];
