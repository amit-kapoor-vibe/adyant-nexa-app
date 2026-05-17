"use client";

import { useNeuralTransition } from "@/context/TransitionContext";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SectionSkeleton } from "@/components/SkeletonLoader";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AdvantagesSection } from "@/components/marketing/AdvantagesSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { PhilosophySection } from "@/components/marketing/PhilosophySection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { ROIVisualizer } from "@/components/marketing/ROIVisualizer";
import { MarketingFAQ } from "@/components/marketing/MarketingFAQ";
import { FadeSection } from "@/components/FadeSection";
import { Heading } from "@/components/ui/Heading";

// ─── Lazy Loaded Components ───
const ComparisonTable = dynamic(() => import("@/components/marketing/ComparisonTable").then(m => ({ default: m.ComparisonTable })), { loading: () => <SectionSkeleton /> });
const PersonaShowcase = dynamic(() => import("@/components/marketing/PersonaShowcase").then(m => ({ default: m.PersonaShowcase })), { loading: () => <SectionSkeleton /> });
const MarketingContact = dynamic(() => import("@/components/marketing/MarketingContact").then(m => ({ default: m.MarketingContact })), { loading: () => <SectionSkeleton /> });
const ScannerModal = dynamic(() => import("@/components/ScannerModal").then(m => ({ default: m.ScannerModal })), { ssr: false });

export default function MarketingPage() {
  const { isNavigating, triggerTransition, currency } = useNeuralTransition();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, target: string) => {
    e.preventDefault();
    if (target === "#audit") {
      setIsScannerOpen(true);
    } else {
      triggerTransition(target, null); 
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020202", color: "#E5E5E5", overflowX: "hidden", fontFamily: "var(--font-inter)" }}>
      
      <motion.main
        animate={{ opacity: isNavigating ? 0 : 1, filter: isNavigating ? "blur(10px)" : "blur(0px)", scale: isNavigating ? 0.98 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <MarketingHero 
          onAudit={() => setIsScannerOpen(true)} 
          onNavigate={handleNavigate} 
        />

        <AdvantagesSection />

        <PersonaShowcase />
        <ComparisonTable />

        <PhilosophySection />
        
        <ROIVisualizer />
        <TestimonialsSection />

        <PricingSection 
          onAudit={() => setIsScannerOpen(true)} 
          currency={currency}
        />

        <MarketingFAQ />

        {/* Final CTA Section */}
        <section style={{ padding: "8rem 1.75rem", textAlign: "center", background: "#080808", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
          <FadeSection>
            <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 24, display: "block" }}>The Final Protocol_</span>
            <Heading level="h2" style={{ color: "#fff", marginBottom: 40 }}>Ready to Build Your <br /> Revenue Empire?</Heading>
            <button 
              onClick={() => setIsScannerOpen(true)}
              className="btn-primary"
              style={{ padding: "20px 48px", fontSize: 14 }}
            >
              ENGAGE NEURAL AUDIT
            </button>
          </FadeSection>
        </section>

        <MarketingContact />
      </motion.main>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "60px 28px", background: "#020202" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/Favicon transparent.png" alt="Adyant Nexa" width={28} height={28} />
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 15, color: "#fff" }}>ADYANT NEXA</span>
          </div>
          <span className="editorial-tag" style={{ fontSize: 9, opacity: 0.3 }}>© 2026 Adyant Nexa. Precision Marketing Infrastructure.</span>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/legal" className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, textDecoration: "none" }}>Privacy Policy</Link>
            <Link href="/legal" className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, textDecoration: "none" }}>Terms of Service</Link>
            <Link href="/legal" className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, textDecoration: "none" }}>Refund Policy</Link>
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
