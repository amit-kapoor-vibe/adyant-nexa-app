"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, MoveRight } from "lucide-react";

interface Node {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
  speed: number;
}

export const HeroSection = ({ onScan }: { onScan?: (url: string) => void }) => {
  const [url, setUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);

  useEffect(() => {
    // Initialize nodes
    nodesRef.current = Array.from({ length: 32 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      targetX: Math.random() * 100,
      targetY: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      speed: 0.0005 + Math.random() * 0.001,
    }));

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Update positions and draw dots
      nodesRef.current.forEach((n) => {
        // Move towards target
        n.x += (n.targetX - n.x) * n.speed;
        n.y += (n.targetY - n.y) * n.speed;

        // If reached target area, pick new target
        if (Math.abs(n.x - n.targetX) < 1) {
          n.targetX = Math.random() * 100;
          n.targetY = Math.random() * 100;
        }

        const px = (n.x / 100) * w;
        const py = (n.y / 100) * h;

        // Draw dot
        ctx.beginPath();
        ctx.arc(px, py, n.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 255, ${n.opacity})`;
        ctx.fill();
        
        // Glow effect for dots
        ctx.shadowBlur = 4;
        ctx.shadowColor = "#00F2FF";
      });

      // Draw lines
      ctx.shadowBlur = 0;
      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const n1 = nodesRef.current[i];
          const n2 = nodesRef.current[j];
          const dx = ((n1.x - n2.x) / 100) * w;
          const dy = ((n1.y - n2.y) / 100) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo((n1.x / 100) * w, (n1.y / 100) * h);
            ctx.lineTo((n2.x / 100) * w, (n2.y / 100) * h);
            ctx.strokeStyle = `rgba(0, 242, 255, ${(1 - dist / 180) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const heroContentVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 22 } },
  };

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#020202" }}>
      {/* Scan Overlay */}
      <div className="scan-overlay" />
      
      {/* Unified High-Performance Canvas */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.6 }} />

      {/* Vignettes */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 0%, #020202 85%)", pointerEvents: "none", zIndex: 2 }} />
      <div style={{ position: "absolute", inset: "0 0 auto 0", height: 160, background: "linear-gradient(to bottom, #020202, transparent)", pointerEvents: "none", zIndex: 3 }} />
      <div style={{ position: "absolute", inset: "auto 0 0 0", height: 160, background: "linear-gradient(to top, #020202, transparent)", pointerEvents: "none", zIndex: 3 }} />
      
      {/* Background Glow */}
      <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 900, height: 450, background: "radial-gradient(ellipse, rgba(0,242,255,0.07) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none", zIndex: 1 }} />

      {/* Content Rendering Container */}
      <motion.div 
        variants={heroContentVars} 
        initial="hidden" 
        animate="visible"
        style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "clamp(120px, 15vh, 180px) 28px 40px", maxWidth: 1100, margin: "0 auto", width: "100%" }}
      >
        {/* Status Pill */}
        <motion.div variants={itemVars} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48, padding: "10px 24px", border: "1px solid rgba(0,242,255,0.2)", background: "rgba(0,242,255,0.03)" }}>
          <div className="pulse-dot" />
          <span className="editorial-tag" style={{ fontSize: 9 }}>System Online — Neural Link Active</span>
        </motion.div>

        {/* Headlines */}
        <motion.h1 variants={itemVars} style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(72px, 13vw, 140px)", lineHeight: 0.9, letterSpacing: "-0.035em", marginBottom: 40, userSelect: "none" }}>
          <span className="glitch-text glitch-shimmer" data-text="ADYANT" style={{ display: "block" }}>ADYANT</span>
          <span className="glitch-text glitch-shimmer" data-text="NEXA" style={{ display: "block", animationDelay: "0.4s" }}>NEXA</span>
        </motion.h1>

        {/* Descriptor */}
        <motion.p variants={itemVars} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "rgba(229,229,229,0.5)", lineHeight: 1.85, marginBottom: 40, maxWidth: 520 }}>
          Web Architecture for the Conversion-Obsessed.<br />
          Not Fragile WordPress · Real Performance Marketing · Zero Fluff
        </motion.p>

        {/* Audit Search Bar */}
        <motion.div variants={itemVars} style={{ marginBottom: 48, width: "100%", maxWidth: 640 }}>
          <form 
            onSubmit={(e) => { e.preventDefault(); if (url && onScan) onScan(url); }}
            style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.15)", padding: "6px", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
            onFocusCapture={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#00F2FF"; (e.currentTarget as HTMLDivElement).style.background = "rgba(0,242,255,0.04)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 30px rgba(0,242,255,0.1)"; }}
            onBlurCapture={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
          >
            <div style={{ paddingLeft: 18, pointerEvents: "none" }}>
              <Search size={18} color="rgba(255,255,255,0.4)" />
            </div>
            <input 
              type="text"
              placeholder="Enter Target Domain for Audit..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ flex: 1, background: "none", border: "none", color: "#fff", padding: "14px", fontFamily: "var(--font-geist-mono)", fontSize: 14, outline: "none" }}
            />
            <button 
              type="submit"
              className="btn-primary"
              style={{ border: "none", padding: "12px 28px", minWidth: "120px", display: "flex", justifyContent: "center" }}
            >
              Analyze
            </button>
          </form>
        </motion.div>

        {/* Optimized Stat strip */}
        <motion.div variants={itemVars} style={{ display: "flex", gap: "clamp(32px, 6vw, 80px)", flexWrap: "wrap", justifyContent: "center" }}>
          {[["0.03s", "DOM Latency"], ["400%", "Avg. ROI Lift"], ["∞", "Scalability"]].map(([v, l]) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <span className="text-glow-cyan" style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: "clamp(24px, 3.5vw, 36px)", color: "#00F2FF" }}>{v}</span>
              <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.35 }}>{l}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Snappy Scroll Indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span className="editorial-tag" style={{ fontSize: 8, opacity: 0.25 }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(0,242,255,0.4), transparent)" }} />
      </motion.div>
    </section>
  );
};
