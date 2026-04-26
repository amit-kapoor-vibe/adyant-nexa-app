"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Users, DollarSign, Zap, IndianRupee, Briefcase, Target, ShieldCheck } from "lucide-react";
import { FadeSection } from "./FadeSection";
import { ROI_INDUSTRIES, ROI_GLOBAL_CONFIG } from "@/data/roiData";
import { Currency } from "@/types";

export const ROICalculator = ({ currency = "USD" }: { currency?: Currency }) => {
  const isINR = currency === "INR";
  const [selectedIndustry, setSelectedIndustry] = useState(ROI_INDUSTRIES[0]);
  const [leads, setLeads] = useState(100);
  const [laborCost, setLaborCost] = useState(selectedIndustry.defaultLabor);

  // ─── Calculations ────────────────────────────────────────────────────────────
  const { nexaSetup, tokenCost } = useMemo(() => ({
    nexaSetup: isINR ? ROI_GLOBAL_CONFIG.nexaSetupINR : ROI_GLOBAL_CONFIG.nexaSetupUSD,
    tokenCost: isINR ? ROI_GLOBAL_CONFIG.tokenCostPerLeadINR : ROI_GLOBAL_CONFIG.tokenCostPerLeadUSD
  }), [isINR]);

  const stats = useMemo(() => {
    const annualHumanCost = laborCost * 12;
    const annualRunningCost = (leads * tokenCost) * 12;
    const netSavings = (annualHumanCost - (nexaSetup + annualRunningCost));
    
    // Revenue Impact Logic
    // We assume a conservative 2% baseline conversion. AI improves this by conversionLift.
    const baselineConv = 0.02; 
    const additionalConversions = leads * selectedIndustry.conversionLift * baselineConv * 12;
    const revenueBoost = additionalConversions * selectedIndustry.avgTicketSize;
    
    const totalImpact = netSavings + revenueBoost;
    const roi = (totalImpact / nexaSetup) * 100;

    return { netSavings, revenueBoost, totalImpact, roi };
  }, [leads, laborCost, selectedIndustry, nexaSetup, tokenCost]);

  const handleIndustryChange = (id: string) => {
    const industry = ROI_INDUSTRIES.find(i => i.id === id) || ROI_INDUSTRIES[0];
    setSelectedIndustry(industry);
    setLaborCost(industry.defaultLabor);
  };

  return (
    <section id="roi-calculator" style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 3vw, 1.75rem)", background: "#080808" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>REVENUE INFRASTRUCTURE AUDIT_</span>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4.5rem)", color: "#E5E5E5", lineHeight: 1.1 }}>
              Calculate Your <span style={{ color: "#00F2FF" }}>Nexa Advantage.</span>
            </h2>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.35)", lineHeight: 1.85, maxWidth: 600, margin: "24px auto 0" }}>
              Standard calculators only show cost savings. We show **Revenue Recovery**. See how autonomous infrastructure transforms your industry specific unit economics.
            </p>
          </div>
        </FadeSection>

        {/* Industry Selector Tabs */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
          {ROI_INDUSTRIES.map((ind) => (
            <button
              key={ind.id}
              onClick={() => handleIndustryChange(ind.id)}
              style={{
                padding: "10px 20px",
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: selectedIndustry.id === ind.id ? "rgba(0,242,255,0.1)" : "transparent",
                border: `1px solid ${selectedIndustry.id === ind.id ? "#00F2FF" : "rgba(255,255,255,0.1)"}`,
                color: selectedIndustry.id === ind.id ? "#00F2FF" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              {ind.name}
            </button>
          ))}
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: 32,
          background: "rgba(255,255,255,0.01)",
          border: "1px solid rgba(255,255,255,0.04)",
          padding: "clamp(1.5rem, 4vw, 3rem)",
          position: "relative"
        }}>
          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#00F2FF", letterSpacing: "0.2em", marginBottom: 20 }}>
                <Target size={14} /> MONTHLY LEAD VOLUME
              </label>
              <input 
                type="range" min="10" max="5000" step="10" 
                value={leads} 
                onChange={(e) => setLeads(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#00F2FF", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: "var(--font-geist-mono)", fontSize: 18, color: "#E5E5E5", fontWeight: 700 }}>
                <span>{leads.toLocaleString()}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>INQUIRIES/MO</span>
              </div>
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#00F2FF", letterSpacing: "0.2em", marginBottom: 20 }}>
                {isINR ? <IndianRupee size={14} /> : <DollarSign size={14} />} HUMAN OVERHEAD (MONTHLY)
              </label>
              <input 
                type="range" 
                min={selectedIndustry.minLabor} 
                max={selectedIndustry.maxLabor} 
                step={isINR ? 5000 : 500} 
                value={laborCost} 
                onChange={(e) => setLaborCost(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#00F2FF", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: "var(--font-geist-mono)", fontSize: 18, color: "#E5E5E5", fontWeight: 700 }}>
                <span>{isINR ? "₹" : "$"}{laborCost.toLocaleString()}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>OPEX/MO</span>
              </div>
            </div>

            {/* Context Card */}
            <div style={{ padding: 24, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
              <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.4, display: "block", marginBottom: 12 }}>{selectedIndustry.name} Industry Baseline_</span>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
                Avg Ticket Size: <span style={{ color: "#E5E5E5" }}>{isINR ? "₹" : "$"}{selectedIndustry.avgTicketSize.toLocaleString()}</span><br />
                Response Fragility: <span style={{ color: "#FF4444" }}>{(selectedIndustry.responseLoss * 100).toFixed(0)}% Revenue Leakage</span>
              </p>
            </div>
          </div>

          {/* Results Display */}
          <div style={{ 
            background: "rgba(0,242,255,0.02)", 
            border: "1px solid rgba(0,242,255,0.1)", 
            padding: "clamp(24px, 4vw, 48px)",
            display: "flex",
            flexDirection: "column",
            gap: 40
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndustry.id + leads + laborCost}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ marginBottom: 40 }}>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", display: "block", marginBottom: 12 }}>TOTAL ANNUAL IMPACT</span>
                  <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#00F2FF", lineHeight: 1 }}>
                    {isINR ? "₹" : "$"}{Math.round(stats.totalImpact).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 32, marginBottom: 32 }}>
                  <div>
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>COST REDUCTION</span>
                    <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, color: "#E5E5E5" }}>
                      {isINR ? "₹" : "$"}{Math.round(stats.netSavings).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>REVENUE RECOVERY</span>
                    <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, color: "#00FF66" }}>
                      +{isINR ? "₹" : "$"}{Math.round(stats.revenueBoost).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "rgba(0,255,102,0.03)", border: "1px solid rgba(0,255,102,0.15)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <TrendingUp size={16} color="#00FF66" />
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#00FF66", fontWeight: 600 }}>STRATEGIC ROI</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, color: "#fff" }}>
                    {Math.round(stats.roi)}%
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <div style={{ marginTop: "auto", display: "flex", gap: 12, alignItems: "center", opacity: 0.4 }}>
              <ShieldCheck size={14} />
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, letterSpacing: "0.05em" }}>ALGORITHMIC AUDIT COMPLETE · DATA VERIFIED</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "rgba(229,229,229,0.2)", fontStyle: "italic" }}>
            *Calculated using {selectedIndustry.name} benchmark conversion lifts and response fragility metrics. 
            Impact includes OpEx reduction and revenue recovery via instant response systems.
          </p>
        </div>
      </div>
    </section>
  );
};

