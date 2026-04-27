"use client";

import { motion } from "framer-motion";
import { Send, Target, BarChart3, Globe } from "lucide-react";
import { FadeSection } from "../FadeSection";

export const MarketingContact = () => {
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

          <form style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              {/* Name */}
              <div style={{ position: "relative" }}>
                <input type="text" placeholder="Full Name (e.g. Amit Kapoor)" required 
                  style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px 24px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13 }} />
              </div>
              {/* Email */}
              <div style={{ position: "relative" }}>
                <input type="email" placeholder="Business Email (e.g. amit@brand.com)" required 
                  style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px 24px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13 }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              {/* Website */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#00F2FF", opacity: 0.5 }}><Globe size={16} /></div>
                <input type="url" placeholder="Website URL (e.g. adyantnexa.com)" required 
                  style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px 24px 18px 48px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13 }} />
              </div>
              {/* Ad Spend */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#00F2FF", opacity: 0.5 }}><BarChart3 size={16} /></div>
                <select required defaultValue=""
                  style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px 24px 18px 48px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13, appearance: "none" }}>
                  <option value="" disabled style={{ background: "#020202" }}>Monthly Ad Spend</option>
                  <option value="1-5" style={{ background: "#020202" }}>₹1L - ₹5L</option>
                  <option value="5-20" style={{ background: "#020202" }}>₹5L - ₹20L</option>
                  <option value="20-50" style={{ background: "#020202" }}>₹20L - ₹50L</option>
                  <option value="50+" style={{ background: "#020202" }}>₹50L - ₹1Cr+</option>
                </select>
              </div>
            </div>

            {/* Growth Goal */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 16, top: 22, color: "#00F2FF", opacity: 0.5 }}><Target size={16} /></div>
              <textarea placeholder="Primary Growth Goal (e.g. Scale E-com ROAS to 4x, B2B Lead Gen)" required rows={4}
                style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px 24px 18px 48px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13, resize: "none" }} />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 12, borderRadius: 0 }}>
              INITIATE NEURAL AUDIT <Send size={16} />
            </button>
            
            <p style={{ textAlign: "center", fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "rgba(255,255,255,0.2)", marginTop: 12 }}>
              *BY INITIATING, YOU AGREE TO OUR DATA PRIVACY PROTOCOLS.
            </p>
          </form>
        </FadeSection>
      </div>
    </section>
  );
};
