"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  const [visible, setVisible] = useState(false);
  const barWidth = (level / 3) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay }}
      className="px-3 py-2 bg-muted rounded-lg hover:bg-primary/10 transition-colors group cursor-default relative"
      tabIndex={0}
      role="img"
      aria-label={`${name}: ${LEVEL_LABEL[level]} (${LEVEL_DESC[level]})`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          {name}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0" aria-hidden="true">
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
      <div
        aria-hidden="true"
        className="h-0.5 bg-border rounded-full overflow-hidden"
      >
        <motion.div
          className={`h-full rounded-full ${level === 3 ? "bg-primary" : level === 2 ? "bg-primary/70" : "bg-primary/40"}`}
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${barWidth}%` : 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          style={{ opacity: visible ? 1 : 0.6 }}
        />
      </div>

      {/* Tooltip (aria-hidden: info already in parent aria-label) */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            aria-hidden="true"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-card border border-border rounded-lg text-xs text-muted-foreground whitespace-nowrap shadow-xl z-10 pointer-events-none"
          >
            {LEVEL_DESC[level]}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const allSkills = skillCategories.flatMap(c => c.skills);
const totalSkills = allSkills.length;
const levelCounts: Record<Level, number> = { 3: 0, 2: 0, 1: 0 };
allSkills.forEach(s => levelCounts[s.level]++);

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
          <div className="flex items-end justify-between mt-2 mb-3">
            <h2 className="text-3xl md:text-4xl font-bold">Tech Stack</h2>
            <span className="text-sm text-muted-foreground mb-1">
              총 <span className="text-primary font-bold">{totalSkills}</span>가지 기술
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4" aria-hidden="true">
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
                <span className="text-muted-foreground/50">({levelCounts[level]})</span>
              </span>
            ))}
          </div>
          {/* Distribution bar (decorative) */}
          <div className="flex h-1.5 rounded-full overflow-hidden w-full max-w-xs mb-10 gap-0.5" aria-hidden="true">
            {([3, 2, 1] as Level[]).map((level) => (
              <motion.div
                key={level}
                className="h-full rounded-full"
                style={{
                  background: level === 3 ? "var(--primary)" : level === 2 ? "rgba(59,130,246,0.5)" : "rgba(59,130,246,0.2)",
                }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${(levelCounts[level] / totalSkills) * 100}%` } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + (3 - level) * 0.1, ease: "easeOut" }}
              />
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
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-section-bg p-6 rounded-2xl border border-border hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors" aria-hidden="true">
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

        {/* Currently Learning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Currently Learning</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Next.js App Router (심화)", "Expo Router", "React Native New Architecture"].map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg text-xs text-primary"
              >
                <span className="w-1.5 h-1.5 border border-primary rounded-full" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
