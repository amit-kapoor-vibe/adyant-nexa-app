"use client";

import { FadeSection } from "@/components/FadeSection";
import { CASE_STUDIES } from "@/data/architectureData";

export function CaseStudies() {
  return (
    <section id="work" style={{ padding: "clamp(4rem, 8vw, 7rem) 28px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeSection>
          <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>Evidence of Domination_</span>
          <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#E5E5E5", marginBottom: 64 }}>
            Results <span style={{ color: "rgba(229,229,229,0.2)" }}>That Speak.</span>
          </h2>
        </FadeSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {CASE_STUDIES.map((cs, i) => (
            <FadeSection key={cs.id} delay={i * 0.1}>
              <div className="glass-panel" style={{ height: "100%", display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.01)" }}>
                <div style={{ padding: "40px 32px", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                    <span className="editorial-tag" style={{ fontSize: 9, padding: "6px 14px", border: "1px solid rgba(0,242,255,0.2)", background: "rgba(0,242,255,0.04)" }}>{cs.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 22, color: "#E5E5E5", lineHeight: 1.2, marginBottom: 20 }}>{cs.title}</h3>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.38)", lineHeight: 1.7, marginBottom: 32 }}>{cs.desc}</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.04)", marginBottom: 32 }}>
                    {cs.metrics.map(([v, l]) => (
                      <div key={l}>
                        <p style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 16, color: "#00F2FF", marginBottom: 4 }}>{v}</p>
                        <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.2 }}>{l}</span>
                      </div>
                    ))}
                  </div>

                  <blockquote style={{ borderLeft: "2px solid rgba(0,242,255,0.3)", paddingLeft: 20, marginTop: "auto" }}>
                    <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(229,229,229,0.5)", lineHeight: 1.6, marginBottom: 8, fontStyle: "italic" }}>
                      &quot;{cs.quote}&quot;
                    </p>
                    <span className="editorial-tag" style={{ fontSize: 8, color: "#00F2FF" }}>— {cs.founder}, Founder</span>
                  </blockquote>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}
