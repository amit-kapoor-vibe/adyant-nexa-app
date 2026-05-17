"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { FadeSection } from "./FadeSection";

const KEYWORDS = ["ALGORITHMIC-SCALE", "·", "NEURAL-ROI", "·", "SERVER-SIDE-CAPI", "·", "MULTI-AGENT-AI", "·", "REVENUE-SYSTEMS", "·", "BESPOKE-ARCH", "·", "DATA-PRECISION", "·", "NEXT.JS-16", "·"];

const CLIENTS = [
  { name: "ROYAL PAINT", sub: "ARCHITECTURAL ASSETS", status: "LIVE", url: "https://royalpaintsandhardware.com" },
  { name: "INDO UVR", sub: "D2C DOMINANCE", status: "SCALING", url: "https://indouvr.com" }, 
  { name: "SUPERWHEELS", sub: "LUXURY AUTOMOTIVE", status: "BUILDING", url: "#" },
  { name: "ADYANT REALTY", sub: "REAL ESTATE", status: "BUILDING", url: "#" }, 
  { name: "TEMPTATION THREAD", sub: "FASHION D2C", status: "LIVE", url: "https://temptationthread.com" },
];

const TESTIMONIALS = [
  { 
    quote: "Standard agencies talk about CPC. Amit talks about EBITDA. Our acquisition costs halved within 30 days while our revenue hit record highs.", 
    name: "Homesh", 
    role: "Founder, TEMPTATION THREAD" 
  },
  { 
    quote: "The tech stack Adyant Nexa built for us is 2 years ahead of our competitors. The site speed alone improved our conversion rate by 34%.", 
    name: "Prashant", 
    role: "Founder, SUPERWHEELS.IN" 
  },
  { 
    quote: "Adyant Nexa isn't an agency; they are a growth partner. Their AI voice agents qualified 500+ leads for us while I was sleeping.", 
    name: "Rakesh", 
    role: "Founder, INDO UVR" 
  },
];

export const SocialProof = () => {
  return (
    <>
      {/* KEYWORD MARQUEE */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "18px 0", overflow: "hidden", position: "relative", zIndex: 5, background: "#020202" }}>
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: "3rem", whiteSpace: "nowrap" }}>
          {[...Array(2)].map((_, di) => (
            <div key={di} style={{ display: "flex", gap: "3rem", alignItems: "center" }}>
              {KEYWORDS.map((kw, i) => kw === "·" ? (
                <span key={`${di}-${i}`} style={{ color: "#00F2FF", opacity: 0.2, fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>·</span>
              ) : (
                <span key={`${di}-${i}`} className="editorial-tag" style={{ fontSize: 9, opacity: 0.4 }}>{kw}</span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* CLIENT MARQUEE */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "80px 0", overflow: "hidden", background: "#020202" }}>
        <p className="editorial-tag" style={{ textAlign: "center", fontSize: 9, opacity: 0.2, marginBottom: 48, letterSpacing: "0.4em" }}>PARTNER PORTFOLIO_</p>
        <div style={{ position: "relative" }}>
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ display: "flex", gap: "100px", whiteSpace: "nowrap", width: "fit-content" }}>
            {[...Array(2)].map((_, di) => (
              <div key={di} style={{ display: "flex", gap: "100px", alignItems: "center" }}>
                {CLIENTS.map(c => (
                  <a 
                    key={`${di}-${c.name}`} 
                    href={c.url} 
                    target={c.url !== "#" ? "_blank" : undefined} 
                    rel="noreferrer"
                    style={{ textDecoration: "none", color: "inherit", cursor: c.url !== "#" ? "pointer" : "default" }}
                    onMouseEnter={e => { if (c.url !== "#") e.currentTarget.style.opacity = "0.7"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                  >
                    <div style={{ textAlign: "left" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                        <p style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, color: "#fff" }}>{c.name}</p>
                        <span style={{ fontSize: 8, padding: "2px 8px", border: `1px solid ${c.status === "LIVE" ? "#00FF66" : c.status === "SCALING" ? "#00F2FF" : "rgba(255,255,255,0.15)"}`, color: c.status === "LIVE" ? "#00FF66" : c.status === "SCALING" ? "#00F2FF" : "rgba(255,255,255,0.3)", fontFamily: "var(--font-geist-mono)" }}>
                          {c.status}
                        </span>
                      </div>
                      <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.3 }}>{c.sub}</span>
                    </div>
                  </a>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FOUNDER'S MANIFESTO */}
      <section style={{ padding: "100px 28px", background: "#020202" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <FadeSection>
            <span className="editorial-tag" style={{ color: "#00F2FF", display: "block", marginBottom: 32 }}>Founders Manifesto_</span>
            <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#fff", lineHeight: 1.4, marginBottom: 40 }}>
              &quot;Scaling is a systems problem, not a budget problem. We build the infrastructure that makes growth inevitable.&quot;
            </h3>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
              — Amit Kapoor, Strategic Growth Partner
            </p>
          </FadeSection>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "clamp(4rem, 8vw, 7rem) 28px", background: "#080808", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeSection>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>The Neural Impact_</span>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#E5E5E5", marginBottom: 64 }}>
              Voices of <span style={{ color: "rgba(229,229,229,0.2)" }}>Dominance.</span>
            </h2>
          </FadeSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div 
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.1 }}
                className="glass-panel" 
                style={{ padding: "40px 32px", display: "flex", flexDirection: "column", gap: 24 }}
              >
                <div style={{ display: "flex", gap: 5 }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} style={{ fill: "#00F2FF", color: "#00F2FF" }} />)}
                </div>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.48)", lineHeight: 1.85, flex: 1, fontStyle: "italic" }}>&quot;{t.quote}&quot;</p>
                <div style={{ paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <p style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 15, color: "#E5E5E5", marginBottom: 5 }}>{t.name}</p>
                  <span className="editorial-tag" style={{ fontSize: 9, opacity: 0.3 }}>{t.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
