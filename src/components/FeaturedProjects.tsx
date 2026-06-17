"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { Github } from "lucide-react";
import { projects } from "@/data/projects";

const FILTER_TAGS = ["전체", "React Native", "Native Module", "SDK Integration", "TypeScript"];

const TAG_COUNTS: Record<string, number> = Object.fromEntries(
  FILTER_TAGS.map(tag => [tag, tag === "전체" ? projects.length : projects.filter(p => p.tags.includes(tag)).length])
);

const FILTERABLE_TAGS = new Set(FILTER_TAGS.filter(t => t !== "전체"));

const CASE_STUDY_COLS = [
  { dot: "bg-red-400", label: "Problem", key: "problem", bg: "bg-red-400/5" },
  { dot: "bg-yellow-400", label: "Decision", key: "decision", bg: "bg-yellow-400/5" },
  { dot: "bg-green-400", label: "Impact", key: "impact", bg: "bg-green-400/5" },
] as const;

export default function FeaturedProjects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState("전체");
  const filteredProjects = useMemo(
    () => activeFilter === "전체" ? projects : projects.filter(p => p.tags.includes(activeFilter)),
    [activeFilter]
  );

  return (
    <section id="projects" className="py-24 px-6 bg-section-bg" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="text-sm text-primary uppercase tracking-wider">
            Featured Projects
          </span>
          <div className="flex items-end gap-3 mt-2 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold">대표 프로젝트</h2>
            <span className="text-sm text-muted-foreground mb-1.5">
              <span className="text-primary font-semibold">{projects.length}</span>개 주요 프로젝트
            </span>
          </div>
          <p className="text-muted-foreground">
            어떤 문제를 해결했고, 어떤 결정을 내렸으며, 어떤 결과를 만들었는지 정리했습니다.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-6" role="group" aria-label="기술 스택 필터">
            {FILTER_TAGS.map((tag) => {
              const count = TAG_COUNTS[tag];
              return (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  aria-pressed={activeFilter === tag}
                  aria-label={`${tag} (${count}개)`}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                    activeFilter === tag
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {tag}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeFilter === tag ? "bg-white/20 text-white" : "bg-border text-muted-foreground"
                  }`} aria-hidden="true">{count}</span>
                </button>
              );
            })}
            <span
              aria-live="polite"
              aria-atomic="true"
              className="text-sm text-muted-foreground ml-1"
            >
              {activeFilter !== "전체" ? `${filteredProjects.length}/${projects.length} 프로젝트` : ""}
            </span>
          </div>
        </motion.div>

        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-16 text-muted-foreground"
            >
              <p className="mb-3">해당 기술을 사용한 프로젝트가 없습니다.</p>
              <button
                onClick={() => setActiveFilter("전체")}
                className="text-sm text-primary hover:text-primary-light underline underline-offset-2 transition-colors"
              >
                전체 보기
              </button>
            </motion.div>
          )}
          {filteredProjects.map((project, index) => {
            return (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.3, delay: index * 0.07 }}
              className="bg-background border border-border rounded-2xl p-8 transition-colors group hover:border-primary/50"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                {/* Number Badge */}
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors" aria-hidden="true">
                  <span className="text-primary font-bold text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {project.title}
                      </h3>
                      <span className="text-sm text-primary font-medium">
                        {project.period}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.highlights.map((h) => (
                        <span
                          key={h}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Role */}
                  <p className="mt-3 text-sm text-foreground/80 font-medium leading-relaxed border-l-2 border-primary/40 pl-3">
                    {project.role}
                  </p>
                </div>
              </div>

              {/* Case Study Grid */}
              <div className="grid md:grid-cols-3 gap-0 rounded-xl overflow-hidden border border-border">
                {CASE_STUDY_COLS.map(({ dot, label, key, bg }, i) => (
                  <div key={label} className={`relative p-4 ${bg} ${i < 2 ? "md:border-r border-b md:border-b-0 border-border" : ""}`}>
                    {i > 0 && (
                      <div aria-hidden="true" className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-section-bg border border-border rounded-full items-center justify-center z-10 text-xs text-muted-foreground">
                        →
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 ${dot} rounded-full`} aria-hidden="true" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project[key]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
                {project.tags.map((tag) => {
                  const isFilterable = FILTERABLE_TAGS.has(tag);
                  return isFilterable ? (
                    <button
                      key={tag}
                      onClick={() => setActiveFilter(tag)}
                      aria-pressed={activeFilter === tag}
                      aria-label={`${tag}로 필터링`}
                      className={`px-2 py-1 rounded text-xs transition-colors bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary ${activeFilter === tag ? "bg-primary/10 text-primary" : ""}`}
                    >
                      {tag}
                    </button>
                  ) : (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </motion.div>
            );
          })}
          </AnimatePresence>
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 text-center"
        >
          <a
            href="https://github.com/eunjeong-97"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-primary text-muted-foreground hover:text-primary rounded-xl transition-colors text-sm"
          >
            <Github size={16} aria-hidden="true" />
            더 많은 프로젝트는 GitHub에서 확인하세요
            <span className="sr-only">(새 탭에서 열림)</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
