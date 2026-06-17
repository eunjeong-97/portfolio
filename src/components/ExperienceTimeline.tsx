"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { experiences } from "@/data/experiences";
import ExperienceModal from "./ExperienceModal";

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
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Work Experience
          </h2>
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
                    <span className="text-sm text-primary font-medium">
                      {exp.period}
                    </span>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
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
