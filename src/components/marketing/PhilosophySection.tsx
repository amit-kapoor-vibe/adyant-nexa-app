"use client";

import { FadeSection } from "@/components/FadeSection";
import { Heading } from "@/components/ui/Heading";

export function PhilosophySection() {
  return (
    <section style={{ padding: "clamp(5rem, 10vw, 8rem) clamp(1rem, 3vw, 1.75rem)", background: "#020202", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 60, alignItems: "center" }}>
          
          <FadeSection>
            <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 20, display: "block" }}>Foundational Truth_</span>
            <Heading level="h2" style={{ color: "#fff", lineHeight: 1.05 }}>
              We Don&apos;t Manufacture Hype. <br />
              <span style={{ color: "rgba(229,229,229,0.3)" }}>We Engineer Distribution.</span>
            </Heading>
          </FadeSection>

          <FadeSection delay={0.1}>
            <div style={{ borderLeft: "2px solid #00F2FF", paddingLeft: 32 }}>
              <p style={{ 
                fontFamily: "var(--font-inter)", 
                fontSize: "clamp(16px, 1.5vw, 19px)", 
                lineHeight: 1.7, 
                color: "rgba(229,229,229,0.7)",
                marginBottom: 24
              }}>
                Your product is the most important variable. If it&apos;s exceptional, it eventually sells itself. Our role is simple: We build the neural bridge that connects it to the right audience at the absolute right time.
              </p>
              <p style={{ 
                fontFamily: "var(--font-geist-mono)", 
                fontSize: 13, 
                lineHeight: 1.8, 
                color: "rgba(0, 242, 255, 0.6)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                [ LOGIC: BASE OPS COVERS THE INFRASTRUCTURE. PERFORMANCE FEES COVERS OUR PROFIT. WE ONLY WIN WHEN YOUR REVENUE EXPANDS. ]
              </p>
            </div>
          </FadeSection>

        </div>
      </div>
    </section>
  );
}
