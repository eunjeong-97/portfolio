import { NextResponse } from "next/server";
import { truncateDescription, extractTag } from "@/utils/blogUtils";

export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch("https://v2.velog.io/rss/@beanlove97", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return NextResponse.json({ posts: [] }, { headers: { "Cache-Control": "no-store" } });
    const xml = await res.text();

    const items: { title: string; link: string; pubDate: string; description: string }[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 6) {
      const block = match[1];
      items.push({
        title: extractTag(block, "title"),
        link: extractTag(block, "link"),
        pubDate: extractTag(block, "pubDate"),
        description: truncateDescription(extractTag(block, "description")),
      });
    }

    return NextResponse.json({ posts: items });
  } catch (err) {
    console.error("[blog API]", err);
    return NextResponse.json({ posts: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
