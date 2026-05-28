"use client";


import { FadeSection } from "@/components/FadeSection";
import { Heading } from "@/components/ui/Heading";
import { TrendingUp, Activity, Zap } from "lucide-react";

const METRICS = [
  {
    label: "Avg. Conversion Uplift",
    value: "+184%",
    desc: "Achieved via Neural Persona Mapping and real-time frontend optimization.",
    icon: <TrendingUp size={24} color="#00F2FF" />
  },
  {
    label: "Data Accuracy (CAPI)",
    value: "99.2%",
    desc: "Post-iOS 14 signal recovery using elite Server-Side infrastructure.",
    icon: <Activity size={24} color="#00F2FF" />
  },
  {
    label: "Site Performance Score",
    value: "98/100",
    desc: "Sub-0.5s loading speeds across all global edge nodes.",
    icon: <Zap size={24} color="#00F2FF" />
  }
];

export function ROIVisualizer() {
  return (
    <section style={{ padding: "clamp(5rem, 10vw, 8rem) clamp(1rem, 3vw, 1.75rem)", background: "#080808" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 60, alignItems: "center" }}>
          
          <FadeSection>
            <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 20, display: "block" }}>The Performance Audit_</span>
            <Heading level="h2" style={{ color: "#fff", marginBottom: 32 }}>
              Quantifiable <br />
              <span style={{ color: "rgba(229,229,229,0.3)" }}>Revenue Growth.</span>
            </Heading>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 18, lineHeight: 1.6, color: "rgba(229,229,229,0.6)", maxWidth: 500 }}>
              We don&apos;t track clicks. We track revenue efficiency. Our infrastructure is designed to squeeze maximum ROI from every dollar of ad spend.
            </p>
          </FadeSection>

          <div style={{ display: "grid", gap: 24 }}>
            {METRICS.map((m, i) => (
              <FadeSection key={i} delay={i * 0.1}>
                <div style={{ 
                  background: "rgba(255,255,255,0.02)", 
                  border: "1px solid rgba(255,255,255,0.05)", 
                  padding: "32px",
                  display: "flex",
                  gap: 24,
                  alignItems: "flex-start"
                }}>
                  <div style={{ 
                    width: 56, height: 56, borderRadius: "50%", 
                    background: "rgba(0,242,255,0.05)", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {m.icon}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                      <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 32, color: "#fff" }}>{m.value}</span>
                      <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(0,242,255,0.6)", textTransform: "uppercase" }}>{m.label}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(229,229,229,0.4)", lineHeight: 1.5 }}>
                      {m.desc}
                    </p>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
