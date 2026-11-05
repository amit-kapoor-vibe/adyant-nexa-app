"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Eye, Database, Globe } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "var(--text-color)", fontFamily: "var(--font-inter)", padding: "120px 28px 80px" }}>
      {/* Background Orbs */}
      <div className="ambient-orb" style={{ top: "-10%", left: "-5%", opacity: 0.05 }} />
      <div className="ambient-orb" style={{ bottom: "0%", right: "-5%", opacity: 0.05 }} />

      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 10 }}>
        {/* Header */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent-color)", textDecoration: "none", fontFamily: "var(--font-geist-mono)", fontSize: 11, letterSpacing: "0.1em", marginBottom: 48 }}>
          <ArrowLeft size={14} /> BACK_TO_SYSTEM_HOME
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="editorial-tag" style={{ marginBottom: 16 }}>DATA_PROTOCOL_02</div>
          <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(42px, 8vw, 72px)", lineHeight: 1, color: "var(--text-color)", marginBottom: 40 }}>
            Privacy <span style={{ color: "var(--accent-color)" }}>Policy</span>
          </h1>

          <div style={{ padding: "40px", background: "var(--surface-color)", border: "1px solid var(--border-color)", borderRadius: "20px", boxShadow: "0 10px 40px rgba(10,10,12,0.04)", display: "flex", flexDirection: "column", gap: 32 }}>
            
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Lock size={18} color="var(--accent-color)" />
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, color: "var(--text-color)", margin: 0 }}>01. DATA COLLECTION</h3>
              </div>
              <p style={{ color: "var(--muted-text)", fontSize: 14, lineHeight: 1.8 }}>
                In compliance with the **Indian DPDP Act 2023**, Adyant Nexa collects only the necessary data required to optimize your digital experience. This includes information provided via our Nexa Diagnostic Scanner, AI Concierge chat, and contact forms.
              </p>
            </section>

            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Database size={18} color="var(--accent-color)" />
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, color: "var(--text-color)", margin: 0 }}>02. STORAGE & PROCESSING</h3>
              </div>
              <p style={{ color: "var(--muted-text)", fontSize: 14, lineHeight: 1.8 }}>
                Data is securely processed through our integrated tech stack (Next.js, Lark Suite CRM, and Meta Conversions API). We do not sell your personal data. We implement reasonable security practices to protect against unauthorized access or data breaches.
              </p>
            </section>

            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Eye size={18} color="var(--accent-color)" />
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, color: "var(--text-color)", margin: 0 }}>03. TRACKING TECHNOLOGIES</h3>
              </div>
              <p style={{ color: "var(--muted-text)", fontSize: 14, lineHeight: 1.8 }}>
                We use cookies and high-performance tracking pixels to analyze traffic patterns and improve ad delivery. By using our {'"Revenue Engine"'} services, you acknowledge the use of these technologies for performance optimization.
              </p>
            </section>

            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Globe size={18} color="var(--accent-color)" />
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, color: "var(--text-color)", margin: 0 }}>04. YOUR RIGHTS</h3>
              </div>
              <p style={{ color: "var(--muted-text)", fontSize: 14, lineHeight: 1.8 }}>
                You have the right to request access to, correction of, or deletion of your personal data. To exercise these rights, please contact our team at **contact@adyantnexa.com**.
              </p>
            </section>

            <div style={{ marginTop: 24, padding: "20px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--muted-text)" }}>DPDP_COMPLIANT_2026</span>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--muted-text)" }}>REF: NEXA_PRIVACY_v2.0</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
