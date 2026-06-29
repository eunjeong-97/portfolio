// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReducedMotion } from "./useReducedMotion";

type ChangeListener = (e: MediaQueryListEvent) => void;

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<ChangeListener>();
  const mql = {
    matches,
    addEventListener: (_: string, fn: ChangeListener) => listeners.add(fn),
    removeEventListener: (_: string, fn: ChangeListener) => listeners.delete(fn),
  };
  Object.defineProperty(window, "matchMedia", {
    value: vi.fn().mockReturnValue(mql),
    configurable: true,
    writable: true,
  });
  return {
    trigger: (newMatches: boolean) => {
      act(() => {
        listeners.forEach((l) => l({ matches: newMatches } as MediaQueryListEvent));
      });
    },
  };
}

afterEach(() => { vi.restoreAllMocks(); });

describe("useReducedMotion", () => {
  it("returns false when the media query does not match", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when the media query matches", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("updates to true when the media query fires a change event", () => {
    const { trigger } = mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
    trigger(true);
    expect(result.current).toBe(true);
  });

  it("updates back to false when the media query reverts", () => {
    const { trigger } = mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
    trigger(false);
    expect(result.current).toBe(false);
  });

  it("removes the event listener on unmount so post-unmount events do not throw", () => {
    const { trigger } = mockMatchMedia(false);
    const { unmount } = renderHook(() => useReducedMotion());
    expect(() => unmount()).not.toThrow();
    expect(() => trigger(true)).not.toThrow();
  });

  it("tracks multiple successive change events in order", () => {
    const { trigger } = mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
    trigger(true);
    expect(result.current).toBe(true);
    trigger(false);
    expect(result.current).toBe(false);
    trigger(true);
    expect(result.current).toBe(true);
  });
});
