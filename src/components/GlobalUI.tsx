"use client";

import { useNeuralTransition } from "@/context/TransitionContext";
import { CustomCursor } from "@/components/CustomCursor";
import dynamic from "next/dynamic";

const ScannerModal = dynamic(() => import("@/components/ScannerModal").then(mod => mod.ScannerModal), { ssr: false });

export function GlobalUI() {
  const { isScannerOpen, setScannerOpen, currency } = useNeuralTransition();
  
  return (
    <>
      <CustomCursor />
      <ScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setScannerOpen(false)} 
        currency={currency} 
      />
    </>
  );
}
