"use client";

import { motion } from "framer-motion";
import { Github, FileText, ArrowDown } from "lucide-react";
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
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-neutral-800 rounded-full text-sm text-primary-light mb-6 border border-neutral-700"
          >
            Frontend Developer
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            <span className="text-primary">크로스플랫폼</span>을
            <br />
            넘나드는 개발자,
            <br />
            박은정입니다
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-neutral-400 mb-8 leading-relaxed"
          >
            웹과 앱의 경계 없이 사용자에게 최적의 경험을 전달합니다.
            <br />
            문제의 근본 원인을 파악하고 해결하는 것을 좋아합니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <a
              href="#experience"
              className="px-6 py-3 bg-primary hover:bg-primary-light rounded-lg font-medium transition-colors"
            >
              경험 보기
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-neutral-600 hover:border-white rounded-lg font-medium transition-colors"
            >
              연락하기
            </a>
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
              className="flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors"
            >
              <Github size={18} />
              <span>GitHub</span>
            </a>
            <a
              href="https://velog.io/@beanlove97"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors"
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
            <div className="relative w-[280px] h-[350px] md:w-[320px] md:h-[400px] bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl border border-neutral-700 overflow-hidden mx-auto">
              {/* Placeholder - 나중에 실제 이미지로 교체 */}
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-neutral-700 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-neutral-600 rounded-full" />
                </div>
                <span className="text-neutral-600 text-sm">프로필 이미지</span>
              </div>
              {/* 실제 이미지 사용 시 아래 주석 해제
              <Image
                src="/profile.jpg"
                alt="박은정"
                fill
                className="object-cover"
                priority
              />
              */}
            </div>

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 -right-4 md:top-8 md:right-0 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 shadow-2xl"
            >
              <div className="text-xs text-neutral-400 mb-1">Experience</div>
              <div className="text-lg font-semibold">
                3<span className="text-primary">+</span> Years
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-24 -left-8 md:bottom-28 md:-left-12 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 shadow-2xl"
            >
              <div className="text-xs text-neutral-400 mb-2">Tech Stack</div>
              <div className="flex gap-2">
                {["JS", "TS", "RN"].map((tech) => (
                  <div
                    key={tech}
                    className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center text-xs font-semibold text-primary-light"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-2 right-4 md:bottom-0 md:right-8 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 shadow-2xl"
            >
              <div className="text-xs text-neutral-400 mb-1">Projects</div>
              <div className="text-lg font-semibold">
                60<span className="text-primary">+</span> Pages
              </div>
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
