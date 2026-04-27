"use client";

import { motion } from "framer-motion";
import { FadeSection } from "@/components/FadeSection";
import { Heading } from "@/components/ui/Heading";

interface MarketingHeroProps {
  onAudit: () => void;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, target: string) => void;
}

export const MarketingHero = ({ onAudit, onNavigate }: MarketingHeroProps) => {
  return (
    <section style={{ 
      padding: "clamp(120px, 15vw, 180px) 20px clamp(60px, 10vw, 100px)", 
      position: "relative", 
      overflow: "hidden", 
      background: "#020202", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center" 
    }}>
      <div className="ambient-orb" style={{ top: "10%", left: "50%", transform: "translateX(-50%)", opacity: 0.15 }} />
      <div className="scan-overlay" />
      
      <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FadeSection>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 10, 
            padding: "8px 16px", 
            background: "rgba(0,242,255,0.05)", 
            border: "1px solid rgba(0,242,255,0.2)", 
            borderRadius: 100, 
            marginBottom: 32 
          }}>
            <div className="pulse-dot" />
            <span className="editorial-tag" style={{ fontSize: 9, letterSpacing: "0.2em", margin: 0 }}>Performance Marketing Protocol</span>
          </div>
          
          <Heading level="h1" className="glitch-text" id="marketing-title" style={{ color: "#E5E5E5", marginBottom: 24 }}>
            Revenue <span className="glitch-shimmer">Dominance.</span>
          </Heading>
          
          <p style={{ 
            fontFamily: "var(--font-geist-mono)", 
            fontSize: "clamp(13px, 1.5vw, 16px)", 
            color: "rgba(229,229,229,0.45)", 
            lineHeight: 1.8, 
            maxWidth: 680, 
            margin: "0 auto 48px",
            padding: "0 10px"
          }}>
            We don&apos;t charge high upfront fees for &quot;trying.&quot; We engineer growth using AI-mapped personas and Server-Side CAPI tracking. You pay a base retainer + a performance fee <span style={{ color: "#00F2FF" }}>when we win</span>.
          </p>
          
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            <a href="#pricing" onClick={(e) => onNavigate(e, "#pricing")} className="btn-primary" style={{ padding: "18px 36px", fontSize: 11, minWidth: 200 }}>View Performance Tiers</a>
            <button onClick={onAudit} className="btn-secondary" style={{ padding: "18px 36px", fontSize: 11, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", minWidth: 200 }}>Initiate Growth Audit</button>
          </div>
        </FadeSection>
      </div>
    </section>
  );
};
