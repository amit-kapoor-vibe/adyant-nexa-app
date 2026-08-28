"use client";

import { motion } from "framer-motion";
import { CheckCircle, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeSection } from "./FadeSection";
import { Heading } from "./ui/Heading";

export const PricingSection = () => {
  const tiers = [
    {
      name: "FREE GROWTH ASSESSMENT",
      highlight: false,
      price: "₹0",
      subText: "Instant Diagnostic",
      description: "Self-service diagnostic for Indian fashion & apparel retailers to find profit leakages.",
      features: [
        "7-step interactive growth wizard",
        "Composite Growth Score (0-100)",
        "Estimated annual profit opportunity (₹)",
        "Top 3 priority leakage areas breakdown",
        "Methodology disclaimer & report summary"
      ],
      buttonText: "Start Free Assessment",
      buttonHref: "/assessment"
    },
    {
      name: "90-DAY GROWTH BLUEPRINT",
      highlight: true,
      price: "₹25,000",
      subText: "1-on-1 Growth Advisory",
      description: "Custom diagnostic audit report & 90-day action plan crafted by senior retail strategists.",
      features: [
        "Everything in Free Assessment",
        "Detailed SKU-level dead stock velocity rules",
        "Discount cap & margin preservation framework",
        "Automated WhatsApp repeat buyer sequence",
        "1-on-1 Strategy Call with Lead Growth Partner"
      ],
      buttonText: "Request 90-Day Blueprint",
      buttonHref: "/assessment"
    },
    {
      name: "MANAGED GROWTH ENGINE",
      highlight: false,
      price: "Custom",
      subText: "Done-For-You Implementation",
      description: "Full implementation of your 90-day growth blueprint with weekly performance tracking.",
      features: [
        "Dedicated Growth Engineering Team",
        "Inventory velocity & reorder automation",
        "Conversion-optimized local store ad campaigns",
        "Custom retention & VIP buyer workflows",
        "Weekly profit recovery review meetings"
      ],
      buttonText: "Book Advisory Call",
      buttonHref: "/contact"
    }
  ];

  return (
    <section id="investment" style={{ padding: "clamp(6rem, 12vw, 10rem) clamp(1.25rem, 3vw, 1.75rem)", background: "var(--bg-color)", position: "relative", overflow: "hidden", transition: "background 0.4s ease" }}>
      {/* Background Decorative Elements */}
      <div className="ambient-orb" style={{ top: "20%", left: "50%", width: "600px", height: "600px", opacity: 0.05 }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 10 }}>
        
        {/* Header Section */}
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span className="editorial-tag" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, color: "var(--accent-color)", letterSpacing: "0.4em" }}>
              <Zap size={12} /> DIAGNOSTIC &amp; BLUEPRINT OPTIONS_
            </span>
            <Heading level="h2" style={{ color: "var(--text-color)", lineHeight: 1.1, marginBottom: 32, fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}>
              Diagnostic First. <br /> <span style={{ color: "var(--accent-color)" }}>Value Delivered First.</span>
            </Heading>
            
            <p style={{ 
              fontFamily: "var(--font-inter)", 
              fontSize: "clamp(15px, 1.8vw, 18px)", 
              color: "var(--muted-text)", 
              lineHeight: 1.75, 
              maxWidth: 750, 
              margin: "0 auto 60px"
            }}>
              We don't start by selling you a retainer. Start with a free diagnostic to discover your profit opportunity, then choose how you want to deploy your 90-day blueprint.
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
          {tiers.map((tier, i) => (
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
                  RECOMMENDED FOR VALIDATION
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
                      {tier.price}
                    </span>
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(0,242,255,0.6)", marginTop: 4 }}>
                      {tier.subText}
                    </span>
                  </div>
                </div>
                
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.5)", lineHeight: 1.75 }}>{tier.description}</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
                {tier.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <CheckCircle size={15} color={tier.highlight ? "#00F2FF" : "rgba(229,229,229,0.25)"} style={{ flexShrink: 0, marginTop: 4 }} />
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(229,229,229,0.65)", lineHeight: 1.6 }}>{f}</span>
                  </div>
                ))}
              </div>

              <Link
                href={tier.buttonHref}
                className="btn-primary"
                style={{
                  display: "flex", 
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  padding: "18px 24px",
                  background: tier.highlight ? "#00F2FF" : "rgba(255,255,255,0.04)",
                  color: tier.highlight ? "#000" : "#E5E5E5",
                  border: tier.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "var(--font-geist-mono)", 
                  fontWeight: 700, 
                  fontSize: 11,
                  letterSpacing: "0.15em", 
                  textTransform: "uppercase", 
                  textDecoration: "none",
                  transition: "all 0.3s ease"
                }}
              >
                <span>{tier.buttonText}</span>
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Feature Grid for Trust */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          {[
            { title: "DIAGNOSTIC FIRST", desc: "No blind retainers. Every recommendation is backed by your actual store diagnostic numbers." },
            { title: "RESPONSIBLE ESTIMATES", desc: "We use indicative benchmark math and standard disclaimers. Zero false guarantees." },
            { title: "ETHICAL WIN-WIN", desc: "Your commercial data is kept strictly confidential. We only win when your store grows." }
          ].map((item, i) => (
            <FadeSection key={i} delay={i * 0.1}>
              <div className="glass-panel" style={{ padding: 36, height: "100%", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#00F2FF", marginBottom: 16 }}>
                  <Zap size={22} />
                </div>
                <h4 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 15, color: "#fff", marginBottom: 10, letterSpacing: "0.1em" }}>{item.title}_</h4>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
};
