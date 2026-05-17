"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Shield } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const AUTHORIZED_EMAIL = "mit.kapur@gmail.com";

      if (!session) {
        router.push("/login");
      } else if (session.user.email !== AUTHORIZED_EMAIL) {
        // Redirect unauthorized users to the client portal
        router.push("/portal");
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();

    // Listen for auth changes (like logging out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (isAuthorized === null) {
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
