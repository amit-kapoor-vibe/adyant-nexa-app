"use client";

import { useNeuralTransition } from "@/context/TransitionContext";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";
import Link from "next/link";
import { FadeSection } from "@/components/FadeSection";

export default function LegalPage() {
  const { isNavigating } = useNeuralTransition();

  useEffect(() => {
    const lenis = new Lenis({ duration: 0.95 });
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F8FA", color: "#0A0A0C", overflowX: "hidden", fontFamily: "var(--font-inter)" }}>

      <motion.main
        animate={{ opacity: isNavigating ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{ padding: "160px 28px 100px", maxWidth: 800, margin: "0 auto" }}
      >
        <FadeSection>
          <span className="editorial-tag" style={{ display: "block", marginBottom: 24, color: "#0047FF" }}>Legal Protocols_</span>
          <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "3rem", marginBottom: 64, color: "#0A0A0C" }}>Transparency <br /> <span style={{ color: "rgba(10, 10, 12, 0.3)" }}>By Design.</span></h1>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "1.5rem", marginBottom: 24, color: "#0047FF" }}>01. Privacy Protocol</h2>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, lineHeight: 1.8, color: "#60606A" }}>
              We collect minimal data necessary for performance optimization. Any data captured via our Server-Side CAPI is owned 100% by the client. We do not sell or rent your data to third parties.
            </p>
          </section>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "1.5rem", marginBottom: 24, color: "#0047FF" }}>02. Strategic Terms</h2>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, lineHeight: 1.8, color: "#60606A" }}>
              Adyant Nexa operates as a growth partner. While we optimize for maximum revenue, ad spend and tool costs are billed directly to the client. Retainers are due 100% upfront at the start of each service month.
            </p>
          </section>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "1.5rem", marginBottom: 24, color: "#0047FF" }}>03. Refund Policy</h2>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, lineHeight: 1.8, color: "#60606A" }}>
              Due to the high-intensity technical setup required, commitment fees for the "Systems Build" phase are non-refundable once work begins. Retainers can be canceled with a 30-day notice.
            </p>
          </section>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "1.5rem", marginBottom: 24, color: "#0047FF" }}>04. Service Continuity (Force Majeure)</h2>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, lineHeight: 1.8, color: "#60606A" }}>
              Adyant Nexa shall not be liable for any failure or delay in performance due to circumstances beyond our control, including but not limited to natural disasters, acts of war, global pandemics, or complete regional/global internet shutdowns. In such events, our obligations will be suspended, and services will resume immediately upon the restoration of stable infrastructure and public safety.
            </p>
          </section>
        </FadeSection>
      </motion.main>

      <footer style={{ borderTop: "1px solid rgba(10, 10, 12, 0.08)", padding: "60px 28px", textAlign: "center" }}>
        <p className="editorial-tag" style={{ fontSize: 10, color: "#60606A" }}>© 2026 Adyant Nexa. Proprietary Legal Framework.</p>
      </footer>
    </div>
  );
}
