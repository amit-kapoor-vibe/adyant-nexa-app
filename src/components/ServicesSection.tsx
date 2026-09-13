"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, BarChart3, Users, IndianRupee, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeSection } from "./FadeSection";
import { Heading } from "./ui/Heading";

const PILLARS = [
  { 
    id: "01", 
    Icon: Package, 
    tag: "INVENTORY INTELLIGENCE", 
    title: "Dead Stock Capital Recovery",
    desc: "Feature: 90+ day inventory ageing analysis. Advantage: Pinpoints exact working capital locked in non-moving stock. Benefit: Release ₹5L to ₹25L in trapped liquidity.",
    tags: ["Stock Turnover", "Ageing Diagnostic", "Markdown Velocity"] 
  },
  { 
    id: "02", 
    Icon: BarChart3, 
    tag: "MARGIN PRESERVATION", 
    title: "Discount Erosion Prevention",
    desc: "Feature: Full-price sell-through tracking. Advantage: Prevents unplanned broad storewide discounts. Benefit: Protect gross margins and recover net bottom-line profit.",
    tags: ["Gross Margin", "Discount Caps", "Bundle Pricing"] 
  },
  { 
    id: "03", 
    Icon: Users, 
    tag: "CUSTOMER RETENTION", 
    title: "Repeat Purchase LTV Engine",
    desc: "Feature: Automated customer repeat purchase tracking. Advantage: Converts one-time buyers into loyal repeat customers. Benefit: Lift repeat purchase rates from 20% to 35%+.",
    tags: ["LTV Recovery", "WhatsApp Winback", "VIP Rewards"] 
  },
  { 
    id: "04", 
    Icon: IndianRupee, 
    tag: "MARKETING EFFICIENCY", 
    title: "Acquisition & CAC Optimization",
    desc: "Feature: Store footfall & ad spend attribution. Advantage: Eliminates wasteful ad spend on unoptimized funnels. Benefit: Lower Customer Acquisition Cost (CAC) predictably.",
    tags: ["Conversion Rate", "CAC Reduction", "Local Store Meta Ads"] 
  },
];

export const ServicesSection = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="services" style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 3vw, 1.75rem)", position: "relative", overflow: "hidden", background: "var(--bg-color)", transition: "background 0.4s ease" }}>
      {/* Ghost Typography BG */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden" }}>
        <span className="ghost-text">SYSTEM</span>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <FadeSection>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 32, marginBottom: 72 }}>
            <div>
              <span className="editorial-tag" style={{ display: "block", marginBottom: 20 }}>CONNECTED GROWTH SYSTEM_</span>
              <Heading level="h2" style={{ color: "var(--text-color)", transition: "color 0.4s ease" }}>
                Growth System <span style={{ color: "var(--accent-color)", transition: "color 0.4s ease" }}>Architecture</span>
              </Heading>
            </div>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--muted-text)", opacity: 0.8, lineHeight: 1.8, maxWidth: 360, transition: "color 0.4s ease" }}>
              Core operational components of our connected growth system — engineering consumer brands with capital discipline.
            </p>
          </div>
        </FadeSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 24 }}>
          {PILLARS.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20, 
                delay: i * 0.1 
              }}
              onMouseEnter={() => setHoveredId(svc.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="glass-panel"
              style={{
                padding: "36px 28px",
                display: "flex",
                flexDirection: "column",
                minHeight: "460px",
                position: "relative",
                cursor: "pointer"
              }}
            >
              {/* Halftone Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "radial-gradient(circle, #000 1.2px, transparent 1.2px)",
                  backgroundSize: "5px 5px",
                  opacity: 0.15,
                  mixBlendMode: "multiply",
                  pointerEvents: "none",
                  zIndex: 1
                }}
              />

              {/* Active Cyber Laser Sweep */}
              <div className="cyber-scanline" />

              {/* Tactical Sci-Fi Corner Brackets */}
              <div className="cyber-bracket cb-tl" />
              <div className="cyber-bracket cb-tr" />
              <div className="cyber-bracket cb-bl" />
              <div className="cyber-bracket cb-br" />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, position: "relative", zIndex: 6 }}>
                <div style={{ padding: 12, border: "1px solid var(--accent-color)", background: "var(--shadow-color)", color: "var(--accent-color)", transition: "all 0.4s ease" }}>
                  <svc.Icon size={20} />
                </div>
                <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.35 }}>[ PILLAR: 0{svc.id} ]</span>
              </div>

              <div style={{ marginTop: "auto", position: "relative", zIndex: 2 }}>
                <span className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, display: "block", marginBottom: 12 }}>{svc.tag}</span>
                <Heading level="h3" style={{ color: "var(--text-color)", marginBottom: 16, fontSize: 20, transition: "color 0.4s ease" }}>{svc.title}</Heading>
                <div style={{ marginBottom: 24 }}>
                  {svc.desc.split(/(Feature:|Advantage:|Benefit:)/).map((part, idx) => {
                    const isLabel = ["Feature:", "Advantage:", "Benefit:"].includes(part);
                    return (
                      <span key={idx} style={{ 
                        display: isLabel ? "block" : "inline",
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: isLabel ? 10 : 12,
                        color: isLabel ? "var(--accent-color)" : "var(--muted-text)",
                        fontWeight: isLabel ? 800 : 400,
                        letterSpacing: isLabel ? "0.1em" : "normal",
                        textTransform: isLabel ? "uppercase" : "none",
                        marginTop: isLabel && idx > 0 ? 8 : 0,
                        marginBottom: isLabel ? 2 : 0,
                        transition: "color 0.4s ease"
                      }}>
                        {part}
                      </span>
                    );
                  })}
                </div>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                  {svc.tags.map(t => (
                    <span key={t} className="editorial-tag" style={{ fontSize: 8, padding: "4px 8px", border: "1px solid var(--border-color)", background: "var(--glass-bg)", color: "var(--muted-text)", transition: "all 0.4s ease" }}>{t}</span>
                  ))}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
                  <Link href="/assessment" style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-geist-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-color)", textDecoration: "none", transition: "color 0.4s ease" }}>
                    <span>Run Diagnostic</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
