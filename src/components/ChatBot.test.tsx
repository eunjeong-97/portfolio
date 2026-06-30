// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { AUTHOR_NAME } from "@/constants/site";

// Force reduced motion so the typewriter renders replies instantly and starts no
// setInterval — a leaked typewriter timer otherwise bleeds across tests.
vi.mock("@/hooks/useReducedMotion", () => ({ useReducedMotion: () => true }));

import ChatBot from "./ChatBot";

function openChat() {
  fireEvent.click(screen.getByRole("button", { name: /채팅 도우미 열기/ }));
}

function mockChatReply(message: string) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ message }) }));
}

// The assistant reply renders into the role="log" region; assert on its text content
// (robust against the dangerouslySetInnerHTML span wrapping under full-suite timing).
async function expectChatLogToContain(text: string) {
  await waitFor(
    () => {
      const log = document.querySelector('[role="log"]');
      expect(log?.textContent ?? "").toContain(text);
    },
    { timeout: 3000 }
  );
}

beforeEach(() => {
  localStorage.clear();
  // jsdom does not implement scrollIntoView; the chat scrolls to the latest message on open
  Element.prototype.scrollIntoView = vi.fn();
  // reduced motion → TypewriterText renders the full markdown immediately
  Object.defineProperty(window, "matchMedia", {
    value: vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
    configurable: true,
    writable: true,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe("ChatBot", () => {
  it("renders the toggle button collapsed with no dialog initially", () => {
    render(<ChatBot />);
    const toggle = screen.getByRole("button", { name: /채팅 도우미 열기/ });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the chat dialog when the toggle button is clicked", () => {
    render(<ChatBot />);
    openChat();
    expect(screen.getByRole("dialog", { name: "포트폴리오 도우미" })).toBeInTheDocument();
  });

  it("opens the chat when the 'c' key is pressed", () => {
    render(<ChatBot />);
    fireEvent.keyDown(window, { key: "c" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes the chat when Escape is pressed (toggle aria-expanded returns to false)", () => {
    render(<ChatBot />);
    openChat();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    // The toggle's aria-expanded reflects isOpen synchronously (dialog itself lingers during exit animation)
    expect(screen.getByRole("button", { name: /채팅 도우미 열기/ })).toHaveAttribute("aria-expanded", "false");
  });

  it("shows the welcome message and suggestion prompts", () => {
    render(<ChatBot />);
    openChat();
    expect(screen.getByText(new RegExp(`${AUTHOR_NAME}의 포트폴리오 도우미입니다`))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /가장 자랑스러운 프로젝트는\? 메시지 보내기/ })).toBeInTheDocument();
  });

  it("disables the send button while the input is empty", () => {
    render(<ChatBot />);
    openChat();
    expect(screen.getByRole("button", { name: "메시지 전송" })).toBeDisabled();
  });

  it("sends a typed message and renders the assistant reply", async () => {
    mockChatReply("React Native 경험이 많습니다.");
    render(<ChatBot />);
    openChat();
    const input = screen.getByLabelText("메시지 입력");
    fireEvent.change(input, { target: { value: "RN 경험 있나요?" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("RN 경험 있나요?")).toBeInTheDocument(); // user message
    await expectChatLogToContain("React Native 경험이 많습니다."); // assistant reply
    expect(fetch).toHaveBeenCalledWith("/api/chat", expect.objectContaining({ method: "POST" }));
  });

  it("sends a suggestion when its button is clicked", async () => {
    mockChatReply("가장 자랑스러운 프로젝트는 앱 재개발입니다.");
    render(<ChatBot />);
    openChat();
    fireEvent.click(screen.getByRole("button", { name: /가장 자랑스러운 프로젝트는\? 메시지 보내기/ }));
    await expectChatLogToContain("가장 자랑스러운 프로젝트는 앱 재개발입니다.");
  });

  it("shows an error reply when the chat request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    render(<ChatBot />);
    openChat();
    const input = screen.getByLabelText("메시지 입력");
    fireEvent.change(input, { target: { value: "안녕" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await expectChatLogToContain("오류가 발생했습니다");
  });

  it("resets the conversation back to the welcome message", async () => {
    mockChatReply("응답입니다.");
    render(<ChatBot />);
    openChat();
    const input = screen.getByLabelText("메시지 입력");
    fireEvent.change(input, { target: { value: "질문" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await expectChatLogToContain("응답입니다.");
    fireEvent.click(screen.getByRole("button", { name: "대화 초기화" }));
    expect(screen.queryByText("질문")).not.toBeInTheDocument();
    // Suggestions reappear once only the welcome message remains
    expect(screen.getByRole("button", { name: /가장 자랑스러운 프로젝트는\? 메시지 보내기/ })).toBeInTheDocument();
  });

  it("restores a persisted conversation from localStorage", () => {
    localStorage.setItem(
      "chatbot_messages",
      JSON.stringify([
        { role: "assistant", content: "이전 환영 메시지" },
        { role: "user", content: "저장된 질문" },
      ])
    );
    render(<ChatBot />);
    openChat();
    expect(screen.getByText("저장된 질문")).toBeInTheDocument();
  });
});
