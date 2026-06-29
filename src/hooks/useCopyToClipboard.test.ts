// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCopyToClipboard } from "./useCopyToClipboard";

beforeEach(() => {
  vi.useFakeTimers();
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
    writable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("useCopyToClipboard", () => {
  it("starts with copied = false", () => {
    const { result } = renderHook(() => useCopyToClipboard());
    expect(result.current.copied).toBe(false);
  });

  it("sets copied = true after a successful copy", async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => { await result.current.copy("hello"); });
    expect(result.current.copied).toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
  });

  it("resets copied to false after the reset delay", async () => {
    const { result } = renderHook(() => useCopyToClipboard(500));
    await act(async () => { await result.current.copy("hello"); });
    expect(result.current.copied).toBe(true);
    act(() => { vi.advanceTimersByTime(500); });
    expect(result.current.copied).toBe(false);
  });

  it("does not reset before the delay elapses", async () => {
    const { result } = renderHook(() => useCopyToClipboard(500));
    await act(async () => { await result.current.copy("hello"); });
    act(() => { vi.advanceTimersByTime(499); });
    expect(result.current.copied).toBe(true);
  });

  it("does not throw when clipboard is unavailable", async () => {
    navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error("not allowed"));
    const { result } = renderHook(() => useCopyToClipboard());
    await expect(act(async () => { await result.current.copy("hello"); })).resolves.not.toThrow();
    expect(result.current.copied).toBe(false);
  });

  it("clears the pending reset timer on unmount without throwing", async () => {
    const { result, unmount } = renderHook(() => useCopyToClipboard(1000));
    await act(async () => { await result.current.copy("hello"); });
    expect(result.current.copied).toBe(true);
    expect(() => unmount()).not.toThrow();
  });

  it("calls the clipboard API with an empty string and sets copied=true", async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => { await result.current.copy(""); });
    expect(result.current.copied).toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("");
  });

  it("resets copied immediately when resetMs is 0", async () => {
    const { result } = renderHook(() => useCopyToClipboard(0));
    await act(async () => { await result.current.copy("text"); });
    expect(result.current.copied).toBe(true);
    act(() => { vi.advanceTimersByTime(0); });
    expect(result.current.copied).toBe(false);
  });

  it("restarts the reset timer when copy is called a second time before the delay elapses", async () => {
    const { result } = renderHook(() => useCopyToClipboard(500));
    await act(async () => { await result.current.copy("first"); });
    act(() => { vi.advanceTimersByTime(400); });
    expect(result.current.copied).toBe(true);
    // Copy again, resetting the 500ms timer
    await act(async () => { await result.current.copy("second"); });
    act(() => { vi.advanceTimersByTime(400); });
    // 400ms into the new timer — should still be true
    expect(result.current.copied).toBe(true);
    act(() => { vi.advanceTimersByTime(100); });
    // 500ms total from second copy — should now be false
    expect(result.current.copied).toBe(false);
  });

  it("does not throw when navigator.clipboard is undefined", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    const { result } = renderHook(() => useCopyToClipboard());
    await expect(
      act(async () => { await result.current.copy("text"); })
    ).resolves.not.toThrow();
    expect(result.current.copied).toBe(false);
  });
});
