"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";

const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [CIRCUMFERENCE, 0]);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 z-40 w-10 h-10 bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-full flex items-center justify-center transition-colors shadow-lg"
          aria-label="맨 위로 이동"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 36 36"
            aria-hidden="true"
          >
            <circle
              cx="18" cy="18" r={RADIUS}
              fill="none"
              strokeWidth="2"
              style={{ stroke: "var(--border)" }}
            />
            <motion.circle
              cx="18" cy="18" r={RADIUS}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                stroke: "var(--primary)",
                strokeDasharray: CIRCUMFERENCE,
                strokeDashoffset,
              }}
            />
          </svg>
          <ArrowUp size={16} className="relative z-10" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
