"use client";

import { motion } from "framer-motion";
import { Shield, Lock, ArrowRight, Zap } from "lucide-react";
import { FadeSection } from "./FadeSection";
import { Heading } from "./ui/Heading";
import Link from "next/link";
import { useNeuralTransition } from "@/context/TransitionContext";

interface PricingSectionProps {
  currency?: "USD" | "INR";
  setCurrency?: (currency: "USD" | "INR") => void;
  onAudit?: () => void;
}

export const PricingSection = ({ currency, setCurrency, onAudit }: PricingSectionProps) => {
  const { triggerTransition } = useNeuralTransition();

  const handleAccessRequest = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerTransition("/login", (window as any).lenis);
  };

  return (
    <section id="investment" style={{ padding: "clamp(6rem, 12vw, 10rem) clamp(1.25rem, 3vw, 1.75rem)", background: "#020202", position: "relative", overflow: "hidden" }}>
      
      {/* Background Decorative Elements */}
      <div className="ambient-orb" style={{ top: "20%", left: "50%", width: "600px", height: "600px", opacity: 0.05 }} />
      <div className="scan-overlay" style={{ opacity: 0.1 }} />

      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 10 }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span className="editorial-tag" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, color: "#00F2FF", letterSpacing: "0.4em" }}>
              <Lock size={12} /> PROPRIETARY_MODELS
            </span>
            <Heading level="h2" style={{ color: "#E5E5E5", lineHeight: 1, marginBottom: 32, fontSize: "clamp(2.5rem, 8vw, 5rem)" }}>
              Access the <br /> <span style={{ color: "#00F2FF" }}>Neural Revenue Grid.</span>
            </Heading>
            
            <p style={{ 
              fontFamily: "var(--font-inter)", 
              fontSize: "clamp(16px, 2vw, 20px)", 
              color: "rgba(229,229,229,0.5)", 
              lineHeight: 1.6, 
              maxWidth: 700, 
              margin: "0 auto 60px" 
            }}>
              Our pricing tiers and revenue-sharing models are protected assets. 
              Authorized clients gain access to EMI-structured investments, 
              autonomous scaling contracts, and performance guarantees.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
              <Link 
                href="/login" 
                onClick={handleAccessRequest}
                className="btn-primary" 
                style={{ 
                  padding: "24px 60px", 
                  fontSize: 14, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 16,
                  boxShadow: "0 20px 40px rgba(0,242,255,0.1)"
                }}
              >
                REQUEST PRICING ACCESS <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </FadeSection>

        {/* Feature Grid for Trust */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40, marginTop: 40 }}>
          {[
            { title: "EMI STRUCTURED", desc: "Flexible 12-month payment structures to optimize business cashflow." },
            { title: "LEGAL CERTAINTY", desc: "Every plan is backed by a performance-linked service agreement." },
            { title: "NEURAL SCALING", desc: "Direct integration with Nexa AI systems for autonomous growth." }
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
