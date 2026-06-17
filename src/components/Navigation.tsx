"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Download } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useActiveSection } from "@/hooks/useActiveSection";

const navItems = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#github", label: "GitHub" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

const NAV_SECTION_IDS = navItems.map((i) => i.href.slice(1));

const ICON_ANIMATE_IN = { rotate: 0, opacity: 1 } as const;
const SUN_INITIAL = { rotate: -90, opacity: 0 } as const;
const SUN_EXIT = { rotate: 90, opacity: 0 } as const;
const MOON_INITIAL = { rotate: 90, opacity: 0 } as const;
const MOON_EXIT = { rotate: -90, opacity: 0 } as const;
const NAV_INITIAL = { y: -100 } as const;
const NAV_ANIMATE = { y: 0 } as const;
const LOGO_HOVER = { scale: 1.02 } as const;
const BACKDROP_INITIAL = { opacity: 0 } as const;
const BACKDROP_ANIMATE = { opacity: 1 } as const;
const BACKDROP_EXIT = { opacity: 0 } as const;
const MOBILE_MENU_INITIAL = { opacity: 0, height: 0 } as const;
const MOBILE_MENU_ANIMATE = { opacity: 1, height: "auto" } as const;
const MOBILE_MENU_EXIT = { opacity: 0, height: 0 } as const;

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSection = useActiveSection(NAV_SECTION_IDS);
  const firstMobileMenuItemRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasMenuOpenRef = useRef(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useFocusTrap(mobileMenuRef, isMobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    if (isMobileMenuOpen) {
      wasMenuOpenRef.current = true;
      const timer = setTimeout(() => firstMobileMenuItemRef.current?.focus(), 100);
      return () => { clearTimeout(timer); document.body.style.overflow = ""; };
    } else if (wasMenuOpenRef.current) {
      menuButtonRef.current?.focus();
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Escape") { setIsMobileMenuOpen(false); return; }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.toLowerCase() === "t") toggleTheme();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggleTheme]);

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
      aria-label="주 내비게이션"
      initial={NAV_INITIAL}
      animate={NAV_ANIMATE}
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
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          aria-label="박은정 포트폴리오 — 맨 위로 이동"
          className="flex items-center gap-3 text-xl font-bold text-foreground"
          whileHover={LOGO_HOVER}
        >
          <span aria-hidden="true">EunJeong<span className="text-primary">.</span></span>
          <span className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-normal" aria-hidden="true">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse motion-reduce:animate-none" aria-hidden="true" />
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
                  initial={SUN_INITIAL}
                  animate={ICON_ANIMATE_IN}
                  exit={SUN_EXIT}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                >
                  <Sun size={18} className="text-yellow-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={MOON_INITIAL}
                  animate={ICON_ANIMATE_IN}
                  exit={MOON_EXIT}
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
              initial={BACKDROP_INITIAL}
              animate={BACKDROP_ANIMATE}
              exit={BACKDROP_EXIT}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-[289px] md:hidden z-40"
            />
            <motion.div
              ref={mobileMenuRef}
              id="mobile-menu"
              initial={MOBILE_MENU_INITIAL}
              animate={MOBILE_MENU_ANIMATE}
              exit={MOBILE_MENU_EXIT}
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
