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
    { label: "Solutions", href: "/solutions/fashion-retail" },
    { label: "Assessment", href: "/assessment" },
    { label: "Tools", href: "/tools" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Contact", href: "/contact" }
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
        background: scrolled ? "rgba(2,2,2,0.92)" : "transparent", 
        backdropFilter: scrolled ? "blur(16px)" : "none", 
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none", 
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent", 
        padding: scrolled ? "14px 0" : "24px 0",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href="/" onClick={(e) => handleLinkClick(e, "/")} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <img src="/Favicon transparent.png" alt="Adyant Nexa" width={26} height={26} />
              <span style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: 15, color: "#FFFFFF", letterSpacing: "0.02em" }}>
                ADYANT NEXA
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.label} href={link.href} onClick={(e) => handleLinkClick(e, link.href)} 
                  style={{ 
                    fontFamily: "var(--font-inter), sans-serif", 
                    fontSize: 13, 
                    fontWeight: 500, 
                    padding: "8px 16px", 
                    borderRadius: "9999px", 
                    color: isActive ? "#00F2FF" : "rgba(229,229,229,0.7)", 
                    background: isActive ? "rgba(0,242,255,0.06)" : "transparent",
                    textDecoration: "none", 
                    transition: "all 0.2s ease" 
                  }}>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Button */}
          <div className="desktop-only" style={{ display: "flex", alignItems: "center" }}>
            <Link href="/assessment" onClick={(e) => handleLinkClick(e, "/assessment")} className="btn-primary" style={{ fontSize: 12, padding: "10px 22px", borderRadius: "9999px", fontWeight: 700 }}>
              Start Free Assessment
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFFFFF", alignItems: "center", padding: 8, borderRadius: "50%", zIndex: 2010, cursor: "pointer" }}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <style jsx>{`
          .desktop-only { display: flex; }
          .mobile-toggle { display: none; }
          
          @media (max-width: 900px) {
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2090, backdropFilter: "blur(6px)" }}
            />
            
            <motion.div 
              initial={{ opacity: 0, x: "100%" }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              style={{ 
                position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 300, 
                background: "#080808", 
                borderLeft: "1px solid rgba(255,255,255,0.1)",
                padding: "36px 28px", 
                display: "flex", flexDirection: "column", gap: 24,
                zIndex: 2100,
                boxShadow: "-10px 0 40px rgba(0,0,0,0.8)",
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontFamily: "Geist Mono, monospace", fontSize: 10, color: "#00F2FF", letterSpacing: "0.2em" }}>NAVIGATION</span>
                <button onClick={() => setIsOpen(false)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#FFFFFF", padding: 8, borderRadius: "50%", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              </div>

              {navLinks.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={link.href} onClick={(e) => handleLinkClick(e, link.href)} 
                    style={{ 
                      fontFamily: "var(--font-syne), sans-serif", 
                      fontSize: 22, 
                      fontWeight: 700, 
                      color: pathname === link.href ? "#00F2FF" : "#E5E5E5", 
                      textDecoration: "none",
                      display: "block"
                    }}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <div style={{ marginTop: "auto", paddingTop: 20 }}>
                <Link href="/assessment" onClick={(e) => handleLinkClick(e, "/assessment")} className="btn-primary" style={{ textAlign: "center", padding: "14px", display: "block", textDecoration: "none", borderRadius: "9999px", fontWeight: 700, fontSize: 13 }}>
                  Start Free Assessment
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
