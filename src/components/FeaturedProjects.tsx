"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Github } from "lucide-react";
import { projects } from "@/data/projects";

const FILTER_TAGS = ["전체", "React Native", "Native Module", "SDK Integration", "TypeScript"];

export default function FeaturedProjects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState("전체");
  const filteredProjects = activeFilter === "전체" ? projects : projects.filter(p => p.tags.includes(activeFilter));

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
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            대표 프로젝트
          </h2>
          <p className="text-muted-foreground">
            어떤 문제를 해결했고, 어떤 결정을 내렸으며, 어떤 결과를 만들었는지 정리했습니다.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-6">
            {FILTER_TAGS.map((tag) => {
              const count = tag === "전체" ? projects.length : projects.filter(p => p.tags.includes(tag)).length;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                    activeFilter === tag
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {tag}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeFilter === tag ? "bg-white/20 text-white" : "bg-border text-muted-foreground"
                  }`}>{count}</span>
                </button>
              );
            })}
            {activeFilter !== "전체" && (
              <motion.span
                key={activeFilter}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-muted-foreground ml-1"
              >
                {filteredProjects.length}/{projects.length} 프로젝트
              </motion.span>
            )}
          </div>
        </motion.div>

        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
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
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="text-primary font-bold text-sm">
                    {String(projects.indexOf(project) + 1).padStart(2, "0")}
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
                {[
                  { dot: "bg-red-400", label: "Problem", text: project.problem, bg: "bg-red-400/5" },
                  { dot: "bg-yellow-400", label: "Decision", text: project.decision, bg: "bg-yellow-400/5" },
                  { dot: "bg-green-400", label: "Impact", text: project.impact, bg: "bg-green-400/5" },
                ].map(({ dot, label, text, bg }, i) => (
                  <div key={label} className={`relative p-4 ${bg} ${i < 2 ? "md:border-r border-b md:border-b-0 border-border" : ""}`}>
                    {i > 0 && (
                      <div className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-section-bg border border-border rounded-full items-center justify-center z-10 text-xs text-muted-foreground">
                        →
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 ${dot} rounded-full`} />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
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
            <Github size={16} />
            더 많은 프로젝트는 GitHub에서 확인하세요
          </a>
        </motion.div>
      </div>
    </section>
  );
}
