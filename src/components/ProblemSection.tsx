"use client";

import { motion } from "framer-motion";
import { Heading } from "./ui/Heading";

export const ProblemSection = () => {
  const painPoints = [
    {
      title: "Dead Stock & Capital Locks",
      desc: "Up to 25% of inventory remains unsold past 90–120 days. Locked working capital restricts fresh stock purchases and cash flow liquidity."
    },
    {
      title: "Discount Margin Erosion",
      desc: "Unplanned end-of-season sales and blanket 20–40% discounts directly erode net margins, destroying store profitability."
    },
    {
      title: "Low Customer Repeat Rates",
      desc: "One-time buyers represent severe customer lifetime value (LTV) leakage. Acquiring new buyers without repeat systems drains marketing ROI."
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
          <span className="editorial-tag" style={{ color: "var(--accent-color)", display: "block", marginBottom: 20 }}>THE RETAIL PROFIT LEAKAGE</span>
          <Heading level="h2" style={{ color: "var(--text-color)", marginBottom: 32, transition: "color 0.4s ease" }}>
            WHERE IS YOUR BUSINESS <br />
            <span style={{ color: "var(--accent-color)" }}>LOSING MONEY?</span>
          </Heading>
          <p style={{ maxWidth: 650, margin: "0 auto", color: "var(--muted-text)", lineHeight: 1.8, transition: "color 0.4s ease" }}>
            Most retail owners focus solely on top-line sales, while hidden operational leakages silently consume 15% to 30% of potential profit margins every single year.
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
              className="glass-panel"
              style={{
                padding: "40px",
                position: "relative",
                border: "1px solid var(--border-color)",
                background: "var(--glass-bg)"
              }}
            >
              {/* Cyber Scanline */}
              <div className="cyber-scanline" />

              {/* Sci-Fi Corner Brackets */}
              <div className="cyber-bracket cb-tl" />
              <div className="cyber-bracket cb-tr" />
              <div className="cyber-bracket cb-bl" />
              <div className="cyber-bracket cb-br" />

              {/* Meta Ticker */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.3 }}>[ LEAKAGE_AREA_0{i+1} ]</span>
                <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.5, color: "#00F2FF" }}>HIGH IMPACT</span>
              </div>

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
