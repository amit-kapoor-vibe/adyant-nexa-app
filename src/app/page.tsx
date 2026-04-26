"use client";

import { useEffect, useState, memo } from "react";
import Lenis from "lenis";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
const ScannerModal = dynamic(() => import("@/components/ScannerModal").then(m => ({ default: m.ScannerModal })), { ssr: false });

// Memoize static layout parts for zero-overhead re-renders
const MemoizedSocialProof = memo(SocialProof);
const MemoizedArchitecture = memo(ArchitectureSection);
const MemoizedInfo = memo(InfoSection);


export default function AdyantNexa() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [heroUrl, setHeroUrl] = useState("");
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [lenisRef, setLenisRef] = useState<Lenis | null>(null);
  
  const { isNavigating, triggerTransition } = useNeuralTransition();

  // Snappy Scroll Protocol (Lenis)
  useEffect(() => {
    const lenis = new Lenis({ 
      duration: 0.95,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true 
    });
    
    setLenisRef(lenis);

    const raf = (t: number) => { 
      lenis.raf(t); 
      requestAnimationFrame(raf); 
    };
    requestAnimationFrame(raf);
    
    // Global Location-Based Pricing (Pro Intelligence)
    const detectLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.country_code === "IN") {
          setCurrency("INR");
        } else {
          setCurrency("USD");
        }
      } catch (err) {
        console.warn("Location detection offline. Defaulting to USD.");
      }
    };
    detectLocation();

    return () => lenis.destroy();
  }, []);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    triggerTransition(target, lenisRef);
  };

  // Performance Scroll Tracking
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 40;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Cross-page Hash Scroll Protocol
  useEffect(() => {
    if (lenisRef && typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      // 800ms delay: allows Transition Overlay to fade + Lazy components to mount
      const timer = setTimeout(() => {
        lenisRef.scrollTo(hash, { offset: -60, duration: 1.5 });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [lenisRef]);

  const handleScanRequest = (url: string) => {
    setHeroUrl(url);
    setIsScannerOpen(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020202", color: "#E5E5E5", overflowX: "hidden", fontFamily: "var(--font-inter)" }}>
      <div className="ambient-orb" style={{ top: "-20%", left: "-15%" }} />
      <div className="ambient-orb" style={{ bottom: "10%", right: "-15%" }} />

      {/* ─── NAVIGATION ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "background 0.5s ease, padding 0.5s ease, border 0.5s ease, backdrop-filter 0.5s ease",
        background: scrolled ? "rgba(2,2,2,0.85)" : "rgba(2,2,2,0.2)",
        backdropFilter: scrolled ? "blur(25px)" : "blur(0px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.02)",
        padding: scrolled ? "16px 0" : "24px 0",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Favicon transparent.png" alt="Adyant Nexa" width={32} height={32} />
              <div style={{ position: "absolute", inset: -4, border: "1px solid rgba(0,242,255,0.15)", animation: "pulse-glow 2.5s ease-in-out infinite", opacity: 0.3, transform: "rotate(45deg)" }} />
            </div>
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 15, color: "#fff", letterSpacing: "-0.01em" }}>ADYANT NEXA</span>
          </a>

          <div className="nav-links" style={{ gap: 8, alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.05)" }}>
            {["Frameworks", "Marketing", "Journal", "Investment"].map(item => {
              const target = item === "Marketing" ? "/marketing" : 
                             item === "Journal" ? "/blog" :
                             item === "Frameworks" ? "#services" : 
                             item === "Investment" ? "#pricing" : `#${item.toLowerCase()}`;
              return (
                <a key={item} 
                  href={target} 
                  onClick={(e) => handleNavigate(e, target)}
                  style={{ 
                    fontFamily: "var(--font-inter)", 
                    fontSize: 13, 
                    fontWeight: 500, 
                    padding: "8px 16px",
                    borderRadius: "100px",
                    color: "rgba(255,255,255,0.6)", 
                    textDecoration: "none", 
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "inline-block"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.background = "transparent";
                  }}>
                  {item === "Frameworks" ? "Growth Frameworks" : item === "Investment" ? "Investment Tiers" : item}
                </a>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "2px" }}>
              <button onClick={() => setCurrency("USD")} style={{ padding: "4px 8px", background: currency === "USD" ? "#00F2FF" : "transparent", color: currency === "USD" ? "#000" : "#fff", border: "none", fontSize: 9, fontWeight: 700, cursor: "pointer" }}>USD</button>
              <button onClick={() => setCurrency("INR")} style={{ padding: "4px 8px", background: currency === "INR" ? "#00F2FF" : "transparent", color: currency === "INR" ? "#000" : "#fff", border: "none", fontSize: 9, fontWeight: 700, cursor: "pointer" }}>INR</button>
            </div>
            <a href="https://wa.me/918700720477" target="_blank" rel="noreferrer" className="btn-primary nav-cta" style={{ fontSize: 11, padding: "10px 24px" }}>
              WhatsApp Us
            </a>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="nav-hamburger" style={{ background: "none", border: "none", color: "#fff", padding: 8, cursor: "pointer" }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              style={{ background: "#020202", borderBottom: "1px solid rgba(255,255,255,0.04)", overflow: "hidden" }}>
              <div style={{ padding: "40px 28px", display: "flex", flexDirection: "column", gap: 24 }}>
                {["Services", "Marketing", "Work", "Pricing", "About"].map(item => (
                  <a key={item} 
                    href={item === "Marketing" ? "/marketing" : `#${item.toLowerCase()}`} 
                    onClick={(e) => { setMenuOpen(false); handleNavigate(e, item === "Marketing" ? "/marketing" : `#${item.toLowerCase()}`); }}
                    style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 24, color: "#fff", textDecoration: "none" }}>{item}</a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── SECTIONS ─── */}
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
        <div id="pricing"><PricingSection currency={currency} setCurrency={setCurrency} onAudit={() => setIsScannerOpen(true)} /></div>
        <ContactSection />
        <div id="about"><MemoizedInfo /></div>
      </motion.main>


      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "60px 28px", background: "#020202" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Favicon transparent.png" alt="Adyant Nexa" width={28} height={28} />
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 15, color: "#fff" }}>ADYANT NEXA</span>
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
