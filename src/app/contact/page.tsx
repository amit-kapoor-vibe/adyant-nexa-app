"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { CalendlyBadge } from "@/components/CalendlyBadge";
import { CalendlyBookingCard } from "@/components/CalendlyBookingCard";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    monthlyRevenue: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business: formData.business,
          budget: formData.monthlyRevenue || "Not specified",
          message: formData.message || "Direct contact page inquiry",
        }),
      });

      if (res.ok) setSubmitted(true);
    } catch (e) {
      console.error(e);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "var(--text-color)", paddingTop: "clamp(5.5rem, 12vw, 7rem)", paddingBottom: "clamp(3.5rem, 8vw, 5rem)", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "0 clamp(1rem, 4vw, 1.5rem)" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(2rem, 6vw, 3.5rem)" }}>
          <span className="editorial-tag" style={{ display: "block", marginBottom: "12px" }}>
            DIRECT COMMERCE ADVISORY &bull; INITIATE PARTNERSHIP
          </span>
          <Heading level="h1" style={{ textAlign: "center", marginBottom: "16px" }}>
            Let&apos;s Build the Next <br />
            <span style={{ color: "var(--accent-color)" }}>Revenue Engine</span>
          </Heading>
          <p style={{ color: "var(--muted-text)", fontSize: "clamp(0.9rem, 2vw, 1rem)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
            Whether you run a physical retail store looking to scale D2C, or an apparel brand seeking profitable growth architecture, our senior team is ready to evaluate your numbers.
          </p>
        </div>

        <div className="contact-grid">
          
          {/* Info Card */}
          <div className="glass-panel" style={{ borderRadius: "24px", padding: "clamp(1.5rem, 4vw, 2.5rem)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span className="editorial-tag" style={{ display: "block", marginBottom: "8px" }}>COMMUNICATION CHANNELS</span>
              <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "clamp(1.15rem, 3vw, 1.35rem)", fontWeight: 700, color: "var(--text-color)", marginBottom: "1.75rem" }}>
                AdyantNexa Headquarters
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", fontSize: "0.92rem", color: "var(--muted-text)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
                  <Mail size={18} color="#0047FF" style={{ flexShrink: 0, marginTop: "3px" }} />
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#666", display: "block" }}>Direct Inquiry</span>
                    <a href="mailto:contact@adyantnexa.com" style={{ color: "var(--text-color)", textDecoration: "none", fontWeight: 600, wordBreak: "break-all" }}>contact@adyantnexa.com</a>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
                  <Phone size={18} color="#0047FF" style={{ flexShrink: 0, marginTop: "3px" }} />
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#666", display: "block" }}>Direct Line / WhatsApp</span>
                    <a href="tel:+918700720477" style={{ color: "var(--text-color)", textDecoration: "none", fontWeight: 600 }}>+91 87007 20477</a>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
                  <MapPin size={18} color="#0047FF" style={{ flexShrink: 0, marginTop: "3px" }} />
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#666", display: "block" }}>Registered Office</span>
                    <span style={{ color: "var(--text-color)", lineHeight: 1.5, display: "block" }}>
                      Unit 716, 7th Floor, ILD Trade Centre,<br />
                      Sector 47, Gurugram, Haryana 122018
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: "0.78rem", color: "var(--accent-color)", fontFamily: "var(--font-geist-mono), monospace", backgroundColor: "rgba(0,71,255,0.06)", border: "1px solid rgba(0,71,255,0.18)", padding: "8px 14px", borderRadius: "8px", width: "fit-content" }}>
                  GSTIN: 06CPKPK2852M1ZH
                </div>
              </div>

              <CalendlyBookingCard />
            </div>

            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-color)", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <ShieldCheck size={20} color="#0047FF" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-color)", fontWeight: 700, display: "block" }}>Commercial Confidentiality Guarantee</span>
                <p style={{ fontSize: "0.8rem", color: "#737373", marginTop: "2px", lineHeight: 1.4, margin: 0 }}>
                  All business data, unit margins, and sales metrics remain strictly confidential under mutual NDA standards.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-panel" style={{ borderRadius: "24px", padding: "clamp(1.5rem, 4vw, 2.5rem)", border: "1px solid var(--border-color)" }}>
            {!submitted ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted-text)", marginBottom: "0.3rem" }}>Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontFamily: "var(--font-inter), sans-serif", fontSize: 16 }}
                  />
                </div>

                <div className="form-row-2">
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted-text)", marginBottom: "0.3rem" }}>Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontFamily: "var(--font-inter), sans-serif", fontSize: 16 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted-text)", marginBottom: "0.3rem" }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@store.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontFamily: "var(--font-inter), sans-serif", fontSize: 16 }}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted-text)", marginBottom: "0.3rem" }}>Business / Store Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Ethnic Studio"
                      value={formData.business}
                      onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontFamily: "var(--font-inter), sans-serif", fontSize: 16 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted-text)", marginBottom: "0.3rem" }}>Approx. Monthly Revenue</label>
                    <select
                      value={formData.monthlyRevenue}
                      onChange={(e) => setFormData({ ...formData, monthlyRevenue: e.target.value })}
                      style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontFamily: "var(--font-inter), sans-serif", fontSize: 16 }}
                    >
                      <option value="">Select Range</option>
                      <option value="Under ₹3 Lakhs">Under ₹3 Lakhs / mo</option>
                      <option value="₹3 Lakhs - ₹10 Lakhs">₹3 Lakhs &ndash; ₹10 Lakhs / mo</option>
                      <option value="₹10 Lakhs - ₹25 Lakhs">₹10 Lakhs &ndash; ₹25 Lakhs / mo</option>
                      <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs &ndash; ₹50 Lakhs / mo</option>
                      <option value="₹50 Lakhs+">₹50 Lakhs+ / mo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted-text)", marginBottom: "0.3rem" }}>Tell Us About Your Product &amp; Goals</label>
                  <textarea
                    rows={3}
                    placeholder="Current channels, biggest challenges (dead stock, ROAS, scaling D2C), and what you want to achieve..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: "10px", color: "var(--text-color)", fontFamily: "var(--font-inter), sans-serif", fontSize: 16, resize: "none" }}
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: "0.5rem", width: "100%", justifyContent: "center", padding: "0.9rem" }}>
                  {isSubmitting ? "Submitting Inquiry..." : "Submit Growth Inquiry"}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <CheckCircle2 size={48} color="#0047FF" style={{ margin: "0 auto 1.25rem" }} />
                <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.4rem", color: "var(--text-color)", marginBottom: "0.5rem" }}>
                  Inquiry Received
                </h3>
                <p style={{ color: "rgba(229,229,229,0.8)", fontSize: "0.92rem", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto 1.5rem" }}>
                  Thank you, {formData.name}. Our senior growth strategist will review your brand details and contact you via WhatsApp / email within 24 hours.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary" style={{ padding: "0.6rem 1.5rem" }}>
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1.1fr;
            gap: 2rem;
          }
          .form-row-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          @media (max-width: 820px) {
            .contact-grid {
              grid-template-columns: 1fr !important;
              gap: 1.5rem;
            }
          }
          @media (max-width: 540px) {
            .form-row-2 {
              grid-template-columns: 1fr !important;
              gap: 1.1rem;
            }
          }
        `}</style>
        <CalendlyBadge />
      </div>
    </div>
  );
}
