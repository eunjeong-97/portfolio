import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = "https://eunjeong.vercel.app";

const JSONLD_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "박은정 포트폴리오",
      description: "React · React Native로 웹과 앱을 함께 개발하는 크로스플랫폼 개발자 박은정의 포트폴리오",
      inLanguage: "ko",
      author: { "@id": `${BASE_URL}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${BASE_URL}/#webpage`,
      url: BASE_URL,
      name: "박은정 | Frontend & Mobile Developer",
      isPartOf: { "@id": `${BASE_URL}/#website` },
      about: { "@id": `${BASE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: "박은정",
      alternateName: "Eunjeong Park",
      jobTitle: "Frontend & Mobile Developer",
      description: "React · React Native로 웹과 앱을 함께 개발하는 크로스플랫폼 개발자. SDK 연동, 네이티브 모듈, 크로스플랫폼 개발 경험 3년+.",
      email: "beanlove97@gmail.com",
      url: BASE_URL,
      image: `${BASE_URL}/opengraph-image`,
      sameAs: [
        "https://github.com/eunjeong-97",
        "https://velog.io/@beanlove97",
      ],
      knowsAbout: [
        "React",
        "React Native",
        "TypeScript",
        "Next.js",
        "JavaScript",
        "Native Module",
        "SDK Integration",
        "Java",
        "Swift",
      ],
      worksFor: {
        "@type": "Organization",
        name: "㈜트러스트체인",
        endDate: "2024-10",
      },
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "박은정 | Frontend & Mobile Developer",
  description:
    "React · React Native로 웹과 앱을 함께 개발하는 프론트엔드 개발자 박은정의 포트폴리오입니다. SDK 연동, 네이티브 모듈, 크로스플랫폼 개발 경험 보유.",
  keywords: [
    "프론트엔드 개발자",
    "React",
    "React Native",
    "TypeScript",
    "Next.js",
    "크로스플랫폼",
    "포트폴리오",
    "박은정",
    "SDK 연동",
    "모바일 개발",
    "Native Module",
    "구직",
  ],
  authors: [{ name: "박은정" }],
  creator: "박은정",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "박은정 | Frontend & Mobile Developer",
    description:
      "React · React Native로 웹과 앱을 함께 개발합니다. SDK 연동부터 네이티브 코드까지 직접 다루는 크로스플랫폼 개발자.",
    type: "website",
    url: BASE_URL,
    siteName: "박은정 포트폴리오",
    locale: "ko_KR",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "박은정 | Frontend & Mobile Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "박은정 | Frontend & Mobile Developer",
    description:
      "React · React Native로 웹과 앱을 함께 개발하는 크로스플랫폼 개발자.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f5f5f5" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.classList.add(t||'dark');}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSONLD_SCHEMA }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
