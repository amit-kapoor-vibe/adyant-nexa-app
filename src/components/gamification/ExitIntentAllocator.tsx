"use client";

import { useState, useEffect } from "react";
import { QuantumAllocator } from "./QuantumAllocator";

export function ExitIntentAllocator() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Check if it already triggered in this session
    if (typeof window !== "undefined") {
      const alreadyTriggered = sessionStorage.getItem("quantum_allocator_triggered");
      if (alreadyTriggered) {
        setHasTriggered(true);
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      // If the mouse leaves the viewport at the top (usually towards tabs/url bar)
      if (e.clientY <= 0 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
        sessionStorage.setItem("quantum_allocator_triggered", "true");
      }
    };

    // Mobile Exit Intent Strategy: Rapid Scroll Up
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let scrolledUpAmount = 0;

    const handleScroll = () => {
      if (hasTriggered || typeof window === "undefined") return;
      const currentScrollY = window.scrollY;
      
      // If scrolling UP
      if (currentScrollY < lastScrollY) {
        scrolledUpAmount += (lastScrollY - currentScrollY);
        // If they scroll up continuously for >150px AND they are somewhat down the page
        // AND they are on a mobile device
        if (scrolledUpAmount > 150 && currentScrollY > 300 && window.innerWidth <= 768) {
          setIsOpen(true);
          setHasTriggered(true);
          sessionStorage.setItem("quantum_allocator_triggered", "true");
        }
      } else {
        // Scrolling down resets the upward scroll counter
        scrolledUpAmount = 0;
      }
      lastScrollY = currentScrollY;
    };

    if (!hasTriggered) {
      document.addEventListener("mouseout", handleMouseOut);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasTriggered]);

  // If triggered by ScannerModal, we shouldn't trigger it again via exit intent.
  // We can listen to a custom event from ScannerModal to mark as triggered.
  useEffect(() => {
    const handleScannerTrigger = () => {
      setHasTriggered(true);
      sessionStorage.setItem("quantum_allocator_triggered", "true");
    };
    
    window.addEventListener("quantum_allocator_shown", handleScannerTrigger);
    return () => window.removeEventListener("quantum_allocator_shown", handleScannerTrigger);
  }, []);

  return (
    <QuantumAllocator 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)} 
      currency="INR" 
    />
  );
}
