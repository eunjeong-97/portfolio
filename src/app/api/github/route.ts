import { NextResponse } from "next/server";
import { truncateCommit } from "@/utils/githubUtils";

export const revalidate = 3600;

interface GitHubEvent {
  type: string;
  repo: { name: string };
  payload: {
    commits?: { message: string; sha: string }[];
    ref?: string;
  };
  created_at: string;
}

export async function GET() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      "https://api.github.com/users/eunjeong-97/events/public?per_page=30",
      {
        headers,
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { events: [], stats: null },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const data: GitHubEvent[] = await res.json();

    const pushData = data.filter((e) => e.type === "PushEvent");
    const pushEvents = pushData.slice(0, 6).map((e) => ({
      repo: e.repo.name.replace("eunjeong-97/", ""),
      branch: e.payload.ref?.replace("refs/heads/", "") ?? "main",
      commits: (e.payload.commits ?? []).slice(0, 2).map((c) => ({
        message: truncateCommit(c.message),
        sha: c.sha.slice(0, 7),
      })),
      date: e.created_at,
    }));

    const stats = {
      totalEvents: data.length,
      pushCount: pushData.length,
      reposActive: new Set(data.map((e) => e.repo.name)).size,
    };

    return NextResponse.json({ events: pushEvents, stats });
  } catch (err) {
    console.error("[github API]", err);
    return NextResponse.json(
      { events: [], stats: null },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
