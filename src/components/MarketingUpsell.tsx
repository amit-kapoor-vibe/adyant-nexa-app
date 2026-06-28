"use client";


import { Zap, ArrowRight, ShieldCheck, Globe, Target } from "lucide-react";
import Link from "next/link";
import { setupFees } from "@/data/marketingData";

export const MarketingUpsell = ({ onNavigate, currency }: { onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, target: string) => void, currency: "USD" | "INR" }) => {
  return (
    <section style={{ padding: "100px 28px", background: "linear-gradient(to bottom, var(--bg-color), var(--surface-color))", position: "relative", overflow: "hidden", transition: "all 0.4s ease" }}>
      <div className="ambient-orb" style={{ top: "50%", right: "-10%", opacity: 0.1, background: "var(--accent-color)" }} />
      
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="glass-panel" style={{ padding: "clamp(30px, 5vw, 60px) clamp(20px, 4vw, 40px)", border: "1px solid var(--border-color)", background: "var(--glass-bg)", position: "relative", zIndex: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "clamp(30px, 5vw, 60px)", alignItems: "center" }}>
            
            <div>
              <span className="editorial-tag" style={{ color: "var(--accent-color)", marginBottom: 24, display: "block", transition: "color 0.4s ease" }}>Phase 02: Revenue Injection_</span>
              <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "var(--text-color)", marginBottom: 32, lineHeight: 1, transition: "color 0.4s ease" }}>
                Website Ready. <br /><span style={{ color: "var(--accent-color)", transition: "color 0.4s ease" }}>Now What?</span>
              </h2>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "var(--muted-text)", lineHeight: 1.8, marginBottom: 40, transition: "color 0.4s ease" }}>
                High-speed architecture is the engine. Ads are the fuel. Because Nexa built your infrastructure, we already have your Server-Side tracking ready. We waive all setup fees for our marketing partners.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
                {[
                  { text: `Standard Setup Fee: ${currency === "USD" ? setupFees.standard.usd : setupFees.standard.inr}`, value: "WAIVED", color: "var(--accent-color)" },
                  { text: `Tracking Architecture: ${currency === "USD" ? setupFees.tracking.usd : setupFees.tracking.inr}`, value: "INCLUDED", color: "var(--accent-color)" },
                  { text: "Total Partner Savings", value: currency === "USD" ? setupFees.total.usd : setupFees.total.inr, color: "var(--text-color)", bold: true }
                ].map((item) => (
                  <div key={item.text} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid var(--border-color)", transition: "border-color 0.4s ease" }}>
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--muted-text)", transition: "color 0.4s ease" }}>{item.text}</span>
                    <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 14, color: item.color, transition: "color 0.4s ease" }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <Link href="/marketing" onClick={(e) => onNavigate(e, "/marketing")} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "18px 36px" }}>
                Activate Growth Protocol <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: 24 }}>
              {[
                { icon: <Zap size={24} />, title: "Zero Lag", desc: "Sync ads with your ultra-fast site." },
                { icon: <ShieldCheck size={24} />, title: "CAPI Ready", desc: "Bypass iOS 14 with server tracking." },
                { icon: <Globe size={24} />, title: "Global Scale", desc: "Meta & Google AI integration." },
                { icon: <Target size={24} />, title: "Pure ROI", desc: "Pay only for performance." }
              ].map((card) => (
                <div key={card.title} style={{ padding: 24, border: "1px solid var(--border-color)", background: "var(--glass-bg)", transition: "all 0.4s ease" }}>
                  <div style={{ color: "var(--accent-color)", marginBottom: 16, transition: "color 0.4s ease" }}>{card.icon}</div>
                  <h4 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 16, color: "var(--text-color)", marginBottom: 8, transition: "color 0.4s ease" }}>{card.title}</h4>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--muted-text)", lineHeight: 1.5, transition: "color 0.4s ease" }}>{card.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
