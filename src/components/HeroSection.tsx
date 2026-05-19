"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { HeroContent } from "./hero/HeroContent";

const NeuralGalaxyPro = dynamic(() => import("./NeuralGalaxyPro"), {
  ssr: false,
  loading: () => <div style={{ position: "absolute", inset: 0, backgroundColor: "#020202" }} />
});

export const HeroSection = ({ onScan }: { onScan?: (url: string) => void }) => {
  return (
    <section style={{ position: "relative", height: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#020202" }}>
      {/* 3D Visual Layer */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <NeuralGalaxyPro />
      </div>

      {/* Cinematic Vignettes */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 0%, #020202 100%)", pointerEvents: "none", zIndex: 2 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #020202 0%, transparent 20%, transparent 80%, #020202 100%)", pointerEvents: "none", zIndex: 2 }} />

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
        style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}
      >
        <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.25 }}>Scroll Protocol</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #00F2FF, transparent)" }}
        />
      </motion.div>
    </section>
  );
};
