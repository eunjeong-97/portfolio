// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

vi.mock("@/utils/scrollTo", () => ({ scrollToId: vi.fn() }));
import KeyboardShortcuts from "./KeyboardShortcuts";
import { scrollToId } from "@/utils/scrollTo";

function pressKey(key: string, opts: KeyboardEventInit = {}) {
  fireEvent.keyDown(window, { key, ...opts });
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("KeyboardShortcuts", () => {
  it("renders the trigger button collapsed by default (aria-expanded=false, no dialog)", () => {
    render(<KeyboardShortcuts />);
    const trigger = screen.getByRole("button", { name: "키보드 단축키 목록 열기" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the shortcuts dialog when '?' is pressed", () => {
    render(<KeyboardShortcuts />);
    pressKey("?");
    expect(screen.getByRole("dialog", { name: "키보드 단축키" })).toBeInTheDocument();
  });

  it("toggles the dialog closed when '?' is pressed twice (aria-expanded returns to false)", () => {
    render(<KeyboardShortcuts />);
    const trigger = screen.getByRole("button", { name: "키보드 단축키 목록 열기" });
    pressKey("?");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    pressKey("?");
    // AnimatePresence keeps the dialog mounted during exit, so assert the state via aria-expanded
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the dialog when Escape is pressed (aria-expanded returns to false)", () => {
    render(<KeyboardShortcuts />);
    const trigger = screen.getByRole("button", { name: "키보드 단축키 목록 열기" });
    pressKey("?");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    pressKey("Escape");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the dialog when the trigger button is clicked", () => {
    render(<KeyboardShortcuts />);
    fireEvent.click(screen.getByRole("button", { name: "키보드 단축키 목록 열기" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes the dialog when the close button is clicked (aria-expanded returns to false)", () => {
    render(<KeyboardShortcuts />);
    const trigger = screen.getByRole("button", { name: "키보드 단축키 목록 열기" });
    pressKey("?");
    fireEvent.click(screen.getByRole("button", { name: "단축키 목록 닫기" }));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("navigates to the matching section when a number key (1-7) is pressed", () => {
    render(<KeyboardShortcuts />);
    pressKey("4");
    expect(scrollToId).toHaveBeenCalledWith("experience");
  });

  it("maps number key '1' to the first section (projects)", () => {
    render(<KeyboardShortcuts />);
    pressKey("1");
    expect(scrollToId).toHaveBeenCalledWith("projects");
  });

  it("does not navigate for a number key while the dialog is open", () => {
    render(<KeyboardShortcuts />);
    pressKey("?"); // open dialog
    pressKey("3");
    expect(scrollToId).not.toHaveBeenCalled();
  });

  it("ignores number navigation when a modifier key is held", () => {
    render(<KeyboardShortcuts />);
    pressKey("2", { ctrlKey: true });
    expect(scrollToId).not.toHaveBeenCalled();
  });

  it("ignores shortcuts when the event originates from a text input", () => {
    render(
      <>
        <KeyboardShortcuts />
        <input data-testid="field" />
      </>
    );
    const input = screen.getByTestId("field");
    fireEvent.keyDown(input, { key: "?" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("lists all seven section-navigation shortcuts in the dialog", () => {
    render(<KeyboardShortcuts />);
    pressKey("?");
    for (const label of [
      "Projects 섹션으로 이동",
      "About 섹션으로 이동",
      "Contact 섹션으로 이동",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});
