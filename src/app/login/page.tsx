"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Fingerprint, MailCheck, Phone, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/admin");
      }
    };
    checkSession();
  }, [router]);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // AUTHENTICATION: Send Magic Link
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Authentication failed. Neural link disrupted.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google authentication failed.");
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
        style={{ width: "100%", maxWidth: 450, position: "relative", zIndex: 10 }}
      >
        <div className="glass-panel" style={{ padding: "48px", borderTop: "2px solid #00F2FF", textAlign: "center" }}>
          
          {!success ? (
            <>
              <div style={{ display: "inline-flex", padding: 16, borderRadius: "50%", background: "rgba(0,242,255,0.05)", border: "1px solid rgba(0,242,255,0.2)", marginBottom: 24 }}>
                <Fingerprint size={32} color="#00F2FF" />
              </div>
              
              <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 28, color: "#fff", marginBottom: 12 }}>
                Neural Authorization
              </h1>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 40, letterSpacing: "0.1em" }}>
                ESTABLISHING SECURE HANDSHAKE FOR PRICING ACCESS.
              </p>

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                <div style={{ position: "relative" }}>
                  <Mail style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", opacity: 0.3 }} size={16} />
                  <input 
                    required 
                    type="email" 
                    placeholder="Business Email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ position: "relative" }}>
                  <Phone style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", opacity: 0.3 }} size={16} />
                  <input 
                    required 
                    type="tel" 
                    placeholder="Phone Number (WhatsApp Preferred)" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary"
                  style={{ 
                    padding: "18px", fontSize: 12, width: "100%", 
                    background: "#00F2FF", color: "#000", fontWeight: 800,
                    letterSpacing: "0.2em"
                  }}
                >
                  {loading ? "PROCESSING..." : "REQUEST NEURAL ACCESS"}
                </button>
              </form>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, opacity: 0.2 }}>
                <div style={{ flex: 1, height: 1, background: "#fff" }} />
                <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}>OR</span>
                <div style={{ flex: 1, height: 1, background: "#fff" }} />
              </div>

              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{ 
                  width: "100%", padding: "18px", background: "rgba(255,255,255,0.03)", color: "#fff", 
                  fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: 13, 
                  border: "1px solid rgba(255,255,255,0.1)", cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                  borderRadius: "4px"
                }}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" width={18} height={18} />
                {loading ? "Establishing Neural Link..." : "Continue with Google"}
              </button>

              {error && (
                <p style={{ color: "#ff3333", fontSize: 12, marginTop: 24, fontFamily: "var(--font-geist-mono)" }}>{error}</p>
              )}
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: "inline-flex", padding: 16, borderRadius: "50%", background: "rgba(0,255,102,0.05)", border: "1px solid rgba(0,255,102,0.2)", marginBottom: 24 }}>
                <MailCheck size={32} color="#00FF66" />
              </div>
              <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, color: "#fff", marginBottom: 12 }}>
                Transmission Sent
              </h2>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 32 }}>
                A secure neural link has been dispatched to <strong>{email}</strong>. <br /><br />
                Check your inbox to bypass the gate and access proprietary pricing.
              </p>
              <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(0,242,255,0.4)" }}>
                PROTOCOL_STATUS: WAITING_FOR_USER_VERIFICATION
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "16px 48px",
  color: "#fff",
  fontFamily: "var(--font-inter)",
  fontSize: 14,
  outline: "none",
  borderRadius: "4px",
  transition: "all 0.3s ease"
};
