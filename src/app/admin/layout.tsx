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

      const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
      const adminEmails = adminEmailsEnv.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
      
      const userEmail = session?.user?.email?.toLowerCase();
      if (!session) {
        router.replace("/login");
      } else if (adminEmails.length === 0 || (userEmail && adminEmails.includes(userEmail))) {
        setIsLoading(false);
      } else {
        router.replace("/");
      }
    };

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          handleSession(session);
          return;
        }
      } catch {
        // Fallback if Supabase is offline
      }

      const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (newSession) {
          clearTimeout(timeoutId);
          handleSession(newSession);
        }
      });
      authListener = data.subscription;

      timeoutId = setTimeout(() => {
        if (isMounted) handleSession(null);
      }, 1500);
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
      <div style={{ minHeight: "100vh", background: "#F8F8FA", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <Shield size={32} color="#0047FF" className="pulse-glow" />
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "#60606A", textTransform: "uppercase", letterSpacing: "0.2em" }}>
          Verifying Clearance...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
