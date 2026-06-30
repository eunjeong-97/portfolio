export interface Experience {
  id: string;
  period: string;
  title: string;
  description: string;
  details: readonly string[];
  tags: readonly string[];
  videoUrl?: string;
}

export const experiences: Experience[] = [
  {
    id: "sdk-integration",
    period: "2023.08 - 2024.10",
    title: "앱 광고 및 서드파티 연동",
    description:
      "광고 수익 다변화를 위해 5개 광고사 SDK를 직접 연동. 생소한 네이티브 모듈 개발 영역에서 공식 문서와 직접 소통으로 문제를 해결하며 오퍼월 수익 채널을 구축했습니다.",
    details: [
      "앱 수익이 단일 광고 소스(애드몹)에 의존하는 한계를 해결하기 위해, 유저가 광고를 시청하고 보상받는 오퍼월 시스템 직접 설계 및 구현",
      "TNK, Tapjoy, Avatye, 모또, Adiscope 5개 광고사 SDK를 각각 분석하여 React Native Native Module로 연동 — Java(Android), Swift(iOS) 네이티브 레이어 직접 작성",
      "SDK간 라이브러리 버전 충돌 문제를 네이티브 코드 레벨에서 원인을 파악하고 해결 — 단순 라이브러리 교체가 아닌 충돌 원인 분석 후 호환 버전 설정",
      "5개 광고사 연동 완료로 광고 소스 다변화 달성, 오퍼월 기능을 통한 추가 수익 채널 확보",
    ],
    tags: [
      "React Native",
      "Native Module",
      "SDK Integration",
      "Java/Kotlin",
      "Swift",
    ],
    videoUrl:
      "https://res.cloudinary.com/dng2kkpf9/video/upload/v1770838521/%E1%84%8B%E1%85%A2%E1%84%83%E1%85%B3%E1%84%86%E1%85%A9%E1%86%B8_dipi2h.mp4",
  },
  {
    id: "admob-bidding",
    period: "2023.01 - 2023.07",
    title: "애드몹 입찰 광고 도입",
    description:
      "광고 매칭률 한계를 해결하기 위해 여러 광고사가 경쟁 입찰하는 Bidding 시스템 도입 주도. 국내 개발 사례가 거의 없는 영역에서 공식 문서와 구글 담당자 직접 소통으로 문제를 해결했습니다.",
    details: [
      "단일 광고 소스의 한계(광고 미노출, 낮은 eCPM)를 해결하기 위해 여러 광고사가 실시간 경쟁 입찰하는 AdMob Bidding 시스템 도입 제안 및 구현",
      "국내 스택오버플로우나 블로그에서 실제 구현 사례를 찾기 어려운 생소한 분야 — 공식 문서를 직접 분석하고 구글 담당자와 이메일 소통을 통해 설정 이슈 해결",
      "기존 앱의 JavaScript 광고 로직을 네이티브 코드로 변환하는 라이브러리 내부 코드를 직접 분석하여 설정 최적화",
      "입찰 경쟁 도입으로 광고 소스 다양화, 광고 매칭률 개선을 통한 수익성 향상 기여",
    ],
    tags: ["Google AdMob", "Bidding", "Revenue Optimization"],
  },
  {
    id: "app-rebuild",
    period: "2022.09 - 2022.12",
    title: "마일벌스 앱 전면 재개발",
    description:
      "노후화된 React Native 버전으로 라이브러리 업그레이드가 불가능해진 앱을 3개월간 전면 재개발. 60여 개 페이지 프론트엔드를 혼자 주도하며 해상도 자동 스케일링 유틸리티도 직접 개발했습니다.",
    details: [
      "기존 앱의 RN 버전 노후화로 최신 라이브러리 사용이 불가능한 상황 — 전면 재개발 결정 후 새 프로젝트 환경 설정부터 직접 담당",
      "3개월 동안 새로운 디자인이 적용된 60여 개 페이지 프론트엔드 개발 주도 (혼자 담당)",
      "기존 코드를 그대로 이전하는 것이 아닌, 불필요한 모듈 제거 및 코드 구조 전반 리팩토링으로 유지보수성 개선",
      "다양한 디바이스 해상도에서 UI가 깨지는 문제를 해결하기 위해 디바이스 해상도에 따른 자동 스케일링 유틸리티 함수 직접 개발하여 팀 공통 적용",
    ],
    tags: ["React Native", "Migration", "Refactoring", "60+ Pages"],
  },
  {
    id: "admin-renewal",
    period: "2022.07 - 2022.09",
    title: "마일벌스 어드민 리뉴얼",
    description:
      "사용자 수 증가로 인한 서버 부하와 대용량 데이터 처리 문제를 React Query와 Ag-Grid 도입으로 해결. 불필요한 서버 재요청을 최소화하고 수만 건 데이터의 실시간 필터링·정렬 기능을 구현했습니다.",
    details: [
      "앱 사용자 수 증가에 따라 어드민에서 동일 데이터를 반복 요청하는 성능 이슈 발생 — React Query 도입으로 서버 데이터 캐싱 처리, 불필요한 재요청 최소화",
      "수만 건의 사용자/거래 데이터를 브라우저에서 빠르게 처리하기 위해 Ag-Grid 도입 — 필터링, 페이징, 정렬 기능 직접 구현",
      "Chakra UI 기반 일관된 디자인 시스템 구축으로 어드민 UI 통일성 확보",
      "React Query 캐싱으로 서버 재요청 횟수 감소, Ag-Grid로 대용량 데이터 처리 성능 확보",
    ],
    tags: ["React.js", "React Query", "Ag-Grid", "Chakra UI"],
  },
  {
    id: "homepage-refactoring",
    period: "2022.03 - 2022.06",
    title: "마일벌스 앱 내부 기능 추가 · 홈페이지 리팩토링",
    description:
      "HTML/CSS/jQuery로 작성된 레거시 홈페이지를 React.js로 리팩토링하고, 앱에 제스처 기반 인터랙션을 직접 구현. 컴포넌트 기반 아키텍처 전환으로 유지보수성을 크게 향상시켰습니다.",
    details: [
      "jQuery 기반 레거시 홈페이지의 유지보수 어려움을 해결하기 위해 React.js 컴포넌트 기반 아키텍처로 전면 리팩토링 — UI 요소를 독립적으로 분리하여 재사용성 확보",
      "반응형 레이아웃 적용으로 모바일·데스크탑 환경 모두에서 일관된 사용자 경험 제공",
      "앱 내 여러 Stack 화면의 라우터 상태를 일관되게 관리하기 위해 useNavigationState 훅 직접 활용한 상태 관리 구현",
      "라이브러리 없이 React Native의 PanResponder와 Animated API를 활용해 slide down/up 제스처 애니메이션 직접 구현 — 네이티브 수준의 인터랙션 제공",
    ],
    tags: ["React.js", "React Native", "PanResponder", "Animated API"],
  },
];
