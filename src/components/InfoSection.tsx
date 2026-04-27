"use client";

import { motion } from "framer-motion";
import { X, Zap, MessageCircle } from "lucide-react";
import { FadeSection } from "./FadeSection";
import { Heading } from "./ui/Heading";

const FAQS = [
  { q: "WHY NEXT.JS INSTEAD OF WORDPRESS?", a: "WORDPRESS is built on 20-year-old PHP architecture. It's fragile, slow, and prone to hacking. NEXT.JS is the 'Digital OS' used by top-tier platforms—it's unhackable, loads in sub-seconds, and provides a native app-like experience." },
  { q: "HOW CAN YOU DELIVER A PREMIUM BUILD IN 7 DAYS?", a: "We follow the 'Nexa Protocol.' We don't waste weeks on 'discovery' fluff. We follow a surgical execution map to deploy your infrastructure while your competitors are still stuck in the planning phase." },
  { q: "DO YOU HANDLE MY MARKETING STRATEGY AS WELL?", a: "The 'Nexa Growth' tier includes complete META/GOOGLE ADS management. We don't just build the site—we engineer the entire sales engine, from the first click to the final conversion." },
  { q: "WHAT EXACTLY IS THE 'ELITE GAP'?", a: "It's the conversion difference between a generic ₹15k site that loses traffic due to speed, and a Nexa-Spec site that captures every single lead with zero friction and 99% uptime." }
];

const LEGAL_POLICIES = [
  { id: "01", title: "Privacy Policy", desc: "We collect basic data strictly for service inquiries and performance analysis. You may request data removal via contact@adyantnexa.com anytime. We utilize Meta Pixel and Cookies for optimization." },
  { id: "02", title: "Execution Terms", desc: "7-day delivery cycles start upon 100% asset submission. Delays in client-side approval or asset delivery will pro-rate the timeline accordingly." },
  { id: "03", title: "Refund Logic", desc: "Nexa Audit fees are 100% refundable if identified growth leaks do not total at least 3 actionable items. Build costs are pro-rated based on phase completion." },
  { id: "04", title: "Technical Security", desc: "Standard deployment includes 256-bit SSL, static Next.js architecture (unhackable), and server-side tracking sync for total data integrity." }
];

export const InfoSection = () => {
  return (
    <>
      {/* FAQ */}
      <section style={{ padding: "clamp(4rem, 8vw, 7rem) 28px", background: "#080808", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeSection>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>Intel Core_</span>
              <Heading level="h2" style={{ color: "#E5E5E5" }}>
                Frequently Asked <span style={{ color: "#00F2FF" }}>Intel.</span>
              </Heading>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {FAQS.map((f, i) => (
                <div key={i} className="glass-panel" style={{ padding: 32, background: "rgba(255,255,255,0.01)" }}>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 16, display: "flex", gap: 12 }}>
                    <span style={{ color: "#00F2FF", opacity: 0.5 }}>Q.</span> {f.q}
                  </h3>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.38)", lineHeight: 1.8, borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 16 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ABOUT / STORY */}
      <section id="about" style={{ padding: "clamp(4rem, 8vw, 7rem) 28px", background: "#080808", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeSection>
            <div style={{ textAlign: "center" }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: 24, opacity: 0.6, fontSize: 9 }}>Brand Story_</span>
              <Heading level="h2" style={{ color: "#E5E5E5", marginBottom: 40 }}>
                We Exist Because the Market<br /><span style={{ color: "rgba(229,229,229,0.2)" }}>Failed Businesses Like Yours.</span>
              </Heading>
              <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "rgba(229,229,229,0.42)", lineHeight: 1.9, display: "flex", flexDirection: "column", gap: 20, maxWidth: 580, margin: "0 auto" }}>
                <p>We exist because the Indian market is flooded with slow sites that bottleneck growth. Cheap freelancers disappear, and agencies overcharge for diluted attention.</p>
                <p>Adyant Nexa filled the &quot;Elite Gap&quot;—providing Next.js architecture and conversion engines with the speed and focus your roadmap demands.</p>
                <p style={{ color: "#00F2FF", fontWeight: 600, letterSpacing: "0.05em", fontSize: 15, padding: "24px 0", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>One founder. Zero fluff. Clean performance.</p>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* NUCLEAR CTA */}
      <section style={{ padding: "100px 28px", background: "#00F2FF", color: "#000", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.1, pointerEvents: "none" }}>
          <div className="scan-overlay" style={{ background: "linear-gradient(rgba(0,0,0,0.1) 50%, transparent 50%)", backgroundSize: "100% 4px" }} />
        </div>
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2, textAlign: "center" }}>
          <FadeSection>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 24, color: "#000", opacity: 0.6, fontSize: 10, letterSpacing: "0.5em" }}>FINAL PROTOCOL</span>
            <Heading level="h2" style={{ color: "#000" }}>STOP BUILDING ON<br />FRAGILE TECH.</Heading>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 48 }}>
              <a href="#contact" style={{ padding: "20px 40px", background: "#000", color: "#fff", fontFamily: "var(--font-geist-mono)", fontWeight: 700, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>Initialize Scale</a>
              <a href="https://wa.me/918700720477" style={{ padding: "20px 40px", border: "2px solid #000", color: "#000", fontFamily: "var(--font-geist-mono)", fontWeight: 700, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>WhatsApp Direct</a>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* LEGAL */}
      <section id="legal" style={{ padding: "80px 28px", background: "#080808", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeSection>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
              {LEGAL_POLICIES.map(p => (
                <div key={p.id} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 13, color: "#fff", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    <span style={{ color: "#00F2FF", marginRight: 8, opacity: 0.4 }}>{p.id}</span>
                    {p.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "rgba(229,229,229,0.28)", lineHeight: 1.8 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>
    </>
  );
};
