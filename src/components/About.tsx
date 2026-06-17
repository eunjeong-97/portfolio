"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const highlights = [
  { number: "3+", label: "Years of Experience", context: "2022년부터 웹·앱 풀사이클" },
  { number: "60+", label: "Pages Developed", context: "앱 재개발 3개월 단독 담당" },
  { number: "5+", label: "SDK Integrations", context: "광고사 Native Module 직접 연동" },
  { number: "2", label: "Platforms", context: "Web (React) + App (React Native)" },
];

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
              <strong className="text-foreground">React로 리팩토링</strong>하는
              일을 시작으로 개발에 입문했습니다. 이후{" "}
              <strong className="text-foreground">React Native</strong>로 앱을
              처음부터 다시 만들고, 광고 SDK를 네이티브 코드 레벨에서 직접
              연동하면서 — 웹과 앱,{" "}
              <strong className="text-foreground">
                JavaScript와 Java/Swift
              </strong>
              를 경계 없이 다루게 됐습니다.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              저는 &apos;이 오류는 왜 발생하는가&apos;를 끝까지 파고듭니다.
              국내 사례가 없는{" "}
              <strong className="text-foreground">AdMob Bidding 시스템</strong>
              을 도입할 때도, 구글 담당자에게 직접 이메일을 보내고 공식 문서를
              분석하며 스스로 답을 찾았습니다. 라이브러리를 교체하는 것이
              아니라,{" "}
              <strong className="text-foreground">
                근본 원인을 이해하고 해결
              </strong>
              하는 것이 제 방식입니다.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              팀에 합류하면 빠르게{" "}
              <strong className="text-foreground">컨텍스트를 파악</strong>하고,
              모르는 기술도 스스로 익혀서 실행에 옮깁니다. 크로스플랫폼 경험을
              바탕으로{" "}
              <strong className="text-foreground">웹과 앱을 함께 다루는 팀</strong>
              에서 특히 강점을 발휘할 수 있습니다.
            </p>
          </motion.div>

          {/* Highlights Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-section-bg p-6 rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {item.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.label}
                </div>
                <div className="text-xs text-primary/70 mt-1">{item.context}</div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="col-span-2 bg-primary/5 border border-primary/20 rounded-xl p-4 mt-2"
            >
              <div className="text-xs text-primary uppercase tracking-wider mb-2">개발 원칙</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {["근본 원인 파악", "공식 문서 우선", "자기주도적 문제 해결", "웹·앱 경계 없는 개발"].map((v) => (
                  <span key={v} className="text-sm text-foreground/80">
                    # {v}
                  </span>
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
