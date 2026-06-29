import { describe, it, expect } from "vitest";
import { formatDate, isRecent, truncateDescription, extractTag, parseBlogRss } from "./blogUtils";

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

  it("returns false for an empty string", () => {
    expect(isRecent("")).toBe(false);
  });

  it("returns true for a date exactly 29 days ago (one day before the boundary)", () => {
    const twentyNineDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 29).toISOString();
    expect(isRecent(twentyNineDaysAgo)).toBe(true);
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

  it("returns the stripped text unchanged when stripping HTML tags yields exactly 200 chars", () => {
    const text = "<p>" + "x".repeat(200) + "</p>";
    expect(truncateDescription(text)).toBe("x".repeat(200));
  });

  it("truncates at the last space when it falls exactly at position max (index 200)", () => {
    // cut = "a" * 200 + " " → lastSpace = 200 > 0 → cut.slice(0, 200) + "…"
    const text = "a".repeat(200) + " extra";
    expect(truncateDescription(text)).toBe("a".repeat(200) + "…");
  });

  it("decodes common HTML entities in the description", () => {
    expect(truncateDescription("a &amp; b &lt;c&gt; &quot;d&quot; &#39;e&#39; f&nbsp;g")).toBe(
      "a & b <c> \"d\" 'e' f g"
    );
  });

  it("falls back to hard-truncating at max when the only space in the cut window is at index 0", () => {
    // plain = " " + "a" * 210 (211 chars); cut = " " + "a" * 200; lastSpace=0; 0 > 0 is false
    const text = " " + "a".repeat(210);
    expect(truncateDescription(text)).toBe(" " + "a".repeat(199) + "…");
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

  it("returns empty string for a matched tag with empty content", () => {
    expect(extractTag("<title></title>", "title")).toBe("");
  });

  it("extracts content spanning multiple lines", () => {
    const block = "<description>line one\nline two\nline three</description>";
    expect(extractTag(block, "description")).toBe("line one\nline two\nline three");
  });

  it("extracts multi-line CDATA content", () => {
    const block = "<description><![CDATA[first\nsecond]]></description>";
    expect(extractTag(block, "description")).toBe("first\nsecond");
  });

  it("extracts CDATA content that contains XML-like tags without interpreting them", () => {
    const block = "<description><![CDATA[<p>raw html</p>]]></description>";
    expect(extractTag(block, "description")).toBe("<p>raw html</p>");
  });

  it("returns the first match when the tag appears more than once", () => {
    expect(extractTag("<title>first</title><title>second</title>", "title")).toBe("first");
  });

  it("returns empty string for a self-closing tag (no open+close pair)", () => {
    expect(extractTag("<link/>", "link")).toBe("");
  });
});

describe("parseBlogRss", () => {
  const makeItem = (title: string, link: string, pubDate: string, description: string) =>
    `<item><title><![CDATA[${title}]]></title><link>${link}</link><pubDate>${pubDate}</pubDate><description><![CDATA[${description}]]></description></item>`;

  it("returns an empty array for XML with no items", () => {
    expect(parseBlogRss("<rss></rss>")).toEqual([]);
  });

  it("parses a single item correctly", () => {
    const xml = `<rss>${makeItem("My Post", "https://velog.io/post", "Mon, 01 Jan 2024 00:00:00 +0000", "Short desc")}</rss>`;
    const result = parseBlogRss(xml);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("My Post");
    expect(result[0].link).toBe("https://velog.io/post");
    expect(result[0].pubDate).toBe("Mon, 01 Jan 2024 00:00:00 +0000");
    expect(result[0].description).toBe("Short desc");
  });

  it("truncates descriptions longer than 200 characters", () => {
    const longDesc = "word ".repeat(50); // 250 chars
    const xml = `<rss>${makeItem("Post", "https://x.com", "2024-01-01", longDesc)}</rss>`;
    const [post] = parseBlogRss(xml);
    expect(post.description.endsWith("…")).toBe(true);
    expect(post.description.length).toBeLessThan(longDesc.length);
  });

  it("limits results to 6 items by default", () => {
    const items = Array.from({ length: 10 }, (_, i) =>
      makeItem(`Post ${i}`, `https://x.com/${i}`, "2024-01-01", "desc")
    ).join("");
    const xml = `<rss>${items}</rss>`;
    expect(parseBlogRss(xml)).toHaveLength(6);
  });

  it("respects a custom maxItems parameter", () => {
    const items = Array.from({ length: 5 }, (_, i) =>
      makeItem(`Post ${i}`, `https://x.com/${i}`, "2024-01-01", "desc")
    ).join("");
    const xml = `<rss>${items}</rss>`;
    expect(parseBlogRss(xml, 3)).toHaveLength(3);
  });

  it("parses multiple items in order", () => {
    const xml = `<rss>${makeItem("First", "https://x.com/1", "2024-01-01", "a")}${makeItem("Second", "https://x.com/2", "2024-01-02", "b")}</rss>`;
    const result = parseBlogRss(xml);
    expect(result[0].title).toBe("First");
    expect(result[1].title).toBe("Second");
  });

  it("strips HTML tags from descriptions", () => {
    const xml = `<rss>${makeItem("Post", "https://x.com", "2024-01-01", "<p>Clean text</p>")}</rss>`;
    const [post] = parseBlogRss(xml);
    expect(post.description).toBe("Clean text");
    expect(post.description).not.toContain("<p>");
  });

  it("handles items where the link field is empty", () => {
    const xml = `<rss>${makeItem("No-link post", "", "2024-01-01", "desc")}</rss>`;
    const [post] = parseBlogRss(xml);
    expect(post.title).toBe("No-link post");
    expect(post.link).toBe("");
  });

  it("handles items where pubDate is absent, returning an empty string", () => {
    const xml = `<rss><item><title><![CDATA[No date]]></title><link>https://x.com</link><description><![CDATA[desc]]></description></item></rss>`;
    const [post] = parseBlogRss(xml);
    expect(post.title).toBe("No date");
    expect(post.pubDate).toBe("");
  });

  it("returns an empty array when maxItems is 0", () => {
    const xml = `<rss>${makeItem("Post", "https://x.com", "2024-01-01", "desc")}</rss>`;
    expect(parseBlogRss(xml, 0)).toHaveLength(0);
  });

  it("returns fewer than maxItems when there are not enough items in the feed", () => {
    const xml = `<rss>${makeItem("Only", "https://x.com", "2024-01-01", "desc")}</rss>`;
    expect(parseBlogRss(xml, 10)).toHaveLength(1);
  });

  it("returns exactly 6 items when the feed has exactly 6 items (at the default limit)", () => {
    const items = Array.from({ length: 6 }, (_, i) =>
      makeItem(`Post ${i}`, `https://x.com/${i}`, "2024-01-01", "desc")
    ).join("");
    expect(parseBlogRss(`<rss>${items}</rss>`)).toHaveLength(6);
  });

  it("returns an empty array for XML with no closing item tags", () => {
    expect(parseBlogRss("<rss><item>no closing tag</rss>")).toEqual([]);
  });

  it("returns an empty description when the item has no description tag", () => {
    const xml = `<rss><item><title><![CDATA[No Desc]]></title><link>https://x.com</link><pubDate>2024-01-01</pubDate></item></rss>`;
    const [post] = parseBlogRss(xml);
    expect(post.title).toBe("No Desc");
    expect(post.description).toBe("");
  });
});
