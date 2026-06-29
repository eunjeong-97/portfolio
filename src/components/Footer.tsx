"use client";

import { Github, FileText, Mail, Download } from "lucide-react";
import { scrollToId } from "@/utils/scrollTo";
import { AUTHOR_NAME, AUTHOR_EMAIL, GITHUB_URL, BLOG_URL, RESUME_FILENAME } from "@/constants/site";

const navLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

const socialLinks = [
  { href: GITHUB_URL, label: "GitHub", icon: Github, external: true },
  { href: BLOG_URL, label: "Blog", icon: FileText, external: true },
  { href: `mailto:${AUTHOR_EMAIL}`, label: "Email", icon: Mail, external: false },
];

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border" aria-label="사이트 하단 정보">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="text-foreground font-bold text-lg mb-2">
              EunJeong<span className="text-primary">.</span>
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              웹과 앱을 함께 다루는<br />
              크로스플랫폼 개발자입니다.
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse motion-reduce:animate-none" aria-hidden="true" />
              <span className="text-xs text-green-400">현재 구직 중</span>
            </div>
          </div>

          {/* Quick Nav */}
          <nav aria-label="빠른 이동">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Navigation</p>
            <ul className="grid grid-cols-2 gap-1.5">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => { e.preventDefault(); scrollToId(href.slice(1)); }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Links */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Links</p>
            <ul className="space-y-2">
              {socialLinks.map(({ href, label, icon: Icon, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <Icon size={13} className="text-muted-foreground/50 group-hover:text-primary transition-colors" aria-hidden="true" />
                    {label}
                    {external && <span className="sr-only">(새 탭에서 열림)</span>}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/resume.pdf"
                  download={RESUME_FILENAME}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Download size={13} className="text-muted-foreground/50 group-hover:text-primary transition-colors" aria-hidden="true" />
                  이력서 다운로드
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-muted-foreground text-sm">
            © {CURRENT_YEAR} {AUTHOR_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built with Next.js · Tailwind CSS · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
