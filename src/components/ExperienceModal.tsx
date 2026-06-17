"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Experience } from "@/data/experiences";
import { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const BACKDROP_INITIAL = { opacity: 0 } as const;
const BACKDROP_ANIMATE = { opacity: 1 } as const;
const BACKDROP_EXIT = { opacity: 0 } as const;
const MODAL_INITIAL = { opacity: 0, scale: 0.95, y: 20 } as const;
const MODAL_ANIMATE = { opacity: 1, scale: 1, y: 0 } as const;
const MODAL_EXIT = { opacity: 0, scale: 0.95, y: 20 } as const;

interface ExperienceModalProps {
  experience: Experience | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  currentIndex?: number;
  total?: number;
  direction?: 1 | -1;
}

export default function ExperienceModal({
  experience,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  total,
  direction = 1,
}: ExperienceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [videoError, setVideoError] = useState(false);

  useFocusTrap(modalRef, !!experience);

  useEffect(() => {
    if (experience) {
      closeButtonRef.current?.focus();
      setVideoError(false);
    }
  }, [experience]);

  useEffect(() => {
    if (!experience) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowLeft") { onPrev?.(); return; }
      if (e.key === "ArrowRight") { onNext?.(); return; }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [experience, onClose, onPrev, onNext]);

  useEffect(() => {
    document.body.style.overflow = experience ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [experience]);

  return (
    <AnimatePresence>
      {experience && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={BACKDROP_INITIAL}
            animate={BACKDROP_ANIMATE}
            exit={BACKDROP_EXIT}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={MODAL_INITIAL}
            animate={MODAL_ANIMATE}
            exit={MODAL_EXIT}
            transition={{ type: "spring", duration: 0.5 }}
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={experience.title}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-section-bg rounded-2xl border border-border z-50 overflow-hidden flex flex-col outline-none"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-primary font-medium">
                    {experience.period}
                  </span>
                  {currentIndex !== undefined && total !== undefined && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {currentIndex + 1} / {total}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold">{experience.title}</h3>
              </div>
              <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                <button
                  onClick={onPrev}
                  disabled={!onPrev}
                  className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="이전 경험"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <button
                  onClick={onNext}
                  disabled={!onNext}
                  className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="다음 경험"
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors ml-1"
                  aria-label="닫기"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, x: direction * 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
              <p className="text-muted-foreground mb-6 leading-relaxed whitespace-pre-line">
                {experience.description}
              </p>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">주요 내용</h4>
                <ul className="space-y-3">
                  {experience.details.map((detail, index) => (
                    <li
                      key={index}
                      className="flex gap-3"
                    >
                      <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">사용 기술</h4>
                <div className="flex flex-wrap gap-2">
                  {experience.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-muted rounded-lg text-sm text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {experience.videoUrl && (
                <div>
                  <h4 className="text-lg font-semibold mb-4">실행 영상</h4>
                  <div className="relative bg-muted rounded-xl overflow-hidden aspect-video">
                    {videoError ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground" role="alert">
                        <span className="text-sm">영상을 불러올 수 없습니다.</span>
                        <span className="text-xs opacity-60">네트워크 상태를 확인해주세요.</span>
                      </div>
                    ) : (
                      <video
                        src={experience.videoUrl}
                        controls
                        preload="metadata"
                        className="w-full h-full object-contain"
                        playsInline
                        muted
                        aria-label={`${experience.title} 실행 영상`}
                        onError={() => setVideoError(true)}
                      >
                        브라우저가 비디오 태그를 지원하지 않습니다.
                      </video>
                    )}
                  </div>
                </div>
              )}
              </motion.div>
            </div>

            {/* Footer nav hint */}
            {(onPrev || onNext) && (
              <div className="border-t border-border">
                {currentIndex !== undefined && total !== undefined && (
                  <div className="h-1 bg-muted" aria-hidden="true">
                    <motion.div
                      className="h-full bg-primary rounded-r-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                )}
                <div className="px-6 py-3 flex justify-between text-xs text-muted-foreground">
                  <span>{onPrev ? "← 이전" : ""}</span>
                  <span className="opacity-60">← → 키보드로 이동</span>
                  <span>{onNext ? "다음 →" : ""}</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
