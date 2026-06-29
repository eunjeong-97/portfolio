import { describe, it, expect } from "vitest";
import { formatRelativeDate, truncateCommit } from "./githubUtils";

describe("formatRelativeDate", () => {
  it("returns '오늘' for a date within the same day", () => {
    expect(formatRelativeDate(new Date().toISOString())).toBe("오늘");
  });

  it("returns '어제' for a date about 36 hours ago", () => {
    const d = new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(d)).toBe("어제");
  });

  it("returns 'N일 전' for dates 2–6 days ago", () => {
    const d = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(d)).toBe("3일 전");
  });

  it("returns 'N주 전' for dates 7–29 days ago", () => {
    const d = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(d)).toBe("2주 전");
  });

  it("returns 'N달 전' for dates 30+ days ago", () => {
    const d = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(d)).toBe("1달 전");
  });
});

describe("truncateCommit", () => {
  it("returns the message unchanged when within limit", () => {
    expect(truncateCommit("short commit message")).toBe("short commit message");
  });

  it("truncates messages exceeding the limit with an ellipsis", () => {
    const long = "a".repeat(80);
    expect(truncateCommit(long)).toBe("a".repeat(60) + "…");
  });

  it("uses only the first line of multi-line messages", () => {
    expect(truncateCommit("first line\nsecond line")).toBe("first line");
  });

  it("does not add an ellipsis when the message is exactly at the limit", () => {
    const exact = "a".repeat(60);
    expect(truncateCommit(exact)).toBe(exact);
  });

  it("respects a custom max parameter", () => {
    expect(truncateCommit("hello world", 5)).toBe("hello" + "…");
  });
});
