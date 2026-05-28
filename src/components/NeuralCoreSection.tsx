"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { FadeSection } from "./FadeSection";

const ThreeSwirl = dynamic(() => import("./ThreeSwirl"), { ssr: false });

export default function NeuralCoreSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  // Nexa 2.0 Parallax drift parameters
  const tagDrift1 = useTransform(scrollYProgress, [0, 1], [-45, 45]);
  const tagDrift2 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section 
      ref={containerRef}
      style={{ 
        minHeight: "100vh", 
        background: "#020202", 
        position: "relative", 
        display: "flex", 
        alignItems: "center", 
        padding: "7rem 28px",
        overflow: "hidden"
      }}
    >
      {/* ─── COSMIC NEBULA AMBIENT ACCENTS ─── */}
      <div className="ambient-orb" style={{ top: "10%", right: "-10%", width: "50vw", height: "50vw", opacity: 0.12, background: "radial-gradient(circle, var(--nebula-purple) 0%, transparent 70%)" }} />
      <div className="ambient-orb" style={{ bottom: "5%", left: "-5%", width: "40vw", height: "40vw", opacity: 0.08, background: "radial-gradient(circle, var(--stellar-pink) 0%, transparent 70%)" }} />
      <div className="ambient-orb" style={{ top: "40%", left: "30%", width: "30vw", height: "30vw", opacity: 0.06, background: "radial-gradient(circle, var(--cosmic-blue) 0%, transparent 70%)" }} />

      {/* 2050 Cyber HUD Coordinates */}
      <div style={{ position: "absolute", top: "40px", left: "40px", pointerEvents: "none" }} className="hud-coordinate">
        [ VECTOR_NODE: 45° 54' 22'' N // 09° 03' 11'' E ]
      </div>
      <div style={{ position: "absolute", bottom: "40px", right: "40px", pointerEvents: "none" }} className="hud-coordinate">
        [ ENGINE_SYS: COMPILING // ORBIT_ATTIT: ACTIVE ]
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 80, alignItems: "center", zIndex: 2 }}>
        
        {/* LEFT: THE NEURAL SHANKH */}
        <motion.div style={{ opacity, scale, position: "relative", height: "60vh", width: "100%" }}>
           <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", cursor: "grab" }}>
             <ThreeSwirl />
           </div>
           
           {/* Decorative Tags around the 3D (Parallax Drifting) */}
           <motion.div style={{ position: "absolute", top: "10%", left: "-5%", pointerEvents: "none", y: tagDrift1 }}>
              <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.5 }}>[ SYSTEM_STABILITY: 99.98% ]</span>
           </motion.div>
           <motion.div style={{ position: "absolute", bottom: "15%", right: "-5%", pointerEvents: "none", y: tagDrift2 }}>
              <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.6, color: "var(--accent-color)" }}>[ GALAXY_SECTOR: ACTIVE ]</span>
           </motion.div>
        </motion.div>

        {/* RIGHT: CONTENT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <FadeSection>
            <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 16, display: "block" }}>The Architecture_</span>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 0.9, letterSpacing: "-0.04em", color: "#fff" }}>
              THE NEURAL <br /> <span style={{ color: "rgba(0, 242, 255, 0.4)" }}>GALAXY.</span>
            </h2>
          </FadeSection>

          <FadeSection delay={0.1}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 18, lineHeight: 1.6, color: "rgba(229,229,229,0.6)", maxWidth: 500 }}>
              At Adyant Nexa, we engineer **Cosmic-Scale Infrastructure**. Your brand isn&apos;t just a site; it&apos;s the center of an autonomous digital universe.
            </p>
          </FadeSection>

          <FadeSection delay={0.2}>
            <div style={{ display: "grid", gap: 24, marginTop: 20 }}>
              {[
                { title: "ZERO-LATENCY", desc: "Edge-computed architectures that eliminate friction." },
                { title: "AUTONOMOUS OPS", desc: "Self-healing codebases that fix bugs before they occur." },
                { title: "UNCOMPROMISING CRAFT", desc: "We don't just build sites; we breathe life into them. Every project is a commitment to your digital legacy." }
              ].map((item, i) => (
                <div key={i} style={{ borderLeft: "1px solid rgba(0, 242, 255, 0.3)", paddingLeft: 24 }}>
                  <h4 style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, letterSpacing: "0.2em", color: "#00F2FF", marginBottom: 8 }}>{item.title}_</h4>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </FadeSection>
        </div>

      </div>

      {/* SCANLINE OVERLAY */}
      <div className="scan-overlay" style={{ pointerEvents: "none", opacity: 0.3 }} />
    </section>
  );
}
