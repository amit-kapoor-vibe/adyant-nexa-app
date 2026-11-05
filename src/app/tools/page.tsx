"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Package, Sparkles, CheckCircle2 } from "lucide-react";
import { Heading } from "@/components/ui/Heading";

export default function ToolsHubPage() {
  const tools = [
    {
      title: "Autonomous Boutique Audit",
      tag: "COMPOSITE 7-STAGE EVALUATION",
      badge: "MOST POPULAR",
      description: "Comprehensive 4-minute evaluation of inquiry response velocity, conversational checkout friction, showroom-to-online stock sync, and VIP retention economics.",
      href: "/assessment",
      icon: Sparkles,
      time: "4 mins",
      accent: true,
    },
    {
      title: "Boutique Dead Stock & Capital Lock Calculator",
      tag: "SHOWROOM INVENTORY INTELLIGENCE",
      badge: "INSTANT TOOL",
      description: "Calculate working capital trapped in off-season collections and archived inventory (>90 days old) alongside annual showroom carrying drag.",
      href: "/tools/dead-stock",
      icon: Package,
      time: "1 min",
      accent: false,
    },
    {
      title: "Omnichannel Profit & Conversational Leakage Calculator",
      tag: "MARGIN RECOVERY MODEL",
      badge: "INSTANT TOOL",
      description: "Interactively model monthly boutique revenue, VIP repeat purchase rates, markdown impact, and revenue lost to delayed DM responses across AED and GBP bands.",
      href: "/tools/profit-opportunity",
      icon: BarChart3,
      time: "1 min",
      accent: false,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "var(--text-color)", paddingTop: "7rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "12px" }}>
            AUTONOMOUS RETAIL INTELLIGENCE // DIAGNOSTIC ENGINES
          </span>
          <Heading level="h1" style={{ textAlign: "center", marginBottom: "16px" }}>
            Boutique Commercial Diagnostic Tools
          </Heading>
          <p style={{ color: "var(--muted-text)", fontSize: "1rem", maxWidth: "660px", margin: "0 auto", lineHeight: 1.6 }}>
            Free diagnostic models engineered for luxury boutiques and fashion houses in Dubai and London to audit conversational response speed, dead showroom stock, and omnichannel profit recovery.
          </p>
        </div>

        {/* Tools Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.title}
                className="glass-panel"
                style={{
                  borderRadius: "20px",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: tool.accent ? "1px solid rgba(0,71,255,0.3)" : "1px solid var(--border-color)",
                  boxShadow: tool.accent ? "0 10px 30px rgba(0,71,255,0.08)" : "0 4px 20px -2px rgba(10,10,12,0.04)",
                  position: "relative",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700, letterSpacing: "0.1em" }}>
                      {tool.tag}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: tool.accent ? "var(--accent-color)" : "var(--muted-text)", backgroundColor: tool.accent ? "rgba(0,71,255,0.08)" : "rgba(10,10,12,0.04)", padding: "2px 8px", borderRadius: "9999px", fontWeight: 600 }}>
                      {tool.badge} &bull; {tool.time}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(0,71,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon style={{ width: "20px", height: "20px", color: "var(--accent-color)" }} />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-color)", margin: 0, lineHeight: 1.3 }}>
                      {tool.title}
                    </h3>
                  </div>

                  <p style={{ color: "var(--muted-text)", fontSize: "0.9rem", lineHeight: 1.55, marginBottom: "2rem" }}>
                    {tool.description}
                  </p>
                </div>

                <Link
                  href={tool.href}
                  className={tool.accent ? "btn-primary" : "btn-secondary"}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", textDecoration: "none" }}
                >
                  {tool.accent ? "Launch Diagnostic" : "Open Calculator"} <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Value Proposition Box */}
        <div style={{ backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", borderRadius: "24px", padding: "2.5rem", marginBottom: "4rem", boxShadow: "0 4px 20px -2px rgba(10,10,12,0.04)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <span className="editorial-tag" style={{ display: "block", marginBottom: "8px" }}>WHY DIAGNOSE FIRST?</span>
              <Heading level="h2" style={{ marginBottom: "12px" }}>
                Commercial Reality Over Guesswork
              </Heading>
              <p style={{ color: "var(--muted-text)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                Luxury client acquisition collapses when inquiry response latency exceeds 5 minutes or showroom-to-online inventory mismatches trigger order cancellations. Our diagnostic models identify exact friction points and revenue leaks across Dubai and London before you deploy automation.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <CheckCircle2 size={18} color="#00F2FF" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "0.88rem", color: "var(--text-color)", lineHeight: 1.4 }}>
                  <strong>Zero Obligation:</strong> Completely self-service boutique diagnostic without upfront advisory fees.
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <CheckCircle2 size={18} color="#00F2FF" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "0.88rem", color: "var(--text-color)", lineHeight: 1.4 }}>
                  <strong>Actionable Output:</strong> Multi-currency projections in AED and GBP with estimated annual recoverable revenue.
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <CheckCircle2 size={18} color="#00F2FF" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "0.88rem", color: "var(--text-color)", lineHeight: 1.4 }}>
                  <strong>14-Day Deployment Blueprint:</strong> Actionable integration roadmap tailored for DIFC, D3, Mayfair, and Soho labels.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div style={{ backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", borderRadius: "24px", padding: "2.5rem 1.5rem", textAlign: "center", boxShadow: "0 10px 30px rgba(0,242,255,0.06)" }}>
          <h2 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-color)", marginBottom: "0.5rem" }}>
            Ready for a Complete Boutique Evaluation?
          </h2>
          <p style={{ color: "var(--muted-text)", fontSize: "0.92rem", maxWidth: "560px", margin: "0 auto 1.5rem", lineHeight: 1.5 }}>
            Run the 7-step autonomous readiness diagnostic to evaluate conversational response speed, stock synchronization, and VIP retention economics.
          </p>
          <Link href="/assessment" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 2rem", textDecoration: "none" }}>
            Start Autonomous Boutique Audit <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
