// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTypewriter } from "./useTypewriter";

const WORDS = ["Hello", "World", "Foo"];

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

function tick(ms: number, times = 1) {
  for (let i = 0; i < times; i++) {
    act(() => { vi.advanceTimersByTime(ms); });
  }
}

beforeEach(() => {
  vi.useFakeTimers();
  mockMatchMedia(false);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("useTypewriter — reduced motion", () => {
  it("immediately returns the first word for displayed when reducedMotion is true", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useTypewriter(WORDS));
    expect(result.current.displayed).toBe("Hello");
  });

  it("immediately returns the first word for completedWord when reducedMotion is true", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useTypewriter(WORDS));
    expect(result.current.completedWord).toBe("Hello");
  });

  it("does not change over time when reducedMotion is true", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useTypewriter(WORDS, 50, 500));
    tick(5000);
    expect(result.current.displayed).toBe("Hello");
  });
});

describe("useTypewriter — animation", () => {
  it("starts with an empty displayed string", () => {
    const { result } = renderHook(() => useTypewriter(WORDS, 100, 500));
    expect(result.current.displayed).toBe("");
  });

  it("starts with an empty completedWord before any word has finished typing", () => {
    const { result } = renderHook(() => useTypewriter(WORDS, 100, 500));
    expect(result.current.completedWord).toBe("");
  });

  it("types one character per speed interval", () => {
    const speed = 100;
    const { result } = renderHook(() => useTypewriter(WORDS, speed, 500));
    tick(speed);
    expect(result.current.displayed).toBe("H");
    tick(speed);
    expect(result.current.displayed).toBe("He");
  });

  it("fully types the first word character by character", () => {
    const speed = 50;
    const word = WORDS[0]; // "Hello" — 5 chars
    const { result } = renderHook(() => useTypewriter(WORDS, speed, 1000));
    tick(speed, word.length);
    expect(result.current.displayed).toBe(word);
  });

  it("sets completedWord after typing the full word and waiting the pause", () => {
    const speed = 50;
    const pause = 500;
    const word = WORDS[0]; // "Hello"
    const { result } = renderHook(() => useTypewriter(WORDS, speed, pause));
    tick(speed, word.length); // type all chars
    tick(pause);              // wait through pause
    expect(result.current.completedWord).toBe(word);
  });

  it("starts deleting after the pause", () => {
    const speed = 50;
    const pause = 500;
    const word = WORDS[0]; // "Hello" — 5 chars
    const { result } = renderHook(() => useTypewriter(WORDS, speed, pause));
    tick(speed, word.length); // type all chars
    tick(pause);               // trigger delete mode
    tick(speed / 2);           // one delete tick
    expect(result.current.displayed.length).toBe(word.length - 1);
  });

  it("advances to the next word after fully deleting", () => {
    const speed = 50;
    const pause = 200;
    const word = WORDS[0]; // "Hello" — 5 chars
    const { result } = renderHook(() => useTypewriter(WORDS, speed, pause));
    tick(speed, word.length);        // type "Hello"
    tick(pause);                     // enter delete mode
    tick(speed / 2, word.length);    // delete all chars (25ms × 5)
    tick(1);                         // 0ms timeout fires — advance to next word
    tick(speed);                     // type first char of "World"
    expect(result.current.displayed).toBe("W");
  });

  it("displayed becomes empty after all characters are deleted", () => {
    const speed = 50;
    const pause = 200;
    const word = WORDS[0]; // "Hello" — 5 chars
    const { result } = renderHook(() => useTypewriter(WORDS, speed, pause));
    tick(speed, word.length);     // type "Hello"
    tick(pause);                  // enter delete mode
    tick(speed / 2, word.length); // delete all 5 chars (25ms × 5)
    expect(result.current.displayed).toBe("");
  });

  it("preserves completedWord during the deletion phase", () => {
    const speed = 50;
    const pause = 200;
    const word = WORDS[0]; // "Hello"
    const { result } = renderHook(() => useTypewriter(WORDS, speed, pause));
    tick(speed, word.length); // type "Hello"
    tick(pause);               // trigger delete mode, completedWord set to "Hello"
    tick(speed / 2);           // one deletion tick
    expect(result.current.completedWord).toBe(word);
  });

  it("keeps completedWord as the previous word while typing the next word", () => {
    const speed = 50;
    const pause = 200;
    const word = WORDS[0]; // "Hello" — 5 chars
    const { result } = renderHook(() => useTypewriter(WORDS, speed, pause));
    tick(speed, word.length);        // type "Hello"
    tick(pause);                     // completedWord = "Hello", enter delete mode
    tick(speed / 2, word.length);    // delete all chars
    tick(1);                         // advance to "World"
    tick(speed);                     // type "W"
    expect(result.current.completedWord).toBe(word); // still "Hello", not "World"
  });

  it("cycles back to the first word when the last word is finished", () => {
    const speed = 50;
    const pause = 200;
    const { result } = renderHook(() => useTypewriter(["Hi"], speed, pause));
    tick(speed, 2);              // type "Hi"
    tick(pause);                 // enter delete mode
    tick(speed / 2, 2);          // delete "Hi"
    tick(1);                     // 0ms timeout: index wraps back to 0
    tick(speed);                 // type first char of "Hi" again
    expect(result.current.displayed).toBe("H");
  });

  it("updates completedWord to the second word after it is fully typed and paused", () => {
    const speed = 50;
    const pause = 200;
    const word1 = WORDS[0]; // "Hello" — 5 chars
    const word2 = WORDS[1]; // "World" — 5 chars
    const { result } = renderHook(() => useTypewriter(WORDS, speed, pause));
    tick(speed, word1.length);         // type "Hello"
    tick(pause);                       // completedWord = "Hello", enter delete mode
    tick(speed / 2, word1.length);     // delete all chars
    tick(1);                           // advance index to 1 ("World")
    tick(speed, word2.length);         // type "World"
    tick(pause);                       // completedWord should now be "World"
    expect(result.current.completedWord).toBe(word2);
  });

  it("immediately advances past an empty-string word without any visible typing or deleting", () => {
    const speed = 50;
    const pause = 200;
    const { result } = renderHook(() => useTypewriter(["", "Hi"], speed, pause));
    // "" has length 0 → typing phase skipped immediately; pause fires setIsDeleting(true)
    tick(pause);
    // displayed.length (0) > 0 is false → 0ms timeout fires; index advances to 1
    tick(1);
    tick(speed); // type first char of "Hi"
    expect(result.current.displayed).toBe("H");
  });

  it("uses the default speed of 90ms per character when speed is not specified", () => {
    const { result } = renderHook(() => useTypewriter(["A"]));
    act(() => { vi.advanceTimersByTime(89); });
    expect(result.current.displayed).toBe(""); // not typed yet at 89ms
    act(() => { vi.advanceTimersByTime(1); });  // 90ms total
    expect(result.current.displayed).toBe("A");
  });

  it("uses the default pause of 2000ms before entering delete mode when not specified", () => {
    const { result } = renderHook(() => useTypewriter(["X"]));
    act(() => { vi.advanceTimersByTime(90); }); // type "X" at default speed 90ms
    expect(result.current.completedWord).toBe("");
    act(() => { vi.advanceTimersByTime(1999); }); // just before pause ends
    expect(result.current.completedWord).toBe("");
    act(() => { vi.advanceTimersByTime(1); }); // 2000ms pause complete
    expect(result.current.completedWord).toBe("X");
  });
});
