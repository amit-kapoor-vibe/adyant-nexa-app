"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  BarChart3,
  Zap,
  Target,
  Compass,
  Building2,
  Shirt,
  Sparkle,
  Footprints,
  Rocket,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Heading } from "@/components/ui/Heading";

export default function AdyantNexaHomepage() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    (window as any).lenis = lenis;

    const raf = (t: number) => {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div style={{ background: "transparent", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <main style={{ position: "relative", zIndex: 10 }}>
        
        {/* ─── 1. HERO SECTION ─── */}
        <section style={{ paddingTop: "clamp(7rem, 13vw, 10rem)", paddingBottom: "clamp(4rem, 8vw, 6rem)", paddingLeft: "1.5rem", paddingRight: "1.5rem", position: "relative" }}>
          <div style={{ maxWidth: "1040px", margin: "0 auto", textAlign: "center" }}>
            
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="editorial-tag"
              style={{
                fontSize: "11px",
                letterSpacing: "0.35em",
                color: "var(--accent-color)",
                display: "inline-block",
                marginBottom: "24px",
              }}
            >
              CONSUMER GROWTH &amp; COMMERCE
            </motion.span>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ marginBottom: "28px" }}
            >
              <Heading
                level="h1"
                style={{
                  textAlign: "center",
                  margin: "0 auto",
                  maxWidth: "960px",
                  lineHeight: 1.08,
                }}
              >
                <span style={{ display: "block", fontSize: "clamp(2rem, 4.2vw, 3.4rem)", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.025em", marginBottom: "8px" }}>
                  YOU HAVE THE PRODUCT.
                </span>
                <span 
                  className="glitch-text glitch-shimmer" 
                  data-text="WE BUILD THE BUSINESS AROUND IT."
                  style={{ 
                    display: "block", 
                    fontSize: "clamp(2rem, 4.2vw, 3.4rem)", 
                    fontWeight: 800, 
                    color: "var(--accent-color)", 
                    letterSpacing: "-0.025em",
                  }}
                >
                  WE BUILD THE BUSINESS AROUND IT.
                </span>
              </Heading>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(15px, 1.8vw, 18px)",
                color: "rgba(229,229,229,0.75)",
                lineHeight: 1.7,
                maxWidth: "720px",
                margin: "0 auto 36px",
              }}
            >
              AdyantNexa helps product businesses build, launch and grow consumer brands — combining strategy, commerce, creative, customer acquisition and retention into one unified growth system.
            </motion.p>

            {/* CTA Hierarchy: Primary = Check D2C Readiness, Secondary = Explore Growth System */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ display: "flex", gap: "16px", justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: "28px" }}
            >
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
                href="#growth-system"
                className="btn-secondary"
                style={{
                  borderRadius: "9999px",
                  padding: "16px 28px",
                  fontSize: "13px",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                Explore The Growth System
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--muted-text)", letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              Built from hands-on experience across retail, fashion, startups and performance marketing.
            </motion.p>
          </div>
        </section>

        {/* ─── 2. THE PROBLEM SECTION ─── */}
        <section style={{ padding: "clamp(4.5rem, 8vw, 6.5rem) 1.5rem", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(2,2,2,0.85)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: "16px" }}>
                THE CORE BOTTLENECK
              </span>
              <Heading level="h2" style={{ textAlign: "center", marginBottom: "20px" }}>
                YOU KNOW HOW TO MAKE THE PRODUCT. <br />
                <span style={{ color: "var(--accent-color)" }}>BUT WHO OWNS THE CUSTOMER?</span>
              </Heading>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "16px", color: "var(--muted-text)", lineHeight: 1.7, maxWidth: "680px", margin: "0 auto" }}>
                Product businesses can spend decades perfecting manufacturing, sourcing and supply chain — while the customer relationship, margin and brand equity belong to middlemen.
              </p>
            </div>

            {/* Traditional Chain vs Brand Ownership */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", marginBottom: "40px" }}>
              
              {/* Old Traditional Wholesale Model */}
              <div className="glass-panel" style={{ padding: "28px 32px", borderRadius: "16px" }}>
                <span className="editorial-tag" style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "12px" }}>
                  TRADITIONAL DISTRIBUTION (VOLUME WITHOUT OWNERSHIP)
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontFamily: "var(--font-geist-mono)", fontSize: "13px", color: "#A3A3A3" }}>
                  <span style={{ color: "#FFFFFF", fontWeight: 600 }}>Product</span>
                  <span>&rarr;</span>
                  <span>Wholesale</span>
                  <span>&rarr;</span>
                  <span>Distributor</span>
                  <span>&rarr;</span>
                  <span>Retailer</span>
                  <span>&rarr;</span>
                  <span style={{ color: "var(--accent-color)", fontWeight: 600 }}>Customer</span>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--muted-text)", marginTop: "14px", margin: "14px 0 0" }}>
                  Wholesale creates production volume, but leaves your business vulnerable to price pressure, payment delays, and zero direct consumer access.
                </p>
              </div>

              {/* The 3 Pillars of Ownership */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
                <div className="glass-panel" style={{ padding: "28px", borderRadius: "16px", border: "1px solid rgba(0,242,255,0.2)" }}>
                  <span className="editorial-tag" style={{ fontSize: "10px", color: "var(--accent-color)", display: "block", marginBottom: "8px" }}>PILLAR 01</span>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                    OWN THE BRAND.
                  </h3>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--muted-text)", lineHeight: 1.6, margin: 0 }}>
                    Command higher pricing power and defensible positioning in the consumer's mind.
                  </p>
                </div>

                <div className="glass-panel" style={{ padding: "28px", borderRadius: "16px", border: "1px solid rgba(0,242,255,0.2)" }}>
                  <span className="editorial-tag" style={{ fontSize: "10px", color: "var(--accent-color)", display: "block", marginBottom: "8px" }}>PILLAR 02</span>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                    OWN THE CUSTOMER.
                  </h3>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--muted-text)", lineHeight: 1.6, margin: 0 }}>
                    Build direct consumer demand that no distributor or retail channel can turn off.
                  </p>
                </div>

                <div className="glass-panel" style={{ padding: "28px", borderRadius: "16px", border: "1px solid rgba(0,242,255,0.2)" }}>
                  <span className="editorial-tag" style={{ fontSize: "10px", color: "var(--accent-color)", display: "block", marginBottom: "8px" }}>PILLAR 03</span>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                    OWN THE DATA.
                  </h3>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--muted-text)", lineHeight: 1.6, margin: 0 }}>
                    Leverage purchasing habits, retention loops, and feedback to compound repeat revenue.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ─── 3. THE MISSING LAYER SECTION ─── */}
        <section style={{ padding: "clamp(4.5rem, 8vw, 6.5rem) 1.5rem", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(8,8,8,0.6)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: "16px" }}>
                THE STRATEGIC GAP
              </span>
              <Heading level="h2" style={{ textAlign: "center" }}>
                YOUR PRODUCT ISN'T THE PROBLEM. <br />
                <span style={{ color: "var(--accent-color)" }}>THE MISSING LAYER IS THE CONSUMER BUSINESS.</span>
              </Heading>
            </div>

            {/* 2-Column Comparison */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px", marginBottom: "40px" }}>
              
              {/* Left Column: What You Already Have */}
              <div className="glass-panel" style={{ padding: "36px", borderRadius: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <ShieldCheck size={22} color="#00F2FF" />
                  <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF" }}>
                    WHAT YOU MAY ALREADY HAVE
                  </h3>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontFamily: "var(--font-inter)", fontSize: "14px", color: "#A3A3A3" }}>
                  {[
                    "Proven product quality & craft",
                    "Manufacturing & factory capacity",
                    "Deep supply chain & raw material access",
                    "Existing inventory & working capital",
                    "Decades of industry domain knowledge",
                    "B2B / wholesale distribution networks",
                    "Production & fulfillment capabilities",
                  ].map((item, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.4)" }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: What May Be Missing */}
              <div className="glass-panel" style={{ padding: "36px", borderRadius: "20px", border: "1px solid rgba(0,242,255,0.3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <Layers size={22} color="#00F2FF" />
                  <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.25rem", fontWeight: 700, color: "var(--accent-color)" }}>
                    WHAT MAY BE MISSING
                  </h3>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontFamily: "var(--font-inter)", fontSize: "14px", color: "#E5E5E5" }}>
                  {[
                    "Defensible brand positioning & narrative",
                    "D2C go-to-market offer architecture",
                    "High-converting ecommerce infrastructure",
                    "High-volume creative & content engine",
                    "Paid acquisition channels (Meta & Google)",
                    "Customer conversion & CRO systems",
                    "Customer data ownership & retention loops",
                    "Growth intelligence & unit economic metrics",
                  ].map((item, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <CheckCircle2 size={16} color="#00F2FF" style={{ flexShrink: 0 }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Bottom Insight Callout */}
            <div style={{ textAlign: "center", padding: "20px 24px", background: "rgba(0,242,255,0.04)", border: "1px solid rgba(0,242,255,0.15)", borderRadius: "12px" }}>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "#E5E5E5", margin: 0, lineHeight: 1.6 }}>
                <strong>That's where AdyantNexa comes in.</strong> We don't ask you to abandon your current business model. We help you build a profitable consumer growth engine beside it.
              </p>
            </div>

          </div>
        </section>

        {/* ─── 4. OUR GROWTH SYSTEM SECTION ─── */}
        <section id="growth-system" style={{ padding: "clamp(4.5rem, 8vw, 6.5rem) 1.5rem", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(2,2,2,0.85)" }}>
          <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
            
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: "16px" }}>
                END-TO-END METHODOLOGY
              </span>
              <Heading level="h2" style={{ textAlign: "center", marginBottom: "16px" }}>
                FROM PRODUCT TO CONSUMER BRAND.
              </Heading>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--muted-text)", maxWidth: "600px", margin: "0 auto" }}>
                A systematic 6-stage framework engineered to take product capabilities into profitable, scalable consumer commerce.
              </p>
            </div>

            {/* 6 Steps Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "48px" }}>
              
              {[
                {
                  step: "01",
                  title: "DIAGNOSE",
                  desc: "Understand your product strengths, unit economics, target audience, market dynamics and current growth constraints.",
                  icon: Compass,
                },
                {
                  step: "02",
                  title: "STRATEGISE",
                  desc: "Engineer market positioning, SKU architecture, pricing bands, irresistible offers and go-to-market roadmaps.",
                  icon: Target,
                },
                {
                  step: "03",
                  title: "BUILD",
                  desc: "Establish brand direction, high-speed digital storefront, conversion funnels, server-side tracking and analytics.",
                  icon: Layers,
                },
                {
                  step: "04",
                  title: "LAUNCH",
                  desc: "Deploy multi-hook creative assets, Meta and Google acquisition engines, creator seeding and rapid test campaigns.",
                  icon: Zap,
                },
                {
                  step: "05",
                  title: "OPTIMISE",
                  desc: "Relentlessly refine CAC, AOV, CVR, contribution margin, blended ROAS, marketing efficiency ratio (MER) and retention.",
                  icon: BarChart3,
                },
                {
                  step: "06",
                  title: "SCALE",
                  desc: "Aggressively allocate capital into verified winning channels, hero products and proven offers that maximize net profit.",
                  icon: TrendingUp,
                },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.step} className="glass-panel" style={{ padding: "32px", borderRadius: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <span className="editorial-tag" style={{ fontSize: "13px", color: "var(--accent-color)" }}>
                        {item.step}
                      </span>
                      <IconComponent size={20} color="#00F2FF" style={{ opacity: 0.8 }} />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "10px" }}>
                      {item.title}
                    </h3>
                    <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted-text)", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}

            </div>

            <div style={{ textAlign: "center" }}>
              <Link href="/assessment" className="btn-primary" style={{ borderRadius: "9999px", padding: "16px 36px", fontSize: "13px", fontWeight: 700 }}>
                Evaluate Your Growth Potential <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        </section>

        {/* ─── 5. WHAT WE DO SECTION ─── */}
        <section id="what-we-do" style={{ padding: "clamp(4.5rem, 8vw, 6.5rem) 1.5rem", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(8,8,8,0.7)" }}>
          <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
            
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: "16px" }}>
                GROWTH SYSTEM ARCHITECTURE
              </span>
              <Heading level="h2" style={{ textAlign: "center", marginBottom: "20px" }}>
                WE DON'T SELL MARKETING. <br />
                <span style={{ color: "var(--accent-color)" }}>WE BUILD GROWTH SYSTEMS.</span>
              </Heading>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--muted-text)", lineHeight: 1.7, maxWidth: "680px", margin: "0 auto 24px" }}>
                <p style={{ margin: "0 0 8px" }}>A website isn't a business. Ads aren't a business. Social media isn't a business.</p>
                <p style={{ margin: 0, color: "#FFFFFF", fontWeight: 500 }}>They are components of a single connected growth system:</p>
              </div>

              {/* Formula Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "9999px", background: "rgba(0,242,255,0.06)", border: "1px solid rgba(0,242,255,0.25)", fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "#00F2FF", flexWrap: "wrap", justifyContent: "center" }}>
                <span>PRODUCT</span>
                <span>&rarr;</span>
                <span>BRAND</span>
                <span>&rarr;</span>
                <span>CUSTOMER</span>
                <span>&rarr;</span>
                <span>REVENUE</span>
                <span>&rarr;</span>
                <span>REPEAT</span>
              </div>
            </div>

            {/* 6 Capabilities Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              
              {[
                {
                  category: "Strategy",
                  items: ["Market research & competitive intelligence", "Brand positioning & value proposition", "Product mix & SKU strategy", "Pricing bands & unit economic modeling", "Offer design & bundles", "Go-to-market roadmap"],
                },
                {
                  category: "Brand & Commerce",
                  items: ["Brand identity & visual direction", "Next-gen ecommerce storefronts", "High-converting product detail pages", "Conversion rate optimization (CRO)", "Server-side tracking & Meta CAPI", "Full-funnel analytics dashboards"],
                },
                {
                  category: "Creative Engine",
                  items: ["Direct-response content strategy", "High-conversion product shoots", "UGC & creator curation", "High-volume short-form video / Reels", "Ad creative angle ideation", "Systematic creative fatigue testing"],
                },
                {
                  category: "Customer Acquisition",
                  items: ["Meta Ads (Instagram & Facebook)", "Google Ads (Search, Shopping, PMax)", "Full-funnel retargeting infrastructure", "Influencer & creator acquisition", "Campaign budget optimization (CBO)", "Audience scaling frameworks"],
                },
                {
                  category: "Retention & LTV",
                  items: ["WhatsApp automated commerce flows", "Email lifecycle campaigns & newsletters", "Customer segmentation & CRM setup", "Dynamic winback & replenishment triggers", "VIP loyalty programs", "Repeat purchase acceleration"],
                },
                {
                  category: "Growth Intelligence",
                  items: ["Customer Acquisition Cost (CAC)", "Average Order Value (AOV)", "Conversion Rate (CVR)", "Contribution Margin per order", "Return on Ad Spend (ROAS)", "Marketing Efficiency Ratio (MER)"],
                },
              ].map((group, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: "30px", borderRadius: "18px" }}>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-color)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#00F2FF" }} />
                    {group.category}
                  </h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontFamily: "var(--font-inter)", fontSize: "13px", color: "#A3A3A3" }}>
                    {group.items.map((item, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <span style={{ color: "rgba(0,242,255,0.6)", fontSize: "12px", lineHeight: "18px" }}>&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

            </div>

          </div>
        </section>

        {/* ─── 6. WHO WE WORK WITH SECTION ─── */}
        <section id="who-we-work-with" style={{ padding: "clamp(4.5rem, 8vw, 6.5rem) 1.5rem", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(2,2,2,0.85)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: "16px" }}>
                PARTNER PROFILES
              </span>
              <Heading level="h2" style={{ textAlign: "center", marginBottom: "16px" }}>
                BUILT FOR PRODUCT-LED BUSINESSES.
              </Heading>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--muted-text)", maxWidth: "640px", margin: "0 auto" }}>
                We partner with businesses that have real product and operational capabilities and want to build lasting consumer relationships.
              </p>
            </div>

            {/* 4 Focused Categories */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
              
              <div className="glass-panel" style={{ padding: "30px", borderRadius: "16px" }}>
                <Shirt size={28} color="#00F2FF" style={{ marginBottom: "16px" }} />
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                  Fashion &amp; Apparel
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted-text)", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                  Manufacturers, retailers, exporters, and emerging brands building direct consumer channels.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: "30px", borderRadius: "16px" }}>
                <Sparkle size={28} color="#00F2FF" style={{ marginBottom: "16px" }} />
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                  Beauty &amp; Lifestyle
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted-text)", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                  Product businesses with strong repeat potential creating organic consumer demand.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: "30px", borderRadius: "16px" }}>
                <Footprints size={28} color="#00F2FF" style={{ marginBottom: "16px" }} />
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                  Footwear &amp; Accessories
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted-text)", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                  Category manufacturers moving closer to the consumer to capture retail margins.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: "30px", borderRadius: "16px" }}>
                <Rocket size={28} color="#00F2FF" style={{ marginBottom: "16px" }} />
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                  Emerging Consumer Brands
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted-text)", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                  Founders building scalable product businesses with positive unit economics.
                </p>
              </div>

            </div>

            <div style={{ textAlign: "center" }}>
              <span className="editorial-tag" style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>
                Our deepest initial execution depth is in fashion, retail and consumer product lines.
              </span>
            </div>

          </div>
        </section>

        {/* ─── 7. FOUNDER ADVANTAGE SECTION ─── */}
        <section style={{ padding: "clamp(4.5rem, 8vw, 6.5rem) 1.5rem", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(8,8,8,0.7)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: "16px" }}>
                FOUNDATIONAL EXPERIENCE
              </span>
              <Heading level="h2" style={{ textAlign: "center", marginBottom: "16px" }}>
                RETAIL TAUGHT US THE CUSTOMER. <br />
                <span style={{ color: "var(--accent-color)" }}>STARTUPS TAUGHT US SPEED.</span>
              </Heading>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--muted-text)", maxWidth: "680px", margin: "0 auto" }}>
                We combine the disciplined merchandising principles of premier physical retail with the rapid iteration and quantitative precision of high-growth digital startups.
              </p>
            </div>

            {/* 2-Card Experience Breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px", marginBottom: "32px" }}>
              
              <div className="glass-panel" style={{ padding: "36px", borderRadius: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <Building2 size={22} color="#00F2FF" />
                  <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF" }}>
                    RETAIL &amp; MERCHANDISING GROUNDING
                  </h3>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "var(--muted-text)", lineHeight: 1.7, marginBottom: "20px" }}>
                  Foundational operational background across top-tier retail environments and multi-brand formats, understanding visual merchandising, inventory turnover, SKU depth and in-store customer psychology:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {["Zara", "Puma", "Aldo", "Promod", "Jaypore", "Rosso Brunello", "Iconic MBOs"].map((brand) => (
                    <span key={brand} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "#E5E5E5" }}>
                      {brand}
                    </span>
                  ))}
                </div>
                <span style={{ display: "block", marginTop: "16px", fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
                  * Founder operational &amp; retail management background
                </span>
              </div>

              <div className="glass-panel" style={{ padding: "36px", borderRadius: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <Zap size={22} color="#00F2FF" />
                  <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF" }}>
                    STARTUP SPEED &amp; PERFORMANCE
                  </h3>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "var(--muted-text)", lineHeight: 1.7, marginBottom: "20px" }}>
                  Fast-paced startup execution focusing on measurable direct-response acquisition, rapid creative feedback loops and digital conversion systems:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {[
                    "Meta & Google Ads",
                    "Direct Response Copy",
                    "Creative Testing Loops",
                    "Product Shoots & UGC",
                    "Fashion Event Marketing",
                    "Conversion Rate Optimization",
                    "Unit Economics Modeling",
                  ].map((skill) => (
                    <span key={skill} style={{ padding: "6px 12px", background: "rgba(0,242,255,0.05)", border: "1px solid rgba(0,242,255,0.18)", borderRadius: "6px", fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "#00F2FF" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            <div style={{ textAlign: "center", padding: "16px 20px" }}>
              <span className="editorial-tag" style={{ fontSize: "11px", color: "var(--accent-color)" }}>
                Retail understanding + startup execution + performance marketing.
              </span>
            </div>

          </div>
        </section>

        {/* ─── 8. CASE STUDY SECTION ─── */}
        <section style={{ padding: "clamp(4.5rem, 8vw, 6.5rem) 1.5rem", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(2,2,2,0.85)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: "16px" }}>
                CASE STUDY IN PROGRESS
              </span>
              <Heading level="h2" style={{ textAlign: "center" }}>
                TEMPTATION THREAD: <br />
                <span style={{ color: "var(--accent-color)" }}>FROM APPAREL MANUFACTURING TO D2C.</span>
              </Heading>
            </div>

            <div className="glass-panel" style={{ padding: "clamp(28px, 4vw, 48px)", borderRadius: "24px", border: "1px solid rgba(0,242,255,0.2)" }}>
              
              <div style={{ marginBottom: "28px" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "16px", color: "#E5E5E5", lineHeight: 1.8, marginBottom: "16px" }}>
                  Temptation Thread represents the exact transformation AdyantNexa is built to enable: taking established apparel manufacturing capabilities and building a consumer-facing brand and acquisition system around them.
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "var(--muted-text)", lineHeight: 1.7 }}>
                  Rather than relying solely on third-party orders or wholesale intermediaries, we are building a dedicated direct-to-consumer revenue engine.
                </p>
              </div>

              {/* Transformation Architecture Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                
                <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                  <span className="editorial-tag" style={{ fontSize: "9px", color: "var(--accent-color)" }}>01 POSITIONING</span>
                  <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", marginTop: "6px", marginBottom: "6px" }}>
                    Brand Architecture
                  </h4>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "var(--muted-text)", margin: 0 }}>
                    Crafting defensible D2C positioning, aesthetic identity and core product narrative.
                  </p>
                </div>

                <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                  <span className="editorial-tag" style={{ fontSize: "9px", color: "var(--accent-color)" }}>02 COMMERCE</span>
                  <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", marginTop: "6px", marginBottom: "6px" }}>
                    Storefront &amp; Tracking
                  </h4>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "var(--muted-text)", margin: 0 }}>
                    High-speed digital store optimized for mobile checkout and server-side tracking.
                  </p>
                </div>

                <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                  <span className="editorial-tag" style={{ fontSize: "9px", color: "var(--accent-color)" }}>03 CREATIVE</span>
                  <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", marginTop: "6px", marginBottom: "6px" }}>
                    Content &amp; Shoot Assets
                  </h4>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "var(--muted-text)", margin: 0 }}>
                    Direct-response video hooks, catalog curation and performance ad creatives.
                  </p>
                </div>

                <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                  <span className="editorial-tag" style={{ fontSize: "9px", color: "var(--accent-color)" }}>04 ACQUISITION</span>
                  <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", marginTop: "6px", marginBottom: "6px" }}>
                    Meta Acquisition Testing
                  </h4>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "var(--muted-text)", margin: 0 }}>
                    Multi-angle creative testing loops to establish scalable unit economics.
                  </p>
                </div>

              </div>

              {/* Status Note */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "20px", flexWrap: "wrap", gap: "16px" }}>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--muted-text)" }}>
                  Live Deployment in Progress &bull; Verified commercial data will be published upon benchmark validation.
                </span>
                <Link href="/how-it-works" className="btn-secondary" style={{ fontSize: "11px", padding: "10px 20px" }}>
                  See How We Build &rarr;
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* ─── 9. BUSINESS INTELLIGENCE & TOOLS LAYER ─── */}
        <section style={{ padding: "clamp(4.5rem, 8vw, 6.5rem) 1.5rem", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(8,8,8,0.7)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: "16px" }}>
                BUSINESS INTELLIGENCE LAYER
              </span>
              <Heading level="h2" style={{ textAlign: "center", marginBottom: "16px" }}>
                DIAGNOSTIC TOOLS FOR COMMERCIAL CLARITY.
              </Heading>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--muted-text)", maxWidth: "620px", margin: "0 auto" }}>
                Practical tools to understand the economics, inventory locks, and profit leakage behind your growth before investing capital.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px" }}>
              
              <div className="glass-panel" style={{ padding: "30px", borderRadius: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <span className="editorial-tag" style={{ fontSize: "10px", color: "var(--accent-color)", display: "block", marginBottom: "10px" }}>
                    CORE DIAGNOSTIC
                  </span>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                    D2C Readiness Assessment
                  </h3>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--muted-text)", lineHeight: 1.6, marginBottom: "20px" }}>
                    Evaluate your product economics, margins, and operational capacity across 10 strategic dimensions.
                  </p>
                </div>
                <Link href="/assessment" className="btn-primary" style={{ padding: "12px 24px", fontSize: "12px", width: "100%", justifyContent: "center" }}>
                  Take Assessment &rarr;
                </Link>
              </div>

              <div className="glass-panel" style={{ padding: "30px", borderRadius: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <span className="editorial-tag" style={{ fontSize: "10px", color: "#A3A3A3", display: "block", marginBottom: "10px" }}>
                    CAPITAL INTELLIGENCE
                  </span>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                    Dead Stock Calculator
                  </h3>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--muted-text)", lineHeight: 1.6, marginBottom: "20px" }}>
                    Calculate exact working capital trapped in aged inventory along with annual holding cost leakage.
                  </p>
                </div>
                <Link href="/tools/dead-stock" className="btn-secondary" style={{ padding: "12px 24px", fontSize: "12px", width: "100%", justifyContent: "center", border: "1px solid rgba(255,255,255,0.12)" }}>
                  Open Calculator &rarr;
                </Link>
              </div>

              <div className="glass-panel" style={{ padding: "30px", borderRadius: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <span className="editorial-tag" style={{ fontSize: "10px", color: "#A3A3A3", display: "block", marginBottom: "10px" }}>
                    PROFIT MODELING
                  </span>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                    Profit Opportunity Calculator
                  </h3>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--muted-text)", lineHeight: 1.6, marginBottom: "20px" }}>
                    Interactively model store revenue, inventory valuation, and discounting to discover annual profit upside.
                  </p>
                </div>
                <Link href="/tools/profit-opportunity" className="btn-secondary" style={{ padding: "12px 24px", fontSize: "12px", width: "100%", justifyContent: "center", border: "1px solid rgba(255,255,255,0.12)" }}>
                  Open Calculator &rarr;
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* ─── 10. FINAL CLOSING CTA SECTION ─── */}
        <section style={{ padding: "clamp(5rem, 10vw, 7.5rem) 1.5rem", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(2,2,2,0.9)", textAlign: "center" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: "16px" }}>
              TAKE THE FIRST STEP
            </span>
            <Heading level="h2" style={{ textAlign: "center", marginBottom: "20px" }}>
              LET'S BUILD THE NEXT <br />
              <span style={{ color: "var(--accent-color)" }}>REVENUE ENGINE.</span>
            </Heading>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "16px", color: "var(--muted-text)", lineHeight: 1.7, marginBottom: "36px" }}>
              You have the product. We build the business around it. Start by evaluating your business readiness in 4 minutes or start a direct conversation.
            </p>
            
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: "24px" }}>
              <Link
                href="/assessment"
                className="btn-primary"
                style={{
                  borderRadius: "9999px",
                  padding: "18px 40px",
                  fontSize: "13px",
                  fontWeight: 700,
                  boxShadow: "0 0 40px rgba(0,242,255,0.25)",
                }}
              >
                Check Your D2C Readiness <ArrowRight size={16} />
              </Link>

              <Link
                href="/contact"
                className="btn-secondary"
                style={{
                  borderRadius: "9999px",
                  padding: "18px 32px",
                  fontSize: "13px",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                Start A Conversation
              </Link>
            </div>

            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--muted-text)", opacity: 0.6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              No aggressive sales pitch &bull; Data-backed diagnostic insights
            </p>
          </div>
        </section>

      </main>

      {/* ─── 11. FOOTER ─── */}
      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "4rem 1.5rem 3rem", backgroundColor: "var(--bg-color)", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2.5rem", marginBottom: "3rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "420px" }}>
              <div>
                <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "8px" }}>
                  <img src="/Favicon transparent.png" alt="Adyant Nexa" width={24} height={24} />
                  <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "1.15rem", color: "var(--text-color)", letterSpacing: "0.02em" }}>
                    ADYANT NEXA
                  </span>
                </Link>
                <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted-text)", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
                  Consumer Growth &amp; Commerce Company. We help product businesses build, launch and grow consumer brands.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--muted-text)" }}>
                <div style={{ lineHeight: 1.5, opacity: 0.85 }}>
                  Unit 716, 7th Floor, ILD Trade Centre,<br />
                  Sector 47, Gurugram, Haryana 122018
                </div>

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <span>Email: <a href="mailto:contact@adyantnexa.com" style={{ color: "#00F2FF", textDecoration: "none" }}>contact@adyantnexa.com</a></span>
                  <span>Phone: <a href="tel:+918700720477" style={{ color: "#00F2FF", textDecoration: "none" }}>+91 87007 20477</a></span>
                </div>

                <div style={{ marginTop: "2px" }}>
                  <span style={{ backgroundColor: "rgba(0,242,255,0.06)", border: "1px solid rgba(0,242,255,0.2)", color: "#00F2FF", padding: "3px 8px", borderRadius: "4px", fontSize: "10px" }}>
                    GSTIN: 06CPKPK2852M1ZH
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <span className="editorial-tag" style={{ fontSize: "9px", marginBottom: "4px" }}>GROWTH SYSTEM_</span>
                <Link href="/#growth-system" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>Methodology</Link>
                <Link href="/#what-we-do" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>Capabilities</Link>
                <Link href="/#who-we-work-with" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>Who We Work With</Link>
                <Link href="/how-it-works" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>How We Work</Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <span className="editorial-tag" style={{ fontSize: "9px", marginBottom: "4px" }}>INTELLIGENCE_</span>
                <Link href="/assessment" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>D2C Assessment</Link>
                <Link href="/tools" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>Growth Tools Hub</Link>
                <Link href="/tools/dead-stock" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>Dead Stock Calculator</Link>
                <Link href="/tools/profit-opportunity" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>Profit Calculator</Link>
                <Link href="/contact" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>Contact Advisory</Link>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "24px", textAlign: "center", fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--muted-text)", opacity: 0.6 }}>
            &copy; 2026 Adyant Nexa. Consumer Growth &amp; Commerce.
          </div>

        </div>
      </footer>

    </div>
  );
}

