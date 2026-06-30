// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

class MockIntersectionObserver {
  constructor(private cb: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

// Imported after the IntersectionObserver stub is in place
import Skills from "./Skills";

describe("Skills", () => {
  it("renders the skills section landmark labelled '기술 스택'", () => {
    render(<Skills />);
    expect(screen.getByRole("region", { name: "기술 스택" })).toBeInTheDocument();
  });

  it("renders the 'Tech Stack' heading", () => {
    render(<Skills />);
    expect(screen.getByRole("heading", { name: "Tech Stack", level: 2 })).toBeInTheDocument();
  });

  it("renders the four skill category headings", () => {
    render(<Skills />);
    for (const title of ["Frontend", "Mobile & Native", "UI & Styling", "Tools"]) {
      expect(screen.getByRole("heading", { name: title, level: 3 })).toBeInTheDocument();
    }
  });

  it("shows the total skill count (22 skills across all categories)", () => {
    render(<Skills />);
    // The "22" lives in its own <span> inside "총 22가지 기술"
    expect(screen.getByText("22")).toBeInTheDocument();
  });

  it("renders each skill as an img-role element with a descriptive aria-label", () => {
    render(<Skills />);
    const ts = screen.getByRole("img", { name: /^TypeScript:/ });
    expect(ts).toHaveAttribute("aria-label", "TypeScript: 주요 (실무 프로젝트에서 주도적으로 사용)");
  });

  it("labels a level-1 skill as '경험'", () => {
    render(<Skills />);
    const kotlin = screen.getByRole("img", { name: /^Kotlin:/ });
    expect(kotlin.getAttribute("aria-label")).toContain("경험");
  });

  it("renders all three 'Currently Learning' items", () => {
    render(<Skills />);
    for (const item of ["Next.js App Router (심화)", "Expo Router", "React Native New Architecture"]) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("makes each skill badge keyboard-focusable (tabIndex=0)", () => {
    render(<Skills />);
    const react = screen.getByRole("img", { name: /^React\.js:/ });
    expect(react).toHaveAttribute("tabindex", "0");
  });
});
