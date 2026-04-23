"use client";

import { motion } from "framer-motion";
import { Globe, Target, Cpu, ArrowRight } from "lucide-react";
import { FadeSection } from "./FadeSection";

const SERVICES = [
  { 
    id: "01", 
    Icon: Target, 
    tag: "Diagnostic", 
    title: "Rapid Funnel Audit",
    desc: "A low-risk 'x-ray' of your digital presence. 15-20 min Loom teardown + 5-7 page action plan for UX, speed, and tracking fixes.",
    tags: ["UX Teardown", "Performance Audit", "Lead Flow Map"] 
  },
  { 
    id: "02", 
    Icon: Globe, 
    tag: "Architecture", 
    title: "High-Performance Build",
    desc: "Not 'fragile' WordPress. Fast, structured, conversion-driven Next.js sites engineered to handle high-traffic without breaking.",
    tags: ["Next.js 15+", "GSC/SEO Ready", "Sub-0.5s LCP"] 
  },
  { 
    id: "03", 
    Icon: Cpu, 
    tag: "Growth Engine", 
    title: "Performance Scaling",
    desc: "Meta & Google Ads management paired with monthly landing page tweaks and CRM automation. Built for serious ROI.",
    tags: ["Meta/Google Ads", "CRM Automation", "ROI Dashboards"] 
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 3vw, 1.75rem)", position: "relative", overflow: "hidden", background: "#020202" }}>
      {/* Ghost Typography BG */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden" }}>
        <span className="ghost-text">INTELLIGENCE</span>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <FadeSection>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 32, marginBottom: 72 }}>
            <div>
              <span className="editorial-tag" style={{ display: "block", marginBottom: 20 }}>The Trinity_</span>
              <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1, letterSpacing: "-0.03em", color: "#E5E5E5" }}>
                Core <span style={{ color: "#00F2FF" }}>Pillars</span>
              </h2>
            </div>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.38)", lineHeight: 1.8, maxWidth: 280 }}>
              Three heavily focused verticals. One singular mission — dominate your market.
            </p>
          </div>
        </FadeSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20, 
                delay: i * 0.1 
              }}
              className="glass-panel"
              style={{
                marginTop: i === 1 ? 40 : 0, // Visual stagger only on desktop
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                minHeight: "480px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 60 }}>
                <div style={{ padding: 14, border: "1px solid rgba(0,242,255,0.15)", background: "rgba(0,242,255,0.04)", color: "#00F2FF" }}>
                  <svc.Icon size={20} />
                </div>
                <span className="editorial-tag" style={{ fontSize: 10, opacity: 0.2 }}>{svc.id}</span>
              </div>

              <div style={{ marginTop: "auto" }}>
                <span className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, display: "block", marginBottom: 16 }}>{svc.tag}</span>
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", color: "#E5E5E5", lineHeight: 1.2, marginBottom: 20 }}>{svc.title}</h3>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "rgba(229,229,229,0.45)", lineHeight: 1.8, marginBottom: 32 }}>{svc.desc}</p>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
                  {svc.tags.map(t => (
                    <span key={t} className="editorial-tag" style={{ fontSize: 9, padding: "6px 12px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "rgba(229,229,229,0.3)" }}>{t}</span>
                  ))}
                </div>

                <a href="#contact" style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-geist-mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#00F2FF", textDecoration: "none" }}>
                  <span>Engage Protocol</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
