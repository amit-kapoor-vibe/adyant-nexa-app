"use client";

import React, { useState } from "react";
import Link from "next/link";
import { calculateMarginOpportunity, calculateInventoryOpportunity, calculateRetentionOpportunity } from "@/lib/engine";
import { ArrowRight, ArrowLeft, BarChart3, Info } from "lucide-react";
import { Heading } from "@/components/ui/Heading";

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
    <div style={{ minHeight: "100vh", background: "transparent", color: "#E5E5E5", paddingTop: "6.5rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Breadcrumb / Back */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link href="/tools" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--accent-color)", textDecoration: "none", fontSize: "0.82rem", fontFamily: "var(--font-geist-mono), monospace" }}>
            <ArrowLeft size={14} /> ALL GROWTH TOOLS
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "10px" }}>
            SELF-SERVICE MODEL &bull; PROFIT OPPORTUNITY
          </span>
          <Heading level="h1" style={{ textAlign: "center", marginBottom: "12px" }}>
            Profit Opportunity &amp; Leakage Calculator
          </Heading>
          <p style={{ color: "rgba(229,229,229,0.75)", fontSize: "0.95rem", maxWidth: "620px", margin: "0 auto", lineHeight: 1.5 }}>
            Adjust your store parameters below to calculate estimated annual revenue and margin recovery across discounting, repeat buyer retention, and inventory velocity.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "2rem", marginBottom: "2.5rem" }} className="grid-cols-1 md:grid-cols-2">
          {/* Controls */}
          <div style={{ backgroundColor: "#080808", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.35rem" }}>
            <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 0.5rem" }}>
              Commercial Input Parameters
            </h3>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <label style={{ fontSize: "0.82rem", color: "#A3A3A3" }}>Average Monthly Revenue</label>
                <span style={{ color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>₹{(monthlyRevenue).toLocaleString("en-IN")}</span>
              </div>
              <input type="range" min="100000" max="5000000" step="50000" value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#00F2FF" }} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <label style={{ fontSize: "0.82rem", color: "#A3A3A3" }}>Inventory Valuation at Cost</label>
                <span style={{ color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>₹{(inventoryValue).toLocaleString("en-IN")}</span>
              </div>
              <input type="range" min="200000" max="10000000" step="100000" value={inventoryValue} onChange={(e) => setInventoryValue(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#00F2FF" }} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <label style={{ fontSize: "0.82rem", color: "#A3A3A3" }}>Slow / Dead Stock Percentage (&gt; 90d)</label>
                <span style={{ color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>{deadStockPct}%</span>
              </div>
              <input type="range" min="5" max="50" value={deadStockPct} onChange={(e) => setDeadStockPct(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#00F2FF" }} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <label style={{ fontSize: "0.82rem", color: "#A3A3A3" }}>Average Overall Discount Given</label>
                <span style={{ color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>{discountPct}%</span>
              </div>
              <input type="range" min="0" max="40" value={discountPct} onChange={(e) => setDiscountPct(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#00F2FF" }} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <label style={{ fontSize: "0.82rem", color: "#A3A3A3" }}>Repeat Customer Rate</label>
                <span style={{ color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>{repeatPct}%</span>
              </div>
              <input type="range" min="5" max="60" value={repeatPct} onChange={(e) => setRepeatPct(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#00F2FF" }} />
            </div>
          </div>

          {/* Results Output */}
          <div style={{ backgroundColor: "#080808", border: "1px solid rgba(0,242,255,0.3)", borderRadius: "24px", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 0 35px rgba(0,242,255,0.06)" }}>
            <div>
              <span style={{ fontSize: "0.78rem", color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 600, letterSpacing: "0.15em" }}>
                TOTAL ESTIMATED ANNUAL OPPORTUNITY
              </span>
              <div style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 800, color: "#FFFFFF", marginTop: "0.5rem", marginBottom: "1.25rem" }}>
                ₹{totalOpportunity.toLocaleString("en-IN")}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.88rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.6rem" }}>
                  <span style={{ color: "#A3A3A3" }}>Inventory Dead Stock Capital:</span>
                  <strong style={{ color: "#00F2FF" }}>₹{invOpp.estimatedAnnualOpportunity.toLocaleString("en-IN")}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.6rem" }}>
                  <span style={{ color: "#A3A3A3" }}>Discount Margin Erosion:</span>
                  <strong style={{ color: "#00F2FF" }}>₹{marginOpp.estimatedAnnualOpportunity.toLocaleString("en-IN")}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.6rem" }}>
                  <span style={{ color: "#A3A3A3" }}>Customer Repeat Gap:</span>
                  <strong style={{ color: "#00F2FF" }}>₹{retOpp.estimatedAnnualOpportunity.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Link href="/assessment" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", textDecoration: "none" }}>
                Run Full 7-Step Diagnostic <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
