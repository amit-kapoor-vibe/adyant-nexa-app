"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCcw, AlertCircle, CheckCircle, CreditCard } from "lucide-react";
import Link from "next/link";

export default function RefundPolicy() {
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
          <div className="editorial-tag" style={{ marginBottom: 16 }}>FINANCIAL_PROTOCOL_03</div>
          <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(42px, 8vw, 72px)", lineHeight: 1, color: "#fff", marginBottom: 40 }}>
            Refund <span className="text-glow-cyan" style={{ color: "#00F2FF" }}>Policy</span>
          </h1>

          <div style={{ padding: "40px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 32 }}>
            
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <AlertCircle size={18} color="#00F2FF" />
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, margin: 0 }}>01. NEXA AUDIT (₹4,999)</h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.8 }}>
                The Nexa Audit is a non-refundable service as it involves immediate manual analysis and engineering time. However, **100% of the audit fee is redeemable** as a credit if you choose to upgrade to a Nexa Sprint or Nexa Growth build within 30 days of the audit delivery.
              </p>
            </section>

            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <RefreshCcw size={18} color="#00F2FF" />
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, margin: 0 }}>02. PROJECT CANCELLATION</h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.8 }}>
                For larger projects (Sprint/Growth), cancellation requests must be made in writing. Any work already completed up to the point of cancellation will be billed accordingly, and the initial deposit (25%) is non-refundable to cover resource allocation and architectural planning.
              </p>
            </section>

            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <CheckCircle size={18} color="#00F2FF" />
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, margin: 0 }}>03. APPROVAL & HANDOVER</h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.8 }}>
                Once a project has been approved and the code has been handed over or deployed to the client&apos;s production environment, no refunds will be issued. We provide a 14-day {'"Bug Fix"'} window post-launch to ensure the system is operating as intended.
              </p>
            </section>

            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <CreditCard size={18} color="#00F2FF" />
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, margin: 0 }}>04. PROCESSING TIME</h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.8 }}>
                Eligible refunds are processed within 7-10 business days and will be credited back to the original payment method used via our secure payment gateway.
              </p>
            </section>

            <div style={{ marginTop: 24, padding: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, opacity: 0.3 }}>GATEWAY_COMPLIANCE_2026</span>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, opacity: 0.3 }}>REF: NEXA_REFUND_v1.2</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
