"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  IndianRupee,
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    businessName: "",
    industry: "fashion_retail",
    city: "",
    storeCount: 1,
    channelType: "offline",
    yearsInBusiness: 3,

    monthlyRevenue: 400000,
    monthlyTransactions: 200,
    averageOrderValue: 2000,

    inventoryValue: 1200000,
    slowDeadStockPercentage: 20,
    inventoryAgeingDays: 90,

    monthlyMarketingSpend: 25000,
    monthlyLeads: 150,
    conversionRate: 1.5,

    newCustomersMonthly: 120,
    repeatCustomersMonthly: 30,
    repeatPurchasePercentage: 20,

    grossMarginPercentage: 50,
    avgDiscountPercentage: 18,
  });

  const steps = [
    { id: 1, name: "Business", icon: Store, desc: "Store & Industry" },
    { id: 2, name: "Sales", icon: IndianRupee, desc: "Revenue & Orders" },
    { id: 3, name: "Inventory", icon: Package, desc: "Stock & Ageing" },
    { id: 4, name: "Marketing", icon: Megaphone, desc: "Acquisition & Spend" },
    { id: 5, name: "Customers", icon: Users, desc: "Repeat Buyers & LTV" },
    { id: 6, name: "Margins", icon: BarChart3, desc: "Gross Margin & Discounts" },
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
    <div style={{ minHeight: "100vh", background: "transparent", color: "#E5E5E5", paddingTop: "6rem", paddingBottom: "4rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className="editorial-tag">FREE BUSINESS GROWTH ASSESSMENT</span>
          <h1 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "2.25rem", fontWeight: 800, marginTop: "0.5rem", color: "#FFFFFF" }}>
            Retail Profit Leakage Diagnostic
          </h1>
          <p style={{ color: "#A3A3A3", fontSize: "0.95rem", maxWidth: "600px", margin: "0.5rem auto 0" }}>
            Identify where your fashion retail store is losing money across inventory, margins, retention, and marketing.
          </p>
        </div>

        {/* Wizard Progress Bar */}
        <div style={{ backgroundColor: "#080808", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.25rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 600 }}>
              STEP {currentStep} OF 7 &mdash; {steps[currentStep - 1].name.toUpperCase()}
            </span>
            <span style={{ fontSize: "0.85rem", color: "#A3A3A3" }}>
              {Math.round((currentStep / 7) * 100)}% Complete
            </span>
          </div>

          <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
            <div
              style={{
                width: `${(currentStep / 7) * 100}%`,
                height: "100%",
                backgroundColor: "#00F2FF",
                boxShadow: "0 0 10px #00F2FF",
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
                      backgroundColor: isActive ? "#00F2FF" : isCompleted ? "rgba(0,242,255,0.2)" : "rgba(255,255,255,0.05)",
                      color: isActive ? "#020202" : isCompleted ? "#00F2FF" : "#A3A3A3",
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
                  <span style={{ fontSize: "0.7rem", color: isActive ? "#00F2FF" : "#A3A3A3", display: "none" }} className="md:inline">
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Form Card */}
        <div style={{ backgroundColor: "#080808", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "2rem", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
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
              {/* STEP 1: BUSINESS PROFILE */}
              {currentStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#FFFFFF" }}>
                    1. Business Profile
                  </h3>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                      Store / Business Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Ethnic Studio"
                      value={formData.businessName}
                      onChange={(e) => updateField("businessName", e.target.value)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#FFFFFF", fontSize: "0.95rem" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                        City / Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jaipur"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#FFFFFF", fontSize: "0.95rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                        Number of Physical Stores
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.storeCount}
                        onChange={(e) => updateField("storeCount", parseInt(e.target.value) || 1)}
                        style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#FFFFFF", fontSize: "0.95rem" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                      Sales Channel Model
                    </label>
                    <select
                      value={formData.channelType}
                      onChange={(e) => updateField("channelType", e.target.value)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#FFFFFF", fontSize: "0.95rem" }}
                    >
                      <option value="offline">Offline Store Only</option>
                      <option value="hybrid">Omnichannel / Hybrid (Offline + Online)</option>
                      <option value="online">Online D2C Only</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: SALES */}
              {currentStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#FFFFFF" }}>
                    2. Sales & Monthly Revenue
                  </h3>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                      Average Monthly Revenue (₹)
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={formData.monthlyRevenue}
                      onChange={(e) => updateField("monthlyRevenue", parseFloat(e.target.value) || 0)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#FFFFFF", fontSize: "0.95rem" }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "#00F2FF", marginTop: "0.25rem", display: "block" }}>
                      Approx ₹{(formData.monthlyRevenue / 100000).toFixed(2)} Lakhs per month (₹{((formData.monthlyRevenue * 12) / 100000).toFixed(2)} Lakhs annual)
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                        Monthly Transactions / Orders
                      </label>
                      <input
                        type="number"
                        value={formData.monthlyTransactions}
                        onChange={(e) => updateField("monthlyTransactions", parseInt(e.target.value) || 0)}
                        style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#FFFFFF", fontSize: "0.95rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                        Average Order Value (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.averageOrderValue}
                        onChange={(e) => updateField("averageOrderValue", parseFloat(e.target.value) || 0)}
                        style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#FFFFFF", fontSize: "0.95rem" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: INVENTORY */}
              {currentStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#FFFFFF" }}>
                    3. Inventory & Dead Stock
                  </h3>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                      Total Current Inventory Valuation (Cost Price in ₹)
                    </label>
                    <input
                      type="number"
                      step="50000"
                      value={formData.inventoryValue}
                      onChange={(e) => updateField("inventoryValue", parseFloat(e.target.value) || 0)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#FFFFFF", fontSize: "0.95rem" }}
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", color: "#A3A3A3" }}>
                        Estimated Slow-Moving / Dead Stock Percentage (% of Inventory)
                      </label>
                      <span style={{ color: "#00F2FF", fontWeight: 700 }}>{formData.slowDeadStockPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={formData.slowDeadStockPercentage}
                      onChange={(e) => updateField("slowDeadStockPercentage", parseInt(e.target.value))}
                      style={{ width: "100%", accentColor: "#00F2FF" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#A3A3A3", marginTop: "0.2rem" }}>
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
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#FFFFFF" }}>
                    4. Marketing & Acquisition
                  </h3>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                      Monthly Marketing & Advertising Spend (₹)
                    </label>
                    <input
                      type="number"
                      step="5000"
                      value={formData.monthlyMarketingSpend}
                      onChange={(e) => updateField("monthlyMarketingSpend", parseFloat(e.target.value) || 0)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#FFFFFF", fontSize: "0.95rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                      Estimated Visitor / Lead Conversion Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.conversionRate}
                      onChange={(e) => updateField("conversionRate", parseFloat(e.target.value) || 1.0)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#FFFFFF", fontSize: "0.95rem" }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "#A3A3A3", marginTop: "0.25rem", display: "block" }}>
                      Healthy retail benchmark: 2.0% – 3.5%
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 5: CUSTOMER RETENTION */}
              {currentStep === 5 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#FFFFFF" }}>
                    5. Customer Retention & Repeat Buyers
                  </h3>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <label style={{ fontSize: "0.85rem", color: "#A3A3A3" }}>
                        Repeat Customer Percentage (% of Total Monthly Buyers)
                      </label>
                      <span style={{ color: "#00F2FF", fontWeight: 700 }}>{formData.repeatPurchasePercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="70"
                      value={formData.repeatPurchasePercentage}
                      onChange={(e) => updateField("repeatPurchasePercentage", parseInt(e.target.value))}
                      style={{ width: "100%", accentColor: "#00F2FF" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#A3A3A3", marginTop: "0.2rem" }}>
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
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#FFFFFF" }}>
                    6. Gross Margins & Discounting
                  </h3>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                      Average Product Gross Margin (%)
                    </label>
                    <input
                      type="number"
                      value={formData.grossMarginPercentage}
                      onChange={(e) => updateField("grossMarginPercentage", parseFloat(e.target.value) || 50)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#FFFFFF", fontSize: "0.95rem" }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "#A3A3A3", marginTop: "0.25rem", display: "block" }}>
                      Fashion retail average: 45% – 60%
                    </span>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#A3A3A3", marginBottom: "0.4rem" }}>
                      Average Overall Discount Given Across Sales (%)
                    </label>
                    <input
                      type="number"
                      value={formData.avgDiscountPercentage}
                      onChange={(e) => updateField("avgDiscountPercentage", parseFloat(e.target.value) || 15)}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#FFFFFF", fontSize: "0.95rem" }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 7: REVIEW */}
              {currentStep === 7 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#FFFFFF" }}>
                    7. Review Submitted Diagnostic Parameters
                  </h3>

                  <div style={{ backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.25rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem" }}>
                      <div><span style={{ color: "#A3A3A3" }}>Store Name:</span> <strong>{formData.businessName || "Not specified"}</strong></div>
                      <div><span style={{ color: "#A3A3A3" }}>Location:</span> <strong>{formData.city || "India"}</strong></div>
                      <div><span style={{ color: "#A3A3A3" }}>Monthly Revenue:</span> <strong>₹{(formData.monthlyRevenue).toLocaleString('en-IN')}</strong></div>
                      <div><span style={{ color: "#A3A3A3" }}>Inventory Valuation:</span> <strong>₹{(formData.inventoryValue).toLocaleString('en-IN')}</strong></div>
                      <div><span style={{ color: "#A3A3A3" }}>Dead Stock Rate:</span> <strong>{formData.slowDeadStockPercentage}%</strong></div>
                      <div><span style={{ color: "#A3A3A3" }}>Average Discount:</span> <strong>{formData.avgDiscountPercentage}%</strong></div>
                      <div><span style={{ color: "#A3A3A3" }}>Repeat Buyer Rate:</span> <strong>{formData.repeatPurchasePercentage}%</strong></div>
                      <div><span style={{ color: "#A3A3A3" }}>Marketing Spend:</span> <strong>₹{(formData.monthlyMarketingSpend).toLocaleString('en-IN')}/mo</strong></div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#00F2FF", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    <Info style={{ width: "20px", height: "20px" }} />
                    <span>Clicking below will execute the Adyant Nexa Growth Calculation Engine.</span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
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
                border: "1px solid rgba(255,255,255,0.15)",
                color: currentStep === 1 ? "#555" : "#E5E5E5",
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
                  backgroundColor: "#00F2FF",
                  color: "#020202",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
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
                  backgroundColor: "#00F2FF",
                  color: "#020202",
                  fontWeight: 700,
                  border: "none",
                  cursor: isSubmitting ? "wait" : "pointer",
                  boxShadow: "0 0 20px rgba(0,242,255,0.4)",
                }}
              >
                {isSubmitting ? "Calculating Growth Score..." : "Calculate My Growth Score"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
