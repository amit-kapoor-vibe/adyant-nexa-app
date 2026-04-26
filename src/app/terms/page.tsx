"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, FileText, Scale, Zap } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div style={{ minHeight: "100vh", background: "#020202", color: "#E5E5E5", fontFamily: "var(--font-inter)", padding: "120px 28px 80px" }}>
      {/* Background Orbs */}
      <div className="ambient-orb" style={{ top: "-10%", left: "-5%", opacity: 0.1 }} />
      <div className="ambient-orb" style={{ bottom: "0%", right: "-5%", opacity: 0.1 }} />

      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 10 }}>
        {/* Header */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#00F2FF", textDecoration: "none", fontFamily: "var(--font-geist-mono)", fontSize: 11, letterSpacing: "0.1em", marginBottom: 48 }}>
          <ArrowLeft size={14} /> BACK_TO_SYSTEM_HOME
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="editorial-tag" style={{ marginBottom: 16 }}>LEGAL_PROTOCOL_01</div>
          <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(42px, 8vw, 72px)", lineHeight: 1, color: "#fff", marginBottom: 40 }}>
            Terms of <span className="text-glow-cyan" style={{ color: "#00F2FF" }}>Service</span>
          </h1>

          <div style={{ padding: "40px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 32 }}>
            
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Shield size={18} color="#00F2FF" />
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, margin: 0 }}>01. OVERVIEW</h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.8 }}>
                Welcome to Adyant Nexa. By accessing our "System" (website) or engaging our services, you agree to these Terms. As a solopreneur brand, we prioritize technical excellence and mutual respect. These terms protect the "Revenue Engine" architecture we build for you.
              </p>
            </section>

            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Scale size={18} color="#00F2FF" />
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, margin: 0 }}>02. LIMITATION OF LIABILITY</h3>
              </div>
              <div style={{ background: "rgba(0,242,255,0.03)", borderLeft: "2px solid #00F2FF", padding: "20px" }}>
                <p style={{ color: "#fff", fontSize: 14, lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
                  IMPORTANT: Adyant Nexa is a technical consultancy. We are not responsible for any direct, indirect, or incidental damages including loss of revenue, data, or ad spend. Our total financial liability is strictly limited to the amount paid by the client for the specific project deliverable.
                </p>
              </div>
            </section>

            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Zap size={18} color="#00F2FF" />
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, margin: 0 }}>03. INTELLECTUAL PROPERTY</h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.8 }}>
                All code, design systems, and custom architectures remain the property of Adyant Nexa until full and final payment is received. Upon completion of payment, we grant a full ownership license to the Client for the specific project deliverables. We reserve the right to showcase the work in our portfolio.
              </p>
            </section>

            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <FileText size={18} color="#00F2FF" />
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, margin: 0 }}>04. SERVICE SCOPE</h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.8 }}>
                Each project follows a strict Statement of Work (SOW). Any "Scope Creep" or additional feature requests outside the SOW will be billed separately at our standard hourly rates. We build on Next.js/React and do not provide maintenance for third-party platforms.
              </p>
            </section>

            <div style={{ marginTop: 24, padding: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, opacity: 0.3 }}>LAST_UPDATED: APRIL_2026</span>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, opacity: 0.3 }}>VERSION: 2.0.1_FINAL</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
