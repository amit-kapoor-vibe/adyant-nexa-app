"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Globe } from "lucide-react";
import { FadeSection } from "./FadeSection";

const TIERS = [
  { 
    name: "Starter Spark", 
    priceUSD: "$1,499", 
    priceINR: "₹1,25,000",
    period: "One-Time", 
    desc: "A high-end cinematic landing page designed to outshine your competition and capture elite leads.", 
    benefit: "Stop losing leads to competitors with a premium global presence.",
    features: ["Single-Page Architecture", "Sub-0.5s Load Time", "Mobile-First Design", "Basic SEO & Performance", "2 Revision Rounds"], 
    cta: "Start Your Engine", 
    highlight: false 
  },
  { 
    name: "AI-Accelerator", 
    priceUSD: "$4,999", 
    priceINR: "₹4,15,000",
    period: "Most Popular", 
    desc: "A full 5-page platform integrated with NEXA AI to automate lead qualification and triple your conversions.", 
    benefit: "Reclaim 40+ hours/mo of human labor with autonomous qualification.",
    features: ["5-Page Multi-Grid Layout", "Custom NEXA AI Training", "CRM & Lead Sync", "Neural Motion Design", "30-Day Support"], 
    cta: "Scale Globally", 
    highlight: true 
  },
  { 
    name: "Enterprise Agent", 
    priceUSD: "$11,999", 
    priceINR: "₹10,00,000",
    period: "Empire Tier", 
    desc: "The ultimate digital infrastructure. Fully autonomous multi-agent systems that replace human labor costs.", 
    benefit: "Zero lead leakage and full business automation for scaling to $1M+.",
    features: ["Full Product Ecosystem", "Multi-Agent AI Integration", "Client Dashboard (V1)", "Priority Founder Support", "1-Year Maintenance"], 
    cta: "Build Your Empire", 
    highlight: false 
  },
];

export const PricingSection = ({ currency, setCurrency, onAudit }: { currency: "USD" | "INR"; setCurrency: (c: "USD" | "INR") => void; onAudit: () => void }) => {

  return (
    <section id="pricing" style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 3vw, 1.75rem)", background: "#020202" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>INVESTMENT TIERS_</span>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#E5E5E5", lineHeight: 1.1 }}>
              Zero Risk. <span style={{ color: "#00F2FF" }}>Global Performance.</span>
            </h2>
            
            {/* Currency Toggle */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
              <div style={{ 
                background: "rgba(255,255,255,0.03)", 
                border: "1px solid rgba(255,255,255,0.08)", 
                display: "flex", 
                padding: "4px",
                borderRadius: "0px"
              }}>
                <button 
                  onClick={() => setCurrency("USD")}
                  style={{ 
                    padding: "8px 24px", 
                    background: currency === "USD" ? "#00F2FF" : "transparent",
                    color: currency === "USD" ? "#000" : "#E5E5E5",
                    border: "none",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.1em"
                  }}
                >
                  GLOBAL (USD)
                </button>
                <button 
                  onClick={() => setCurrency("INR")}
                  style={{ 
                    padding: "8px 24px", 
                    background: currency === "INR" ? "#00F2FF" : "transparent",
                    color: currency === "INR" ? "#000" : "#E5E5E5",
                    border: "none",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.1em"
                  }}
                >
                  INDIA (INR)
                </button>
              </div>
            </div>

            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.35)", lineHeight: 1.85, maxWidth: 480, margin: "24px auto 0" }}>
              Replacing bloated agency retainers with a high-performance outcome model. When you win, we win. Prices in <span style={{ color: "#00F2FF" }}>{currency}</span>.
            </p>
          </div>
        </FadeSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, alignItems: "start" }}>
          {TIERS.map((tier, i) => (
            <motion.div 
              key={tier.name}
              initial={{ opacity: 0, scale: 0.98, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 120, damping: 25, delay: i * 0.1 }}
              style={{
                position: "relative", 
                padding: "48px 40px", 
                display: "flex", 
                flexDirection: "column", 
                gap: 32,
                background: tier.highlight ? "rgba(0,242,255,0.02)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${tier.highlight ? "rgba(0,242,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                boxShadow: tier.highlight ? "0 0 100px rgba(0,242,255,0.05)" : "none",
              }}
            >
              {tier.highlight && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#00F2FF", color: "#000", fontFamily: "var(--font-geist-mono)", fontWeight: 700, fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", padding: "6px 20px", whiteSpace: "nowrap" }}>
                  Most Popular
                </div>
              )}
              
              <div style={{ paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="editorial-tag" style={{ display: "block", marginBottom: 18, fontSize: 10, opacity: tier.highlight ? 1 : 0.5, color: tier.highlight ? "#00F2FF" : "inherit" }}>{tier.name}</span>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 4vw, 3rem)", color: "#E5E5E5", lineHeight: 1 }}>
                      {currency === "USD" ? tier.priceUSD : tier.priceINR}
                    </span>
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(0,242,255,0.4)", marginTop: 4 }}>
                      ≈ {currency === "USD" ? tier.priceINR : tier.priceUSD}
                    </span>
                  </div>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(229,229,229,0.3)", marginBottom: 4 }}>{tier.period}</span>
                </div>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "rgba(229,229,229,0.35)", lineHeight: 1.75, marginBottom: 24 }}>{tier.desc}</p>
                <div style={{ padding: "12px 16px", background: tier.highlight ? "rgba(0,242,255,0.05)" : "rgba(255,255,255,0.03)", borderLeft: "2px solid #00F2FF" }}>
                  <span className="editorial-tag" style={{ fontSize: 8, color: "#00F2FF", display: "block", marginBottom: 4 }}>Core Benefit_</span>
                  <p style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 13, color: "#E5E5E5", lineHeight: 1.4 }}>{tier.benefit}</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
                {tier.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <CheckCircle size={15} color={tier.highlight ? "#00F2FF" : "rgba(229,229,229,0.25)"} style={{ flexShrink: 0, marginTop: 4 }} />
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "rgba(229,229,229,0.45)", lineHeight: 1.6 }}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={(e) => {
                  window.location.hash = "#contact";
                }}
                className={tier.highlight ? "btn-primary" : ""}
                style={{
                  display: "flex", 
                  justifyContent: "center", 
                  padding: "16px 24px",
                  background: tier.highlight ? "#00F2FF" : "rgba(255,255,255,0.04)",
                  color: tier.highlight ? "#000" : "#E5E5E5",
                  border: tier.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "var(--font-geist-mono)", 
                  fontWeight: 700, 
                  fontSize: 12,
                  letterSpacing: "0.2em", 
                  textTransform: "uppercase", 
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
