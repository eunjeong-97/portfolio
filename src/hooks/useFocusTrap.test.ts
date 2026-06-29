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

  it("does not throw when the container ref is null", () => {
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useFocusTrap(ref, true);
      return ref;
    });
    expect(() => window.dispatchEvent(makeTabEvent(false))).not.toThrow();
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

  it("wraps Tab from last anchor link back to first focusable element", () => {
    const container = document.createElement("div");
    const link1 = document.createElement("a");
    link1.href = "#";
    const link2 = document.createElement("a");
    link2.href = "#";
    container.append(link1, link2);
    document.body.appendChild(container);
    link2.focus();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const focusSpy = vi.spyOn(link1, "focus");
    window.dispatchEvent(makeTabEvent(false));
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("excludes disabled buttons from the focusable set", () => {
    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    const disabledBtn = document.createElement("button");
    disabledBtn.disabled = true;
    const btn2 = document.createElement("button");
    container.append(btn1, disabledBtn, btn2);
    document.body.appendChild(container);
    btn2.focus(); // last enabled button — should be the boundary

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const focusSpy = vi.spyOn(btn1, "focus");
    window.dispatchEvent(makeTabEvent(false)); // Tab from last → should wrap to btn1
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("excludes elements with tabindex='-1' from the focusable set", () => {
    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    const skipped = document.createElement("div");
    skipped.setAttribute("tabindex", "-1");
    const btn2 = document.createElement("button");
    container.append(btn1, skipped, btn2);
    document.body.appendChild(container);
    btn2.focus(); // last focusable (skipped is not in the set)

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const focusSpy = vi.spyOn(btn1, "focus");
    window.dispatchEvent(makeTabEvent(false));
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("does not intercept non-Tab key presses", () => {
    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");
    container.append(btn1, btn2);
    document.body.appendChild(container);
    btn2.focus();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const focusSpy = vi.spyOn(btn1, "focus");
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(focusSpy).not.toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("includes input elements in the focusable set", () => {
    const container = document.createElement("div");
    const input = document.createElement("input");
    const btn = document.createElement("button");
    container.append(input, btn);
    document.body.appendChild(container);
    btn.focus(); // last focusable

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const focusSpy = vi.spyOn(input, "focus");
    window.dispatchEvent(makeTabEvent(false)); // Tab from last → wrap to input (first)
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("includes [role='button'] elements in the focusable set", () => {
    const container = document.createElement("div");
    const roleBtn = document.createElement("div");
    roleBtn.setAttribute("role", "button");
    const btn = document.createElement("button");
    container.append(roleBtn, btn);
    document.body.appendChild(container);
    btn.focus(); // last focusable

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const focusSpy = vi.spyOn(roleBtn, "focus");
    window.dispatchEvent(makeTabEvent(false)); // Tab from last → wrap to roleBtn (first)
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("includes elements with tabindex='0' in the focusable set", () => {
    const container = document.createElement("div");
    const btn = document.createElement("button");
    const tabbable = document.createElement("div");
    tabbable.setAttribute("tabindex", "0");
    container.append(btn, tabbable);
    document.body.appendChild(container);
    tabbable.focus(); // last focusable

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const focusSpy = vi.spyOn(btn, "focus");
    window.dispatchEvent(makeTabEvent(false)); // Tab from last → wrap to first
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("includes select elements in the focusable set", () => {
    const container = document.createElement("div");
    const select = document.createElement("select");
    const btn = document.createElement("button");
    container.append(select, btn);
    document.body.appendChild(container);
    btn.focus(); // last focusable

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const focusSpy = vi.spyOn(select, "focus");
    window.dispatchEvent(makeTabEvent(false)); // Tab from last → wrap to select (first)
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("includes textarea elements in the focusable set", () => {
    const container = document.createElement("div");
    const textarea = document.createElement("textarea");
    const btn = document.createElement("button");
    container.append(textarea, btn);
    document.body.appendChild(container);
    btn.focus(); // last focusable

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const focusSpy = vi.spyOn(textarea, "focus");
    window.dispatchEvent(makeTabEvent(false)); // Tab from last → wrap to textarea (first)
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("excludes disabled input elements from the focusable set", () => {
    const container = document.createElement("div");
    const disabledInput = document.createElement("input");
    disabledInput.disabled = true;
    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");
    container.append(disabledInput, btn1, btn2);
    document.body.appendChild(container);
    btn2.focus(); // last enabled element

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const disabledSpy = vi.spyOn(disabledInput, "focus");
    const firstSpy = vi.spyOn(btn1, "focus");
    window.dispatchEvent(makeTabEvent(false)); // Tab from last → wrap to btn1 (not disabledInput)
    expect(disabledSpy).not.toHaveBeenCalled();
    expect(firstSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("cycles focus back to itself when only one focusable element exists and Tab is pressed", () => {
    const container = document.createElement("div");
    const btn = document.createElement("button");
    container.append(btn);
    document.body.appendChild(container);
    btn.focus();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const focusSpy = vi.spyOn(btn, "focus");
    window.dispatchEvent(makeTabEvent(false));
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("cycles focus back to itself when only one focusable element exists and Shift+Tab is pressed", () => {
    const container = document.createElement("div");
    const btn = document.createElement("button");
    container.append(btn);
    document.body.appendChild(container);
    btn.focus();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const focusSpy = vi.spyOn(btn, "focus");
    window.dispatchEvent(makeTabEvent(true));
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("excludes [role='button'] elements with a disabled attribute from the focusable set", () => {
    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    const disabledRoleBtn = document.createElement("div");
    disabledRoleBtn.setAttribute("role", "button");
    disabledRoleBtn.setAttribute("disabled", "");
    const btn2 = document.createElement("button");
    container.append(btn1, disabledRoleBtn, btn2);
    document.body.appendChild(container);
    btn2.focus(); // last enabled button

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const disabledSpy = vi.spyOn(disabledRoleBtn, "focus");
    const firstSpy = vi.spyOn(btn1, "focus");
    window.dispatchEvent(makeTabEvent(false)); // Tab from last → wrap to btn1, not disabledRoleBtn
    expect(disabledSpy).not.toHaveBeenCalled();
    expect(firstSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("does not redirect Shift+Tab when focus is at a middle element (not the boundary)", () => {
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

    const lastSpy = vi.spyOn(btn3, "focus");
    const firstSpy = vi.spyOn(btn1, "focus");
    window.dispatchEvent(makeTabEvent(true)); // Shift+Tab from middle — no wrap
    expect(firstSpy).not.toHaveBeenCalled();
    expect(lastSpy).not.toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("excludes anchor elements without an href attribute from the focusable set", () => {
    const container = document.createElement("div");
    const anchorNoHref = document.createElement("a"); // no href → excluded by [href] selector
    const btn = document.createElement("button");
    container.append(anchorNoHref, btn);
    document.body.appendChild(container);
    btn.focus(); // btn is both first and last (anchorNoHref excluded)

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const anchorSpy = vi.spyOn(anchorNoHref, "focus");
    // If anchorNoHref were included it would receive focus as the first element
    window.dispatchEvent(makeTabEvent(false));
    expect(anchorSpy).not.toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("calls preventDefault on the Tab event when focus wraps from last to first", () => {
    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");
    container.append(btn1, btn2);
    document.body.appendChild(container);
    btn2.focus();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
      useFocusTrap(ref, true);
      return ref;
    });

    const event = makeTabEvent(false);
    const preventSpy = vi.spyOn(event, "preventDefault");
    window.dispatchEvent(event);
    expect(preventSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("stops trapping focus when active changes from true to false", () => {
    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");
    container.append(btn1, btn2);
    document.body.appendChild(container);
    btn2.focus();

    const { rerender } = renderHook(
      ({ active }: { active: boolean }) => {
        const ref = useRef<HTMLDivElement>(container as HTMLDivElement);
        useFocusTrap(ref, active);
      },
      { initialProps: { active: true } }
    );

    const focusSpy = vi.spyOn(btn1, "focus");
    window.dispatchEvent(makeTabEvent(false)); // active: wraps to btn1
    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockClear(); // reset call count before testing inactive state

    rerender({ active: false });
    window.dispatchEvent(makeTabEvent(false)); // inactive: no wrap
    expect(focusSpy).not.toHaveBeenCalled();
    document.body.removeChild(container);
  });
});
