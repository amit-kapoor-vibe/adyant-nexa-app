"use client";


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
      <section style={{ padding: "clamp(4rem, 8vw, 7rem) 28px", background: "var(--surface-color)", borderTop: "1px solid var(--border-color)", transition: "all 0.4s ease" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeSection>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>Intel Core_</span>
              <Heading level="h2" style={{ color: "var(--text-color)", transition: "color 0.4s ease" }}>
                Frequently Asked <span style={{ color: "var(--accent-color)", transition: "color 0.4s ease" }}>Intel.</span>
              </Heading>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {FAQS.map((f, i) => (
                <div key={i} className="glass-panel" style={{ padding: 32, background: "var(--glass-bg)" }}>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 16, color: "var(--text-color)", marginBottom: 16, display: "flex", gap: 12, transition: "color 0.4s ease" }}>
                    <span style={{ color: "var(--accent-color)", opacity: 0.5, transition: "color 0.4s ease" }}>Q.</span> {f.q}
                  </h3>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--muted-text)", lineHeight: 1.8, borderTop: "1px solid var(--border-color)", paddingTop: 16, transition: "all 0.4s ease" }}>{f.a}</p>
                </div>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ABOUT / STORY */}
      <section id="about" style={{ padding: "clamp(4rem, 8vw, 7rem) 28px", background: "var(--surface-color)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", transition: "all 0.4s ease" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeSection>
            <div style={{ textAlign: "center" }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: 24, opacity: 0.6, fontSize: 9 }}>Brand Story_</span>
              <Heading level="h2" style={{ color: "var(--text-color)", marginBottom: 40, transition: "color 0.4s ease" }}>
                We Exist Because the Market<br /><span style={{ color: "var(--muted-text)", opacity: 0.4, transition: "color 0.4s ease" }}>Failed Businesses Like Yours.</span>
              </Heading>
              <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "var(--muted-text)", lineHeight: 1.9, display: "flex", flexDirection: "column", gap: 20, maxWidth: 580, margin: "0 auto", transition: "color 0.4s ease" }}>
                <p>We exist because the Indian market is flooded with slow sites that bottleneck growth. Cheap freelancers disappear, and agencies overcharge for diluted attention.</p>
                <p>Adyant Nexa filled the &quot;Elite Gap&quot;—providing Next.js architecture and conversion engines with the speed and focus your roadmap demands.</p>
                <p style={{ color: "var(--accent-color)", fontWeight: 600, letterSpacing: "0.05em", fontSize: 15, padding: "24px 0", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", transition: "all 0.4s ease" }}>One founder. Zero fluff. Clean performance.</p>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* NUCLEAR CTA */}
      <section style={{ padding: "100px 28px", background: "var(--accent-color)", color: "#020202", position: "relative", overflow: "hidden", transition: "background 0.4s ease" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.1, pointerEvents: "none" }}>
          <div className="scan-overlay" style={{ background: "linear-gradient(rgba(0,0,0,0.1) 50%, transparent 50%)", backgroundSize: "100% 4px" }} />
        </div>
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2, textAlign: "center" }}>
          <FadeSection>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 24, color: "#020202", opacity: 0.6, fontSize: 10, letterSpacing: "0.5em" }}>FINAL PROTOCOL</span>
            <Heading level="h2" style={{ color: "#020202" }}>STOP BUILDING ON<br />FRAGILE TECH.</Heading>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 48 }}>
              <a href="#contact" style={{ padding: "20px 40px", background: "#020202", color: "#E5E5E5", fontFamily: "var(--font-geist-mono)", fontWeight: 700, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>Initialize Scale</a>
              <a href="https://wa.me/918700720477" style={{ padding: "20px 40px", border: "2px solid #020202", color: "#020202", fontFamily: "var(--font-geist-mono)", fontWeight: 700, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>WhatsApp Direct</a>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* LEGAL */}
      <section id="legal" style={{ padding: "80px 28px", background: "var(--surface-color)", borderTop: "1px solid var(--border-color)", transition: "all 0.4s ease" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeSection>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
              {LEGAL_POLICIES.map(p => (
                <div key={p.id} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 13, color: "var(--text-color)", letterSpacing: "0.05em", textTransform: "uppercase", transition: "color 0.4s ease" }}>
                    <span style={{ color: "var(--accent-color)", marginRight: 8, opacity: 0.4, transition: "color 0.4s ease" }}>{p.id}</span>
                    {p.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--muted-text)", lineHeight: 1.8, transition: "color 0.4s ease" }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>
    </>
  );
};
