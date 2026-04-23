"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { FadeSection } from "./FadeSection";

const KEYWORDS = ["AD-OPTIMIZATION", "·", "AI-INTEGRATION", "·", "WEB-ARCH", "·", "NEURAL-MARKETING", "·", "DIGITAL-OPERATIONS", "·", "BESPOKE-SOFTWARE", "·", "ROI-PRECISION", "·", "NEXT.JS", "·"];

const CLIENTS = [
  { name: "ROYAL PAINT", sub: "HARDWARE", status: "LIVE" },
  { name: "INDO UVR", sub: "D2C", status: "BUILDING" }, 
  { name: "SUPERWHEELS", sub: "LUXURY AUTOS", status: "BUILDING" },
  { name: "ADYANT REALTY", sub: "REAL ESTATE", status: "BUILDING" }, 
  { name: "TEMPTATIONTHREAD.COM", sub: "FASHION D2C", status: "ABOUT TO LIVE" },
];

const TESTIMONIALS = [
  { quote: "Nobody runs ads at this level, at this price. Amit just gets it. Our acquisition costs halved within the first month alone.", name: "Founder", role: "TEMPTATIONTHREAD.COM" },
  { quote: "Since working with Adyant Nexa, our site's speed and responsiveness have improved dramatically. The difference is night and day.", name: "Prashant", role: "Founder, SUPERWHEELS.IN" },
  { quote: "Adyant Nexa has handled our entire D2C platform with exceptional care. Whatever feature we need — it's delivered fast.", name: "Rakesh", role: "Founder, INDO UVR" },
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
        <p className="editorial-tag" style={{ textAlign: "center", fontSize: 9, opacity: 0.2, marginBottom: 48, letterSpacing: "0.4em" }}>CLIENT PORTFOLIO STATUS_</p>
        <div style={{ position: "relative" }}>
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ display: "flex", gap: "100px", whiteSpace: "nowrap", width: "fit-content" }}>
            {[...Array(2)].map((_, di) => (
              <div key={di} style={{ display: "flex", gap: "100px", alignItems: "center" }}>
                {CLIENTS.map(c => (
                  <div key={`${di}-${c.name}`} style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                      <p style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, color: "#fff" }}>{c.name}</p>
                      <span style={{ fontSize: 8, padding: "2px 8px", border: `1px solid ${c.status === "LIVE" ? "#00FF66" : "rgba(255,255,255,0.15)"}`, color: c.status === "LIVE" ? "#00FF66" : "rgba(255,255,255,0.3)", fontFamily: "var(--font-geist-mono)" }}>
                        {c.status}
                      </span>
                    </div>
                    <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.3 }}>{c.sub}</span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "clamp(4rem, 8vw, 7rem) 28px", background: "#080808", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeSection>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>Client Voices_</span>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#E5E5E5", marginBottom: 64 }}>
              Straight from the <span style={{ color: "rgba(229,229,229,0.2)" }}>Founders.</span>
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
