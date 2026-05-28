"use client";

import { Search, Users, Cpu } from "lucide-react";

export const PersonaShowcase = () => {
  return (
    <section style={{ padding: "clamp(60px, 10vw, 100px) 20px", background: "#080808" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "clamp(40px, 8vw, 80px)", alignItems: "center" }}>
          <div>
            <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 24, display: "block" }}>Proprietary Intelligence_</span>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#E5E5E5", marginBottom: 32, lineHeight: 1.1 }}>
              The <span style={{ color: "#00F2FF" }}>AI Persona</span> <br /> Architect.
            </h2>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "clamp(13px, 1.5vw, 14px)", color: "rgba(229,229,229,0.45)", lineHeight: 1.8, marginBottom: 40 }}>
              Stop guessing who your buyer is. Our AI agents scrape competitor ad libraries, social sentiment, and B2B intent data to build a 360° digital archetype of your ideal customer.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { icon: <Search size={20} />, title: "Intent Scrape", desc: "Real-time tracking of search patterns and B2B interest." },
                { icon: <Users size={20} />, title: "Archetype Mapping", desc: "Clustering behaviors into high-converting buyer personas." },
                { icon: <Cpu size={20} />, title: "Algorithmic Match", desc: "Syncing personas directly into Meta and Google AI engines." }
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "clamp(12px, 2vw, 20px)" }}>
                  <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "rgba(0,242,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00F2FF", border: "1px solid rgba(0,242,255,0.1)" }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 4 }}>{item.title}</h4>
                    <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div className="glass-panel" style={{ padding: "clamp(20px, 4vw, 40px)", background: "rgba(0,242,255,0.01)", border: "1px solid rgba(0,242,255,0.1)", position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <span className="editorial-tag" style={{ fontSize: 9 }}>Persona Profile: #ARCHETYPE-B2B-01</span>
                <div className="pulse-dot" />
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <div style={{ height: 1, background: "linear-gradient(to right, #00F2FF, transparent)", marginBottom: 12 }} />
                <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "clamp(18px, 3vw, 20px)", color: "#fff", display: "block" }}>B2B Apparel Sourcing Lead</span>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#00F2FF", opacity: 0.7 }}>High Intent / Decision Maker</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
                <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.3, display: "block", marginBottom: 8 }}>Pain Point</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Supply chain opacity</span>
                </div>
                <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.3, display: "block", marginBottom: 8 }}>Trigger</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Q4 Inventory Rush</span>
                </div>
              </div>

              <div style={{ textAlign: "center", padding: 20, border: "1px dashed rgba(0,242,255,0.2)", borderRadius: 4 }}>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "#00F2FF", letterSpacing: "0.1em" }}>AI-ENGINE: SYNCING DYNAMIC AD ASSETS...</span>
              </div>
            </div>
            
            {/* Background decorative elements - Hidden on small mobile to avoid clutter */}
            <div className="decor-frame" style={{ position: "absolute", top: -20, right: -20, width: "100%", height: "100%", border: "1px solid rgba(255,255,255,0.03)", zIndex: 1 }} />
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 480px) {
          .decor-frame { display: none; }
        }
      `}</style>
    </section>
  );
};
