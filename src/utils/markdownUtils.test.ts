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

  it("does not escape single-quote characters", () => {
    expect(escapeHtml("it's fine")).toBe("it's fine");
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

  it("renders both bold and italic in the same string", () => {
    expect(renderMarkdown("**bold** and *italic*")).toBe(
      "<strong>bold</strong> and <em>italic</em>"
    );
  });

  it("renders bold text inside a list item", () => {
    const result = renderMarkdown("- **bold item**");
    expect(result).toContain("<strong>bold item</strong>");
    expect(result).toContain("<li");
    expect(result).toContain("<ul");
  });

  it("does not convert a mid-line dash to a list item", () => {
    expect(renderMarkdown("inline - dash")).toBe("inline - dash");
    expect(renderMarkdown("inline - dash")).not.toContain("<li");
  });

  it("renders inline code nested inside bold text", () => {
    const result = renderMarkdown("**`code`**");
    expect(result).toContain("<strong>");
    expect(result).toContain("<code");
    expect(result).toContain("code</code>");
    expect(result).toContain("</strong>");
  });

  it("inserts a br tag between preceding text and a list item", () => {
    const result = renderMarkdown("intro\n- item");
    expect(result).toContain("intro");
    expect(result).toContain("<br/>");
    expect(result).toContain("<li");
  });

  it("renders an em tag for a single asterisk on each side", () => {
    expect(renderMarkdown("*em*")).toContain("<em>em</em>");
  });

  it("renders ** without a closing pair as an empty em span (italic regex consumes the inner *)", () => {
    const result = renderMarkdown("**unclosed");
    // The italic regex \*(.*?)\* matches the pair of asterisks with empty content
    expect(result).toBe("<em></em>unclosed");
    expect(result).not.toContain("<strong>");
  });

  it("renders two separate bold spans in one string", () => {
    const result = renderMarkdown("**first** and **second**");
    const matches = result.match(/<strong>/g);
    expect(matches).toHaveLength(2);
  });

  it("renders two separate italic spans in one string", () => {
    const result = renderMarkdown("*one* and *two*");
    const matches = result.match(/<em>/g);
    expect(matches).toHaveLength(2);
  });

  it("does not convert a line-initial dash without a space to a list item", () => {
    const result = renderMarkdown("-item");
    expect(result).not.toContain("<li");
    expect(result).not.toContain("<ul");
    expect(result).toBe("-item");
  });

  it("renders italic markup inside a list item", () => {
    const result = renderMarkdown("- *italic item*");
    expect(result).toContain("<em>italic item</em>");
    expect(result).toContain("<li");
    expect(result).toContain("<ul");
  });

  it("renders inline code inside a list item", () => {
    const result = renderMarkdown("- `code item`");
    expect(result).toContain("<code");
    expect(result).toContain("code item</code>");
    expect(result).toContain("<li");
    expect(result).toContain("<ul");
  });

  it("converts multiple consecutive newlines to multiple br tags", () => {
    expect(renderMarkdown("a\n\nb")).toBe("a<br/><br/>b");
  });

  it("does not convert '- ' (dash-space only, no content) to a list item", () => {
    const result = renderMarkdown("- ");
    expect(result).not.toContain("<li");
    expect(result).toBe("- ");
  });

  it("does not convert an unclosed backtick span to a code element", () => {
    const result = renderMarkdown("`unclosed");
    expect(result).not.toContain("<code");
    expect(result).toBe("`unclosed");
  });

  it("renders two separate inline code spans in one string", () => {
    const result = renderMarkdown("`a` and `b`");
    const matches = result.match(/<code/g);
    expect(matches).toHaveLength(2);
    expect(result).toContain("a</code>");
    expect(result).toContain("b</code>");
  });
});
