"use client";

import { motion } from "framer-motion";
import { Github, FileText, ArrowDown, Download } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center px-6 pt-20">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-sm text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              구직 중 · Open to Work
            </span>
            <span className="inline-block px-4 py-2 bg-muted rounded-full text-sm text-primary-light border border-border">
              Frontend & Mobile Developer
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            웹과 앱,
            <br />
            <span className="text-primary">하나의 코드베이스</span>로
            <br />
            만드는 개발자입니다
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground mb-8 leading-relaxed"
          >
            React · React Native로 웹과 앱을 함께 개발하며,
            <br />
            SDK 연동부터 Java/Swift 네이티브 코드까지 직접 다뤄왔습니다.
            <br />
            생소한 기술도 공식 문서와 근본 원인 분석으로 스스로 해결합니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <a
              href="#projects"
              className="px-6 py-3 bg-primary hover:bg-primary-light rounded-lg font-medium transition-colors text-white"
            >
              프로젝트 보기
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-neutral-600 hover:border-foreground rounded-lg font-medium transition-colors text-foreground"
            >
              연락하기
            </a>
            <a
              href="/resume.pdf"
              download="박은정_이력서.pdf"
              className="flex items-center gap-2 px-6 py-3 border border-primary/50 hover:border-primary hover:bg-primary/5 rounded-lg font-medium transition-colors text-primary"
            >
              <Download size={16} />
              이력서 다운로드
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {["React", "TypeScript", "React Native", "Next.js", "Java/Kotlin", "Swift"].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-muted border border-border rounded-full text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-6"
          >
            <a
              href="https://github.com/eunjeong-97"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Github size={18} />
              <span>GitHub</span>
            </a>
            <a
              href="https://velog.io/@beanlove97"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <FileText size={18} />
              <span>Blog</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative flex justify-center items-center"
        >
          <div className="relative w-[320px] h-[400px] md:w-[380px] md:h-[480px]">
            {/* Glow Effect */}
            <div className="absolute w-[300px] h-[300px] bg-primary blur-[150px] opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />

            {/* Profile Frame */}
            <div className="relative w-[280px] h-[350px] md:w-[320px] md:h-[400px] bg-gradient-to-br from-muted to-card rounded-3xl border border-border overflow-hidden mx-auto">
              {/* Placeholder - 나중에 실제 이미지로 교체 */}
              {/* <div className="w-full h-full flex flex-col items-center justify-center gap-4"> */}
              {/* <div className="w-24 h-24 md:w-32 md:h-32 border-border rounded-full flex items-center justify-center"> */}
              {/* <div className="w-12 h-12 md:w-16 md:h-16 bg-neutral-600 rounded-full" /> */}
              {/* </div> */}
              {/* <span className="text-neutral-600 text-sm">프로필 이미지</span> */}
              {/* </div> */}
              {/* 실제 이미지 사용 시 아래 주석 해제 */}
              <Image
                src="/images/profile.jpg"
                alt="박은정"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 -right-4 md:top-8 md:right-0 bg-section-bg border border-border rounded-xl px-4 py-3 shadow-2xl"
            >
              <div className="text-xs text-muted-foreground mb-1">
                Experience
              </div>
              <div className="text-lg font-semibold">
                3<span className="text-primary">+</span> Years
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute bottom-24 -left-8 md:bottom-28 md:-left-12 bg-section-bg border border-border rounded-xl px-4 py-3 shadow-2xl"
            >
              <div className="text-xs text-muted-foreground mb-2">
                Tech Stack
              </div>
              <div className="flex gap-2">
                {["JS", "TS", "RN"].map((tech) => (
                  <div
                    key={tech}
                    className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-xs font-semibold text-primary-light"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-2 right-4 md:bottom-0 md:right-8 bg-section-bg border border-border rounded-xl px-4 py-3 shadow-2xl"
            >
              <div className="text-xs text-muted-foreground mb-1">앱 재개발</div>
              <div className="text-lg font-semibold">
                60<span className="text-primary">+</span> Pages
              </div>
              <div className="text-xs text-muted-foreground mt-1">3개월 혼자 담당</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-600"
      >
        <span className="text-xs">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
