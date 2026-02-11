"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-neutral-500 text-sm"
        >
          © {currentYear} 박은정. All rights reserved.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-6 text-sm text-neutral-500"
        >
          <a
            href="https://github.com/eunjeong-97"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://velog.io/@beanlove97"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Blog
          </a>
          <a
            href="mailto:beanlove97@gmail.com"
            className="hover:text-white transition-colors"
          >
            Email
          </a>
        </motion.div>
      </div>
    </footer>
  );
}
