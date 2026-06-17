"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center md:text-left"
          >
            <p className="text-foreground font-semibold">
              EunJeong<span className="text-primary">.</span>
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              © {currentYear} 박은정. All rights reserved.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center md:items-end gap-3"
          >
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a
                href="https://github.com/eunjeong-97"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://velog.io/@beanlove97"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Blog
              </a>
              <a
                href="mailto:beanlove97@gmail.com"
                className="hover:text-primary transition-colors"
              >
                Email
              </a>
            </div>
            <p className="text-xs text-muted-foreground/60">
              Built with Next.js · Tailwind CSS · Deployed on Vercel
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
