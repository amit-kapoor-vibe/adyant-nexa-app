"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Cpu, Zap, ArrowRight, Bot } from "lucide-react";
import { useNeuralTransition } from "@/context/TransitionContext";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatWidget() {
  const { setScannerOpen } = useNeuralTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Neural Link established. I am NEXA. How can I optimize your digital revenue today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [auditMode, setAuditMode] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load message count from persistent storage
  useEffect(() => {
    const savedCount = localStorage.getItem("nexa_chat_count");
    if (savedCount) setMessageCount(parseInt(savedCount));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => { if (!isOpen) setShowHint(true); }, 10000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const runAudit = async (url: string) => {
    setIsLoading(true);
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    localStorage.setItem("nexa_chat_count", newCount.toString());

    setMessages(prev => [...prev, { role: "assistant", content: `INITIATING SCAN: [${url}] Establishing handshake...` }]);
    
    try {
      let targetUrl = url;
      if (!targetUrl.startsWith("http")) targetUrl = "https://" + targetUrl;
      
      const res = await fetch(`/api/audit?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();
      
      if (data?.lighthouseResult?.categories?.performance) {
        const score = Math.round(data.lighthouseResult.categories.performance.score * 100);
        const report = `DIAGNOSTIC COMPLETE. SCORE: ${score}/100.
        Shall I send a full 10-page technical audit to your email?`;
        setMessages(prev => [...prev, { role: "assistant", content: report }]);
      } else {
        throw new Error();
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Audit failed. Connect on WhatsApp for manual sync." }]);
    } finally {
      setIsLoading(false);
      setAuditMode(false);
    }
  };

  const handleSend = async (customMsg?: string) => {
    const userMsg = customMsg || input.trim();
    if (!userMsg || isLoading || messageCount >= 30) return;
    
    if (!customMsg) setInput("");
    setShowHint(false);
    
    // Increment and save count
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    localStorage.setItem("nexa_chat_count", newCount.toString());

    setMessages(prev => [...prev, { role: "user", content: userMsg }]);

    // Detect URL for auto-audit
    const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/gi;
    if (auditMode || urlPattern.test(userMsg)) {
      const match = userMsg.match(urlPattern);
      if (match) {
        runAudit(match[0]);
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: messages }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "Connection lag. Reach out on WhatsApp." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Neural lag. Use WhatsApp for priority sync." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showHint && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", bottom: "105px", right: "32px", zIndex: 999999,
              background: "#080808", border: "1px solid #00F2FF", padding: "12px 20px",
              borderRadius: "14px", boxShadow: "0 10px 40px rgba(0,242,255,0.2)",
              color: "#fff", display: "flex", alignItems: "center", gap: 10, cursor: "pointer"
            }}
            onClick={() => { setScannerOpen(true); setShowHint(false); }}
          >
            <Zap size={14} color="#00F2FF" fill="#00F2FF" />
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em" }}>WANT A NEURAL AUDIT?</span>
            <div style={{ position: "absolute", bottom: -6, right: 25, width: 12, height: 12, background: "#080808", borderRight: "1px solid #00F2FF", borderBottom: "1px solid #00F2FF", transform: "rotate(45deg)" }} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setIsOpen(!isOpen); setShowHint(false); }}
        style={{
          position: "fixed", bottom: "32px", right: "32px", zIndex: 999999,
          background: "#020202", color: "#00F2FF", width: "64px", height: "64px",
          borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px rgba(0,242,255,0.15)", border: "1px solid rgba(0,242,255,0.3)", cursor: "pointer",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(0,242,255,0.1) 0%, transparent 70%)" }} />
        {isOpen ? <X size={28} /> : (
          <div style={{ position: "relative", zIndex: 2 }}>
            <Cpu size={28} strokeWidth={1.5} />
            <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ position: "absolute", inset: -8, border: "1px solid #00F2FF", borderRadius: "50%", opacity: 0.2 }} />
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            style={{
              position: "fixed", bottom: "112px", right: "32px", zIndex: 999998,
              width: "380px", maxWidth: "calc(100vw - 64px)", height: "65vh", maxHeight: "600px",
              background: "#050505", border: "1px solid rgba(0,242,255,0.15)",
              display: "flex", flexDirection: "column", overflow: "hidden",
              boxShadow: "0 30px 100px rgba(0,0,0,0.8)", borderRadius: "16px"
            }}
          >
            <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.03)", background: "rgba(0,242,255,0.01)", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "12px", border: "1px solid #00F2FF", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,242,255,0.05)" }}>
                <Cpu size={20} color="#00F2FF" />
              </div>
              <div>
                <h4 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 14, color: "#fff", margin: 0 }}>NEXA_OS</h4>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, background: "#00FF66", borderRadius: "50%", animation: "pulse 2s infinite" }} />
                  <span style={{ fontSize: 9, color: "rgba(0,255,102,0.7)", fontWeight: 700, fontFamily: "var(--font-geist-mono)" }}>COGNITIVE_READY</span>
                </div>
              </div>
            </div>

            <div 
              ref={scrollRef} 
              data-lenis-prevent
              style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}
            >
              {messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                  <div style={{ 
                    padding: "14px 18px",
                    background: m.role === "user" ? "#00F2FF" : "rgba(255,255,255,0.02)",
                    color: m.role === "user" ? "#000" : "#E5E5E5",
                    border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.05)",
                    borderRadius: m.role === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                    fontSize: 13, whiteSpace: "pre-line", fontFamily: m.role === "user" ? "var(--font-inter)" : "var(--font-geist-mono)"
                  }}>{m.content}</div>
                </div>
              ))}
              
              {messages.length === 1 && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => { setAuditMode(true); handleSend("I want a Neural Audit of my website."); }}
                    style={{ background: "rgba(0,242,255,0.1)", border: "1px solid #00F2FF", color: "#00F2FF", padding: "8px 14px", borderRadius: "8px", fontSize: 10, cursor: "pointer", fontWeight: 700, fontFamily: "var(--font-geist-mono)" }}>
                    ANALYZE_MY_WEBSITE
                  </button>
                </div>
              )}

              {isLoading && (
                <div style={{ alignSelf: "flex-start", padding: "14px 18px", background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(0,242,255,0.2)", borderRadius: "12px" }}>
                  <span style={{ fontSize: 10, color: "#00F2FF", letterSpacing: "0.15em", animation: "pulse 1.5s infinite" }}>SYNCING_NODES...</span>
                </div>
              )}
            </div>

            <div style={{ padding: "24px", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
              {messageCount >= 30 ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 16, letterSpacing: "0.1em" }}>
                    DAILY_NEURAL_QUOTA_EXCEEDED
                  </p>
                  <a href="https://wa.me/YOUR_NUMBER" target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                      background: "#00FF66", color: "#000", padding: "16px", borderRadius: "12px",
                      textDecoration: "none", fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 13,
                      boxShadow: "0 10px 30px rgba(0,255,102,0.15)"
                    }}>
                    CONNECT_ON_WHATSAPP_PRIORITY
                  </a>
                </motion.div>
              ) : (
                <div style={{ display: "flex", gap: 12, background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.08)", padding: "6px", borderRadius: "12px" }}>
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSend()} placeholder={auditMode ? "Enter website URL..." : "Initiate Protocol..."}
                    style={{ flex: 1, background: "none", border: "none", color: "#fff", padding: "12px 16px", fontFamily: "var(--font-geist-mono)", fontSize: 13, outline: "none" }} />
                  <button onClick={() => handleSend()} style={{ background: "#00F2FF", border: "none", color: "#000", width: "48px", height: "48px", borderRadius: "10px", cursor: "pointer" }}>
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
