"use client";

import { CheckCircle, X } from "lucide-react";
import { FadeSection } from "@/components/FadeSection";
import { MATRIX } from "@/data/architectureData";

export function EliteMatrix() {
  return (
    <section style={{ padding: "clamp(4rem, 8vw, 7rem) 28px", background: "#020202", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <FadeSection>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>Competitive Analysis_</span>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2rem, 4.5vw, 3.8rem)", color: "#E5E5E5", lineHeight: 1.1 }}>
              The <span style={{ color: "#00F2FF" }}>Elite Gap</span>
            </h2>
          </FadeSection>
        </div>

        <FadeSection delay={0.2}>
          <div className="glass-panel" style={{ overflowX: "auto", background: "rgba(255,255,255,0.01)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <th style={{ padding: "32px 28px", textAlign: "left", fontFamily: "var(--font-geist-mono)", fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>Feature Set</th>
                  <th style={{ padding: "32px 28px", textAlign: "left", background: "rgba(0,242,255,0.03)", borderLeft: "1px solid rgba(0,242,255,0.1)", borderRight: "1px solid rgba(0,242,255,0.1)" }}>
                    <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 15, color: "#fff" }}>ADYANT NEXA</span>
                  </th>
                  <th style={{ padding: "32px 28px", textAlign: "left", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.2)" }}>THE PACK</th>
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row) => (
                  <tr key={row.feature} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "24px 28px", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14, color: "#E5E5E5" }}>{row.feature}</td>
                    <td style={{ padding: "24px 28px", background: "rgba(0,242,255,0.02)", borderLeft: "1px solid rgba(0,242,255,0.08)", borderRight: "1px solid rgba(0,242,255,0.08)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <CheckCircle size={15} color="#00F2FF" />
                        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "#00F2FF" }}>{row.nexa}</span>
                      </div>
                    </td>
                    <td style={{ padding: "24px 28px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <X size={15} color="rgba(255,255,255,0.15)" />
                        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{row.others}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}
