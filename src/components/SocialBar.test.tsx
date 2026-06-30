// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import SocialBar from "./SocialBar";
import { GITHUB_URL, BLOG_URL, AUTHOR_EMAIL } from "@/constants/site";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SocialBar", () => {
  it("renders a navigation landmark labelled '소셜 링크'", () => {
    render(<SocialBar />);
    expect(screen.getByRole("navigation", { name: "소셜 링크" })).toBeInTheDocument();
  });

  it("links GitHub and Blog externally with safe rel attributes", () => {
    render(<SocialBar />);
    const github = screen.getByRole("link", { name: /GitHub/ });
    expect(github).toHaveAttribute("href", GITHUB_URL);
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");

    const blog = screen.getByRole("link", { name: /Blog/ });
    expect(blog).toHaveAttribute("href", BLOG_URL);
  });

  it("renders the email link as a mailto without a new-tab target", () => {
    render(<SocialBar />);
    const email = screen.getByRole("link", { name: "Email" });
    expect(email).toHaveAttribute("href", `mailto:${AUTHOR_EMAIL}`);
    expect(email).not.toHaveAttribute("target");
  });

  it("labels external links as opening in a new tab", () => {
    render(<SocialBar />);
    expect(screen.getByRole("link", { name: "GitHub (새 탭에서 열림)" })).toBeInTheDocument();
  });

  it("shows a tooltip label when a link is hovered", () => {
    render(<SocialBar />);
    const github = screen.getByRole("link", { name: /GitHub/ });
    fireEvent.mouseEnter(github);
    // The tooltip span renders the label text in addition to the link's accessible name
    expect(screen.getAllByText("GitHub").length).toBeGreaterThan(0);
  });
});
