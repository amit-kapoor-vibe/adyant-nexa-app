"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, MessageCircle } from "lucide-react";
import { FadeSection } from "./FadeSection";

type FormData = { name: string; email: string; phone: string; business: string; budget: string; message: string };

const inputStyle: React.CSSProperties = {
  background: "#020202",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#E5E5E5",
  padding: "14px 16px",
  fontSize: 13,
  outline: "none",
  width: "100%",
  fontFamily: "var(--font-geist-mono)",
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
};

export const ContactSection = () => {
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", business: "", budget: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", business: "", budget: "", message: "" });
      } else {
        alert("System error. Please try WhatsApp direct.");
      }
    } catch (err) {
      console.error(err);
      alert("Connection failed. Use WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 3vw, 1.75rem)", background: "#020202" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>Get In Touch_</span>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#E5E5E5", lineHeight: 1.1 }}>
              Ready to Build Something<br /><span style={{ color: "#00F2FF" }}>That Actually Works?</span>
            </h2>
          </div>
        </FadeSection>

        <FadeSection delay={0.15}>
          <div className="glass-panel" style={{ padding: "clamp(28px, 5vw, 56px)" }}>
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ display: "inline-flex", padding: 20, background: "rgba(0,242,255,0.05)", border: "1px solid rgba(0,242,255,0.2)", color: "#00F2FF", marginBottom: 24 }}>
                  <CheckCircle size={40} />
                </div>
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, color: "#fff", marginBottom: 12 }}>Transmission Complete.</h3>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "rgba(229,229,229,0.4)", maxWidth: 300, margin: "0 auto 32px" }}>
                  Your data has been securely injected into our 2026 growth pipeline. Our growth team will reach out within 4-6 business hours.
                </p>
                <button onClick={() => setSubmitted(false)} className="editorial-tag" style={{ background: "none", border: "none", color: "#00F2FF", cursor: "pointer", opacity: 0.6 }}>
                  Submit another request_
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 20 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label className="editorial-tag" style={{ fontSize: 8, opacity: 0.32 }}>Your Name</label>
                    <input required type="text" placeholder="e.g. Mukesh" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = "#00F2FF")} onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label className="editorial-tag" style={{ fontSize: 8, opacity: 0.32 }}>Email Address</label>
                    <input required type="email" placeholder="name@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = "#00F2FF")} onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label className="editorial-tag" style={{ fontSize: 8, opacity: 0.32 }}>Phone / WhatsApp</label>
                    <input required type="tel" placeholder="+91 ..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = "#00F2FF")} onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label className="editorial-tag" style={{ fontSize: 8, opacity: 0.32 }}>Business Sector</label>
                    <select required value={form.business} onChange={e => setForm({ ...form, business: e.target.value })} style={{ ...inputStyle, appearance: "none" }} onFocus={e => (e.currentTarget.style.borderColor = "#00F2FF")} onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
                      <option value="">Select industry</option>
                      <option>D2C / E-Commerce</option><option>Real Estate</option>
                      <option>Education / EdTech</option><option>Luxury / Premium Retail</option>
                      <option>Other Services</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
                  <label className="editorial-tag" style={{ fontSize: 8, opacity: 0.32 }}>Monthly Ad Budget</label>
                  <select required value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} style={{ ...inputStyle, appearance: "none" }} onFocus={e => (e.currentTarget.style.borderColor = "#00F2FF")} onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
                    <option value="">Select scope</option>
                    <option>Under ₹20,000</option><option>₹20,000 – ₹50,000</option>
                    <option>₹50,000 – ₹1,00,000</option><option>₹1,00,000+</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
                  <label className="editorial-tag" style={{ fontSize: 8, opacity: 0.32 }}>Project Details</label>
                  <textarea rows={5} placeholder="Briefly describe the vision..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }} onFocus={e => (e.currentTarget.style.borderColor = "#00F2FF")} onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")} />
                </div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ flex: 1, justifyContent: "center", minWidth: 160, opacity: isSubmitting ? 0.6 : 1, cursor: "pointer" }}>
                    {isSubmitting ? "Initializing Connection..." : "Submit Request"} <ArrowRight size={15} />
                  </button>
                  <a href="https://wa.me/918700720477" target="_blank" rel="noreferrer" className="btn-secondary" style={{ flex: 1, justifyContent: "center", minWidth: 160, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", cursor: "pointer" }}>
                    <MessageCircle size={15} style={{ marginRight: 8, opacity: 0.6 }} /> WhatsApp Us
                  </a>
                </div>
              </form>
            )}
          </div>
        </FadeSection>
      </div>
    </section>
  );
};
