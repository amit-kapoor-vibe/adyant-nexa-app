"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import {
  Store,
  TrendingUp,
  Package,
  Megaphone,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
} from "lucide-react";

export default function AssessmentWizardPage() {
  const router = useRouter();
  const [market, setMarket] = useState<"AED" | "GBP">("AED");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    businessName: "Maison Al-Noor",
    industry: "fashion_retail",
    city: "Dubai",
    storeCount: 1,
    channelType: "hybrid",
    yearsInBusiness: 3,

    monthlyRevenue: 180000,
    monthlyTransactions: 150,
    averageOrderValue: 1200,

    inventoryValue: 450000,
    slowDeadStockPercentage: 22,
    inventoryAgeingDays: 90,

    monthlyMarketingSpend: 25000,
    monthlyLeads: 220,
    conversionRate: 2.8,

    newCustomersMonthly: 105,
    repeatCustomersMonthly: 45,
    repeatPurchasePercentage: 30,

    grossMarginPercentage: 58,
    avgDiscountPercentage: 12,
  });

  const currSymbol = market === "GBP" ? "£" : "AED ";
  const formatCurr = (num: number) => {
    return market === "GBP" 
      ? `£${Math.round(num).toLocaleString("en-GB")}` 
      : `AED ${Math.round(num).toLocaleString("en-AE")}`;
  };

  const switchMarket = (m: "AED" | "GBP") => {
    setMarket(m);
    if (m === "AED") {
      setFormData((prev) => ({
        ...prev,
        businessName: prev.businessName === "Mayfair Atelier" ? "Maison Al-Noor" : prev.businessName,
        city: prev.city === "London" ? "Dubai" : prev.city,
        monthlyRevenue: 180000,
        monthlyTransactions: 150,
        averageOrderValue: 1200,
        inventoryValue: 450000,
        slowDeadStockPercentage: 22,
        monthlyMarketingSpend: 25000,
        repeatPurchasePercentage: 30,
        grossMarginPercentage: 58,
        avgDiscountPercentage: 12,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        businessName: prev.businessName === "Maison Al-Noor" ? "Mayfair Atelier" : prev.businessName,
        city: prev.city === "Dubai" ? "London" : prev.city,
        monthlyRevenue: 45000,
        monthlyTransactions: 180,
        averageOrderValue: 250,
        inventoryValue: 110000,
        slowDeadStockPercentage: 20,
        monthlyMarketingSpend: 6000,
        repeatPurchasePercentage: 32,
        grossMarginPercentage: 62,
        avgDiscountPercentage: 10,
      }));
    }
  };

  const steps = [
    { id: 1, name: "Boutique", icon: Store, desc: "Showroom & Market" },
    { id: 2, name: "Sales", icon: TrendingUp, desc: "Revenue & Orders" },
    { id: 3, name: "Inventory", icon: Package, desc: "Stock & Collections" },
    { id: 4, name: "Acquisition", icon: Megaphone, desc: "Chat & Ad Traffic" },
    { id: 5, name: "VIP Retention", icon: Users, desc: "Repeat Clients & Drops" },
    { id: 6, name: "Margins", icon: BarChart3, desc: "Gross Margin & Markdowns" },
    { id: 7, name: "Review", icon: CheckCircle2, desc: "Generate Diagnostic" },
  ];

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit assessment");
      }

      // Store output in localStorage for instant display
      if (typeof window !== "undefined") {
        localStorage.setItem("adyant_latest_assessment", JSON.stringify(data.result));
        localStorage.setItem("adyant_assessment_id", data.assessmentId);
        localStorage.setItem("adyant_business_name", formData.businessName || "Your Store");
        localStorage.setItem("adyant_city", formData.city || "India");
      }

      router.push("/assessment/result");
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "var(--text-color)", paddingTop: "6.5rem", paddingBottom: "4rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "12px" }}>
            AUTONOMOUS RETAIL ENGINE // BOUTIQUE AUDIT
          </span>
          <Heading level="h1" style={{ textAlign: "center", marginBottom: "16px" }}>
            IS YOUR BOUTIQUE READY FOR <br />
            <span style={{ color: "var(--accent-color)" }}>AUTONOMOUS CONVERSATIONAL COMMERCE?</span>
          </Heading>
          <p style={{ fontFamily: "var(--font-inter)", color: "var(--muted-text)", fontSize: "0.95rem", maxWidth: "660px", margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
            Audit your inquiry response latency, showroom stock synchronization, gross margins, and VIP retention economics across Dubai and London.
          </p>

          {/* Market & Currency Toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", padding: "4px", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", borderRadius: "9999px" }}>
            <button
              onClick={() => switchMarket("AED")}
              type="button"
              style={{
                padding: "8px 18px",
                borderRadius: "9999px",
                border: "none",
                fontSize: "12px",
                fontFamily: "var(--font-geist-mono), monospace",
                fontWeight: 700,
                cursor: "pointer",
                backgroundColor: market === "AED" ? "var(--accent-color)" : "transparent",
                color: market === "AED" ? "#020202" : "var(--muted-text)",
                transition: "all 0.2s ease",
              }}
            >
              DUBAI / GCC (AED)
            </button>
            <button
              onClick={() => switchMarket("GBP")}
              type="button"
              style={{
                padding: "8px 18px",
                borderRadius: "9999px",
                border: "none",
                fontSize: "12px",
                fontFamily: "var(--font-geist-mono), monospace",
                fontWeight: 700,
                cursor: "pointer",
                backgroundColor: market === "GBP" ? "var(--accent-color)" : "transparent",
                color: market === "GBP" ? "#020202" : "var(--muted-text)",
                transition: "all 0.2s ease",
              }}
            >
              LONDON / UK (GBP £)
            </button>
          </div>
        </div>

        {/* Wizard Progress Bar */}
        <div style={{ backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "1.25rem", marginBottom: "2rem", boxShadow: "0 4px 20px -2px rgba(10,10,12,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 600 }}>
              STEP {currentStep} OF 7 &mdash; {steps[currentStep - 1].name.toUpperCase()}
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}>
              {Math.round((currentStep / 7) * 100)}% Complete
            </span>
          </div>

          <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(10,10,12,0.08)", borderRadius: "3px", overflow: "hidden" }}>
            <div
              style={{
                width: `${(currentStep / 7) * 100}%`,
                height: "100%",
                backgroundColor: "var(--accent-color)",
                boxShadow: "0 0 10px rgba(0,71,255,0.4)",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Desktop Steps Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <div
                  key={step.id}
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: step.id < currentStep ? "pointer" : "default",
                    opacity: isActive || isCompleted ? 1 : 0.4,
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: isActive ? "var(--accent-color)" : isCompleted ? "rgba(0,71,255,0.12)" : "rgba(10,10,12,0.05)",
                      color: isActive ? "#FFFFFF" : isCompleted ? "var(--accent-color)" : "var(--muted-text)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.25rem",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    <Icon style={{ width: "16px", height: "16px" }} />
                  </div>
                  <span style={{ fontSize: "0.7rem", color: isActive ? "var(--accent-color)" : "var(--muted-text)", display: "none" }} className="md:inline">
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Form Card */}
        <div style={{ backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", borderRadius: "20px", padding: "2rem", boxShadow: "0 20px 50px rgba(10,10,12,0.06)" }}>
          {errorMsg && (
            <div style={{ backgroundColor: "rgba(255,50,50,0.1)", border: "1px solid rgba(255,50,50,0.3)", color: "#FF6B6B", padding: "1rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              {errorMsg}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
            >
              {/* STEP 1: BOUTIQUE PROFILE */}
              {currentStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, color: "var(--text-color)" }}>
                    1. Boutique &amp; Showroom Profile
                  </h3>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted-text)", marginBottom: "0.4rem" }}>
                      Boutique / Brand Label Name *
                    </label>
                    <input
                      type="text"
                      placeholder={market === "AED" ? "e.g. Maison Al-Noor (DIFC)" : "e.g. Mayfair Atelier (London)"}
                      value={formData.businessName}
                      onChange={(e) => updateField("businessName", e.target.value)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontSize: "0.95rem" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted-text)", marginBottom: "0.4rem" }}>
                        Showroom Location / District
                      </label>
                      <input
                        type="text"
                        placeholder={market === "AED" ? "e.g. Dubai / DIFC / D3" : "e.g. London / Mayfair / Soho"}
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontSize: "0.95rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted-text)", marginBottom: "0.4rem" }}>
                        Physical Boutiques / Showrooms
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.storeCount}
                        onChange={(e) => updateField("storeCount", parseInt(e.target.value) || 1)}
                        style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontSize: "0.95rem" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted-text)", marginBottom: "0.4rem" }}>
                      Retail &amp; Sales Channel Model
                    </label>
                    <select
                      value={formData.channelType}
                      onChange={(e) => updateField("channelType", e.target.value)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontSize: "0.95rem" }}
                    >
                      <option value="hybrid">Omnichannel (Physical Showroom + Instagram/WhatsApp Inquiries)</option>
                      <option value="offline">Flagship Physical Boutique Only</option>
                      <option value="online">Online Boutique / Private Client Only</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: SALES */}
              {currentStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, color: "var(--text-color)" }}>
                    2. Sales &amp; Conversational Inquiries
                  </h3>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted-text)", marginBottom: "0.4rem" }}>
                      Average Monthly Revenue ({currSymbol})
                    </label>
                    <input
                      type="number"
                      step={market === "AED" ? "10000" : "2500"}
                      value={formData.monthlyRevenue}
                      onChange={(e) => updateField("monthlyRevenue", parseFloat(e.target.value) || 0)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontSize: "0.95rem" }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "var(--accent-color)", marginTop: "0.25rem", display: "block" }}>
                      Approx {formatCurr(formData.monthlyRevenue)} per month ({formatCurr(formData.monthlyRevenue * 12)} annual)
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted-text)", marginBottom: "0.4rem" }}>
                        Monthly Transactions / Orders
                      </label>
                      <input
                        type="number"
                        value={formData.monthlyTransactions}
                        onChange={(e) => updateField("monthlyTransactions", parseInt(e.target.value) || 0)}
                        style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontSize: "0.95rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted-text)", marginBottom: "0.4rem" }}>
                        Average Order Value ({currSymbol})
                      </label>
                      <input
                        type="number"
                        value={formData.averageOrderValue}
                        onChange={(e) => updateField("averageOrderValue", parseFloat(e.target.value) || 0)}
                        style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontSize: "0.95rem" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: INVENTORY */}
              {currentStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, color: "var(--text-color)" }}>
                    3. Showroom Inventory &amp; Archived Collections
                  </h3>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted-text)", marginBottom: "0.4rem" }}>
                      Total Showroom &amp; Atelier Inventory Valuation (Cost Price in {currSymbol})
                    </label>
                    <input
                      type="number"
                      step={market === "AED" ? "25000" : "5000"}
                      value={formData.inventoryValue}
                      onChange={(e) => updateField("inventoryValue", parseFloat(e.target.value) || 0)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontSize: "0.95rem" }}
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}>
                        Archived / Past-Season Collection Percentage (&gt; 90 days old)
                      </label>
                      <span style={{ color: "var(--accent-color)", fontWeight: 700 }}>{formData.slowDeadStockPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={formData.slowDeadStockPercentage}
                      onChange={(e) => updateField("slowDeadStockPercentage", parseInt(e.target.value))}
                      style={{ width: "100%", accentColor: "var(--accent-color)" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--muted-text)", marginTop: "0.2rem" }}>
                      <span>Healthy (&lt;12%)</span>
                      <span>Moderate (15-25%)</span>
                      <span>Severe (&gt;30%)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: MARKETING */}
              {currentStep === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, color: "var(--text-color)" }}>
                    4. Marketing &amp; Conversational Acquisition
                  </h3>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted-text)", marginBottom: "0.4rem" }}>
                      Monthly Marketing &amp; Ad Spend (Meta, WhatsApp, Google) in {currSymbol}
                    </label>
                    <input
                      type="number"
                      step={market === "AED" ? "2500" : "500"}
                      value={formData.monthlyMarketingSpend}
                      onChange={(e) => updateField("monthlyMarketingSpend", parseFloat(e.target.value) || 0)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontSize: "0.95rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted-text)", marginBottom: "0.4rem" }}>
                      Inquiry-to-Client Conversion Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.conversionRate}
                      onChange={(e) => updateField("conversionRate", parseFloat(e.target.value) || 1.0)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontSize: "0.95rem" }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "var(--muted-text)", marginTop: "0.25rem", display: "block" }}>
                      Luxury fashion benchmark: 2.5% – 4.5%
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 5: CUSTOMER RETENTION */}
              {currentStep === 5 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, color: "var(--text-color)" }}>
                    5. VIP Client Retention &amp; Private Orders
                  </h3>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}>
                        VIP Repeat Client Percentage (% of Total Monthly Buyers)
                      </label>
                      <span style={{ color: "var(--accent-color)", fontWeight: 700 }}>{formData.repeatPurchasePercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="70"
                      value={formData.repeatPurchasePercentage}
                      onChange={(e) => updateField("repeatPurchasePercentage", parseInt(e.target.value))}
                      style={{ width: "100%", accentColor: "var(--accent-color)" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--muted-text)", marginTop: "0.2rem" }}>
                      <span>Low (&lt;20%)</span>
                      <span>Target (35% – 50%)</span>
                      <span>High (&gt;50%)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: MARGINS & DISCOUNTS */}
              {currentStep === 6 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, color: "var(--text-color)" }}>
                    6. Luxury Margins &amp; Private Markdowns
                  </h3>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted-text)", marginBottom: "0.4rem" }}>
                      Average Garment Gross Margin (%)
                    </label>
                    <input
                      type="number"
                      value={formData.grossMarginPercentage}
                      onChange={(e) => updateField("grossMarginPercentage", parseFloat(e.target.value) || 50)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontSize: "0.95rem" }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "var(--muted-text)", marginTop: "0.25rem", display: "block" }}>
                      Luxury apparel average: 55% – 70%
                    </span>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted-text)", marginBottom: "0.4rem" }}>
                      Average Private VIP Markdown / Discount Given (%)
                    </label>
                    <input
                      type="number"
                      value={formData.avgDiscountPercentage}
                      onChange={(e) => updateField("avgDiscountPercentage", parseFloat(e.target.value) || 15)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontSize: "0.95rem" }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 7: REVIEW */}
              {currentStep === 7 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, color: "var(--text-color)" }}>
                    7. Review Submitted Diagnostic Parameters
                  </h3>

                  <div style={{ backgroundColor: "rgba(248, 248, 250, 0.7)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.25rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem" }}>
                      <div><span style={{ color: "var(--muted-text)" }}>Boutique Name:</span> <strong>{formData.businessName || "Not specified"}</strong></div>
                      <div><span style={{ color: "var(--muted-text)" }}>Location:</span> <strong>{formData.city}</strong></div>
                      <div><span style={{ color: "var(--muted-text)" }}>Monthly Revenue:</span> <strong>{formatCurr(formData.monthlyRevenue)}</strong></div>
                      <div><span style={{ color: "var(--muted-text)" }}>Inventory Valuation:</span> <strong>{formatCurr(formData.inventoryValue)}</strong></div>
                      <div><span style={{ color: "var(--muted-text)" }}>Archived Stock Rate:</span> <strong>{formData.slowDeadStockPercentage}%</strong></div>
                      <div><span style={{ color: "var(--muted-text)" }}>Private Markdown:</span> <strong>{formData.avgDiscountPercentage}%</strong></div>
                      <div><span style={{ color: "var(--muted-text)" }}>VIP Repeat Rate:</span> <strong>{formData.repeatPurchasePercentage}%</strong></div>
                      <div><span style={{ color: "var(--muted-text)" }}>Marketing Spend:</span> <strong>{formatCurr(formData.monthlyMarketingSpend)}/mo</strong></div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-color)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    <Info style={{ width: "20px", height: "20px" }} />
                    <span>Clicking below will execute the Autonomous Boutique Growth Engine.</span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-color)" }}>
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                borderRadius: "10px",
                backgroundColor: "transparent",
                border: "1px solid var(--border-color)",
                color: currentStep === 1 ? "#A3A3A3" : "var(--text-color)",
                cursor: currentStep === 1 ? "not-allowed" : "pointer",
              }}
            >
              <ArrowLeft style={{ width: "16px", height: "16px" }} /> Back
            </button>

            {currentStep < 7 ? (
              <button
                onClick={handleNext}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "10px",
                  backgroundColor: "var(--accent-color)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(0,71,255,0.2)",
                }}
              >
                Next Step <ArrowRight style={{ width: "16px", height: "16px" }} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.75rem",
                  borderRadius: "10px",
                  backgroundColor: "var(--accent-color)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  border: "none",
                  cursor: isSubmitting ? "wait" : "pointer",
                  boxShadow: "0 8px 24px rgba(0,71,255,0.25)",
                }}
              >
                {isSubmitting ? "Calculating Autonomous Score..." : "Calculate Autonomous Boutique Score"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
