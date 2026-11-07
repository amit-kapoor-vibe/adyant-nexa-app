"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

export function MidnightLeakageDiagnostic() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [agencyName, setAgencyName] = useState("Apex Horizon Real Estate");
  const [brokerCount, setBrokerCount] = useState("16-30");
  const [monthlyAdSpend, setMonthlyAdSpend] = useState(35000);
  const [monthlyInquiries, setMonthlyInquiries] = useState(400);
  const [midnightLeadPercent, setMidnightLeadPercent] = useState(65);
  const [avgCommissionAed, setAvgCommissionAed] = useState(70000);

  // Contact Info
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  // Calculated Metrics
  const overseasInquiries = Math.round((monthlyInquiries * midnightLeadPercent) / 100);
  const estimatedLostDealsPerMonth = Math.max(1, Math.round(overseasInquiries * 0.035));
  const estimatedMonthlyCommissionLost = estimatedLostDealsPerMonth * avgCommissionAed;
  const estimatedAnnualLostRevenue = estimatedMonthlyCommissionLost * 12;

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPhone.trim()) {
      alert("Please enter a valid WhatsApp phone number.");
      return;
    }
    setIsSubmitting(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName || agencyName,
          email: contactEmail || "brokerage@audit.ae",
          phone: contactPhone,
          business: `${agencyName} (${brokerCount} brokers)`,
          budget: `Est Commission Loss: AED ${estimatedMonthlyCommissionLost.toLocaleString()}/mo`,
          message: `DUBAI BROKERAGE AUDIT COMPLETED: Ad Spend AED ${monthlyAdSpend.toLocaleString()}, Inquiries ${monthlyInquiries}/mo, Midnight Leakage ${midnightLeadPercent}%, Est Lost Commission AED ${estimatedMonthlyCommissionLost.toLocaleString()}/mo.`,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="diagnostic" style={{ maxWidth: "1000px", margin: "0 auto", padding: "80px 24px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <span style={{ 
          display: "inline-block", 
          marginBottom: "12px", 
          color: "#0047FF", 
          fontFamily: "var(--font-geist-mono), monospace",
          letterSpacing: "0.25em", 
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          background: "#E7ECFF",
          padding: "4px 12px",
          borderRadius: "4px"
        }}>
          DUBAI BROKERAGE AI READINESS // 3-MINUTE DIAGNOSTIC
        </span>
        <h2 style={{ 
          fontFamily: "var(--font-syne), sans-serif", 
          fontSize: "clamp(2rem, 4vw, 3rem)", 
          fontWeight: 800, 
          letterSpacing: "-0.025em", 
          color: "#0A0A0C",
          lineHeight: 1.1,
          marginBottom: "16px"
        }}>
          Calculate Your Agency&apos;s <br />
          <span style={{ color: "#0047FF" }}>Midnight Lead Leakage</span>
        </h2>
        <p style={{ color: "#60606A", fontSize: "15px", maxWidth: "640px", margin: "0 auto", lineHeight: 1.6 }}>
          Discover how many overseas property inquiries drop off while your brokers sleep—and calculate the annual commission revenue recoverable via 24/7 autonomous qualification.
        </p>
      </div>

      {/* Step Indicator */}
      {!submitted && (
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
          {[
            { num: 1, label: "Agency Fleet" },
            { num: 2, label: "Inbound Dynamics" },
            { num: 3, label: "Commission Model" },
          ].map(s => (
            <div 
              key={s.num} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "999px",
                background: currentStep === s.num ? "rgba(0, 71, 255, 0.08)" : "#FFFFFF",
                border: "1px solid",
                borderColor: currentStep === s.num ? "#0047FF" : "rgba(10, 10, 12, 0.08)",
                color: currentStep === s.num ? "#0047FF" : "#60606A",
                fontSize: "12px",
                fontWeight: 600
              }}
            >
              <span style={{ 
                width: "20px", 
                height: "20px", 
                borderRadius: "50%", 
                background: currentStep === s.num ? "#0047FF" : "rgba(10, 10, 12, 0.08)", 
                color: currentStep === s.num ? "#FFFFFF" : "#60606A", 
                display: "inline-flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: "11px", 
                fontWeight: 700 
              }}>
                {s.num}
              </span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Card */}
      <div style={{ 
        background: "#FFFFFF", 
        borderRadius: "20px", 
        border: "1px solid rgba(10, 10, 12, 0.08)", 
        padding: "40px", 
        boxShadow: "0 6px 30px rgba(10, 10, 12, 0.04)" 
      }}>
        {!submitted ? (
          <div>
            {/* STEP 1: AGENCY FLEET */}
            {currentStep === 1 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#0A0A0C", marginBottom: "6px" }}>
                  Agency Scale &amp; Fleet Size
                </h3>
                <p style={{ color: "#60606A", fontSize: "13px", marginBottom: "24px" }}>
                  Specify your Dubai brokerage name and the number of active closing agents.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace", color: "#60606A", fontWeight: 700, display: "block", marginBottom: "8px" }}>
                      BROKERAGE / AGENCY NAME
                    </label>
                    <input 
                      value={agencyName} 
                      onChange={e => setAgencyName(e.target.value)} 
                      placeholder="e.g. Apex Horizon Real Estate LLC"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid rgba(10, 10, 12, 0.12)", fontSize: "14px", color: "#0A0A0C", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace", color: "#60606A", fontWeight: 700, display: "block", marginBottom: "8px" }}>
                      NUMBER OF LICENSED BROKERS
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                      {["1-5", "6-15", "16-30", "30+"].map(cnt => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => setBrokerCount(cnt)}
                          style={{
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid",
                            borderColor: brokerCount === cnt ? "#0047FF" : "rgba(10, 10, 12, 0.12)",
                            background: brokerCount === cnt ? "rgba(0, 71, 255, 0.08)" : "#FFFFFF",
                            color: brokerCount === cnt ? "#0047FF" : "#0A0A0C",
                            fontWeight: 700,
                            fontSize: "13px",
                            cursor: "pointer"
                          }}
                        >
                          {cnt} Brokers
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: INBOUND DYNAMICS */}
            {currentStep === 2 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#0A0A0C", marginBottom: "6px" }}>
                  Inbound Lead Volume &amp; Ad Spend
                </h3>
                <p style={{ color: "#60606A", fontSize: "13px", marginBottom: "24px" }}>
                  Quantify your monthly marketing investment and international inquiry patterns.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <label style={{ fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace", color: "#60606A", fontWeight: 700 }}>
                        MONTHLY META &amp; GOOGLE AD SPEND
                      </label>
                      <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "13px", fontWeight: 700, color: "#0047FF" }}>
                        AED {monthlyAdSpend.toLocaleString()}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min={10000} 
                      max={150000} 
                      step={5000}
                      value={monthlyAdSpend} 
                      onChange={e => setMonthlyAdSpend(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#0047FF", cursor: "pointer" }}
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <label style={{ fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace", color: "#60606A", fontWeight: 700 }}>
                        ESTIMATED INBOUND LEADS PER MONTH
                      </label>
                      <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "13px", fontWeight: 700, color: "#0047FF" }}>
                        {monthlyInquiries} Leads / mo
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min={100} 
                      max={1200} 
                      step={25}
                      value={monthlyInquiries} 
                      onChange={e => setMonthlyInquiries(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#0047FF", cursor: "pointer" }}
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <label style={{ fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace", color: "#60606A", fontWeight: 700 }}>
                        % OVERSEAS INQUIRIES (10 PM – 6 AM GST)
                      </label>
                      <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "13px", fontWeight: 700, color: "#D97706" }}>
                        {midnightLeadPercent}% ({overseasInquiries} leads)
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min={20} 
                      max={90} 
                      step={5}
                      value={midnightLeadPercent} 
                      onChange={e => setMidnightLeadPercent(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#D97706", cursor: "pointer" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: COMMISSION ECONOMICS */}
            {currentStep === 3 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#0A0A0C", marginBottom: "6px" }}>
                  Commission Economics &amp; Results
                </h3>
                <p style={{ color: "#60606A", fontSize: "13px", marginBottom: "24px" }}>
                  Specify your agency&apos;s average deal commission to unlock the estimated leakage report.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <label style={{ fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace", color: "#60606A", fontWeight: 700 }}>
                        AVERAGE BROKERAGE COMMISSION PER DEAL
                      </label>
                      <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "13px", fontWeight: 700, color: "#10B981" }}>
                        AED {avgCommissionAed.toLocaleString()} (2% on AED 3.5M)
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min={30000} 
                      max={200000} 
                      step={5000}
                      value={avgCommissionAed} 
                      onChange={e => setAvgCommissionAed(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#10B981", cursor: "pointer" }}
                    />
                  </div>

                  {/* Preliminary Metric Preview */}
                  <div style={{ background: "rgba(0, 71, 255, 0.04)", border: "1px solid rgba(0, 71, 255, 0.16)", borderRadius: "12px", padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                      <div>
                        <span style={{ fontSize: "10px", fontFamily: "var(--font-geist-mono), monospace", color: "#60606A", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                          ESTIMATED MONTHLY COMMISSION LEAKAGE
                        </span>
                        <div style={{ fontSize: "24px", fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, color: "#DC2626", marginTop: "2px" }}>
                          AED {estimatedMonthlyCommissionLost.toLocaleString()} / mo
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "11px", color: "#60606A" }}>Annual Drag</span>
                        <div style={{ fontSize: "16px", fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, color: "#0A0A0C" }}>
                          AED {estimatedAnnualLostRevenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Details to Unlock Report */}
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                    <label style={{ fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace", color: "#0047FF", fontWeight: 700 }}>
                      WHERE SHOULD WE SEND YOUR 90-DAY RECOVERY BLUEPRINT?
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <input 
                        required
                        placeholder="Your Name (Agency Principal)"
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        style={{ padding: "11px 14px", borderRadius: "6px", border: "1px solid rgba(10, 10, 12, 0.12)", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                      />
                      <input 
                        required
                        placeholder="WhatsApp Number (+971 ...)"
                        value={contactPhone}
                        onChange={e => setContactPhone(e.target.value)}
                        style={{ padding: "11px 14px", borderRadius: "6px", border: "1px solid rgba(10, 10, 12, 0.12)", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      style={{ 
                        padding: "13px", 
                        background: "#0047FF", 
                        color: "#FFFFFF", 
                        border: "none", 
                        borderRadius: "8px", 
                        fontSize: "13px", 
                        fontWeight: 700, 
                        cursor: "pointer", 
                        marginTop: "6px" 
                      }}
                    >
                      {isSubmitting ? "Generating Blueprint..." : "Unlock Full Recovery Blueprint →"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", paddingTop: "20px", borderTop: "1px solid rgba(10, 10, 12, 0.08)" }}>
              {currentStep > 1 ? (
                <button 
                  type="button" 
                  onClick={handleBack}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "none", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "6px", fontSize: "12px", cursor: "pointer", color: "#60606A" }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
              ) : <div />}

              {currentStep < 3 && (
                <button 
                  type="button" 
                  onClick={handleNext}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 24px", background: "#0047FF", color: "#FFFFFF", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                >
                  Continue <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* SUBMISSION CONFIRMATION & ROADMAP */
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle2 size={32} color="#10B981" />
            </div>
            <span style={{ color: "#10B981", fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              DIAGNOSTIC COMPLETE
            </span>
            <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#0A0A0C", margin: "8px 0 12px" }}>
              Your Brokerage Recovery Roadmap
            </h3>
            <p style={{ color: "#60606A", fontSize: "14px", maxWidth: "560px", margin: "0 auto 28px", lineHeight: 1.6 }}>
              For {agencyName} ({brokerCount} brokers), we estimate an annual commission recovery opportunity of:
            </p>

            <div style={{ background: "rgba(0, 71, 255, 0.05)", border: "1px solid rgba(0, 71, 255, 0.15)", borderRadius: "16px", padding: "28px", maxWidth: "480px", margin: "0 auto 32px" }}>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace", color: "#60606A", textTransform: "uppercase" }}>
                ESTIMATED RECOVERABLE COMMISSION
              </span>
              <div style={{ fontSize: "36px", fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, color: "#0047FF", marginTop: "4px" }}>
                AED {estimatedAnnualLostRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: "12px", color: "#10B981", marginTop: "6px", fontWeight: 600 }}>
                Based on ~{estimatedLostDealsPerMonth * 12} additional high-intent overseas closings per year.
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <a 
                href={`https://wa.me/?text=Hi%2C%20I%20completed%20the%20Adyant%20Nexa%20Diagnostic%20for%20${encodeURIComponent(agencyName)}.%20Estimated%20lost%20commission%20is%20AED%20${estimatedMonthlyCommissionLost.toLocaleString()}%2Fmo.%20I%20want%20to%20review%20the%20pilot%20deployment.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "12px 24px", background: "#0047FF", color: "#FFFFFF", borderRadius: "999px", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}
              >
                Schedule WhatsApp Review Walkthrough ↗
              </a>
              <Link 
                href="/terminal" 
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "12px 24px", background: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.18)", color: "#0A0A0C", borderRadius: "999px", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}
              >
                Test Demo Terminal ↗
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
