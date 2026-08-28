"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Package, BarChart3, IndianRupee, Users } from "lucide-react";

export default function FashionRetailSolutionPage() {
  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "#E5E5E5", paddingTop: "7rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Minimal Hero */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="editorial-tag">FASHION &amp; APPAREL RETAIL DIAGNOSTIC</span>
          <h1 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 800, marginTop: "0.5rem", color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Find Where Your Fashion Store Is Losing Money
          </h1>
          <p style={{ color: "#A3A3A3", fontSize: "1.05rem", maxWidth: "620px", margin: "1rem auto 2rem", lineHeight: 1.6 }}>
            Designed for Indian fashion, ethnic wear, and apparel store owners (₹2Cr–₹50Cr revenue). Identify dead stock locks, margin discounting erosion, and customer churn.
          </p>

          <Link href="/assessment" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.9rem 2rem", fontSize: "0.95rem" }}>
            Start Free Assessment <ArrowRight style={{ width: "16px", height: "16px" }} />
          </Link>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "4rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "16px" }}>
            <Package style={{ width: "28px", height: "28px", color: "#00F2FF", marginBottom: "0.75rem" }} />
            <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.4rem" }}>
              1. Dead Stock Recovery
            </h3>
            <p style={{ color: "#A3A3A3", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>
              Calculate working capital locked in inventory older than 90–120 days.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "16px" }}>
            <BarChart3 style={{ width: "28px", height: "28px", color: "#00F2FF", marginBottom: "0.75rem" }} />
            <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.4rem" }}>
              2. Margin Protection
            </h3>
            <p style={{ color: "#A3A3A3", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>
              Stop end-of-season sales from eroding net profitability before full-price sales finish.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "16px" }}>
            <Users style={{ width: "28px", height: "28px", color: "#00F2FF", marginBottom: "0.75rem" }} />
            <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.4rem" }}>
              3. Repeat Buyer Engine
            </h3>
            <p style={{ color: "#A3A3A3", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>
              Lift repeat customer rates to 35%+ without increasing external ad spend.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "16px" }}>
            <IndianRupee style={{ width: "28px", height: "28px", color: "#00F2FF", marginBottom: "0.75rem" }} />
            <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.4rem" }}>
              4. Marketing CAC Efficiency
            </h3>
            <p style={{ color: "#A3A3A3", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>
              Audit unoptimized local ad spend and store footfall conversion rates.
            </p>
          </div>
        </div>

        {/* Minimal CTA Banner */}
        <div style={{ backgroundColor: "#080808", border: "1px solid rgba(0,242,255,0.25)", borderRadius: "20px", padding: "2.5rem 1.5rem", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.65rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
            Ready to Diagnostic Your Fashion Business?
          </h2>
          <p style={{ color: "#A3A3A3", fontSize: "0.9rem", maxWidth: "520px", margin: "0 auto 1.5rem" }}>
            Takes under 4 minutes. Get your estimated Growth Score (0–100) and annual profit opportunity instantly.
          </p>
          <Link href="/assessment" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 1.75rem" }}>
            Start Free Assessment <ArrowRight style={{ width: "16px", height: "16px" }} />
          </Link>
        </div>

      </div>
    </div>
  );
}
