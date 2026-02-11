"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const highlights = [
  { number: "3+", label: "Years of Experience" },
  { number: "60+", label: "Pages Developed" },
  { number: "5+", label: "SDK Integrations" },
  { number: "2", label: "Platforms (Web & App)" },
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
              <strong className="text-foreground">React.js</strong>를 통한 웹
              개발뿐만 아니라,
              <strong className="text-foreground">React Native</strong>를 통해
              Android와 iOS 디바이스에서 실행 가능한 크로스플랫폼 앱 개발이
              가능합니다.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              필요한 경우, 각 네이티브 환경에서 Android의{" "}
              <strong className="text-foreground">Java/Kotlin</strong>과 iOS의{" "}
              <strong className="text-foreground">Objective-C/Swift</strong>{" "}
              언어를 사용한 개발을 경험했으며, 이를 React Native와 연동하여
              네이티브 모듈을 개발할 수 있습니다.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              생소한 환경에서도 개발을 두려워하지 않으며, 개발 도중 발생한
              오류를 단순히 라이브러리로 해결하는 것을 넘어{" "}
              <strong className="text-foreground">근본적인 원인을 파악</strong>
              하고 해결하는 데 강점이 있습니다.
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
