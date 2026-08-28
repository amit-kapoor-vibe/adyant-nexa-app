"use client";

import React, { useState } from "react";
import Link from "next/link";
import { calculateInventoryOpportunity } from "@/lib/engine";
import { ArrowRight, Package } from "lucide-react";

export default function DeadStockCalculatorPage() {
  const [inventoryValue, setInventoryValue] = useState(2000000);
  const [deadStockPct, setDeadStockPct] = useState(25);

  const inputs = {
    inventoryValue,
    slowDeadStockPercentage: deadStockPct,
    industry: "fashion_retail" as const,
  };

  const invOpp = calculateInventoryOpportunity(inputs);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#020202", color: "#E5E5E5", paddingTop: "6rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="editorial-tag">INVENTORY INTELLIGENCE &bull; DEAD STOCK CALCULATOR</span>
          <h1 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "2.25rem", fontWeight: 800, marginTop: "0.5rem", color: "#FFFFFF" }}>
            Dead Stock &amp; Capital Lock Calculator
          </h1>
          <p style={{ color: "#A3A3A3", fontSize: "0.95rem" }}>Diagnose locked working capital in slow-moving apparel stock.</p>
        </div>

        <div style={{ backgroundColor: "#080808", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "2rem", marginBottom: "2rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
              Total Inventory Valuation at Cost Price (₹): ₹{inventoryValue.toLocaleString("en-IN")}
            </label>
            <input type="range" min="300000" max="15000000" step="100000" value={inventoryValue} onChange={(e) => setInventoryValue(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#00F2FF" }} />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", color: "#A3A3A3" }}>Estimated Slow/Dead Stock % (Stock over 90 days old):</label>
              <span style={{ color: "#00F2FF", fontWeight: 700 }}>{deadStockPct}%</span>
            </div>
            <input type="range" min="5" max="60" value={deadStockPct} onChange={(e) => setDeadStockPct(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#00F2FF" }} />
          </div>

          <div style={{ backgroundColor: "#020202", border: "1px solid rgba(0,242,255,0.3)", borderRadius: "16px", padding: "1.5rem", textAlign: "center", marginTop: "2rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 600 }}>ESTIMATED CAPITAL &amp; CARRYING COST OPPORTUNITY</span>
            <h2 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "2.5rem", fontWeight: 800, color: "#FFFFFF", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
              ₹{invOpp.estimatedAnnualOpportunity.toLocaleString("en-IN")}
            </h2>
            <p style={{ color: "#A3A3A3", fontSize: "0.85rem", maxWidth: "500px", margin: "0 auto" }}>
              Includes ₹{((inventoryValue * Math.max(0, deadStockPct - 12)) / 100).toLocaleString("en-IN")} excess inventory capital locked above healthy retail benchmark (&lt;12%).
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/assessment" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            Start Complete Growth Assessment <ArrowRight style={{ width: "16px", height: "16px" }} />
          </Link>
        </div>

      </div>
    </div>
  );
}
