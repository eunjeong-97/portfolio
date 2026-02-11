import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "박은정 | Frontend Developer",
  description:
    "웹과 앱을 넘나드는 크로스플랫폼 프론트엔드 개발자 박은정의 포트폴리오입니다.",
  keywords: ["프론트엔드", "개발자", "React", "React Native", "포트폴리오"],
  authors: [{ name: "박은정" }],
  openGraph: {
    title: "박은정 | Frontend Developer",
    description: "웹과 앱을 넘나드는 크로스플랫폼 프론트엔드 개발자",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
