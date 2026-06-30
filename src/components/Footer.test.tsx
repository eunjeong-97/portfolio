// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import Footer from "./Footer";
import { AUTHOR_NAME, GITHUB_URL, BLOG_URL, AUTHOR_EMAIL, RESUME_FILENAME } from "@/constants/site";

vi.mock("@/utils/scrollTo", () => ({ scrollToId: vi.fn() }));
import { scrollToId } from "@/utils/scrollTo";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Footer", () => {
  it("renders the footer landmark with an accessible label", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo", { name: "사이트 하단 정보" })).toBeInTheDocument();
  });

  it("renders the current year and author name in the copyright line", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(
      screen.getByText((content) => content.includes(String(year)) && content.includes(AUTHOR_NAME))
    ).toBeInTheDocument();
  });

  it("links GitHub and Blog externally with rel=noopener noreferrer", () => {
    render(<Footer />);
    const github = screen.getAllByRole("link", { name: /GitHub/ })[0];
    expect(github).toHaveAttribute("href", GITHUB_URL);
    expect(github.getAttribute("target")).toBe("_blank");
    expect(github.getAttribute("rel")).toBe("noopener noreferrer");

    const blog = screen.getAllByRole("link", { name: /Blog/ }).find((a) => a.getAttribute("href") === BLOG_URL);
    expect(blog).toBeDefined();
    expect(blog!.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders a mailto link for email (not external, no target=_blank)", () => {
    render(<Footer />);
    const email = screen.getAllByRole("link", { name: /Email/ })[0];
    expect(email).toHaveAttribute("href", `mailto:${AUTHOR_EMAIL}`);
    expect(email.getAttribute("target")).toBeNull();
  });

  it("renders the resume download link with the correct download filename", () => {
    render(<Footer />);
    const resume = screen.getByRole("link", { name: /이력서 다운로드/ });
    expect(resume).toHaveAttribute("href", "/resume.pdf");
    expect(resume).toHaveAttribute("download", RESUME_FILENAME);
  });

  it("calls scrollToId with the section id (without the leading #) when a nav link is clicked", () => {
    render(<Footer />);
    const projectsLink = screen.getByRole("link", { name: "Projects" });
    fireEvent.click(projectsLink);
    expect(scrollToId).toHaveBeenCalledWith("projects");
  });

  it("renders all six quick-navigation links", () => {
    render(<Footer />);
    for (const label of ["Projects", "About", "Skills", "Experience", "Blog", "Contact"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });
});
