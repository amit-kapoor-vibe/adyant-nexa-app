"use client";

import { useNeuralTransition } from "@/context/TransitionContext";
import { CustomCursor } from "@/components/CustomCursor";
import dynamic from "next/dynamic";

import GlobalBackground from "@/components/GlobalBackground";
const ScannerModal = dynamic(() => import("@/components/ScannerModal").then(mod => mod.ScannerModal), { ssr: false });
const Preloader = dynamic(() => import("@/components/Preloader").then(mod => mod.Preloader), { ssr: false });

export function GlobalUI() {
  const { isScannerOpen, setScannerOpen, currency } = useNeuralTransition();
  
  return (
    <>
      <Preloader />
      <GlobalBackground />
      <CustomCursor />
      <ScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setScannerOpen(false)} 
        currency={currency} 
      />
    </>
  );
}
