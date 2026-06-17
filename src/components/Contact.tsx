"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Github, FileText, Send, Copy, Check, Loader2, AlertCircle } from "lucide-react";

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
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email);
  const isFormValid = formState.name.length >= 2 && emailValid && formState.message.length >= 10;
  const fieldStatus = {
    name: touched.name ? (formState.name.length >= 2 ? "valid" : "error") : "idle",
    email: touched.email ? (emailValid ? "valid" : "error") : "idle",
    message: touched.message ? (formState.message.length >= 10 ? "valid" : "error") : "idle",
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText("beanlove97@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/beanlove97@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          _subject: `포트폴리오 문의: ${formState.name}`,
        }),
      });
      if (res.ok) setSent(true);
    } catch {
      // Fall back to mailto
      window.location.href = `mailto:beanlove97@gmail.com?subject=${encodeURIComponent(`포트폴리오 문의: ${formState.name}`)}&body=${encodeURIComponent(formState.message)}`;
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-section-bg" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm text-primary uppercase tracking-wider">
            Contact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-12">
            Get In Touch
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-4">
              함께 일하고 싶으시다면
            </h3>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              새로운 기회나 협업에 대해 이야기 나누고 싶으시다면 편하게 연락
              주세요.
              <br />
              빠르게 답변드리겠습니다.
            </p>

            <div className="space-y-4">
              {contactLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-section-bg rounded-xl border border-border hover:border-primary transition-colors group"
                >
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <link.icon size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">
                        {link.label}
                      </div>
                      <div className="text-muted-foreground group-hover:text-primary transition-colors truncate">
                        {link.value}
                      </div>
                    </div>
                  </a>
                  {link.label === "Email" && (
                    <button
                      onClick={copyEmail}
                      className="flex-shrink-0 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                      aria-label="이메일 복사"
                    >
                      {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            {/* 구직 상태 카드 */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-400 text-sm">현재 구직 중 · 즉시 합류 가능</p>
                <p className="text-xs text-muted-foreground mt-0.5">📬 24시간 이내 답변드립니다</p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-section-bg p-6 rounded-2xl border border-border">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check size={30} className="text-green-400" />
                  </motion.div>
                  <h4 className="font-semibold mb-2 text-lg">메시지를 보냈습니다!</h4>
                  <p className="text-sm text-muted-foreground mb-4">빠르게 답변드리겠습니다. (24시간 이내)</p>
                  <button
                    onClick={() => { setSent(false); setFormState({ name: "", email: "", message: "" }); setTouched({ name: false, email: false, message: false }); }}
                    className="text-xs text-primary hover:text-primary-light underline underline-offset-2 transition-colors"
                  >
                    다른 메시지 보내기
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-base mb-2">메시지 보내기</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "채용 문의", text: "안녕하세요! 채용 포지션과 관련하여 연락드립니다. 박은정님의 경력과 포트폴리오에 관심이 생겨서요." },
                        { label: "협업 제안", text: "안녕하세요! 프로젝트 협업을 제안드리고 싶어서 연락드립니다." },
                      ].map(({ label, text }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => { setFormState(f => ({ ...f, message: text })); setTouched(t => ({ ...t, message: true })); }}
                          className="text-xs px-2.5 py-1 bg-muted hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/40 rounded-full transition-colors"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-muted-foreground">이름</label>
                        {fieldStatus.name === "error" && (
                          <span className="flex items-center gap-1 text-[10px] text-red-400">
                            <AlertCircle size={10} /> 2자 이상 입력해주세요
                          </span>
                        )}
                        {fieldStatus.name === "valid" && <Check size={12} className="text-green-400" />}
                      </div>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        onBlur={() => setTouched(t => ({ ...t, name: true }))}
                        placeholder="홍길동"
                        className={`w-full bg-muted text-foreground placeholder:text-muted-foreground text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                          fieldStatus.name === "error" ? "border-red-400/50" : fieldStatus.name === "valid" ? "border-green-400/50" : "border-border"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-muted-foreground">이메일</label>
                        {fieldStatus.email === "error" && (
                          <span className="flex items-center gap-1 text-[10px] text-red-400">
                            <AlertCircle size={10} /> 올바른 이메일 형식
                          </span>
                        )}
                        {fieldStatus.email === "valid" && <Check size={12} className="text-green-400" />}
                      </div>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        onBlur={() => setTouched(t => ({ ...t, email: true }))}
                        placeholder="example@email.com"
                        className={`w-full bg-muted text-foreground placeholder:text-muted-foreground text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                          fieldStatus.email === "error" ? "border-red-400/50" : fieldStatus.email === "valid" ? "border-green-400/50" : "border-border"
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <label className="text-xs text-muted-foreground">메시지</label>
                        {fieldStatus.message === "valid" && <Check size={12} className="text-green-400" />}
                        {fieldStatus.message === "error" && (
                          <span className="flex items-center gap-1 text-[10px] text-red-400">
                            <AlertCircle size={10} /> 10자 이상 입력해주세요
                          </span>
                        )}
                      </div>
                      <span className={`text-xs ${formState.message.length > 450 ? "text-red-400" : "text-muted-foreground/60"}`}>
                        {formState.message.length}/500
                      </span>
                    </div>
                    <textarea
                      required
                      rows={4}
                      maxLength={500}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      onBlur={() => setTouched(t => ({ ...t, message: true }))}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                          e.currentTarget.form?.requestSubmit();
                        }
                      }}
                      placeholder="안녕하세요! 함께 일하고 싶어서 연락드립니다..."
                      className={`w-full bg-muted text-foreground placeholder:text-muted-foreground text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-colors ${
                        fieldStatus.message === "error" ? "border-red-400/50" : fieldStatus.message === "valid" ? "border-green-400/50" : "border-border"
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={sending || !isFormValid}
                      title={!isFormValid ? "모든 필드를 올바르게 입력해주세요" : undefined}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light disabled:opacity-60 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-white text-sm"
                    >
                      {sending ? (
                        <><Loader2 size={16} className="animate-spin" /> 전송 중...</>
                      ) : (
                        <><Send size={16} /> 메시지 보내기</>
                      )}
                    </button>
                    <span className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground/60 whitespace-nowrap flex-shrink-0">
                      <kbd className="font-mono bg-muted border border-border px-1 py-0.5 rounded text-[9px]">Ctrl</kbd>
                      +
                      <kbd className="font-mono bg-muted border border-border px-1 py-0.5 rounded text-[9px]">↵</kbd>
                    </span>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
