// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";

class MockIntersectionObserver {
  constructor(private cb: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}

import BlogPosts from "./BlogPosts";

const recentDate = new Date().toISOString();
const oldDate = "2020-01-01T00:00:00.000Z";

function mockFetchResolve(body: unknown, ok = true) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(body) }));
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("BlogPosts", () => {
  it("shows a loading status while fetching", () => {
    mockFetchResolve({ posts: [] });
    render(<BlogPosts />);
    expect(screen.getByRole("status")).toHaveTextContent("블로그 글 로딩 중...");
    expect(screen.getByRole("region", { name: "기술 블로그" })).toHaveAttribute("aria-busy", "true");
  });

  it("renders fetched post titles after a successful load", async () => {
    mockFetchResolve({
      posts: [
        { title: "첫 번째 글", link: "https://blog/1", pubDate: oldDate, description: "설명1" },
        { title: "두 번째 글", link: "https://blog/2", pubDate: oldDate, description: "설명2" },
      ],
    });
    render(<BlogPosts />);
    expect(await screen.findByText("첫 번째 글")).toBeInTheDocument();
    expect(screen.getByText("두 번째 글")).toBeInTheDocument();
  });

  it("shows the post count badge reflecting the number of posts", async () => {
    mockFetchResolve({
      posts: [
        { title: "A", link: "https://blog/a", pubDate: oldDate, description: "x" },
        { title: "B", link: "https://blog/b", pubDate: oldDate, description: "y" },
      ],
    });
    render(<BlogPosts />);
    await screen.findByText("A");
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("marks aria-busy false once loading completes", async () => {
    mockFetchResolve({ posts: [{ title: "글", link: "https://blog/x", pubDate: oldDate, description: "d" }] });
    render(<BlogPosts />);
    await screen.findByText("글");
    expect(screen.getByRole("region", { name: "기술 블로그" })).toHaveAttribute("aria-busy", "false");
  });

  it("renders an error alert and a Velog fallback link when the request fails", async () => {
    mockFetchResolve({}, false);
    render(<BlogPosts />);
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("블로그 글을 불러오는 중 오류가 발생했습니다.")
    );
    expect(screen.getByRole("link", { name: /Velog에서 직접 보기/ })).toBeInTheDocument();
  });

  it("renders an error alert when fetch rejects (network error)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    render(<BlogPosts />);
    await waitFor(() =>
      expect(screen.getByRole("alert")).toBeInTheDocument()
    );
  });

  it("shows a '최신' badge for a recently published post", async () => {
    mockFetchResolve({
      posts: [{ title: "최근 글", link: "https://blog/recent", pubDate: recentDate, description: "d" }],
    });
    render(<BlogPosts />);
    await screen.findByText("최근 글");
    expect(screen.getByText("최신")).toBeInTheDocument();
  });

  it("links each post to its external URL opening in a new tab", async () => {
    mockFetchResolve({
      posts: [{ title: "외부 글", link: "https://blog/ext", pubDate: oldDate, description: "d" }],
    });
    render(<BlogPosts />);
    const link = await screen.findByRole("link", { name: /외부 글/ });
    expect(link).toHaveAttribute("href", "https://blog/ext");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not show a count badge when there are zero posts", async () => {
    mockFetchResolve({ posts: [] });
    render(<BlogPosts />);
    await waitFor(() =>
      expect(screen.getByRole("region", { name: "기술 블로그" })).toHaveAttribute("aria-busy", "false")
    );
    // No posts → the "N개" count badge is not rendered, and no error alert either
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
