"use client";

import { CSSProperties } from "react";

// ─── Shimmer keyframe is defined in globals.css as .skeleton-shimmer ──────────

interface SkeletonProps {
  height?: number | string;
  width?: string;
  borderRadius?: number;
  style?: CSSProperties;
}

/** A single shimmer block — use to build skeleton screens. */
export function Skeleton({ height = 20, width = "100%", borderRadius = 0, style }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className="skeleton-shimmer"
      style={{
        height,
        width,
        borderRadius,
        background: "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(0,242,255,0.06) 50%, rgba(255,255,255,0.03) 100%)",
        backgroundSize: "200% 100%",
        ...style,
      }}
    />
  );
}

/** Full-section skeleton for below-the-fold sections. */
export function SectionSkeleton() {
  return (
    <div
      aria-label="Loading section..."
      role="status"
      style={{
        padding: "clamp(4rem, 8vw, 7rem) 28px",
        maxWidth: 1280,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      {/* Tag line */}
      <Skeleton height={10} width="120px" />
      {/* Heading */}
      <Skeleton height={56} width="60%" />
      <Skeleton height={56} width="40%" />
      {/* Body lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
        <Skeleton height={14} width="90%" />
        <Skeleton height={14} width="75%" />
        <Skeleton height={14} width="82%" />
      </div>
      {/* Card grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginTop: 24 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ border: "1px solid rgba(255,255,255,0.05)", padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
            <Skeleton height={20} width="50%" />
            <Skeleton height={80} />
            <Skeleton height={14} width="70%" />
          </div>
        ))}
      </div>
    </div>
  );
}
