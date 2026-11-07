"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DIAGNOSTIC_STEPS = [
  "INITIALIZING ADYANT NEXA DIGITAL OS KERNEL...",
  "CALIBRATING AUTONOMOUS REVENUE ARCHITECTURE...",
  "SYNCHRONIZING ZERO-LATENCY BANT INTAKE ENGINE...",
  "OPTIMIZING HIGH-PERFORMANCE WEB ATTRIBUTION...",
  "SYSTEM ARMED. ZERO-FRICTION PROTOCOL ACTIVE.",
];

export function Preloader() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    // Only run on client and once per session
    try {
      const hasSeen = sessionStorage.getItem("adyant_preloader_seen");
      if (hasSeen) {
        return;
      }
    } catch {
      // Fallback if sessionStorage is disabled/blocked
    }

    setIsVisible(true);

    const startTime = Date.now();
    const duration = 1800; // 1.8 seconds total boot

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      const stepIdx = Math.min(
        DIAGNOSTIC_STEPS.length - 1,
        Math.floor((pct / 100) * DIAGNOSTIC_STEPS.length)
      );
      setCurrentStepIdx(stepIdx);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          try {
            sessionStorage.setItem("adyant_preloader_seen", "1");
          } catch {
            // Ignore storage errors
          }
        }, 300);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="retail-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(12px)",
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "var(--bg-color)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            overflow: "hidden",
          }}
        >
          {/* Ambient Background Glow */}
          <div
            style={{
              position: "absolute",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0, 71, 255, 0.12) 0%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          {/* Central Diagnostic Container */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              maxWidth: "520px",
              width: "100%",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Top Monospace Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "0.75rem",
                color: "var(--accent-color)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: "2rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "var(--accent-color)",
                  boxShadow: "0 0 10px rgba(0,71,255,0.4)",
                  display: "inline-block",
                }}
              />
              DIGITAL OPERATING SYSTEM &bull; V2.6
            </motion.div>

            {/* Central Pulse Ring & Numeric Counter */}
            <div
              style={{
                position: "relative",
                width: "150px",
                height: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2.5rem",
              }}
            >
              {/* Outer Glowing Rotating Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "2px dashed rgba(0, 71, 255, 0.35)",
                  boxShadow: "0 0 25px rgba(0, 71, 255, 0.15)",
                }}
              />

              {/* Inner Solid Border */}
              <div
                style={{
                  position: "absolute",
                  inset: "8px",
                  borderRadius: "50%",
                  border: "1px solid rgba(10, 10, 12, 0.08)",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(8px)",
                }}
              />

              {/* Percentage Value */}
              <div style={{ position: "relative", zIndex: 2 }}>
                <span
                  style={{
                    fontFamily: "var(--font-syne), sans-serif",
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    color: "var(--text-color)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {progress}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "1rem",
                    color: "var(--accent-color)",
                    fontWeight: 600,
                    marginLeft: "2px",
                  }}
                >
                  %
                </span>
              </div>
            </div>

            {/* High-Precision Progress Bar */}
            <div
              style={{
                width: "100%",
                height: "3px",
                backgroundColor: "rgba(10, 10, 12, 0.08)",
                borderRadius: "2px",
                overflow: "hidden",
                marginBottom: "1.25rem",
                position: "relative",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  backgroundColor: "var(--accent-color)",
                  width: `${progress}%`,
                  boxShadow: "0 0 12px rgba(0, 71, 255, 0.4)",
                }}
              />
            </div>

            {/* Dynamic Real-Time Diagnostic Stream Line */}
            <div
              style={{
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.span
                key={currentStepIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.8rem",
                  color: currentStepIdx === DIAGNOSTIC_STEPS.length - 1 ? "var(--accent-color)" : "var(--muted-text)",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
              >
                {DIAGNOSTIC_STEPS[currentStepIdx]}
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
