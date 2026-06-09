"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const words = ["Design", "Engineer", "Dominate"];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = timestamp - startTimestamp;
      const calculatedCount = Math.min(Math.floor((progress / 2700) * 100), 100);

      setCount(calculatedCount);

      if (progress < 2700) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(100);
        const timeoutId = setTimeout(() => {
          onComplete();
        }, 400);
        return () => clearTimeout(timeoutId);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  const wordIndex = Math.min(Math.floor((count / 100) * words.length), words.length - 1);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#020202",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "40px 28px",
        overflow: "hidden",
      }}
    >
      {/* Top Left: Label */}
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <motion.span
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="editorial-tag"
          style={{ fontSize: "10px", opacity: 0.5, letterSpacing: "0.3em" }}
        >
          ADYANT NEXA • SYSTEM LOAD
        </motion.span>
      </div>

      {/* Center: Rotating Words */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.h2
            key={wordIndex}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{
              fontFamily: "var(--font-syne), serif",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
              color: "#E5E5E5",
              textAlign: "center",
            }}
          >
            {words[wordIndex]}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* Bottom Row: Counter & Progress Bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Counter */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span
            style={{
              fontFamily: "var(--font-syne), serif",
              fontWeight: 800,
              fontSize: "clamp(4rem, 12vw, 8rem)",
              color: "#E5E5E5",
              lineHeight: 0.8,
              letterSpacing: "-0.02em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {String(count).padStart(3, "0")}
          </span>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: "2px",
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.05)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "100%",
              background: "linear-gradient(90deg, #00F2FF, #00AACC)",
              originX: 0,
              scaleX: count / 100,
              boxShadow: "0 0 12px rgba(0, 242, 255, 0.45)",
            }}
            transition={{ ease: "easeOut", duration: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}
