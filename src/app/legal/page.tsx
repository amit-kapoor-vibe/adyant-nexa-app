"use client";

import { useNeuralTransition } from "@/context/TransitionContext";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";
import Link from "next/link";
import { FadeSection } from "@/components/FadeSection";

export default function LegalPage() {
  const [lenisRef, setLenisRef] = useState<Lenis | null>(null);
  const { isNavigating } = useNeuralTransition();

  useEffect(() => {
    const lenis = new Lenis({ duration: 0.95 });
    setLenisRef(lenis);
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#020202", color: "#E5E5E5", overflowX: "hidden", fontFamily: "var(--font-inter)" }}>
      {/* ─── NAVIGATION ─── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(2,2,2,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "20px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <img src="/Favicon transparent.png" alt="Adyant Nexa" width={28} height={28} />
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 14, color: "#fff" }}>ADYANT NEXA</span>
          </Link>
          <Link href="/" className="btn-primary" style={{ fontSize: 10, padding: "8px 24px" }}>Back to Nexus</Link>
        </div>
      </nav>

      <motion.main
        animate={{ opacity: isNavigating ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{ padding: "160px 28px 100px", maxWidth: 800, margin: "0 auto" }}
      >
        <FadeSection>
          <span className="editorial-tag" style={{ display: "block", marginBottom: 24, color: "#00F2FF" }}>Legal Protocols_</span>
          <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "3rem", marginBottom: 64 }}>Transparency <br /> <span style={{ color: "rgba(255,255,255,0.2)" }}>By Design.</span></h1>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "1.5rem", marginBottom: 24, color: "#00F2FF" }}>01. Privacy Protocol</h2>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, lineHeight: 1.8, color: "rgba(229,229,229,0.5)" }}>
              We collect minimal data necessary for performance optimization. Any data captured via our Server-Side CAPI is owned 100% by the client. We do not sell or rent your data to third parties.
            </p>
          </section>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "1.5rem", marginBottom: 24, color: "#00F2FF" }}>02. Strategic Terms</h2>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, lineHeight: 1.8, color: "rgba(229,229,229,0.5)" }}>
              Adyant Nexa operates as a growth partner. While we optimize for maximum revenue, ad spend and tool costs are billed directly to the client. Retainers are due 100% upfront at the start of each service month.
            </p>
          </section>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "1.5rem", marginBottom: 24, color: "#00F2FF" }}>03. Refund Policy</h2>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, lineHeight: 1.8, color: "rgba(229,229,229,0.5)" }}>
              Due to the high-intensity technical setup required, commitment fees for the "Systems Build" phase are non-refundable once work begins. Retainers can be canceled with a 30-day notice.
            </p>
          </section>
        </FadeSection>
      </motion.main>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "60px 28px", textAlign: "center" }}>
        <p className="editorial-tag" style={{ fontSize: 10, opacity: 0.3 }}>© 2026 Adyant Nexa. Proprietary Legal Framework.</p>
      </footer>
    </div>
  );
}
