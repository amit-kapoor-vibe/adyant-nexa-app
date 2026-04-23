"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { FadeSection } from "./FadeSection";

const TIERS = [
  { name: "Nexa Audit", price: "₹4,999", period: "one-time", desc: "For brands bleeding ad budget on slow pages. Find out exactly why you're losing leads.", features: ["10-Page Audit Report", "Pixel Health Check", "Prioritized Fix List", "100% Adjusted in Build Fee", "WhatsApp Support"], cta: "Get Diagnosed", highlight: false },
  { name: "Nexa Sprint", price: "₹38,000", period: "+ ₹12k/mo", desc: "The 'Foot-in-the-Door'. A high-speed single-page sales machine to prove ROI fast.", features: ["Single-Page Architecture", "Sub-0.5s Load Time", "Lead Form Sync", "Basic Meta Pixel Setup", "2 Revision Rounds"], cta: "Start Lean", highlight: false },
  { name: "Nexa Growth", price: "₹65,000", period: "+ ROAS Bonus", desc: "Our Primary Vehicle. Full performance architecture + 'Skin in the Game' scaling.", features: ["Multi-Page Infrastructure", "Server-Side Tracking", "Meta/Google Ads Mastery", "Automated CRM Sync", "Monthly Performance Call", "Lead/ROAS Bonus Model"], cta: "Scale with Us", highlight: true },
];

export const PricingSection = ({ onAudit }: { onAudit: () => void }) => {
  return (
    <section id="pricing" style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 3vw, 1.75rem)", background: "#020202" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>PARTNERSHIP MODELS_</span>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#E5E5E5", lineHeight: 1.1 }}>
              Zero Risk. <span style={{ color: "#00F2FF" }}>Skin in the Game.</span>
            </h2>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.35)", lineHeight: 1.85, maxWidth: 440, margin: "24px auto 0" }}>
              We replaced the bloated agency retainer with a performance model. Start with a risk-free audit, or go all-in on growth. When you win, we win.
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
                  <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 4vw, 3rem)", color: "#E5E5E5", lineHeight: 1 }}>{tier.price}</span>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(229,229,229,0.3)", marginBottom: 4 }}>{tier.period}</span>
                </div>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "rgba(229,229,229,0.35)", lineHeight: 1.75 }}>{tier.desc}</p>
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
                  if (tier.name === "Nexa Audit") {
                    onAudit();
                  } else {
                    window.location.hash = "#contact";
                  }
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
