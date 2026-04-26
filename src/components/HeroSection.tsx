"use client";

import { motion } from "framer-motion";
import { HeroCanvas } from "./hero/HeroCanvas";
import { HeroContent } from "./hero/HeroContent";

/**
 * HeroSection — Orchestrates the canvas background and hero content.
 * Canvas logic: src/components/hero/HeroCanvas.tsx
 * Content & interactions: src/components/hero/HeroContent.tsx
 */
export const HeroSection = ({ onScan }: { onScan?: (url: string) => void }) => {
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#020202" }}>
      {/* Scanline overlay */}
      <div className="scan-overlay" />

      {/* Neural network canvas */}
      <HeroCanvas />

      {/* Vignettes */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 0%, #020202 90%)", pointerEvents: "none", zIndex: 2 }} />
      <div style={{ position: "absolute", inset: "0 0 auto 0", height: 160, background: "linear-gradient(to bottom, #020202, transparent)", pointerEvents: "none", zIndex: 3 }} />
      <div style={{ position: "absolute", inset: "auto 0 0 0", height: 160, background: "linear-gradient(to top, #020202, transparent)", pointerEvents: "none", zIndex: 3 }} />

      {/* Background glow */}
      <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 900, height: 450, background: "radial-gradient(ellipse, rgba(0,242,255,0.05) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none", zIndex: 1 }} />

      {/* Main content */}
      <HeroContent onScan={onScan} />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        aria-hidden="true"
        style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}
      >
        <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.25 }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(0,242,255,0.4), transparent)" }}
        />
      </motion.div>
    </section>
  );
};
