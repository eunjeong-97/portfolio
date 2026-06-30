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

import FeaturedProjects from "./FeaturedProjects";
import { projects } from "@/data/projects";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("FeaturedProjects", () => {
  it("renders the projects section landmark and heading", () => {
    render(<FeaturedProjects />);
    expect(screen.getByRole("region", { name: "대표 프로젝트" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "대표 프로젝트", level: 2 })).toBeInTheDocument();
  });

  it("renders one article per project by default", () => {
    render(<FeaturedProjects />);
    expect(screen.getAllByRole("article")).toHaveLength(projects.length);
  });

  it("renders a filter group with the '전체' filter pressed by default", () => {
    render(<FeaturedProjects />);
    const allFilter = screen.getByRole("button", { name: `전체 (${projects.length}개)` });
    expect(allFilter).toHaveAttribute("aria-pressed", "true");
  });

  it("updates aria-pressed state when a different filter is selected", () => {
    render(<FeaturedProjects />);
    const tsFilter = screen.getByRole("button", { name: "TypeScript (1개)" });
    fireEvent.click(tsFilter);
    expect(tsFilter).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: `전체 (${projects.length}개)` })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("announces the filtered count in the live region after filtering", () => {
    render(<FeaturedProjects />);
    fireEvent.click(screen.getByRole("button", { name: "TypeScript (1개)" }));
    // Only app-rebuild carries the TypeScript tag → 1 of 3
    expect(screen.getByText(`1/${projects.length} 프로젝트`)).toBeInTheDocument();
  });

  it("keeps the matching project visible after filtering by its tag", () => {
    render(<FeaturedProjects />);
    fireEvent.click(screen.getByRole("button", { name: "TypeScript (1개)" }));
    expect(screen.getByRole("heading", { name: "마일벌스 앱 전면 재개발", level: 3 })).toBeInTheDocument();
  });

  it("clears the filter back to all projects when '전체' is reselected", () => {
    render(<FeaturedProjects />);
    fireEvent.click(screen.getByRole("button", { name: "TypeScript (1개)" }));
    expect(screen.getByText(`1/${projects.length} 프로젝트`)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: `전체 (${projects.length}개)` }));
    // The live region is blank for the "전체" filter
    expect(screen.queryByText(`1/${projects.length} 프로젝트`)).not.toBeInTheDocument();
  });

  it("filters when a filterable tag chip inside a project card is clicked", () => {
    render(<FeaturedProjects />);
    fireEvent.click(screen.getByRole("button", { name: "Native Module로 필터링" }));
    expect(screen.getByRole("button", { name: "Native Module (1개)" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("links the GitHub CTA externally with safe rel attributes", () => {
    render(<FeaturedProjects />);
    const cta = screen.getByRole("link", { name: /더 많은 프로젝트는 GitHub에서 확인하세요/ });
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });
});
