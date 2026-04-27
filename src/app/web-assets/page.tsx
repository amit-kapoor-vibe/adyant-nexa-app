"use client";

import { useNeuralTransition } from "@/context/TransitionContext";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SectionSkeleton } from "@/components/SkeletonLoader";
import { WebAssetsHero } from "@/components/web-assets/WebAssetsHero";
import { ROICalculator } from "@/components/ROICalculator";
import { FadeSection } from "@/components/FadeSection";
import { Heading } from "@/components/ui/Heading";
import { Zap, Shield, Cpu, BarChart3 } from "lucide-react";

// ─── Lazy Loaded Components ───
const ScannerModal = dynamic(() => import("@/components/ScannerModal").then(m => ({ default: m.ScannerModal })), { ssr: false });

export default function WebAssetsPage() {
  const { isNavigating, currency } = useNeuralTransition();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#020202", color: "#E5E5E5", overflowX: "hidden", fontFamily: "var(--font-inter)" }}>
      
      <motion.main
        animate={{ opacity: isNavigating ? 0 : 1, filter: isNavigating ? "blur(10px)" : "blur(0px)", scale: isNavigating ? 0.98 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <WebAssetsHero onAudit={() => setIsScannerOpen(true)} />

        {/* ─── THE ROI ENGINE ─── */}
        <section id="roi-engine" style={{ padding: "clamp(4rem, 8vw, 7rem) 20px", background: "#080808", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 20, display: "block", fontSize: 9 }}>REVENUE PROJECTION ENGINE_</span>
              <Heading level="h2">Calculate Your <span style={{ color: "#00F2FF" }}>Neural Impact.</span></Heading>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(255,255,255,0.4)", maxWidth: 600, margin: "24px auto 0" }}>
                See exactly how much revenue you are leaving on the table with your current infrastructure.
              </p>
            </div>
            <ROICalculator />
          </div>
        </section>

        {/* ─── CAPABILITIES ─── */}
        <section style={{ padding: "clamp(4rem, 8vw, 7rem) 20px", background: "#020202" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
              <FadeSection>
                <div className="glass-panel" style={{ padding: 40, height: "100%" }}>
                  <Cpu size={32} color="#00F2FF" style={{ marginBottom: 24 }} />
                  <Heading level="h3" style={{ fontSize: 24, marginBottom: 16 }}>Next-Gen Stack</Heading>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                    Built with Next.js 15, Turbopack, and React 19. Our assets load in under 1s, ensuring zero bounce rate due to latency.
                  </p>
                </div>
              </FadeSection>

              <FadeSection delay={0.1}>
                <div className="glass-panel" style={{ padding: 40, height: "100%" }}>
                  <Shield size={32} color="#00F2FF" style={{ marginBottom: 24 }} />
                  <Heading level="h3" style={{ fontSize: 24, marginBottom: 16 }}>Bulletproof Ops</Heading>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                    Server-side precision means your data is secure and your tracking is unblockable by iOS 14+ or ad-blockers.
                  </p>
                </div>
              </FadeSection>

              <FadeSection delay={0.2}>
                <div className="glass-panel" style={{ padding: 40, height: "100%" }}>
                  <BarChart3 size={32} color="#00F2FF" style={{ marginBottom: 24 }} />
                  <Heading level="h3" style={{ fontSize: 24, marginBottom: 16 }}>Conversion First</Heading>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                    Every pixel is tested for conversion. We don&apos;t just build pretty sites; we build high-velocity revenue engines.
                  </p>
                </div>
              </FadeSection>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section style={{ padding: "100px 20px", background: "linear-gradient(to bottom, #020202, #080808)", textAlign: "center" }}>
          <FadeSection>
            <Heading level="h2" style={{ marginBottom: 32 }}>Ready to Upgrade to an <span style={{ color: "#00F2FF" }}>Asset?</span></Heading>
            <button onClick={() => setIsScannerOpen(true)} className="btn-primary" style={{ padding: "20px 48px", fontSize: 12 }}>Initiate Neural Audit</button>
          </FadeSection>
        </section>
      </motion.main>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "60px 28px", background: "#080808" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/Favicon transparent.png" alt="Adyant Nexa" width={28} height={28} />
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 15, color: "#fff" }}>ADYANT NEXA</span>
          </div>
          <span className="editorial-tag" style={{ fontSize: 9, opacity: 0.3 }}>© 2026 Adyant Nexa. Elite Digital Real Estate.</span>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/legal" className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, textDecoration: "none" }}>Privacy Policy</Link>
            <Link href="/legal" className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, textDecoration: "none" }}>Terms of Service</Link>
          </div>
        </div>
      </footer>

      <ScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        currency={currency}
      />
    </div>
  );
}
