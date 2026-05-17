"use client";

import React from "react";
import NeuralGalaxyPro from "@/components/NeuralGalaxyPro";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function GalaxyProPage() {
  return (
    <main style={{ width: "100%", height: "100vh", position: "relative", background: "#020202", overflow: "hidden" }}>
      {/* 3D Visual Layer */}
      <NeuralGalaxyPro />

      {/* UI Overlay Layer */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "40px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", pointerEvents: "auto" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#E5E5E5" }}>
            <div style={{ width: 32, height: 32, background: "#00F2FF", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 12, height: 12, border: "2px solid #000", borderRadius: "2px" }} />
            </div>
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>ADYANT_NEXA</span>
          </Link>

          <div style={{ textAlign: "right" }}>
            <span className="editorial-tag" style={{ color: "#00F2FF", fontSize: 10, letterSpacing: "0.4em" }}>PROTOCOL: GALAXY_PRO</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
              <div style={{ width: 6, height: 6, background: "#00FF66", borderRadius: "50%", boxShadow: "0 0 10px #00FF66" }} />
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "rgba(255,255,255,0.4)" }}>SYSTEM_STABLE</span>
            </div>
          </div>
        </div>

        {/* Center/Bottom Content */}
        <div style={{ maxWidth: 600 }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ pointerEvents: "auto" }}
          >
            <span className="editorial-tag" style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginBottom: 16, display: "block" }}>NEURAL INFRASTRUCTURE v2.0</span>
            <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(3rem, 10vw, 6rem)", fontWeight: 800, color: "#fff", lineHeight: 0.85, marginBottom: 32, letterSpacing: "-0.04em" }}>
              THE <span style={{ color: "transparent", WebkitTextStroke: "1px #00F2FF" }}>VOID</span><br />OF REVENUE.
            </h1>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 40, maxWidth: 440 }}>
              While standard agencies build websites, we engineer logarithmic growth engines that capture every single lead with neural precision.
            </p>

            <div style={{ display: "flex", gap: 24 }}>
              <button className="btn-primary" style={{ padding: "18px 32px", fontSize: 11 }}>
                INITIALIZE AUDIT
              </button>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", textDecoration: "none", fontFamily: "var(--font-geist-mono)", fontSize: 11, letterSpacing: "0.1em" }}>
                EXIT SIMULATION <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Footer Metrics */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: 0.4 }}>
          <div style={{ display: "flex", gap: 40 }}>
            <div>
              <span style={{ display: "block", fontSize: 8, fontFamily: "var(--font-geist-mono)", marginBottom: 4 }}>PARTICLE_DENSITY</span>
              <span style={{ fontSize: 12, fontFamily: "var(--font-syne)", fontWeight: 700 }}>12,000_NODE</span>
            </div>
            <div>
              <span style={{ display: "block", fontSize: 8, fontFamily: "var(--font-geist-mono)", marginBottom: 4 }}>GRAVITY_PULL</span>
              <span style={{ fontSize: 12, fontFamily: "var(--font-syne)", fontWeight: 700 }}>DYNAMIC_0.5</span>
            </div>
          </div>
          <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}>©2026 NEXA_CORE_OS</span>
        </div>

      </div>

      {/* Vignette Overlay */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", boxShadow: "inset 0 0 150px rgba(0,0,0,0.8)", zIndex: 15 }} />
    </main>
  );
}
