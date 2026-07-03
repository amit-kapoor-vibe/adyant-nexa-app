"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Shield } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;
    let authListener: any;

    const handleSession = (session: any) => {
      if (!isMounted) return;
      // Verify admin email dynamically from allowed list
      const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "mit.kapur@gmail.com,mit.kapoor@gmail.com,amit.kapoor@gmail.com,amit.kapur@gmail.com,amit.kapoor.vibe@gmail.com";
      const adminEmails = adminEmailsEnv.split(",").map(e => e.trim().toLowerCase());
      
      const userEmail = session?.user?.email?.toLowerCase();
      if (userEmail && adminEmails.includes(userEmail)) {
        setIsLoading(false);
      } else if (session) {
        router.replace("/");
      } else {
        router.replace("/login");
      }
    };

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        handleSession(session);
        return;
      }

      // getSession returned null — likely a fresh redirect from /auth/callback.
      // Listen for the session to sync (fixes race condition).
      const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (newSession) {
          clearTimeout(timeoutId);
          handleSession(newSession);
        }
      });
      authListener = data.subscription;

      // Fallback: redirect to login if session never appears
      timeoutId = setTimeout(() => {
        if (isMounted) handleSession(null);
      }, 2000);
    };

    checkAuth();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (authListener) authListener.unsubscribe();
    };
  }, [router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#020202", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <Shield size={32} color="#00F2FF" className="pulse-glow" />
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
          Verifying Clearance...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
