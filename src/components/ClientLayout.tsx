"use client";

import { ThemeProvider } from "./ThemeProvider";
import Navigation from "./Navigation";
import ChatBot from "./ChatBot";

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
    </ThemeProvider>
  );
}
