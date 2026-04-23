"use client";

import { motion } from "framer-motion";
import { Cpu, CheckCircle, X, ArrowRight } from "lucide-react";
import { FadeSection } from "./FadeSection";

const PROTOCOL = [
  { id: "01", title: "System Audit", tag: "DIAGNOSTIC", desc: "We run a deep scan of your current presence and pixel health. This involves a strict 48-hour diagnostic window to find exactly where your budget is being wasted." },
  { id: "02", title: "Core Architecture", tag: "ENGINEERING", desc: "We build your asset from scratch using NEXT.JS 16—fully optimized for sub-second speeds. This phase includes a maximum of 2 revision rounds to maintain deployment velocity." },
  { id: "03", title: "Lead Sync", tag: "INTEGRATION", desc: "Connecting your WHATSAPP, CRM, and Analytics into one singular 'Growth Engine'. We prioritize 'Live Over Perfect' to start capturing data instantly." },
  { id: "04", title: "Market Dominance", tag: "SCALING", desc: "Launch is only the beginning. Once live, we enter a continuous optimization loop where we refine copy and ads to drive your CAC down based on real-time market data." }
];

const MATRIX = [
  { feature: "Core Architecture", nexa: "NEXT.JS 16 / REACT 19", others: "FRAGILE WORDPRESS" },
  { feature: "Point of Contact", nexa: "DIRECT FOUNDER ACCESS", others: "JUNIOR MANAGER" },
  { feature: "Delivery Speed", nexa: "7-DAY DEPLOYMENT", others: "1-3 MONTH DRAG" },
  { feature: "Tracking Accuracy", nexa: "SERVER-SIDE PIXEL SYNC", others: "BASIC PLUGIN-BASED" },
  { feature: "Page Performance", nexa: "95+ MOBILE SPEED", others: "AVG. 40-60 SCORE" },
  { feature: "Mobile Architecture", nexa: "PWA (INSTALL AS APP)", others: "STANDARD MOBILE SITE" },
  { feature: "Lead Automation", nexa: "WHATSAPP/CRM SYNC", others: "BASIC EMAIL FORMS" }
];

const CASE_STUDIES = [
  { id: "01", client: "SUPERWHEELS", tag: "Luxury D2C", title: "From Slow & Overpriced to Fast & Responsive", desc: "Rebuilt a bloated agency site into a mobile-first performance machine. Scaled organic traffic and significantly reduced ad-bounce rates.", metrics: [["98/100", "Speed"], ["Next.js", "Stack"], ["7 Days", "Build"]], quote: "Since working with Adyant Nexa, our site's speed and responsiveness have improved dramatically.", founder: "Prashant" },
  { id: "02", client: "TEMPTATION THREAD", tag: "Fashion D2C", title: "Scaling D2C Growth via Performance Architecture", desc: "Implemented server-side tracking and high-speed landing pages to slash CAC. Managed ₹20L+ monthly ad spend with record ROAS.", metrics: [["-40%", "CAC"], ["3.2x", "ROI"], ["₹20L+", "Managed"]], quote: "Nobody runs ads at this level. Our acquisition costs halved within the first month alone.", founder: "Founder" },
  { id: "03", client: "INDO UVR", tag: "B2B Manufacturing", title: "Automating High-Ticket Lead Generation", desc: "Transformed a static corporate site into a 24/7 lead engine with automated WhatsApp funnels and CRM synchronization.", metrics: [["Zero", "Leakage"], ["WhatsApp", "Sync"], ["82%", "Conv."]], quote: "Adyant Nexa handles our entire platform with exceptional care. Every feature we need — it's delivered fast.", founder: "RAKESH" }
];

export const ArchitectureSection = () => {
  return (
    <>
      {/* PROTOCOL */}
      <section style={{ padding: "clamp(4rem, 8vw, 7rem) 28px", position: "relative", background: "#020202" }}>
        <div style={{ position: "absolute", top: 0, right: 0, display: "flex", alignItems: "center", pointerEvents: "none", overflow: "hidden" }}>
          <span className="ghost-text">PROTOCOL</span>
        </div>
        
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 80 }}>
            <div>
              <FadeSection>
                <span className="editorial-tag" style={{ display: "block", marginBottom: 24, fontSize: 9 }}>The Execution Framework_</span>
                <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.5rem, 5vw, 4.2rem)", lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 32, color: "#E5E5E5" }}>
                  The Nexa <span style={{ color: "#00F2FF" }}>Protocol</span>
                </h2>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "rgba(229,229,229,0.35)", lineHeight: 1.85, maxWidth: 380, marginBottom: 48 }}>
                  A battle-tested 4-phase deployment designed to eliminate friction and maximize conversion speed. No guesswork—just pure execution.
                </p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 40, position: "relative" }}>
                  <div style={{ position: "absolute", left: 7, top: 20, bottom: 20, width: 1, background: "linear-gradient(to bottom, transparent, rgba(0,242,255,0.15), transparent)" }} />
                  
                  {PROTOCOL.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.1 }}
                      style={{ display: "flex", gap: 32, position: "relative", zIndex: 2 }}>
                      <div style={{ width: 15, height: 15, borderRadius: "50%", background: "#020202", border: "2px solid #00F2FF", marginTop: 4, flexShrink: 0, boxShadow: "0 0 10px rgba(0,242,255,0.2)" }} />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                          <span className="editorial-tag" style={{ fontSize: 9, color: "#00F2FF" }}>Phase {item.id}</span>
                          <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.25 }}>[{item.tag}]</span>
                        </div>
                        <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 20, color: "#E5E5E5", marginBottom: 12 }}>{item.title}</h3>
                        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.4)", lineHeight: 1.7 }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </FadeSection>
            </div>
            
            <FadeSection delay={0.3}>
              <div className="glass-panel" style={{ height: "100%", minHeight: 500, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "rgba(0,242,255,0.01)", border: "1px solid rgba(0,242,255,0.1)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: 40 }}>
                  <Cpu size={64} color="#00F2FF" style={{ marginBottom: 32, opacity: 0.4 }} />
                  <h4 className="editorial-tag" style={{ fontSize: 10, letterSpacing: "0.4em", marginBottom: 16 }}>Deployment Status</h4>
                  <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 32 }}>
                    {[...Array(16)].map((_, i) => (
                      <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                        style={{ width: 4, height: 20, background: "#00F2FF" }} />
                    ))}
                  </div>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "rgba(0,242,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Optimization Loop Active...</p>
                </div>
                <motion.div animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ position: "absolute", left: 0, right: 0, height: 1, background: "rgba(0,242,255,0.15)", boxShadow: "0 0 15px rgba(0,242,255,0.4)", zIndex: 3 }} />
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* MATRIX */}
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
                  {MATRIX.map((row, i) => (
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

      {/* CASE STUDIES */}
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
                      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(229,229,229,0.5)", lineHeight: 1.6, marginBottom: 8, fontStyle: "italic" }}>&quot;{cs.quote}&quot;</p>
                      <span className="editorial-tag" style={{ fontSize: 8, color: "#00F2FF" }}>— {cs.founder}, Founder</span>
                    </blockquote>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
