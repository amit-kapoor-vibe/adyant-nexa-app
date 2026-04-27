"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ShieldCheck, Timer, ArrowRight, Lock, X } from "lucide-react";
import { Heading } from "@/components/ui/Heading";

interface QuantumAllocatorProps {
  isOpen: boolean;
  onClose: () => void;
  currency: "USD" | "INR";
}

export const QuantumAllocator = ({ isOpen, onClose, currency }: QuantumAllocatorProps) => {
  const [phase, setPhase] = useState<"scanning" | "unlocked">("scanning");
  const [slotsLeft, setSlotsLeft] = useState(6); // Simulated current slots
  const [discountAmount, setDiscountAmount] = useState("");
  const [percentage, setPercentage] = useState(0);

  // Form State
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhase("scanning");
      setIsReserved(false);
      setEmail("");
      setWhatsapp("");
      
      const timer = setTimeout(() => {
        // Business Logic for Slots:
        const currentPercentage = 50;
        const amount = currency === "INR" ? "₹62,000" : "$750"; // Based on Accelerator plan average
        
        setPercentage(currentPercentage);
        setDiscountAmount(amount);
        setPhase("unlocked");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currency]);

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !whatsapp) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Gamification Lead",
          email: email,
          phone: whatsapp,
          business: "Slot Reservation",
          message: `SLOT RESERVED:\nDiscount Unlocked: ${discountAmount} (${percentage}%)\nThey are waiting for the payment link via WhatsApp.`,
          budget: currency === "USD" ? "60" : "4999",
        }),
      });
      if (res.ok) {
        setIsReserved(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(2,2,2,0.95)", backdropFilter: "blur(20px)", padding: 20
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          style={{
            maxWidth: 500, width: "100%", background: "#080808", border: "1px solid rgba(0,242,255,0.3)",
            padding: "48px 32px", position: "relative", textAlign: "center", boxShadow: "0 0 100px rgba(0,242,255,0.1)"
          }}
        >
          {phase === "scanning" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
              <div style={{ position: "relative", width: 80, height: 80 }}>
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ position: "absolute", inset: 0, border: "2px solid transparent", borderTopColor: "#00F2FF", borderRadius: "50%" }} 
                />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={32} color="#00F2FF" />
                </div>
              </div>
              <div>
                <span className="editorial-tag" style={{ color: "#00F2FF", fontSize: 10, marginBottom: 12, display: "block" }}>Neural Override Active_</span>
                <Heading level="h2" style={{ fontSize: 28, marginBottom: 16 }}>Decrypting <span style={{ opacity: 0.3 }}>Incentives...</span></Heading>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                  Analyzing your site architecture to calculate the maximum allowed Neural Credit for your specific domain.
                </p>
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ 
                display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", 
                background: "rgba(0,242,255,0.1)", borderRadius: 100, marginBottom: 32 
              }}>
                <Timer size={14} color="#00F2FF" />
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, fontWeight: 700, color: "#00F2FF", letterSpacing: "0.2em" }}>
                  {slotsLeft} SLOTS REMAINING IN GENESIS BATCH
                </span>
              </div>

              <Heading level="h2" style={{ fontSize: 42, marginBottom: 12, color: "#00F2FF" }}>
                {discountAmount} <span style={{ color: "#fff", opacity: 0.4 }}>CREDIT.</span>
              </Heading>
              
              <p style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 14, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 32 }}>
                Tier Unlocked: {percentage}% Founders Discount
              </p>

              <div style={{ 
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", 
                padding: 24, marginBottom: 32, textAlign: "left" 
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <ShieldCheck size={16} color="#00F2FF" />
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#fff" }}>100% Fully Redeemable Protocol</span>
                </div>
                <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                  This credit is valid for 48 hours and can be fully redeemed against any Adyant Nexa growth infrastructure.
                </p>
              </div>

              {!isReserved ? (
                <form onSubmit={handleReserve} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <input 
                      type="email" 
                      placeholder="Business Email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", padding: "14px", color: "#fff", outline: "none", fontFamily: "var(--font-inter)", fontSize: 13 }}
                    />
                    <input 
                      type="tel" 
                      placeholder="WhatsApp No." 
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      required
                      style={{ flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", padding: "14px", color: "#fff", outline: "none", fontFamily: "var(--font-inter)", fontSize: 13 }}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary" 
                    style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, width: "100%", opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    {isSubmitting ? "SECURING SLOT..." : "LOCK MY SLOT NOW"} <Lock size={16} />
                  </button>
                  <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-geist-mono)", fontSize: 9, letterSpacing: "0.2em", cursor: "pointer", marginTop: 12 }}>
                    I&apos;LL PASS ON THIS REWARD
                  </button>
                </form>
              ) : (
                <div style={{ background: "rgba(0, 255, 102, 0.05)", border: "1px solid rgba(0, 255, 102, 0.2)", padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
                    <ShieldCheck color="#00FF66" size={24} />
                    <span style={{ color: "#00FF66", fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18 }}>SLOT SECURED!</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter)", fontSize: 13, lineHeight: 1.6 }}>
                    Your {discountAmount} Neural Credit has been locked. Our elite team will message you on WhatsApp shortly to complete your {currency === "USD" ? "$60" : "₹4,999"} Entry Protocol and begin your audit.
                  </p>
                  <button onClick={onClose} style={{ marginTop: 20, background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "12px 24px", cursor: "pointer", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}>
                    RETURN TO SITE
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Close button - Top Right */}
          <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

