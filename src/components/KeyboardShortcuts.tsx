"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";

const shortcuts = [
  { key: "?", description: "단축키 목록 보기" },
  { key: "T", description: "다크/라이트 모드 전환" },
  { key: "C", description: "챗봇 열기/닫기" },
  { key: "ESC", description: "모달/메뉴 닫기" },
];

const navShortcuts = [
  { key: "1", description: "Projects 섹션으로 이동" },
  { key: "2", description: "About 섹션으로 이동" },
  { key: "3", description: "Skills 섹션으로 이동" },
  { key: "4", description: "Experience 섹션으로 이동" },
  { key: "5", description: "Blog 섹션으로 이동" },
  { key: "6", description: "Contact 섹션으로 이동" },
];

const NAV_SECTIONS = ["projects", "about", "skills", "experience", "blog", "contact"];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) return;

      if (e.key === "?") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);

      const num = parseInt(e.key);
      if (num >= 1 && num <= NAV_SECTIONS.length) {
        const el = document.getElementById(NAV_SECTIONS[num - 1]);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex fixed bottom-24 right-6 z-40 items-center gap-1.5 px-2.5 py-1.5 bg-section-bg border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors shadow-md"
        title="키보드 단축키 (? 키)"
      >
        <Keyboard size={12} />
        <span className="font-mono">?</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md bg-section-bg border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Keyboard size={16} className="text-primary" />
                  <span className="font-semibold text-sm">키보드 단축키</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">일반</div>
                  <div className="space-y-2">
                    {shortcuts.map(({ key, description }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{description}</span>
                        <kbd className="px-2 py-0.5 bg-muted border border-border rounded text-xs font-mono text-foreground">
                          {key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">섹션 이동</div>
                  <div className="space-y-2">
                    {navShortcuts.map(({ key, description }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{description}</span>
                        <kbd className="px-2 py-0.5 bg-muted border border-border rounded text-xs font-mono text-foreground">
                          {key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-border bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                  입력 필드 포커스 시 단축키는 비활성화됩니다
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
