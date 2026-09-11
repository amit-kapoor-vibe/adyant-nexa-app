"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Package, Sparkles, CheckCircle2 } from "lucide-react";
import { Heading } from "@/components/ui/Heading";

export default function ToolsHubPage() {
  const tools = [
    {
      title: "D2C Readiness Diagnostic",
      tag: "COMPOSITE 7-STAGE AUDIT",
      badge: "MOST POPULAR",
      description: "Comprehensive 4-minute evaluation of your business model, gross margins, inventory ageing, repeat retention, and marketing efficiency.",
      href: "/assessment",
      icon: Sparkles,
      time: "4 mins",
      accent: true,
    },
    {
      title: "Dead Stock & Capital Lock Calculator",
      tag: "INVENTORY INTELLIGENCE",
      badge: "INSTANT TOOL",
      description: "Diagnose the exact working capital trapped in product inventory older than 90–120 days along with annual carrying cost leakage.",
      href: "/tools/dead-stock",
      icon: Package,
      time: "1 min",
      accent: false,
    },
    {
      title: "Profit Opportunity & Leakage Calculator",
      tag: "MARGIN RECOVERY MODEL",
      badge: "INSTANT TOOL",
      description: "Interactively adjust your monthly revenue, gross margin, inventory value, discounting rate, and repeat buyer percentage to model annual upside.",
      href: "/tools/profit-opportunity",
      icon: BarChart3,
      time: "1 min",
      accent: false,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "#E5E5E5", paddingTop: "7rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "12px" }}>
            BUSINESS INTELLIGENCE &bull; DIAGNOSTIC TOOLS
          </span>
          <Heading level="h1" style={{ textAlign: "center", marginBottom: "16px" }}>
            AdyantNexa Growth Tools
          </Heading>
          <p style={{ color: "rgba(229,229,229,0.75)", fontSize: "1rem", maxWidth: "620px", margin: "0 auto", lineHeight: 1.6 }}>
            Free standalone commercial intelligence calculators to evaluate profit leakage, inventory capital lock, and D2C scalability before investing growth capital.
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
                  border: tool.accent ? "1px solid rgba(0,242,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: tool.accent ? "0 0 30px rgba(0,242,255,0.08)" : "none",
                  position: "relative",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700, letterSpacing: "0.1em" }}>
                      {tool.tag}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: tool.accent ? "#00F2FF" : "rgba(255,255,255,0.5)", backgroundColor: tool.accent ? "rgba(0,242,255,0.12)" : "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "9999px", fontWeight: 600 }}>
                      {tool.badge} &bull; {tool.time}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(0,242,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon style={{ width: "20px", height: "20px", color: "#00F2FF" }} />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.3 }}>
                      {tool.title}
                    </h3>
                  </div>

                  <p style={{ color: "rgba(229,229,229,0.7)", fontSize: "0.9rem", lineHeight: 1.55, marginBottom: "2rem" }}>
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
        <div style={{ backgroundColor: "#080808", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "2.5rem", marginBottom: "4rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <span className="editorial-tag" style={{ display: "block", marginBottom: "8px" }}>WHY DIAGNOSE FIRST?</span>
              <Heading level="h2" style={{ marginBottom: "12px" }}>
                Commercial Reality Over Guesswork
              </Heading>
              <p style={{ color: "rgba(229,229,229,0.7)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                Most brands fail at D2C not because their product is flawed, but because their unit economics, gross margins, and inventory cycles cannot support digital customer acquisition costs. Our tools expose profit leakages before you burn marketing capital.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <CheckCircle2 size={18} color="#00F2FF" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "0.88rem", color: "#E5E5E5", lineHeight: 1.4 }}>
                  <strong>Zero Obligation:</strong> Completely self-service diagnostic without upfront consultation fees.
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <CheckCircle2 size={18} color="#00F2FF" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "0.88rem", color: "#E5E5E5", lineHeight: 1.4 }}>
                  <strong>Actionable Output:</strong> Instant financial projections and estimated annual recovery opportunities.
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <CheckCircle2 size={18} color="#00F2FF" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "0.88rem", color: "#E5E5E5", lineHeight: 1.4 }}>
                  <strong>90-Day Execution Blueprint:</strong> Option to generate a structured 3-phase growth roadmap for your team.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div style={{ backgroundColor: "#080808", border: "1px solid rgba(0,242,255,0.25)", borderRadius: "24px", padding: "2.5rem 1.5rem", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
            Ready for a Comprehensive Store Evaluation?
          </h2>
          <p style={{ color: "#A3A3A3", fontSize: "0.92rem", maxWidth: "520px", margin: "0 auto 1.5rem", lineHeight: 1.5 }}>
            Run the 7-step commercial readiness diagnostic to assess product readiness, channel viability, and capital efficiency.
          </p>
          <Link href="/assessment" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 2rem", textDecoration: "none" }}>
            Start D2C Readiness Diagnostic <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
