"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="text-8xl md:text-9xl font-bold text-primary/20 mb-2 select-none">
          404
        </div>
        <h1 className="text-2xl font-bold mb-3">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          찾고 계신 페이지가 존재하지 않거나 이동된 것 같습니다.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          홈으로 돌아가기
        </Link>
      </motion.div>
    </main>
  );
}
