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

import ExperienceTimeline from "./ExperienceTimeline";
import { experiences } from "@/data/experiences";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.body.style.overflow = "";
});

describe("ExperienceTimeline", () => {
  it("renders the experience section landmark and heading", () => {
    render(<ExperienceTimeline />);
    expect(screen.getByRole("region", { name: "업무 경험" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Work Experience", level: 2 })).toBeInTheDocument();
  });

  it("renders one detail card per experience", () => {
    render(<ExperienceTimeline />);
    expect(screen.getAllByRole("button", { name: /상세 보기$/ })).toHaveLength(experiences.length);
  });

  it("renders the career gantt chart with an accessible label", () => {
    render(<ExperienceTimeline />);
    expect(screen.getByRole("img", { name: /경력 타임라인/ })).toBeInTheDocument();
  });

  it("does not show the modal until a card is activated", () => {
    render(<ExperienceTimeline />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the experience modal when a card is clicked", () => {
    render(<ExperienceTimeline />);
    fireEvent.click(screen.getByRole("button", { name: `${experiences[0].title} 상세 보기` }));
    expect(screen.getByRole("dialog", { name: experiences[0].title })).toBeInTheDocument();
  });

  it("opens the modal when Enter is pressed on a focused card", () => {
    render(<ExperienceTimeline />);
    const card = screen.getByRole("button", { name: `${experiences[1].title} 상세 보기` });
    fireEvent.keyDown(card, { key: "Enter" });
    expect(screen.getByRole("dialog", { name: experiences[1].title })).toBeInTheDocument();
  });

  it("marks the most recent experience with a '최신' badge", () => {
    render(<ExperienceTimeline />);
    expect(screen.getByText("최신")).toBeInTheDocument();
  });

  it("renders the career summary with the project count", () => {
    render(<ExperienceTimeline />);
    expect(screen.getByText(new RegExp(`${experiences.length}개 주요 프로젝트`))).toBeInTheDocument();
  });
});
