"use client";

import React from "react";
import Link from "next/link";
import { ClipboardCheck, Cpu, PieChart, FileCheck, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "#E5E5E5", paddingTop: "7rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Minimal Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="editorial-tag">DIAGNOSTIC METHODOLOGY</span>
          <h1 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 800, marginTop: "0.5rem", color: "#FFFFFF", letterSpacing: "-0.03em" }}>
            How Adyant Nexa Works
          </h1>
          <p style={{ color: "#A3A3A3", fontSize: "1rem", maxWidth: "560px", margin: "0.75rem auto 0", lineHeight: 1.6 }}>
            No black-box guesses. We evaluate your store metrics against standardized retail benchmarks to pinpoint exact profit leakages in 4 simple steps.
          </p>
        </div>

        {/* 4 Minimalist Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "3.5rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "16px", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "rgba(0,242,255,0.08)", border: "1px solid rgba(0,242,255,0.2)", color: "#00F2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ClipboardCheck size={20} />
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>STEP 01</span>
              <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginTop: "0.2rem", marginBottom: "0.3rem" }}>
                Submit Store Diagnostic Data
              </h3>
              <p style={{ color: "#A3A3A3", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>
                Answer 7 simple operational questions on monthly sales, inventory valuation, dead stock %, and discount rates in 4 minutes.
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "16px", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "rgba(0,242,255,0.08)", border: "1px solid rgba(0,242,255,0.2)", color: "#00F2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Cpu size={20} />
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>STEP 02</span>
              <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginTop: "0.2rem", marginBottom: "0.3rem" }}>
                Benchmark Evaluation Engine
              </h3>
              <p style={{ color: "#A3A3A3", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>
                Our engine compares your numbers against validated Indian fashion retail benchmarks to compute your Growth Score (0–100).
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "16px", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "rgba(0,242,255,0.08)", border: "1px solid rgba(0,242,255,0.2)", color: "#00F2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <PieChart size={20} />
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>STEP 03</span>
              <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginTop: "0.2rem", marginBottom: "0.3rem" }}>
                Instant Opportunity Breakdown
              </h3>
              <p style={{ color: "#A3A3A3", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>
                Instantly view your estimated annual profit opportunity in ₹ along with prioritized recovery actions for inventory and margins.
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "16px", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "rgba(0,242,255,0.08)", border: "1px solid rgba(0,242,255,0.2)", color: "#00F2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileCheck size={20} />
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>STEP 04</span>
              <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginTop: "0.2rem", marginBottom: "0.3rem" }}>
                Optional 90-Day Blueprint Execution
              </h3>
              <p style={{ color: "#A3A3A3", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>
                Request a 1-on-1 advisory review and receive your personalized 90-Day Execution Blueprint via WhatsApp &amp; PDF email.
              </p>
            </div>
          </div>
        </div>

        {/* Minimalist CTA */}
        <div style={{ textAlign: "center" }}>
          <Link href="/assessment" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 2rem" }}>
            Start Free Growth Assessment <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
