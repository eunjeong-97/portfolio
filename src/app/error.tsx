"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6" aria-hidden="true">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <h2 className="text-2xl font-bold mb-3">오류가 발생했습니다</h2>
        <p className="text-muted-foreground mb-8">
          페이지를 불러오는 중 문제가 발생했습니다.
          <br />
          다시 시도하거나 잠시 후 방문해주세요.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light rounded-lg font-medium transition-colors text-white"
        >
          <RefreshCw size={16} aria-hidden="true" />
          다시 시도
        </button>
      </motion.div>
    </div>
  );
}
