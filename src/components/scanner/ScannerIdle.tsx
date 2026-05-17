"use client";

import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface ScannerIdleProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ScannerIdle({ url, onUrlChange, onSubmit }: ScannerIdleProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 28, color: "#fff", marginBottom: 12 }}>
        Identify Your Revenue Leaks.
      </h3>
      <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 32 }}>
        Enter your URL to initiate a deep-level performance scan. We will analyze your mobile load speeds, Core Web Vitals, and potential ad-spend bleed.
      </p>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 100%", minWidth: "250px", position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={16} color="rgba(0,242,255,0.4)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 1 }} />
          <div style={{ 
            position: "absolute", left: 44, color: "rgba(255,255,255,0.2)", 
            fontFamily: "var(--font-geist-mono)", fontSize: 13, pointerEvents: "none" 
          }}>
            https://
          </div>
          <input
            type="text"
            placeholder="yourwebsite.com"
            value={url}
            onChange={(e) => onUrlChange(e.target.value.replace(/^https?:\/\//, ""))}
            required
            aria-label="Website URL to audit"
            style={{
              width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              padding: "16px 16px 16px 105px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13,
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#00F2FF"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
        </div>
        <button
          type="submit"
          style={{
            background: "#00F2FF", color: "#000", border: "none", padding: "16px 24px",
            fontFamily: "var(--font-geist-mono)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em",
            textTransform: "uppercase", cursor: "pointer", flex: "1 1 100%"
          }}
        >
          Initiate Scan
        </button>
      </form>
    </motion.div>
  );
}
