"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import { Calendar, LayoutGrid, Cpu, Globe, Search, BookOpen, Lightbulb, Layers, ArrowRight } from "lucide-react";

const highlights = [
  { value: 3, suffix: "+", label: "Years of Experience", context: "웹·앱 크로스플랫폼 실무 개발", icon: Calendar },
  { value: 60, suffix: "+", label: "Pages Developed", context: "3개월 혼자 완료 · 해상도 유틸 직접 개발", icon: LayoutGrid },
  { value: 5, suffix: "", label: "Ad SDK Integrations", context: "Java·Swift 네이티브 레이어 직접 작성", icon: Cpu },
  { value: 2, suffix: "", label: "Platforms", context: "React (Web) + React Native (App)", icon: Globe },
];

function useCountUp(target: number, isActive: boolean, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    const totalFrames = Math.round(duration / 16);
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (frame >= totalFrames) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isActive, target, duration]);
  return count;
}

function StatCard({
  value,
  suffix,
  label,
  context,
  icon: Icon,
  isActive,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  context: string;
  icon: React.ElementType;
  isActive: boolean;
  delay: number;
}) {
  const count = useCountUp(value, isActive);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isActive ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-section-bg p-5 rounded-xl border border-border hover:border-primary/50 transition-colors group cursor-default"
      aria-label={`${label}: ${value}${suffix} - ${context}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl md:text-4xl font-bold text-primary" aria-hidden="true">
          {count}{suffix}
        </div>
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors" aria-hidden="true">
          <Icon size={16} className="text-primary" />
        </div>
      </div>
      <div className="text-sm font-medium text-foreground/80" aria-hidden="true">{label}</div>
      <div className="text-xs text-muted-foreground mt-1" aria-hidden="true">{context}</div>
    </motion.div>
  );
}

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm text-primary uppercase tracking-wider">
            About
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-12">
            About Me
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-muted-foreground text-lg leading-relaxed">
              2022년, 레거시 jQuery 홈페이지를{" "}
              <strong className="text-foreground font-semibold underline decoration-primary/40 decoration-2 underline-offset-2">React로 리팩토링</strong>하는
              일을 시작으로 개발에 입문했습니다. 이후{" "}
              <strong className="text-foreground font-semibold underline decoration-primary/40 decoration-2 underline-offset-2">React Native</strong>로 앱을
              처음부터 다시 만들고, 광고 SDK를 네이티브 코드 레벨에서 직접
              연동하면서 — 웹과 앱,{" "}
              <strong className="text-foreground font-semibold underline decoration-primary/40 decoration-2 underline-offset-2">
                JavaScript와 Java/Swift
              </strong>
              를 경계 없이 다루게 됐습니다.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              저는 &apos;이 오류는 왜 발생하는가&apos;를 끝까지 파고듭니다.
              국내 사례가 없는{" "}
              <strong className="text-foreground font-semibold underline decoration-primary/40 decoration-2 underline-offset-2">AdMob Bidding 시스템</strong>
              을 도입할 때도, 구글 담당자에게 직접 이메일을 보내고 공식 문서를
              분석하며 스스로 답을 찾았습니다. 라이브러리를 교체하는 것이
              아니라,{" "}
              <strong className="text-foreground font-semibold underline decoration-primary/40 decoration-2 underline-offset-2">
                근본 원인을 이해하고 해결
              </strong>
              하는 것이 제 방식입니다.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              팀에 합류하면 빠르게{" "}
              <strong className="text-foreground font-semibold underline decoration-primary/40 decoration-2 underline-offset-2">컨텍스트를 파악</strong>하고,
              모르는 기술도 스스로 익혀서 실행에 옮깁니다. 크로스플랫폼 경험을
              바탕으로{" "}
              <strong className="text-foreground font-semibold underline decoration-primary/40 decoration-2 underline-offset-2">웹과 앱을 함께 다루는 팀</strong>
              에서 특히 강점을 발휘할 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-light text-white text-sm font-medium rounded-lg transition-colors"
              >
                함께 일해요 <ArrowRight size={14} />
              </a>
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border hover:border-primary text-muted-foreground hover:text-primary text-sm font-medium rounded-lg transition-colors"
              >
                프로젝트 보기
              </a>
            </div>
          </motion.div>

          {/* Highlights Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((item, index) => (
              <StatCard
                key={item.label}
                {...item}
                isActive={isInView}
                delay={0.5 + index * 0.1}
              />
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="col-span-2 bg-primary/5 border border-primary/20 rounded-xl p-4 mt-2"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <span className="text-xs text-primary uppercase tracking-wider font-semibold">개발 원칙</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label: "근본 원인 파악", icon: Search },
                  { label: "공식 문서 우선", icon: BookOpen },
                  { label: "자기주도적 문제 해결", icon: Lightbulb },
                  { label: "웹·앱 경계 없는 개발", icon: Layers },
                ].map(({ label, icon: PIcon }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <PIcon size={13} className="text-primary flex-shrink-0" />
                    <span className="text-xs text-foreground/80">{label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-primary/10">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400 font-medium">현재 구직 중 · 즉시 합류 가능합니다</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
