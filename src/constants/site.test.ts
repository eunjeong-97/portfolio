import { describe, it, expect } from "vitest";
import {
  AUTHOR_NAME,
  AUTHOR_EMAIL,
  GITHUB_USERNAME,
  BLOG_USERNAME,
  GITHUB_URL,
  BLOG_URL,
  RESUME_FILENAME,
  BASE_URL,
  COMPANY_NAME,
} from "./site";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/;

describe("site constants", () => {
  it("AUTHOR_NAME is a non-empty string", () => {
    expect(typeof AUTHOR_NAME).toBe("string");
    expect(AUTHOR_NAME.length).toBeGreaterThan(0);
  });

  it("AUTHOR_EMAIL is a valid email", () => {
    expect(EMAIL_REGEX.test(AUTHOR_EMAIL)).toBe(true);
  });

  it("GITHUB_USERNAME has no slashes or spaces", () => {
    expect(GITHUB_USERNAME).not.toContain("/");
    expect(GITHUB_USERNAME).not.toContain(" ");
    expect(GITHUB_USERNAME.length).toBeGreaterThan(0);
  });

  it("BLOG_USERNAME has no slashes or spaces", () => {
    expect(BLOG_USERNAME).not.toContain("/");
    expect(BLOG_USERNAME).not.toContain(" ");
    expect(BLOG_USERNAME.length).toBeGreaterThan(0);
  });

  it("GITHUB_URL is a valid HTTPS URL containing GITHUB_USERNAME", () => {
    expect(URL_REGEX.test(GITHUB_URL)).toBe(true);
    expect(GITHUB_URL).toContain(GITHUB_USERNAME);
    expect(GITHUB_URL.startsWith("https://")).toBe(true);
  });

  it("BLOG_URL is a valid HTTPS URL containing BLOG_USERNAME", () => {
    expect(URL_REGEX.test(BLOG_URL)).toBe(true);
    expect(BLOG_URL).toContain(BLOG_USERNAME);
    expect(BLOG_URL.startsWith("https://")).toBe(true);
  });

  it("BASE_URL is a valid HTTPS URL with no trailing slash", () => {
    expect(URL_REGEX.test(BASE_URL)).toBe(true);
    expect(BASE_URL.startsWith("https://")).toBe(true);
    expect(BASE_URL.endsWith("/")).toBe(false);
  });

  it("RESUME_FILENAME ends with .pdf", () => {
    expect(RESUME_FILENAME.endsWith(".pdf")).toBe(true);
    expect(RESUME_FILENAME.length).toBeGreaterThan(4);
  });

  it("RESUME_FILENAME contains no path separators", () => {
    expect(RESUME_FILENAME).not.toContain("/");
    expect(RESUME_FILENAME).not.toContain("\\");
  });

  it("COMPANY_NAME is a non-empty string", () => {
    expect(typeof COMPANY_NAME).toBe("string");
    expect(COMPANY_NAME.length).toBeGreaterThan(0);
  });

  it("GITHUB_URL ends with GITHUB_USERNAME (no trailing slash)", () => {
    expect(GITHUB_URL.endsWith(GITHUB_USERNAME)).toBe(true);
  });

  it("BLOG_URL ends with BLOG_USERNAME", () => {
    expect(BLOG_URL.endsWith(BLOG_USERNAME)).toBe(true);
  });

  it("BASE_URL does not contain localhost", () => {
    expect(BASE_URL).not.toContain("localhost");
  });

  it("GITHUB_URL contains 'github.com'", () => {
    expect(GITHUB_URL).toContain("github.com");
  });

  it("BLOG_URL contains 'velog.io'", () => {
    expect(BLOG_URL).toContain("velog.io");
  });
});
