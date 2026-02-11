# 박은정 포트폴리오

프론트엔드 개발자 박은정의 포트폴리오 웹사이트입니다.

## 🛠 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 프로덕션 빌드

```bash
npm run build
npm run start
```

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── globals.css      # 전역 스타일
│   ├── layout.tsx       # 루트 레이아웃
│   └── page.tsx         # 메인 페이지
├── components/
│   ├── Navigation.tsx   # 네비게이션 (다크모드 토글 포함)
│   ├── Hero.tsx         # 히어로 섹션
│   ├── About.tsx        # 소개 섹션
│   ├── Skills.tsx       # 기술 스택 섹션
│   ├── ExperienceTimeline.tsx  # 경력 타임라인
│   ├── ExperienceModal.tsx     # 경력 상세 모달
│   ├── Contact.tsx      # 연락처 섹션
│   ├── Footer.tsx       # 푸터
│   └── ThemeProvider.tsx # 다크모드 컨텍스트
└── data/
    └── experiences.ts   # 경력 데이터
```

## ✨ 기능

- ✅ 반응형 디자인 (모바일/태블릿/데스크탑)
- ✅ 다크모드/라이트모드 토글
- ✅ 스크롤 기반 애니메이션 (Framer Motion)
- ✅ 프로젝트 상세 모달
- ✅ 실행 영상 임베드

## 🎨 커스터마이징

### 프로필 이미지 추가

1. 프로필 이미지를 `public/profile.jpg`로 저장
2. `src/components/Hero.tsx`에서 placeholder 부분을 주석 처리하고 Image 컴포넌트 주석 해제

### 경력 데이터 수정

`src/data/experiences.ts` 파일에서 경력 정보를 수정할 수 있습니다.

### 색상 변경

`tailwind.config.ts`의 `colors.primary`를 원하는 색상으로 변경하세요.

## 🚀 Vercel 배포

1. [Vercel](https://vercel.com)에 GitHub 저장소 연결
2. 자동으로 빌드 및 배포됩니다
3. 커스텀 도메인 설정 (선택사항)

```bash
# Vercel CLI로 배포하는 경우
npm i -g vercel
vercel
```

## 📝 라이센스

MIT License
