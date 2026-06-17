"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Github, GitCommitHorizontal, ExternalLink, Activity, GitBranch, FolderGit2 } from "lucide-react";

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
    const days = 30;
    const counts: number[] = Array(days).fill(0);
    const now = new Date();
    events.forEach((e) => {
      const diff = Math.floor((now.getTime() - new Date(e.date).getTime()) / 86400000);
      if (diff >= 0 && diff < days) counts[days - 1 - diff]++;
    });
    return counts;
  };

  const getDayLabel = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-background border border-border rounded-xl p-4 text-center animate-pulse">
                <div className="w-4 h-4 bg-muted rounded mx-auto mb-2" />
                <div className="h-7 bg-muted rounded w-12 mx-auto mb-1" />
                <div className="h-3 bg-muted rounded w-16 mx-auto" />
              </div>
            ))
          ) : stats ? (
            [
              { label: "최근 이벤트", value: stats.totalEvents + "+", icon: Activity },
              { label: "푸시 횟수", value: stats.pushCount, icon: GitBranch },
              { label: "활성 레포", value: stats.reposActive, icon: FolderGit2 },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-background border border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors group"
              >
                <s.icon size={16} className="text-primary/50 group-hover:text-primary transition-colors mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary mb-1">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))
          ) : null}
        </motion.div>

        {/* 30-day activity heatmap */}
        {!loading && events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 bg-background border border-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-muted-foreground">최근 30일 Push 활동</div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span>적음</span>
                {[0, 0.3, 0.6, 1].map((opacity, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{
                      background: opacity === 0 ? "var(--border)" : `rgba(59,130,246,${opacity})`,
                    }}
                  />
                ))}
                <span>많음</span>
              </div>
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.ceil(dailyActivity.length / 5)}, 1fr)` }}>
              {dailyActivity.map((count, i) => {
                const daysAgo = dailyActivity.length - 1 - i;
                const intensity = count === 0 ? 0 : Math.min(1, 0.2 + (count / maxActivity) * 0.8);
                return (
                  <motion.div
                    key={i}
                    title={`${getDayLabel(daysAgo)}: ${count > 0 ? `${count}건의 Push` : "활동 없음"}`}
                    className="h-3 rounded-sm cursor-default"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.015 }}
                    style={{
                      background: count === 0 ? "var(--border)" : `rgba(59,130,246,${intensity})`,
                    }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
              <span>30일 전</span>
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
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                className="bg-background border border-border rounded-xl p-5 hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Github size={14} className="text-primary" />
                    <a
                      href={`https://github.com/eunjeong-97/${event.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-sm text-foreground hover:text-primary transition-colors"
                    >
                      {event.repo}
                    </a>
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
                      <span className="text-muted-foreground leading-snug flex-1">
                        {commit.message}
                      </span>
                      <a
                        href={`https://github.com/eunjeong-97/${event.repo}/commit/${commit.sha}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-primary/60 hover:text-primary font-mono flex-shrink-0 transition-colors"
                      >
                        {commit.sha}
                      </a>
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
