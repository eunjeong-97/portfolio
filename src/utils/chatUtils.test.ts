import { describe, it, expect } from "vitest";
import {
  deserializeChatMessages,
  typewriterSpeed,
  validateChatMessages,
  toChatHistory,
  formatTime,
} from "./chatUtils";

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

  it("returns an invalid Date object when timestamp is an unparseable string", () => {
    const result = deserializeChatMessages([{ role: "user", content: "hi", timestamp: "not-a-date" }]);
    expect(result).not.toBeNull();
    expect(result![0].timestamp).toBeInstanceOf(Date);
    expect(isNaN(result![0].timestamp!.getTime())).toBe(true);
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

describe("validateChatMessages", () => {
  const validMsg = { role: "user", content: "hello" };
  const validAssistant = { role: "assistant", content: "hi there" };

  it("returns null for a valid single user message", () => {
    expect(validateChatMessages([validMsg])).toBeNull();
  });

  it("returns null for a valid conversation with both roles", () => {
    expect(validateChatMessages([validMsg, validAssistant])).toBeNull();
  });

  it("returns an error string for a non-array input", () => {
    expect(validateChatMessages(null)).not.toBeNull();
    expect(validateChatMessages("text")).not.toBeNull();
    expect(validateChatMessages({})).not.toBeNull();
  });

  it("returns an error string for an empty array", () => {
    expect(validateChatMessages([])).not.toBeNull();
  });

  it("returns an error string when message count exceeds 20", () => {
    const msgs = Array.from({ length: 21 }, () => validMsg);
    expect(validateChatMessages(msgs)).not.toBeNull();
  });

  it("accepts exactly 20 messages", () => {
    const msgs = Array.from({ length: 20 }, () => validMsg);
    expect(validateChatMessages(msgs)).toBeNull();
  });

  it("returns an error string for a message with an invalid role", () => {
    expect(validateChatMessages([{ role: "system", content: "hello" }])).not.toBeNull();
  });

  it("returns an error string for a message with an empty content string", () => {
    expect(validateChatMessages([{ role: "user", content: "" }])).not.toBeNull();
  });

  it("returns an error string for a message with content exceeding 500 chars", () => {
    expect(validateChatMessages([{ role: "user", content: "a".repeat(501) }])).not.toBeNull();
  });

  it("accepts a message with content of exactly 500 chars", () => {
    expect(validateChatMessages([{ role: "user", content: "a".repeat(500) }])).toBeNull();
  });

  it("returns an error string for a null message entry in the array", () => {
    expect(validateChatMessages([null])).not.toBeNull();
  });

  it("returns an error string when content is not a string", () => {
    expect(validateChatMessages([{ role: "user", content: 42 }])).not.toBeNull();
  });
});

describe("toChatHistory", () => {
  it("returns an empty array when given only one message (last is not included)", () => {
    const result = toChatHistory([{ role: "user", content: "hello" }]);
    expect(result).toEqual([]);
  });

  it("maps 'user' role to 'user' for Gemini history", () => {
    const result = toChatHistory([
      { role: "user", content: "hi" },
      { role: "assistant", content: "hello" },
    ]);
    expect(result[0].role).toBe("user");
  });

  it("maps 'assistant' role to 'model' for Gemini history", () => {
    const result = toChatHistory([
      { role: "assistant", content: "hello" },
      { role: "user", content: "hi" },
    ]);
    expect(result[0].role).toBe("model");
  });

  it("wraps message content in a parts array", () => {
    const result = toChatHistory([
      { role: "user", content: "test message" },
      { role: "assistant", content: "response" },
    ]);
    expect(result[0].parts).toEqual([{ text: "test message" }]);
  });

  it("excludes the last message from the history", () => {
    const msgs = [
      { role: "user", content: "first" },
      { role: "assistant", content: "second" },
      { role: "user", content: "third" },
    ];
    const result = toChatHistory(msgs);
    expect(result).toHaveLength(2);
    expect(result[1].parts[0].text).toBe("second");
  });

  it("returns an empty array for an empty input array", () => {
    expect(toChatHistory([])).toEqual([]);
  });
});

describe("formatTime", () => {
  it("returns an empty string for undefined", () => {
    expect(formatTime(undefined)).toBe("");
  });

  it("returns a non-empty string for a valid Date", () => {
    const date = new Date("2024-06-15T09:05:00");
    expect(formatTime(date)).not.toBe("");
  });

  it("includes hours and minutes in the output", () => {
    const date = new Date("2024-06-15T09:05:00");
    const result = formatTime(date);
    expect(result).toMatch(/\d/);
  });

  it("formats midnight correctly (does not return empty)", () => {
    const midnight = new Date("2024-06-15T00:00:00");
    expect(formatTime(midnight)).not.toBe("");
  });
});
