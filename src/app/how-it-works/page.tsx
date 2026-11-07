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
  Calendar,
  Radio,
  Building2,
  PhoneCall
} from "lucide-react";
import { Heading } from "@/components/ui/Heading";

export default function HowItWorksPage() {
  const stages = [
    {
      step: "01",
      title: "CONNECT & SYNC",
      subtitle: "WhatsApp Business API & Meta Ads CAPI",
      desc: "Within 48 hours, we connect Adyant Nexa directly to your agency's official WhatsApp Business number and Meta advertising account with zero downtime.",
      items: [
        "Official WhatsApp Business Cloud integration",
        "Meta Pixel & Server-Side Conversions API (CAPI)",
        "Zero disruption to your brokers' existing chats",
        "Instant webhook routing to our 24/7 autonomous engine",
      ],
      icon: Zap,
    },
    {
      step: "02",
      title: "INGEST & TRAIN",
      subtitle: "Developer Project Catalogs & Off-Plan Rules",
      desc: "We train your custom agency intelligence model on your active developer inventory (Emaar, Sobha, DAMAC, Nakheel), payment plans, and luxury towers.",
      items: [
        "Off-plan projects, starting prices, and 1% payment plans",
        "Secondary ready luxury inventory and prime areas",
        "UAE 10-Year Golden Visa criteria (AED 2M+ threshold)",
        "Agency commission rules and senior broker specialties",
      ],
      icon: Building2,
    },
    {
      step: "03",
      title: "QUALIFY IN 90s",
      subtitle: "Autonomous Multilingual BANT Verification",
      desc: "When an ad lead inquires at 2:00 AM, our AI engages in 1.2 seconds in fluent Arabic, English, or Urdu—verifying budget, intent, and timeline.",
      items: [
        "1.2-second midnight response latency",
        "Budget qualification (AED 2M+ vs entry cash buyers)",
        "Timeline verification (Immediate, 30 days, or off-plan)",
        "Filtering out window-shoppers and unqualified numbers",
      ],
      icon: Target,
    },
    {
      step: "04",
      title: "CONVERT & BOOK",
      subtitle: "Calendar Synchronization & 1-Click Takeover",
      desc: "Pre-qualified leads are directly booked into your senior brokers' Google Meet or private viewing schedules with a full buyer dossier dispatched on WhatsApp.",
      items: [
        "Automated Google Meet & on-site viewing calendar booking",
        "Comprehensive buyer qualification dossier sent to broker",
        "Instant 1-click human broker takeover whenever needed",
        "Telegram instant alerts sent to agency principals",
      ],
      icon: Calendar,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8F8FA", color: "#0A0A0C", paddingTop: "7rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "12px", color: "#0047FF", letterSpacing: "0.2em", fontSize: "10px" }}>
            HOW IT WORKS · 4-STAGE AUTONOMOUS DEPLOYMENT
          </span>
          <Heading level="h1" style={{ textAlign: "center", marginBottom: "16px", color: "#0A0A0C" }}>
            From Midnight Meta Ad Inquiries <br />
            <span style={{ color: "#0047FF" }}>To Scheduled Property Viewings</span>
          </Heading>
          <p style={{ color: "#60606A", fontSize: "1.05rem", maxWidth: "680px", margin: "0 auto", lineHeight: 1.65 }}>
            Here is the exact 4-stage infrastructure Adyant Nexa deploys for Dubai real estate brokerages to eliminate lead dropoff and scale monthly transaction volume.
          </p>
        </div>

        {/* 4-Stage Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", marginBottom: "4.5rem" }}>
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div 
                key={stage.step} 
                style={{ 
                  background: "#FFFFFF", 
                  border: "1px solid rgba(10, 10, 12, 0.08)", 
                  borderRadius: "20px", 
                  padding: "2.5rem 3rem", 
                  boxShadow: "0 4px 20px -2px rgba(10, 10, 12, 0.04)",
                  display: "grid",
                  gridTemplateColumns: "100px 1fr",
                  gap: "2rem",
                  alignItems: "start"
                }}
              >
                <div>
                  <span style={{ fontSize: "1.8rem", fontFamily: "var(--font-syne)", fontWeight: 800, color: "#0047FF", display: "block" }}>
                    {stage.step}
                  </span>
                  <div style={{ marginTop: "12px", width: "42px", height: "42px", borderRadius: "10px", background: "rgba(0, 71, 255, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={20} color="#0047FF" />
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "11px", fontFamily: "var(--font-geist-mono)", color: "#0047FF", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
                    {stage.subtitle}
                  </span>
                  <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "1.5rem", fontWeight: 800, color: "#0A0A0C", margin: "4px 0 12px" }}>
                    {stage.title}
                  </h2>
                  <p style={{ color: "#60606A", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1.5rem", maxWidth: "750px" }}>
                    {stage.desc}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px" }}>
                    {stage.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#0A0A0C" }}>
                        <CheckCircle2 size={15} color="#10B981" style={{ flexShrink: 0 }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Operating Cockpit Callout */}
        <div style={{ background: "#0A0A0C", borderRadius: "20px", padding: "3rem", color: "#FFFFFF", marginBottom: "4.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem" }}>
          <div style={{ maxWidth: "600px" }}>
            <span style={{ fontSize: "10px", fontFamily: "var(--font-geist-mono)", color: "#00F2FF", letterSpacing: "0.2em", fontWeight: 700 }}>
              HUMAN OPERATOR SUPERVISION
            </span>
            <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "1.8rem", marginTop: "8px" }}>
              Brokers Can Take Over in 1 Click
            </h3>
            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)", marginTop: "10px", lineHeight: 1.6 }}>
              AI does not replace your top closers—it feeds them pre-qualified buyers. With our live operator cockpit, your senior agents can monitor every conversation live and take over seamlessly at any point.
            </p>
          </div>
          <Link 
            href="/terminal" 
            style={{ 
              padding: "14px 28px", 
              background: "#0047FF", 
              color: "#FFFFFF", 
              borderRadius: "999px", 
              fontFamily: "var(--font-geist-mono)", 
              fontSize: "12px", 
              fontWeight: 700, 
              textDecoration: "none", 
              letterSpacing: "0.08em",
              whiteSpace: "nowrap"
            }}
          >
            TEST DEMO COCKPIT ↗
          </Link>
        </div>

        {/* Bottom CTA */}
        <div style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.08)", borderRadius: "20px", padding: "3rem 1.5rem", textAlign: "center", boxShadow: "0 10px 30px rgba(0, 71, 255, 0.06)" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "10px", color: "#0047FF" }}>48-HOUR DEPLOYMENT</span>
          <Heading level="h2" style={{ textAlign: "center", marginBottom: "12px", color: "#0A0A0C" }}>
            Deploy Autonomous Sales for Your Brokerage
          </Heading>
          <p style={{ color: "#60606A", fontSize: "0.95rem", maxWidth: "540px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
            Schedule a 15-minute Google Meet walkthrough to see how Adyant Nexa integrates with your agency's lead flow.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <a 
              href="https://wa.me/?text=Hi%2C%20I%20am%20a%20Dubai%20Real%20Estate%20Agency%20Principal.%20I%20want%20to%20see%20the%20Nexa%20AI%20Sales%20Engine%20demo."
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 2rem", textDecoration: "none", background: "#0047FF", color: "#FFFFFF", borderRadius: "999px", fontWeight: 700, fontSize: "13px" }}
            >
              Connect On WhatsApp ↗
            </a>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 2rem", textDecoration: "none", background: "transparent", border: "1px solid rgba(10, 10, 12, 0.18)", color: "#0A0A0C", borderRadius: "999px", fontWeight: 600, fontSize: "13px" }}>
              Schedule Strategy Call
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
