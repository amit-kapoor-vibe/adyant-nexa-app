"use client";

import React, { useState } from "react";
import Link from "next/link";
import { calculateInventoryOpportunity } from "@/lib/engine";
import { ArrowRight, Package, ArrowLeft, Info, CheckCircle2 } from "lucide-react";
import { Heading } from "@/components/ui/Heading";

export default function DeadStockCalculatorPage() {
  const [inventoryValue, setInventoryValue] = useState(2000000);
  const [deadStockPct, setDeadStockPct] = useState(25);

  const inputs = {
    inventoryValue,
    slowDeadStockPercentage: deadStockPct,
    industry: "fashion_retail" as const,
  };

  const invOpp = calculateInventoryOpportunity(inputs);
  const excessStockVal = (inventoryValue * Math.max(0, deadStockPct - 12)) / 100;
  const holdingCostLeakage = excessStockVal * 0.18; // 18% annual carrying cost

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "#E5E5E5", paddingTop: "6.5rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Breadcrumb / Back */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link href="/tools" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--accent-color)", textDecoration: "none", fontSize: "0.82rem", fontFamily: "var(--font-geist-mono), monospace" }}>
            <ArrowLeft size={14} /> ALL GROWTH TOOLS
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "10px" }}>
            INVENTORY INTELLIGENCE &bull; CAPITAL RECOVERY
          </span>
          <Heading level="h1" style={{ textAlign: "center", marginBottom: "12px" }}>
            Dead Stock &amp; Capital Lock Calculator
          </Heading>
          <p style={{ color: "rgba(229,229,229,0.75)", fontSize: "0.95rem", maxWidth: "600px", margin: "0 auto", lineHeight: 1.5 }}>
            Calculate the exact working capital trapped in product inventory older than 90–120 days and the annual holding cost eroding your cash flow.
          </p>
        </div>

        {/* Main Card */}
        <div style={{ backgroundColor: "#080808", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "2rem", marginBottom: "2rem", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {/* Input 1 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", color: "#A3A3A3" }}>
                  Total Inventory Valuation at Cost Price (₹)
                </label>
                <span style={{ color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700, fontSize: "1.05rem" }}>
                  ₹{inventoryValue.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="300000"
                max="15000000"
                step="100000"
                value={inventoryValue}
                onChange={(e) => setInventoryValue(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "#00F2FF" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#666", marginTop: "0.25rem" }}>
                <span>₹3 Lakhs</span>
                <span>₹75 Lakhs</span>
                <span>₹1.5 Crores</span>
              </div>
            </div>

            {/* Input 2 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", color: "#A3A3A3" }}>
                  Estimated Slow-Moving / Dead Stock Percentage (% &gt; 90 days old)
                </label>
                <span style={{ color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700, fontSize: "1.05rem" }}>
                  {deadStockPct}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={deadStockPct}
                onChange={(e) => setDeadStockPct(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#00F2FF" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#666", marginTop: "0.25rem" }}>
                <span>Healthy (&lt;12%)</span>
                <span>Moderate (15-25%)</span>
                <span>Severe (&gt;30%)</span>
              </div>
            </div>
          </div>

          {/* Result Gauge */}
          <div style={{ backgroundColor: "#020202", border: "1px solid rgba(0,242,255,0.25)", borderRadius: "18px", padding: "2rem", textAlign: "center", marginTop: "2rem", boxShadow: "0 0 30px rgba(0,242,255,0.06)" }}>
            <span style={{ fontSize: "0.78rem", color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 600, letterSpacing: "0.15em" }}>
              TOTAL ESTIMATED ANNUAL CAPITAL &amp; CARRYING COST OPPORTUNITY
            </span>
            <div style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#FFFFFF", marginTop: "0.5rem", marginBottom: "0.75rem" }}>
              ₹{invOpp.estimatedAnnualOpportunity.toLocaleString("en-IN")}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "600px", margin: "1.5rem auto 0", textAlign: "left" }} className="grid-cols-1 md:grid-cols-2">
              <div style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#A3A3A3", display: "block", marginBottom: "4px" }}>Trapped Working Capital</span>
                <strong style={{ color: "#00F2FF", fontSize: "1.1rem" }}>₹{excessStockVal.toLocaleString("en-IN")}</strong>
                <p style={{ fontSize: "0.75rem", color: "#777", marginTop: "4px", margin: 0 }}>Excess inventory locked above standard 12% threshold</p>
              </div>

              <div style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#A3A3A3", display: "block", marginBottom: "4px" }}>Annual Carrying Drag</span>
                <strong style={{ color: "#EF4444", fontSize: "1.1rem" }}>₹{holdingCostLeakage.toLocaleString("en-IN")}/yr</strong>
                <p style={{ fontSize: "0.75rem", color: "#777", marginTop: "4px", margin: 0 }}>Storage, depreciation, and opportunity cost (~18% p.a.)</p>
              </div>
            </div>
          </div>

        </div>

        {/* Action Bottom */}
        <div style={{ backgroundColor: "#080808", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }} className="flex-col md:flex-row gap-4">
          <div>
            <h4 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 4px" }}>
              Need an Inventory Liquidation Framework?
            </h4>
            <p style={{ color: "#A3A3A3", fontSize: "0.85rem", margin: 0 }}>
              Run the complete diagnostic to build an automated markdown &amp; replenishment system.
            </p>
          </div>
          <Link href="/assessment" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap", textDecoration: "none" }}>
            Start Free Assessment <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
