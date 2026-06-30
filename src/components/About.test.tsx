// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

class MockIntersectionObserver {
  constructor(private cb: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}

vi.mock("@/utils/scrollTo", () => ({ scrollToId: vi.fn() }));
import About from "./About";
import { scrollToId } from "@/utils/scrollTo";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  // reduced motion → useCountUp returns the final value immediately
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

describe("About", () => {
  it("renders the About section landmark and heading", () => {
    render(<About />);
    expect(screen.getByRole("region", { name: "About Me" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "About Me", level: 2 })).toBeInTheDocument();
  });

  it("renders all four highlight stat cards with descriptive labels", () => {
    render(<About />);
    expect(screen.getByRole("img", { name: /Years of Experience: 3\+/ })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Pages Developed: 60\+/ })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Ad SDK Integrations: 5/ })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Platforms: 2/ })).toBeInTheDocument();
  });

  it("encodes each stat's value, suffix, and context in its aria-label", () => {
    render(<About />);
    expect(
      screen.getByRole("img", { name: "Years of Experience: 3+ - 웹·앱 크로스플랫폼 실무 개발" })
    ).toBeInTheDocument();
  });

  it("scrolls to the contact section when the '함께 일해요' CTA is clicked", () => {
    render(<About />);
    fireEvent.click(screen.getByRole("link", { name: /함께 일해요/ }));
    expect(scrollToId).toHaveBeenCalledWith("contact");
  });

  it("scrolls to the projects section when the '프로젝트 보기' CTA is clicked", () => {
    render(<About />);
    fireEvent.click(screen.getByRole("link", { name: "프로젝트 보기" }));
    expect(scrollToId).toHaveBeenCalledWith("projects");
  });

  it("renders the four development principles", () => {
    render(<About />);
    for (const label of ["근본 원인 파악", "공식 문서 우선", "자기주도적 문제 해결", "웹·앱 경계 없는 개발"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("shows the job-seeking availability status", () => {
    render(<About />);
    expect(screen.getByText("현재 구직 중 · 즉시 합류 가능합니다")).toBeInTheDocument();
  });
});
