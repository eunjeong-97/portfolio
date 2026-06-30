"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";

const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TRACK_STYLE = { stroke: "var(--border)" } as const;
const BTN_INITIAL = { opacity: 0, y: 10 } as const;
const BTN_ANIMATE = { opacity: 1, y: 0 } as const;
const BTN_HOVER = { scale: 1.05 } as const;
const BTN_TAP = { scale: 0.95 } as const;
const BTN_TRANSITION = { duration: 0.2 } as const;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [CIRCUMFERENCE, 0]);

  useEffect(() => {
    setVisible(window.scrollY > 400);
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={BTN_INITIAL}
          animate={BTN_ANIMATE}
          exit={BTN_INITIAL}
          transition={BTN_TRANSITION}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 z-40 w-10 h-10 bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-full flex items-center justify-center transition-colors shadow-lg"
          aria-label="맨 위로 이동"
          whileHover={BTN_HOVER}
          whileTap={BTN_TAP}
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
              style={TRACK_STYLE}
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
