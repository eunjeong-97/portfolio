"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";

const sections = [
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "github", label: "GitHub" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

const SECTION_IDS = sections.map((s) => s.id);

export default function SectionDots() {
  const activeSection = useActiveSection(SECTION_IDS);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
      {sections.map(({ id, label }) => {
        const isActive = activeSection === id;
        return (
          <button
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(id)}
            onBlur={() => setHovered(null)}
            aria-label={`${label} 섹션으로 이동`}
            aria-current={isActive ? "location" : undefined}
            className="relative flex items-center justify-end group"
          >
            {/* Label tooltip */}
            <AnimatePresence>
              {hovered === id && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  aria-hidden="true"
                  className="mr-2 text-xs font-medium text-foreground bg-section-bg border border-border px-2 py-1 rounded-lg shadow-md whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Dot */}
            <motion.div
              aria-hidden="true"
              animate={{
                width: isActive ? 20 : 6,
                height: isActive ? 6 : 6,
              }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={`rounded-full transition-colors ${
                isActive ? "bg-primary" : "bg-border hover:bg-primary/50"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
