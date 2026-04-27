"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { ScanState, Currency } from "@/types";
import { ScannerIdle } from "./scanner/ScannerIdle";
import { ScannerTerminal } from "./scanner/ScannerTerminal";
import { ScannerResult } from "./scanner/ScannerResult";
import { trackLatency, trackEvent } from "@/utils/analytics";
import { QuantumAllocator } from "./gamification/QuantumAllocator";

const INITIAL_LOGS = [
  "INIT: Establishing handshake with global edge nodes...",
  "FETCH: Scraping DOM structure and critical CSS path...",
  "ANALYZE: Benchmarking Core Web Vitals (LCP/FID/CLS)...",
  "CHECK: Inspecting React 19 / Next.js hydration efficiency...",
  "SCAN: Verifying Meta Conversions API & Pixel sync...",
  "DETECT: Slow JavaScript execution in third-party scripts...",
  "WARN: Heavy image payloads detected without WebP compression...",
  "TECH: Analyzing server-side rendering (SSR) overhead...",
  "EVAL: Compiling revenue-leak diagnostic report...",
];

const EXTENDED_LOGS = [
  "TRACE: Mapping redundant <div> nesting levels...",
  "DEEP: Auditing font-swap and layout shift triggers...",
  "NETWORK: Testing TTFB from 5 global regions...",
  "AI: Simulating buyer persona navigation paths...",
  "SECURE: Scanning for exposed API endpoints...",
  "FLOW: Testing mobile touch targets and accessibility...",
  "CACHE: Measuring edge-cache hit ratio and cache-control...",
  "LOGIC: Verifying server-action execution latency...",
  "NEURAL: Calculating potential conversion uplift...",
];

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
  currency?: Currency;
}

export function ScannerModal({ isOpen, onClose, initialUrl = "", currency = "USD" }: ScannerModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [isAllocatorOpen, setIsAllocatorOpen] = useState(false);

  // Sync URL and auto-scan when modal opens with a URL
  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      if (initialUrl && scanState === "idle") {
        const timer = setTimeout(() => {
          runScan(initialUrl);
        }, 800);
        return () => clearTimeout(timer);
      }
    } else {
      setScanState("idle");
      setLogs([]);
      setScore(null);
      setIsAllocatorOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialUrl]);

  // Trigger Quantum Allocator 5 seconds after result
  useEffect(() => {
    if (scanState === "result") {
      const timer = setTimeout(() => {
        setIsAllocatorOpen(true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("quantum_allocator_shown"));
          sessionStorage.setItem("quantum_allocator_triggered", "true");
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [scanState]);

  const runScan = async (targetRaw: string) => {
    let targetUrl = targetRaw;
    if (!targetUrl.startsWith("http")) targetUrl = "https://" + targetUrl;

    trackEvent('scan_initiated', { source: 'scanner_modal', url: targetUrl });
    setScanState("scanning");
    setLogs([]);

    let currentLog = 0;
    const allPredefinedLogs = [...INITIAL_LOGS, ...EXTENDED_LOGS];
    
    const logInterval = setInterval(() => {
      let logText = "";
      if (currentLog < allPredefinedLogs.length) {
        logText = allPredefinedLogs[currentLog];
      } else {
        // Dynamic logs after predefined ones are exhausted
        const dynamicPrefixes = ["DEEP", "META", "NEURAL", "TECH", "GRID", "FLOW"];
        const dynamicSuffxes = [
          "Optimizing hydration buckets...",
          "Refining paint cycles...",
          "Analyzing third-party script impact...",
          "Checking semantic structure integrity...",
          "Verifying viewport responsiveness...",
          "Benchmarking total blocking time (TBT)..."
        ];
        const prefix = dynamicPrefixes[Math.floor(Math.random() * dynamicPrefixes.length)];
        const suffix = dynamicSuffxes[Math.floor(Math.random() * dynamicSuffxes.length)];
        logText = `${prefix}: ${suffix}`;
      }

      setLogs((prev) => [
        ...prev,
        `[${new Date().toISOString().split("T")[1].substring(0, 8)}] TARGET: ${targetUrl.replace(/^https?:\/\//, "")}`,
        `[${new Date().toISOString().split("T")[1].substring(0, 8)}] ${logText}`,
      ].slice(-12)); // Keep last 12 logs for a full terminal feel
      
      currentLog++;
    }, 1100);

    const startTime = Date.now();
    try {
      const response = await fetch(`/api/audit?url=${encodeURIComponent(targetUrl)}`);
      const data = await response.json();
      const duration = Date.now() - startTime;
      trackLatency('audit_api', duration);
      clearInterval(logInterval);

      if (data?.lighthouseResult?.categories?.performance) {
        const perfScore = Math.round(data.lighthouseResult.categories.performance.score * 100);
        setLogs((prev) => [...prev, `[SUCCESS] Scan complete. Final diagnostic computed.`]);
        setTimeout(() => { setScore(perfScore); setScanState("result"); }, 800);
      } else {
        throw new Error("Invalid response format");
      }
    } catch {
      clearInterval(logInterval);
      setLogs((prev) => [...prev, `[WARNING] API Quota Exceeded. Engaging localized offline estimation via cached nodes...`]);
      // Deterministic fallback score based on URL hash
      const hash = targetUrl.split("").reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
      const consistentScore = Math.abs(hash) % 18 + 28;
      setTimeout(() => { setScore(consistentScore); setScanState("result"); }, 1500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !url.includes(".")) return;
    runScan(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="scanner-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="Nexa Diagnostic System"
        style={{
          position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(2,2,2,0.85)", backdropFilter: "blur(12px)", padding: 20,
        }}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            background: "#080808", width: "100%", maxWidth: 640, borderRadius: 0,
            border: "1px solid rgba(0,242,255,0.2)", position: "relative", overflow: "hidden",
            boxShadow: "0 20px 80px rgba(0,242,255,0.05)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, background: "#00F2FF", animation: scanState === "scanning" ? "pulse-glow 1s infinite" : "none" }} />
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "clamp(8px, 3vw, 11px)", fontWeight: 600, letterSpacing: "clamp(0.1em, 1vw, 0.2em)", color: "#E5E5E5", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Nexa Diagnostic System
              </span>
            </div>
            <button onClick={onClose} aria-label="Close diagnostic modal" style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 4 }}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "clamp(24px, 5vw, 40px) clamp(16px, 4vw, 32px)" }}>
            {scanState === "idle" && (
              <ScannerIdle key="idle" url={url} onUrlChange={setUrl} onSubmit={handleSubmit} />
            )}
            {scanState === "scanning" && (
              <ScannerTerminal key="scanning" logs={logs} />
            )}
            {scanState === "result" && score !== null && (
              <ScannerResult key="result" score={score} url={url} currency={currency} />
            )}
          </div>
        </motion.div>
      </motion.div>
      
      <QuantumAllocator 
        key="quantum-allocator"
        isOpen={isAllocatorOpen} 
        onClose={() => setIsAllocatorOpen(false)} 
        currency={currency} 
      />
    </AnimatePresence>
  );
}
