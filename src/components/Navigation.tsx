"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Moon, Sun, Menu, X, Download, Keyboard } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const navItems = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#github", label: "GitHub" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === "t") toggleTheme();
      if (e.key === "?") setShowShortcuts((prev) => !prev);
      if (e.key === "Escape") { setIsMobileMenuOpen(false); setShowShortcuts(false); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggleTheme]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    navItems.forEach(({ href }) => {
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-section-bg backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      {/* Reading progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
        style={{ scaleX, opacity: scrollYProgress }}
      />
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-3 text-xl font-bold text-foreground"
          whileHover={{ scale: 1.02 }}
        >
          EunJeong<span className="text-primary">.</span>
          <span className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-normal">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Open to Work
          </span>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={`transition-colors text-sm font-medium relative ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Resume Download */}
          <a
            href="/resume.pdf"
            download="박은정_이력서.pdf"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 border border-primary/40 hover:border-primary hover:bg-primary/5 rounded-lg text-xs text-primary transition-colors"
          >
            <Download size={12} />
            이력서
          </a>

          {/* Keyboard shortcut hint */}
          <button
            onClick={() => setShowShortcuts((prev) => !prev)}
            className="hidden lg:flex p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            aria-label="키보드 단축키"
            title="키보드 단축키 (? 키)"
          >
            <Keyboard size={16} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-muted hover:border-border transition-colors"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={18} className="text-yellow-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={18} className="text-primary" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-[289px] md:hidden z-40"
            />
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-section-bg backdrop-blur-md border-b border-border"
            >
              <ul className="flex flex-col py-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.href)}
                        className={`flex items-center gap-3 text-base w-full px-6 py-3 border-l-2 transition-all ${
                          isActive
                            ? "text-primary border-primary bg-primary/5"
                            : "text-muted-foreground hover:text-foreground border-transparent"
                        }`}
                      >
                        {item.label}
                        {isActive && (
                          <span className="ml-auto text-xs text-primary/60 font-mono">●</span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center gap-3 px-6 py-4 border-t border-border">
                <a
                  href="/resume.pdf"
                  download="박은정_이력서.pdf"
                  className="flex-1 flex items-center justify-center gap-2 py-2 border border-primary/40 hover:border-primary hover:bg-primary/5 rounded-lg text-sm text-primary transition-colors"
                >
                  <Download size={14} />
                  이력서 다운로드
                </a>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-muted hover:border-border transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-primary" />}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts panel */}
      <AnimatePresence>
        {showShortcuts && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShortcuts(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="fixed top-20 right-6 z-50 bg-section-bg border border-border rounded-xl shadow-2xl p-4 w-60"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">키보드 단축키</p>
                <button onClick={() => setShowShortcuts(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { key: "C", desc: "AI 도우미 열기/닫기" },
                  { key: "T", desc: "다크/라이트 테마 전환" },
                  { key: "?", desc: "단축키 목록 보기" },
                  { key: "Esc", desc: "닫기" },
                  { key: "← →", desc: "경험 이전/다음 이동" },
                ].map(({ key, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{desc}</span>
                    <kbd className="text-[10px] font-mono bg-muted border border-border px-1.5 py-0.5 rounded text-foreground flex-shrink-0">{key}</kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
