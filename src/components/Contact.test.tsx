// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { AUTHOR_EMAIL } from "@/constants/site";

class MockIntersectionObserver {
  constructor(private cb: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}

const copyMock = vi.fn();
let copiedValue = false;
vi.mock("@/hooks/useCopyToClipboard", () => ({
  useCopyToClipboard: () => ({ copied: copiedValue, copy: copyMock }),
}));

import Contact from "./Contact";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  copiedValue = false;
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function fillForm({ name, email, message }: { name: string; email: string; message: string }) {
  fireEvent.change(screen.getByLabelText("이름"), { target: { value: name } });
  fireEvent.change(screen.getByLabelText("이메일"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("메시지"), { target: { value: message } });
}

describe("Contact", () => {
  it("renders the contact section and 'Get In Touch' heading", () => {
    render(<Contact />);
    expect(screen.getByRole("region", { name: "연락하기" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Get In Touch", level: 2 })).toBeInTheDocument();
  });

  it("renders name, email, and message form fields", () => {
    render(<Contact />);
    expect(screen.getByLabelText("이름")).toBeInTheDocument();
    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
    expect(screen.getByLabelText("메시지")).toBeInTheDocument();
  });

  it("disables the submit button when the form is empty", () => {
    render(<Contact />);
    expect(screen.getByRole("button", { name: /메시지 보내기/ })).toBeDisabled();
  });

  it("enables the submit button once name, email, and message are all valid", () => {
    render(<Contact />);
    fillForm({ name: "홍길동", email: "test@example.com", message: "안녕하세요 협업 제안드립니다." });
    expect(screen.getByRole("button", { name: /메시지 보내기/ })).toBeEnabled();
  });

  it("keeps the submit button disabled when the email is invalid", () => {
    render(<Contact />);
    fillForm({ name: "홍길동", email: "not-an-email", message: "안녕하세요 협업 제안드립니다." });
    expect(screen.getByRole("button", { name: /메시지 보내기/ })).toBeDisabled();
  });

  it("shows an email-format error alert after blurring an invalid email", () => {
    render(<Contact />);
    const email = screen.getByLabelText("이메일");
    fireEvent.change(email, { target: { value: "bad" } });
    fireEvent.blur(email);
    expect(screen.getByRole("alert")).toHaveTextContent("올바른 이메일 형식");
    expect(email).toHaveAttribute("aria-invalid", "true");
  });

  it("fills the message textarea when a quick-template button is clicked", () => {
    render(<Contact />);
    fireEvent.click(screen.getByRole("button", { name: /협업 제안 템플릿/ }));
    expect((screen.getByLabelText("메시지") as HTMLTextAreaElement).value).toContain("협업");
  });

  it("updates the character counter as the message changes", () => {
    render(<Contact />);
    fireEvent.change(screen.getByLabelText("메시지"), { target: { value: "hello" } });
    expect(screen.getByText("5/500")).toBeInTheDocument();
  });

  it("copies the author email when the copy button is clicked", () => {
    render(<Contact />);
    fireEvent.click(screen.getByRole("button", { name: "이메일 복사" }));
    expect(copyMock).toHaveBeenCalledWith(AUTHOR_EMAIL);
  });

  it("shows a success message after a successful submit", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    render(<Contact />);
    fillForm({ name: "홍길동", email: "test@example.com", message: "안녕하세요 협업 제안드립니다." });
    fireEvent.click(screen.getByRole("button", { name: /메시지 보내기/ }));
    expect(await screen.findByText("메시지를 보냈습니다!")).toBeInTheDocument();
  });

  it("shows an error toast when the submit request fails (non-ok response)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    render(<Contact />);
    fillForm({ name: "홍길동", email: "test@example.com", message: "안녕하세요 협업 제안드립니다." });
    fireEvent.click(screen.getByRole("button", { name: /메시지 보내기/ }));
    await waitFor(() =>
      expect(screen.getByText(/전송에 실패했습니다/)).toBeInTheDocument()
    );
  });

  it("shows an error toast when fetch rejects (network error)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    render(<Contact />);
    fillForm({ name: "홍길동", email: "test@example.com", message: "안녕하세요 협업 제안드립니다." });
    fireEvent.click(screen.getByRole("button", { name: /메시지 보내기/ }));
    await waitFor(() =>
      expect(screen.getByText(/전송에 실패했습니다/)).toBeInTheDocument()
    );
  });
});
