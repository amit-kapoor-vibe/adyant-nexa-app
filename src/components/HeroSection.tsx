"use client";

import { motion } from "framer-motion";
import { HeroContent } from "./hero/HeroContent";

export const HeroSection = ({ onScan }: { onScan?: (url: string) => void }) => {
  return (
    <section style={{ position: "relative", minHeight: "100vh", width: "100%", display: "flex", alignItems: "flex-start", justifyContent: "center", background: "transparent", transition: "background-color 0.4s ease" }}>

      {/* Cinematic Vignettes */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 0%, var(--bg-color) 100%)", pointerEvents: "none", zIndex: 2, transition: "background 0.4s ease" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, var(--bg-color) 0%, transparent 20%, transparent 80%, var(--bg-color) 100%)", pointerEvents: "none", zIndex: 2, transition: "background 0.4s ease" }} />

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 10, width: "100%" }}>
        <HeroContent onScan={onScan} />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        aria-hidden="true"
        style={{ position: "absolute", bottom: 100, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}
      >
        <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.25, letterSpacing: "0.2em" }}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 40, background: "linear-gradient(to bottom, var(--accent-color), transparent)", transition: "all 0.4s ease" }}
        />
      </motion.div>
    </section>
  );
};
