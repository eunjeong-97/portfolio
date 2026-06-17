"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Download } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useFocusTrap } from "@/hooks/useFocusTrap";

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
  const firstMobileMenuItemRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasMenuOpenRef = useRef(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useFocusTrap(mobileMenuRef, isMobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    if (isMobileMenuOpen) {
      wasMenuOpenRef.current = true;
      setTimeout(() => firstMobileMenuItemRef.current?.focus(), 100);
    } else if (wasMenuOpenRef.current) {
      menuButtonRef.current?.focus();
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === "t") toggleTheme();
      if (e.key === "Escape") setIsMobileMenuOpen(false);
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
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-3 text-xl font-bold text-foreground"
          whileHover={{ scale: 1.02 }}
        >
          EunJeong<span className="text-primary">.</span>
          <span className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-normal">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
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
                    aria-current={isActive ? "location" : undefined}
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
                        aria-hidden="true"
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
            <Download size={12} aria-hidden="true" />
            이력서
          </a>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-muted hover:border-border transition-colors"
            aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
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
                  aria-hidden="true"
                >
                  <Moon size={18} className="text-primary" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          ref={menuButtonRef}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
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
              ref={mobileMenuRef}
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-section-bg backdrop-blur-md border-b border-border"
            >
              <ul className="flex flex-col py-2">
                {navItems.map((item, i) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <li key={item.href}>
                      <a
                        ref={i === 0 ? firstMobileMenuItemRef : undefined}
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.href)}
                        aria-current={isActive ? "location" : undefined}
                        className={`flex items-center gap-3 text-base w-full px-6 py-3 border-l-2 transition-all ${
                          isActive
                            ? "text-primary border-primary bg-primary/5"
                            : "text-muted-foreground hover:text-foreground border-transparent"
                        }`}
                      >
                        {item.label}
                        {isActive && (
                          <span className="ml-auto text-xs text-primary/60 font-mono" aria-hidden="true">●</span>
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
                  <Download size={14} aria-hidden="true" />
                  이력서 다운로드
                </a>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-muted hover:border-border transition-colors"
                  aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
                >
                  {theme === "dark" ? <Sun size={18} className="text-yellow-400" aria-hidden="true" /> : <Moon size={18} className="text-primary" aria-hidden="true" />}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
