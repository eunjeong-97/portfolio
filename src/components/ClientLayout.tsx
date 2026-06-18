"use client";

import { motion, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import { ThemeProvider } from "./ThemeProvider";
import Navigation from "./Navigation";
import ReadingProgress from "./ReadingProgress";

const LAYOUT_INITIAL = { opacity: 0 } as const;
const LAYOUT_ANIMATE = { opacity: 1 } as const;
const LAYOUT_TRANSITION = { duration: 0.4 } as const;

const ChatBot = dynamic(() => import("./ChatBot"), { ssr: false });
const ScrollToTop = dynamic(() => import("./ScrollToTop"), { ssr: false });
const KeyboardShortcuts = dynamic(() => import("./KeyboardShortcuts"), { ssr: false });
const SectionDots = dynamic(() => import("./SectionDots"), { ssr: false });
const SocialBar = dynamic(() => import("./SocialBar"), { ssr: false });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none"
      >
        메인 콘텐츠로 이동
      </a>
      <ReadingProgress />
      <Navigation />
      <motion.div
        initial={LAYOUT_INITIAL}
        animate={LAYOUT_ANIMATE}
        transition={LAYOUT_TRANSITION}
      >
        {children}
      </motion.div>
      <SocialBar />
      <ChatBot />
      <ScrollToTop />
      <SectionDots />
      <KeyboardShortcuts />
      </MotionConfig>
    </ThemeProvider>
  );
}
