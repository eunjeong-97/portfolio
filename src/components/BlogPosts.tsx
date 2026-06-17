"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ExternalLink, FileText } from "lucide-react";

interface Post {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function isRecent(dateStr: string): boolean {
  try {
    return Date.now() - new Date(dateStr).getTime() < 1000 * 60 * 60 * 24 * 30;
  } catch {
    return false;
  }
}

export default function BlogPosts() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/blog", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <section id="blog" className="py-24 px-6" ref={ref} aria-busy={loading} aria-label="기술 블로그">
      {loading && <span className="sr-only" role="status">블로그 글 로딩 중...</span>}
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="text-sm text-primary uppercase tracking-wider">
            Tech Blog
          </span>
          <div className="flex items-end justify-between mt-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl md:text-4xl font-bold">기술 블로그</h2>
              {!loading && posts.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-1 text-sm text-muted-foreground"
                >
                  <span className="text-primary font-bold">{posts.length}</span>개
                </motion.span>
              )}
            </div>
            <a
              href="https://velog.io/@beanlove97"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary-light transition-colors"
            >
              전체 보기 <ExternalLink size={14} aria-hidden="true" />
              <span className="sr-only">(새 탭에서 열림)</span>
            </a>
          </div>
          <p className="text-muted-foreground mt-3">
            개발하며 배운 것들을 기록합니다.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                aria-hidden="true"
                className="bg-section-bg border border-border rounded-xl p-6 animate-pulse"
              >
                <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-muted-foreground" role="alert">
            <FileText size={40} className="mx-auto mb-4 opacity-30" aria-hidden="true" />
            <p className="mb-4">블로그 글을 불러오는 중 오류가 발생했습니다.</p>
            <a
              href="https://velog.io/@beanlove97"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border hover:border-primary text-sm text-muted-foreground hover:text-primary rounded-lg transition-colors"
            >
              <ExternalLink size={14} aria-hidden="true" />
              Velog에서 직접 보기
              <span className="sr-only">(새 탭에서 열림)</span>
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => {
              const recent = isRecent(post.pubDate);
              return (
              <motion.a
                key={post.link}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${post.title} (새 탭에서 열림)`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group bg-section-bg border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all block relative overflow-hidden"
              >
                {/* hover shimmer line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* New badge on recent posts */}
                {index === 0 && recent && (
                  <div className="absolute top-3 right-3 px-1.5 py-0.5 bg-primary text-white text-[10px] font-semibold rounded-full" aria-hidden="true">
                    NEW
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 mb-3">
                  {recent ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
                      최신
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      <FileText size={10} aria-hidden="true" />
                      블로그
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{formatDate(post.pubDate)}</span>
                </div>

                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <ExternalLink
                    size={14}
                    className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {post.description}
                </p>
              </motion.a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
