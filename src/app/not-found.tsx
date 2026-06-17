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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg w-full"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
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
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.15 }}
              className={`${line.color} leading-relaxed`}
            >
              {line.text}
            </motion.div>
          ))}
          <motion.span
            className="inline-block w-2 h-4 bg-primary ml-0.5 mt-1"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
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
