"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/ChatWidget").then(mod => mod.ChatWidget), { ssr: false });

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
