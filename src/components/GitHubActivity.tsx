"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Github, GitCommitHorizontal, ExternalLink } from "lucide-react";

interface CommitEvent {
  repo: string;
  branch: string;
  commits: { message: string; sha: string }[];
  date: string;
}

interface Stats {
  totalEvents: number;
  pushCount: number;
  reposActive: number;
}

export default function GitHubActivity() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [events, setEvents] = useState<CommitEvent[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data) => {
        setEvents(data.events || []);
        setStats(data.stats || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "오늘";
    if (diffDays === 1) return "어제";
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    return `${Math.floor(diffDays / 30)}달 전`;
  };

  const getDailyActivity = () => {
    const days = 14;
    const counts: number[] = Array(days).fill(0);
    const now = new Date();
    events.forEach((e) => {
      const diff = Math.floor((now.getTime() - new Date(e.date).getTime()) / 86400000);
      if (diff >= 0 && diff < days) counts[days - 1 - diff]++;
    });
    return counts;
  };

  const dailyActivity = getDailyActivity();
  const maxActivity = Math.max(...dailyActivity, 1);

  return (
    <section id="github" className="py-24 px-6 bg-section-bg" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="text-sm text-primary uppercase tracking-wider">
            GitHub Activity
          </span>
          <div className="flex items-end justify-between mt-2">
            <h2 className="text-3xl md:text-4xl font-bold">최근 활동</h2>
            <a
              href="https://github.com/eunjeong-97"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary-light transition-colors"
            >
              <Github size={14} /> GitHub 보기 <ExternalLink size={14} />
            </a>
          </div>
          <p className="text-muted-foreground mt-3">
            꾸준히 코드를 작성하고 있습니다.
          </p>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-10"
          >
            {[
              { label: "최근 이벤트", value: stats.totalEvents + "+" },
              { label: "푸시 횟수", value: stats.pushCount },
              { label: "활성 레포", value: stats.reposActive },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-background border border-border rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-bold text-primary mb-1">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* 14-day activity bars */}
        {!loading && events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 bg-background border border-border rounded-xl p-4"
          >
            <div className="text-xs text-muted-foreground mb-3">최근 14일 Push 활동</div>
            <div className="flex items-end gap-1 h-10">
              {dailyActivity.map((count, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col justify-end"
                  title={`${count}건`}
                >
                  <motion.div
                    className={`rounded-sm ${count > 0 ? "bg-primary" : "bg-border"}`}
                    initial={{ height: 0 }}
                    animate={isInView ? { height: `${Math.max((count / maxActivity) * 100, count > 0 ? 15 : 4)}%` } : { height: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.03 }}
                    style={{ minHeight: count > 0 ? "4px" : "2px" }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>14일 전</span>
              <span>오늘</span>
            </div>
          </motion.div>
        )}

        {/* Event List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-background border border-border rounded-xl p-5 animate-pulse"
              >
                <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Github size={40} className="mx-auto mb-4 opacity-30" />
            <p>GitHub 활동을 불러오는 중 오류가 발생했습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={`${event.repo}-${event.date}`}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                className="bg-background border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Github size={14} className="text-primary" />
                    <span className="font-medium text-sm text-foreground">
                      {event.repo}
                    </span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      {event.branch}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(event.date)}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {event.commits.map((commit) => (
                    <div
                      key={commit.sha}
                      className="flex items-start gap-2 text-sm"
                    >
                      <GitCommitHorizontal
                        size={14}
                        className="text-muted-foreground mt-0.5 flex-shrink-0"
                      />
                      <span className="text-muted-foreground leading-snug">
                        {commit.message}
                      </span>
                      <span className="text-xs text-primary/60 font-mono flex-shrink-0">
                        {commit.sha}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
