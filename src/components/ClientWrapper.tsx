"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { ssr: false });

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isLogin = pathname?.startsWith("/login");
  const isHome = pathname === "/";

  return (
    <>
      {!isAdmin && !isLogin && !isHome && <Navbar />}
      {children}
      {!isAdmin && !isLogin && <ChatWidget />}
    </>
  );
}
