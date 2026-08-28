"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
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
        <section style={{ paddingTop: "clamp(7rem, 14vw, 10rem)", paddingBottom: "clamp(4rem, 8vw, 6rem)", paddingLeft: "1.5rem", paddingRight: "1.5rem", position: "relative" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
            
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="editorial-tag"
              style={{
                fontSize: "11px",
                letterSpacing: "0.4em",
                color: "var(--accent-color)",
                display: "block",
                marginBottom: "20px",
              }}
            >
              ADYANT NEXA
            </motion.span>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ marginBottom: "28px" }}
            >
              <Heading
                level="h1"
                style={{
                  textAlign: "center",
                  margin: "20px auto 28px",
                  maxWidth: "960px",
                  lineHeight: 1.05,
                }}
              >
                <span style={{ display: "block", fontSize: "clamp(15px, 2.2vw, 24px)", fontWeight: 600, color: "#A3A3A3", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px", fontFamily: "var(--font-geist-mono)" }}>
                  Find where your
                </span>

                <span style={{ display: "block", fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "8px" }}>
                  FASHION BUSINESS
                </span>

                <span 
                  className="glitch-text glitch-shimmer" 
                  data-text="IS LOSING MONEY."
                  style={{ 
                    display: "block", 
                    fontSize: "clamp(40px, 7.5vw, 92px)", 
                    fontWeight: 800, 
                    color: "var(--accent-color)", 
                    letterSpacing: "-0.04em",
                    textShadow: "0 0 35px rgba(0, 242, 255, 0.4)",
                  }}
                >
                  IS LOSING MONEY.
                </span>
              </Heading>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(15px, 2vw, 18px)",
                color: "var(--muted-text)",
                lineHeight: 1.7,
                maxWidth: "640px",
                margin: "0 auto 36px",
              }}
            >
              A free 4-minute business assessment that identifies where inventory, margins, customers and marketing may be holding back your growth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: "flex", gap: "16px", justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: "24px" }}
            >
              <Link
                href="/assessment"
                className="btn-primary"
                style={{
                  borderRadius: "9999px",
                  padding: "16px 36px",
                  fontSize: "13px",
                  fontWeight: 700,
                  boxShadow: "0 0 35px rgba(0,242,255,0.25)",
                }}
              >
                Find My Opportunity — Free <ArrowRight size={16} />
              </Link>

              <Link
                href="/how-it-works"
                className="btn-secondary"
                style={{
                  borderRadius: "9999px",
                  padding: "16px 28px",
                  fontSize: "13px",
                }}
              >
                How It Works
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--muted-text)", letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              Built for Indian fashion &amp; apparel retailers.
            </motion.p>
          </div>
        </section>

        {/* ─── 2. PROBLEM / OPPORTUNITY SECTION ─── */}
        <section style={{ padding: "clamp(4rem, 8vw, 6rem) 1.5rem", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(2,2,2,0.85)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: "16px" }}>
                THE QUESTION
              </span>
              <Heading level="h2" style={{ textAlign: "center", marginBottom: "24px" }}>
                WHERE IS YOUR PROFIT <br />
                <span style={{ color: "var(--accent-color)" }}>GETTING LEFT BEHIND?</span>
              </Heading>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--muted-text)", lineHeight: 1.7, maxWidth: "660px", margin: "0 auto" }}>
                <p style={{ marginBottom: "12px", fontWeight: 600, color: "var(--text-color)" }}>More sales do not always mean more profit.</p>
                <p>Inventory can sit too long. Discounts can quietly destroy margin. Customers can buy once and disappear. Adyant Nexa helps you identify which areas deserve attention first.</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
              <div className="glass-panel" style={{ padding: "32px", borderRadius: "16px" }}>
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.35rem", fontWeight: 700, color: "var(--text-color)", marginBottom: "10px" }}>
                  Inventory
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted-text)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  Slow-moving stock can lock up cash.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: "32px", borderRadius: "16px" }}>
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.35rem", fontWeight: 700, color: "var(--text-color)", marginBottom: "10px" }}>
                  Margins
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted-text)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  Discounting can reduce the profit from every sale.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: "32px", borderRadius: "16px" }}>
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.35rem", fontWeight: 700, color: "var(--text-color)", marginBottom: "10px" }}>
                  Customers
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted-text)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  Low repeat purchase can make acquisition more expensive.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ─── 3. HOW IT WORKS ─── */}
        <section style={{ padding: "clamp(4rem, 8vw, 6rem) 1.5rem", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(8,8,8,0.7)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: "16px" }}>
                HOW IT WORKS
              </span>
              <Heading level="h2" style={{ textAlign: "center" }}>
                FROM NUMBERS TO CLARITY.
              </Heading>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "32px", marginBottom: "48px" }}>
              <div className="glass-panel" style={{ padding: "32px", borderRadius: "16px" }}>
                <span className="editorial-tag" style={{ fontSize: "12px", color: "var(--accent-color)", display: "block", marginBottom: "12px" }}>
                  01
                </span>
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.25rem", fontWeight: 700, color: "var(--text-color)", marginBottom: "10px" }}>
                  Tell us about your business
                </h3>
                <p style={{ fontFamily: "var(--font-geist-mono)", color: "var(--muted-text)", fontSize: "13px", lineHeight: 1.6 }}>
                  Answer a few questions about sales, inventory, margins and customers.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: "32px", borderRadius: "16px" }}>
                <span className="editorial-tag" style={{ fontSize: "12px", color: "var(--accent-color)", display: "block", marginBottom: "12px" }}>
                  02
                </span>
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.25rem", fontWeight: 700, color: "var(--text-color)", marginBottom: "10px" }}>
                  Get your Growth Score
                </h3>
                <p style={{ fontFamily: "var(--font-geist-mono)", color: "var(--muted-text)", fontSize: "13px", lineHeight: 1.6 }}>
                  Our assessment analyzes the information you provide.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: "32px", borderRadius: "16px" }}>
                <span className="editorial-tag" style={{ fontSize: "12px", color: "var(--accent-color)", display: "block", marginBottom: "12px" }}>
                  03
                </span>
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.25rem", fontWeight: 700, color: "var(--text-color)", marginBottom: "10px" }}>
                  See your opportunities
                </h3>
                <p style={{ fontFamily: "var(--font-geist-mono)", color: "var(--muted-text)", fontSize: "13px", lineHeight: 1.6 }}>
                  Get a clear view of the areas worth investigating first.
                </p>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <Link
                href="/assessment"
                className="btn-primary"
                style={{
                  borderRadius: "9999px",
                  padding: "16px 32px",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                Start Free Assessment <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        </section>

        {/* ─── 4. SAMPLE RESULT (PROOF OF OUTPUT) ─── */}
        <section style={{ padding: "clamp(4rem, 8vw, 6rem) 1.5rem", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(2,2,2,0.85)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span className="editorial-tag" style={{ display: "block", marginBottom: "16px" }}>
                YOUR RESULT
              </span>
              <Heading level="h2" style={{ textAlign: "center" }}>
                SEE WHAT YOU'LL DISCOVER.
              </Heading>
            </div>

            {/* Mock Result Card */}
            <div className="glass-panel" style={{ padding: "clamp(24px, 4vw, 40px)", borderRadius: "24px", border: "1px solid rgba(0,242,255,0.3)", boxShadow: "0 0 50px rgba(0,242,255,0.06)" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", borderBottom: "1px solid var(--border-color)", paddingBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <span className="editorial-tag" style={{ fontSize: "9px", opacity: 0.6 }}>SAMPLE DIAGNOSTIC REPORT_</span>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.35rem", fontWeight: 700, color: "var(--text-color)", marginTop: "4px" }}>Growth Assessment Summary</h3>
                </div>
                <span className="editorial-tag" style={{ fontSize: "9px", color: "var(--accent-color)", padding: "4px 12px", border: "1px solid var(--accent-color)", borderRadius: "9999px" }}>
                  Illustrative example
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", marginBottom: "32px" }}>
                {/* Score Box */}
                <div style={{ backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
                  <span className="editorial-tag" style={{ fontSize: "9px", opacity: 0.6 }}>GROWTH SCORE</span>
                  <div style={{ fontFamily: "var(--font-syne)", fontSize: "3.2rem", fontWeight: 800, color: "var(--accent-color)", marginTop: "4px", lineHeight: 1 }}>
                    67 <span style={{ fontSize: "1.25rem", color: "var(--muted-text)", fontWeight: 400 }}>/ 100</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--text-color)", marginTop: "8px", display: "block" }}>Moderate Growth Efficiency</span>
                </div>

                {/* Opportunity Box */}
                <div style={{ backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span className="editorial-tag" style={{ fontSize: "9px", opacity: 0.6 }}>ESTIMATED OPPORTUNITY</span>
                  <div style={{ fontFamily: "var(--font-syne)", fontSize: "1.75rem", fontWeight: 800, color: "#FFFFFF", marginTop: "8px" }}>
                    ₹8,50,000 – ₹14,20,000
                  </div>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--muted-text)", marginTop: "6px" }}>Annual profit recovery potential</span>
                </div>
              </div>

              {/* Areas to Investigate */}
              <div style={{ marginBottom: "32px" }}>
                <span className="editorial-tag" style={{ fontSize: "9px", display: "block", marginBottom: "16px", opacity: 0.6 }}>AREAS TO INVESTIGATE_</span>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)", padding: "14px 20px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "var(--text-color)", fontWeight: 600 }}>Inventory Capital Lock</span>
                    <span className="editorial-tag" style={{ fontSize: "10px", color: "var(--accent-color)" }}>High potential</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)", padding: "14px 20px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "var(--text-color)", fontWeight: 600 }}>Discount Margin Erosion</span>
                    <span className="editorial-tag" style={{ fontSize: "10px", color: "var(--muted-text)" }}>Medium potential</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)", padding: "14px 20px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "var(--text-color)", fontWeight: 600 }}>Customer Retention LTV</span>
                    <span className="editorial-tag" style={{ fontSize: "10px", color: "var(--accent-color)" }}>High potential</span>
                  </div>
                </div>
              </div>

              <p style={{ textAlign: "center", fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--muted-text)", marginBottom: "24px" }}>
                Your actual result is calculated from the information you provide.
              </p>

              <div>
                <Link
                  href="/assessment"
                  className="btn-primary"
                  style={{
                    borderRadius: "9999px",
                    padding: "16px 32px",
                    fontSize: "13px",
                    fontWeight: 700,
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  Calculate Mine Free <ArrowRight size={16} />
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* ─── 5. TRUST / METHODOLOGY ─── */}
        <section style={{ padding: "clamp(4rem, 6vw, 5rem) 1.5rem", borderTop: "1px solid var(--border-color)" }}>
          <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
            <Heading level="h2" style={{ textAlign: "center", marginBottom: "16px" }}>
              NO GUESSWORK. NO GUARANTEES.
            </Heading>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--muted-text)", lineHeight: 1.7, marginBottom: "24px" }}>
              Your result is based on the information you provide and the assumptions used by our assessment model. We show estimated opportunities — not guaranteed savings or revenue.
            </p>
            <Link
              href="/how-it-works"
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--accent-color)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              See Our Methodology &rarr;
            </Link>
          </div>
        </section>

        {/* ─── 6. FINAL CTA ─── */}
        <section style={{ padding: "clamp(5rem, 10vw, 7rem) 1.5rem", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(8,8,8,0.7)", textAlign: "center" }}>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <Heading level="h2" style={{ textAlign: "center", marginBottom: "16px" }}>
              FIND YOUR OPPORTUNITY <br />
              <span style={{ color: "var(--accent-color)" }}>IN 4 MINUTES.</span>
            </Heading>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "16px", color: "var(--muted-text)", marginBottom: "36px" }}>
              Free to start. No sales pitch required.
            </p>
            <Link
              href="/assessment"
              className="btn-primary"
              style={{
                borderRadius: "9999px",
                padding: "18px 40px",
                fontSize: "13px",
                fontWeight: 700,
                boxShadow: "0 0 40px rgba(0,242,255,0.25)",
                marginBottom: "20px",
              }}
            >
              Start Free Assessment <ArrowRight size={16} />
            </Link>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--muted-text)", opacity: 0.6, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "16px" }}>
              Built for Indian fashion &amp; apparel retailers.
            </p>
          </div>
        </section>

      </main>

      {/* ─── 7. FOOTER ─── */}
      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "4rem 1.5rem 3rem", backgroundColor: "var(--bg-color)", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2.5rem", marginBottom: "3rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px" }}>
              <div>
                <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "8px" }}>
                  <img src="/Favicon transparent.png" alt="Adyant Nexa" width={24} height={24} />
                  <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "1.15rem", color: "var(--text-color)", letterSpacing: "-0.02em" }}>
                    ADYANT NEXA
                  </span>
                </Link>
                <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted-text)", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                  Business Growth Intelligence Platform for Indian Fashion &amp; Apparel Retailers.
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
                <span className="editorial-tag" style={{ fontSize: "9px", marginBottom: "4px" }}>PLATFORM_</span>
                <Link href="/assessment" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>Assessment</Link>
                <Link href="/tools" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>Tools</Link>
                <Link href="/how-it-works" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>How It Works</Link>
                <Link href="/contact" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>Contact</Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <span className="editorial-tag" style={{ fontSize: "9px", marginBottom: "4px" }}>LEGAL_</span>
                <Link href="/contact" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>Privacy</Link>
                <Link href="/contact" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>Terms</Link>
                <Link href="/how-it-works" style={{ color: "var(--muted-text)", textDecoration: "none", transition: "color 0.2s ease" }}>Diagnostic Disclaimer</Link>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "24px", textAlign: "center", fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--muted-text)", opacity: 0.6 }}>
            &copy; 2026 Adyant Nexa.
          </div>

        </div>
      </footer>

    </div>
  );
}
