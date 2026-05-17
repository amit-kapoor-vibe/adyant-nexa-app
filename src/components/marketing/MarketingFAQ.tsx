"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeSection } from "@/components/FadeSection";
import { Heading } from "@/components/ui/Heading";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    question: "How is Adyant Nexa different from a traditional marketing agency?",
    answer: "Most agencies focus on creative and management. We focus on Infrastructure. We build the server-side tracking, AI models, and ultra-fast frontends that make marketing actually work in 2026."
  },
  {
    question: "What is the 12-Month EMI Model?",
    answer: "We understand that high-end infrastructure is an investment. Our EMI model allows you to deploy elite tech today and pay for it over 12 months, easing your cash flow while you scale."
  },
  {
    question: "Do you guarantee results?",
    answer: "We guarantee the integrity of our infrastructure. Marketing involves variables like product and market fit, but our 'Skin in the Game' performance fee means we only profit when you grow."
  },
  {
    question: "How long does it take to see the first uplift?",
    answer: "Typically, the 'Neural Audit' identifies leaks in 48 hours. Once the infrastructure is live (usually 14-21 days), most brands see a noticeable data signal recovery and conversion bump within 30 days."
  }
];

export function MarketingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section style={{ padding: "clamp(5rem, 10vw, 8rem) clamp(1rem, 3vw, 1.75rem)", background: "#020202" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 16, display: "inline-block" }}>Intelligence Briefing_</span>
            <Heading level="h2" style={{ color: "#fff" }}>Frequently Audited Questions.</Heading>
          </div>
        </FadeSection>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FAQS.map((faq, i) => (
            <FadeSection key={i} delay={i * 0.05}>
              <div style={{ 
                border: "1px solid rgba(255,255,255,0.05)", 
                background: openIndex === i ? "rgba(255,255,255,0.02)" : "transparent",
                transition: "0.3s ease"
              }}>
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{ 
                    width: "100%", padding: "24px 32px", display: "flex", justifyContent: "space-between", 
                    alignItems: "center", background: "none", border: "none", color: "#fff", 
                    cursor: "pointer", textAlign: "left"
                  }}
                >
                  <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, color: openIndex === i ? "#00F2FF" : "#fff" }}>
                    {faq.question}
                  </span>
                  {openIndex === i ? <Minus size={20} color="#00F2FF" /> : <Plus size={20} color="rgba(255,255,255,0.3)" />}
                </button>
                
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "0 32px 32px 32px", fontFamily: "var(--font-inter)", fontSize: 15, lineHeight: 1.6, color: "rgba(229,229,229,0.5)" }}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeSection>
          ))}
        </div>

      </div>
    </section>
  );
}
