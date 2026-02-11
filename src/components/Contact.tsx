"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Github, FileText, Send } from "lucide-react";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "beanlove97@gmail.com",
    href: "mailto:beanlove97@gmail.com",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/eunjeong-97",
    href: "https://github.com/eunjeong-97",
  },
  {
    icon: FileText,
    label: "Blog",
    value: "velog.io/@beanlove97",
    href: "https://velog.io/@beanlove97",
  },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-24 px-6 bg-neutral-950/50" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm text-primary uppercase tracking-wider">Contact</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-12">Get In Touch</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-4">함께 일하고 싶으시다면</h3>
            <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
              새로운 기회나 협업에 대해 이야기 나누고 싶으시다면 편하게 연락 주세요.
              빠르게 답변드리겠습니다.
            </p>

            <div className="space-y-4">
              {contactLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-primary transition-colors group"
                >
                  <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <link.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">{link.label}</div>
                    <div className="text-neutral-200 group-hover:text-white transition-colors">
                      {link.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right - CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 text-center"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Send size={28} className="text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-3">프로젝트를 함께 하고 싶으신가요?</h4>
            <p className="text-neutral-400 mb-6">이메일로 편하게 연락 주세요</p>
            <a
              href="mailto:beanlove97@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light rounded-lg font-medium transition-colors"
            >
              <Mail size={18} />
              이메일 보내기
            </a>

            <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-neutral-800">
              <a
                href="https://github.com/eunjeong-97"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://velog.io/@beanlove97"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors"
              >
                Blog
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
