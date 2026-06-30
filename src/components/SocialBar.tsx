"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, FileText, Mail } from "lucide-react";
import { AUTHOR_EMAIL, GITHUB_URL, BLOG_URL } from "@/constants/site";

const SOCIAL_BAR_INITIAL = { opacity: 0, x: -20 } as const;
const SOCIAL_BAR_ANIMATE = { opacity: 1, x: 0 } as const;
const TOOLTIP_INITIAL = { opacity: 0, x: -8 } as const;
const TOOLTIP_ANIMATE = { opacity: 1, x: 0 } as const;
const LINK_HOVER = { scale: 1.15, x: 3 } as const;
const SOCIAL_BAR_TRANSITION = { duration: 0.5, delay: 1 } as const;
const TOOLTIP_TRANSITION = { duration: 0.15 } as const;

const links = [
  { href: GITHUB_URL, icon: Github, label: "GitHub", external: true },
  { href: BLOG_URL, icon: FileText, label: "Blog", external: true },
  { href: `mailto:${AUTHOR_EMAIL}`, icon: Mail, label: "Email", external: false },
];

export default function SocialBar() {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  return (
    <motion.nav
      aria-label="소셜 링크"
      initial={SOCIAL_BAR_INITIAL}
      animate={SOCIAL_BAR_ANIMATE}
      transition={SOCIAL_BAR_TRANSITION}
      className="hidden lg:flex fixed left-5 bottom-1/3 z-40 flex-col items-center gap-3"
    >
      <ul className="flex flex-col items-center gap-3 list-none">
        {links.map(({ href, icon: Icon, label, external }) => (
          <li key={href} className="relative flex items-center">
            <AnimatePresence>
              {hoveredLabel === label && (
                <motion.span
                  initial={TOOLTIP_INITIAL}
                  animate={TOOLTIP_ANIMATE}
                  exit={TOOLTIP_INITIAL}
                  transition={TOOLTIP_TRANSITION}
                  aria-hidden="true"
                  className="absolute right-full mr-2 text-xs font-medium text-foreground bg-section-bg border border-border px-2 py-1 rounded-lg shadow-md whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              aria-label={external ? `${label} (새 탭에서 열림)` : label}
              whileHover={LINK_HOVER}
              onMouseEnter={() => setHoveredLabel(label)}
              onMouseLeave={() => setHoveredLabel(null)}
              onFocus={() => setHoveredLabel(label)}
              onBlur={() => setHoveredLabel(null)}
              className="w-9 h-9 bg-section-bg border border-border hover:border-primary rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shadow-sm"
            >
              <Icon size={15} aria-hidden="true" />
            </motion.a>
          </li>
        ))}
      </ul>
      <div className="w-px h-12 bg-border mt-1" aria-hidden="true" />
    </motion.nav>
  );
}
