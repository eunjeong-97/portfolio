"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { experiences } from "@/data/experiences";
import ExperienceModal from "./ExperienceModal";

function getDuration(period: string): string {
  const parts = period.split(" - ").map(s => s.trim());
  if (parts.length < 2) return "";
  const [sy, sm] = parts[0].split(".").map(Number);
  const [ey, em] = parts[1].split(".").map(Number);
  const totalMonths = (ey - sy) * 12 + (em - sm) + 1;
  if (totalMonths < 12) return `${totalMonths}개월`;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return months > 0 ? `${years}년 ${months}개월` : `${years}년`;
}

export default function ExperienceTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedExperience = selectedIndex !== null ? experiences[selectedIndex] : null;

  return (
    <section id="experience" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm text-primary uppercase tracking-wider">
            Experience
          </span>
          <div className="flex items-end gap-3 mt-2 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold">Work Experience</h2>
            <span className="text-sm text-muted-foreground mb-1.5">
              <span className="text-primary font-semibold">{experiences.length}</span>개 프로젝트
            </span>
          </div>
          <p className="text-muted-foreground mb-12">
            ㈜트러스트체인에서 마일벌스 서비스 관련 홈페이지, 앱, 어드민 개발을
            담당했습니다.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative pl-8 border-l-2 border-border" style={{ borderImage: "linear-gradient(to bottom, var(--primary), var(--border)) 1" }}>
          {experiences.map((exp, index) => {
            const year = exp.period.slice(0, 4);
            const prevYear = index > 0 ? experiences[index - 1].period.slice(0, 4) : null;
            const showYearMarker = year !== prevYear;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="relative pb-12 last:pb-0"
              >
                {/* Year Marker */}
                {showYearMarker && (
                  <div className="absolute -left-[52px] top-0 text-xs font-bold text-primary/60 tabular-nums">
                    {year}
                  </div>
                )}

                {/* Timeline Dot */}
                <motion.div
                  className="absolute -left-[25px] top-0 w-3 h-3 bg-primary rounded-full ring-2 ring-background"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                />

                {/* Content Card */}
                <div
                  onClick={() => setSelectedIndex(index)}
                  className="bg-section-bg p-6 rounded-xl border border-border hover:border-primary transition-all cursor-pointer group hover:translate-x-2"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-primary font-medium">
                        {exp.period}
                      </span>
                      <span className="text-xs text-primary/60 bg-primary/5 border border-primary/20 px-2 py-0.5 rounded-full font-medium">
                        {getDuration(exp.period)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full flex-shrink-0">
                      ㈜트러스트체인
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 whitespace-pre-line line-clamp-3">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                    클릭하여 자세히 보기 →
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* Career summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-wrap items-center gap-4"
        >
          <div className="flex-1 min-w-[200px]">
            <div className="text-xs text-primary uppercase tracking-wider mb-1">총 경력</div>
            <div className="text-lg font-bold text-foreground">
              ㈜트러스트체인 · 2022.03 – 2024.10
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">약 2년 8개월 · {experiences.length}개 주요 프로젝트</div>
          </div>
          <div className="flex gap-3">
            {[
              { label: "웹", sub: "React.js" },
              { label: "앱", sub: "React Native" },
              { label: "어드민", sub: "React.js" },
            ].map(({ label, sub }) => (
              <div key={label} className="text-center">
                <div className="text-sm font-semibold text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <ExperienceModal
        experience={selectedExperience}
        onClose={() => setSelectedIndex(null)}
        onPrev={selectedIndex !== null && selectedIndex > 0 ? () => setSelectedIndex(selectedIndex - 1) : undefined}
        onNext={selectedIndex !== null && selectedIndex < experiences.length - 1 ? () => setSelectedIndex(selectedIndex + 1) : undefined}
      />
    </section>
  );
}
