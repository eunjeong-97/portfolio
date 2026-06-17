"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { projects } from "@/data/projects";

export default function FeaturedProjects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
        </motion.div>

        <div className="space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
              className="bg-background border border-border rounded-2xl p-8 hover:border-primary/50 transition-all group"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                {/* Number Badge */}
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
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
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Problem
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.problem}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Decision
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.decision}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Impact
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.impact}
                  </p>
                </div>
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
          ))}
        </div>
      </div>
    </section>
  );
}
