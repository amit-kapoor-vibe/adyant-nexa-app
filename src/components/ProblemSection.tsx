"use client";

import { motion } from "framer-motion";
import { Heading } from "./ui/Heading";

export const ProblemSection = () => {
  const painPoints = [
    {
      title: "Shopify & App Bloat",
      desc: "Bloated third-party scripts, unoptimized assets, and slow theme rendering. A massive technical liability that kills D2C conversion rates."
    },
    {
      title: "iOS 14+ Signal Loss",
      desc: "Browser-based pixels lose up to 40% of purchase signals to ad-blockers and iOS restrictions. Your ad budget is wasted on blind attribution."
    },
    {
      title: "The Static Overhead",
      desc: "Standard websites are passive digital brochures. We build high-performance, self-auditing AI infrastructure that actively hunts for leads 24/7."
    }
  ];


  return (
    <section id="problem" style={{ padding: "120px 28px", background: "var(--bg-color)", position: "relative", overflow: "hidden", transition: "background 0.4s ease" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 10 }}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <span className="editorial-tag" style={{ color: "var(--accent-color)", display: "block", marginBottom: 20 }}>The Digital Liability</span>
          <Heading level="h2" style={{ color: "var(--text-color)", marginBottom: 32, transition: "color 0.4s ease" }}>
            MOST WEBSITES ARE <br />
            <span style={{ color: "var(--muted-text)", opacity: 0.7 }}>REVENUE BLACK HOLES.</span>
          </Heading>
          <p style={{ maxWidth: 600, margin: "0 auto", color: "var(--muted-text)", lineHeight: 1.8, transition: "color 0.4s ease" }}>
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
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                position: "relative",
                transition: "all 0.4s ease"
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, width: "2px", height: "0%", background: "var(--accent-color)", transition: "all 0.4s ease" }} className="hover-line" />
              <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 24, color: "var(--text-color)", marginBottom: 16, transition: "color 0.4s ease" }}>{point.title}</h3>
              <p style={{ color: "var(--muted-text)", fontSize: 14, lineHeight: 1.6, transition: "color 0.4s ease" }}>{point.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
      
      {/* Background decoration */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,242,255,0.1), transparent)", opacity: 0.3 }} />
    </section>
  );
};
