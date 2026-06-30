"use client";

import { useScroll, useSpring, motion } from "framer-motion";

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent pointer-events-none" aria-hidden="true">
      <motion.div
        className="h-full bg-primary origin-left"
        style={{ scaleX }}
      />
    </div>
  );
}
