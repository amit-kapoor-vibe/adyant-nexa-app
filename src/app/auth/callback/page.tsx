"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const processAuth = async () => {
      try {
        setStatus("Processing authorization...");
        
        // 1. Check for 'code' query parameter (PKCE flow redirect)
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");
        
        if (code) {
          console.log("[Callback] PKCE code detected, exchanging for session...");
          setStatus("Exchanging secure code for session...");
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error("[Callback] Code exchange failed:", error.message);
            setStatus(`Exchange failed: ${error.message}. Redirecting...`);
            setTimeout(() => { window.location.href = "/login"; }, 2000);
            return;
          }
          
          if (data?.session) {
            console.log("[Callback] PKCE Session established for:", data.session.user?.email);
            setStatus("Authorization successful! Redirecting to dashboard...");
            window.location.href = "/admin";
            return;
          }
        }

        // 2. Check for hash parameters (Implicit flow redirect fallback)
        const rawHash = window.location.hash;
        console.log("[Callback] Raw hash length:", rawHash.length);
        
        if (rawHash && rawHash !== "#") {
          const params = new URLSearchParams(rawHash.substring(1));
          const access_token = params.get("access_token");
          const refresh_token = params.get("refresh_token");

          if (access_token && refresh_token) {
            console.log("[Callback] Implicit tokens detected, setting session...");
            setStatus("Setting session from tokens...");
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (error) {
              console.error("[Callback] Set session failed:", error.message);
              setStatus(`Session setup failed: ${error.message}. Redirecting...`);
              setTimeout(() => { window.location.href = "/login"; }, 2000);
              return;
            }

            if (data?.session) {
              console.log("[Callback] Hash session established for:", data.session.user?.email);
              setStatus("Authorization successful! Redirecting to dashboard...");
              window.location.href = "/admin";
              return;
            }
          }
        }

        // 3. Fallback: Check if there's an existing active session
        console.log("[Callback] No hash or code, checking active session...");
        setStatus("Verifying existing session...");
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("[Callback] Active session found, going to /admin");
          setStatus("Active session found. Redirecting...");
          window.location.href = "/admin";
          return;
        }

        console.log("[Callback] No session or authentication data found");
        setStatus("Authentication required. Redirecting to login...");
        window.location.href = "/login";
      } catch (err: any) {
        console.error("[Callback] Exception in auth callback:", err.message);
        setStatus("Authentication error. Redirecting to login...");
        window.location.href = "/login";
      }
    };

    processAuth();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#020202",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 24,
      padding: 40
    }}>
      <div style={{
        width: 48, height: 48,
        border: "2px solid rgba(0,242,255,0.3)",
        borderTopColor: "#00F2FF",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      <p style={{
        fontFamily: "monospace",
        fontSize: 14,
        color: "#00F2FF",
        letterSpacing: "0.05em",
        textAlign: "center",
        maxWidth: 600,
        wordBreak: "break-all",
        lineHeight: 1.8
      }}>
        {status}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
