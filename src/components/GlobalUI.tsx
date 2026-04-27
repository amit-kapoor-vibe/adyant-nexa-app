"use client";

import { useNeuralTransition } from "@/context/TransitionContext";
import { CustomCursor } from "@/components/CustomCursor";
import { ScannerModal } from "@/components/ScannerModal";

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
