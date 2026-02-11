"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Smartphone, Palette } from "lucide-react";

const skillCategories = [
  {
    title: "Frontend",
    icon: Code2,
    skills: [
      "JavaScript",
      "TypeScript",
      "React.js",
      "Next.js",
      "Redux",
      "Zustand",
      "React Query",
    ],
  },
  {
    title: "Mobile",
    icon: Smartphone,
    skills: [
      "React Native",
      "React Navigation",
      "Java",
      "Kotlin",
      "Swift",
      "Objective-C",
    ],
  },
  {
    title: "UI & Styling",
    icon: Palette,
    skills: ["HTML5", "CSS/SCSS", "Tailwind CSS", "Chakra UI", "Ag-Grid"],
  },
];

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
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-12">
            Tech Stack
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-section-bg p-6 rounded-2xl border border-border hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <category.icon size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-primary">
                  {category.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-muted rounded-lg text-sm text-muted-foreground hover:bg-primary hover:text-foreground transition-colors cursor-default"
                  >
                    {skill}
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
