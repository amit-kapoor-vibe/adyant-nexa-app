"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Package } from "lucide-react";

export default function ToolsHubPage() {
  const tools = [
    {
      title: "Profit Opportunity & Leakage Calculator",
      tag: "SELF-SERVICE CALCULATOR",
      description: "Interactively adjust your store revenue, inventory valuation, dead stock %, and discounting to calculate your estimated annual profit opportunity.",
      href: "/tools/profit-opportunity",
      icon: BarChart3,
    },
    {
      title: "Dead Stock & Capital Lock Calculator",
      tag: "INVENTORY INTELLIGENCE",
      description: "Diagnose exact working capital trapped in apparel inventory older than 90–120 days along with annual carrying cost leakage.",
      href: "/tools/dead-stock",
      icon: Package,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "#E5E5E5", paddingTop: "7rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Minimal Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="editorial-tag">DIAGNOSTIC TOOLS HUB</span>
          <h1 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 800, marginTop: "0.5rem", color: "#FFFFFF", letterSpacing: "-0.03em" }}>
            Retail Profit Calculators
          </h1>
          <p style={{ color: "#A3A3A3", fontSize: "1rem", maxWidth: "540px", margin: "0.75rem auto 0" }}>
            Free standalone calculators to evaluate store profit leakage and inventory capital locks.
          </p>
        </div>

        {/* Tools Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
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
                  justify: "space-between",
                }}
              >
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 600 }}>
                    {tool.tag}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem", marginBottom: "0.75rem" }}>
                    <Icon style={{ width: "24px", height: "24px", color: "#00F2FF", flexShrink: 0 }} />
                    <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                      {tool.title}
                    </h3>
                  </div>
                  <p style={{ color: "#A3A3A3", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                    {tool.description}
                  </p>
                </div>

                <Link
                  href={tool.href}
                  className="btn-secondary"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%" }}
                >
                  Open Calculator <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div style={{ backgroundColor: "#080808", border: "1px solid rgba(0,242,255,0.25)", borderRadius: "20px", padding: "2.5rem 1.5rem", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
            Want a Complete Store Diagnostic?
          </h2>
          <p style={{ color: "#A3A3A3", fontSize: "0.9rem", maxWidth: "480px", margin: "0 auto 1.5rem" }}>
            Run the 4-minute composite assessment to evaluate all 4 domain pillars together.
          </p>
          <Link href="/assessment" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.75rem" }}>
            Start Full Free Assessment <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
