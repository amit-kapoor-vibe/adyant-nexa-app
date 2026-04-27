"use client";

import { motion } from "framer-motion";
import { Globe, Target, Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeSection } from "./FadeSection";
import { Heading } from "./ui/Heading";

const SERVICES = [
  { 
    id: "01", 
    Icon: Target, 
    tag: "Diagnostic", 
    title: "Leaky Funnel Recovery",
    desc: "Feature: 48-hour deep-scan of your digital ecosystem. Advantage: Identifies revenue leakage points that standard agencies miss. Benefit: Stop burning ad spend and reclaim up to 30% of lost leads instantly.",
    tags: ["UX Teardown", "Pixel Health Check", "Leakage Audit"] 
  },
  { 
    id: "02", 
    Icon: Cpu, 
    tag: "NEXA AI", 
    title: "Autonomous Sales Engine",
    desc: "Feature: Custom-trained BANT-qualified AI agent (NEXA). Advantage: 24/7 autonomous lead qualification and booking. Benefit: $15k+ monthly labor savings with a pipeline of pre-qualified, ready-to-buy clients.",
    tags: ["BANT Qualification", "24/7 Engagement", "CRM Auto-Sync"] 
  },
  { 
    id: "03", 
    Icon: Globe, 
    tag: "Growth", 
    title: "Market Dominance Scaling",
    desc: "Feature: Full-stack Meta/Google Ads + Server-side Tracking. Advantage: 100% data accuracy for algorithmic scaling. Benefit: Predictable revenue growth and market-leading Customer Acquisition Costs (CAC).",
    tags: ["CAPI Integration", "LTV Optimization", "ROI Dashboards"] 
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 3vw, 1.75rem)", position: "relative", overflow: "hidden", background: "#020202" }}>
      {/* Ghost Typography BG */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden" }}>
        <span className="ghost-text">INTELLIGENCE</span>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <FadeSection>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 32, marginBottom: 72 }}>
            <div>
              <span className="editorial-tag" style={{ display: "block", marginBottom: 20 }}>Revenue Frameworks_</span>
              <Heading level="h2" style={{ color: "#E5E5E5" }}>
                Growth <span style={{ color: "#00F2FF" }}>Architecture</span>
              </Heading>
            </div>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.38)", lineHeight: 1.8, maxWidth: 280 }}>
              Three heavily focused verticals. One singular mission — dominate your market.
            </p>
          </div>
        </FadeSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {SERVICES.map((svc, i) => (
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
              className="glass-panel"
              style={{
                marginTop: i === 1 ? 40 : 0, // Visual stagger only on desktop
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                minHeight: "480px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 60 }}>
                <div style={{ padding: 14, border: "1px solid rgba(0,242,255,0.15)", background: "rgba(0,242,255,0.04)", color: "#00F2FF" }}>
                  <svc.Icon size={20} />
                </div>
                <span className="editorial-tag" style={{ fontSize: 10, opacity: 0.2 }}>{svc.id}</span>
              </div>

              <div style={{ marginTop: "auto" }}>
                <span className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, display: "block", marginBottom: 16 }}>{svc.tag}</span>
                <Heading level="h3" style={{ color: "#E5E5E5", marginBottom: 20 }}>{svc.title}</Heading>
                <div style={{ marginBottom: 32 }}>
                  {svc.desc.split(/(Feature:|Advantage:|Benefit:)/).map((part, idx) => {
                    const isLabel = ["Feature:", "Advantage:", "Benefit:"].includes(part);
                    return (
                      <span key={idx} style={{ 
                        display: isLabel ? "block" : "inline",
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: isLabel ? 10 : 13,
                        color: isLabel ? "#00F2FF" : "rgba(229,229,229,0.45)",
                        fontWeight: isLabel ? 800 : 400,
                        letterSpacing: isLabel ? "0.1em" : "normal",
                        textTransform: isLabel ? "uppercase" : "none",
                        marginTop: isLabel && idx > 0 ? 12 : 0,
                        marginBottom: isLabel ? 4 : 0
                      }}>
                        {part}
                      </span>
                    );
                  })}
                </div>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
                  {svc.tags.map(t => (
                    <span key={t} className="editorial-tag" style={{ fontSize: 9, padding: "6px 12px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "rgba(229,229,229,0.3)" }}>{t}</span>
                  ))}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
                  <a href="#contact" style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-geist-mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#00F2FF", textDecoration: "none" }}>
                    <span>Engage Protocol</span>
                    <ArrowRight size={14} />
                  </a>
                  {svc.id === "03" && (
                    <Link href="/marketing" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(229,229,229,0.3)", textDecoration: "none", borderBottom: "1px solid rgba(229,229,229,0.1)", paddingBottom: 2 }}>
                      View Marketing Dept_
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
