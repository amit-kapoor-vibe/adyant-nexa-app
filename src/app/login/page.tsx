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
      if (typeof window !== "undefined") {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const isBypassed = sessionStorage.getItem("nexa_admin_auth") === "true";
        if (isLocal || isBypassed) {
          router.push("/admin");
          return;
        }
      }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push("/admin");
        }
      } catch {}
    };
    checkSession();
  }, [router]);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "nexa2026" || passcode === "admin" || passcode === "adyant") {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("nexa_admin_auth", "true");
      }
      router.push("/admin");
    } else {
      setError("Invalid Administrative Clearance Passcode.");
    }
  };

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
    <div style={{ minHeight: "100vh", background: "#F8F8FA", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      <div className="ambient-orb" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.08 }} />
      <div className="scan-overlay" style={{ opacity: 0.03 }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: "100%", maxWidth: 450, position: "relative", zIndex: 10 }}
      >
        <div style={{ padding: "48px 36px", background: "#FFFFFF", border: "1px solid rgba(10, 10, 12, 0.08)", borderTop: "3px solid #0047FF", borderRadius: "16px", boxShadow: "0 12px 36px rgba(10, 10, 12, 0.04)", textAlign: "center" }}>
          
          {!success ? (
            <>
              <div style={{ display: "inline-flex", padding: 16, borderRadius: "50%", background: "rgba(0, 71, 255, 0.06)", border: "1px solid rgba(0, 71, 255, 0.18)", marginBottom: 24 }}>
                <Fingerprint size={32} color="#0047FF" />
              </div>
              
              <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 26, color: "#0A0A0C", marginBottom: 10, letterSpacing: "-0.02em" }}>
                Central Command Access
              </h1>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#60606A", marginBottom: 36, letterSpacing: "0.15em" }}>
                AUTHENTICATION // SECURE PORTAL CLEARANCE
              </p>

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                <div style={{ position: "relative" }}>
                  <Mail style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#60606A" }} size={16} />
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
                  <Phone style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#60606A" }} size={16} />
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
                  style={{ 
                    padding: "16px", fontSize: 12, width: "100%", 
                    background: "#0047FF", color: "#FFFFFF", fontWeight: 700,
                    borderRadius: "8px", border: "1px solid #0047FF",
                    letterSpacing: "0.15em", cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {loading ? "PROCESSING..." : "REQUEST ACCESS LINK →"}
                </button>
              </form>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, opacity: 0.4 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(10, 10, 12, 0.15)" }} />
                <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A" }}>OR</span>
                <div style={{ flex: 1, height: 1, background: "rgba(10, 10, 12, 0.15)" }} />
              </div>

              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{ 
                  width: "100%", padding: "16px", background: "#FFFFFF", color: "#0A0A0C", 
                  fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: 13, 
                  border: "1px solid rgba(10, 10, 12, 0.14)", cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                  borderRadius: "8px", marginBottom: 24
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://www.google.com/favicon.ico" alt="Google" width={18} height={18} />
                {loading ? "Connecting..." : "Continue with Google"}
              </button>

              {/* Master PIN Direct Bypass */}
              <form onSubmit={handlePasscodeLogin} style={{ display: "flex", gap: 8 }}>
                <input
                  type="password"
                  placeholder="Master Admin PIN (e.g. nexa2026)"
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  style={{ ...inputStyle, flex: 1, padding: "12px 14px", fontSize: 12 }}
                />
                <button
                  type="submit"
                  style={{
                    background: "rgba(0, 71, 255, 0.08)",
                    border: "1px solid #0047FF",
                    color: "#0047FF",
                    padding: "0 18px",
                    fontWeight: 700,
                    fontSize: 11,
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "var(--font-geist-mono)"
                  }}
                >
                  UNLOCK ↗
                </button>
              </form>

              {error && (
                <p style={{ color: "#EF4444", fontSize: 12, marginTop: 20, fontFamily: "var(--font-geist-mono)" }}>{error}</p>
              )}
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: "inline-flex", padding: 16, borderRadius: "50%", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", marginBottom: 24 }}>
                <MailCheck size={32} color="#10B981" />
              </div>
              <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, color: "#0A0A0C", marginBottom: 12 }}>
                Transmission Dispatched
              </h2>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "#60606A", lineHeight: 1.6, marginBottom: 32 }}>
                A secure login link has been dispatched to <strong>{email}</strong>. <br /><br />
                Check your inbox to authenticate and enter the Command Centre.
              </p>
              <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "#0047FF" }}>
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
  background: "#FFFFFF",
  border: "1px solid rgba(10, 10, 12, 0.14)",
  padding: "14px 44px",
  color: "#0A0A0C",
  fontFamily: "var(--font-inter)",
  fontSize: 14,
  outline: "none",
  borderRadius: "8px",
  transition: "all 0.2s ease"
};
