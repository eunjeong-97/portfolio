export interface Experience {
  id: string;
  period: string;
  title: string;
  description: string;
  details: string[];
  tags: string[];
  videoUrl?: string;
}

export const experiences: Experience[] = [
  {
    id: "sdk-integration",
    period: "2023.08 - 2024.10",
    title: "앱 광고 및 서드파티 연동",
    description:
      "TNK, Tapjoy 등 다양한 광고사의 오퍼월 SDK를 연동하여 추가 수익 구조를 구축.\nNative Module 개발로 JavaScript와 네이티브 코드 연결.",
    details: [
      "구글 애드몹을 통해 수익 창출 가능성을 확인한 후, 유저가 광고를 시청하고 보상을 받을 수 있는 오퍼월 기능 구현",
      "연동한 SDK 광고업체: TNK, Tapjoy, Avatye, 모또, Adiscope",
      "광고 업체에서 제공하는 Java(Kotlin), Objective-C(Swift) 언어로 작성된 SDK 연동 가이드에 따라 NativeModule 개발",
      "각 광고사의 SDK 연동 시 발생하는 라이브러리 버전 충돌 문제 해결",
    ],
    tags: [
      "React Native",
      "Native Module",
      "SDK Integration",
      "Java/Kotlin",
      "Swift",
    ],
    videoUrl:
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/ac994adc-23ab-495b-9ad1-c7168d2840bc/863b6301-d7ba-428b-9cb1-5910d6b4d77c/캐시버튼.mp4",
  },
  {
    id: "admob-bidding",
    period: "2023.01 - 2023.07",
    title: "애드몹 입찰 광고 도입",
    description:
      "광고 소스 부족 문제 해결을 위해 여러 광고 업체의 소스를 통합하는 입찰 광고 도입.\n공식 문서와 구글 담당자 피드백으로 문제 해결.",
    details: [
      "기존 구글 애드몹 플랫폼의 배너/동영상 광고 외에 추가 수익화를 위한 입찰 광고 도입",
      "스택오버플로우나 블로그에서 실제 개발자 사례를 찾기 어려운 생소한 분야였지만, 공식 문서와 구글 담당자 피드백으로 해결",
      "기존 앱의 JavaScript 로직을 네이티브 코드로 변환하는 라이브러리 코드 분석 및 설정 적용",
    ],
    tags: ["Google AdMob", "Bidding", "Revenue Optimization"],
    videoUrl:
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/ac994adc-23ab-495b-9ad1-c7168d2840bc/3a968997-4019-49f3-9f36-807f43bad8b1/애드몹.mp4",
  },
  {
    id: "app-rebuild",
    period: "2022.09 - 2022.12",
    title: "마일벌스 앱 전면 재개발",
    description:
      "React Native 라이브러리 버전 업그레이드를 위한 새 프로젝트 설정.\n3개월간 60여 개 페이지 프론트엔드 개발 주도.",
    details: [
      "기존 마일벌스 앱의 React Native 라이브러리 버전 업그레이드를 위해 새로운 프로젝트 설정",
      "3개월 동안 60여 개의 페이지에 적용된 새로운 디자인을 바탕으로 프론트엔드 개발 주도",
      "기존 코드 마이그레이션, 코드 구조 최적화, 불필요한 모듈 제거 등 전반적인 리팩토링",
      "디바이스 해상도에 따라 스케일링 처리를 자동화하는 유틸리티 함수 개발",
    ],
    tags: ["React Native", "Migration", "Refactoring", "60+ Pages"],
  },
  {
    id: "admin-renewal",
    period: "2022.07 - 2022.09",
    title: "마일벌스 어드민 리뉴얼",
    description:
      "React Query를 사용한 서버 데이터 캐싱 처리로 응답 속도 향상.\nAg-Grid로 수만 건의 데이터 필터링, 페이징, 정렬 기능 구현.",
    details: [
      "앱 사용자 수 증가에 따른 서버 데이터 처리 최적화를 위한 리뉴얼 작업 참여",
      "React Query를 사용하여 서버 데이터 캐싱 처리, 불필요한 재요청 최소화",
      "Ag-Grid 라이브러리를 활용해 수만 건의 데이터 필터링, 페이징, 정렬 기능 추가",
      "UI 라이브러리를 활용한 일관성 있는 디자인 시스템 구축",
    ],
    tags: ["React.js", "React Query", "Ag-Grid", "Chakra UI"],
  },
  {
    id: "homepage-refactoring",
    period: "2022.03 - 2022.06",
    title: "마일벌스 앱 내부 기능 추가 · 홈페이지 리팩토링",
    description:
      "HTML, CSS, jQuery로 작성된 기존 홈페이지를 리팩토링.\n컴포넌트 기반 아키텍처 도입과 반응형 레이아웃 적용.",
    details: [
      "기존 홈페이지를 컴포넌트 기반 아키텍처로 리팩토링, UI 요소 독립적 분리",
      "반응형 레이아웃 적용으로 모바일과 데스크탑 환경의 사용자 경험 향상",
      "useNavigationState 훅을 활용해 Stack 라우터의 여러 페이지 상태 일관성 있게 관리",
      "PanResponder와 Animated API를 활용한 slide down/up 제스처 애니메이션 직접 구현",
    ],
    tags: ["React.js", "React Native", "PanResponder", "Animated API"],
  },
];
