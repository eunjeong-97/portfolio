"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useMemo, useEffect } from "react";
import { Mail, Github, FileText, Send, Copy, Check, Loader2, AlertCircle } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

const MESSAGE_TEMPLATES = [
  { label: "채용 문의", text: "안녕하세요! 채용 포지션과 관련하여 연락드립니다. 박은정님의 경력과 포트폴리오에 관심이 생겨서요." },
  { label: "협업 제안", text: "안녕하세요! 프로젝트 협업을 제안드리고 싶어서 연락드립니다." },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTACT_HEADER_INITIAL = { opacity: 0, y: 20 } as const;
const CONTACT_HEADER_ANIMATE_IN = { opacity: 1, y: 0 } as const;
const SUCCESS_INITIAL = { opacity: 0, scale: 0.9 } as const;
const SUCCESS_ANIMATE = { opacity: 1, scale: 1 } as const;
const SUCCESS_ICON_INITIAL = { scale: 0 } as const;
const SUCCESS_ICON_ANIMATE = { scale: 1 } as const;
const ERROR_TOAST_INITIAL = { opacity: 0, y: -4 } as const;
const ERROR_TOAST_ANIMATE = { opacity: 1, y: 0 } as const;
const CONTACT_LINK_INITIAL = { opacity: 0, x: -20 } as const;
const CONTACT_LEFT_INITIAL = { opacity: 0, x: -30 } as const;
const CONTACT_RIGHT_INITIAL = { opacity: 0, x: 30 } as const;
const CONTACT_ANIMATE_IN = { opacity: 1, x: 0 } as const;
const INITIAL_FORM = { name: "", email: "", message: "" };
const INITIAL_TOUCHED = { name: false, email: false, message: false };

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
  const { copied, copy: copyEmail } = useCopyToClipboard();
  const [formState, setFormState] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const hadSentRef = useRef(false);

  useEffect(() => {
    if (sent) {
      hadSentRef.current = true;
    } else if (hadSentRef.current) {
      nameInputRef.current?.focus();
    }
  }, [sent]);

  const emailValid = useMemo(() => EMAIL_REGEX.test(formState.email), [formState.email]);
  const isFormValid = formState.name.length >= 2 && emailValid && formState.message.length >= 10;
  const fieldStatus = useMemo(() => ({
    name: touched.name ? (formState.name.length >= 2 ? "valid" : "error") : "idle",
    email: touched.email ? (emailValid ? "valid" : "error") : "idle",
    message: touched.message ? (formState.message.length >= 10 ? "valid" : "error") : "idle",
  }), [touched, formState.name, formState.message, emailValid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError(false);
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
      if (res.ok) {
        setSent(true);
      } else {
        setSendError(true);
      }
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-section-bg" ref={ref} aria-label="연락하기">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={CONTACT_HEADER_INITIAL}
          animate={isInView ? CONTACT_HEADER_ANIMATE_IN : {}}
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
            initial={CONTACT_LEFT_INITIAL}
            animate={isInView ? CONTACT_ANIMATE_IN : {}}
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
                  initial={CONTACT_LINK_INITIAL}
                  animate={isInView ? CONTACT_ANIMATE_IN : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-section-bg rounded-xl border border-border hover:border-primary transition-colors group"
                >
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={link.href.startsWith("http") ? `${link.label} (새 탭에서 열림)` : undefined}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0" aria-hidden="true">
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
                    <>
                      <button
                        onClick={() => copyEmail("beanlove97@gmail.com")}
                        className="flex-shrink-0 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                        aria-label={copied ? "이메일 복사 완료" : "이메일 복사"}
                      >
                        {copied ? <Check size={16} className="text-green-400" aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                      </button>
                      <span role="status" className="sr-only">{copied ? "이메일이 클립보드에 복사되었습니다" : ""}</span>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={CONTACT_RIGHT_INITIAL}
            animate={isInView ? CONTACT_ANIMATE_IN : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            {/* 구직 상태 카드 */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse motion-reduce:animate-none flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold text-green-400 text-sm">현재 구직 중 · 즉시 합류 가능</p>
                <p className="text-xs text-muted-foreground mt-0.5"><span aria-hidden="true">📬</span> 24시간 이내 답변드립니다</p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-section-bg p-6 rounded-2xl border border-border">
              {sent ? (
                <motion.div
                  initial={SUCCESS_INITIAL}
                  animate={SUCCESS_ANIMATE}
                  transition={{ duration: 0.4, type: "spring" }}
                  role="status"
                  className="text-center py-8"
                >
                  <motion.div
                    initial={SUCCESS_ICON_INITIAL}
                    animate={SUCCESS_ICON_ANIMATE}
                    transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    aria-hidden="true"
                  >
                    <Check size={30} className="text-green-400" />
                  </motion.div>
                  <h4 className="font-semibold mb-2 text-lg">메시지를 보냈습니다!</h4>
                  <p className="text-sm text-muted-foreground mb-4">빠르게 답변드리겠습니다. (24시간 이내)</p>
                  <button
                    onClick={() => { setSent(false); setFormState(INITIAL_FORM); setTouched(INITIAL_TOUCHED); }}
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
                      {MESSAGE_TEMPLATES.map(({ label, text }) => (
                        <button
                          key={label}
                          type="button"
                          aria-label={`${label} 템플릿으로 메시지 채우기`}
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
                        <label htmlFor="contact-name" className="text-xs text-muted-foreground">이름</label>
                        {fieldStatus.name === "error" && (
                          <span id="name-error" className="flex items-center gap-1 text-[10px] text-red-400" role="alert">
                            <AlertCircle size={10} aria-hidden="true" /> 2자 이상 입력해주세요
                          </span>
                        )}
                        {fieldStatus.name === "valid" && <Check size={12} className="text-green-400" aria-hidden="true" />}
                      </div>
                      <input
                        ref={nameInputRef}
                        id="contact-name"
                        type="text"
                        required
                        autoComplete="name"
                        maxLength={50}
                        value={formState.name}
                        onChange={(e) => setFormState(f => ({ ...f, name: e.target.value }))}
                        onBlur={() => setTouched(t => ({ ...t, name: true }))}
                        placeholder="홍길동"
                        aria-invalid={fieldStatus.name === "error"}
                        aria-describedby={fieldStatus.name === "error" ? "name-error" : undefined}
                        className={`w-full bg-muted text-foreground placeholder:text-muted-foreground text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                          fieldStatus.name === "error" ? "border-red-400/50" : fieldStatus.name === "valid" ? "border-green-400/50" : "border-border"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="contact-email" className="text-xs text-muted-foreground">이메일</label>
                        {fieldStatus.email === "error" && (
                          <span id="email-error" className="flex items-center gap-1 text-[10px] text-red-400" role="alert">
                            <AlertCircle size={10} aria-hidden="true" /> 올바른 이메일 형식
                          </span>
                        )}
                        {fieldStatus.email === "valid" && <Check size={12} className="text-green-400" aria-hidden="true" />}
                      </div>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        autoComplete="email"
                        maxLength={100}
                        value={formState.email}
                        onChange={(e) => setFormState(f => ({ ...f, email: e.target.value }))}
                        onBlur={() => setTouched(t => ({ ...t, email: true }))}
                        placeholder="example@email.com"
                        aria-invalid={fieldStatus.email === "error"}
                        aria-describedby={fieldStatus.email === "error" ? "email-error" : undefined}
                        className={`w-full bg-muted text-foreground placeholder:text-muted-foreground text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                          fieldStatus.email === "error" ? "border-red-400/50" : fieldStatus.email === "valid" ? "border-green-400/50" : "border-border"
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <label htmlFor="contact-message" className="text-xs text-muted-foreground">메시지</label>
                        {fieldStatus.message === "valid" && <Check size={12} className="text-green-400" aria-hidden="true" />}
                        {fieldStatus.message === "error" && (
                          <span id="message-error" className="flex items-center gap-1 text-[10px] text-red-400" role="alert">
                            <AlertCircle size={10} aria-hidden="true" /> 10자 이상 입력해주세요
                          </span>
                        )}
                      </div>
                      <span
                        id="message-count"
                        className={`text-xs ${formState.message.length > 450 ? "text-red-400" : "text-muted-foreground/60"}`}
                        aria-live="polite"
                        aria-atomic="true"
                        aria-label={`${formState.message.length}자 / 최대 500자`}
                      >
                        {formState.message.length}/500
                      </span>
                    </div>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      minLength={10}
                      maxLength={500}
                      value={formState.message}
                      onChange={(e) => setFormState(f => ({ ...f, message: e.target.value }))}
                      onBlur={() => setTouched(t => ({ ...t, message: true }))}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                          e.currentTarget.form?.requestSubmit();
                        }
                      }}
                      placeholder="안녕하세요! 함께 일하고 싶어서 연락드립니다..."
                      aria-invalid={fieldStatus.message === "error"}
                      aria-describedby={
                        fieldStatus.message === "error"
                          ? "message-error message-count"
                          : "message-count"
                      }
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
                        <><Loader2 size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> 전송 중...</>
                      ) : (
                        <><Send size={16} aria-hidden="true" /> 메시지 보내기</>
                      )}
                    </button>
                    <span className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground/60 whitespace-nowrap flex-shrink-0" aria-hidden="true">
                      <kbd className="font-mono bg-muted border border-border px-1 py-0.5 rounded text-[9px]">Ctrl</kbd>
                      +
                      <kbd className="font-mono bg-muted border border-border px-1 py-0.5 rounded text-[9px]">↵</kbd>
                    </span>
                  </div>
                  {sendError && (
                    <motion.div
                      initial={ERROR_TOAST_INITIAL}
                      animate={ERROR_TOAST_ANIMATE}
                      className="flex items-center justify-between gap-2 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
                      role="alert"
                    >
                      <div className="flex items-center gap-1.5 text-red-400">
                        <AlertCircle size={12} aria-hidden="true" />
                        <span>전송에 실패했습니다. 이메일로 직접 보내주세요.</span>
                      </div>
                      <a
                        href={`mailto:beanlove97@gmail.com?subject=${encodeURIComponent(`포트폴리오 문의: ${formState.name}`)}&body=${encodeURIComponent(formState.message)}`}
                        className="text-primary hover:text-primary-light underline underline-offset-2 whitespace-nowrap flex-shrink-0 transition-colors"
                      >
                        이메일 앱 열기
                      </a>
                    </motion.div>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
