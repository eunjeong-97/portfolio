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

  it("passes through the isNew field when present in the serialized message", () => {
    const result = deserializeChatMessages([{ role: "user", content: "hi", isNew: true }]);
    expect(result).not.toBeNull();
    expect((result![0] as { isNew?: boolean }).isNew).toBe(true);
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

  it("treats a null timestamp value as falsy and returns undefined for the timestamp field", () => {
    const result = deserializeChatMessages([{ role: "user", content: "hi", timestamp: null }]);
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

  it("returns 17 at exactly 172 chars — first length where speed drops below the maximum", () => {
    // Math.round(3000 / 172) = Math.round(17.44) = 17
    expect(typewriterSpeed(172)).toBe(17);
  });

  it("returns 4 (the minimum) for Infinity content length", () => {
    // Math.round(3000 / Infinity) = 0 → Math.min(18, 0) = 0 → Math.max(4, 0) = 4
    expect(typewriterSpeed(Infinity)).toBe(4);
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

  it("returns an error string for a message with an empty role string", () => {
    expect(validateChatMessages([{ role: "", content: "hello" }])).not.toBeNull();
  });

  it("returns an error string when role is the valid value in the wrong case (ASSISTANT)", () => {
    expect(validateChatMessages([{ role: "ASSISTANT", content: "hello" }])).not.toBeNull();
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

  it("accepts a message with content of exactly 1 character", () => {
    expect(validateChatMessages([{ role: "user", content: "x" }])).toBeNull();
  });

  it("returns an error string for a null message entry in the array", () => {
    expect(validateChatMessages([null])).not.toBeNull();
  });

  it("returns an error string when content is not a string", () => {
    expect(validateChatMessages([{ role: "user", content: 42 }])).not.toBeNull();
  });

  it("returns an error string when the content field is absent from the message object", () => {
    expect(validateChatMessages([{ role: "user" }])).not.toBeNull();
  });

  it("returns an error string when the role field is absent from the message object", () => {
    expect(validateChatMessages([{ content: "hello" }])).not.toBeNull();
  });

  it("returns an error string when role is a number instead of a string", () => {
    expect(validateChatMessages([{ role: 1, content: "hello" }])).not.toBeNull();
  });

  it("returns an error string when a message in the array is undefined", () => {
    expect(validateChatMessages([undefined])).not.toBeNull();
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

  it("returns an empty array for a single assistant message (no prior context)", () => {
    expect(toChatHistory([{ role: "assistant", content: "hello" }])).toEqual([]);
  });

  it("returns two history entries for a three-message conversation", () => {
    const msgs = [
      { role: "user", content: "one" },
      { role: "assistant", content: "two" },
      { role: "user", content: "three" },
    ];
    const result = toChatHistory(msgs);
    expect(result).toHaveLength(2);
    expect(result[0].parts[0].text).toBe("one");
    expect(result[1].parts[0].text).toBe("two");
  });

  it("maps any non-'assistant' role to 'user' in the Gemini history format", () => {
    // The implementation uses: role === "assistant" ? "model" : "user"
    // so any unknown role (e.g. "system") becomes "user"
    const result = toChatHistory([
      { role: "system" as "user", content: "system msg" },
      { role: "user", content: "last" },
    ]);
    expect(result[0].role).toBe("user");
  });

  it("returns exactly one history entry for a two-message conversation", () => {
    const result = toChatHistory([
      { role: "user", content: "hi" },
      { role: "assistant", content: "hello" },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].parts[0].text).toBe("hi");
  });

  it("returns 4 history entries for a five-message conversation (all but the last)", () => {
    const msgs = [
      { role: "user", content: "1" },
      { role: "assistant", content: "2" },
      { role: "user", content: "3" },
      { role: "assistant", content: "4" },
      { role: "user", content: "5" },
    ] as { role: "user" | "assistant"; content: string }[];
    const result = toChatHistory(msgs);
    expect(result).toHaveLength(4);
    expect(result[3].parts[0].text).toBe("4");
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

  it("returns a string (not throws) for an invalid Date object", () => {
    const invalid = new Date("not-a-date");
    expect(typeof formatTime(invalid)).toBe("string");
  });
});
