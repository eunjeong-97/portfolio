"use client";

import { ThemeProvider } from "./ThemeProvider";
import Navigation from "./Navigation";
import ChatBot from "./ChatBot";
import ScrollToTop from "./ScrollToTop";
import ReadingProgress from "./ReadingProgress";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none"
      >
        메인 콘텐츠로 이동
      </a>
      <ReadingProgress />
      <Navigation />
      <div id="main-content">{children}</div>
      <ChatBot />
      <ScrollToTop />
    </ThemeProvider>
  );
}
