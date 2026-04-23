"use client";

import { useEffect, useState, memo } from "react";
import Lenis from "lenis";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Optimized Components
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { PricingSection } from "@/components/PricingSection";
import { ContactSection } from "@/components/ContactSection";
import { SocialProof } from "@/components/SocialProof";
import { ArchitectureSection } from "@/components/ArchitectureSection";
import { InfoSection } from "@/components/InfoSection";
import { ScannerModal } from "@/components/ScannerModal";
import { CustomCursor } from "@/components/CustomCursor";

// Memoize static layout parts for zero-overhead re-renders
const MemoizedSocialProof = memo(SocialProof);
const MemoizedArchitecture = memo(ArchitectureSection);
const MemoizedInfo = memo(InfoSection);

export default function AdyantNexa() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [heroUrl, setHeroUrl] = useState("");

  // Snappy Scroll Protocol (Lenis)
  useEffect(() => {
    const lenis = new Lenis({ 
      duration: 0.95, // Targeted reduce from 1.2s for "Fast Vibe"
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true 
    });
    
    const raf = (t: number) => { 
      lenis.raf(t); 
      requestAnimationFrame(raf); 
    };
    requestAnimationFrame(raf);
    
    return () => lenis.destroy();
  }, []);

  // Performance Scroll Tracking
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 40;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleScanRequest = (url: string) => {
    setHeroUrl(url);
    setIsScannerOpen(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020202", color: "#E5E5E5", overflowX: "hidden", fontFamily: "var(--font-inter)" }}>
      <CustomCursor />
      <div className="ambient-orb" style={{ top: "-20%", left: "-15%" }} />
      <div className="ambient-orb" style={{ bottom: "10%", right: "-15%" }} />

      {/* ─── NAVIGATION ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        background: scrolled ? "rgba(2,2,2,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.04)" : "none",
        padding: scrolled ? "18px 0" : "32px 0",
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

          <div className="nav-links" style={{ gap: 48, alignItems: "center" }}>
            {["Services", "Work", "Pricing", "About"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} 
                style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#00F2FF")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
                {item}
              </a>
            ))}
          </div>

          <a href="https://wa.me/918700720477" target="_blank" rel="noreferrer" className="btn-primary nav-cta" style={{ fontSize: 11, padding: "10px 24px" }}>
            WhatsApp Us
          </a>

          <button onClick={() => setMenuOpen(!menuOpen)} className="nav-hamburger" style={{ background: "none", border: "none", color: "#fff", padding: 8, cursor: "pointer" }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              style={{ background: "#020202", borderBottom: "1px solid rgba(255,255,255,0.04)", overflow: "hidden" }}>
              <div style={{ padding: "40px 28px", display: "flex", flexDirection: "column", gap: 24 }}>
                {["Services", "Work", "Pricing", "About"].map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                    style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 24, color: "#fff", textDecoration: "none" }}>{item}</a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── SECTIONS ─── */}
      <main>
        <HeroSection onScan={handleScanRequest} />
        <MemoizedSocialProof />
        <ServicesSection />
        <MemoizedArchitecture />
        <PricingSection onAudit={() => setIsScannerOpen(true)} />
        <ContactSection />
        <MemoizedInfo />
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "60px 28px", background: "#020202" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Favicon transparent.png" alt="Adyant Nexa" width={28} height={28} />
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 15, color: "#fff" }}>ADYANT NEXA</span>
          </div>
          <span className="editorial-tag" style={{ fontSize: 9, opacity: 0.3 }}>© 2026 Adyant Nexa. Built for Dominance.</span>
          <div style={{ display: "flex", gap: 32 }}>
            <a href="#legal" className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, textDecoration: "none" }}>Privacy Policy</a>
            <a href="#legal" className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, textDecoration: "none" }}>Terms of Service</a>
          </div>
        </div>
      </footer>

      <ScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => { setIsScannerOpen(false); setHeroUrl(""); }} 
        initialUrl={heroUrl} 
      />
    </div>
  );
}
