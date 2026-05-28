"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNeuralTransition } from "@/context/TransitionContext";

// Extend Window for Lenis global
declare global {
  interface Window {
    lenis?: { scrollTo: (target: number | string | HTMLElement, opts?: Record<string, unknown>) => void };
  }
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { triggerTransition, currency, setCurrency } = useNeuralTransition();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pricingHref = pathname === "/marketing" ? "/marketing#pricing" : "/#investment";

  const desktopLinks = [
    { label: "Genesis", href: "/" },
    { label: "Marketing", href: "/marketing" },
    { label: "Web Assets", href: "/web-assets" },
    { label: "Pricing", href: pricingHref },
    { label: "Journal", href: "/journal" }
  ];

  const mobileLinks = [
    { label: "Genesis", href: "/" },
    { label: "Marketing", href: "/marketing" },
    { label: "Web Assets", href: "/web-assets" },
    { label: "Pricing", href: pricingHref },
    { label: "Journal", href: "/journal" }
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
        background: scrolled ? "rgba(2,2,2,0.9)" : "transparent", 
        backdropFilter: scrolled ? "blur(20px)" : "none", 
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none", 
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent", 
        padding: scrolled ? "12px 0" : "24px 0",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: "translate3d(0, 0, 0)",
        WebkitTransform: "translate3d(0, 0, 0)"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
          {/* 1. Left container (Logo) - Flex 1 */}
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
            <Link href="/" onClick={(e) => handleLinkClick(e, "/")} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
              <img src="/Favicon transparent.png" alt="Adyant Nexa" width={28} height={28} />
              <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 14, color: "var(--text-color)", letterSpacing: "-0.01em", transition: "color 0.4s ease" }}>ADYANT NEXA</span>
            </Link>
          </div>

          {/* 2. Center container (Navigation Links) - Centered */}
          <div className="desktop-only" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", background: "var(--glass-bg)", padding: "4px", borderRadius: "100px", border: "1px solid var(--border-color)", transition: "all 0.4s ease" }}>
              {desktopLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.label} href={link.href} onClick={(e) => handleLinkClick(e, link.href)} 
                    style={{ 
                      fontFamily: "var(--font-inter)", 
                      fontSize: 12, 
                      fontWeight: 600, 
                      padding: "8px 20px", 
                      borderRadius: "100px", 
                      color: isActive ? "var(--accent-color)" : "rgba(255,255,255,0.5)", 
                      background: isActive ? "rgba(0,242,255,0.05)" : "transparent",
                      textDecoration: "none", 
                      transition: "all 0.4s ease" 
                    }}>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 3. Right container (Action Buttons) - Flex 1 */}
          <div className="desktop-only" style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: 16, alignItems: "center" }}>


            <div style={{ display: "flex", background: "var(--glass-bg)", border: "1px solid var(--border-color)", padding: "2px", borderRadius: "100px", transition: "all 0.4s ease" }}>
              <button onClick={() => setCurrency("USD")} style={{ padding: "6px 12px", borderRadius: "100px", background: currency === "USD" ? "var(--accent-color)" : "transparent", color: currency === "USD" ? "#000" : "var(--text-color)", border: "none", fontSize: 10, fontWeight: 800, cursor: "pointer", transition: "all 0.3s ease" }}>USD</button>
              <button onClick={() => setCurrency("INR")} style={{ padding: "6px 12px", borderRadius: "100px", background: currency === "INR" ? "var(--accent-color)" : "transparent", color: currency === "INR" ? "#000" : "var(--text-color)", border: "none", fontSize: 10, fontWeight: 800, cursor: "pointer", transition: "all 0.3s ease" }}>INR</button>
            </div>

            <Link href="/#contact" onClick={(e) => handleLinkClick(e, "/#contact")} className="btn-primary" style={{ fontSize: 11, padding: "12px 32px", borderRadius: "100px" }}>Engage Protocol</Link>
          </div>

          {/* Mobile Toggle */}
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ background: "var(--glass-bg)", border: "1px solid var(--border-color)", color: "var(--text-color)", alignItems: "center", padding: 10, borderRadius: "50%", position: "relative", zIndex: 2010, cursor: "pointer", transition: "all 0.4s ease" }}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <style jsx>{`
          .desktop-only { display: flex; }
          .mobile-toggle { display: none; }
          
          @media (max-width: 992px) {
            .desktop-only { display: none !important; }
            .mobile-toggle { display: flex !important; }
          }
        `}</style>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing on click outside */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 2090, backdropFilter: "blur(5px)" }}
            />
            
            <motion.div 
              initial={{ opacity: 0, x: "100%" }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ 
                position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 320, 
                background: "var(--bg-color)", 
                borderLeft: "1px solid var(--border-color)",
                padding: "40px", 
                display: "flex", flexDirection: "column", gap: 32,
                zIndex: 2100,
                boxShadow: "-20px 0 60px rgba(0,0,0,0.8)",
                overflowY: "auto",
                transition: "background-color 0.4s ease, border-color 0.4s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, color: "var(--accent-color)" }}>Navigation Systems_</span>
                <button onClick={() => setIsOpen(false)} style={{ background: "var(--glass-bg)", border: "none", color: "var(--text-color)", padding: 12, borderRadius: "50%", cursor: "pointer", transition: "all 0.4s ease" }}>
                  <X size={20} />
                </button>
              </div>

              {mobileLinks.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <Link href={link.href} onClick={(e) => handleLinkClick(e, link.href)} 
                    style={{ 
                      fontFamily: "var(--font-syne)", 
                      fontSize: 28, 
                      fontWeight: 800, 
                      color: pathname === link.href ? "var(--accent-color)" : "var(--text-color)", 
                      textDecoration: "none",
                      display: "block",
                      transition: "color 0.4s ease"
                    }}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <div style={{ marginTop: "auto" }}>
                <span className="editorial-tag" style={{ fontSize: 9, opacity: 0.3, display: "block", marginBottom: 16 }}>Region Configuration_</span>
                <div style={{ display: "flex", gap: 8, marginBottom: 16, background: "var(--glass-bg)", padding: 4, borderRadius: 8, border: "1px solid var(--border-color)", transition: "all 0.4s ease" }}>
                  <button onClick={() => setCurrency("USD")} style={{ flex: 1, padding: "12px", background: currency === "USD" ? "var(--accent-color)" : "transparent", color: currency === "USD" ? "#000" : "var(--text-color)", border: "none", fontSize: 11, fontWeight: 800, borderRadius: 6, transition: "all 0.3s ease", cursor: "pointer" }}>USD</button>
                  <button onClick={() => setCurrency("INR")} style={{ flex: 1, padding: "12px", background: currency === "INR" ? "var(--accent-color)" : "transparent", color: currency === "INR" ? "#000" : "var(--text-color)", border: "none", fontSize: 11, fontWeight: 800, borderRadius: 6, transition: "all 0.3s ease", cursor: "pointer" }}>INR</button>
                </div>

                <Link href="/#contact" onClick={(e) => handleLinkClick(e, "/#contact")} className="btn-primary" style={{ textAlign: "center", padding: 20, display: "block", textDecoration: "none", borderRadius: 8, marginBottom: 16 }}>Engage Protocol</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
