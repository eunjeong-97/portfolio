"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Code2, Smartphone, Palette, Wrench } from "lucide-react";

type Level = 1 | 2 | 3;

interface Skill {
  name: string;
  level: Level;
}

const skillCategories: {
  title: string;
  icon: React.ElementType;
  skills: Skill[];
}[] = [
  {
    title: "Frontend",
    icon: Code2,
    skills: [
      { name: "JavaScript", level: 3 },
      { name: "TypeScript", level: 3 },
      { name: "React.js", level: 3 },
      { name: "Next.js", level: 2 },
      { name: "Redux", level: 2 },
      { name: "Zustand", level: 2 },
      { name: "React Query", level: 2 },
    ],
  },
  {
    title: "Mobile & Native",
    icon: Smartphone,
    skills: [
      { name: "React Native", level: 3 },
      { name: "React Navigation", level: 2 },
      { name: "Java", level: 2 },
      { name: "Swift", level: 2 },
      { name: "Kotlin", level: 1 },
      { name: "Objective-C", level: 1 },
    ],
  },
  {
    title: "UI & Styling",
    icon: Palette,
    skills: [
      { name: "HTML5", level: 3 },
      { name: "CSS/SCSS", level: 3 },
      { name: "Tailwind CSS", level: 2 },
      { name: "Chakra UI", level: 2 },
      { name: "Ag-Grid", level: 2 },
    ],
  },
  {
    title: "Tools",
    icon: Wrench,
    skills: [
      { name: "Git / GitHub", level: 3 },
      { name: "Figma", level: 2 },
      { name: "Jira", level: 2 },
      { name: "Notion", level: 2 },
    ],
  },
];

const LEVEL_LABEL: Record<Level, string> = {
  3: "주요",
  2: "활용",
  1: "경험",
};

const LEVEL_DESC: Record<Level, string> = {
  3: "실무 프로젝트에서 주도적으로 사용",
  2: "실무에서 활용 경험 보유",
  1: "기본 이해 및 사용 경험",
};

function SkillBadge({ name, level, isInView, delay = 0 }: Skill & { isInView: boolean; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  const barWidth = (level / 3) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay }}
      className="px-3 py-2 bg-muted rounded-lg hover:bg-primary/10 transition-colors group cursor-default relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          {name}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-xs text-muted-foreground/60 group-hover:text-primary transition-colors mr-0.5">
            {LEVEL_LABEL[level]}
          </span>
          {([1, 2, 3] as Level[]).map((i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i <= level ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="h-0.5 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${barWidth}%` : 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          style={{ opacity: hovered ? 1 : 0.5 }}
        />
      </div>

      {/* Tooltip */}
      {hovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-card border border-border rounded-lg text-xs text-muted-foreground whitespace-nowrap shadow-xl z-10 pointer-events-none">
          {LEVEL_DESC[level]}
        </div>
      )}
    </motion.div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 px-6 bg-section-bg" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm text-primary uppercase tracking-wider">
            Skills
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-3">
            Tech Stack
          </h2>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-10">
            {([3, 2, 1] as Level[]).map((level) => (
              <span key={level} className="flex items-center gap-1.5">
                <span className="flex gap-0.5">
                  {([1, 2, 3] as Level[]).map((i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${i <= level ? "bg-primary" : "bg-border"}`}
                    />
                  ))}
                </span>
                {LEVEL_LABEL[level]}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-section-bg p-6 rounded-2xl border border-border hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <category.icon size={20} className="text-primary" />
                </div>
                <h3 className="text-base font-semibold text-primary">
                  {category.title}
                </h3>
              </div>
              <div className="flex flex-col gap-1.5">
                {category.skills.map((skill, skillIdx) => (
                  <SkillBadge key={skill.name} {...skill} isInView={isInView} delay={0.3 + index * 0.1 + skillIdx * 0.05} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
