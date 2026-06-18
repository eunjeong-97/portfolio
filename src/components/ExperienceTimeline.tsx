"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
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

const CAREER_START = [2022, 3] as const;
const TOTAL_MONTHS = (2024 - CAREER_START[0]) * 12 + (10 - CAREER_START[1]) + 1;
const EXP_COLORS = ["bg-green-400", "bg-indigo-400", "bg-purple-400", "bg-yellow-400", "bg-blue-400"];

function getBarProps(period: string) {
  const parts = period.split(" - ").map(s => s.trim());
  const [sy, sm] = parts[0].split(".").map(Number);
  const [ey, em] = parts[1].split(".").map(Number);
  const startOff = (sy - CAREER_START[0]) * 12 + (sm - CAREER_START[1]);
  const endOff = (ey - CAREER_START[0]) * 12 + (em - CAREER_START[1]);
  return {
    left: (startOff / TOTAL_MONTHS) * 100,
    width: ((endOff - startOff + 1) / TOTAL_MONTHS) * 100,
  };
}

const expWithMeta = experiences.map(exp => ({ ...exp, duration: getDuration(exp.period), barProps: getBarProps(exp.period) }));
const expWithMetaReversed = [...expWithMeta].reverse();

const CAREER_DOMAINS = [
  { label: "웹", sub: "React.js" },
  { label: "앱", sub: "React Native" },
  { label: "어드민", sub: "React.js" },
];

const GANTT_YEAR_DIVIDERS = [33.3, 66.6];

const TIMELINE_BORDER_STYLE = { borderImage: "linear-gradient(to bottom, var(--primary), var(--border)) 1" } as const;
const ARROW_NUDGE_ANIM = { x: [0, 4, 0] };
const ITEM_INITIAL = { opacity: 0, x: -30 } as const;
const ITEM_ANIMATE_IN = { opacity: 1, x: 0 } as const;
const DOT_INITIAL = { scale: 0 } as const;
const DOT_ANIMATE_IN = { scale: 1 } as const;
const CARD_HOVER = { x: 6, transition: { duration: 0.2 } } as const;
const GANTT_BAR_INITIAL = { scaleX: 0 } as const;
const GANTT_BAR_ANIMATE_IN = { scaleX: 1 } as const;
const ARROW_NUDGE_TRANSITION = { duration: 1.5, repeat: Infinity, ease: "easeInOut" } as const;
const SECTION_HEADER_INITIAL = { opacity: 0, y: 20 } as const;
const SECTION_ANIMATE_IN = { opacity: 1, y: 0 } as const;
const GANTT_SECTION_INITIAL = { opacity: 0, y: 10 } as const;
const SECTION_HEADER_TRANSITION = { duration: 0.5 } as const;
const GANTT_SECTION_TRANSITION = { duration: 0.5, delay: 0.15 } as const;
const CAREER_SUMMARY_TRANSITION = { duration: 0.5, delay: 0.8 } as const;

export default function ExperienceTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const selectedExperience = selectedIndex !== null ? experiences[selectedIndex] : null;
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastSelectedIndex = useRef<number | null>(null);

  useEffect(() => {
    if (selectedIndex === null && lastSelectedIndex.current !== null) {
      cardRefs.current[lastSelectedIndex.current]?.focus();
    }
    if (selectedIndex !== null) lastSelectedIndex.current = selectedIndex;
  }, [selectedIndex]);

  const closeModal = useCallback(() => setSelectedIndex(null), []);
  const goNext = useCallback(() => {
    setDirection(1);
    setSelectedIndex((prev) => (prev !== null && prev < experiences.length - 1 ? prev + 1 : prev));
  }, []);
  const goPrev = useCallback(() => {
    setDirection(-1);
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  return (
    <section id="experience" className="py-24 px-6" ref={ref} aria-label="업무 경험">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={SECTION_HEADER_INITIAL}
          animate={isInView ? SECTION_ANIMATE_IN : {}}
          transition={SECTION_HEADER_TRANSITION}
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
          <p className="text-muted-foreground mb-6">
            ㈜트러스트체인에서 마일벌스 서비스 관련 홈페이지, 앱, 어드민 개발을
            담당했습니다.
          </p>

          {/* Career Gantt chart */}
          <motion.div
            initial={GANTT_SECTION_INITIAL}
            animate={isInView ? SECTION_ANIMATE_IN : {}}
            transition={GANTT_SECTION_TRANSITION}
            className="mb-10 bg-muted/50 border border-border rounded-xl p-4"
          >
            <div className="flex justify-between text-[10px] text-muted-foreground mb-2" aria-hidden="true">
              <span>2022.03</span>
              <span>2023</span>
              <span>2024.10</span>
            </div>
            <div
              role="img"
              aria-label={`경력 타임라인: 2022년 3월부터 2024년 10월까지 ${experiences.length}개 프로젝트`}
              className="relative h-7 bg-muted rounded-lg overflow-hidden"
            >
              {/* Year dividers */}
              {GANTT_YEAR_DIVIDERS.map((pct) => (
                <div key={pct} className="absolute top-0 bottom-0 w-px bg-border/50" style={{ left: `${pct}%` }} />
              ))}
              {/* Experience bars (reversed: oldest → newest) */}
              {expWithMetaReversed.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  title={exp.title}
                  className={`absolute top-1.5 bottom-1.5 ${EXP_COLORS[i]} rounded opacity-70 hover:opacity-100 transition-opacity cursor-default`}
                  style={{ left: `${exp.barProps.left}%`, width: `${exp.barProps.width}%`, originX: "left" }}
                  initial={GANTT_BAR_INITIAL}
                  animate={isInView ? GANTT_BAR_ANIMATE_IN : GANTT_BAR_INITIAL}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.08 }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2" aria-hidden="true">
              {expWithMetaReversed.map((exp, i) => (
                <span key={exp.id} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className={`w-2 h-2 rounded-sm ${EXP_COLORS[i]} opacity-70`} />
                  {exp.title.split(" ").slice(0, 2).join(" ")}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Timeline */}
        <div className="relative pl-8 border-l-2 border-border" style={TIMELINE_BORDER_STYLE}>
          {expWithMeta.map((exp, index) => {
            const year = exp.period.slice(0, 4);
            const prevYear = index > 0 ? expWithMeta[index - 1].period.slice(0, 4) : null;
            const showYearMarker = year !== prevYear;
            return (
              <motion.div
                key={exp.id}
                initial={ITEM_INITIAL}
                animate={isInView ? ITEM_ANIMATE_IN : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="relative pb-12 last:pb-0"
              >
                {/* Year Marker */}
                {showYearMarker && (
                  <div aria-hidden="true" className="absolute -left-[52px] top-0 text-xs font-bold text-primary/60 tabular-nums">
                    {year}
                  </div>
                )}

                {/* Timeline Dot */}
                <motion.div
                  aria-hidden="true"
                  className="absolute -left-[25px] top-0 w-3 h-3 bg-primary rounded-full ring-2 ring-background"
                  initial={DOT_INITIAL}
                  animate={isInView ? DOT_ANIMATE_IN : {}}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                />

                {/* Content Card */}
                <motion.div
                  ref={(el) => { cardRefs.current[index] = el as HTMLDivElement | null; }}
                  onClick={() => setSelectedIndex(index)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedIndex(index); } }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${exp.title} 상세 보기`}
                  whileHover={CARD_HOVER}
                  className="bg-section-bg p-6 rounded-xl border border-border hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-primary font-medium">
                        {exp.period}
                      </span>
                      <span className="text-xs text-primary/60 bg-primary/5 border border-primary/20 px-2 py-0.5 rounded-full font-medium">
                        {exp.duration}
                      </span>
                      {index === 0 && (
                        <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full font-semibold tracking-wide">
                          최신
                        </span>
                      )}
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
                  <div className="mt-4 text-sm text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                    <span>자세히 보기</span>
                    <motion.span
                      aria-hidden="true"
                      animate={ARROW_NUDGE_ANIM}
                      transition={ARROW_NUDGE_TRANSITION}
                      className="inline-block"
                    >
                      →
                    </motion.span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        {/* Career summary card */}
        <motion.div
          initial={SECTION_HEADER_INITIAL}
          animate={isInView ? SECTION_ANIMATE_IN : {}}
          transition={CAREER_SUMMARY_TRANSITION}
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
            {CAREER_DOMAINS.map(({ label, sub }) => (
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
        onClose={closeModal}
        onPrev={selectedIndex !== null && selectedIndex > 0 ? goPrev : undefined}
        onNext={selectedIndex !== null && selectedIndex < experiences.length - 1 ? goNext : undefined}
        currentIndex={selectedIndex ?? undefined}
        total={experiences.length}
        direction={direction}
      />
    </section>
  );
}
