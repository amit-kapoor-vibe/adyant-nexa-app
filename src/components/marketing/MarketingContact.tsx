"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Target, BarChart3, Globe, CheckCircle } from "lucide-react";
import { FadeSection } from "../FadeSection";
import { trackEvent } from "@/utils/analytics";

export const MarketingContact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    adSpend: "",
    goal: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
          phone: "Marketing Form",
          business: formData.website,
          budget: formData.adSpend,
          message: `GOAL: ${formData.goal}`
        })
      });

      if (res.ok) {
        trackEvent('lead_submitted', { source: 'marketing_contact' });
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error("Lead submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="audit" style={{ padding: "100px 20px", background: "#020202", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 20, display: "block" }}>Growth Audit Protocol_</span>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", marginBottom: 20 }}>
              Ready to <span style={{ color: "rgba(255,255,255,0.2)" }}>Scale?</span>
            </h2>
            <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
              Submit your brand for a comprehensive Neural Audit. We analyze your creative velocity, tracking infrastructure, and conversion leaks.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
                {/* Name */}
                <div style={{ position: "relative" }}>
                  <input 
                    type="text" placeholder="Full Name (e.g. Amit Kapoor)" required 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px 24px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13 }} 
                  />
                </div>
                {/* Email */}
                <div style={{ position: "relative" }}>
                  <input 
                    type="email" placeholder="Business Email (e.g. amit@brand.com)" required 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px 24px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13 }} 
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
                {/* Website */}
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#00F2FF", opacity: 0.5, zIndex: 1 }}><Globe size={16} /></div>
                  <div style={{ 
                    position: "absolute", left: 44, color: "rgba(255,255,255,0.2)", 
                    fontFamily: "var(--font-geist-mono)", fontSize: 13, pointerEvents: "none" 
                  }}>
                    https://
                  </div>
                  <input 
                    type="text" placeholder="yourwebsite.com" required 
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value.replace(/^https?:\/\//, "") })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px 24px 18px 105px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13 }} 
                  />
                </div>
                {/* Ad Spend */}
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#00F2FF", opacity: 0.5 }}><BarChart3 size={16} /></div>
                  <select 
                    required defaultValue=""
                    onChange={(e) => setFormData({ ...formData, adSpend: e.target.value })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px 24px 18px 48px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13, appearance: "none" }}
                  >
                    <option value="" disabled style={{ background: "#020202" }}>Monthly Ad Spend</option>
                    <option value="₹1L - ₹5L" style={{ background: "#020202" }}>₹1L - ₹5L</option>
                    <option value="₹5L - ₹20L" style={{ background: "#020202" }}>₹5L - ₹20L</option>
                    <option value="₹20L - ₹50L" style={{ background: "#020202" }}>₹20L - ₹50L</option>
                    <option value="₹50L - ₹1Cr+" style={{ background: "#020202" }}>₹50L - ₹1Cr+</option>
                  </select>
                </div>
              </div>

              {/* Growth Goal */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 16, top: 22, color: "#00F2FF", opacity: 0.5 }}><Target size={16} /></div>
                <textarea 
                  placeholder="Primary Growth Goal (e.g. Scale E-com ROAS to 4x, B2B Lead Gen)" required rows={4}
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px 24px 18px 48px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13, resize: "none" }} 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary" 
                style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 12, borderRadius: 0 }}
              >
                {isSubmitting ? "TRANSMITTING..." : "INITIATE NEURAL AUDIT"} <Send size={16} />
              </button>
              
              <p style={{ textAlign: "center", fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "rgba(255,255,255,0.2)", marginTop: 12 }}>
                *BY INITIATING, YOU AGREE TO OUR DATA PRIVACY PROTOCOLS.
              </p>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: "rgba(0, 242, 255, 0.05)", border: "1px solid rgba(0, 242, 255, 0.2)", padding: 40, textAlign: "center" }}
            >
              <CheckCircle size={48} color="#00F2FF" style={{ margin: "0 auto 20px" }} />
              <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, color: "#fff", marginBottom: 12 }}>Neural Link Established.</h3>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                Transmission received. Our engineers are analyzing your brand architecture. <br /> Check your Telegram for confirmation.
              </p>
            </motion.div>
          )}
        </FadeSection>
      </div>
    </section>
  );
};
