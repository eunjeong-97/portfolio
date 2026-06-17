import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const BASE_URL = "https://eunjeong.vercel.app";

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
        url: "/og-image.png",
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
    images: ["/og-image.png"],
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
        <meta name="theme-color" content="#0a0a0a" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.classList.add(t||'dark');}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "박은정",
              jobTitle: "Frontend & Mobile Developer",
              email: "beanlove97@gmail.com",
              url: BASE_URL,
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
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
