"use client";

import { FadeSection } from "@/components/FadeSection";
import { CASE_STUDIES } from "@/data/architectureData";

export function CaseStudies() {
  return (
    <section id="work" style={{ padding: "clamp(4rem, 8vw, 7rem) 28px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeSection>
          <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>Evidence of Domination_</span>
          <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "var(--text-color)", marginBottom: 64, transition: "color 0.4s ease" }}>
            Results <span style={{ color: "var(--muted-text)", opacity: 0.4, transition: "color 0.4s ease" }}>That Speak.</span>
          </h2>
        </FadeSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {CASE_STUDIES.map((cs, i) => (
            <FadeSection key={cs.id} delay={i * 0.1}>
              <div className="glass-panel" style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--glass-bg)", transition: "all 0.4s ease" }}>
                <div style={{ padding: "40px 32px", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                    <span className="editorial-tag" style={{ fontSize: 9, padding: "6px 14px", border: "1px solid var(--border-color)", background: "var(--shadow-color)", transition: "all 0.4s ease" }}>{cs.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 22, color: "var(--text-color)", lineHeight: 1.2, marginBottom: 20, transition: "color 0.4s ease" }}>{cs.title}</h3>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--muted-text)", lineHeight: 1.7, marginBottom: 32, transition: "color 0.4s ease" }}>{cs.desc}</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, paddingTop: 24, borderTop: "1px solid var(--border-color)", marginBottom: 32, transition: "border-color 0.4s ease" }}>
                    {cs.metrics.map(([v, l]) => (
                      <div key={l}>
                        <p style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 16, color: "var(--accent-color)", marginBottom: 4, transition: "color 0.4s ease" }}>{v}</p>
                        <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.2 }}>{l}</span>
                      </div>
                    ))}
                  </div>

                  <blockquote style={{ borderLeft: "2px solid var(--accent-color)", paddingLeft: 20, marginTop: "auto", transition: "border-color 0.4s ease" }}>
                    <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--muted-text)", lineHeight: 1.6, marginBottom: 8, fontStyle: "italic", transition: "color 0.4s ease" }}>
                      &quot;{cs.quote}&quot;
                    </p>
                    <span className="editorial-tag" style={{ fontSize: 8, color: "var(--accent-color)", transition: "color 0.4s ease" }}>— {cs.founder}, Founder</span>
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
