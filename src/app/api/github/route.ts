import { NextResponse } from "next/server";
import { processPushEvents, computeGitHubStats, type GitHubEvent } from "@/utils/githubUtils";
import { GITHUB_USERNAME } from "@/constants/site";

export const revalidate = 3600;

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
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`,
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

    return NextResponse.json({
      events: processPushEvents(data, GITHUB_USERNAME),
      stats: computeGitHubStats(data),
    });
  } catch (err) {
    console.error("[github API]", err);
    return NextResponse.json(
      { events: [], stats: null },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
