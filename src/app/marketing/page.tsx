"use client";

import { useNeuralTransition } from "@/context/TransitionContext";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, TrendingUp, BarChart3, Target, ShieldCheck, ArrowRight, Cpu } from "lucide-react";
import { FadeSection } from "@/components/FadeSection";

export default function MarketingPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [lenisRef, setLenisRef] = useState<Lenis | null>(null);
  const { isNavigating, triggerTransition } = useNeuralTransition();

  useEffect(() => {
    const lenis = new Lenis({ duration: 0.95 });
    setLenisRef(lenis);
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    const detectLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.country_code === "IN") setCurrency("INR");
      } catch (err) {}
    };
    detectLocation();

    return () => lenis.destroy();
  }, []);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, target: string) => {
    if (target.startsWith("#") || target.startsWith("/#")) {
      e.preventDefault();
      triggerTransition(target, lenisRef);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020202", color: "#E5E5E5", overflowX: "hidden", fontFamily: "var(--font-inter)" }}>
      {/* ─── NAVIGATION (Synced Elite) ─── */}
      <nav style={{ 
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, 
        background: "rgba(2,2,2,0.85)", 
        backdropFilter: "blur(25px)", 
        borderBottom: "1px solid rgba(255,255,255,0.08)", 
        padding: "16px 0",
        transition: "background 0.5s ease, padding 0.5s ease"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <img src="/Favicon transparent.png" alt="Adyant Nexa" width={28} height={28} />
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 14, color: "#fff", letterSpacing: "-0.01em" }}>ADYANT NEXA</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <Link href="/blog" onClick={(e) => handleNavigate(e, "/blog")} style={{ 
              fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 500, padding: "8px 16px", borderRadius: "100px", color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "all 0.3s"
            }} onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }} 
               onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "transparent"; }}>Journal</Link>
            
            <Link href="/#investment" onClick={(e) => handleNavigate(e, "/#investment")} style={{ 
              fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 500, padding: "8px 16px", borderRadius: "100px", color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "all 0.3s"
            }} onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }} 
               onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "transparent"; }}>Web Assets</Link>

            <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "2px", borderRadius: "100px", margin: "0 8px" }}>
              <button onClick={() => setCurrency("USD")} style={{ padding: "4px 10px", borderRadius: "100px", background: currency === "USD" ? "#00F2FF" : "transparent", color: currency === "USD" ? "#000" : "#fff", border: "none", fontSize: 9, fontWeight: 700, cursor: "pointer" }}>USD</button>
              <button onClick={() => setCurrency("INR")} style={{ padding: "4px 10px", borderRadius: "100px", background: currency === "INR" ? "#00F2FF" : "transparent", color: currency === "INR" ? "#000" : "#fff", border: "none", fontSize: 9, fontWeight: 700, cursor: "pointer" }}>INR</button>
            </div>
          </div>

          <a href="/#contact" onClick={(e) => handleNavigate(e, "/#contact")} className="btn-primary" style={{ fontSize: 11, padding: "10px 28px", borderRadius: "100px" }}>Engage Protocol</a>
        </div>
      </nav>

      {/* Content wrapper with transition */}
      <motion.main
        animate={{ 
          opacity: isNavigating ? 0 : 1,
          filter: isNavigating ? "blur(10px)" : "blur(0px)",
          scale: isNavigating ? 0.98 : 1
        }}
        transition={{ duration: 0.4 }}
      >
        {/* ─── HERO ─── */}
        <section style={{ padding: "160px 28px 100px", position: "relative", overflow: "hidden" }}>
          <div className="ambient-orb" style={{ top: "-10%", left: "20%", opacity: 0.15 }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
            <FadeSection>
              <span className="editorial-tag" style={{ display: "block", marginBottom: 24 }}>Advanced Performance Marketing_</span>
              <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.5rem, 8vw, 5.5rem)", lineHeight: 0.95, letterSpacing: "-0.04em", color: "#E5E5E5", marginBottom: 32 }}>
                Market <span style={{ color: "#00F2FF" }}>Dominance</span> <br /> via Algorithmic Scale.
              </h1>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "clamp(14px, 1.5vw, 16px)", color: "rgba(229,229,229,0.45)", lineHeight: 1.8, maxWidth: 650, margin: "0 auto 48px" }}>
                Standard agency tracking is dead. We use server-side architecture (CAPI) and multi-agent AI to bypass iOS 14 restrictions and scale your revenue with 100% data accuracy.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
                <a href="#protocol" onClick={(e) => handleNavigate(e, "#protocol")} className="btn-primary" style={{ padding: "18px 36px" }}>The Scaling Protocol</a>
                <a href="/#contact" onClick={(e) => handleNavigate(e, "/#contact")} className="btn-secondary" style={{ padding: "18px 36px" }}>Engage Now</a>
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ─── THE CAPI ADVANTAGE (FAB) ─── */}
        <section style={{ padding: "100px 28px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 80, alignItems: "center" }}>
              <FadeSection>
                <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#E5E5E5", marginBottom: 40, lineHeight: 1.1 }}>
                  Why your current <br /><span style={{ color: "rgba(255,255,255,0.2)" }}>Ads are failing.</span>
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                  {[
                    { f: "CAPI Integration", a: "Direct server-to-server data stream.", b: "100% attribution accuracy, even after iOS 14 opt-outs." },
                    { f: "LTV Optimization", a: "Focus on Customer Lifetime Value, not just CPC.", b: "Highly profitable scaling without revenue churn." },
                    { f: "Neural Creative", a: "AI-optimized ad copy and visuals.", b: "Market-leading CTRs and lower platform friction." }
                  ].map((item, i) => (
                    <div key={i} style={{ paddingLeft: 24, borderLeft: "1px solid rgba(0,242,255,0.2)" }}>
                      <span className="editorial-tag" style={{ fontSize: 9, color: "#00F2FF", display: "block", marginBottom: 8 }}>{item.f}</span>
                      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.35)", lineHeight: 1.6 }}>
                        <strong style={{ color: "#E5E5E5" }}>Advantage:</strong> {item.a}<br />
                        <strong style={{ color: "#00F2FF" }}>Benefit:</strong> {item.b}
                      </p>
                    </div>
                  ))}
                </div>
              </FadeSection>

              <FadeSection delay={0.2}>
                <div className="glass-panel" style={{ padding: 48, background: "rgba(0,242,255,0.01)", border: "1px solid rgba(0,242,255,0.1)" }}>
                  <TrendingUp size={48} color="#00F2FF" style={{ marginBottom: 32, opacity: 0.3 }} />
                  <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 24, color: "#E5E5E5", marginBottom: 24 }}>Predictable ROI.</h3>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "rgba(229,229,229,0.45)", lineHeight: 1.8, marginBottom: 32 }}>
                    We don&apos;t guess. We engineer growth. By integrating your ads directly with our server architecture, we create a feedback loop that lowers CAC every single day.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <div>
                      <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, color: "#00F2FF" }}>-40%</span>
                      <span className="editorial-tag" style={{ fontSize: 8, display: "block", opacity: 0.3 }}>Avg. CAC Reduction</span>
                    </div>
                    <div>
                      <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, color: "#00F2FF" }}>3.2X</span>
                      <span className="editorial-tag" style={{ fontSize: 8, display: "block", opacity: 0.3 }}>Min. Targeted ROAS</span>
                    </div>
                  </div>
                </div>
              </FadeSection>
            </div>
          </div>
        </section>

        {/* ─── SCALING PROTOCOL ─── */}
        <section id="protocol" style={{ padding: "100px 28px", background: "#080808" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
            <FadeSection>
              <span className="editorial-tag" style={{ display: "block", marginBottom: 24 }}>The 4-Phase Dominance Loop_</span>
              <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#E5E5E5", marginBottom: 72 }}>How we <span style={{ color: "#00F2FF" }}>Scale.</span></h2>
            </FadeSection>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
              {[
                { id: "01", t: "Diagnostic", d: "Audit current tracking, pixel health, and creative resonance." },
                { id: "02", t: "Architecture", d: "Setup Server-Side CAPI and multi-event tracking (Offline/CRM)." },
                { id: "03", t: "Testing", d: "High-velocity creative testing using AI-driven feedback loops." },
                { id: "04", t: "Scaling", d: "Algorithmic budget expansion once unit economics are locked." }
              ].map((p, i) => (
                <FadeSection key={p.id} delay={i * 0.1}>
                  <div style={{ padding: 32, border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)", textAlign: "left" }}>
                    <span className="editorial-tag" style={{ color: "#00F2FF", fontSize: 10, display: "block", marginBottom: 16 }}>{p.id}</span>
                    <h4 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 12 }}>{p.t}</h4>
                    <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(229,229,229,0.35)", lineHeight: 1.6 }}>{p.d}</p>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SUBSCRIPTION MODELS (US SME Focus) ─── */}
        <section id="pricing" style={{ padding: "100px 28px", background: "#020202" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <FadeSection>
              <div style={{ textAlign: "center", marginBottom: 72 }}>
                <span className="editorial-tag" style={{ display: "block", marginBottom: 24, color: "#00F2FF" }}>Recurring Dominance_</span>
                <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#E5E5E5", marginBottom: 24 }}>
                  Marketing <span style={{ color: "#00F2FF" }}>Subscriptions.</span>
                </h2>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.35)", maxWidth: 500, margin: "0 auto" }}>
                  Elite ads management powered by server-side architecture. **100% Upfront Retainer Required.** Includes 2 Strategic Review Rounds. Prices in <span style={{ color: "#00F2FF" }}>{currency}</span>.
                </p>
              </div>
            </FadeSection>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
              {[
                { 
                  name: "THE CATALYST", 
                  priceUSD: "$1,999", 
                  priceINR: "₹1,65,000",
                  desc: "Foundation for growth. Perfect for single-service scaling (Meta or Google).",
                  features: ["Single Channel Management", "Server-Side CAPI Setup", "Weekly Growth Reports", "1 Custom AI Sales Agent", "Creative Audit"]
                },
                { 
                  name: "THE ACCELERATOR", 
                  priceUSD: "$4,499", 
                  priceINR: "₹3,75,000",
                  desc: "Aggressive multi-channel dominance for HVAC, Solar, and SaaS leaders.",
                  features: ["Multi-Channel Ads (Meta + Google)", "Custom Conversion Funnels", "2 AI Agents (Sales + Support)", "Advanced LTV Tracking", "Priority Scaling Support"],
                  highlight: true
                },
                { 
                  name: "THE DOMINATOR", 
                  priceUSD: "$9,999", 
                  priceINR: "₹8,30,000",
                  desc: "Absolute market share. We become your outsourced Revenue Operations department.",
                  features: ["Omni-channel Global Scale", "Multi-Agent AI Ecosystem", "Full CRM Automation", "Custom BI Dashboards", "Daily Optimization Sync"]
                }
              ].map((tier, i) => (
                <FadeSection key={tier.name} delay={i * 0.1}>
                  <div style={{
                    padding: "48px 40px",
                    background: tier.highlight ? "rgba(0,242,255,0.03)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${tier.highlight ? "rgba(0,242,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: 32,
                    minHeight: "560px"
                  }}>
                    {tier.highlight && (
                      <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#00F2FF", color: "#000", fontFamily: "var(--font-geist-mono)", fontWeight: 700, fontSize: 9, letterSpacing: "0.2em", padding: "6px 20px" }}>MOST POPULAR</div>
                    )}
                    <div>
                      <span className="editorial-tag" style={{ color: tier.highlight ? "#00F2FF" : "rgba(255,255,255,0.3)", fontSize: 10, display: "block", marginBottom: 16 }}>{tier.name}</span>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 24 }}>
                        <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 42, color: "#fff" }}>
                          {currency === "USD" ? tier.priceUSD : tier.priceINR}
                        </span>
                        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "rgba(255,255,255,0.2)", marginBottom: 8 }}>/mo</span>
                      </div>
                      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{tier.desc}</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
                      {tier.features.map(f => (
                        <div key={f} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <Zap size={14} color="#00F2FF" />
                          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{f}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/#contact" className={tier.highlight ? "btn-primary" : "btn-secondary"} style={{ textAlign: "center", padding: "16px", fontSize: 11 }}>Engage Growth Protocol</Link>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>
      </motion.main>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "100px 28px", textAlign: "center" }}>
        <FadeSection>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 32 }}>
            <img src="/Favicon transparent.png" alt="Adyant Nexa" width={32} height={32} />
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18, color: "#fff" }}>ADYANT NEXA</span>
          </div>
          <p className="editorial-tag" style={{ fontSize: 10, opacity: 0.3, marginBottom: 32 }}>Built for Revenue Dominance. © 2026</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
            <Link href="/" className="editorial-tag" style={{ fontSize: 9, textDecoration: "none" }}>Back to Nexus</Link>
            <Link href="/#contact" className="editorial-tag" style={{ fontSize: 9, textDecoration: "none" }}>Privacy Protocol</Link>
          </div>
        </FadeSection>
      </footer>
    </div>
  );
}
