"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { scrollToId } from "@/utils/scrollTo";

const shortcuts = [
  { key: "?", description: "단축키 목록 보기" },
  { key: "T", description: "다크/라이트 모드 전환" },
  { key: "C", description: "챗봇 열기/닫기" },
  { key: "ESC", description: "모달/메뉴 닫기" },
  { key: "Ctrl+↵", description: "메시지 전송 (Contact 폼)" },
  { key: "← →", description: "이전/다음 경험 이동" },
];

const navShortcuts = [
  { key: "1", description: "Projects 섹션으로 이동" },
  { key: "2", description: "About 섹션으로 이동" },
  { key: "3", description: "Skills 섹션으로 이동" },
  { key: "4", description: "Experience 섹션으로 이동" },
  { key: "5", description: "GitHub 섹션으로 이동" },
  { key: "6", description: "Blog 섹션으로 이동" },
  { key: "7", description: "Contact 섹션으로 이동" },
];

const NAV_SECTIONS = ["projects", "about", "skills", "experience", "github", "blog", "contact"];

const KBD_BACKDROP_INITIAL = { opacity: 0 } as const;
const KBD_BACKDROP_ANIMATE = { opacity: 1 } as const;
const KBD_MODAL_INITIAL = { opacity: 0, scale: 0.95, y: 10 } as const;
const KBD_MODAL_ANIMATE = { opacity: 1, scale: 1, y: 0 } as const;
const KBD_MODAL_TRANSITION = { duration: 0.15 } as const;

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const wasOpenRef = useRef(false);

  useFocusTrap(modalRef, isOpen);

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      closeButtonRef.current?.focus();
    } else if (wasOpenRef.current) {
      triggerButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) return;

      if (e.key === "Escape") { setIsOpen(false); return; }
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "?") { e.preventDefault(); setIsOpen((prev) => !prev); return; }
      if (e.key === "Tab") return;

      if (document.querySelector('[role="dialog"]')) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= NAV_SECTIONS.length) {
        scrollToId(NAV_SECTIONS[num - 1]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <button
        ref={triggerButtonRef}
        onClick={() => setIsOpen(true)}
        className="hidden md:flex fixed bottom-[8.5rem] right-6 z-40 items-center gap-1.5 px-2.5 py-1.5 bg-section-bg border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors shadow-md"
        title="키보드 단축키 (? 키)"
        aria-label="키보드 단축키 목록 열기"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Keyboard size={12} aria-hidden="true" />
        <span className="font-mono">?</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={KBD_BACKDROP_INITIAL}
              animate={KBD_BACKDROP_ANIMATE}
              exit={KBD_BACKDROP_INITIAL}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label="키보드 단축키 목록"
              initial={KBD_MODAL_INITIAL}
              animate={KBD_MODAL_ANIMATE}
              exit={KBD_MODAL_INITIAL}
              transition={KBD_MODAL_TRANSITION}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md bg-section-bg border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Keyboard size={16} className="text-primary" aria-hidden="true" />
                  <span className="font-semibold text-sm">키보드 단축키</span>
                </div>
                <button
                  ref={closeButtonRef}
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
                  aria-label="단축키 목록 닫기"
                >
                  <X size={16} aria-hidden="true" />
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
