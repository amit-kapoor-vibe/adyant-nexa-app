"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, MessageCircle, AlertCircle } from "lucide-react";
import { FadeSection } from "./FadeSection";
import { trackEvent } from "@/utils/analytics";
import { Heading } from "./ui/Heading";

type FormData = { name: string; email: string; phone: string; business: string; budget: string; message: string };
type FormErrors = Partial<Record<keyof FormData, string>>;

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

const errorStyle: React.CSSProperties = {
  fontFamily: "var(--font-geist-mono)",
  fontSize: 10,
  color: "#FF4444",
  marginTop: 4,
  display: "flex",
  alignItems: "center",
  gap: 4,
};

// ─── Validation helpers ────────────────────────────────────────────────────────
function validateForm(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim() || form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.phone.trim() || !/^[+\d\s\-()]{7,15}$/.test(form.phone.trim())) {
    errors.phone = "Enter a valid phone number (7-15 digits).";
  }
  if (!form.business) {
    errors.business = "Please select your industry.";
  }
  if (!form.budget) {
    errors.budget = "Please select your budget range.";
  }
  return errors;
}

export const ContactSection = ({ currency = "INR" }: { currency?: "USD" | "INR" }) => {
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", business: "", budget: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        trackEvent('lead_submitted', { source: 'contact_section', ...form });
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", business: "", budget: "", message: "" });
      } else if (res.status === 429) {
        setErrors({ name: "Too many submissions. Please use WhatsApp for direct contact." });
      } else {
        setErrors({ name: "System error. Please try WhatsApp direct." });
      }
    } catch (err) {
      console.error(err);
      setErrors({ name: "Connection failed. Please use WhatsApp." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldStyle = (field: keyof FormData): React.CSSProperties => ({
    ...inputStyle,
    borderColor: errors[field] ? "#FF4444" : "rgba(255,255,255,0.08)",
  });


  return (
    <section id="contact" style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 3vw, 1.75rem)", background: "#020202" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="editorial-tag" style={{ display: "block", marginBottom: 20, opacity: 0.6, fontSize: 9 }}>Get In Touch_</span>
            <Heading level="h2" style={{ color: "#E5E5E5", lineHeight: 1.1 }}>
              Ready to Build Something<br /><span style={{ color: "#00F2FF" }}>That Actually Works?</span>
            </Heading>
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
              <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                {/* Global error (e.g., 429 rate limit) */}
                {errors.name && errors.name.includes("Too many") && (
                  <div style={{ ...errorStyle, marginBottom: 16, padding: "10px 14px", border: "1px solid rgba(255,68,68,0.3)", background: "rgba(255,68,68,0.05)" }}>
                    <AlertCircle size={12} /> {errors.name}
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 20 }}>
                  {/* Name */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label htmlFor="contact-name" className="editorial-tag" style={{ fontSize: 8, opacity: 0.32 }}>Your Name</label>
                    <input id="contact-name" type="text" placeholder="e.g. Adyant" value={form.name}
                      onChange={e => { setForm({ ...form, name: e.target.value }); setErrors(prev => ({ ...prev, name: undefined })); }}
                      style={fieldStyle("name")}
                      onFocus={e => !errors.name && (e.currentTarget.style.borderColor = "#00F2FF")}
                      onBlur={e => !errors.name && (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                      aria-invalid={!!errors.name} aria-describedby="error-name" />
                    {errors.name && !errors.name.includes("Too many") && <span id="error-name" role="alert" style={errorStyle}><AlertCircle size={10} />{errors.name}</span>}
                  </div>

                  {/* Email */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label htmlFor="contact-email" className="editorial-tag" style={{ fontSize: 8, opacity: 0.32 }}>Email Address</label>
                    <input id="contact-email" type="email" placeholder="name@company.com" value={form.email}
                      onChange={e => { setForm({ ...form, email: e.target.value }); setErrors(prev => ({ ...prev, email: undefined })); }}
                      style={fieldStyle("email")}
                      onFocus={e => !errors.email && (e.currentTarget.style.borderColor = "#00F2FF")}
                      onBlur={e => !errors.email && (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                      aria-invalid={!!errors.email} aria-describedby="error-email" />
                    {errors.email && <span id="error-email" role="alert" style={errorStyle}><AlertCircle size={10} />{errors.email}</span>}
                  </div>

                  {/* Phone */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label htmlFor="contact-phone" className="editorial-tag" style={{ fontSize: 8, opacity: 0.32 }}>Phone / WhatsApp</label>
                    <input id="contact-phone" type="tel" placeholder="+91 ..." value={form.phone}
                      onChange={e => { setForm({ ...form, phone: e.target.value }); setErrors(prev => ({ ...prev, phone: undefined })); }}
                      style={fieldStyle("phone")}
                      onFocus={e => !errors.phone && (e.currentTarget.style.borderColor = "#00F2FF")}
                      onBlur={e => !errors.phone && (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                      aria-invalid={!!errors.phone} aria-describedby="error-phone" />
                    {errors.phone && <span id="error-phone" role="alert" style={errorStyle}><AlertCircle size={10} />{errors.phone}</span>}
                  </div>

                  {/* Business Sector */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label htmlFor="contact-business" className="editorial-tag" style={{ fontSize: 8, opacity: 0.32 }}>Business Sector</label>
                    <select id="contact-business" value={form.business}
                      onChange={e => { setForm({ ...form, business: e.target.value }); setErrors(prev => ({ ...prev, business: undefined })); }}
                      style={{ ...fieldStyle("business"), appearance: "none" }}
                      onFocus={e => !errors.business && (e.currentTarget.style.borderColor = "#00F2FF")}
                      onBlur={e => !errors.business && (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                      aria-invalid={!!errors.business} aria-describedby="error-business">
                      <option value="">Select industry</option>
                      <option>D2C / E-Commerce</option><option>Real Estate</option>
                      <option>Education / EdTech</option><option>Luxury / Premium Retail</option>
                      <option>Other Services</option>
                    </select>
                    {errors.business && <span id="error-business" role="alert" style={errorStyle}><AlertCircle size={10} />{errors.business}</span>}
                  </div>
                </div>

                {/* Budget */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 32 }}>
                  <label htmlFor="contact-budget" className="editorial-tag" style={{ fontSize: 8, opacity: 0.32 }}>Monthly Ad Budget</label>
                  <select id="contact-budget" value={form.budget}
                    onChange={e => { setForm({ ...form, budget: e.target.value }); setErrors(prev => ({ ...prev, budget: undefined })); }}
                    style={{ ...fieldStyle("budget"), appearance: "none" }}
                    onFocus={e => !errors.budget && (e.currentTarget.style.borderColor = "#00F2FF")}
                    onBlur={e => !errors.budget && (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                    aria-invalid={!!errors.budget} aria-describedby="error-budget">
                    <option value="">Select monthly ad budget</option>
                    {currency === "INR" ? (
                      <>
                        <option>₹1,00,000 – ₹5,00,000</option>
                        <option>₹5,00,000 – ₹25,00,000</option>
                        <option>₹25,00,000 – ₹1,00,00,000</option>
                        <option>₹1,00,00,000+ (Enterprise Scale)</option>
                      </>
                    ) : (
                      <>
                        <option>$1,500 – $5,000</option>
                        <option>$5,000 – $25,000</option>
                        <option>$25,000 – $100,000</option>
                        <option>$100,000+ (Global Scale)</option>
                      </>
                    )}
                  </select>
                  {errors.budget && <span id="error-budget" role="alert" style={errorStyle}><AlertCircle size={10} />{errors.budget}</span>}
                </div>

                {/* Message */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 32 }}>
                  <label htmlFor="contact-message" className="editorial-tag" style={{ fontSize: 8, opacity: 0.32 }}>Project Details</label>
                  <textarea id="contact-message" rows={5} placeholder="Briefly describe the vision..." value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#00F2FF")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")} />
                </div>

                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ flex: 1, justifyContent: "center", minWidth: 160, opacity: isSubmitting ? 0.6 : 1, cursor: "pointer" }}>
                    {isSubmitting ? "Initializing Connection..." : "Submit Request"} <ArrowRight size={15} />
                  </button>
                  <a 
                    href="https://wa.me/918700720477" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-secondary" 
                    style={{ flex: 1, justifyContent: "center", minWidth: 160, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", cursor: "pointer" }}
                    onClick={() => trackEvent('whatsapp_clicked', { source: 'contact_section' })}
                  >
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
