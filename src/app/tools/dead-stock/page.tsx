"use client";

import React, { useState } from "react";
import Link from "next/link";
import { calculateInventoryOpportunity } from "@/lib/engine";
import { ArrowRight, Package, ArrowLeft, Info, CheckCircle2 } from "lucide-react";
import { Heading } from "@/components/ui/Heading";

export default function DeadStockCalculatorPage() {
  const [currency, setCurrency] = useState<"AED" | "GBP">("AED");
  const [inventoryValue, setInventoryValue] = useState(450000);
  const [deadStockPct, setDeadStockPct] = useState(25);

  const handleCurrencyChange = (curr: "AED" | "GBP") => {
    setCurrency(curr);
    if (curr === "AED") {
      setInventoryValue(450000);
    } else {
      setInventoryValue(110000);
    }
  };

  const excessStockVal = (inventoryValue * Math.max(0, deadStockPct - 12)) / 100;
  const holdingCostLeakage = excessStockVal * 0.18; // 18% annual carrying cost
  const totalOpportunity = excessStockVal + holdingCostLeakage;

  const formatMoney = (val: number) => {
    if (currency === "GBP") {
      return `£${Math.round(val).toLocaleString("en-GB")}`;
    }
    return `AED ${Math.round(val).toLocaleString("en-AE")}`;
  };

  const sliderConfig = currency === "AED" 
    ? { min: 50000, max: 3000000, step: 25000, low: "AED 50K", mid: "AED 1.5M", high: "AED 3M" }
    : { min: 15000, max: 750000, step: 5000, low: "£15K", mid: "£350K", high: "£750K" };

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "var(--text-color)", paddingTop: "6.5rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 1.5rem" }}>
        
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
            SHOWROOM INVENTORY INTELLIGENCE // CAPITAL RECOVERY
          </span>
          <Heading level="h1" style={{ textAlign: "center", marginBottom: "12px" }}>
            Boutique Dead Stock &amp; Capital Lock Calculator
          </Heading>
          <p style={{ color: "var(--muted-text)", fontSize: "0.95rem", maxWidth: "620px", margin: "0 auto", lineHeight: 1.5 }}>
            Calculate working capital trapped in archived luxury collections older than 90–120 days and the annual showroom carrying drag eroding boutique cash flow.
          </p>
        </div>

        {/* Main Card */}
        <div style={{ backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", borderRadius: "24px", padding: "2rem", marginBottom: "2rem", boxShadow: "0 4px 20px -2px rgba(10,10,12,0.04)" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {/* Input 1 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}>
                  Atelier &amp; Showroom Inventory Valuation at Cost Price
                </label>
                <span style={{ color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700, fontSize: "1.05rem" }}>
                  {formatMoney(inventoryValue)}
                </span>
              </div>
              <input
                type="range"
                min={sliderConfig.min}
                max={sliderConfig.max}
                step={sliderConfig.step}
                value={inventoryValue}
                onChange={(e) => setInventoryValue(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-color)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#666", marginTop: "0.25rem" }}>
                <span>{sliderConfig.low}</span>
                <span>{sliderConfig.mid}</span>
                <span>{sliderConfig.high}</span>
              </div>
            </div>

            {/* Input 2 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}>
                  Archived / Past-Season Collection Percentage (&gt; 90 days old)
                </label>
                <span style={{ color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700, fontSize: "1.05rem" }}>
                  {deadStockPct}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={deadStockPct}
                onChange={(e) => setDeadStockPct(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-color)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#666", marginTop: "0.25rem" }}>
                <span>Healthy (&lt;12%)</span>
                <span>Moderate (15-25%)</span>
                <span>Severe (&gt;30%)</span>
              </div>
            </div>
          </div>

          {/* Result Gauge */}
          <div style={{ backgroundColor: "rgba(0,242,255,0.03)", border: "1px solid rgba(0,242,255,0.2)", borderRadius: "18px", padding: "2rem", textAlign: "center", marginTop: "2rem", boxShadow: "0 10px 30px rgba(0,242,255,0.05)" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 600, letterSpacing: "0.15em" }}>
              TOTAL ESTIMATED ANNUAL RECOVERABLE BOUTIQUE CAPITAL
            </span>
            <div style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--text-color)", marginTop: "0.5rem", marginBottom: "0.75rem" }}>
              {formatMoney(totalOpportunity)}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "600px", margin: "1.5rem auto 0", textAlign: "left" }} className="grid-cols-1 md:grid-cols-2">
              <div style={{ backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--muted-text)", display: "block", marginBottom: "4px" }}>Locked Working Capital</span>
                <strong style={{ color: "var(--accent-color)", fontSize: "1.1rem" }}>{formatMoney(excessStockVal)}</strong>
                <p style={{ fontSize: "0.75rem", color: "#777", marginTop: "4px", margin: 0 }}>Excess inventory locked above standard 12% luxury threshold</p>
              </div>

              <div style={{ backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--muted-text)", display: "block", marginBottom: "4px" }}>Annual Carrying &amp; Floor Drag</span>
                <strong style={{ color: "#EF4444", fontSize: "1.1rem" }}>{formatMoney(holdingCostLeakage)}/yr</strong>
                <p style={{ fontSize: "0.75rem", color: "#777", marginTop: "4px", margin: 0 }}>Storage, floor-space opportunity cost, and markdown risk (~18% p.a.)</p>
              </div>
            </div>
          </div>

        </div>

        {/* Action Bottom */}
        <div style={{ backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", borderRadius: "20px", padding: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px -2px rgba(10,10,12,0.04)" }} className="flex-col md:flex-row gap-4">
          <div>
            <h4 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-color)", margin: "0 0 4px" }}>
              Ready to Liquidate Archived Pieces Automatically?
            </h4>
            <p style={{ color: "var(--muted-text)", fontSize: "0.85rem", margin: 0 }}>
              Deploy private WhatsApp VIP drop workflows to clear off-season stock at full margin without public discounting.
            </p>
          </div>
          <Link href="/assessment" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap", textDecoration: "none" }}>
            Audit Your Boutique Infrastructure <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
