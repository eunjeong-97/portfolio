import { ImageResponse } from "next/og";

export const runtime = "edge";

const OG_STATS = [
  { num: "3+", label: "Years Exp" },
  { num: "5", label: "SDK Integrations" },
  { num: "60+", label: "Pages Built" },
];

const OG_TECH = ["React.js", "TypeScript", "React Native", "Next.js", "Java / Swift"];
export const alt = "박은정 | Frontend & Mobile Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
          gap: "60px",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Blue glow */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Left: Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Open to Work badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                background: "#22c55e",
                borderRadius: "50%",
              }}
            />
            <span
              style={{ color: "#22c55e", fontSize: "20px", fontWeight: 600 }}
            >
              Open to Work
            </span>
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: "80px",
              fontWeight: 800,
              color: "#fafafa",
              lineHeight: 1,
              marginBottom: "16px",
            }}
          >
            박은정
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "30px",
              color: "#3b82f6",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Frontend &amp; Mobile Developer
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "22px",
              color: "#a3a3a3",
              lineHeight: 1.5,
              maxWidth: "560px",
              marginBottom: "44px",
            }}
          >
            React · React Native · SDK 연동 · Native Module
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "40px" }}>
            {OG_STATS.map((stat) => (
              <div
                key={stat.label}
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: 700,
                    color: "#3b82f6",
                  }}
                >
                  {stat.num}
                </span>
                <span style={{ fontSize: "16px", color: "#737373" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Tech stack */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {OG_TECH.map((tech) => (
            <div
              key={tech}
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.25)",
                borderRadius: "10px",
                padding: "12px 24px",
                color: "#60a5fa",
                fontSize: "20px",
                whiteSpace: "nowrap",
              }}
            >
              {tech}
            </div>
          ))}
          <div
            style={{
              fontSize: "16px",
              color: "#3b82f6",
              textAlign: "right",
              marginTop: "8px",
            }}
          >
            eunjeong.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
