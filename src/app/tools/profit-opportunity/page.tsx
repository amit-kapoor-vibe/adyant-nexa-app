"use client";

import React, { useState } from "react";
import Link from "next/link";
import { calculateMarginOpportunity, calculateInventoryOpportunity, calculateRetentionOpportunity } from "@/lib/engine";
import { ArrowRight, ArrowLeft, BarChart3, Info } from "lucide-react";
import { Heading } from "@/components/ui/Heading";

export default function ProfitOpportunityCalculatorPage() {
  const [currency, setCurrency] = useState<"AED" | "GBP">("AED");
  const [monthlyRevenue, setMonthlyRevenue] = useState(180000);
  const [inventoryValue, setInventoryValue] = useState(450000);
  const [deadStockPct, setDeadStockPct] = useState(22);
  const [discountPct, setDiscountPct] = useState(15);
  const [repeatPct, setRepeatPct] = useState(25);

  const handleCurrencyChange = (curr: "AED" | "GBP") => {
    setCurrency(curr);
    if (curr === "AED") {
      setMonthlyRevenue(180000);
      setInventoryValue(450000);
    } else {
      setMonthlyRevenue(45000);
      setInventoryValue(110000);
    }
  };

  const formatMoney = (val: number) => {
    if (currency === "GBP") {
      return `£${Math.round(val).toLocaleString("en-GB")}`;
    }
    return `AED ${Math.round(val).toLocaleString("en-AE")}`;
  };

  const invOppVal = ((inventoryValue * Math.max(0, deadStockPct - 12)) / 100) * 1.18;
  const marginOppVal = monthlyRevenue * 12 * (discountPct / 100) * 0.4;
  const retOppVal = monthlyRevenue * 12 * (Math.max(0, 40 - repeatPct) / 100) * 0.25;
  const totalOpportunity = invOppVal + marginOppVal + retOppVal;

  const revConfig = currency === "AED"
    ? { min: 30000, max: 1000000, step: 10000 }
    : { min: 10000, max: 250000, step: 2500 };

  const invConfig = currency === "AED"
    ? { min: 50000, max: 2500000, step: 25000 }
    : { min: 15000, max: 600000, step: 5000 };

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "var(--text-color)", paddingTop: "6.5rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Breadcrumb / Back */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <Link href="/tools" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--accent-color)", textDecoration: "none", fontSize: "0.82rem", fontFamily: "var(--font-geist-mono), monospace" }}>
            <ArrowLeft size={14} /> ALL GROWTH TOOLS
          </Link>

          {/* Currency Toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", padding: "3px", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", borderRadius: "9999px" }}>
            <button
              onClick={() => handleCurrencyChange("AED")}
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                border: "none",
                fontSize: "11px",
                fontFamily: "var(--font-geist-mono), monospace",
                fontWeight: 700,
                cursor: "pointer",
                backgroundColor: currency === "AED" ? "var(--accent-color)" : "transparent",
                color: currency === "AED" ? "#020202" : "var(--muted-text)",
                transition: "all 0.2s ease",
              }}
            >
              DUBAI (AED)
            </button>
            <button
              onClick={() => handleCurrencyChange("GBP")}
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                border: "none",
                fontSize: "11px",
                fontFamily: "var(--font-geist-mono), monospace",
                fontWeight: 700,
                cursor: "pointer",
                backgroundColor: currency === "GBP" ? "var(--accent-color)" : "transparent",
                color: currency === "GBP" ? "#020202" : "var(--muted-text)",
                transition: "all 0.2s ease",
              }}
            >
              LONDON (GBP £)
            </button>
          </div>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "10px" }}>
            PROFIT MODELING // MARGIN RECOVERY
          </span>
          <Heading level="h1" style={{ textAlign: "center", marginBottom: "12px" }}>
            Omnichannel Profit &amp; Conversational Leakage Calculator
          </Heading>
          <p style={{ color: "var(--muted-text)", fontSize: "0.95rem", maxWidth: "620px", margin: "0 auto", lineHeight: 1.5 }}>
            Adjust your boutique parameters below to calculate estimated annual revenue and margin recovery across delayed chat replies, VIP repeat client retention, and showroom stock turnover.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "2rem", marginBottom: "2.5rem" }} className="grid-cols-1 md:grid-cols-2">
          {/* Controls */}
          <div style={{ backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", borderRadius: "24px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.35rem", boxShadow: "0 4px 20px -2px rgba(10,10,12,0.04)" }}>
            <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-color)", margin: "0 0 0.5rem" }}>
              Boutique Input Parameters
            </h3>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <label style={{ fontSize: "0.82rem", color: "var(--muted-text)" }}>Average Monthly Boutique Revenue</label>
                <span style={{ color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>{formatMoney(monthlyRevenue)}</span>
              </div>
              <input type="range" min={revConfig.min} max={revConfig.max} step={revConfig.step} value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-color)" }} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <label style={{ fontSize: "0.82rem", color: "var(--muted-text)" }}>Showroom &amp; Atelier Inventory at Cost</label>
                <span style={{ color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>{formatMoney(inventoryValue)}</span>
              </div>
              <input type="range" min={invConfig.min} max={invConfig.max} step={invConfig.step} value={inventoryValue} onChange={(e) => setInventoryValue(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-color)" }} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <label style={{ fontSize: "0.82rem", color: "var(--muted-text)" }}>Archived / Past-Season Collection Percentage (&gt; 90d)</label>
                <span style={{ color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>{deadStockPct}%</span>
              </div>
              <input type="range" min="5" max="50" value={deadStockPct} onChange={(e) => setDeadStockPct(parseInt(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-color)" }} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <label style={{ fontSize: "0.82rem", color: "var(--muted-text)" }}>Average Private VIP Markdown / Discount Given</label>
                <span style={{ color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>{discountPct}%</span>
              </div>
              <input type="range" min="0" max="40" value={discountPct} onChange={(e) => setDiscountPct(parseInt(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-color)" }} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <label style={{ fontSize: "0.82rem", color: "var(--muted-text)" }}>VIP Client Repeat Purchase Rate</label>
                <span style={{ color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>{repeatPct}%</span>
              </div>
              <input type="range" min="5" max="60" value={repeatPct} onChange={(e) => setRepeatPct(parseInt(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-color)" }} />
            </div>
          </div>

          {/* Results Output */}
          <div style={{ backgroundColor: "rgba(0,242,255,0.03)", border: "1px solid rgba(0,242,255,0.2)", borderRadius: "24px", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 10px 30px rgba(0,242,255,0.05)" }}>
            <div>
              <span style={{ fontSize: "0.78rem", color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 600, letterSpacing: "0.15em" }}>
                TOTAL ESTIMATED ANNUAL PROFIT &amp; CONVERSION UPSIDE
              </span>
              <div style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 800, color: "var(--text-color)", marginTop: "0.5rem", marginBottom: "1.25rem" }}>
                {formatMoney(totalOpportunity)}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.88rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.6rem" }}>
                  <span style={{ color: "var(--muted-text)" }}>Recovered Archived Inventory Capital:</span>
                  <strong style={{ color: "var(--accent-color)" }}>{formatMoney(invOppVal)}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.6rem" }}>
                  <span style={{ color: "var(--muted-text)" }}>Discount Margin Protection:</span>
                  <strong style={{ color: "var(--accent-color)" }}>{formatMoney(marginOppVal)}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.6rem" }}>
                  <span style={{ color: "var(--muted-text)" }}>Conversational VIP Retention Gap:</span>
                  <strong style={{ color: "var(--accent-color)" }}>{formatMoney(retOppVal)}</strong>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Link href="/assessment" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", textDecoration: "none" }}>
                Start Autonomous Boutique Audit <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
