"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight, ShieldCheck, Globe, Target } from "lucide-react";
import Link from "next/link";
import { setupFees } from "@/data/marketingData";

export const MarketingUpsell = ({ onNavigate, currency }: { onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, target: string) => void, currency: "USD" | "INR" }) => {
  return (
    <section style={{ padding: "100px 28px", background: "linear-gradient(to bottom, #020202, #080808)", position: "relative", overflow: "hidden" }}>
      <div className="ambient-orb" style={{ top: "50%", right: "-10%", opacity: 0.1, background: "#00F2FF" }} />
      
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="glass-panel" style={{ padding: "60px 40px", border: "1px solid rgba(0,242,255,0.15)", background: "rgba(0,242,255,0.01)", position: "relative", zIndex: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 60, alignItems: "center" }}>
            
            <div>
              <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 24, display: "block" }}>Phase 02: Revenue Injection_</span>
              <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#E5E5E5", marginBottom: 32, lineHeight: 1 }}>
                Website Ready. <br /><span style={{ color: "#00F2FF" }}>Now What?</span>
              </h2>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "rgba(229,229,229,0.45)", lineHeight: 1.8, marginBottom: 40 }}>
                High-speed architecture is the engine. Ads are the fuel. Because Nexa built your infrastructure, we already have your Server-Side tracking ready. We waive all setup fees for our marketing partners.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
                {[
                  { text: `Standard Setup Fee: ${currency === "USD" ? setupFees.standard.usd : setupFees.standard.inr}`, value: "WAIVED", color: "#00F2FF" },
                  { text: `Tracking Architecture: ${currency === "USD" ? setupFees.tracking.usd : setupFees.tracking.inr}`, value: "INCLUDED", color: "#00F2FF" },
                  { text: "Total Partner Savings", value: currency === "USD" ? setupFees.total.usd : setupFees.total.inr, color: "#fff", bold: true }
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{item.text}</span>
                    <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 14, color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <Link href="/marketing" onClick={(e) => onNavigate(e, "/marketing")} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "18px 36px" }}>
                Activate Growth Protocol <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {[
                { icon: <Zap size={24} />, title: "Zero Lag", desc: "Sync ads with your ultra-fast site." },
                { icon: <ShieldCheck size={24} />, title: "CAPI Ready", desc: "Bypass iOS 14 with server tracking." },
                { icon: <Globe size={24} />, title: "Global Scale", desc: "Meta & Google AI integration." },
                { icon: <Target size={24} />, title: "Pure ROI", desc: "Pay only for performance." }
              ].map((card, i) => (
                <div key={i} style={{ padding: 24, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
                  <div style={{ color: "#00F2FF", marginBottom: 16 }}>{card.icon}</div>
                  <h4 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 8 }}>{card.title}</h4>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>{card.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
