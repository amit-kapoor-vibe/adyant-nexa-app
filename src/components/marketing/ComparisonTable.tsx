"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { comparisonData } from "@/data/marketingData";
import { X, Check } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { FadeSection } from "@/components/FadeSection";

export const ComparisonTable = () => {
  const [activeTab, setActiveTab] = useState<"traditional" | "adyantNexa">("adyantNexa");

  return (
    <section style={{ padding: "clamp(4rem, 8vw, 7rem) 20px", borderTop: "1px solid rgba(255,255,255,0.04)", background: "#020202" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 16, display: "block", fontSize: 9 }}>COMPETITIVE ANALYSIS_</span>
            <Heading level="h2" style={{ color: "#E5E5E5" }}>
              The Performance <span style={{ color: "#00F2FF" }}>Gap.</span>
            </Heading>
          </div>
        </FadeSection>

        {/* Mobile Tab Switcher */}
        <div className="mobile-tabs" style={{ 
          display: "none", 
          background: "rgba(255,255,255,0.03)", 
          padding: 4, 
          borderRadius: 12, 
          marginBottom: 32,
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <button 
            onClick={() => setActiveTab("traditional")}
            style={{ 
              flex: 1, 
              padding: "14px", 
              background: activeTab === "traditional" ? "rgba(255,255,255,0.05)" : "transparent",
              color: activeTab === "traditional" ? "#fff" : "rgba(255,255,255,0.4)",
              border: "none",
              borderRadius: 8,
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              transition: "0.3s"
            }}
          >TRADITIONAL</button>
          <button 
            onClick={() => setActiveTab("adyantNexa")}
            style={{ 
              flex: 1, 
              padding: "14px", 
              background: activeTab === "adyantNexa" ? "rgba(0,242,255,0.1)" : "transparent",
              color: activeTab === "adyantNexa" ? "#00F2FF" : "rgba(255,255,255,0.4)",
              border: "none",
              borderRadius: 8,
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              transition: "0.3s"
            }}
          >ADYANT NEXA</button>
        </div>

        <div className="comparison-content">
          <div className="desktop-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {/* Standard Column (Desktop) */}
            <div className="column standard-column" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="desktop-only" style={{ textAlign: "center", marginBottom: 12 }}>
                <span className="editorial-tag" style={{ fontSize: 9, opacity: 0.3 }}>Traditional Agency_</span>
              </div>
              {comparisonData.traditional.map((item, i) => (
                <div key={i} className="comparison-item traditional" style={{ 
                  padding: "24px", 
                  background: "rgba(255,255,255,0.02)", 
                  border: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: 0.5
                }}>
                  <X size={14} color="#ff4d4d" style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "#fff" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Nexa Column (Desktop) */}
            <div className="column nexa-column" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="desktop-only" style={{ textAlign: "center", marginBottom: 12 }}>
                <span className="editorial-tag" style={{ fontSize: 9, color: "#00F2FF" }}>Adyant Nexa Protocol_</span>
              </div>
              {comparisonData.adyantNexa.map((item, i) => (
                <div key={i} className="comparison-item nexa" style={{ 
                  padding: "24px", 
                  background: "rgba(0,242,255,0.03)", 
                  border: "1px solid rgba(0,242,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  boxShadow: "0 0 30px rgba(0,242,255,0.02)"
                }}>
                  <Check size={14} color="#00F2FF" style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "#fff", fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile View */}
          <div className="mobile-list" style={{ display: "none" }}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === "adyantNexa" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === "adyantNexa" ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {(activeTab === "traditional" ? comparisonData.traditional : comparisonData.adyantNexa).map((item, i) => (
                  <div key={i} style={{ 
                    padding: "20px", 
                    background: activeTab === "traditional" ? "rgba(255,255,255,0.02)" : "rgba(0,242,255,0.03)", 
                    border: `1px solid ${activeTab === "traditional" ? "rgba(255,255,255,0.05)" : "rgba(0,242,255,0.2)"}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 16
                  }}>
                    {activeTab === "traditional" ? <X size={14} color="#ff4d4d" /> : <Check size={14} color="#00F2FF" />}
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "#fff" }}>{item}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        .desktop-only { display: block; }
        
        @media (max-width: 768px) {
          .desktop-grid { display: none !important; }
          .mobile-tabs { display: flex !important; }
          .mobile-list { display: block !important; }
          .desktop-only { display: none !important; }
        }
      `}</style>
    </section>
  );
};
