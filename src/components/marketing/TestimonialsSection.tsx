"use client";


import { FadeSection } from "@/components/FadeSection";
import { Heading } from "@/components/ui/Heading";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Homesh",
    role: "Founder, TEMPTATION THREAD",
    quote: "Standard agencies push vanity metrics. Adyant Nexa helped us build a direct-to-consumer commerce and acquisition system tailored to our manufacturing strengths.",
    rating: 5,
    tag: "D2C_TRANSFORMATION"
  },
  {
    name: "Prashant",
    role: "Founder, SUPERWHEELS.IN",
    quote: "The tech stack Adyant Nexa built for us is 2 years ahead of our competitors. The site speed alone improved our conversion rate by 34%.",
    rating: 5,
    tag: "INFRA_DOMINANCE"
  },
  {
    name: "Rakesh",
    role: "Founder, INDO UVR",
    quote: "Adyant Nexa isn't an agency; they are a growth partner. Their AI voice agents qualified 500+ leads for us while I was sleeping.",
    rating: 5,
    tag: "AI_AUTOMATION"
  }
];

export function TestimonialsSection() {
  return (
    <section style={{ padding: "clamp(5rem, 10vw, 8rem) clamp(1rem, 3vw, 1.75rem)", background: "#020202", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 16, display: "inline-block" }}>The Validation_</span>
            <Heading level="h2" style={{ color: "#fff" }}>Neural Proof of Concept.</Heading>
          </div>
        </FadeSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 32 }}>
          {TESTIMONIALS.map((t, i) => (
            <FadeSection key={i} delay={i * 0.1}>
              <div className="glass-panel" style={{ 
                padding: 40, 
                height: "100%", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between",
                position: "relative",
                border: "1px solid rgba(255,255,255,0.03)"
              }}>
                <Quote style={{ position: "absolute", top: 20, right: 20, color: "rgba(0,242,255,0.1)" }} size={40} />
                
                <div>
                  <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#00F2FF" color="#00F2FF" />
                    ))}
                  </div>
                  
                  <p style={{ 
                    fontFamily: "var(--font-inter)", 
                    fontSize: 16, 
                    lineHeight: 1.6, 
                    color: "rgba(229,229,229,0.8)", 
                    marginBottom: 32,
                    fontStyle: "italic"
                  }}>
                    &quot;{t.quote}&quot;
                  </p>
                </div>

                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#fff", marginBottom: 4, fontFamily: "var(--font-syne)" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(229,229,229,0.4)", marginBottom: 16 }}>{t.role}</div>
                  <span style={{ 
                    fontFamily: "var(--font-geist-mono)", 
                    fontSize: 10, 
                    color: "#00F2FF", 
                    letterSpacing: "0.1em",
                    border: "1px solid rgba(0,242,255,0.2)",
                    padding: "4px 8px"
                  }}>
                    {t.tag}
                  </span>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>

      </div>
    </section>
  );
}
