"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Zap, Shield, FileText, CreditCard, Clock, 
  ChevronRight, ArrowLeft, LogOut, CheckCircle2,
  Lock, Wallet, Calculator
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PRICING_TIERS } from "@/data/pricingData";
import { FadeSection } from "@/components/FadeSection";

export default function ClientPortal() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<"USD" | "INR">("INR");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <div style={{ minHeight: "100vh", background: "#020202", display: "flex", alignItems: "center", justifyContent: "center", color: "#00F2FF", fontFamily: "var(--font-geist-mono)" }}>INITIALIZING_PORTAL...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#020202", color: "#E5E5E5", fontFamily: "var(--font-inter)", overflowX: "hidden" }}>
      <div className="scan-overlay" style={{ opacity: 0.1 }} />
      
      {/* PORTAL HEADER */}
      <header style={{ 
        padding: "24px 28px", 
        borderBottom: "1px solid rgba(255,255,255,0.05)", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        background: "rgba(2,2,2,0.8)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/Favicon transparent.png" alt="Adyant Nexa" width={24} height={24} />
          <div style={{ height: 20, width: 1, background: "rgba(255,255,255,0.1)" }} />
          <span className="editorial-tag" style={{ color: "#00F2FF", fontSize: 10 }}>CLIENT_PORTAL_v1.0</span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {user?.email === "mit.kapur@gmail.com" && (
            <Link href="/admin" style={{ 
              background: "rgba(0,242,255,0.1)", 
              border: "1px solid #00F2FF", 
              color: "#00F2FF", 
              padding: "8px 16px", 
              borderRadius: "4px", 
              fontSize: 11, 
              fontFamily: "var(--font-geist-mono)",
              textDecoration: "none"
            }}>
              COMMAND_ACCESS
            </Link>
          )}
          <div className="desktop-only" style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{user?.email}</div>
            <div style={{ fontSize: 9, fontFamily: "var(--font-geist-mono)", color: "rgba(0,242,255,0.5)" }}>AUTHORIZED_ENTITY</div>
          </div>
          <button onClick={handleLogout} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontFamily: "var(--font-geist-mono)" }}>
            <LogOut size={14} /> EXIT
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 28px 100px" }}>
        
        <FadeSection>
          <div style={{ marginBottom: 60 }}>
            <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1, marginBottom: 16 }}>
              Welcome to the <span style={{ color: "#00F2FF" }}>Command Center.</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontFamily: "var(--font-geist-mono)" }}>
              SELECT A REVENUE MODEL TO INITIALIZE DEPLOYMENT.
            </p>
          </div>
        </FadeSection>

        {/* CURRENCY TOGGLE */}
        <div style={{ marginBottom: 40, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)", display: "flex" }}>
            <button onClick={() => setCurrency("USD")} style={{ padding: "8px 20px", border: "none", borderRadius: 6, background: currency === "USD" ? "#00F2FF" : "transparent", color: currency === "USD" ? "#000" : "#fff", fontSize: 10, fontWeight: 800, cursor: "pointer" }}>USD</button>
            <button onClick={() => setCurrency("INR")} style={{ padding: "8px 20px", border: "none", borderRadius: 6, background: currency === "INR" ? "#00F2FF" : "transparent", color: currency === "INR" ? "#000" : "#fff", fontSize: 10, fontWeight: 800, cursor: "pointer" }}>INR</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
          {PRICING_TIERS.map((tier) => (
            <FadeSection key={tier.id}>
              <div 
                onClick={() => setSelectedPlan(tier.id)}
                className="glass-panel" 
                style={{ 
                  padding: 40, 
                  cursor: "pointer", 
                  border: `1px solid ${selectedPlan === tier.id ? "#00F2FF" : "rgba(255,255,255,0.05)"}`,
                  background: selectedPlan === tier.id ? "rgba(0,242,255,0.02)" : "rgba(255,255,255,0.01)",
                  transition: "all 0.3s ease",
                  position: "relative"
                }}
              >
                {selectedPlan === tier.id && (
                  <div style={{ position: "absolute", top: 20, right: 20, color: "#00F2FF" }}>
                    <CheckCircle2 size={24} />
                  </div>
                )}
                <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 20, display: "block" }}>{tier.name}</span>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 48, fontWeight: 800, fontFamily: "var(--font-syne)", color: "#fff" }}>
                    {currency === "INR" ? tier.priceINR : tier.priceUSD}
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginLeft: 8 }}>/ MONTH</span>
                  </div>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "rgba(0,242,255,0.5)", marginTop: 4 }}>
                    12-MONTH EMI STRUCTURE ENABLED
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    <Clock size={16} color="#00F2FF" /> VALIDITY: {tier.validity}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    <Wallet size={16} color="#00F2FF" /> TOTAL SETUP: {currency === "INR" ? tier.fullPriceINR : tier.fullPriceUSD}
                  </div>
                </div>

                <div style={{ padding: "20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8 }}>
                   <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{tier.desc}</p>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>

        {/* SELECTED PLAN DETAILS: EMI & CONTRACT */}
        <AnimatePresence>
          {selectedPlan && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 60 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 40 }}>
                
                {/* EMI CALCULATOR / BREAKDOWN */}
                <div className="glass-panel" style={{ padding: 40, borderTop: "2px solid #00F2FF" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                    <Calculator size={20} color="#00F2FF" />
                    <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 20 }}>Payment Schedule_</h3>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {[1, 2, 3, 4, "... 12"].map((month, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                         <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Month {month}</span>
                         <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                            {currency === "INR" ? PRICING_TIERS.find(p => p.id === selectedPlan)?.priceINR : PRICING_TIERS.find(p => p.id === selectedPlan)?.priceUSD}
                         </span>
                      </div>
                    ))}
                    <div style={{ marginTop: 20, padding: 24, background: "rgba(0,255,102,0.05)", border: "1px solid rgba(0,255,102,0.2)", borderRadius: 8 }}>
                       <div style={{ fontSize: 10, color: "#00FF66", fontWeight: 800, marginBottom: 8 }}>RAZORPAY / STRIPE EMI OPTION:</div>
                       <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.5 }}>
                         You will be redirected to our secure payment gateway to complete the e-mandate for the monthly EMI.
                       </div>
                    </div>
                  </div>
                </div>

                {/* CONTRACT VIEWER */}
                <div className="glass-panel" style={{ padding: 40, borderTop: "2px solid #00F2FF" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                    <FileText size={20} color="#00F2FF" />
                    <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 20 }}>Service Agreement_</h3>
                  </div>
                  <div style={{ height: 300, overflowY: "auto", padding: 24, background: "#050505", border: "1px solid rgba(255,255,255,0.05)", fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.8, fontFamily: "var(--font-geist-mono)" }}>
                    <p style={{ color: "#00F2FF", marginBottom: 20 }}>NEURAL_SERVICE_AGREEMENT_v2026.04</p>
                    <p>1. SCOPE OF WORK: Adyant Nexa (The Provider) agrees to deploy the {selectedPlan?.toUpperCase()} infrastructure as defined in the selected tier specifications...</p>
                    <p style={{ marginTop: 12 }}>2. PAYMENT TERMS: The Client agrees to the 12-month EMI schedule. Failure to complete payment will result in neural grid disconnect...</p>
                    <p style={{ marginTop: 12 }}>3. PERFORMANCE GUARANTEE: Adyant Nexa guarantees a sub-0.5s load time and 99.9% uptime for all deployed neural assets...</p>
                    <p style={{ marginTop: 12 }}>4. DATA PRIVACY: All client data is protected under the 'Locks on Locks' encryption protocol as per internal security standards...</p>
                    <p style={{ marginTop: 12 }}>... [Full legal text placeholder] ...</p>
                  </div>
                  <button className="btn-primary" style={{ width: "100%", marginTop: 32, padding: 20, fontSize: 12, background: "#fff", color: "#000" }}>
                    ACCEPT & PROCEED TO PAYMENT
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <style jsx>{`
        .desktop-only { display: block; }
        @media (max-width: 768px) {
          .desktop-only { display: none; }
        }
      `}</style>
    </div>
  );
}
