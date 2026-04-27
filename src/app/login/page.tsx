"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Shield, Fingerprint, MailCheck } from "lucide-react";
import { useNeuralTransition } from "@/context/TransitionContext";

const AUTHORIZED_EMAIL = "mit.kapur@gmail.com";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email.toLowerCase() !== AUTHORIZED_EMAIL) {
      setError("UNAUTHORIZED ENTITY DETECTED. Access restricted to core administrators only.");
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Authentication failed. Neural link disrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020202", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      <div className="ambient-orb" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.1 }} />
      <div className="scan-overlay" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 10 }}
      >
        <div className="glass-panel" style={{ padding: "40px", borderTop: "2px solid #00F2FF", textAlign: "center" }}>
          
          {!success ? (
            <>
              <div style={{ display: "inline-flex", padding: 16, borderRadius: "50%", background: "rgba(0,242,255,0.05)", border: "1px solid rgba(0,242,255,0.2)", marginBottom: 24 }}>
                <Fingerprint size={32} color="#00F2FF" />
              </div>
              
              <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, color: "#fff", marginBottom: 8 }}>
                Restricted Access
              </h1>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>
                Initiate biometric or neural authorization to enter Central Command.
              </p>

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input 
                  type="email"
                  placeholder="Enter administrator email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                    padding: "16px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13,
                    outline: "none", textAlign: "center"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#00F2FF"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#FF3333", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}>
                    {error}
                  </motion.div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: "100%", padding: "16px", fontSize: 12, cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Authenticating..." : "Request Magic Link"}
                </button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: "inline-flex", padding: 16, borderRadius: "50%", background: "rgba(0,255,102,0.05)", border: "1px solid rgba(0,255,102,0.2)", marginBottom: 24 }}>
                <MailCheck size={32} color="#00FF66" />
              </div>
              <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, color: "#fff", marginBottom: 12 }}>
                Transmission Sent
              </h2>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                A secure neural link has been dispatched to <strong>{email}</strong>. Click the link to bypass the firewall and enter the dashboard.
              </p>
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
