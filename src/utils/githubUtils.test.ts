import { describe, it, expect } from "vitest";
import {
  formatRelativeDate,
  truncateCommit,
  buildHeatmapCounts,
  heatmapIntensity,
  processPushEvents,
  computeGitHubStats,
  buildDayLabels,
  type GitHubEvent,
} from "./githubUtils";

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

  it("returns '2일 전' at the lower boundary of the day range (2 days)", () => {
    const d = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(d)).toBe("2일 전");
  });

  it("returns '6일 전' at the upper boundary of the day range (6 days)", () => {
    const d = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(d)).toBe("6일 전");
  });

  it("returns '1주 전' at the lower boundary of the week range (7 days)", () => {
    const d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(d)).toBe("1주 전");
  });

  it("returns '4주 전' at the upper boundary of the week range (29 days)", () => {
    const d = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(d)).toBe("4주 전");
  });

  it("returns '1달 전' at the lower boundary of the month range (30 days)", () => {
    const d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(d)).toBe("1달 전");
  });

  it("returns '오늘' for a future date", () => {
    const d = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(d)).toBe("오늘");
  });

  it("returns the original string for an invalid date", () => {
    expect(formatRelativeDate("not-a-date")).toBe("not-a-date");
  });

  it("returns '어제' for a date exactly 24 hours ago", () => {
    const d = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(d)).toBe("어제");
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

  it("returns an empty string for an empty input", () => {
    expect(truncateCommit("")).toBe("");
  });

  it("uses the first line when the first line is empty", () => {
    expect(truncateCommit("\nsecond line")).toBe("");
  });

  it("truncates a message that is exactly one character over the limit (61 chars)", () => {
    const justOver = "a".repeat(61);
    expect(truncateCommit(justOver)).toBe("a".repeat(60) + "…");
  });
});

describe("processPushEvents — sha slicing", () => {
  const makeEvent = (overrides: Partial<GitHubEvent> = {}): GitHubEvent => ({
    type: "PushEvent",
    repo: { name: "user/repo" },
    payload: {
      ref: "refs/heads/main",
      commits: [{ message: "msg", sha: "abc" }],
    },
    created_at: "2024-01-01T00:00:00Z",
    ...overrides,
  });

  it("returns the full sha when it is shorter than 7 characters", () => {
    const [result] = processPushEvents([makeEvent()], "user");
    expect(result.commits[0].sha).toBe("abc");
  });
});

describe("buildHeatmapCounts", () => {
  const DAY = 86400000;

  it("returns all zeros for empty event dates", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    const result = buildHeatmapCounts([], 7, now);
    expect(result).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });

  it("increments the last slot for an event that happened today", () => {
    const now = new Date("2024-06-15T23:00:00Z");
    const todayIso = "2024-06-15T01:00:00Z";
    const result = buildHeatmapCounts([todayIso], 7, now);
    expect(result[6]).toBe(1);
    expect(result.slice(0, 6).every((c) => c === 0)).toBe(true);
  });

  it("increments the second-to-last slot for an event 1 day ago", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    const yesterday = new Date(now.getTime() - DAY).toISOString();
    const result = buildHeatmapCounts([yesterday], 7, now);
    expect(result[5]).toBe(1);
    expect(result[6]).toBe(0);
  });

  it("increments the first slot for an event at the far boundary (days-1 ago)", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    const farBack = new Date(now.getTime() - 6 * DAY).toISOString();
    const result = buildHeatmapCounts([farBack], 7, now);
    expect(result[0]).toBe(1);
  });

  it("ignores events outside the window (days or more ago)", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    const tooOld = new Date(now.getTime() - 7 * DAY).toISOString();
    const result = buildHeatmapCounts([tooOld], 7, now);
    expect(result.every((c) => c === 0)).toBe(true);
  });

  it("ignores future events (negative diff)", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    const future = new Date(now.getTime() + DAY).toISOString();
    const result = buildHeatmapCounts([future], 7, now);
    expect(result.every((c) => c === 0)).toBe(true);
  });

  it("accumulates multiple events on the same day", () => {
    const now = new Date("2024-06-15T23:00:00Z");
    const today1 = "2024-06-15T08:00:00Z";
    const today2 = "2024-06-15T15:00:00Z";
    const result = buildHeatmapCounts([today1, today2], 7, now);
    expect(result[6]).toBe(2);
  });

  it("distributes events across different days correctly", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    const today = new Date(now.getTime()).toISOString();
    const twoDaysAgo = new Date(now.getTime() - 2 * DAY).toISOString();
    const result = buildHeatmapCounts([today, twoDaysAgo], 7, now);
    expect(result[6]).toBe(1); // today
    expect(result[4]).toBe(1); // 2 days ago
  });

  it("returns an array of the requested length", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    expect(buildHeatmapCounts([], 30, now)).toHaveLength(30);
  });

  it("silently ignores invalid date strings in the event list", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    const result = buildHeatmapCounts(["not-a-date", "also-invalid"], 7, now);
    expect(result.every((c) => c === 0)).toBe(true);
  });

  it("returns a single-element array with today's count for days=1", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    const today = "2024-06-15T08:00:00Z";
    expect(buildHeatmapCounts([today], 1, now)).toEqual([1]);
  });

  it("returns an empty array for days=0", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    expect(buildHeatmapCounts([], 0, now)).toEqual([]);
  });
});

describe("heatmapIntensity", () => {
  it("returns 0 for a count of 0", () => {
    expect(heatmapIntensity(0, 10)).toBe(0);
  });

  it("returns 1 when count equals maxActivity (full intensity)", () => {
    expect(heatmapIntensity(5, 5)).toBe(1);
  });

  it("returns 0.2 as the minimum non-zero intensity (count=1, maxActivity=very large)", () => {
    const result = heatmapIntensity(1, 1000000);
    expect(result).toBeCloseTo(0.2, 5);
  });

  it("returns a value between 0.2 and 1 for a partial count", () => {
    const result = heatmapIntensity(5, 10);
    expect(result).toBeGreaterThanOrEqual(0.2);
    expect(result).toBeLessThanOrEqual(1);
  });

  it("clamps to 1 when count exceeds maxActivity", () => {
    expect(heatmapIntensity(10, 5)).toBe(1);
  });

  it("scales linearly between 0.2 and 1 for mid-range values", () => {
    // count/maxActivity = 0.5 → 0.2 + 0.5 * 0.8 = 0.6
    expect(heatmapIntensity(5, 10)).toBeCloseTo(0.6, 10);
  });

  it("returns 1 when maxActivity is 0 and count is non-zero (division clamps to max)", () => {
    // count/0 = Infinity → 0.2 + Infinity * 0.8 = Infinity → Math.min(1, Infinity) = 1
    expect(heatmapIntensity(1, 0)).toBe(1);
  });
});

describe("processPushEvents", () => {
  const makeEvent = (overrides: Partial<GitHubEvent> = {}): GitHubEvent => ({
    type: "PushEvent",
    repo: { name: "user/repo" },
    payload: {
      ref: "refs/heads/main",
      commits: [{ message: "feat: add something", sha: "abc1234567890" }],
    },
    created_at: "2024-06-15T12:00:00Z",
    ...overrides,
  });

  it("returns an empty array for empty input", () => {
    expect(processPushEvents([], "user")).toEqual([]);
  });

  it("filters out non-PushEvent types", () => {
    const events = [makeEvent({ type: "CreateEvent" }), makeEvent({ type: "WatchEvent" })];
    expect(processPushEvents(events, "user")).toEqual([]);
  });

  it("strips the username prefix from the repo name", () => {
    const [result] = processPushEvents([makeEvent()], "user");
    expect(result.repo).toBe("repo");
  });

  it("extracts branch from the ref field", () => {
    const [result] = processPushEvents([makeEvent()], "user");
    expect(result.branch).toBe("main");
  });

  it("defaults branch to 'main' when ref is absent", () => {
    const event = makeEvent({ payload: { commits: [] } });
    const [result] = processPushEvents([event], "user");
    expect(result.branch).toBe("main");
  });

  it("limits commits to 2 per event", () => {
    const event = makeEvent({
      payload: {
        ref: "refs/heads/main",
        commits: [
          { message: "first", sha: "aaaaaaaaaaaa" },
          { message: "second", sha: "bbbbbbbbbbbb" },
          { message: "third", sha: "cccccccccccc" },
        ],
      },
    });
    const [result] = processPushEvents([event], "user");
    expect(result.commits).toHaveLength(2);
  });

  it("truncates commit messages longer than 60 characters", () => {
    const longMsg = "a".repeat(80);
    const event = makeEvent({
      payload: {
        ref: "refs/heads/main",
        commits: [{ message: longMsg, sha: "aaaaaaaaaaaa" }],
      },
    });
    const [result] = processPushEvents([event], "user");
    expect(result.commits[0].message).toBe("a".repeat(60) + "…");
  });

  it("slices sha to 7 characters", () => {
    const [result] = processPushEvents([makeEvent()], "user");
    expect(result.commits[0].sha).toBe("abc1234");
  });

  it("preserves the event date", () => {
    const [result] = processPushEvents([makeEvent()], "user");
    expect(result.date).toBe("2024-06-15T12:00:00Z");
  });

  it("limits output to 6 events", () => {
    const events = Array.from({ length: 10 }, () => makeEvent());
    expect(processPushEvents(events, "user")).toHaveLength(6);
  });

  it("returns the full repo name unchanged when it does not start with the username prefix", () => {
    const event = makeEvent({ repo: { name: "other-user/repo" } });
    const [result] = processPushEvents([event], "myuser");
    expect(result.repo).toBe("other-user/repo");
  });

  it("handles a payload with no commits field (undefined)", () => {
    const event = makeEvent({ payload: { ref: "refs/heads/main" } });
    const [result] = processPushEvents([event], "user");
    expect(result.commits).toEqual([]);
  });

  it("extracts a non-main branch name from the ref field", () => {
    const event = makeEvent({ payload: { ref: "refs/heads/feature/my-branch", commits: [] } });
    const [result] = processPushEvents([event], "user");
    expect(result.branch).toBe("feature/my-branch");
  });

  it("includes both commits when there are exactly 2 (at the limit)", () => {
    const event = makeEvent({
      payload: {
        ref: "refs/heads/main",
        commits: [
          { message: "first", sha: "aaaaaaaaaaaa" },
          { message: "second", sha: "bbbbbbbbbbbb" },
        ],
      },
    });
    const [result] = processPushEvents([event], "user");
    expect(result.commits).toHaveLength(2);
    expect(result.commits[0].message).toBe("first");
    expect(result.commits[1].message).toBe("second");
  });

  it("uses only the first line of a multi-line commit message", () => {
    const event = makeEvent({
      payload: {
        ref: "refs/heads/main",
        commits: [{ message: "first line\nsecond line", sha: "aaaaaaaaaaaa" }],
      },
    });
    const [result] = processPushEvents([event], "user");
    expect(result.commits[0].message).toBe("first line");
  });
});

describe("computeGitHubStats", () => {
  const makeEvent = (type: string, repo = "user/repo"): GitHubEvent => ({
    type,
    repo: { name: repo },
    payload: {},
    created_at: "2024-06-15T12:00:00Z",
  });

  it("returns zeros for empty input", () => {
    expect(computeGitHubStats([])).toEqual({ totalEvents: 0, pushCount: 0, reposActive: 0 });
  });

  it("counts total events correctly", () => {
    const events = [makeEvent("PushEvent"), makeEvent("WatchEvent"), makeEvent("CreateEvent")];
    expect(computeGitHubStats(events).totalEvents).toBe(3);
  });

  it("counts only PushEvents in pushCount", () => {
    const events = [makeEvent("PushEvent"), makeEvent("WatchEvent"), makeEvent("PushEvent")];
    expect(computeGitHubStats(events).pushCount).toBe(2);
  });

  it("counts unique repos for reposActive", () => {
    const events = [
      makeEvent("PushEvent", "user/repoA"),
      makeEvent("WatchEvent", "user/repoA"),
      makeEvent("PushEvent", "user/repoB"),
    ];
    expect(computeGitHubStats(events).reposActive).toBe(2);
  });

  it("counts each distinct repo once even with many events", () => {
    const events = Array.from({ length: 5 }, () => makeEvent("PushEvent", "user/single-repo"));
    expect(computeGitHubStats(events).reposActive).toBe(1);
  });

  it("reports pushCount as 0 when there are no PushEvents", () => {
    const events = [makeEvent("WatchEvent", "user/repoA"), makeEvent("CreateEvent", "user/repoB")];
    const stats = computeGitHubStats(events);
    expect(stats.pushCount).toBe(0);
    expect(stats.reposActive).toBe(2);
    expect(stats.totalEvents).toBe(2);
  });
});

describe("buildDayLabels", () => {
  it("returns an array of the requested length", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    expect(buildDayLabels(7, now)).toHaveLength(7);
  });

  it("returns an array of the requested length for 30 days", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    expect(buildDayLabels(30, now)).toHaveLength(30);
  });

  it("returns strings for all entries", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    const labels = buildDayLabels(7, now);
    expect(labels.every((l) => typeof l === "string" && l.length > 0)).toBe(true);
  });

  it("produces unique labels for consecutive days", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    const labels = buildDayLabels(7, now);
    const unique = new Set(labels);
    expect(unique.size).toBe(7);
  });

  it("returns an empty array for 0 days", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    expect(buildDayLabels(0, now)).toEqual([]);
  });

  it("last label corresponds to today's date", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    const labels = buildDayLabels(7, now);
    const todayLabel = now.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
    expect(labels[labels.length - 1]).toBe(todayLabel);
  });

  it("first label corresponds to (days-1) days ago", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    const labels = buildDayLabels(7, now);
    const sixDaysAgo = new Date(now);
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    const expectedFirst = sixDaysAgo.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
    expect(labels[0]).toBe(expectedFirst);
  });

  it("returns a single-element array containing today's label for days=1", () => {
    const now = new Date("2024-06-15T12:00:00Z");
    const labels = buildDayLabels(1, now);
    expect(labels).toHaveLength(1);
    const todayLabel = now.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
    expect(labels[0]).toBe(todayLabel);
  });
});
