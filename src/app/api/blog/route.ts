import { NextResponse } from "next/server";
import { parseBlogRss } from "@/utils/blogUtils";
import { BLOG_USERNAME } from "@/constants/site";

export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch(`https://v2.velog.io/rss/@${BLOG_USERNAME}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return NextResponse.json({ posts: [] }, { headers: { "Cache-Control": "no-store" } });
    const xml = await res.text();
    return NextResponse.json({ posts: parseBlogRss(xml) });
  } catch (err) {
    console.error("[blog API]", err);
    return NextResponse.json({ posts: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
