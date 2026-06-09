"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { containerVars, itemVars } from "@/lib/animations";
import { Heading } from "@/components/ui/Heading";

const HERO_STATS: [string, string][] = [
  ["0.5s", "LCP Speed"],
  ["400%", "Revenue Growth"],
  ["∞", "Market Dominance"],
];

const roles = [
  "Systems Engineering",
  "Multi-Agent AI",
  "Absolute Speed",
  "Conversion Optimization"
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
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      variants={containerVars}
      initial="hidden"
      animate="visible"
      style={{
        position: "relative", zIndex: 10, display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center",
        padding: "140px 28px 100px",
        maxWidth: 1100, margin: "0 auto", width: "100%",
      }}
    >
      {/* Eyebrow Label */}
      <motion.span
        variants={itemVars}
        className="editorial-tag blur-in"
        style={{
          fontSize: "10px",
          letterSpacing: "0.3em",
          color: "hsl(var(--muted))",
          marginBottom: "24px",
          display: "block"
        }}
      >
        ADYANT NEXA // DIGITAL OPERATIONS
      </motion.span>

      {/* Headlines */}
      <Heading level="h1" style={{ marginBottom: 28, userSelect: "none", textAlign: "center" }}>
        <motion.span variants={itemVars} className="glitch-text glitch-shimmer name-reveal" data-text="ADYANT" style={{ display: "block", fontSize: "clamp(2.8rem, 12vw, 7.5rem)" }}>ADYANT</motion.span>
        <motion.span variants={itemVars} className="glitch-text glitch-shimmer name-reveal" data-text="NEXA" style={{ display: "block", animationDelay: "0.2s", fontSize: "clamp(2.8rem, 12vw, 7.5rem)" }}>NEXA</motion.span>
      </Heading>

      {/* Role Line */}
      <motion.div
        variants={itemVars}
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "13px",
          letterSpacing: "0.1em",
          color: "hsl(var(--muted))",
          marginBottom: "32px",
          textTransform: "uppercase",
        }}
      >
        We engineer{" "}
        <span
          key={roleIndex}
          className="animate-role-fade-in"
          style={{
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            color: "hsl(var(--text))",
            textTransform: "none",
            letterSpacing: "normal",
            display: "inline-block",
            marginLeft: "4px"
          }}
        >
          {roles[roleIndex]}
        </span>
      </motion.div>

      {/* Descriptor */}
      <motion.p variants={itemVars} className="blur-in" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--muted-text)", lineHeight: 1.8, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px", transition: "color 0.4s ease" }}>
        High-Performance Infrastructure for the Conversion-Obsessed.<br />
        Revenue Systems Engineering · Multi-Agent AI · Absolute Speed.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        variants={itemVars}
        style={{
          display: "inline-flex",
          gap: "16px",
          marginBottom: "64px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* See Works */}
        <a
          href="#work"
          style={{
            backgroundColor: "hsl(var(--text))",
            color: "hsl(var(--bg))",
            fontFamily: "var(--font-inter)",
            fontWeight: 600,
            fontSize: "12px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            borderRadius: "9999px",
            padding: "14px 28px",
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
            transition: "all 0.3s ease",
            border: "1px solid transparent",
          }}
          onClick={(e) => {
            e.preventDefault();
            window.lenis?.scrollTo("#work", { offset: -60, duration: 1.5 });
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.className = "accent-gradient";
            e.currentTarget.style.color = "#020202";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "hsl(var(--text))";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.className = "";
            e.currentTarget.style.color = "hsl(var(--bg))";
          }}
        >
          See Works
        </a>

        {/* Reach out / Audit */}
        <a
          href="#investment"
          style={{
            backgroundColor: "transparent",
            color: "hsl(var(--text))",
            fontFamily: "var(--font-inter)",
            fontWeight: 600,
            fontSize: "12px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            border: "1px solid hsl(var(--stroke))",
            borderRadius: "9999px",
            padding: "14px 28px",
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
          onClick={(e) => {
            e.preventDefault();
            if (onScan) {
              onScan("");
            } else {
              window.lenis?.scrollTo("#investment", { offset: -60, duration: 1.5 });
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.className = "accent-gradient";
            e.currentTarget.style.color = "#020202";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "hsl(var(--stroke))";
            e.currentTarget.className = "";
            e.currentTarget.style.color = "hsl(var(--text))";
          }}
        >
          Audit System ↗
        </a>
      </motion.div>

      {/* Trust Metrics Strip */}
      <StatStrip />

    </motion.div>
  );
}
