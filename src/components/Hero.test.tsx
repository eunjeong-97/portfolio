// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

vi.mock("@/utils/scrollTo", () => ({ scrollToId: vi.fn() }));
vi.mock("@/hooks/useTypewriter", () => ({
  useTypewriter: () => ({ displayed: "Frontend Developer", completedWord: "Frontend Developer" }),
}));
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

import Hero from "./Hero";
import { scrollToId } from "@/utils/scrollTo";
import { GITHUB_URL, BLOG_URL, AUTHOR_NAME } from "@/constants/site";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Hero", () => {
  it("renders the main headline", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("하나의 코드베이스");
  });

  it("announces the current typewriter role via a live region", () => {
    render(<Hero />);
    expect(screen.getAllByText("Frontend Developer").length).toBeGreaterThan(0);
  });

  it("scrolls to projects when the '프로젝트 보기' CTA is clicked", () => {
    render(<Hero />);
    fireEvent.click(screen.getByRole("link", { name: "프로젝트 보기" }));
    expect(scrollToId).toHaveBeenCalledWith("projects");
  });

  it("scrolls to contact when the '연락하기' CTA is clicked", () => {
    render(<Hero />);
    fireEvent.click(screen.getByRole("link", { name: "연락하기" }));
    expect(scrollToId).toHaveBeenCalledWith("contact");
  });

  it("scrolls to projects when the scroll indicator is clicked", () => {
    render(<Hero />);
    fireEvent.click(screen.getByRole("link", { name: "프로젝트 섹션으로 이동" }));
    expect(scrollToId).toHaveBeenCalledWith("projects");
  });

  it("renders the resume download link", () => {
    render(<Hero />);
    const resume = screen.getByRole("link", { name: /이력서 다운로드/ });
    expect(resume).toHaveAttribute("href", "/resume.pdf");
  });

  it("links GitHub and Blog externally with safe rel attributes", () => {
    render(<Hero />);
    const github = screen.getByRole("link", { name: /GitHub/ });
    expect(github).toHaveAttribute("href", GITHUB_URL);
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
    const blog = screen.getByRole("link", { name: /Blog/ });
    expect(blog).toHaveAttribute("href", BLOG_URL);
  });

  it("renders the tech stack tags", () => {
    render(<Hero />);
    const list = screen.getByRole("list", { name: "주요 기술 스택" });
    expect(list).toHaveTextContent("React Native");
    expect(list).toHaveTextContent("TypeScript");
  });

  it("renders the profile image with an accessible alt text", () => {
    render(<Hero />);
    expect(screen.getByAltText(`${AUTHOR_NAME} 프로필 사진`)).toBeInTheDocument();
  });
});
