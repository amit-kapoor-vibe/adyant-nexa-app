"use client";

import React from "react";

export default function GlobalBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        background: "var(--bg-color)",
        overflow: "hidden",
      }}
    >
      {/* ─── 1. PRIMARY HERO AMBIENT SPOTLIGHT ─── */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "650px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(0, 71, 255, 0.06) 0%, rgba(0, 71, 255, 0.02) 45%, transparent 72%)",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      {/* ─── 2. MID-PAGE SUBTLE ACCENT ORB ─── */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          right: "-10%",
          width: "700px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 71, 255, 0.03) 0%, rgba(0, 71, 255, 0.01) 50%, transparent 70%)",
          filter: "blur(140px)",
          pointerEvents: "none",
        }}
      />

      {/* ─── 3. LOWER SECTION STRATEGIC AMBIENT GLOW ─── */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-5%",
          width: "650px",
          height: "550px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 71, 255, 0.025) 0%, transparent 65%)",
          filter: "blur(130px)",
          pointerEvents: "none",
        }}
      />

      {/* ─── 4. ULTRA-SUBTLE ARCHITECTURAL MICRO-GRID ─── */}
      <div
        className="hud-grid"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.04,
        }}
      />

      {/* ─── 5. SMOOTH RADIAL VIGNETTE FOR TEXT CONTRAST ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, transparent 40%, rgba(248, 248, 250, 0.85) 100%)",
        }}
      />
    </div>
  );
}

