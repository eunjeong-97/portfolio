"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { experiences, Experience } from "@/data/experiences";
import ExperienceModal from "./ExperienceModal";

export default function ExperienceTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);

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
        <div className="relative pl-8 border-l-2 border-border">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="relative pb-12 last:pb-0"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[25px] top-0 w-3 h-3 bg-primary rounded-full" />

              {/* Content Card */}
              <div
                onClick={() => setSelectedExperience(exp)}
                className="bg-section-bg p-6 rounded-xl border border-border hover:border-primary transition-all cursor-pointer group hover:translate-x-2"
              >
                <span className="text-sm text-primary font-medium">
                  {exp.period}
                </span>
                <h3 className="text-xl font-semibold mt-2 mb-3 group-hover:text-primary transition-colors">
                  {exp.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 whitespace-pre-line">
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
                <div className="mt-4 text-sm group-hover:text-primary transition-opacity">
                  클릭하여 자세히 보기 →
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <ExperienceModal
        experience={selectedExperience}
        onClose={() => setSelectedExperience(null)}
      />
    </section>
  );
}
