"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface LenisInstance {
  scrollTo: (top: number, opts: { immediate: boolean }) => void;
}

interface TransitionContextType {
  isNavigating: boolean;
  triggerTransition: (target: string, lenis: LenisInstance | null) => void;
  currency: "USD" | "INR";
  setCurrency: (currency: "USD" | "INR") => void;
  isScannerOpen: boolean;
  setScannerOpen: (open: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [isScannerOpen, setScannerOpen] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const detectLocation = async () => {
      const hostname = typeof window !== "undefined" ? window.location.hostname : "";
      if (
        !hostname ||
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "::1" ||
        hostname.endsWith(".local")
      ) {
        return;
      }
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.country_code === "IN") setCurrency("INR");
      } catch { /* network or JSON errors are intentionally ignored */ }
    };
    detectLocation();
  }, []);

  const triggerTransition = useCallback((target: string, lenis: LenisInstance | null) => {
    setIsNavigating(true);
    
    // Jump happens after the screen is fully black (400ms)
    setTimeout(() => {
      if (target.startsWith("#")) {
        const id = target.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          const top = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top, behavior: "auto" });
          if (lenis) lenis.scrollTo(top, { immediate: true });
        }
      } else if (target.startsWith("/#")) {
        if (typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname === "")) {
          const id = target.replace("/#", "");
          const element = document.getElementById(id);
          if (element) {
            const top = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top, behavior: "smooth" });
            if (lenis) lenis.scrollTo(top, { immediate: false });
          }
        } else {
          router.push(target);
        }
      } else {
        router.push(target);
      }
      
      // Extend timeout for cross-page navigation to ensure the target page loads
      const waitTime = target.startsWith("/") ? 600 : 300;
      setTimeout(() => {
        setIsNavigating(false);
      }, waitTime);
    }, 450); 
  }, [router]);

  return (
    <TransitionContext.Provider value={{ isNavigating, triggerTransition, currency, setCurrency, isScannerOpen, setScannerOpen }}>
      {children}
      
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(248, 248, 250, 0.98)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none"
            }}
          >
            <div className="scan-overlay" style={{ opacity: 0.05 }} />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ 
                fontFamily: "var(--font-geist-mono)", 
                fontSize: 10, 
                color: "#0047FF", 
                letterSpacing: "0.5em", 
                textTransform: "uppercase" 
              }}
            >
              Neural Link Resyncing...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
};

export const useNeuralTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useNeuralTransition must be used within a TransitionProvider");
  }
  return context;
};
