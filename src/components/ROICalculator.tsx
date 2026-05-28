"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, DollarSign, Target, ShieldCheck, IndianRupee } from "lucide-react";
import { FadeSection } from "./FadeSection";
import { ROI_INDUSTRIES, ROI_GLOBAL_CONFIG } from "@/data/roiData";
import { Currency } from "@/types";
import { Heading } from "@/components/ui/Heading";

// ─── Sub-Components ──────────────────────────────────────────────────────────

const IndustryTabs = ({ selectedId, onChange }: { selectedId: string, onChange: (id: string) => void }) => (
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
    {ROI_INDUSTRIES.map((ind) => (
      <button
        key={ind.id}
        onClick={() => onChange(ind.id)}
        style={{
          padding: "10px 20px",
          fontFamily: "var(--font-geist-mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: selectedId === ind.id ? "var(--shadow-color)" : "transparent",
          border: `1px solid ${selectedId === ind.id ? "var(--accent-color)" : "var(--border-color)"}`,
          color: selectedId === ind.id ? "var(--accent-color)" : "var(--muted-text)",
          cursor: "pointer",
          transition: "all 0.3s ease"
        }}
      >
        {ind.name}
      </button>
    ))}
  </div>
);

interface ImpactStats {
  totalImpact: number;
  netSavings: number;
  revenueBoost: number;
  roi: number;
}

const ImpactResults = ({ stats, isINR }: { stats: ImpactStats, isINR: boolean }) => (
  <div style={{ 
    background: "var(--surface-color)", 
    border: "1px solid var(--border-color)", 
    padding: "clamp(24px, 4vw, 48px)",
    display: "flex",
    flexDirection: "column",
    gap: 40,
    transition: "all 0.4s ease"
  }}>
    <AnimatePresence mode="wait">
      <motion.div
        key={stats.totalImpact}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--muted-text)", letterSpacing: "0.2em", display: "block", marginBottom: 12, transition: "color 0.4s ease" }}>ESTIMATED NEURAL IMPACT</span>
          <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(1.5rem, 5vw, 3.5rem)", color: "var(--accent-color)", lineHeight: 1, transition: "color 0.4s ease" }}>
            {new Intl.NumberFormat(isINR ? 'en-IN' : 'en-US', { style: 'currency', currency: isINR ? 'INR' : 'USD', maximumFractionDigits: 0 }).format(Math.round(stats.totalImpact))}
          </div>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
          gap: 24, 
          borderTop: "1px solid var(--border-color)", 
          paddingTop: 32, 
          marginBottom: 32,
          transition: "border-color 0.4s ease"
        }}>
          <div>
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "var(--muted-text)", letterSpacing: "0.1em", display: "block", marginBottom: 8, transition: "color 0.4s ease" }}>COST REDUCTION</span>
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, color: "var(--text-color)", transition: "color 0.4s ease" }}>
              {new Intl.NumberFormat(isINR ? 'en-IN' : 'en-US', { style: 'currency', currency: isINR ? 'INR' : 'USD', maximumFractionDigits: 0 }).format(Math.round(stats.netSavings))}
            </span>
          </div>
          <div>
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "var(--muted-text)", letterSpacing: "0.1em", display: "block", marginBottom: 8, transition: "color 0.4s ease" }}>REVENUE RECOVERY</span>
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, color: "#00FF66" }}>
              +{new Intl.NumberFormat(isINR ? 'en-IN' : 'en-US', { style: 'currency', currency: isINR ? 'INR' : 'USD', maximumFractionDigits: 0 }).format(Math.round(stats.revenueBoost))}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "rgba(0,255,102,0.03)", border: "1px solid rgba(0,255,102,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <TrendingUp size={16} color="#00FF66" />
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#00FF66", fontWeight: 600 }}>STRATEGIC ROI</span>
          </div>
          <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, color: "var(--text-color)", transition: "color 0.4s ease" }}>
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
);

// ─── Main Component ─────────────────────────────────────────────────────────

export const ROICalculator = ({ currency = "USD" }: { currency?: Currency }) => {
  const isINR = currency === "INR";
  const [selectedIndustry, setSelectedIndustry] = useState(ROI_INDUSTRIES[0]);
  const [leads, setLeads] = useState(100);
  const [laborCost, setLaborCost] = useState(selectedIndustry.defaultLabor);

  const { nexaSetup, tokenCost } = useMemo(() => ({
    nexaSetup: isINR ? ROI_GLOBAL_CONFIG.nexaSetupINR : ROI_GLOBAL_CONFIG.nexaSetupUSD,
    tokenCost: isINR ? ROI_GLOBAL_CONFIG.tokenCostPerLeadINR : ROI_GLOBAL_CONFIG.tokenCostPerLeadUSD
  }), [isINR]);

  const stats = useMemo(() => {
    const annualHumanCost = laborCost * 12;
    const annualRunningCost = (leads * tokenCost) * 12;
    const netSavings = (annualHumanCost - (nexaSetup + annualRunningCost));
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
    <section id="roi-calculator" style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 3vw, 1.75rem)", background: "var(--surface-color)", transition: "background 0.4s ease" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>REVENUE INFRASTRUCTURE AUDIT_</span>
            <Heading level="h2" style={{ color: "var(--text-color)", marginBottom: 24, transition: "color 0.4s ease" }}>
              Calculate Your <span style={{ color: "var(--accent-color)", transition: "color 0.4s ease" }}>Neural Impact.</span>
            </Heading>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--muted-text)", lineHeight: 1.85, maxWidth: 600, margin: "0 auto", transition: "color 0.4s ease" }}>
              Standard calculators only show cost savings. We show **Revenue Recovery**.
            </p>
          </div>
        </FadeSection>

        <IndustryTabs selectedId={selectedIndustry.id} onChange={handleIndustryChange} />

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr", 
          gap: "clamp(2rem, 5vw, 4rem)",
          background: "var(--glass-bg)",
          border: "1px solid var(--border-color)",
          padding: "clamp(1.25rem, 4vw, 3rem)",
          transition: "all 0.4s ease"
        }}>
          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--accent-color)", letterSpacing: "0.2em", marginBottom: 20, transition: "color 0.4s ease" }}>
                <Target size={14} /> MONTHLY LEAD VOLUME
              </label>
              <input 
                type="range" min="10" max="5000" step="10" 
                value={leads} 
                onChange={(e) => setLeads(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-color)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: "var(--font-geist-mono)", fontSize: 18, color: "var(--text-color)", fontWeight: 700, transition: "color 0.4s ease" }}>
                <span>{leads.toLocaleString()}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>INQUIRIES/MO</span>
              </div>
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--accent-color)", letterSpacing: "0.2em", marginBottom: 20, transition: "color 0.4s ease" }}>
                {isINR ? <IndianRupee size={14} /> : <DollarSign size={14} />} HUMAN OVERHEAD (MONTHLY)
              </label>
              <input 
                type="range" 
                min={selectedIndustry.minLabor} 
                max={selectedIndustry.maxLabor} 
                step={isINR ? 5000 : 500} 
                value={laborCost} 
                onChange={(e) => setLaborCost(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-color)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: "var(--font-geist-mono)", fontSize: "clamp(14px, 2vw, 18px)", color: "var(--text-color)", fontWeight: 700, transition: "color 0.4s ease" }}>
                <span>{new Intl.NumberFormat(isINR ? 'en-IN' : 'en-US', { style: 'currency', currency: isINR ? 'INR' : 'USD', maximumFractionDigits: 0 }).format(laborCost)}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>OPEX/MO</span>
              </div>
            </div>

            <div style={{ padding: 24, border: "1px solid var(--border-color)", background: "var(--glass-bg)", transition: "all 0.4s ease" }}>
              <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.4, display: "block", marginBottom: 12 }}>{selectedIndustry.name} Industry Baseline_</span>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--muted-text)", lineHeight: 1.6, transition: "color 0.4s ease" }}>
                Avg Ticket Size: <span style={{ color: "var(--text-color)", transition: "color 0.4s ease" }}>{new Intl.NumberFormat(isINR ? 'en-IN' : 'en-IN', { style: 'currency', currency: isINR ? 'INR' : 'USD', maximumFractionDigits: 0 }).format(selectedIndustry.avgTicketSize)}</span><br />
                Response Fragility: <span style={{ color: "#FF4444" }}>{(selectedIndustry.responseLoss * 100).toFixed(0)}% Revenue Leakage</span>
              </p>
            </div>
          </div>

          <ImpactResults stats={stats} isINR={isINR} />
        </div>
      </div>
    </section>
  );
};


