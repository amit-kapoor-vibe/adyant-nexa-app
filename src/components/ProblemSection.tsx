"use client";

import { motion } from "framer-motion";

export const ProblemSection = () => {
  const painPoints = [
    {
      title: "The WordPress Bloat",
      desc: "Slow, fragile, and vulnerable. A liability that kills your conversion rate before the page even loads."
    },
    {
      title: "Human Resource Drain",
      desc: "Answering basic FAQs manually is a waste of talent. Our AI agents replace $40k/year in human labor costs."
    },
    {
      title: "Static Overhead",
      desc: "Most websites are digital brochures. We build high-performance infrastructure that hunts for leads 24/7."
    }
  ];

  return (
    <section id="problem" style={{ padding: "120px 28px", background: "#020202", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 10 }}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <span className="editorial-tag" style={{ color: "#00F2FF", display: "block", marginBottom: 20 }}>The Digital Liability</span>
          <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(40px, 8vw, 80px)", lineHeight: 1, letterSpacing: "-0.03em", color: "#fff", marginBottom: 32 }}>
            MOST WEBSITES ARE <br />
            <span style={{ color: "rgba(255,255,255,0.15)" }}>REVENUE BLACK HOLES.</span>
          </h2>
          <p style={{ maxWidth: 600, margin: "0 auto", color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
            Standard websites are overhead. Adyant Nexa assets are high-performance revenue engines that replace manual processes with elite AI automation.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          {painPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                padding: "40px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                position: "relative"
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, width: "2px", height: "0%", background: "#00F2FF", transition: "height 0.4s" }} className="hover-line" />
              <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 24, color: "#fff", marginBottom: 16 }}>{point.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.6 }}>{point.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
      
      {/* Background decoration */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,242,255,0.1), transparent)", opacity: 0.3 }} />
    </section>
  );
};
