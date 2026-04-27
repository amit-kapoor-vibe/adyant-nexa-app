"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

interface ScannerTerminalProps {
  logs: string[];
}

export function ScannerTerminal({ logs }: ScannerTerminalProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: 250 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Terminal color="#00F2FF" size={20} />
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "#00F2FF" }}>
          Running Diagnostic Protocol...
        </span>
      </div>
      <div
        role="log"
        aria-label="Diagnostic terminal output"
        style={{
          background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.05)",
          padding: 20, height: 200, overflowY: "hidden", position: "relative"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "flex-end", height: "100%" }}>
          {logs.map((log, i) => (
            <motion.div
              key={`${i}-${log.substring(0, 20)}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                fontFamily: "var(--font-geist-mono)", fontSize: 11,
                color: log.includes("ERROR") ? "#FF3333" : log.includes("WARNING") ? "#C4A35A" : "rgba(255,255,255,0.6)"
              }}
            >
              {log}
            </motion.div>
          ))}
          <div ref={logsEndRef} />
        </div>
        <div className="scan-overlay" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5 }} />
      </div>
    </motion.div>
  );
}
