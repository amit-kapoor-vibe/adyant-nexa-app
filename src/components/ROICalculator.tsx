"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, IndianRupee, ArrowRight, ShieldCheck, Target } from "lucide-react";
import Link from "next/link";
import { FadeSection } from "./FadeSection";
import { Heading } from "@/components/ui/Heading";
import { calculateInventoryOpportunity, calculateMarginOpportunity } from "@/lib/engine";

export const ROICalculator = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState(500000);
  const [inventoryValue, setInventoryValue] = useState(1500000);
  const [deadStockPct, setDeadStockPct] = useState(25);

  const calculatedStats = useMemo(() => {
    const inputs = {
      monthlyRevenue,
      inventoryValue,
      slowDeadStockPercentage: deadStockPct,
      avgDiscountPercentage: 18,
      industry: "fashion_retail" as const,
    };

    const invOpp = calculateInventoryOpportunity(inputs);
    const marginOpp = calculateMarginOpportunity(inputs);
    const totalOpp = invOpp.estimatedAnnualOpportunity + marginOpp.estimatedAnnualOpportunity;

    return {
      totalOpportunity: totalOpp,
      inventoryOpportunity: invOpp.estimatedAnnualOpportunity,
      marginOpportunity: marginOpp.estimatedAnnualOpportunity,
    };
  }, [monthlyRevenue, inventoryValue, deadStockPct]);

  return (
    <section id="roi-calculator" style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 3vw, 1.75rem)", background: "var(--surface-color)", transition: "background 0.4s ease" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>PROFIT LEAKAGE PREVIEW_</span>
            <Heading level="h2" style={{ color: "var(--text-color)", marginBottom: 24, transition: "color 0.4s ease" }}>
              Quick Profit <span style={{ color: "var(--accent-color)", transition: "color 0.4s ease" }}>Opportunity Preview.</span>
            </Heading>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--muted-text)", lineHeight: 1.85, maxWidth: 600, margin: "0 auto", transition: "color 0.4s ease" }}>
              Adjust your retail store parameters below to preview estimated annual profit recovery.
            </p>
          </div>
        </FadeSection>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: "clamp(2rem, 4vw, 3rem)",
          background: "var(--glass-bg)",
          border: "1px solid var(--border-color)",
          padding: "clamp(1.25rem, 4vw, 3rem)",
          transition: "all 0.4s ease"
        }}>
          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--accent-color)", letterSpacing: "0.15em", marginBottom: 16 }}>
                <IndianRupee size={14} /> MONTHLY REVENUE (₹)
              </label>
              <input 
                type="range" min="100000" max="5000000" step="50000" 
                value={monthlyRevenue} 
                onChange={(e) => setMonthlyRevenue(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-color)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: "var(--font-geist-mono)", fontSize: 18, color: "var(--text-color)", fontWeight: 700 }}>
                <span>₹{monthlyRevenue.toLocaleString("en-IN")}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>₹{(monthlyRevenue / 100000).toFixed(1)} Lakhs / mo</span>
              </div>
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--accent-color)", letterSpacing: "0.15em", marginBottom: 16 }}>
                <Target size={14} /> INVENTORY VALUATION (COST PRICE IN ₹)
              </label>
              <input 
                type="range" min="200000" max="10000000" step="100000" 
                value={inventoryValue} 
                onChange={(e) => setInventoryValue(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-color)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: "var(--font-geist-mono)", fontSize: 18, color: "var(--text-color)", fontWeight: 700 }}>
                <span>₹{inventoryValue.toLocaleString("en-IN")}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>₹{(inventoryValue / 100000).toFixed(1)} Lakhs Stock</span>
              </div>
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--accent-color)", letterSpacing: "0.15em", marginBottom: 16 }}>
                SLOW / DEAD STOCK PERCENTAGE (%)
              </label>
              <input 
                type="range" min="5" max="50" step="1" 
                value={deadStockPct} 
                onChange={(e) => setDeadStockPct(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-color)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: "var(--font-geist-mono)", fontSize: 18, color: "var(--text-color)", fontWeight: 700 }}>
                <span>{deadStockPct}%</span>
                <span style={{ fontSize: 10, color: deadStockPct > 20 ? "#EF4444" : "#00F2FF" }}>
                  {deadStockPct > 20 ? "High Dead Stock" : "Moderate Level"}
                </span>
              </div>
            </div>
          </div>

          {/* Results Output */}
          <div style={{ 
            background: "var(--surface-color)", 
            border: "1px solid var(--border-color)", 
            padding: "clamp(24px, 4vw, 40px)",
            display: "flex",
            flexDirection: "column",
            justify: "space-between",
          }}>
            <div>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--accent-color)", letterSpacing: "0.2em", display: "block", marginBottom: 12 }}>
                ESTIMATED ANNUAL OPPORTUNITY
              </span>
              <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#FFFFFF", lineHeight: 1, marginBottom: 24 }}>
                ₹{calculatedStats.totalOpportunity.toLocaleString("en-IN")}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 0", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted-text)" }}>
                  <span>Inventory Capital Lock:</span>
                  <strong style={{ color: "#00F2FF" }}>₹{calculatedStats.inventoryOpportunity.toLocaleString("en-IN")}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted-text)" }}>
                  <span>Margin Discount Erosion:</span>
                  <strong style={{ color: "#00F2FF" }}>₹{calculatedStats.marginOpportunity.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/assessment"
                className="btn-primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  width: "100%",
                  textDecoration: "none",
                  padding: "16px 24px",
                  borderRadius: 8,
                }}
              >
                <span>Run Complete 7-Step Diagnostic</span>
                <ArrowRight size={16} />
              </Link>

              <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
                <ShieldCheck size={14} />
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, letterSpacing: "0.05em" }}>
                  ESTIMATED BENCHMARK ENGINE &bull; NO OBLIGATION
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
