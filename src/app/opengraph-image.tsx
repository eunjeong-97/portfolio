import { ImageResponse } from "next/og";

export const runtime = "edge";
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
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: "100px",
            padding: "8px 20px",
            marginBottom: "32px",
          }}
        >
          <span style={{ color: "#60a5fa", fontSize: "18px", fontWeight: 500 }}>
            Frontend &amp; Mobile Developer
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#fafafa",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          박은정
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "28px",
            color: "#a3a3a3",
            lineHeight: 1.5,
            maxWidth: "700px",
            marginBottom: "48px",
          }}
        >
          React · React Native로 웹과 앱을 함께 만듭니다
        </div>

        {/* Tech tags */}
        <div style={{ display: "flex", gap: "12px" }}>
          {["React", "TypeScript", "React Native", "Next.js"].map((tech) => (
            <div
              key={tech}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "8px 16px",
                color: "#a3a3a3",
                fontSize: "18px",
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "80px",
            color: "#3b82f6",
            fontSize: "20px",
          }}
        >
          eunjeong.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
