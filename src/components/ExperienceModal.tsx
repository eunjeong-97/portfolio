"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import { Experience } from "@/data/experiences";
import { useEffect } from "react";

interface ExperienceModalProps {
  experience: Experience | null;
  onClose: () => void;
}

export default function ExperienceModal({
  experience,
  onClose,
}: ExperienceModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // 모달 열릴 때 스크롤 방지
  useEffect(() => {
    if (experience) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [experience]);

  return (
    <AnimatePresence>
      {experience && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-section-bg rounded-2xl border border-border z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div>
                <span className="text-sm text-primary font-medium">
                  {experience.period}
                </span>
                <h3 className="text-2xl font-bold mt-1">{experience.title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-muted-foreground mb-6 leading-relaxed whitespace-pre-line">
                {experience.description}
              </p>

              {/* Details */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">주요 내용</h4>
                <ul className="space-y-3">
                  {experience.details.map((detail, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-muted-foreground"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
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

              {/* Video */}
              {experience.videoUrl && (
                <div>
                  <h4 className="text-lg font-semibold mb-4">실행 영상</h4>
                  <div className="relative bg-muted rounded-xl overflow-hidden aspect-video">
                    <video
                      src={experience.videoUrl}
                      controls
                      className="w-full h-full object-contain"
                      playsInline
                      autoPlay
                      muted
                    >
                      <source src={experience.videoUrl} type="video/mp4" />
                      브라우저가 비디오 태그를 지원하지 않습니다.
                    </video>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    * 영상이 로드되지 않을 경우 네트워크 상태를 확인해주세요.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
