"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { trackEvent } from "@/utils/analytics";
import { containerVars, itemVars } from "@/lib/animations";
import { Heading } from "@/components/ui/Heading";

const HERO_STATS: [string, string][] = [
  ["0.5s", "LCP Speed"],
  ["400%", "Revenue Growth"],
  ["∞", "Market Dominance"],
];

const StatStrip = () => (
  <motion.div variants={itemVars} style={{ display: "flex", gap: "clamp(32px, 6vw, 80px)", flexWrap: "wrap", justifyContent: "center" }}>
    {HERO_STATS.map(([v, l]) => (
      <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span className="text-glow-cyan" style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: "clamp(20px, 3.5vw, 36px)", color: "var(--accent-color)", transition: "color 0.4s ease" }}>{v}</span>
        <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.35 }}>{l}</span>
      </div>
    ))}
  </motion.div>
);

interface HeroContentProps {
  onScan?: (url: string) => void;
}

export function HeroContent({ onScan }: HeroContentProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && onScan) {
      trackEvent('scan_initiated', { source: 'hero_section', url });
      onScan(url);
    }
  };

  return (
    <motion.div
      variants={containerVars}
      initial="hidden"
      animate="visible"
      style={{
        position: "relative", zIndex: 10, display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center",
        padding: "140px 28px 60px",
        maxWidth: 1100, margin: "0 auto", width: "100%",
      }}
    >

      {/* Headlines */}
      <Heading level="h1" style={{ marginBottom: 40, userSelect: "none", textAlign: "center" }}>
        <motion.span variants={itemVars} className="glitch-text glitch-shimmer" data-text="ADYANT" style={{ display: "block", fontSize: "clamp(2.8rem, 12vw, 7.5rem)" }}>ADYANT</motion.span>
        <motion.span variants={itemVars} className="glitch-text glitch-shimmer" data-text="NEXA" style={{ display: "block", animationDelay: "0.2s", fontSize: "clamp(2.8rem, 12vw, 7.5rem)" }}>NEXA</motion.span>
      </Heading>

      {/* Descriptor */}
      <motion.p variants={itemVars} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--muted-text)", lineHeight: 1.8, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px", transition: "color 0.4s ease" }}>
        High-Performance Infrastructure for the Conversion-Obsessed.<br />
        Revenue Systems Engineering · Multi-Agent AI · Absolute Speed.
      </motion.p>

      {/* Audit Search Bar */}
      <motion.div variants={itemVars} style={{ marginBottom: 48, width: "100%", maxWidth: 640 }}>
        <form
          onSubmit={handleSubmit}
          role="search"
          aria-label="Website performance audit"
          style={{ display: "flex", alignItems: "center", background: "var(--glass-bg)", border: "1px solid var(--border-color)", padding: "6px", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
          onFocusCapture={e => { (e.currentTarget as HTMLFormElement).style.borderColor = "var(--accent-color)"; (e.currentTarget as HTMLFormElement).style.background = "var(--shadow-color)"; }}
          onBlurCapture={e => { (e.currentTarget as HTMLFormElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLFormElement).style.background = "var(--glass-bg)"; }}
        >
          <div style={{ paddingLeft: 18, pointerEvents: "none", display: "flex", alignItems: "center" }}>
            <Search size={18} color="var(--muted-text)" style={{ opacity: 0.6, transition: "color 0.4s ease" }} aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="Analyze Your Revenue Engine (URL)..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="Enter website URL for performance audit"
            style={{ flex: 1, background: "none", border: "none", color: "var(--text-color)", padding: "14px", fontFamily: "var(--font-geist-mono)", fontSize: 13, outline: "none", transition: "color 0.4s ease" }}
          />
          <button type="submit" className="btn-primary" style={{ border: "none", padding: "12px 28px", minWidth: "120px", display: "flex", justifyContent: "center" }}>
            Scan
          </button>
        </form>
      </motion.div>

      {/* Trust Metrics Strip */}
      <StatStrip />

    </motion.div>
  );
}

