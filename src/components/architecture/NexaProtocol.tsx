"use client";

import { motion } from "framer-motion";
import { Cpu } from "lucide-react";
import { FadeSection } from "@/components/FadeSection";
import { PROTOCOL } from "@/data/architectureData";

export function NexaProtocol() {
  return (
    <section style={{ padding: "clamp(4rem, 8vw, 7rem) 28px", position: "relative", background: "var(--bg-color)", transition: "all 0.4s ease" }}>
      <div style={{ position: "absolute", top: 0, right: 0, display: "flex", alignItems: "center", pointerEvents: "none", overflow: "hidden" }}>
        <span className="ghost-text" style={{ opacity: 0.01 }}>PROTOCOL</span>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 80 }}>
          {/* Left: Protocol Steps */}
          <div>
            <FadeSection>
              <span className="editorial-tag" style={{ display: "block", marginBottom: 24, fontSize: 9 }}>The Execution Framework_</span>
              <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.5rem, 5vw, 4.2rem)", lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 32, color: "var(--text-color)", transition: "color 0.4s ease" }}>
                The Nexa <span style={{ color: "var(--accent-color)", transition: "color 0.4s ease" }}>Protocol</span>
              </h2>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "var(--muted-text)", lineHeight: 1.85, maxWidth: 380, marginBottom: 48, transition: "color 0.4s ease" }}>
                A battle-tested 4-phase deployment designed to eliminate friction and maximize conversion speed. No guesswork—just pure execution.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 40, position: "relative" }}>
                <div style={{ position: "absolute", left: 7, top: 20, bottom: 20, width: 1, background: "linear-gradient(to bottom, transparent, var(--border-color), transparent)", transition: "all 0.4s ease" }} />
                {PROTOCOL.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.1 }}
                    style={{ display: "flex", gap: 32, position: "relative", zIndex: 2 }}>
                    <div style={{ width: 15, height: 15, borderRadius: "50%", background: "var(--bg-color)", border: "2px solid var(--accent-color)", marginTop: 4, flexShrink: 0, boxShadow: "0 0 10px var(--shadow-color)", transition: "all 0.4s ease" }} />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <span className="editorial-tag" style={{ fontSize: 9, color: "var(--accent-color)", transition: "color 0.4s ease" }}>Phase {item.id}</span>
                        <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.25 }}>[{item.tag}]</span>
                      </div>
                      <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 20, color: "var(--text-color)", marginBottom: 12, transition: "color 0.4s ease" }}>{item.title}</h3>
                      <div style={{ marginTop: 12 }}>
                        {item.desc.split(/(Feature:|Advantage:|Benefit:)/).map((part, idx) => {
                          const isLabel = ["Feature:", "Advantage:", "Benefit:"].includes(part);
                          return (
                            <span key={idx} style={{
                              display: isLabel ? "block" : "inline",
                              fontFamily: "var(--font-geist-mono)",
                              fontSize: isLabel ? 9 : 12,
                              color: isLabel ? "var(--accent-color)" : "var(--muted-text)",
                              fontWeight: isLabel ? 800 : 400,
                              letterSpacing: isLabel ? "0.1em" : "normal",
                              textTransform: isLabel ? "uppercase" : "none",
                              marginTop: isLabel && idx > 0 ? 12 : 0,
                              marginBottom: isLabel ? 4 : 0,
                              transition: "color 0.4s ease"
                            }}>{part}</span>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeSection>
          </div>

          {/* Right: Animated visual */}
          <FadeSection delay={0.3}>
            <div className="glass-panel" style={{ height: "100%", minHeight: 500, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "var(--glass-bg)", border: "1px solid var(--border-color)", position: "relative", overflow: "hidden", transition: "all 0.4s ease" }}>
              <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: 40 }}>
                <Cpu size={64} color="var(--accent-color)" style={{ marginBottom: 32, opacity: 0.4, transition: "color 0.4s ease" }} />
                <h4 className="editorial-tag" style={{ fontSize: 10, letterSpacing: "0.4em", marginBottom: 16 }}>Deployment Status</h4>
                <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 32 }}>
                  {[...Array(16)].map((_, i) => (
                    <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      style={{ width: 4, height: 20, background: "var(--accent-color)", transition: "background 0.4s ease" }} />
                  ))}
                </div>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--accent-color)", letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.4s ease" }}>Optimization Loop Active...</p>
              </div>
              <motion.div animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", left: 0, right: 0, height: 1, background: "var(--accent-color)", boxShadow: "0 0 15px var(--accent-color)", zIndex: 3, transition: "all 0.4s ease" }} />
            </div>
          </FadeSection>
        </div>
      </div>
    </section>
  );
}
