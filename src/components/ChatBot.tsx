"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, RotateCcw, Mail, Copy, Check } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  isNew?: boolean;
}

const MAX_INPUT = 200;
const MAX_HISTORY = 20;
const CHAT_PANEL_STYLE = { height: "500px" } as const;

const CHAT_PANEL_INITIAL = { opacity: 0, y: 20, scale: 0.95 } as const;
const CHAT_PANEL_ANIMATE = { opacity: 1, y: 0, scale: 1 } as const;
const CHAT_PANEL_EXIT = { opacity: 0, y: 20, scale: 0.95 } as const;
const BADGE_SCALE_INITIAL = { scale: 0 } as const;
const BADGE_SCALE_ANIMATE = { scale: 1 } as const;
const BADGE_SCALE_EXIT = { scale: 0 } as const;
const CLOSE_ICON_INITIAL = { rotate: -90, opacity: 0 } as const;
const OPEN_ICON_INITIAL = { rotate: 90, opacity: 0 } as const;
const ICON_ANIMATE_IN = { rotate: 0, opacity: 1 } as const;
const CLOSE_ICON_EXIT = { rotate: 90, opacity: 0 } as const;
const OPEN_ICON_EXIT = { rotate: -90, opacity: 0 } as const;
const TOGGLE_BTN_HOVER = { scale: 1.05 } as const;
const TOGGLE_BTN_TAP = { scale: 0.95 } as const;
const ICON_SWAP_TRANSITION = { duration: 0.2 } as const;
const MSG_APPEAR_TRANSITION = { duration: 0.15 } as const;

const SUGGESTIONS = [
  "가장 자랑스러운 프로젝트는?",
  "언제부터 합류 가능한가요?",
  "React Native 경험이 있나요?",
  "이력서 다운로드 위치는?",
];

function TypewriterText({ content, onDone }: { content: string; onDone: () => void }) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const reducedMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(() => reducedMotion);
  const speed = Math.max(4, Math.min(18, Math.round(3000 / content.length)));

  useEffect(() => {
    if (reducedMotion) {
      setDone(true);
      onDoneRef.current();
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(content.slice(0, i));
      if (i >= content.length) {
        clearInterval(interval);
        setDone(true);
        onDoneRef.current();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [content, speed, reducedMotion]);
  if (done) return <span dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />;
  return <span>{displayed}<span className="inline-block w-0.5 h-3.5 bg-foreground/60 ml-0.5 animate-pulse motion-reduce:animate-none align-middle" aria-hidden="true" /></span>;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(text: string) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code class=\"bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs font-mono\">$1</code>")
    .replace(/^- (.+)$/gm, "<li class=\"ml-3 list-disc\">$1</li>")
    .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul class="space-y-0.5 my-1">${m}</ul>`)
    .replace(/\n/g, "<br/>");
}

const WELCOME_CONTENT =
  "안녕하세요! 박은정의 포트폴리오 도우미입니다. 경력, 기술 스택, 프로젝트에 대해 무엇이든 물어보세요! 😊";

function makeWelcome(): Message {
  return { role: "assistant", content: WELCOME_CONTENT, timestamp: new Date() };
}

function formatTime(date?: Date) {
  if (!date) return "";
  return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

const STORAGE_KEY = "chatbot_messages";

function loadMessages(): Message[] {
  if (typeof window === "undefined") return [makeWelcome()];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [makeWelcome()];
    const parsed = JSON.parse(raw) as Array<Omit<Message, "timestamp"> & { timestamp?: string }>;
    if (!Array.isArray(parsed) || parsed.length === 0) return [makeWelcome()];
    return parsed.map((m) => ({ ...m, timestamp: m.timestamp ? new Date(m.timestamp) : undefined }));
  } catch {
    return [makeWelcome()];
  }
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { copied, copy: copyEmail } = useCopyToClipboard();
  const [showNotification, setShowNotification] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const chatModalRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  useFocusTrap(chatModalRef, isOpen);

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      toggleButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (messages.length > 1) {
      try {
        // Strip isNew so messages don't re-animate on next visit
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.map(({ isNew: _, ...m }) => m)));
      } catch {
        // ignore storage errors
      }
    }
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowNotification(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setShowNotification(false);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isOpenRef.current) { setIsOpen(false); return; }
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === "c") setIsOpen((prev) => !prev);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const cancelMessage = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
  };

  const sendMessage = async (text?: string) => {
    const messageText = text ?? input.trim();
    if (!messageText || loading) return;

    const userMessage: Message = { role: "user", content: messageText, timestamp: new Date() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const apiMessages = newMessages.slice(-MAX_HISTORY).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error("API error");
      }
      const data = await res.json();

      const content: string = data.error || data.message;
      setMessages([...newMessages, { role: "assistant", content, timestamp: new Date(), isNew: true }]);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages([
        ...newMessages,
        { role: "assistant", content: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.", timestamp: new Date(), isNew: true },
      ]);
    } finally {
      abortRef.current = null;
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatModalRef}
            role="dialog"
            aria-modal="true"
            aria-label="포트폴리오 도우미 채팅"
            initial={CHAT_PANEL_INITIAL}
            animate={CHAT_PANEL_ANIMATE}
            exit={CHAT_PANEL_EXIT}
            transition={ICON_SWAP_TRANSITION}
            className="mb-4 w-80 sm:w-96 bg-section-bg border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={CHAT_PANEL_STYLE}
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={20} className="text-white" aria-hidden="true" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm">
                      포트폴리오 도우미
                    </p>
                    <span className="text-[9px] bg-white/20 text-white/90 px-1.5 py-0.5 rounded-full font-medium">
                      Gemini AI
                    </span>
                  </div>
                  <p className="text-white/70 text-xs">
                    박은정에 대해 물어보세요
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setMessages([makeWelcome()]); setInput(""); localStorage.removeItem(STORAGE_KEY); }}
                  className="text-white/60 hover:text-white transition-colors p-1"
                  aria-label="대화 초기화"
                  title="대화 초기화"
                >
                  <RotateCcw size={15} aria-hidden="true" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="채팅 닫기"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" role="log" aria-live="polite" aria-label="대화 내용" aria-busy={loading}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1" aria-hidden="true">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      msg.isNew ? (
                        <TypewriterText
                          content={msg.content}
                          onDone={() =>
                            setMessages((prev) =>
                              prev.map((m, idx) => idx === i ? { ...m, isNew: false } : m)
                            )
                          }
                        />
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                      )
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1" aria-hidden="true">
                      <User size={14} className="text-muted-foreground" />
                    </div>
                  )}
                  {msg.timestamp && (
                    <span className={`text-[10px] text-muted-foreground/50 self-end mb-1 ${msg.role === "user" ? "order-first" : ""}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  )}
                </div>
              ))}

              {/* Suggestions */}
              {messages.length === 1 && (
                <div className="space-y-2 pt-1">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      aria-label={`${suggestion} 메시지 보내기`}
                      className="w-full text-left text-xs px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex gap-2 justify-start" role="status" aria-label="응답 생성 중">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-muted px-3 py-2 rounded-2xl rounded-tl-sm" aria-hidden="true">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce motion-reduce:animate-none [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce motion-reduce:animate-none [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce motion-reduce:animate-none [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              {messages.length > 2 && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                  <button
                    onClick={() => copyEmail("beanlove97@gmail.com")}
                    aria-label={copied ? "이메일 복사 완료" : "이메일 주소 복사"}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-muted-foreground hover:text-primary bg-muted hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    {copied ? <Check size={12} className="text-green-400" aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                    {copied ? "복사됨!" : "이메일 복사"}
                  </button>
                  <a
                    href="mailto:beanlove97@gmail.com"
                    aria-label="이메일 앱으로 보내기"
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-muted-foreground hover:text-primary bg-muted hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Mail size={12} aria-hidden="true" />
                    이메일 보내기
                  </a>
                </div>
              )}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <label htmlFor="chatbot-input" className="sr-only">메시지 입력</label>
                  <input
                    id="chatbot-input"
                    ref={inputRef}
                    type="text"
                    value={input}
                    maxLength={MAX_INPUT}
                    onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT))}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="메시지를 입력하세요..."
                    className="w-full bg-muted text-foreground placeholder:text-muted-foreground text-sm px-3 py-2 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={loading}
                    aria-disabled={loading}
                  />
                  {input.length > MAX_INPUT * 0.8 && (
                    <span
                      className={`absolute right-2 bottom-2 text-[10px] ${input.length >= MAX_INPUT ? "text-red-400" : "text-muted-foreground/60"}`}
                      aria-live="polite"
                      aria-label={`${input.length}자 / 최대 ${MAX_INPUT}자`}
                    >
                      {input.length}/{MAX_INPUT}
                    </span>
                  )}
                </div>
                {loading ? (
                  <button
                    onClick={cancelMessage}
                    className="bg-muted hover:bg-red-500/10 hover:text-red-400 text-muted-foreground p-2 rounded-xl transition-colors border border-border"
                    aria-label="응답 취소"
                    title="응답 취소"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim()}
                    className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
                    aria-label="메시지 전송"
                  >
                    <Send size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        ref={toggleButtonRef}
        onClick={() => { setIsOpen(!isOpen); setShowNotification(false); }}
        className="w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center transition-colors relative"
        whileHover={TOGGLE_BTN_HOVER}
        whileTap={TOGGLE_BTN_TAP}
        aria-label={isOpen ? "채팅 닫기" : showNotification ? "채팅 도우미 열기 (새 알림)" : "채팅 도우미 열기"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.span
              initial={BADGE_SCALE_INITIAL}
              animate={BADGE_SCALE_ANIMATE}
              exit={BADGE_SCALE_EXIT}
              aria-hidden="true"
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            >
              <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-ping motion-reduce:animate-none absolute" />
              <span className="w-1.5 h-1.5 bg-white rounded-full relative z-10" />
            </motion.span>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={CLOSE_ICON_INITIAL}
              animate={ICON_ANIMATE_IN}
              exit={CLOSE_ICON_EXIT}
              transition={MSG_APPEAR_TRANSITION}
              aria-hidden="true"
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={OPEN_ICON_INITIAL}
              animate={ICON_ANIMATE_IN}
              exit={OPEN_ICON_EXIT}
              transition={MSG_APPEAR_TRANSITION}
              aria-hidden="true"
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
