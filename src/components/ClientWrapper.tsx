"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ChatWidget } from "@/components/ChatWidget";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isLogin = pathname?.startsWith("/login");

  return (
    <>
      {!isAdmin && !isLogin && <Navbar />}
      {children}
      {!isAdmin && !isLogin && <ChatWidget />}
    </>
  );
}
