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
      <ReadingProgress />
      <Navigation />
      {children}
      <ChatBot />
      <ScrollToTop />
    </ThemeProvider>
  );
}
