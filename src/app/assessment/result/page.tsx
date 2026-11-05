"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  FileText,
  ArrowRight,
  Phone,
  Lock,
  X,
} from "lucide-react";
import { generateHtmlReport } from "@/lib/reports/generator";

export default function AssessmentResultPage() {
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [businessName, setBusinessName] = useState("Your Store");
  const [city, setCity] = useState("India");
  const [assessmentId, setAssessmentId] = useState("");

  // Lead Form state
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    city: "",
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedResult = localStorage.getItem("adyant_latest_assessment");
      const storedId = localStorage.getItem("adyant_assessment_id") || "";
      const storedName = localStorage.getItem("adyant_business_name") || "Your Store";
      const storedCity = localStorage.getItem("adyant_city") || "India";

      if (storedResult) {
        try {
          const parsed = JSON.parse(storedResult);
          setResult(parsed);
          setAssessmentId(storedId);
          setBusinessName(storedName);
          setCity(storedCity);
          setLeadForm((prev) => ({ ...prev, businessName: storedName, city: storedCity }));
        } catch (e) {
          console.error("Parse error", e);
        }
      }
    }
  }, []);

  const isUk = city.toLowerCase().includes("london") || city.toLowerCase().includes("uk");
  const formatResultMoney = (amount: number) => {
    return isUk 
      ? `£${Math.round(amount).toLocaleString("en-GB")}` 
      : `AED ${Math.round(amount).toLocaleString("en-AE")}`;
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone,
          business: leadForm.businessName || businessName,
          message: `UNLOCKED BOUTIQUE BLUEPRINT: Readiness Score ${result?.growthScore || 0}/100, Est Opp ${formatResultMoney(result?.totalEstimatedAnnualOpportunity || 0)}`,
          budget: `Est Opp ${formatResultMoney(result?.totalEstimatedAnnualOpportunity || 0)}`,
        }),
      });

      setLeadSubmitted(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("adyant_lead_name", leadForm.name);
        localStorage.setItem("adyant_lead_phone", leadForm.phone);
        localStorage.setItem("adyant_lead_email", leadForm.email);
        localStorage.setItem("adyant_blueprint_unlocked", "true");
      }
    } catch (err) {
      console.error("Lead submission error", err);
      setLeadSubmitted(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    const html = generateHtmlReport(result, {
      businessName: leadForm.businessName || businessName || "Retail Business",
      city: leadForm.city || city || "India",
      name: leadForm.name,
      email: leadForm.email,
      phone: leadForm.phone,
    });

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      window.print();
    }
  };

  if (!result) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "transparent", color: "var(--text-color)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", color: "var(--text-color)", marginBottom: "1rem" }}>No Assessment Data Found</h2>
          <p style={{ color: "var(--muted-text)", marginBottom: "1.5rem" }}>Please complete the D2C readiness diagnostic to view your report.</p>
          <Link href="/assessment" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            Start Diagnostic <ArrowRight style={{ width: "16px", height: "16px" }} />
          </Link>
        </div>
      </div>
    );
  }

  const scoreColor =
    result.growthScore >= 80 ? "#00BA4A" : result.growthScore >= 60 ? "var(--accent-color)" : result.growthScore >= 40 ? "#D97706" : "#DC2626";

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "var(--text-color)", paddingTop: "6.5rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Title Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "10px" }}>
            D2C READINESS REPORT &bull; DIAGNOSTIC V1
          </span>
          <Heading level="h1" style={{ textAlign: "center", marginBottom: "10px" }}>
            D2C Readiness Report for <span style={{ color: "var(--accent-color)" }}>{businessName}</span>
          </Heading>
          <p style={{ color: "var(--muted-text)", fontSize: "0.95rem" }}>Location: {city} &bull; Generated: {new Date().toLocaleDateString('en-IN')}</p>
        </div>

        {/* Top Summary Gauge Card */}
        <div
          style={{
            backgroundColor: "var(--surface-color)",
            border: "1px solid var(--border-color)",
            borderRadius: "24px",
            padding: "2.5rem",
            marginBottom: "3rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            boxShadow: "0 10px 40px rgba(10,10,12,0.06)",
          }}
          className="grid-cols-1 md:grid-cols-2"
        >
          {/* Left: Score Circle */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRight: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted-text)", fontFamily: "var(--font-geist-mono), monospace", marginBottom: "1rem", letterSpacing: "0.15em" }}>
              D2C READINESS SCORE
            </span>

            <div
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                border: `6px solid ${scoreColor}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 30px ${scoreColor}25`,
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "3.5rem", fontWeight: 800, color: "var(--text-color)" }}>
                {result.growthScore}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}>/ 100</span>
            </div>

            <span
              style={{
                backgroundColor: `${scoreColor}15`,
                color: scoreColor,
                border: `1px solid ${scoreColor}30`,
                padding: "0.35rem 1rem",
                borderRadius: "20px",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              {result.overallScoreStatus.replace(/_/g, " ")}
            </span>
          </div>

          {/* Right: Estimated Profit Opportunity */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", marginBottom: "0.5rem", letterSpacing: "0.15em" }}>
              ESTIMATED ANNUAL REVENUE &amp; MARGIN OPPORTUNITY
            </span>
            <div style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "2.75rem", fontWeight: 800, color: "var(--text-color)", marginBottom: "0.75rem" }}>
              {formatResultMoney(result.totalEstimatedAnnualOpportunity || 0)}
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--muted-text)", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              Total estimated annual capital recovery and growth leverage across inventory turnaround, discounting reduction, repeat purchase LTV, and digital channel acquisition.
            </p>

            <button
              onClick={() => setShowLeadModal(true)}
              className="btn-primary"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <FileText style={{ width: "18px", height: "18px" }} /> Build My Growth Plan
            </button>
          </div>
        </div>

        {/* Domain Sub-Scores Grid */}
        <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.35rem", fontWeight: 700, color: "var(--text-color)", marginBottom: "1.25rem" }}>
          Domain Breakdown Scores
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          {Object.entries(result.domainScores || {}).map(([key, item]: [string, any]) => (
            <div key={key} style={{ backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", borderRadius: "14px", padding: "1.25rem", boxShadow: "0 2px 10px rgba(10,10,12,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: item.score >= 70 ? "var(--accent-color)" : item.score >= 50 ? "#D97706" : "#DC2626" }}>
                  {item.score}/100
                </span>
              </div>
              <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(10,10,12,0.08)", borderRadius: "2px", overflow: "hidden", marginBottom: "0.5rem" }}>
                <div style={{ width: `${item.score}%`, height: "100%", backgroundColor: item.score >= 70 ? "var(--accent-color)" : item.score >= 50 ? "#D97706" : "#DC2626" }} />
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--muted-text)" }}>{item.summary}</span>
            </div>
          ))}
        </div>

        {/* Detailed Metric & Benchmark Audit Matrix */}
        <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.35rem", fontWeight: 700, color: "var(--text-color)", marginBottom: "1.25rem" }}>
          Detailed Retail Metric &amp; Benchmark Audit
        </h3>

        <div style={{ backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "1.5rem", marginBottom: "3rem", boxShadow: "0 4px 20px -2px rgba(10,10,12,0.04)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem", color: "var(--muted-text)", fontFamily: "var(--font-geist-mono), monospace" }}>METRIC EVALUATED</th>
                  <th style={{ padding: "0.75rem", color: "var(--muted-text)", fontFamily: "var(--font-geist-mono), monospace" }}>YOUR STORE METRIC</th>
                  <th style={{ padding: "0.75rem", color: "var(--muted-text)", fontFamily: "var(--font-geist-mono), monospace" }}>RETAIL BENCHMARK</th>
                  <th style={{ padding: "0.75rem", color: "var(--muted-text)", fontFamily: "var(--font-geist-mono), monospace" }}>DIAGNOSTIC STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "0.75rem", color: "var(--text-color)", fontWeight: 600 }}>Dead Stock &amp; Capital Lock</td>
                  <td style={{ padding: "0.75rem", color: "var(--accent-color)" }}>{result.domainScores?.inventory?.summary || "N/A"}</td>
                  <td style={{ padding: "0.75rem", color: "var(--muted-text)" }}>&lt; 12% of total inventory</td>
                  <td style={{ padding: "0.75rem", fontWeight: 700, color: result.domainScores?.inventory?.score >= 70 ? "#00BA4A" : "#DC2626" }}>
                    {result.domainScores?.inventory?.status?.replace(/_/g, " ")}
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "0.75rem", color: "var(--text-color)", fontWeight: 600 }}>Average Discounting Rate</td>
                  <td style={{ padding: "0.75rem", color: "var(--accent-color)" }}>{result.domainScores?.margins?.summary || "N/A"}</td>
                  <td style={{ padding: "0.75rem", color: "var(--muted-text)" }}>&lt; 10% average markdown</td>
                  <td style={{ padding: "0.75rem", fontWeight: 700, color: result.domainScores?.margins?.score >= 70 ? "#00BA4A" : "#DC2626" }}>
                    {result.domainScores?.margins?.status?.replace(/_/g, " ")}
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "0.75rem", color: "var(--text-color)", fontWeight: 600 }}>Repeat Buyer Retention</td>
                  <td style={{ padding: "0.75rem", color: "var(--accent-color)" }}>{result.domainScores?.retention?.summary || "N/A"}</td>
                  <td style={{ padding: "0.75rem", color: "var(--muted-text)" }}>&gt; 35% repeat purchase rate</td>
                  <td style={{ padding: "0.75rem", fontWeight: 700, color: result.domainScores?.retention?.score >= 70 ? "#00BA4A" : "#DC2626" }}>
                    {result.domainScores?.retention?.status?.replace(/_/g, " ")}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "0.75rem", color: "var(--text-color)", fontWeight: 600 }}>Marketing Lead Conversion</td>
                  <td style={{ padding: "0.75rem", color: "var(--accent-color)" }}>{result.domainScores?.marketing?.summary || "N/A"}</td>
                  <td style={{ padding: "0.75rem", color: "var(--muted-text)" }}>&gt; 3.0% store conversion</td>
                  <td style={{ padding: "0.75rem", fontWeight: 700, color: result.domainScores?.marketing?.score >= 70 ? "#00BA4A" : "#DC2626" }}>
                    {result.domainScores?.marketing?.status?.replace(/_/g, " ")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Opportunity Areas */}
        <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.35rem", fontWeight: 700, color: "var(--text-color)", marginBottom: "1.25rem" }}>
          Top Estimated Opportunity Areas
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "3rem" }}>
          {(result.topOpportunities || []).map((opp: any, idx: number) => (
            <div
              key={idx}
              style={{
                backgroundColor: "var(--surface-color)",
                border: "1px solid var(--border-color)",
                borderRadius: "16px",
                padding: "1.5rem",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "1rem",
                alignItems: "start",
                boxShadow: "0 4px 20px -2px rgba(10,10,12,0.04)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      backgroundColor: opp.priority === "HIGH" ? "rgba(220,38,38,0.12)" : "rgba(217,119,6,0.12)",
                      color: opp.priority === "HIGH" ? "#DC2626" : "#D97706",
                      border: `1px solid ${opp.priority === "HIGH" ? "rgba(220,38,38,0.25)" : "rgba(217,119,6,0.25)"}`,
                      padding: "0.15rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    {opp.priority} PRIORITY
                  </span>
                  <h4 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-color)", margin: 0 }}>
                    {opp.title}
                  </h4>
                </div>

                <p style={{ color: "var(--muted-text)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                  {opp.issueSummary}
                </p>

                <div style={{ backgroundColor: "rgba(248, 248, 250, 0.8)", border: "1px solid var(--border-color)", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "var(--accent-color)" }}>
                  <strong>Recommended Next Step:</strong> {opp.recommendedAction}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--muted-text)", display: "block", marginBottom: "0.25rem" }}>Est. Annual Value</span>
                <span style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-color)" }}>
                  {formatResultMoney(opp.estimatedAnnualOpportunity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Methodology Disclaimer */}
        <div style={{ backgroundColor: "rgba(10,10,12,0.02)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.25rem", marginBottom: "3rem", fontSize: "0.8rem", color: "var(--muted-text)", lineHeight: 1.5 }}>
          <strong>Diagnostic Methodology Disclaimer:</strong> {result.disclaimer}
        </div>

        {/* Lead Capture Modal / Slide */}
        {showLeadModal && mounted && typeof document !== "undefined" && createPortal(
          <div 
            className="no-print" 
            style={{ 
              position: "fixed", 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              width: "100vw", 
              height: "100vh", 
              backgroundColor: "rgba(10,10,12,0.5)", 
              backdropFilter: "blur(14px)", 
              WebkitBackdropFilter: "blur(14px)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              zIndex: 99999, 
              padding: "16px",
              boxSizing: "border-box",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowLeadModal(false);
            }}
          >
            <div 
              style={{ 
                backgroundColor: "var(--surface-color)", 
                border: "1px solid var(--border-color)", 
                borderRadius: "20px", 
                padding: "clamp(1.25rem, 4vw, 1.75rem)", 
                maxWidth: "460px", 
                width: "100%", 
                maxHeight: "calc(100dvh - 40px)",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
                position: "relative",
                boxShadow: "0 25px 80px rgba(10,10,12,0.2)",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
              }}
            >
              <button 
                type="button"
                onClick={() => setShowLeadModal(false)} 
                style={{ 
                  position: "absolute", 
                  top: "14px", 
                  right: "14px", 
                  backgroundColor: "rgba(10,10,12,0.05)", 
                  border: "1px solid var(--border-color)", 
                  color: "var(--text-color)", 
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  touchAction: "manipulation",
                  zIndex: 10,
                }}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              {!leadSubmitted ? (
                <>
                  <div style={{ paddingRight: "32px", marginBottom: "0.5rem" }}>
                    <span className="editorial-tag" style={{ fontSize: "0.7rem", color: "var(--accent-color)" }}>SAVE DIAGNOSTIC &amp; GET BLUEPRINT</span>
                    <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "clamp(1.25rem, 3vw, 1.45rem)", fontWeight: 800, color: "var(--text-color)", marginTop: "0.35rem", marginBottom: "0.4rem", lineHeight: 1.25 }}>
                      Get Your 90-Day Growth Blueprint
                    </h3>
                  </div>
                  
                  <p style={{ color: "var(--muted-text)", fontSize: "0.85rem", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                    Submit your details to save this diagnostic assessment and receive a personalized 90-day execution plan.
                  </p>

                  <form onSubmit={handleLeadSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted-text)", marginBottom: "0.25rem" }}>Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid var(--border-color)", borderRadius: "10px", color: "var(--text-color)", fontSize: 16, fontFamily: "var(--font-inter), sans-serif", boxSizing: "border-box" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted-text)", marginBottom: "0.25rem" }}>Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid var(--border-color)", borderRadius: "10px", color: "var(--text-color)", fontSize: 16, fontFamily: "var(--font-inter), sans-serif", boxSizing: "border-box" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted-text)", marginBottom: "0.25rem" }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="rahul@store.com"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid var(--border-color)", borderRadius: "10px", color: "var(--text-color)", fontSize: 16, fontFamily: "var(--font-inter), sans-serif", boxSizing: "border-box" }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="btn-primary"
                      style={{ marginTop: "0.5rem", width: "100%", justifyContent: "center", padding: "0.85rem", fontSize: 13, fontWeight: 700, borderRadius: "9999px", touchAction: "manipulation" }}
                    >
                      {isSubmittingLead ? "Unlocking Blueprint..." : "Save Assessment & Unlock Blueprint"}
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "1rem 0" }}>
                  <CheckCircle2 style={{ width: "48px", height: "48px", color: "var(--accent-color)", margin: "0 auto 1rem" }} />
                  <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.35rem", color: "var(--text-color)", marginBottom: "0.5rem" }}>
                    Blueprint Request Received!
                  </h3>
                  <p style={{ color: "var(--muted-text)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                    Thank you, {leadForm.name}. Our senior growth strategist will review your diagnostic report and contact you via WhatsApp / email within 24 hours.
                  </p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <button onClick={handleDownloadPdf} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.85rem", borderRadius: "9999px", fontSize: 13, fontWeight: 700 }}>
                      Download PDF / Print Report
                    </button>
                    <button onClick={() => setShowLeadModal(false)} className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "0.85rem", borderRadius: "9999px", fontSize: 13, fontWeight: 600 }}>
                      Close Window
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

      </div>
    </div>
  );
}
