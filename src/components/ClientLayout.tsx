"use client";

import { ThemeProvider } from "./ThemeProvider";
import Navigation from "./Navigation";
import ChatBot from "./ChatBot";
import ScrollToTop from "./ScrollToTop";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Navigation />
      {children}
      <ChatBot />
      <ScrollToTop />
    </ThemeProvider>
  );
}
