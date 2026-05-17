"use client";

import React from "react";
import ThreeSwirl from "@/components/ThreeSwirl";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Zap, Shield, Cpu } from "lucide-react";

export default function SwirlDemoPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#020202", color: "#E5E5E5", padding: "4rem 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "4rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: "2rem", fontSize: 12, fontFamily: "var(--font-geist-mono)" }}>
            <ArrowLeft size={14} /> BACK TO DOMINANCE
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: "1rem", display: "block" }}>PROVING THE IMPOSSIBLE_</span>
            <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2.5rem, 8vw, 4.5rem)", fontWeight: 800, lineHeight: 0.9, marginBottom: "1.5rem" }}>
              3D <span style={{ color: "#00F2FF" }}>Neural Shankh</span> <br /> Architecture.
            </h1>
            <p style={{ maxWidth: "600px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, fontSize: "1.1rem" }}>
              While others say AI can't build complex 3D shaders, we build them as standard. This is a custom GLSL vertex distortion engine running on the edge.
            </p>
          </motion.div>
        </div>

        {/* The Demo */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem", alignItems: "start" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <ThreeSwirl />
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ padding: "1.5rem", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#00F2FF", marginBottom: "0.5rem" }}>
                <Zap size={16} />
                <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", fontWeight: 700 }}>VERTEX MANIPULATION</span>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                Directly injecting math into the GPU via custom GLSL. No pre-made assets, just pure code.
              </p>
            </div>

            <div style={{ padding: "1.5rem", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#00F2FF", marginBottom: "0.5rem" }}>
                <Cpu size={16} />
                <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", fontWeight: 700 }}>REAL-TIME RENDERING</span>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                60FPS fluid motion with adaptive resolution. Optimized for React 19 concurrent rendering.
              </p>
            </div>

            <div style={{ padding: "1.5rem", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#00F2FF", marginBottom: "0.5rem" }}>
                <Shield size={16} />
                <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", fontWeight: 700 }}>IMPROVING THE "IMPOSSIBLE"</span>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                Built in under 2 minutes by Antigravity. Proven capable where human developers doubted.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
