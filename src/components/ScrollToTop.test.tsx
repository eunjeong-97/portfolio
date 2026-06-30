// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import ScrollToTop from "./ScrollToTop";

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", { value, configurable: true, writable: true });
}

beforeEach(() => {
  setScrollY(0);
  vi.stubGlobal("scrollTo", vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ScrollToTop", () => {
  it("is hidden when the page is scrolled less than 400px", () => {
    setScrollY(100);
    render(<ScrollToTop />);
    expect(screen.queryByRole("button", { name: "맨 위로 이동" })).not.toBeInTheDocument();
  });

  it("is visible on mount when the page is already scrolled past 400px", () => {
    setScrollY(500);
    render(<ScrollToTop />);
    expect(screen.getByRole("button", { name: "맨 위로 이동" })).toBeInTheDocument();
  });

  it("appears after the user scrolls past the 400px threshold", () => {
    render(<ScrollToTop />);
    expect(screen.queryByRole("button", { name: "맨 위로 이동" })).not.toBeInTheDocument();
    act(() => {
      setScrollY(450);
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByRole("button", { name: "맨 위로 이동" })).toBeInTheDocument();
  });

  it("scrolls smoothly to the top when clicked", () => {
    setScrollY(500);
    render(<ScrollToTop />);
    fireEvent.click(screen.getByRole("button", { name: "맨 위로 이동" }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("removes the scroll listener on unmount (no throw when scrolling after unmount)", () => {
    setScrollY(500);
    const { unmount } = render(<ScrollToTop />);
    unmount();
    expect(() => {
      setScrollY(600);
      window.dispatchEvent(new Event("scroll"));
    }).not.toThrow();
  });
});
