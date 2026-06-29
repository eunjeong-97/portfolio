// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountUp } from "./useCountUp";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    value: vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
    configurable: true,
    writable: true,
  });
}

class MockRaf {
  private callbacks = new Map<number, FrameRequestCallback>();
  private idCounter = 0;

  request(cb: FrameRequestCallback): number {
    const id = ++this.idCounter;
    this.callbacks.set(id, cb);
    return id;
  }

  cancel(id: number): void {
    this.callbacks.delete(id);
  }

  fire(timestamp: number): void {
    const toFire = [...this.callbacks.entries()];
    this.callbacks.clear();
    for (const [, cb] of toFire) {
      act(() => { cb(timestamp); });
    }
  }

  get pendingCount(): number {
    return this.callbacks.size;
  }
}

let raf: MockRaf;

beforeEach(() => {
  raf = new MockRaf();
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => raf.request(cb));
  vi.stubGlobal("cancelAnimationFrame", (id: number) => raf.cancel(id));
  mockMatchMedia(false);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("useCountUp — initial state", () => {
  it("returns 0 when not active", () => {
    const { result } = renderHook(() => useCountUp(100, false));
    expect(result.current).toBe(0);
  });

  it("returns 0 when active but no frames have fired yet", () => {
    const { result } = renderHook(() => useCountUp(100, true));
    expect(result.current).toBe(0);
  });
});

describe("useCountUp — reduced motion", () => {
  it("returns target immediately when reducedMotion is true and active", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useCountUp(42, true));
    expect(result.current).toBe(42);
  });

  it("returns 0 when reducedMotion is true and not active", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useCountUp(42, false));
    expect(result.current).toBe(0);
  });

  it("does not schedule a rAF when reducedMotion is true", () => {
    mockMatchMedia(true);
    renderHook(() => useCountUp(100, true));
    expect(raf.pendingCount).toBe(0);
  });
});

describe("useCountUp — animation setup", () => {
  it("schedules a rAF when active", () => {
    renderHook(() => useCountUp(100, true, 1000));
    expect(raf.pendingCount).toBe(1);
  });

  it("does not schedule a rAF when not active", () => {
    renderHook(() => useCountUp(100, false, 1000));
    expect(raf.pendingCount).toBe(0);
  });

  it("cancels the pending rAF on unmount", () => {
    const { unmount } = renderHook(() => useCountUp(100, true, 1000));
    expect(raf.pendingCount).toBe(1);
    unmount();
    expect(raf.pendingCount).toBe(0);
  });

  it("count is 0 at the very first frame (progress = 0)", () => {
    const { result } = renderHook(() => useCountUp(100, true, 1000));
    raf.fire(0); // startTime = 0, progress = 0, eased = 0
    expect(result.current).toBe(0);
  });

  it("schedules a follow-up frame when progress < 1", () => {
    renderHook(() => useCountUp(100, true, 1000));
    raf.fire(0); // progress = 0 < 1 → another rAF scheduled
    expect(raf.pendingCount).toBe(1);
  });
});

describe("useCountUp — animation progress", () => {
  it("count is non-zero after a mid-animation frame", () => {
    const { result } = renderHook(() => useCountUp(100, true, 1000));
    raf.fire(0);   // startTime = 0, count = 0
    raf.fire(500); // progress = 0.5, eased ≈ 0.875, count = 88
    expect(result.current).toBeGreaterThan(0);
    expect(result.current).toBeLessThan(100);
  });

  it("applies cubic ease-out: count is 88 at 50% of duration (eased = 1 - (1-0.5)^3 = 0.875)", () => {
    const { result } = renderHook(() => useCountUp(100, true, 1000));
    raf.fire(0);   // anchor startTime
    raf.fire(500); // progress = 0.5
    expect(result.current).toBe(88); // Math.round(0.875 * 100) = 88
  });

  it("count equals target when animation is complete (progress = 1)", () => {
    const { result } = renderHook(() => useCountUp(100, true, 1000));
    raf.fire(0);    // anchor startTime
    raf.fire(1000); // progress = 1, eased = 1, count = 100
    expect(result.current).toBe(100);
  });

  it("does not schedule another rAF after animation completes", () => {
    renderHook(() => useCountUp(100, true, 1000));
    raf.fire(0);    // anchor startTime
    raf.fire(1000); // progress = 1 — no more frames needed
    expect(raf.pendingCount).toBe(0);
  });

  it("count reaches target for timestamps beyond the duration", () => {
    const { result } = renderHook(() => useCountUp(50, true, 1000));
    raf.fire(0);
    raf.fire(2000); // progress clamped to 1
    expect(result.current).toBe(50);
  });
});

describe("useCountUp — active state transitions", () => {
  it("cancels the pending rAF when active changes from true to false", () => {
    const { rerender } = renderHook(
      ({ active }: { active: boolean }) => useCountUp(100, active, 1000),
      { initialProps: { active: true } }
    );
    expect(raf.pendingCount).toBe(1);
    rerender({ active: false });
    expect(raf.pendingCount).toBe(0);
  });

  it("schedules a rAF when active changes from false to true", () => {
    const { rerender } = renderHook(
      ({ active }: { active: boolean }) => useCountUp(100, active, 1000),
      { initialProps: { active: false } }
    );
    expect(raf.pendingCount).toBe(0);
    rerender({ active: true });
    expect(raf.pendingCount).toBe(1);
  });
});
