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
    { label: "Architecture", href: "/#architecture" },
    { label: "Intelligence", href: "/#intelligence" },
    { label: "Tools", href: "/tools" },
    { label: "How We Work", href: "/how-it-works" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
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
        background: scrolled ? "rgba(248, 248, 250, 0.94)" : "transparent", 
        backdropFilter: scrolled ? "blur(16px)" : "none", 
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none", 
        borderBottom: scrolled ? "1px solid rgba(10, 10, 12, 0.08)" : "1px solid transparent", 
        padding: scrolled ? "14px 0" : "24px 0",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href="/" onClick={(e) => handleLinkClick(e, "/")} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <img src="/Favicon transparent.png" alt="Adyant Nexa" width={26} height={26} />
              <span style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: 15, color: "var(--text-color)", letterSpacing: "0.02em" }}>
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
                    color: isActive ? "#0047FF" : "rgba(10, 10, 12, 0.7)", 
                    background: isActive ? "rgba(0, 71, 255, 0.06)" : "transparent",
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
              System Audit
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ background: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", color: "#0A0A0C", alignItems: "center", padding: 8, borderRadius: "50%", zIndex: 2010, cursor: "pointer" }}>
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
                background: "#FFFFFF", 
                borderLeft: "1px solid rgba(10, 10, 12, 0.08)",
                padding: "36px 28px", 
                display: "flex", flexDirection: "column", gap: 24,
                zIndex: 2100,
                boxShadow: "-10px 0 40px rgba(0,0,0,0.08)",
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 10, color: "#0047FF", letterSpacing: "0.2em" }}>NAVIGATION</span>
                <button onClick={() => setIsOpen(false)} style={{ background: "rgba(10, 10, 12, 0.05)", border: "none", color: "#0A0A0C", padding: 8, borderRadius: "50%", cursor: "pointer" }}>
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
                      color: pathname === link.href ? "#0047FF" : "#0A0A0C", 
                      textDecoration: "none",
                      display: "block"
                    }}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <div style={{ marginTop: "auto", paddingTop: 20 }}>
                <Link href="/assessment" onClick={(e) => handleLinkClick(e, "/assessment")} className="btn-primary" style={{ textAlign: "center", padding: "14px", display: "block", textDecoration: "none", borderRadius: "9999px", fontWeight: 700, fontSize: 13 }}>
                  System Audit
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
