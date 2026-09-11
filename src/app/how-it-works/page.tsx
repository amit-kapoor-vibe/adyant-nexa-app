"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  Target,
  Layers,
  Zap,
  BarChart3,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Heading } from "@/components/ui/Heading";

export default function HowItWorksPage() {
  const stages = [
    {
      step: "01",
      title: "UNDERSTAND",
      subtitle: "Product, Margins, Customers & Economics",
      desc: "We analyze your core product advantages, manufacturing capacities, gross margins, inventory turnover cycles, and existing distribution channels to uncover the real commercial baseline.",
      items: [
        "Product craft & competitive advantage",
        "Unit economics & contribution margin limits",
        "Current inventory volume & carrying cost",
        "Target consumer persona & market dynamics",
      ],
      icon: Compass,
    },
    {
      step: "02",
      title: "STRATEGISE",
      subtitle: "Positioning, Offer Design & GTM Roadmap",
      desc: "We engineer a defensible market position, design high-converting hero SKU bundles, structure pricing bands for ad profitability, and lay out an actionable go-to-market plan.",
      items: [
        "Category positioning & narrative architecture",
        "Hero SKU selection & bundling strategy",
        "Pricing structure & discounting controls",
        "Go-to-market roadmap & launch timeline",
      ],
      icon: Target,
    },
    {
      step: "03",
      title: "BUILD",
      subtitle: "Brand Direction, Commerce & Tracking Stack",
      desc: "We establish your digital storefront, custom high-converting product pages, server-side tracking (Meta CAPI & Google Analytics 4), and direct-response creative frameworks.",
      items: [
        "High-performance mobile-first ecommerce store",
        "Conversion-optimized product detail pages (PDPs)",
        "Server-side analytics, pixel & CAPI integration",
        "Direct-response visual brand asset system",
      ],
      icon: Layers,
    },
    {
      step: "04",
      title: "LAUNCH",
      subtitle: "Multi-Angle Acquisition & Creative Testing",
      desc: "We deploy high-volume video creatives, creator UGC, and multi-campaign structures across Meta and Google to validate audience demand and establish baseline conversion economics.",
      items: [
        "Paid social acquisition (Meta Instagram & Facebook)",
        "Search & Shopping intent capture (Google Ads / PMax)",
        "Creator & influencer content seeding",
        "Systematic creative hook & angle testing",
      ],
      icon: Zap,
    },
    {
      step: "05",
      title: "OPTIMISE",
      subtitle: "CAC, AOV, Contribution Margin & Retention",
      desc: "We relentlessly optimize every step of the funnel—reducing customer acquisition cost, boosting average order values, and activating automated retention loops via WhatsApp and email.",
      items: [
        "Conversion rate optimization (CRO) on storefront",
        "Average Order Value (AOV) bump & upsell flows",
        "Contribution margin & Blended ROAS tracking",
        "WhatsApp & Email lifecycle retention automation",
      ],
      icon: BarChart3,
    },
    {
      step: "06",
      title: "SCALE",
      subtitle: "Capital Allocation & Multi-Channel Expansion",
      desc: "Once unit economics prove that every rupee deployed generates predictable gross profit, we increase capital behind winning channels, hero products, and recurring customer flywheels.",
      items: [
        "Aggressive scaling of winning ad angles & SKUs",
        "New product line expansion based on customer data",
        "Omnichannel synergy (D2C + Retail + Marketplaces)",
        "Compounding repeat customer lifetime value (LTV)",
      ],
      icon: TrendingUp,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        color: "#E5E5E5",
        paddingTop: "7.5rem",
        paddingBottom: "5rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* ─── HEADER ─── */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "16px" }}>
            OPERATIONAL FRAMEWORK
          </span>
          <Heading level="h1" style={{ textAlign: "center", marginBottom: "20px" }}>
            HOW WE BUILD YOUR <br />
            <span style={{ color: "var(--accent-color)" }}>GROWTH ENGINE.</span>
          </Heading>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              color: "rgba(229,229,229,0.75)",
              fontSize: "1.05rem",
              maxWidth: "680px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            We don't sell random marketing tactics. We build a connected commercial growth system—from product economics and brand positioning to scalable acquisition and customer retention.
          </p>
        </div>

        {/* ─── 6 STAGES ARCHITECTURE ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "4.5rem" }}>
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className="glass-panel"
                style={{
                  padding: "clamp(24px, 3.5vw, 36px)",
                  borderRadius: "20px",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "24px",
                  alignItems: "flex-start",
                }}
              >
                {/* Step Badge */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      backgroundColor: "rgba(0, 242, 255, 0.08)",
                      border: "1px solid rgba(0, 242, 255, 0.25)",
                      color: "#00F2FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--accent-color)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    STAGE {stage.step}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <div style={{ marginBottom: "12px" }}>
                    <h2
                      style={{
                        fontFamily: "var(--font-syne)",
                        fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
                        fontWeight: 800,
                        color: "#FFFFFF",
                        letterSpacing: "-0.02em",
                        margin: 0,
                      }}
                    >
                      {stage.title}
                    </h2>
                    <span
                      style={{
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: "12px",
                        color: "var(--accent-color)",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        display: "block",
                        marginTop: "4px",
                      }}
                    >
                      {stage.subtitle}
                    </span>
                  </div>

                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      color: "rgba(229,229,229,0.7)",
                      fontSize: "14px",
                      lineHeight: 1.7,
                      marginBottom: "18px",
                    }}
                  >
                    {stage.desc}
                  </p>

                  {/* Bullet points */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "10px",
                      paddingTop: "14px",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {stage.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontFamily: "var(--font-inter)",
                          fontSize: "13px",
                          color: "#A3A3A3",
                        }}
                      >
                        <CheckCircle2 size={14} color="#00F2FF" style={{ flexShrink: 0 }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── THE PARTNERSHIP PRINCIPLE ─── */}
        <div
          className="glass-panel"
          style={{
            padding: " clamp(28px, 4vw, 44px)",
            borderRadius: "24px",
            border: "1px solid rgba(0,242,255,0.25)",
            marginBottom: "4.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <ShieldCheck size={24} color="#00F2FF" />
            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF" }}>
              HOW WE PARTNER WITH YOU
            </h3>
          </div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--muted-text)", lineHeight: 1.8, marginBottom: "20px" }}>
            We do not operate as an outsourced agency that dumps vanity impressions on a slide deck. We function as your strategic growth partner—aligning our work directly with your net contribution margin, inventory velocity, and long-term brand equity.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div style={{ background: "rgba(0,0,0,0.4)", padding: "16px 20px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "#00F2FF", display: "block", marginBottom: "4px" }}>ZERO FLUFF</span>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#E5E5E5", margin: 0 }}>
                Direct focus on commercial reality: CAC, AOV, Contribution Margin and Repeat LTV.
              </p>
            </div>
            <div style={{ background: "rgba(0,0,0,0.4)", padding: "16px 20px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "#00F2FF", display: "block", marginBottom: "4px" }}>PARALLEL ENGINE</span>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#E5E5E5", margin: 0 }}>
                Keep your manufacturing and wholesale running while building the consumer arm.
              </p>
            </div>
            <div style={{ background: "rgba(0,0,0,0.4)", padding: "16px 20px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "#00F2FF", display: "block", marginBottom: "4px" }}>DATA OWNERSHIP</span>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#E5E5E5", margin: 0 }}>
                You own 100% of the customer relationship, data, accounts, and creative assets.
              </p>
            </div>
          </div>
        </div>

        {/* ─── CALL TO ACTION ─── */}
        <div style={{ textAlign: "center" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "16px" }}>
            READY TO START?
          </span>
          <Heading level="h2" style={{ textAlign: "center", marginBottom: "20px" }}>
            EVALUATE YOUR D2C READINESS.
          </Heading>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--muted-text)", marginBottom: "32px", maxWidth: "540px", margin: "0 auto 32px" }}>
            Take our free 4-minute diagnostic to evaluate if your product, margins, and operational capacity are ready for direct-to-consumer scaling.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
            <Link
              href="/assessment"
              className="btn-primary"
              style={{
                borderRadius: "9999px",
                padding: "16px 36px",
                fontSize: "13px",
                fontWeight: 700,
                boxShadow: "0 0 35px rgba(0,242,255,0.22)",
              }}
            >
              Check Your D2C Readiness <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="btn-secondary"
              style={{
                borderRadius: "9999px",
                padding: "16px 28px",
                fontSize: "13px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Start A Conversation
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

