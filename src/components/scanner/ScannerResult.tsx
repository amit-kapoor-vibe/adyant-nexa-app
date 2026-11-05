"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { Currency } from "@/types";
import { trackEvent } from "@/utils/analytics";

interface ScannerResultProps {
  score: number;
  url: string;
  currency: Currency;
}

export function ScannerResult({ score, url, currency }: ScannerResultProps) {
  const [leadEmail, setLeadEmail] = useState("");
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  const isCritical = score < 50;
  const isMediacre = score < 90;

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) return;
    setSubmittingLead(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Scanner: ${url.replace(/^https?:\/\//, "").substring(0, 20)}`,
          email: leadEmail,
          phone: "Web Scanner",
          business: url,
          message: `DIAGNOSTIC REPORT:\nURL: ${url}\nMobile Perf Score: ${score}/100\nConversion Friction: ${isCritical ? "CRITICAL" : "MODERATE"}\nStatus: User requested full audit report.`,
          budget: currency === "USD" ? "59" : "4999",
        }),
      });
      if (res.ok) {
        trackEvent('lead_submitted', { source: 'scanner_result', url, score });
        setLeadCaptured(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingLead(false);
    }
  };

  interface NeuralAudit {
    status?: string;
    analysis?: string;
    recommendation?: string;
  }

  const [aiAnalysis, setAiAnalysis] = useState<NeuralAudit | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("latest_neural_audit");
      if (stored) setAiAnalysis(JSON.parse(stored) as NeuralAudit);
    }
  }, []);

  const scoreColor = isCritical ? "#FF3333" : isMediacre ? "#C4A35A" : "#00FF66";
  const scoreLabel = aiAnalysis?.status || (isCritical ? "Critical Performance Leak" : isMediacre ? "Mediocre Score Detected" : "Excellent Performance");
  const scoreDesc = aiAnalysis?.analysis || (isCritical
    ? "Based on mobile simulation, this site is actively losing traffic due to severe rendering delays. You are currently paying for ad clicks that bounce before the page loads."
    : isMediacre
      ? "Based on mobile simulation, this site exhibits moderate load delays. While functional, it is leaking potential conversions that an optimized Nexa architecture would capture."
      : "Based on mobile simulation, this site is highly optimized for speed. However, an elite architecture audit can still reveal hidden pixel tracking leaks or conversion friction.");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", gap: "clamp(20px, 4vw, 32px)", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        {/* Score Circle */}
        <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" aria-label={`Performance score: ${score} out of 100`} style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(10,10,12,0.08)" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="45" fill="none"
              stroke={scoreColor} strokeWidth="8" strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 42, color: "var(--text-color)", lineHeight: 1 }}>{score}</span>
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "var(--muted-text)" }}>/ 100</span>
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: "1 1 250px" }}>
          <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 22, color: isCritical ? "#FF3333" : "var(--text-color)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            {isCritical ? <AlertTriangle size={20} /> : <CheckCircle size={20} color="#00BA4A" />}
            {scoreLabel}
          </h3>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "var(--muted-text)", lineHeight: 1.6, marginBottom: 8 }}>
            {scoreDesc}
          </p>
          
          {aiAnalysis?.recommendation && (
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--accent-color)", borderLeft: "2px solid var(--accent-color)", paddingLeft: 12, marginBottom: 20, fontStyle: "italic" }}>
              NEURAL RECOMMENDATION: {aiAnalysis.recommendation}
            </div>
          )}

          {!leadCaptured ? (
            <div style={{ background: "rgba(0,71,255,0.04)", border: "1px solid var(--border-color)", padding: 20, borderRadius: "10px" }}>
              <span style={{ display: "block", fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--accent-color)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Lock in your {currency === "USD" ? "$59" : "₹4,999"} Audit
              </span>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, color: "var(--muted-text)", marginBottom: 16 }}>
                Enter your email. We will manually verify your Pixel setup, send you a 10-Page Audit Report, and share the payment link. Audit fee is 100% redeemable on a Nexa Growth build.
              </p>
              <form onSubmit={handleLeadSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input
                  type="email"
                  placeholder="Enter business email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  required
                  aria-label="Business email for audit report"
                  style={{ flex: "1 1 100%", minWidth: "200px", background: "#FFFFFF", border: "1px solid var(--border-color)", color: "var(--text-color)", padding: "12px 16px", fontSize: 13, outline: "none", fontFamily: "var(--font-inter)", borderRadius: "6px" }}
                />
                <button
                  type="submit"
                  disabled={submittingLead}
                  style={{ background: "var(--accent-color)", color: "#FFFFFF", border: "none", padding: "12px 24px", flex: "1 1 100%", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "var(--font-geist-mono)", textTransform: "uppercase", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,71,255,0.2)" }}
                >
                  {submittingLead ? "..." : "Send"}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ background: "rgba(0, 186, 74, 0.08)", border: "1px solid rgba(0, 186, 74, 0.2)", padding: 20, display: "flex", alignItems: "center", gap: 12, borderRadius: "10px" }}>
              <CheckCircle color="#00BA4A" size={24} />
              <div>
                <span style={{ display: "block", color: "#00BA4A", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14 }}>Transmission Received</span>
                <span style={{ color: "var(--muted-text)", fontFamily: "var(--font-inter)", fontSize: 12 }}>Our engineers will contact you securely.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
