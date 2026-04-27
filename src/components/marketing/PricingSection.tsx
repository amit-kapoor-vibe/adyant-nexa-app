"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { FadeSection } from "@/components/FadeSection";
import { Heading } from "@/components/ui/Heading";
import { pricingTiers } from "@/data/marketingData";

interface PricingSectionProps {
  onAudit: () => void;
  currency: "USD" | "INR";
}

export const PricingSection = ({ onAudit, currency }: PricingSectionProps) => {
  return (
    <section id="pricing" style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1rem, 3vw, 1.75rem)", background: "#020202" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>INVESTMENT TIERS_</span>
            <Heading level="h2" style={{ color: "#E5E5E5" }}>
              Skin In <span style={{ color: "#00F2FF" }}>The Game.</span>
            </Heading>
            <p style={{ 
              fontFamily: "var(--font-geist-mono)", 
              fontSize: 13, 
              color: "rgba(229,229,229,0.35)", 
              lineHeight: 1.85, 
              maxWidth: 480, 
              margin: "24px auto 0",
              padding: "0 10px"
            }}>
              Our pricing is designed to align with your growth. We only profit when your revenue expands.
            </p>
          </div>
        </FadeSection>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", 
          gap: 20, 
          alignItems: "start" 
        }}>
          {pricingTiers.map((tier, i) => (
            <motion.div 
              key={tier.name}
              initial={{ opacity: 0, scale: 0.98, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 120, damping: 25, delay: i * 0.1 }}
              style={{
                position: "relative", 
                padding: "clamp(32px, 5vw, 48px) clamp(24px, 4vw, 40px)", 
                display: "flex", 
                flexDirection: "column", 
                gap: 32,
                background: tier.highlight ? "rgba(0,242,255,0.02)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${tier.highlight ? "rgba(0,242,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                boxShadow: tier.highlight ? "0 0 100px rgba(0,242,255,0.05)" : "none",
              }}
            >
              {tier.highlight && (
                <div style={{ 
                  position: "absolute", 
                  top: -14, 
                  left: "50%", 
                  transform: "translateX(-50%)", 
                  background: "#00F2FF", 
                  color: "#000", 
                  fontFamily: "var(--font-geist-mono)", 
                  fontWeight: 700, 
                  fontSize: 9, 
                  letterSpacing: "0.3em", 
                  textTransform: "uppercase", 
                  padding: "6px 20px", 
                  whiteSpace: "nowrap" 
                }}>
                  Most Popular
                </div>
              )}
              
              <div style={{ paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="editorial-tag" style={{ 
                  display: "block", 
                  marginBottom: 18, 
                  fontSize: 10, 
                  opacity: tier.highlight ? 1 : 0.5, 
                  color: tier.highlight ? "#00F2FF" : "inherit" 
                }}>{tier.name}</span>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 4vw, 3rem)", color: "#E5E5E5", lineHeight: 1 }}>
                      {currency === "USD" ? tier.basePrice.usd : tier.basePrice.inr}
                    </span>
                  </div>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(229,229,229,0.3)", marginBottom: 4 }}>/mo base</span>
                </div>
                
                <div style={{ 
                  padding: "12px 16px", 
                  background: tier.highlight ? "rgba(0,242,255,0.05)" : "rgba(255,255,255,0.03)", 
                  borderLeft: "2px solid #00F2FF", 
                  marginBottom: 24 
                }}>
                  <span className="editorial-tag" style={{ fontSize: 8, color: "#00F2FF", display: "block", marginBottom: 4 }}>Performance Fee_</span>
                  <p style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14, color: "#E5E5E5", lineHeight: 1.4 }}>+ {tier.performanceFee}</p>
                </div>
                
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.35)", lineHeight: 1.75 }}>{tier.description}</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
                {tier.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <CheckCircle size={15} color={tier.highlight ? "#00F2FF" : "rgba(229,229,229,0.25)"} style={{ flexShrink: 0, marginTop: 4 }} />
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(229,229,229,0.45)", lineHeight: 1.6 }}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onAudit}
                className="btn-primary"
                style={{
                  display: "flex", 
                  justifyContent: "center", 
                  padding: "18px 24px",
                  background: tier.highlight ? "#00F2FF" : "rgba(255,255,255,0.04)",
                  color: tier.highlight ? "#000" : "#E5E5E5",
                  border: tier.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "var(--font-geist-mono)", 
                  fontWeight: 700, 
                  fontSize: 11,
                  letterSpacing: "0.2em", 
                  textTransform: "uppercase", 
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                Initiate Protocol
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
