// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { GITHUB_URL } from "@/constants/site";

class MockIntersectionObserver {
  constructor(private cb: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}

import GitHubActivity from "./GitHubActivity";

const today = new Date().toISOString();

const sampleData = {
  events: [
    {
      repo: "portfolio",
      branch: "main",
      commits: [{ message: "feat: add tests", sha: "abc1234" }],
      date: today,
    },
  ],
  stats: { totalEvents: 42, pushCount: 10, reposActive: 3 },
};

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

describe("GitHubActivity", () => {
  it("shows a loading status while fetching", () => {
    mockFetchResolve({ events: [], stats: null });
    render(<GitHubActivity />);
    expect(screen.getByRole("status")).toHaveTextContent("GitHub 활동 로딩 중...");
    expect(screen.getByRole("region", { name: "GitHub 최근 활동" })).toHaveAttribute("aria-busy", "true");
  });

  it("renders the activity stats after a successful load", async () => {
    mockFetchResolve(sampleData);
    render(<GitHubActivity />);
    expect(await screen.findByRole("img", { name: "최근 이벤트: 42+" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "푸시 횟수: 10" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "활성 레포: 3" })).toBeInTheDocument();
  });

  it("renders each event's repo, commit message, and relative date", async () => {
    mockFetchResolve(sampleData);
    render(<GitHubActivity />);
    expect(await screen.findByRole("link", { name: /portfolio 저장소/ })).toBeInTheDocument();
    expect(screen.getByText("feat: add tests")).toBeInTheDocument();
    // "오늘" appears as the event's relative date (and also as the heatmap footer label)
    expect(screen.getAllByText("오늘").length).toBeGreaterThan(0);
  });

  it("links a commit to its GitHub commit URL", async () => {
    mockFetchResolve(sampleData);
    render(<GitHubActivity />);
    const commitLink = await screen.findByRole("link", { name: /커밋 abc1234 GitHub에서 보기/ });
    expect(commitLink).toHaveAttribute("href", `${GITHUB_URL}/portfolio/commit/abc1234`);
  });

  it("renders the 30-day heatmap with a total-count label when events exist", async () => {
    mockFetchResolve(sampleData);
    render(<GitHubActivity />);
    // One event dated today falls inside the 30-day window → total 1건
    expect(await screen.findByRole("img", { name: /히트맵: 총 1건/ })).toBeInTheDocument();
  });

  it("marks aria-busy false after loading completes", async () => {
    mockFetchResolve(sampleData);
    render(<GitHubActivity />);
    await screen.findByText("feat: add tests");
    expect(screen.getByRole("region", { name: "GitHub 최근 활동" })).toHaveAttribute("aria-busy", "false");
  });

  it("renders an error alert when the request fails", async () => {
    mockFetchResolve({}, false);
    render(<GitHubActivity />);
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("GitHub 활동을 불러오는 중 오류가 발생했습니다.")
    );
  });

  it("renders an error alert when fetch rejects (network error)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    render(<GitHubActivity />);
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
  });

  it("does not render the heatmap when there are no events", async () => {
    mockFetchResolve({ events: [], stats: { totalEvents: 0, pushCount: 0, reposActive: 0 } });
    render(<GitHubActivity />);
    await screen.findByRole("img", { name: "최근 이벤트: 0+" });
    expect(screen.queryByRole("img", { name: /히트맵/ })).not.toBeInTheDocument();
  });
});
