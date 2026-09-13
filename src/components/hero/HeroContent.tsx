"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { containerVars, itemVars } from "@/lib/animations";
import { Heading } from "@/components/ui/Heading";
import { ArrowRight } from "lucide-react";

const HERO_STATS: [string, string][] = [
  ["₹1.84 Cr+", "Leakage Discovered"],
  ["4 Mins", "Diagnostic Time"],
  ["0–100", "Growth Score Scale"],
];

const pillars = [
  "Inventory Dead Stock",
  "Discount Margin Erosion",
  "Customer Repeat LTV",
  "Marketing Acquisition Cost"
];

const StatStrip = () => (
  <motion.div variants={itemVars} style={{ display: "flex", gap: "clamp(24px, 5vw, 60px)", flexWrap: "wrap", justifyContent: "center" }}>
    {HERO_STATS.map(([v, l]) => (
      <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span className="text-glow-cyan" style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: "clamp(20px, 3.5vw, 32px)", color: "var(--accent-color)", transition: "color 0.4s ease" }}>{v}</span>
        <span className="editorial-tag" style={{ fontSize: 9, opacity: 0.5 }}>{l}</span>
      </div>
    ))}
  </motion.div>
);

interface HeroContentProps {
  onScan?: (url: string) => void;
}

export function HeroContent({ onScan }: HeroContentProps) {
  const [pillarIndex, setPillarIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPillarIndex((prev) => (prev + 1) % pillars.length);
    }, 2200);
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
        padding: "130px 28px 80px",
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
          color: "#00F2FF",
          marginBottom: "20px",
          display: "block"
        }}
      >
        ADYANT NEXA // CONSUMER GROWTH &amp; COMMERCE
      </motion.span>

      {/* Headlines */}
      <Heading level="h1" style={{ marginBottom: 20, userSelect: "none", textAlign: "center" }}>
        <motion.span variants={itemVars} className="glitch-text glitch-shimmer name-reveal" data-text="YOU HAVE THE PRODUCT." style={{ display: "block", fontSize: "clamp(2.2rem, 6.5vw, 4.8rem)", lineHeight: 1.1 }}>
          YOU HAVE THE PRODUCT.
        </motion.span>
        <motion.span variants={itemVars} className="glitch-text glitch-shimmer name-reveal" data-text="WE BUILD THE BUSINESS AROUND IT." style={{ display: "block", animationDelay: "0.2s", fontSize: "clamp(2.2rem, 6.5vw, 4.8rem)", lineHeight: 1.1, color: "#00F2FF" }}>
          WE BUILD THE BUSINESS AROUND IT.
        </motion.span>
      </Heading>

      {/* Dynamic Pillar Line */}
      <motion.div
        variants={itemVars}
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "13px",
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.7)",
          marginBottom: "24px",
          textTransform: "uppercase",
        }}
      >
        Integrated Growth System &bull; Initial Focus in{" "}
        <span
          key={pillarIndex}
          className="animate-role-fade-in"
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 700,
            color: "#00F2FF",
            textTransform: "none",
            display: "inline-block",
            marginLeft: "6px"
          }}
        >
          {pillars[pillarIndex]}
        </span>
      </motion.div>

      {/* Descriptor */}
      <motion.p variants={itemVars} className="blur-in" style={{ fontFamily: "var(--font-inter)", fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: 36, maxWidth: 680, margin: "0 auto 36px", transition: "color 0.4s ease" }}>
        We help product businesses build, launch and scale consumer brands — unifying commerce architecture, performance acquisition, creative storytelling, and retention into one connected growth system.
      </motion.p>

      {/* Primary & Secondary CTA Buttons */}
      <motion.div
        variants={itemVars}
        style={{
          display: "inline-flex",
          gap: "16px",
          marginBottom: "56px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Primary CTA */}
        <Link
          href="/assessment"
          className="btn-primary"
          style={{
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "0.05em",
            borderRadius: "9999px",
            padding: "14px 32px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            boxShadow: "0 0 30px rgba(0,242,255,0.3)",
          }}
        >
          CHECK YOUR D2C READINESS <ArrowRight style={{ width: "16px", height: "16px" }} />
        </Link>

        {/* Secondary CTA */}
        <Link
          href="/how-it-works"
          className="btn-secondary"
          style={{
            fontWeight: 600,
            fontSize: "13px",
            letterSpacing: "0.05em",
            borderRadius: "9999px",
            padding: "14px 28px",
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          EXPLORE THE GROWTH SYSTEM
        </Link>
      </motion.div>

      {/* Trust Metrics Strip */}
      <StatStrip />

    </motion.div>
  );
}
