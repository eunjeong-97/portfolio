// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";

const toggleTheme = vi.fn();
let currentTheme: "dark" | "light" = "dark";
vi.mock("./ThemeProvider", () => ({
  useTheme: () => ({ theme: currentTheme, toggleTheme }),
}));

const useActiveSectionMock = vi.fn(() => "");
vi.mock("@/hooks/useActiveSection", () => ({
  useActiveSection: (ids: string[]) => useActiveSectionMock(ids),
}));

vi.mock("@/utils/scrollTo", () => ({ scrollToId: vi.fn() }));

import Navigation from "./Navigation";
import { scrollToId } from "@/utils/scrollTo";

beforeEach(() => {
  currentTheme = "dark";
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  document.body.style.overflow = "";
});

describe("Navigation", () => {
  it("renders the primary navigation landmark", () => {
    render(<Navigation />);
    expect(screen.getByRole("navigation", { name: "주 내비게이션" })).toBeInTheDocument();
  });

  it("renders all desktop nav links", () => {
    render(<Navigation />);
    for (const label of ["Projects", "About", "Skills", "Experience", "GitHub", "Blog", "Contact"]) {
      expect(screen.getAllByRole("link", { name: label }).length).toBeGreaterThan(0);
    }
  });

  it("labels the theme toggle for switching to light mode when in dark mode", () => {
    currentTheme = "dark";
    render(<Navigation />);
    expect(screen.getAllByRole("button", { name: "라이트 모드로 전환" }).length).toBeGreaterThan(0);
  });

  it("labels the theme toggle for switching to dark mode when in light mode", () => {
    currentTheme = "light";
    render(<Navigation />);
    expect(screen.getAllByRole("button", { name: "다크 모드로 전환" }).length).toBeGreaterThan(0);
  });

  it("calls toggleTheme when the theme button is clicked", () => {
    render(<Navigation />);
    fireEvent.click(screen.getAllByRole("button", { name: "라이트 모드로 전환" })[0]);
    expect(toggleTheme).toHaveBeenCalledOnce();
  });

  it("toggles the theme when the 't' key is pressed", () => {
    render(<Navigation />);
    fireEvent.keyDown(window, { key: "t" });
    expect(toggleTheme).toHaveBeenCalledOnce();
  });

  it("does not toggle the theme when 't' is pressed with a modifier key", () => {
    render(<Navigation />);
    fireEvent.keyDown(window, { key: "t", metaKey: true });
    expect(toggleTheme).not.toHaveBeenCalled();
  });

  it("opens the mobile menu when the menu button is clicked (aria-expanded toggles)", () => {
    render(<Navigation />);
    const menuBtn = screen.getByRole("button", { name: "메뉴 열기" });
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(menuBtn);
    expect(screen.getByRole("button", { name: "메뉴 닫기" })).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the mobile menu when Escape is pressed", () => {
    render(<Navigation />);
    fireEvent.click(screen.getByRole("button", { name: "메뉴 열기" }));
    expect(screen.getByRole("button", { name: "메뉴 닫기" })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("button", { name: "메뉴 열기" })).toHaveAttribute("aria-expanded", "false");
  });

  it("marks the active section's desktop link with aria-current='location'", () => {
    useActiveSectionMock.mockReturnValue("about");
    render(<Navigation />);
    const aboutLink = screen.getAllByRole("link", { name: "About" })[0];
    expect(aboutLink).toHaveAttribute("aria-current", "location");
  });

  it("scrolls to the section after a nav link is clicked", () => {
    vi.useFakeTimers();
    try {
      render(<Navigation />);
      fireEvent.click(screen.getAllByRole("link", { name: "Projects" })[0]);
      act(() => { vi.advanceTimersByTime(100); });
      expect(scrollToId).toHaveBeenCalledWith("projects");
    } finally {
      vi.useRealTimers();
    }
  });

  it("renders the resume download link with the correct filename", () => {
    render(<Navigation />);
    const resume = screen.getAllByRole("link", { name: /이력서/ })[0];
    expect(resume).toHaveAttribute("href", "/resume.pdf");
  });
});
