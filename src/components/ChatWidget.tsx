"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Welcome to Adyant Nexa. I am your Retail Growth Advisor. Ask me anything about store profit leakages or start your Free Growth Assessment." 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedCount = localStorage.getItem("nexa_chat_count");
    if (savedCount) setMessageCount(parseInt(savedCount));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => { if (!isOpen) setShowHint(true); }, 8000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleSend = async (customMsg?: string) => {
    const userMsg = customMsg || input.trim();
    if (!userMsg || isLoading || messageCount >= 30) return;
    
    if (!customMsg) setInput("");
    setShowHint(false);
    
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    localStorage.setItem("nexa_chat_count", newCount.toString());

    setMessages(prev => [...prev, { role: "user", content: userMsg }]);

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: messages }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "I can help you evaluate your store metrics. You can also start the assessment directly at /assessment." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "You can calculate your store's estimated profit opportunity in 4 minutes at /assessment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            whileHover={{ scale: 1.01 }}
            style={{
              position: "fixed",
              bottom: "28px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 999999,
              width: "90%",
              maxWidth: "580px",
              cursor: "pointer",
            }}
            onClick={() => { setIsOpen(true); setShowHint(false); }}
          >
            <div 
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "rgba(6, 6, 6, 0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(0, 242, 255, 0.25)",
                padding: "8px 10px 8px 18px",
                borderRadius: "9999px",
                boxShadow: "0 12px 35px rgba(0,0,0,0.6), 0 0 25px rgba(0,242,255,0.08)",
                transition: "all 0.3s ease",
              }}
            >
              <Cpu size={16} color="#00F2FF" style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "rgba(255,255,255,0.6)", letterSpacing: "0.02em" }}>
                {showHint ? "Have questions about your growth assessment?" : "Ask Adyant Nexa Growth Advisor..."}
              </span>
              <div 
                className="btn-primary"
                style={{
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                ASK ADVISOR
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%", scale: 0.98 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 30, x: "-50%", scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              bottom: "28px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 999998,
              width: "90%",
              maxWidth: "600px",
              height: "70vh",
              maxHeight: "600px",
              background: "#080808",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(0, 242, 255, 0.2)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 25px 80px rgba(0,0,0,0.9), 0 0 40px rgba(0,242,255,0.06)",
              borderRadius: "20px",
            }}
          >
            {/* Header */}
            <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#020202" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "8px", border: "1px solid #00F2FF", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,242,255,0.08)" }}>
                  <Cpu size={16} color="#00F2FF" />
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 13, color: "#fff", margin: 0 }}>GROWTH_ADVISOR</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="pulse-dot" style={{ width: 6, height: 6, background: "#00F2FF", borderRadius: "50%" }} />
                    <span style={{ fontSize: 9, color: "#00F2FF", fontWeight: 700, fontFamily: "var(--font-geist-mono)", letterSpacing: "0.05em" }}>DIAGNOSTIC_READY</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: 6, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef} 
              data-lenis-prevent
              style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}
            >
              {messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "88%" }}>
                  <div style={{ 
                    padding: "12px 16px",
                    background: m.role === "user" ? "#00F2FF" : "rgba(255,255,255,0.03)",
                    color: m.role === "user" ? "#020202" : "#E5E5E5",
                    border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: m.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                    fontSize: 13, 
                    whiteSpace: "pre-line", 
                    fontFamily: m.role === "user" ? "var(--font-inter)" : "var(--font-geist-mono)",
                    lineHeight: 1.5,
                  }}>{m.content}</div>
                </div>
              ))}
              
              {messages.length === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  <button 
                    onClick={() => { setIsOpen(false); router.push("/assessment"); }}
                    style={{ background: "rgba(0,242,255,0.1)", border: "1px solid #00F2FF", color: "#00F2FF", padding: "10px 14px", borderRadius: "8px", fontSize: 11, cursor: "pointer", fontWeight: 700, fontFamily: "var(--font-geist-mono)", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <span>START_FREE_GROWTH_ASSESSMENT</span>
                    <ArrowRight size={14} />
                  </button>

                  <button 
                    onClick={() => handleSend("How is dead stock profit leakage calculated?")}
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", padding: "10px 14px", borderRadius: "8px", fontSize: 11, cursor: "pointer", fontWeight: 600, fontFamily: "var(--font-geist-mono)", textAlign: "left" }}
                  >
                    HOW_DEAD_STOCK_LEAKAGE_WORKS
                  </button>
                </div>
              )}

              {isLoading && (
                <div style={{ alignSelf: "flex-start", padding: "12px 16px", background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(0,242,255,0.3)", borderRadius: "10px" }}>
                  <span style={{ fontSize: 10, color: "#00F2FF", letterSpacing: "0.15em" }}>ANALYZING...</span>
                </div>
              )}
            </div>

            {/* Input Bar Section */}
            <div style={{ padding: "16px 20px 20px", borderTop: "1px solid rgba(255,255,255,0.04)", backgroundColor: "#020202" }}>
              <div style={{ display: "flex", gap: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", padding: "4px 4px 4px 14px", borderRadius: "9999px", alignItems: "center" }}>
                <input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyPress={(e) => e.key === "Enter" && handleSend()} 
                  placeholder="Ask about retail margins, dead stock, or repeat LTV..."
                  style={{ flex: 1, background: "none", border: "none", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 12, outline: "none" }} 
                />
                <button 
                  onClick={() => handleSend()} 
                  style={{ 
                    background: "#00F2FF", 
                    border: "none", 
                    color: "#020202", 
                    width: "36px", 
                    height: "36px", 
                    borderRadius: "50%", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                  }}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
