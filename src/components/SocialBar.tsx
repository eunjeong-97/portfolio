"use client";

import { motion } from "framer-motion";
import { Github, FileText, Mail } from "lucide-react";

const links = [
  { href: "https://github.com/eunjeong-97", icon: Github, label: "GitHub", external: true },
  { href: "https://velog.io/@beanlove97", icon: FileText, label: "Blog", external: true },
  { href: "mailto:beanlove97@gmail.com", icon: Mail, label: "Email", external: false },
];

export default function SocialBar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="hidden lg:flex fixed left-5 bottom-1/3 z-40 flex-col items-center gap-3"
    >
      {links.map(({ href, icon: Icon, label, external }) => (
        <motion.a
          key={href}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={label}
          whileHover={{ scale: 1.15, x: 3 }}
          className="w-9 h-9 bg-section-bg border border-border hover:border-primary rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shadow-sm"
        >
          <Icon size={15} />
        </motion.a>
      ))}
      <div className="w-px h-12 bg-border mt-1" />
    </motion.div>
  );
}
