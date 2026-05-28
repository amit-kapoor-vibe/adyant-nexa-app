"use client";

import { motion } from "framer-motion";
import { CheckCircle, Zap } from "lucide-react";
import { FadeSection } from "./FadeSection";
import { Heading } from "./ui/Heading";
import { architectureTiers } from "@/data/marketingData";

interface PricingSectionProps {
  currency?: "USD" | "INR";
  setCurrency?: (currency: "USD" | "INR") => void;
  onAudit?: () => void;
}

export const PricingSection = ({ currency = "INR", onAudit }: PricingSectionProps) => {
  return (
    <section id="investment" style={{ padding: "clamp(6rem, 12vw, 10rem) clamp(1.25rem, 3vw, 1.75rem)", background: "var(--bg-color)", position: "relative", overflow: "hidden", transition: "background 0.4s ease" }}>
      
      {/* Background Decorative Elements */}
      <div className="ambient-orb" style={{ top: "20%", left: "50%", width: "600px", height: "600px", opacity: 0.05 }} />
      <div className="scan-overlay" style={{ opacity: 0.1 }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 10 }}>
        
        {/* Header Section */}
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span className="editorial-tag" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, color: "var(--accent-color)", letterSpacing: "0.4em", transition: "color 0.4s ease" }}>
              <Zap size={12} /> ARCHITECTURE_INVESTMENTS_
            </span>
            <Heading level="h2" style={{ color: "var(--text-color)", lineHeight: 1.1, marginBottom: 32, fontSize: "clamp(2.2rem, 6vw, 4.5rem)", transition: "color 0.4s ease" }}>
              Transparent Pricing. <br /> <span style={{ color: "var(--accent-color)", transition: "color 0.4s ease" }}>Zero Scope Traps.</span>
            </Heading>
            
            <p style={{ 
              fontFamily: "var(--font-inter)", 
              fontSize: "clamp(15px, 1.8vw, 18px)", 
              color: "var(--muted-text)", 
              lineHeight: 1.75, 
              maxWidth: 750, 
              margin: "0 auto 60px",
              transition: "color 0.4s ease"
            }}>
              No hidden monthly retainers. No bloated agency markups. High-performance Next.js custom websites and e-commerce storefronts built with 100% code ownership and transparent milestone-based payments.
            </p>
          </div>
        </FadeSection>

        {/* Pricing Cards Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", 
          gap: 20, 
          alignItems: "start",
          marginBottom: 80
        }}>
          {architectureTiers.map((tier, i) => (
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
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(0,242,255,0.4)", marginTop: 4 }}>
                      {currency === "INR" ? "Includes 18% GST (ITC Claimable)" : "One-Time Project Fee"}
                    </span>
                  </div>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(229,229,229,0.3)", marginBottom: 4 }}>base</span>
                </div>
                
                <div style={{ 
                  padding: "12px 16px", 
                  background: tier.highlight ? "rgba(0,242,255,0.05)" : "rgba(255,255,255,0.03)", 
                  borderLeft: "2px solid #00F2FF", 
                  marginBottom: 24 
                }}>
                  <span className="editorial-tag" style={{ fontSize: 8, color: "#00F2FF", display: "block", marginBottom: 4 }}>Payment Terms_</span>
                  <p style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14, color: "#E5E5E5", lineHeight: 1.4 }}>{tier.performanceFee}</p>
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

        {/* Feature Grid for Trust */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
          {[
            { title: "MILESTONE BILLED", desc: "Pay in structured phases linked directly to project approvals. No blind advances." },
            { title: "100% CODE OWNERSHIP", desc: "Every project comes with full React/Next.js repository transfers. You own the IP." },
            { title: "NO RETROACTIVE BILLING", desc: "No scope-creep surprises. Everything is documented and fixed up-front." }
          ].map((item, i) => (
            <FadeSection key={i} delay={i * 0.1}>
              <div className="glass-panel" style={{ padding: 40, height: "100%", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#00F2FF", marginBottom: 20 }}>
                  <Zap size={24} />
                </div>
                <h4 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 16, color: "#fff", marginBottom: 12, letterSpacing: "0.1em" }}>{item.title}_</h4>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
};
