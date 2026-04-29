"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already accepted
    const consent = localStorage.getItem("nexa_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("nexa_cookie_consent", "accepted");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{
            position: "fixed",
            bottom: "32px",
            left: "32px",
            zIndex: 99999,
            maxWidth: "380px",
            width: "calc(100% - 64px)",
          }}
        >
          <div style={{
            background: "rgba(8, 8, 8, 0.9)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0, 242, 255, 0.15)",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 242, 255, 0.05)",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Subtle glow orb */}
            <div style={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "100px",
              height: "100px",
              background: "radial-gradient(circle, rgba(0, 242, 255, 0.05) 0%, transparent 70%)",
              pointerEvents: "none"
            }} />

            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ 
                padding: "10px", 
                background: "rgba(0, 242, 255, 0.05)", 
                border: "1px solid rgba(0, 242, 255, 0.2)", 
                borderRadius: "8px" 
              }}>
                <ShieldCheck size={20} color="#00F2FF" />
              </div>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  fontFamily: "var(--font-syne)", 
                  fontWeight: 800, 
                  fontSize: "13px", 
                  color: "#fff", 
                  marginBottom: "8px",
                  letterSpacing: "0.05em"
                }}>
                  NEURAL DATA PRIVACY_
                </h4>
                <p style={{ 
                  fontFamily: "var(--font-geist-mono)", 
                  fontSize: "11px", 
                  color: "rgba(229, 229, 229, 0.45)", 
                  lineHeight: "1.6",
                  marginBottom: "20px"
                }}>
                  We use cookies to optimize your neural experience and track revenue performance metrics. By continuing, you accept our elite data protocols.
                </p>
                
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={handleAccept}
                    style={{
                      flex: 1,
                      background: "#00F2FF",
                      color: "#000",
                      border: "none",
                      padding: "10px 16px",
                      fontFamily: "var(--font-geist-mono)",
                      fontWeight: 700,
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      cursor: "pointer",
                      transition: "transform 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    Accept Protocol
                  </button>
                  <button
                    onClick={() => setIsVisible(false)}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "rgba(255, 255, 255, 0.4)",
                      padding: "10px 16px",
                      fontFamily: "var(--font-geist-mono)",
                      fontWeight: 700,
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      cursor: "pointer"
                    }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
