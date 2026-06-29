import { describe, it, expect } from "vitest";
import { formatDate, isRecent, truncateDescription, extractTag } from "./blogUtils";

describe("formatDate", () => {
  it("formats a valid ISO date string", () => {
    const result = formatDate("2024-01-15");
    expect(result).toContain("2024");
    expect(result).not.toBe("2024-01-15");
  });

  it("formats an RFC 822 date string (as returned by RSS feeds)", () => {
    const result = formatDate("Mon, 15 Jan 2024 00:00:00 +0000");
    expect(result).toContain("2024");
    expect(result).not.toBe("Mon, 15 Jan 2024 00:00:00 +0000");
  });

  it("returns the original string for an invalid date", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("returns the original string for an empty string", () => {
    expect(formatDate("")).toBe("");
  });
});

describe("isRecent", () => {
  it("returns true for a date within the past 30 days", () => {
    const oneDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
    expect(isRecent(oneDayAgo)).toBe(true);
  });

  it("returns false for a date older than 30 days", () => {
    const sixtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString();
    expect(isRecent(sixtyDaysAgo)).toBe(false);
  });

  it("returns true for a future date", () => {
    const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
    expect(isRecent(tomorrow)).toBe(true);
  });

  it("returns false for a date exactly 30 days ago", () => {
    const thirtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString();
    expect(isRecent(thirtyDaysAgo)).toBe(false);
  });

  it("returns false for an invalid date string", () => {
    expect(isRecent("not-a-date")).toBe(false);
  });

  it("returns true for a recent RFC 822 date (as returned by RSS feeds)", () => {
    const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const rfc822 = yesterday.toUTCString();
    expect(isRecent(rfc822)).toBe(true);
  });
});

describe("truncateDescription", () => {
  it("returns short text unchanged", () => {
    expect(truncateDescription("hello world")).toBe("hello world");
  });

  it("strips HTML tags", () => {
    expect(truncateDescription("<p>hello <strong>world</strong></p>")).toBe("hello world");
  });

  it("does not truncate text at exactly the limit", () => {
    const exactly200 = "x".repeat(200);
    expect(truncateDescription(exactly200)).toBe(exactly200);
  });

  it("truncates at the last word boundary", () => {
    const long = ("word ".repeat(50)).trimEnd(); // 249 chars
    const result = truncateDescription(long);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThan(long.length);
  });

  it("truncates at max chars when no space exists", () => {
    const noSpace = "a".repeat(210);
    expect(truncateDescription(noSpace)).toBe("a".repeat(200) + "…");
  });

  it("respects a custom max parameter", () => {
    expect(truncateDescription("hello world foo", 11)).toBe("hello world" + "…");
  });

  it("returns an empty string for an empty input", () => {
    expect(truncateDescription("")).toBe("");
  });

  it("returns an empty string when input contains only HTML tags", () => {
    expect(truncateDescription("<p></p><br/>")).toBe("");
  });
});

describe("extractTag", () => {
  it("extracts content from a plain XML tag", () => {
    expect(extractTag("<title>Hello World</title>", "title")).toBe("Hello World");
  });

  it("extracts content from a CDATA-wrapped tag", () => {
    expect(extractTag("<title><![CDATA[My Post]]></title>", "title")).toBe("My Post");
  });

  it("returns empty string when the tag is absent", () => {
    expect(extractTag("<body>content</body>", "title")).toBe("");
  });

  it("handles tags with attributes", () => {
    expect(extractTag('<link rel="self">https://example.com</link>', "link")).toBe("https://example.com");
  });

  it("trims surrounding whitespace from extracted content", () => {
    expect(extractTag("<title>  spaced  </title>", "title")).toBe("spaced");
  });

  it("returns empty string for an empty block", () => {
    expect(extractTag("", "title")).toBe("");
  });

  it("returns empty string when block has no matching tag", () => {
    expect(extractTag("<description>some text</description>", "title")).toBe("");
  });
});
