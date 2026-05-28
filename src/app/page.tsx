"use client";

import { useEffect, useState, memo, useRef } from "react";
import Lenis from "lenis";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";

// ─── Above the fold: loaded immediately ───────────────────────────────────────
import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { useNeuralTransition } from "@/context/TransitionContext";
import { SectionSkeleton } from "@/components/SkeletonLoader";

// ─── Below the fold: lazy loaded for performance ──────────────────────────────
const SocialProof = dynamic(() => import("@/components/SocialProof").then(m => ({ default: m.SocialProof })), { loading: () => <SectionSkeleton />, ssr: false });
const ServicesSection = dynamic(() => import("@/components/ServicesSection").then(m => ({ default: m.ServicesSection })), { loading: () => <SectionSkeleton />, ssr: false });
const ArchitectureSection = dynamic(() => import("@/components/ArchitectureSection").then(m => ({ default: m.ArchitectureSection })), { loading: () => <SectionSkeleton />, ssr: false });
const ROICalculator = dynamic(() => import("@/components/ROICalculator").then(m => ({ default: m.ROICalculator })), { loading: () => <SectionSkeleton />, ssr: false });
const PricingSection = dynamic(() => import("@/components/PricingSection").then(m => ({ default: m.PricingSection })), { loading: () => <SectionSkeleton />, ssr: false });
const ContactSection = dynamic(() => import("@/components/ContactSection").then(m => ({ default: m.ContactSection })), { loading: () => <SectionSkeleton />, ssr: false });
const InfoSection = dynamic(() => import("@/components/InfoSection").then(m => ({ default: m.InfoSection })), { loading: () => <SectionSkeleton />, ssr: false });
const MarketingUpsell = dynamic(() => import("@/components/MarketingUpsell").then(m => ({ default: m.MarketingUpsell })), { loading: () => <SectionSkeleton />, ssr: false });
const ScannerModal = dynamic(() => import("@/components/ScannerModal").then(m => ({ default: m.ScannerModal })), { ssr: false });
const NeuralGalaxyPro = dynamic(() => import("@/components/NeuralGalaxyPro"), { ssr: false });

// Memoize static layout parts for zero-overhead re-renders
const MemoizedSocialProof = memo(SocialProof);
const MemoizedArchitecture = memo(ArchitectureSection);
const MemoizedInfo = memo(InfoSection);


export default function AdyantNexa() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [heroUrl, setHeroUrl] = useState("");
  const lenisRef = useRef<Lenis | null>(null);
  
  const { isNavigating, triggerTransition, currency, setCurrency } = useNeuralTransition();

  // Scroll Parallax Engine (Adyant Nexa 2.0)
  const { scrollYProgress } = useScroll();
  const gridScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.04, 0.98]);
  const gridSkewY = useTransform(scrollYProgress, [0, 1], [0, -1]);
  const pageTranslateZ = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 10, 10, 0]);

  // Snappy Scroll Protocol (Lenis)
  useEffect(() => {
    const lenis = new Lenis({ 
      duration: 0.95,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true 
    });
    
    lenisRef.current = lenis;
    window.lenis = lenis;

    const raf = (t: number) => { 
      lenis.raf(t); 
      requestAnimationFrame(raf); 
    };
    requestAnimationFrame(raf);
    
    // Cross-page Hash Scroll Protocol
    let timer: NodeJS.Timeout | null = null;
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      timer = setTimeout(() => {
        lenis.scrollTo(hash, { offset: -60, duration: 1.5 });
      }, 800);
    }

    return () => {
      if (timer) clearTimeout(timer);
      lenis.destroy();
    };
  }, []);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    triggerTransition(target, lenisRef.current);
  };

  const handleScanRequest = (url: string) => {
    setHeroUrl(url);
    setIsScannerOpen(true);
  };

  return (
    <div style={{ background: "var(--bg-color)", minHeight: "100vh", overflowX: "hidden", position: "relative", transition: "background-color 0.4s ease" }}>
      
      {/* 3D Global Space Event-Horizon Backdrop (Adyant Nexa 3D Scroll Universe) */}
      <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", opacity: 0.9 }}>
        <NeuralGalaxyPro />
      </div>

      {/* 3D Cosmic HUD Grid Backdrop (Adyant Nexa 2.0 Parallax Engine) */}
      <motion.div 
        className="hud-grid" 
        style={{ 
          scale: gridScale,
          skewY: gridSkewY,
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0
        }} 
      />

      <motion.main
        animate={{ 
          opacity: isNavigating ? 0 : 1,
          filter: isNavigating ? "blur(10px)" : "blur(0px)",
          scale: isNavigating ? 0.98 : 1
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <HeroSection onScan={handleScanRequest} />
        <ProblemSection />
        <div id="work"><MemoizedSocialProof /></div>
        <div id="services"><ServicesSection /></div>
        <MemoizedArchitecture />
        <ROICalculator currency={currency} />
        <MarketingUpsell onNavigate={handleNavigate} currency={currency} />
        <div id="investment"><PricingSection currency={currency} setCurrency={setCurrency} onAudit={() => setIsScannerOpen(true)} /></div>
        <ContactSection currency={currency} />
        <div id="about"><MemoizedInfo /></div>
      </motion.main>


      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "60px 28px", background: "var(--bg-color)", transition: "all 0.4s ease" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Favicon transparent.png" alt="Adyant Nexa" width={28} height={28} />
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 15, color: "var(--text-color)", transition: "color 0.4s ease" }}>ADYANT NEXA</span>
          </div>
          <span className="editorial-tag" style={{ fontSize: 9, opacity: 0.3 }}>© 2026 Adyant Nexa. Built for Dominance.</span>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/legal" className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, textDecoration: "none" }}>Privacy Policy</Link>
            <Link href="/legal" className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, textDecoration: "none" }}>Terms of Service</Link>
            <Link href="/legal" className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, textDecoration: "none" }}>Refund Policy</Link>
          </div>
        </div>
      </footer>

      <ScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => { setIsScannerOpen(false); setHeroUrl(""); }} 
        initialUrl={heroUrl}
        currency={currency}
      />
    </div>
  );
}
