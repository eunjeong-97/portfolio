"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";

const errorLines = [
  { text: "$ navigate /requested-page", color: "text-muted-foreground" },
  { text: "Error: Route not found (404)", color: "text-red-400" },
  { text: "$ searching for alternative routes...", color: "text-muted-foreground" },
  { text: "→ Found: /  (portfolio home)", color: "text-green-400" },
];

const NOTFOUND_INITIAL = { opacity: 0, y: 30 } as const;
const NOTFOUND_ANIMATE = { opacity: 1, y: 0 } as const;
const SCALE_UP_INITIAL = { scale: 0.8, opacity: 0 } as const;
const SCALE_UP_ANIMATE = { scale: 1, opacity: 1 } as const;
const TERMINAL_INITIAL = { opacity: 0, y: 10 } as const;
const TERMINAL_ANIMATE = { opacity: 1, y: 0 } as const;
const LINE_INITIAL = { opacity: 0, x: -10 } as const;
const LINE_ANIMATE_IN = { opacity: 1, x: 0 } as const;
const CURSOR_BLINK_ANIM = { opacity: [1, 0] };
const CURSOR_BLINK_TRANSITION = { duration: 0.8, repeat: Infinity } as const;
const NOTFOUND_TRANSITION = { duration: 0.5 } as const;
const SCALE_UP_TRANSITION = { duration: 0.4 } as const;
const TERMINAL_TRANSITION = { duration: 0.4, delay: 0.2 } as const;

const GRADIENT_404_STYLE = {
  background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  opacity: 0.25,
} as const;

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={NOTFOUND_INITIAL}
        animate={NOTFOUND_ANIMATE}
        transition={NOTFOUND_TRANSITION}
        className="text-center max-w-lg w-full"
      >
        <motion.div
          initial={SCALE_UP_INITIAL}
          animate={SCALE_UP_ANIMATE}
          transition={SCALE_UP_TRANSITION}
          aria-hidden="true"
          className="text-8xl md:text-[10rem] font-bold leading-none mb-4 select-none"
          style={GRADIENT_404_STYLE}
        >
          404
        </motion.div>

        <h1 className="text-2xl font-bold mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          찾고 계신 페이지가 존재하지 않거나 이동된 것 같습니다.
        </p>

        {/* Terminal-style error card */}
        <motion.div
          initial={TERMINAL_INITIAL}
          animate={TERMINAL_ANIMATE}
          transition={TERMINAL_TRANSITION}
          aria-hidden="true"
          className="bg-card border border-border rounded-xl p-4 mb-8 text-left font-mono text-sm"
        >
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <Terminal size={12} className="text-muted-foreground ml-auto" />
          </div>
          {errorLines.map((line, i) => (
            <motion.div
              key={i}
              initial={LINE_INITIAL}
              animate={LINE_ANIMATE_IN}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.15 }}
              className={`${line.color} leading-relaxed`}
            >
              {line.text}
            </motion.div>
          ))}
          <motion.span
            className="inline-block w-2 h-4 bg-primary ml-0.5 mt-1 motion-reduce:animate-none"
            animate={CURSOR_BLINK_ANIM}
            transition={CURSOR_BLINK_TRANSITION}
          />
        </motion.div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors font-medium"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          홈으로 돌아가기
        </Link>
      </motion.div>
    </main>
  );
}
