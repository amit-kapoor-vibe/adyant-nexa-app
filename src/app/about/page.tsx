"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers, ShieldCheck, Zap, TrendingUp, Store, Cpu } from "lucide-react";
import { Heading } from "@/components/ui/Heading";

export default function AboutPage() {
  const pillars = [
    {
      num: "01",
      title: "Unit Economics Over Vanity Traffic",
      desc: "Topline GMV without contribution margin is a trap. We engineer commerce engines that prioritize cash flow, gross margin retention, and repeat lifetime value.",
      icon: TrendingUp,
    },
    {
      num: "02",
      title: "Inventory Is Working Capital",
      desc: "Stock sitting past 90 days isn't just an operational nuisance; it is trapped cash. We build predictive markdown and replenishment cycles that keep liquidity high.",
      icon: Store,
    },
    {
      num: "03",
      title: "Connected Architecture Outlasts Ad Hacks",
      desc: "Media buying tricks and ad hacks decay every quarter. Durable brands scale on clean data infrastructure, high-converting digital storefronts, and automated retention.",
      icon: Cpu,
    },
    {
      num: "04",
      title: "Radical Commercial Transparency",
      desc: "If your margins or repeat dynamics cannot support D2C digital acquisition, we tell you directly before you waste capital. We build win-win partnerships.",
      icon: ShieldCheck,
    },
  ];

  const milestones = [
    {
      period: "15+ Years Retail Grounding",
      title: "Physical Retail & Visual Merchandising Mastery",
      desc: "Deep operational background across tier-1 retail brands (including Zara, Puma, Aldo, Promod, Jaypore). Real-world understanding of store economics, inventory turnaround, visual appeal, and retail customer behaviour.",
    },
    {
      period: "Digital Engineering Era",
      title: "Full-Stack Architecture & Conversion Systems",
      desc: "Mastery of modern serverless infrastructure, Next.js commerce stacks, data attribution models, and conversion rate optimization (CRO) tailored for consumer brands.",
    },
    {
      period: "The AdyantNexa Standard",
      title: "The Consumer Growth & Commerce Engine",
      desc: "Bridging the gap between exceptional product creators and scalable digital commerce. Building complete revenue machines from product positioning to profitable scale.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "var(--text-color)", paddingTop: "7rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "12px" }}>
            ABOUT ADYANTNEXA &bull; OUR STORY &amp; PHILOSOPHY
          </span>
          <Heading level="h1" style={{ textAlign: "center", marginBottom: "16px" }}>
            We Understand Both Sides of the <br />
            <span style={{ color: "var(--accent-color)" }}>Commerce Equation</span>
          </Heading>
          <p style={{ color: "var(--muted-text)", fontSize: "1.05rem", maxWidth: "680px", margin: "0 auto", lineHeight: 1.65 }}>
            Most agencies know Facebook ads but don't understand inventory turns. Most retail consultants understand retail stores but can't build high-performance software. We bridge both worlds.
          </p>
        </div>

        {/* Narrative Section */}
        <div style={{ backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px -2px rgba(10, 10, 12, 0.04)", borderRadius: "24px", padding: "3rem 2.5rem", marginBottom: "4rem" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: "12px" }}>OUR ORIGIN</span>
            <Heading level="h2" style={{ marginBottom: "20px" }}>
              Built from Real Retail Floors, Not Theory
            </Heading>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", color: "var(--muted-text)", fontSize: "0.95rem", lineHeight: 1.75 }}>
              <p>
                AdyantNexa was founded on a simple observation: India and global markets are full of manufacturers, designers, and retail founders who create extraordinary products—yet struggle to build scalable, profitable D2C businesses around them.
              </p>
              <p>
                The standard agency model treats every brand like a media-buying problem. They run ads on fragile margins, ignore dead stock, burn cash on vanity metrics, and leave founders disillusioned.
              </p>
              <p>
                We operate differently. Our foundation comes from over 15 years of ground-level retail, merchandising, and store operations experience combined with enterprise-grade software engineering. We evaluate products with a merchant's discipline and scale them with an engineer's precision.
              </p>
            </div>
          </div>
        </div>

        {/* Operating Pillars */}
        <div style={{ marginBottom: "4.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: "10px" }}>OUR PRINCIPLES</span>
            <Heading level="h2" style={{ textAlign: "center" }}>
              How We Think &amp; Operate
            </Heading>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.num} className="glass-panel" style={{ borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700 }}>
                        {item.num}
                      </span>
                      <Icon size={20} color="#0047FF" />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-color)", marginBottom: "0.75rem", lineHeight: 1.3 }}>
                      {item.title}
                    </h3>
                    <p style={{ color: "var(--muted-text)", fontSize: "0.88rem", lineHeight: 1.55, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Evolution */}
        <div style={{ backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px -2px rgba(10, 10, 12, 0.04)", borderRadius: "24px", padding: "3rem 2rem", marginBottom: "4.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: "10px" }}>THE FOUNDATION</span>
            <Heading level="h2" style={{ textAlign: "center" }}>
              Evolution of Our Growth System
            </Heading>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "750px", margin: "0 auto" }}>
            {milestones.map((m, idx) => (
              <div key={idx} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "rgba(0,71,255,0.08)", border: "1px solid var(--accent-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.8rem", fontWeight: 700, flexShrink: 0, marginTop: "4px" }}>
                  0{idx + 1}
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 600, letterSpacing: "0.1em" }}>
                    {m.period}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-color)", margin: "4px 0 8px" }}>
                    {m.title}
                  </h3>
                  <p style={{ color: "var(--muted-text)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <div style={{ backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", borderRadius: "24px", padding: "3rem 1.5rem", textAlign: "center", boxShadow: "0 10px 30px rgba(0,71,255,0.06)" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "10px" }}>LET&apos;S WORK TOGETHER</span>
          <Heading level="h2" style={{ textAlign: "center", marginBottom: "12px" }}>
            You Have the Product. We Build the Business.
          </Heading>
          <p style={{ color: "var(--muted-text)", fontSize: "0.95rem", maxWidth: "540px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
            Evaluate your store readiness with our 4-minute commercial assessment or speak directly with our senior growth advisory team.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/assessment" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 2rem", textDecoration: "none" }}>
              Check D2C Readiness <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 2rem", textDecoration: "none" }}>
              Contact Advisory Team
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
