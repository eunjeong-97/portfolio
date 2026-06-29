export interface GitHubEvent {
  type: string;
  repo: { name: string };
  payload: {
    commits?: { message: string; sha: string }[];
    ref?: string;
  };
  created_at: string;
}

export interface PushEvent {
  repo: string;
  branch: string;
  commits: { message: string; sha: string }[];
  date: string;
}

export interface GitHubStats {
  totalEvents: number;
  pushCount: number;
  reposActive: number;
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "오늘";
  if (diffDays === 1) return "어제";
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  return `${Math.floor(diffDays / 30)}달 전`;
}

export function truncateCommit(msg: string, max = 60): string {
  const first = msg.split("\n")[0];
  return first.length > max ? first.slice(0, max) + "…" : first;
}

export function buildHeatmapCounts(eventDates: string[], days: number, now: Date): number[] {
  const counts: number[] = Array(days).fill(0);
  for (const dateStr of eventDates) {
    const diff = Math.floor((now.getTime() - new Date(dateStr).getTime()) / 86400000);
    if (diff >= 0 && diff < days) counts[days - 1 - diff]++;
  }
  return counts;
}

export function heatmapIntensity(count: number, maxActivity: number): number {
  return count === 0 ? 0 : Math.min(1, 0.2 + (count / maxActivity) * 0.8);
}

export function processPushEvents(data: GitHubEvent[], username: string): PushEvent[] {
  return data
    .filter((e) => e.type === "PushEvent")
    .slice(0, 6)
    .map((e) => ({
      repo: e.repo.name.replace(`${username}/`, ""),
      branch: e.payload.ref?.replace("refs/heads/", "") ?? "main",
      commits: (e.payload.commits ?? []).slice(0, 2).map((c) => ({
        message: truncateCommit(c.message),
        sha: c.sha.slice(0, 7),
      })),
      date: e.created_at,
    }));
}

export function buildDayLabels(days: number, now: Date): string[] {
  return Array.from({ length: days }, (_, i) => {
    const daysAgo = days - 1 - i;
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
  });
}

export function computeGitHubStats(data: GitHubEvent[]): GitHubStats {
  const pushData = data.filter((e) => e.type === "PushEvent");
  return {
    totalEvents: data.length,
    pushCount: pushData.length,
    reposActive: new Set(data.map((e) => e.repo.name)).size,
  };
}
