"use client";

import React, { useState } from "react";
import Link from "next/link";
import { calculateMarginOpportunity, calculateInventoryOpportunity, calculateRetentionOpportunity } from "@/lib/engine";
import { ArrowRight, IndianRupee } from "lucide-react";

export default function ProfitOpportunityCalculatorPage() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(500000);
  const [inventoryValue, setInventoryValue] = useState(1500000);
  const [deadStockPct, setDeadStockPct] = useState(25);
  const [discountPct, setDiscountPct] = useState(20);
  const [repeatPct, setRepeatPct] = useState(20);

  const inputs = {
    monthlyRevenue,
    inventoryValue,
    slowDeadStockPercentage: deadStockPct,
    avgDiscountPercentage: discountPct,
    repeatPurchasePercentage: repeatPct,
    grossMarginPercentage: 50,
  };

  const invOpp = calculateInventoryOpportunity(inputs);
  const marginOpp = calculateMarginOpportunity(inputs);
  const retOpp = calculateRetentionOpportunity(inputs);

  const totalOpportunity =
    invOpp.estimatedAnnualOpportunity +
    marginOpp.estimatedAnnualOpportunity +
    retOpp.estimatedAnnualOpportunity;

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "#E5E5E5", paddingTop: "7rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="editorial-tag">SELF-SERVICE TOOL &bull; PROFIT OPPORTUNITY</span>
          <h1 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "2.25rem", fontWeight: 800, marginTop: "0.5rem", color: "#FFFFFF" }}>
            Profit Opportunity &amp; Leakage Calculator
          </h1>
          <p style={{ color: "#A3A3A3", fontSize: "0.95rem" }}>Adjust your retail numbers below to calculate estimated annual profit recovery.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="grid-cols-1 md:grid-cols-2">
          {/* Controls */}
          <div style={{ backgroundColor: "#080808", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                Monthly Revenue (₹): ₹{(monthlyRevenue).toLocaleString("en-IN")}
              </label>
              <input type="range" min="100000" max="5000000" step="50000" value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#00F2FF" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                Inventory Valuation (₹): ₹{(inventoryValue).toLocaleString("en-IN")}
              </label>
              <input type="range" min="200000" max="10000000" step="100000" value={inventoryValue} onChange={(e) => setInventoryValue(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#00F2FF" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                Slow/Dead Stock (%): {deadStockPct}%
              </label>
              <input type="range" min="5" max="50" value={deadStockPct} onChange={(e) => setDeadStockPct(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#00F2FF" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                Average Discount Given (%): {discountPct}%
              </label>
              <input type="range" min="0" max="40" value={discountPct} onChange={(e) => setDiscountPct(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#00F2FF" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                Repeat Buyer Rate (%): {repeatPct}%
              </label>
              <input type="range" min="5" max="60" value={repeatPct} onChange={(e) => setRepeatPct(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#00F2FF" }} />
            </div>
          </div>

          {/* Results Output */}
          <div style={{ backgroundColor: "#080808", border: "1px solid rgba(0,242,255,0.3)", borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "0.8rem", color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 600 }}>ESTIMATED ANNUAL OPPORTUNITY</span>
              <h2 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "2.75rem", fontWeight: 800, color: "#FFFFFF", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
                ₹{totalOpportunity.toLocaleString("en-IN")}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.5rem" }}>
                  <span style={{ color: "#A3A3A3" }}>Inventory Dead Stock:</span>
                  <strong style={{ color: "#00F2FF" }}>₹{invOpp.estimatedAnnualOpportunity.toLocaleString("en-IN")}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.5rem" }}>
                  <span style={{ color: "#A3A3A3" }}>Discount Margin Erosion:</span>
                  <strong style={{ color: "#00F2FF" }}>₹{marginOpp.estimatedAnnualOpportunity.toLocaleString("en-IN")}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.5rem" }}>
                  <span style={{ color: "#A3A3A3" }}>Customer Repeat Gap:</span>
                  <strong style={{ color: "#00F2FF" }}>₹{retOpp.estimatedAnnualOpportunity.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Link href="/assessment" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%" }}>
                Run Full 7-Step Diagnostic <ArrowRight style={{ width: "16px", height: "16px" }} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
