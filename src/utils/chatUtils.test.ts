import { describe, it, expect } from "vitest";
import { deserializeChatMessages, typewriterSpeed } from "./chatUtils";

describe("deserializeChatMessages", () => {
  it("returns null for a non-array value", () => {
    expect(deserializeChatMessages(null)).toBeNull();
    expect(deserializeChatMessages("string")).toBeNull();
    expect(deserializeChatMessages(42)).toBeNull();
    expect(deserializeChatMessages({})).toBeNull();
  });

  it("returns null for an empty array", () => {
    expect(deserializeChatMessages([])).toBeNull();
  });

  it("converts a timestamp string to a Date object", () => {
    const isoStr = "2024-06-15T12:00:00.000Z";
    const result = deserializeChatMessages([{ role: "user", content: "hi", timestamp: isoStr }]);
    expect(result).not.toBeNull();
    expect(result![0].timestamp).toBeInstanceOf(Date);
    expect(result![0].timestamp!.toISOString()).toBe(isoStr);
  });

  it("leaves timestamp as undefined when absent in the serialized message", () => {
    const result = deserializeChatMessages([{ role: "assistant", content: "hello" }]);
    expect(result).not.toBeNull();
    expect(result![0].timestamp).toBeUndefined();
  });

  it("passes through role and content unchanged", () => {
    const result = deserializeChatMessages([{ role: "user", content: "test message" }]);
    expect(result).not.toBeNull();
    expect(result![0].role).toBe("user");
    expect(result![0].content).toBe("test message");
  });

  it("handles multiple messages in order", () => {
    const input = [
      { role: "user", content: "first" },
      { role: "assistant", content: "second" },
    ];
    const result = deserializeChatMessages(input);
    expect(result).toHaveLength(2);
    expect(result![0].content).toBe("first");
    expect(result![1].content).toBe("second");
  });

  it("handles a message where timestamp is explicitly undefined", () => {
    const result = deserializeChatMessages([{ role: "user", content: "hi", timestamp: undefined }]);
    expect(result).not.toBeNull();
    expect(result![0].timestamp).toBeUndefined();
  });
});

describe("typewriterSpeed", () => {
  it("returns 18 (the maximum) for content length of 0", () => {
    expect(typewriterSpeed(0)).toBe(18);
  });

  it("returns 18 (the maximum) for very short content (1 char)", () => {
    expect(typewriterSpeed(1)).toBe(18);
  });

  it("returns the computed speed for mid-range content (200 chars → 15ms)", () => {
    expect(typewriterSpeed(200)).toBe(15);
  });

  it("returns 4 (the minimum) for very long content (750 chars)", () => {
    expect(typewriterSpeed(750)).toBe(4);
  });

  it("returns 4 (the minimum) for extremely long content (10000 chars)", () => {
    expect(typewriterSpeed(10000)).toBe(4);
  });

  it("clamps speed to 18 for content shorter than the upper threshold (~166 chars)", () => {
    expect(typewriterSpeed(100)).toBe(18);
  });

  it("returns the correct speed for exactly 300 chars (3000/300 = 10)", () => {
    expect(typewriterSpeed(300)).toBe(10);
  });
});
