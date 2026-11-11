"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNeuralTransition } from "@/context/TransitionContext";

declare global {
  interface Window {
    lenis: any;
  }
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { triggerTransition } = useNeuralTransition();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Architecture", href: "/#architecture", mobileLabel: "Architecture" },
    { label: "Fleet", href: "/#portfolio", mobileLabel: "Developer Fleet" },
    { label: "Diagnostic", href: "/#diagnostic", mobileLabel: "Lead Diagnostic" },
    { label: "Yield", href: "/#roi", mobileLabel: "Yield Calculator" },
    { label: "Founding 3", href: "/#founding-offer", mobileLabel: "Founding 3 Dubai Offer", highlight: true }
  ];

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    triggerTransition(href, window.lenis ?? null);
  };

  if (pathname === "/admin") {
    return null;
  }

  return (
    <>
      <nav style={{ 
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 2000, 
        background: scrolled ? "rgba(248, 248, 250, 0.94)" : "rgba(248, 248, 250, 0.88)", 
        backdropFilter: "blur(14px)", 
        WebkitBackdropFilter: "blur(14px)", 
        borderBottom: "1px solid rgba(10, 10, 12, 0.08)", 
        padding: scrolled ? "12px 0" : "18px 0",
        transition: "all 0.25s ease",
      }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
          {/* Official Brand Logo from /images/logo.svg */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href="/" onClick={(e) => handleLinkClick(e, "/")} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }} aria-label="Adyant Nexa Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/logo.svg" 
                alt="Adyant Nexa Logo" 
                style={{ 
                  height: 32, 
                  width: 32, 
                  objectFit: "contain",
                  borderRadius: 6
                }} 
              />
              <span style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: 16, color: "#0A0A0C", letterSpacing: "-0.02em" }}>
                ADYANT <span style={{ color: "#0047FF" }}>NEXA.</span>
              </span>
            </Link>
          </div>

          {/* Streamlined Desktop Navigation Links */}
          <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  onClick={(e) => handleLinkClick(e, link.href)} 
                  style={{ 
                    fontFamily: "var(--font-geist-mono), monospace", 
                    fontSize: 11, 
                    fontWeight: link.highlight ? 700 : 500, 
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "7px 14px", 
                    borderRadius: "9999px", 
                    color: link.highlight ? "#0047FF" : isActive ? "#0A0A0C" : "#60606A", 
                    background: link.highlight ? "rgba(0, 71, 255, 0.08)" : isActive ? "rgba(10, 10, 12, 0.05)" : "transparent",
                    textDecoration: "none", 
                    transition: "all 0.15s ease" 
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link 
              href="/terminal" 
              onClick={(e) => handleLinkClick(e, "/terminal")} 
              style={{ 
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 11, 
                fontWeight: 600,
                padding: "8px 16px", 
                borderRadius: "9999px",
                border: "1px solid rgba(10, 10, 12, 0.12)",
                background: "#FFFFFF",
                color: "#0A0A0C",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease"
              }}
              aria-label="Explore Internal Demo Terminal"
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
              Terminal ↗
            </Link>

            <a 
              href="https://wa.me/?text=Hi%2C%20I%20am%20a%20Dubai%20Real%20Estate%20Agency%20Principal.%20I%20want%20to%20see%20the%20Nexa%20AI%20Sales%20Engine%20demo."
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 11, 
                fontWeight: 600,
                padding: "8px 18px", 
                borderRadius: "9999px",
                border: "1px solid #0047FF",
                background: "#0047FF",
                color: "#FFFFFF",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease"
              }}
              aria-label="Connect on WhatsApp (opens in new window)"
            >
              WhatsApp ↗
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="mobile-toggle" 
            onClick={() => setIsOpen(!isOpen)} 
            aria-label="Toggle navigation menu"
            style={{ 
              background: "#FFFFFF", 
              border: "1px solid rgba(10, 10, 12, 0.12)", 
              color: "#0A0A0C", 
              alignItems: "center", 
              padding: 8, 
              borderRadius: "50%", 
              zIndex: 2010, 
              cursor: "pointer" 
            }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <style jsx>{`
          .desktop-only { display: flex; }
          .mobile-toggle { display: none; }
          
          @media (max-width: 1080px) {
            .desktop-only { display: none !important; }
            .mobile-toggle { display: flex !important; }
          }
        `}</style>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2090, backdropFilter: "blur(6px)" }}
            />
            
            <motion.div 
              initial={{ opacity: 0, x: "100%" }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              style={{ 
                position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 320, 
                background: "#FFFFFF", 
                borderLeft: "1px solid rgba(10, 10, 12, 0.08)",
                padding: "32px 24px", 
                display: "flex", flexDirection: "column", gap: 20,
                zIndex: 2100,
                boxShadow: "-10px 0 40px rgba(0,0,0,0.08)",
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 10, color: "#0047FF", letterSpacing: "0.2em", fontWeight: 700 }}>
                  DUBAI OS NAVIGATION
                </span>
                <button 
                  onClick={() => setIsOpen(false)} 
                  aria-label="Close navigation menu"
                  style={{ background: "rgba(10, 10, 12, 0.05)", border: "none", color: "#0A0A0C", padding: 8, borderRadius: "50%", cursor: "pointer" }}
                >
                  <X size={18} />
                </button>
              </div>

              {navLinks.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link 
                    href={link.href} 
                    onClick={(e) => handleLinkClick(e, link.href)} 
                    style={{ 
                      fontFamily: "var(--font-syne), sans-serif", 
                      fontSize: 18, 
                      fontWeight: 700, 
                      color: link.highlight ? "#0047FF" : "#0A0A0C", 
                      textDecoration: "none",
                      display: "block"
                    }}
                  >
                    {link.mobileLabel || link.label}
                  </Link>
                </motion.div>
              ))}
              
              <div style={{ marginTop: "auto", paddingTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                <Link 
                  href="/terminal" 
                  onClick={(e) => handleLinkClick(e, "/terminal")} 
                  style={{ 
                    textAlign: "center", 
                    padding: "12px", 
                    display: "block", 
                    textDecoration: "none", 
                    borderRadius: "9999px", 
                    fontWeight: 600, 
                    fontSize: 12,
                    background: "#F8F8FA",
                    border: "1px solid rgba(10, 10, 12, 0.12)",
                    color: "#0A0A0C"
                  }}
                >
                  Live Demo Terminal ↗
                </Link>

                <a 
                  href="https://wa.me/?text=Hi%2C%20I%20am%20a%20Dubai%20Real%20Estate%20Agency%20Principal.%20I%20want%20to%20see%20the%20Nexa%20AI%20Sales%20Engine%20demo."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    textAlign: "center", 
                    padding: "12px", 
                    display: "block", 
                    textDecoration: "none", 
                    borderRadius: "9999px", 
                    fontWeight: 700, 
                    fontSize: 13,
                    background: "#0047FF",
                    color: "#FFFFFF"
                  }}
                >
                  Connect WhatsApp ↗
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
