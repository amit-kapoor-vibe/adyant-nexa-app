"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers, ShieldCheck, Zap, TrendingUp, Building2, Cpu, Calendar, MessageSquare } from "lucide-react";
import { Heading } from "@/components/ui/Heading";

export default function AboutPage() {
  const pillars = [
    {
      num: "01",
      title: "0% Midnight Lead Loss",
      desc: "78% of overseas Dubai property inquiries from London, Riyadh, Europe, and Asia arrive between 11 PM and 5 AM UAE time while brokers are asleep. Adyant Nexa engages in 1.2 seconds, ensuring zero dropoff.",
      icon: Zap,
    },
    {
      num: "02",
      title: "Sub-90-Second BANT Qualification",
      desc: "Instant verification of buyer budget (AED 2M+ Golden Visa vs entry investor), purchase timeline, payment plan preference (cash vs 1% monthly), and property preference in fluent Arabic, English, or Urdu.",
      icon: TrendingUp,
    },
    {
      num: "03",
      title: "Calendar Sync & Viewing Conversion",
      desc: "Window-shoppers are filtered out while high-intent buyers are booked directly into senior brokers' Google Meet and private viewing schedules with full dossier briefs.",
      icon: Calendar,
    },
    {
      num: "04",
      title: "Radical Privacy & Agency Ownership",
      desc: "Your investor contacts, chat transcripts, and developer listings remain 100% exclusive to your brokerage. We deploy private infrastructure, not shared marketplaces.",
      icon: ShieldCheck,
    },
  ];

  const milestones = [
    {
      period: "The Brokerage Dilemma",
      title: "The Midnight Lead Attrition Crisis",
      desc: "Dubai agencies spend $10k to $80k per month on Meta and Google ads. Yet over 65% of international leads wait more than 6 hours for a broker reply, collapsing qualification rates by 391%.",
    },
    {
      period: "Engineering Era",
      title: "Autonomous Multi-Agent Architecture",
      desc: "We engineered a specialized real estate neural system combining Gemini 2.0 Flash reasoning, WhatsApp Baileys infrastructure, and real-time human broker takeover cockpits.",
    },
    {
      period: "The Nexa Standard",
      title: "Autonomous Sales OS for Top Brokerages",
      desc: "Today Adyant Nexa powers leading Dubai real estate agencies, turning midnight digital ad traffic into pre-qualified private viewings and compounding broker commissions.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8F8FA", color: "#0A0A0C", paddingTop: "7rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "12px", color: "#0047FF", letterSpacing: "0.2em", fontSize: "10px" }}>
            ABOUT ADYANT NEXA · DUBAI &amp; INDIA CORE
          </span>
          <Heading level="h1" style={{ textAlign: "center", marginBottom: "16px", color: "#0A0A0C" }}>
            Qualifying High-Ticket Property Buyers <br />
            <span style={{ color: "#0047FF" }}>While Your Brokers Sleep</span>
          </Heading>
          <p style={{ color: "#60606A", fontSize: "1.05rem", maxWidth: "680px", margin: "0 auto", lineHeight: 1.65 }}>
            Most marketing agencies sell vanity ad clicks without understanding Dubai brokerage operations. Adyant Nexa builds 24/7 autonomous sales infrastructure that qualifies budgets, checks Golden Visa eligibility, and books viewings automatically.
          </p>
        </div>

        {/* Narrative Section */}
        <div style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.08)", boxShadow: "0 4px 20px -2px rgba(10, 10, 12, 0.04)", borderRadius: "20px", padding: "3rem 2.5rem", marginBottom: "4rem" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: "12px", color: "#0047FF" }}>OUR MISSION</span>
            <Heading level="h2" style={{ marginBottom: "20px", color: "#0A0A0C" }}>
              Built for Dubai Real Estate Principals, Not Generic Tech
            </Heading>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", color: "#60606A", fontSize: "0.95rem", lineHeight: 1.75 }}>
              <p>
                Dubai real estate is the most lucrative and fastest-moving property market on earth. Hundreds of millions of dirhams in off-plan and luxury secondary transactions close every quarter. Yet brokerage owners consistently face the same bleeding bottleneck: <strong>lead response latency.</strong>
              </p>
              <p>
                An investor in London or Riyadh inquires on a Meta ad at 1:30 AM UAE time. By the time a broker wakes up at 9:00 AM, that investor has already contacted three other agencies or gone cold.
              </p>
              <p>
                Adyant Nexa was built to permanently eliminate this leakage. Operating across Dubai and India Core, our engineers deploy autonomous conversational engines that engage in 1.2 seconds, verify AED 2M+ budgets, check Golden Visa requirements, and schedule private viewings directly into your top brokers' calendars.
              </p>
            </div>
          </div>
        </div>

        {/* Operating Pillars */}
        <div style={{ marginBottom: "4.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: "10px", color: "#0047FF" }}>OPERATING STANDARDS</span>
            <Heading level="h2" style={{ textAlign: "center", color: "#0A0A0C" }}>
              How We Power Brokerage Growth
            </Heading>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.num} style={{ background: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.08)", borderRadius: "16px", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 16px rgba(0, 0, 0, 0.02)" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                      <span style={{ fontSize: "0.85rem", color: "#0047FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>
                        {item.num}
                      </span>
                      <Icon size={20} color="#0047FF" />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "#0A0A0C", marginBottom: "0.75rem", lineHeight: 1.3 }}>
                      {item.title}
                    </h3>
                    <p style={{ color: "#60606A", fontSize: "0.88rem", lineHeight: 1.55, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Evolution */}
        <div style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.08)", boxShadow: "0 4px 20px -2px rgba(10, 10, 12, 0.04)", borderRadius: "20px", padding: "3rem 2rem", marginBottom: "4.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: "10px", color: "#0047FF" }}>THE FOUNDATION</span>
            <Heading level="h2" style={{ textAlign: "center", color: "#0A0A0C" }}>
              Evolution of the Nexa OS
            </Heading>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "750px", margin: "0 auto" }}>
            {milestones.map((m, idx) => (
              <div key={idx} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "rgba(0, 71, 255, 0.08)", border: "1px solid #0047FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#0047FF", fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.8rem", fontWeight: 700, flexShrink: 0, marginTop: "4px" }}>
                  0{idx + 1}
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#0047FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 600, letterSpacing: "0.1em" }}>
                    {m.period}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#0A0A0C", margin: "4px 0 8px" }}>
                    {m.title}
                  </h3>
                  <p style={{ color: "#60606A", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <div style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.08)", borderRadius: "20px", padding: "3rem 1.5rem", textAlign: "center", boxShadow: "0 10px 30px rgba(0, 71, 255, 0.06)" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "10px", color: "#0047FF" }}>DEPLOYMENT READY</span>
          <Heading level="h2" style={{ textAlign: "center", marginBottom: "12px", color: "#0A0A0C" }}>
            Ready to Eliminate Midnight Lead Loss?
          </Heading>
          <p style={{ color: "#60606A", fontSize: "0.95rem", maxWidth: "540px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
            Test our autonomous broker cockpit in real time or schedule a 15-minute Google Meet walkthrough with our founding engineering team.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/terminal" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 2rem", textDecoration: "none", background: "#0047FF", color: "#FFFFFF", borderRadius: "999px", fontWeight: 700, fontSize: "13px" }}>
              Test Live Demo Terminal <ArrowRight size={16} />
            </Link>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 2rem", textDecoration: "none", background: "transparent", border: "1px solid rgba(10, 10, 12, 0.18)", color: "#0A0A0C", borderRadius: "999px", fontWeight: 600, fontSize: "13px" }}>
              Schedule Strategy Call
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
