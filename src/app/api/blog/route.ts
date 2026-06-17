import { NextResponse } from "next/server";

export const revalidate = 3600; // 1시간마다 갱신

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
      const get = (tag: string) => {
        const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
        return m ? (m[1] ?? m[2] ?? "").trim() : "";
      };
      items.push({
        title: get("title"),
        link: get("link"),
        pubDate: get("pubDate"),
        description: (() => {
          const d = get("description").replace(/<[^>]+>/g, "");
          if (d.length <= 200) return d;
          const cut = d.slice(0, 201);
          const lastSpace = cut.lastIndexOf(" ");
          return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut.slice(0, 200)) + "...";
        })(),
      });
    }

    return NextResponse.json({ posts: items });
  } catch (err) {
    console.error("[blog API]", err);
    return NextResponse.json({ posts: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
