// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useFocusTrap } from "./useFocusTrap";

function makeTabEvent(shiftKey = false) {
  return new KeyboardEvent("keydown", { key: "Tab", shiftKey, bubbles: true, cancelable: true });
}

describe("useFocusTrap", () => {
  it("wraps Tab from last focusable element back to first", () => {
    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");
    container.append(btn1, btn2);
    document.body.appendChild(container);
    btn2.focus();

    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const focusSpy = vi.spyOn(btn1, "focus");
    const e = makeTabEvent(false);
    window.dispatchEvent(e);
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("wraps Shift+Tab from first focusable element back to last", () => {
    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");
    container.append(btn1, btn2);
    document.body.appendChild(container);
    btn1.focus();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const focusSpy = vi.spyOn(btn2, "focus");
    const e = makeTabEvent(true);
    window.dispatchEvent(e);
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("does not intercept Tab when trap is inactive", () => {
    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");
    container.append(btn1, btn2);
    document.body.appendChild(container);
    btn2.focus();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, false);
      return ref;
    });

    const focusSpy = vi.spyOn(btn1, "focus");
    window.dispatchEvent(makeTabEvent(false));
    expect(focusSpy).not.toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("does nothing when the container has no focusable elements", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    expect(() => window.dispatchEvent(makeTabEvent(false))).not.toThrow();
    document.body.removeChild(container);
  });

  it("does not redirect Tab when focus is not at a boundary", () => {
    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");
    const btn3 = document.createElement("button");
    container.append(btn1, btn2, btn3);
    document.body.appendChild(container);
    btn2.focus(); // middle element

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const firstSpy = vi.spyOn(btn1, "focus");
    const lastSpy = vi.spyOn(btn3, "focus");
    window.dispatchEvent(makeTabEvent(false));
    expect(firstSpy).not.toHaveBeenCalled();
    expect(lastSpy).not.toHaveBeenCalled();
    document.body.removeChild(container);
  });
});
