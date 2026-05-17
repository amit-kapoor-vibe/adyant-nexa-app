"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNeuralTransition } from "@/context/TransitionContext";

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

  const desktopLinks = [
    { label: "Genesis", href: "/" },
    { label: "Marketing", href: "/marketing" },
    { label: "Web Assets", href: "/web-assets" },
    { label: "Pricing", href: "/login" },
    { label: "Journal", href: "/journal" }
  ];

  const mobileLinks = [
    { label: "Genesis", href: "/" },
    { label: "Marketing", href: "/marketing" },
    { label: "Web Assets", href: "/web-assets" },
    { label: "Pricing", href: "/login" },
    { label: "Journal", href: "/journal" }
  ];

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    triggerTransition(href, (window as any).lenis);
  };

  if (pathname === "/admin") {
    return null;
  }

  return (
    <nav style={{ 
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 2000, 
      background: scrolled ? "rgba(2,2,2,0.9)" : "transparent", 
      backdropFilter: scrolled ? "blur(20px)" : "none", 
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent", 
      padding: scrolled ? "12px 0" : "24px 0",
      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
        {/* Logo */}
        <Link href="/" onClick={(e) => handleLinkClick(e, "/")} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <img src="/Favicon transparent.png" alt="Adyant Nexa" width={28} height={28} />
          <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 14, color: "#fff", letterSpacing: "-0.01em" }}>ADYANT NEXA</span>
        </Link>

        {/* Desktop Links */}
        <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.05)" }}>
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
                    color: isActive ? "#00F2FF" : "rgba(255,255,255,0.5)", 
                    background: isActive ? "rgba(0,242,255,0.05)" : "transparent",
                    textDecoration: "none", 
                    transition: "0.3s" 
                  }}>
                  {link.label}
                </Link>
              );
            })}
          </div>
          
          <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "2px", borderRadius: "100px", marginLeft: 16 }}>
            <button onClick={() => setCurrency("USD")} style={{ padding: "6px 12px", borderRadius: "100px", background: currency === "USD" ? "#00F2FF" : "transparent", color: currency === "USD" ? "#000" : "#fff", border: "none", fontSize: 10, fontWeight: 800, cursor: "pointer", transition: "0.3s" }}>USD</button>
            <button onClick={() => setCurrency("INR")} style={{ padding: "6px 12px", borderRadius: "100px", background: currency === "INR" ? "#00F2FF" : "transparent", color: currency === "INR" ? "#000" : "#fff", border: "none", fontSize: 10, fontWeight: 800, cursor: "pointer", transition: "0.3s" }}>INR</button>
          </div>

          <a href="/#contact" onClick={(e) => handleLinkClick(e, "/#contact")} className="btn-primary" style={{ fontSize: 11, padding: "12px 32px", borderRadius: "100px", marginLeft: 16 }}>Engage Protocol</a>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", display: "flex", alignItems: "center", padding: 10, borderRadius: "50%" }}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing on click outside */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 998, backdropFilter: "blur(5px)" }}
            />
            
            <motion.div 
              initial={{ opacity: 0, x: "100%" }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ 
                position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 320, 
                background: "#020202", 
                borderLeft: "1px solid rgba(0,242,255,0.1)",
                padding: "40px", 
                display: "flex", flexDirection: "column", gap: 32,
                zIndex: 1001,
                boxShadow: "-20px 0 60px rgba(0,0,0,0.8)",
                overflowY: "auto"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span className="editorial-tag" style={{ fontSize: 9, opacity: 0.4, color: "#00F2FF" }}>Navigation Systems_</span>
                <button onClick={() => setIsOpen(false)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", padding: 12, borderRadius: "50%", cursor: "pointer" }}>
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
                      color: pathname === link.href ? "#00F2FF" : "#fff", 
                      textDecoration: "none",
                      display: "block"
                    }}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <div style={{ marginTop: "auto" }}>
                <span className="editorial-tag" style={{ fontSize: 9, opacity: 0.3, display: "block", marginBottom: 16 }}>Region Configuration_</span>
                <div style={{ display: "flex", gap: 8, marginBottom: 32, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 8 }}>
                  <button onClick={() => setCurrency("USD")} style={{ flex: 1, padding: "12px", background: currency === "USD" ? "#00F2FF" : "transparent", color: currency === "USD" ? "#000" : "#fff", border: "none", fontSize: 11, fontWeight: 800, borderRadius: 6 }}>USD</button>
                  <button onClick={() => setCurrency("INR")} style={{ flex: 1, padding: "12px", background: currency === "INR" ? "#00F2FF" : "transparent", color: currency === "INR" ? "#000" : "#fff", border: "none", fontSize: 11, fontWeight: 800, borderRadius: 6 }}>INR</button>
                </div>
                <a href="/#contact" onClick={(e) => handleLinkClick(e, "/#contact")} className="btn-primary" style={{ textAlign: "center", padding: 20, display: "block", textDecoration: "none", borderRadius: 8 }}>Engage Protocol</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .desktop-only { display: flex; }
        .mobile-toggle { display: none; }
        
        @media (max-width: 992px) {
          .desktop-only { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};
