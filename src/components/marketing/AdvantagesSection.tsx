"use client";

import { Target, ShieldCheck, Zap } from "lucide-react";
import { FadeSection } from "@/components/FadeSection";
import { Heading } from "@/components/ui/Heading";
import { marketingFeatures } from "@/data/marketingData";

export const AdvantagesSection = () => {
  return (
    <section style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1rem, 3vw, 1.75rem)", borderTop: "1px solid rgba(255,255,255,0.04)", background: "#020202" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>CORE ADVANTAGES_</span>
            <Heading level="h2" style={{ color: "#E5E5E5" }}>
              The Unfair <span style={{ color: "#00F2FF" }}>Advantage.</span>
            </Heading>
          </div>
        </FadeSection>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", 
          gap: 20 
        }}>
          {marketingFeatures.map((f, i) => (
            <FadeSection key={f.title} delay={i * 0.1}>
              <div className="glass-panel" style={{ padding: "32px", display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ 
                  width: 44, 
                  height: 44, 
                  background: "rgba(0,242,255,0.05)", 
                  border: "1px solid rgba(0,242,255,0.2)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  color: "#00F2FF", 
                  marginBottom: 24 
                }}>
                  {f.icon === "Target" ? <Target size={18} /> : f.icon === "ShieldCheck" ? <ShieldCheck size={18} /> : <Zap size={18} />}
                </div>
                <Heading level="h3" style={{ fontSize: 22, color: "#fff", marginBottom: 16 }}>{f.title}</Heading>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(229,229,229,0.45)", lineHeight: 1.6 }}>
                    <span style={{ color: "#00F2FF", opacity: 0.8 }}>Advantage:</span> {f.advantage}
                  </p>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.7)", lineHeight: 1.6 }}>
                    <span style={{ color: "#00F2FF", opacity: 0.8 }}>Result:</span> {f.benefit}
                  </p>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
};
