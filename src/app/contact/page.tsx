"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", business: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) setSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "#E5E5E5", paddingTop: "7rem", paddingBottom: "5rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Minimal Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="editorial-tag">DIRECT RETAIL ADVISORY</span>
          <h1 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 800, marginTop: "0.5rem", color: "#FFFFFF", letterSpacing: "-0.03em" }}>
            Contact Growth Advisory
          </h1>
          <p style={{ color: "#A3A3A3", fontSize: "0.95rem", maxWidth: "520px", margin: "0.5rem auto 0" }}>
            Have questions regarding your diagnostic report or 90-Day Blueprint? Speak directly with our advisory team.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="grid-cols-1 md:grid-cols-2">
          {/* Info Card */}
          <div className="glass-panel" style={{ borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1.5rem" }}>
                Adyant Nexa Headquarters
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.88rem", color: "#A3A3A3" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Mail size={18} color="#00F2FF" style={{ flexShrink: 0 }} />
                  <a href="mailto:contact@adyantnexa.com" style={{ color: "#E5E5E5", textDecoration: "none" }}>contact@adyantnexa.com</a>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Phone size={18} color="#00F2FF" style={{ flexShrink: 0 }} />
                  <a href="tel:+918700720477" style={{ color: "#E5E5E5", textDecoration: "none" }}>+91 87007 20477</a>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <MapPin size={18} color="#00F2FF" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ lineHeight: 1.4 }}>
                    Unit 716, 7th Floor, ILD Trade Centre,<br />
                    Sector 47, Gurugram, Haryana 122018
                  </span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", backgroundColor: "rgba(0,242,255,0.06)", border: "1px solid rgba(0,242,255,0.2)", padding: "6px 12px", borderRadius: "6px", width: "fit-content" }}>
                  GSTIN: 06CPKPK2852M1ZH
                </div>
              </div>
            </div>

            <div style={{ marginTop: "2rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: "0.75rem", color: "#00F2FF", fontFamily: "var(--font-geist-mono), monospace", fontWeight: 600 }}>CONFIDENTIALITY GUARANTEE</span>
              <p style={{ fontSize: "0.82rem", color: "#737373", marginTop: "0.4rem", lineHeight: 1.4, margin: 0 }}>
                All store numbers &amp; diagnostic data remain strictly confidential.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-panel" style={{ borderRadius: "20px", padding: "2rem" }}>
            {!submitted ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#A3A3A3", marginBottom: "0.25rem" }}>Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amit Kapoor"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "#FFFFFF", fontFamily: "var(--font-inter), sans-serif", fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#A3A3A3", marginBottom: "0.25rem" }}>Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "#FFFFFF", fontFamily: "var(--font-inter), sans-serif", fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#A3A3A3", marginBottom: "0.25rem" }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="amit@store.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "#FFFFFF", fontFamily: "var(--font-inter), sans-serif", fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#A3A3A3", marginBottom: "0.25rem" }}>Store Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Nexa Fashion Studio"
                    value={formData.business}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "#020202", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "#FFFFFF", fontFamily: "var(--font-inter), sans-serif", fontSize: 13 }}
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: "0.5rem", width: "100%", justifyContent: "center" }}>
                  {isSubmitting ? "Sending..." : "Submit Inquiry"}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <CheckCircle2 size={40} color="#00F2FF" style={{ margin: "0 auto 1rem" }} />
                <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.2rem", color: "#FFFFFF", marginBottom: "0.4rem" }}>Inquiry Received</h3>
                <p style={{ color: "#A3A3A3", fontSize: "0.85rem" }}>Thank you. Our advisory team will contact you via WhatsApp / email shortly.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
