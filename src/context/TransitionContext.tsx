"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface TransitionContextType {
  isNavigating: boolean;
  triggerTransition: (target: string, lenis: any) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const triggerTransition = useCallback((target: string, lenis: any) => {
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
        // For cross-page hashes, we push the route and let the browser/Next.js handle the scroll
        router.push(target);
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
    <TransitionContext.Provider value={{ isNavigating, triggerTransition }}>
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
              background: "#020202",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none"
            }}
          >
            <div className="scan-overlay" style={{ opacity: 0.1 }} />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ 
                fontFamily: "var(--font-geist-mono)", 
                fontSize: 10, 
                color: "#00F2FF", 
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
