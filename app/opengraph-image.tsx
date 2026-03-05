import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "#001A33",
          color: "white",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -1 }}>
          {siteConfig.name}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 28,
            lineHeight: 1.3,
            color: "rgba(255,255,255,0.88)",
            maxWidth: 980,
          }}
        >
          Data Foundations • AI & Automation • Advanced Analytics • DevOps
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#00A4EF",
            }}
          />
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.8)" }}>
            {new URL(siteConfig.url).host}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

