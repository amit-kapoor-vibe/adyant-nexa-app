"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // The Supabase JS client automatically detects #access_token in the URL hash
    // and processes it when imported. We just need to confirm the session is ready.

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Session established from hash tokens — go to admin
        router.replace("/admin");
      }
    });

    // Also check if session was already processed (race condition safety)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/admin");
      }
    });

    // Fallback: if nothing happens in 5 seconds, send back to login
    const fallback = setTimeout(() => {
      router.replace("/login");
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallback);
    };
  }, [router]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#020202",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 24
    }}>
      <div style={{
        width: 48, height: 48,
        border: "2px solid rgba(0,242,255,0.3)",
        borderTopColor: "#00F2FF",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      <p style={{
        fontFamily: "var(--font-geist-mono)",
        fontSize: 11,
        color: "rgba(255,255,255,0.5)",
        letterSpacing: "0.3em",
        textTransform: "uppercase"
      }}>
        Establishing Neural Link...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
