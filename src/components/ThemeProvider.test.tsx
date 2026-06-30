// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeProvider";

function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("light", "dark");
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ThemeProvider", () => {
  it("defaults to the dark theme when nothing is stored", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("reads a stored 'light' theme from localStorage on mount", () => {
    localStorage.setItem("theme", "light");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("falls back to dark when the stored value is invalid", () => {
    localStorage.setItem("theme", "purple");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("toggles from dark to light when toggleTheme is called", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("applies the current theme as a class on the document element", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists the selected theme to localStorage", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("creates a meta[name=theme-color] tag reflecting the theme", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
    expect(meta).not.toBeNull();
    expect(meta!.content).toBe("#0a0a0a"); // dark
    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(meta!.content).toBe("#fafafa"); // light
  });

  it("throws when useTheme is used outside a ThemeProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ThemeConsumer />)).toThrow(
      "useTheme must be used within a ThemeProvider"
    );
  });
});
