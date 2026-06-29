import { describe, it, expect } from "vitest";
import { escapeHtml, renderMarkdown } from "./markdownUtils";

describe("escapeHtml", () => {
  it("escapes ampersands", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("escapes less-than signs", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes greater-than signs", () => {
    expect(escapeHtml("a > b")).toBe("a &gt; b");
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('say "hi"')).toBe("say &quot;hi&quot;");
  });

  it("escapes all special characters in one string", () => {
    expect(escapeHtml('<a href="x">&</a>')).toBe(
      "&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;"
    );
  });

  it("returns plain text unchanged", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });

  it("returns an empty string for an empty input", () => {
    expect(escapeHtml("")).toBe("");
  });
});

describe("renderMarkdown", () => {
  it("renders bold text", () => {
    expect(renderMarkdown("**bold**")).toBe("<strong>bold</strong>");
  });

  it("renders italic text", () => {
    expect(renderMarkdown("*italic*")).toBe("<em>italic</em>");
  });

  it("renders inline code", () => {
    const result = renderMarkdown("`code`");
    expect(result).toContain("<code");
    expect(result).toContain("code</code>");
  });

  it("renders a list item", () => {
    const result = renderMarkdown("- item");
    expect(result).toContain("<li");
    expect(result).toContain("item</li>");
    expect(result).toContain("<ul");
  });

  it("renders multiple list items wrapped in a single ul", () => {
    const result = renderMarkdown("- one\n- two");
    const ulCount = (result.match(/<ul/g) ?? []).length;
    expect(ulCount).toBe(1);
    expect(result).toContain("one</li>");
    expect(result).toContain("two</li>");
  });

  it("converts newlines to br tags", () => {
    expect(renderMarkdown("line one\nline two")).toBe("line one<br/>line two");
  });

  it("escapes HTML in the input to prevent XSS", () => {
    const result = renderMarkdown('<script>alert("xss")</script>');
    expect(result).not.toContain("<script>");
    expect(result).toContain("&lt;script&gt;");
  });

  it("escapes HTML before applying markdown (not the other way around)", () => {
    // angle brackets inside bold should be escaped, not interpreted as tags
    const result = renderMarkdown("**<b>bold</b>**");
    expect(result).toBe("<strong>&lt;b&gt;bold&lt;/b&gt;</strong>");
  });

  it("returns an empty string for an empty input", () => {
    expect(renderMarkdown("")).toBe("");
  });

  it("returns plain text unchanged (no markdown syntax)", () => {
    expect(renderMarkdown("hello world")).toBe("hello world");
  });
});
