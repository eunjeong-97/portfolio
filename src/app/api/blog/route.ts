import { NextResponse } from "next/server";

export const revalidate = 3600;

function truncateDescription(text: string, max = 200): string {
  const plain = text.replace(/<[^>]+>/g, "");
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max + 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut.slice(0, max)) + "…";
}

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
        description: truncateDescription(get("description")),
      });
    }

    return NextResponse.json({ posts: items });
  } catch (err) {
    console.error("[blog API]", err);
    return NextResponse.json({ posts: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
