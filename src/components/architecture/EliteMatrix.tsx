"use client";

import { CheckCircle, X } from "lucide-react";
import { FadeSection } from "@/components/FadeSection";
import { MATRIX } from "@/data/architectureData";

export function EliteMatrix() {
  return (
    <section style={{ padding: "clamp(4rem, 8vw, 7rem) 28px", background: "var(--bg-color)", borderTop: "1px solid var(--border-color)", transition: "all 0.4s ease" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <FadeSection>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>Competitive Analysis_</span>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2rem, 4.5vw, 3.8rem)", color: "var(--text-color)", lineHeight: 1.1, transition: "color 0.4s ease" }}>
              The <span style={{ color: "var(--accent-color)", transition: "color 0.4s ease" }}>Elite Gap</span>
            </h2>
          </FadeSection>
        </div>

        <FadeSection delay={0.2}>
          <div className="glass-panel" style={{ overflowX: "auto", background: "var(--glass-bg)", transition: "all 0.4s ease" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", transition: "border-color 0.4s ease" }}>
                  <th style={{ padding: "32px 28px", textAlign: "left", fontFamily: "var(--font-geist-mono)", fontSize: 10, letterSpacing: "0.3em", color: "var(--muted-text)", textTransform: "uppercase", transition: "color 0.4s ease" }}>Feature Set</th>
                  <th style={{ padding: "32px 28px", textAlign: "left", background: "var(--shadow-color)", borderLeft: "1px solid var(--border-color)", borderRight: "1px solid var(--border-color)", transition: "all 0.4s ease" }}>
                    <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 15, color: "var(--text-color)", transition: "color 0.4s ease" }}>ADYANT NEXA</span>
                  </th>
                  <th style={{ padding: "32px 28px", textAlign: "left", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14, color: "var(--muted-text)", opacity: 0.5, transition: "all 0.4s ease" }}>THE PACK</th>
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row) => (
                  <tr key={row.feature} style={{ borderBottom: "1px solid var(--border-color)", transition: "border-color 0.4s ease" }}>
                    <td style={{ padding: "24px 28px", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14, color: "var(--text-color)", transition: "color 0.4s ease" }}>{row.feature}</td>
                    <td style={{ padding: "24px 28px", background: "var(--shadow-color)", borderLeft: "1px solid var(--border-color)", borderRight: "1px solid var(--border-color)", transition: "all 0.4s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <CheckCircle size={15} color="var(--accent-color)" style={{ transition: "color 0.4s ease" }} />
                        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--accent-color)", transition: "color 0.4s ease" }}>{row.nexa}</span>
                      </div>
                    </td>
                    <td style={{ padding: "24px 28px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <X size={15} color="var(--muted-text)" style={{ opacity: 0.3, transition: "color 0.4s ease" }} />
                        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--muted-text)", opacity: 0.5, transition: "color 0.4s ease" }}>{row.others}</span>
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
