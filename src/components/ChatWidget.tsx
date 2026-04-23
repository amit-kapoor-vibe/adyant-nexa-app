"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Cpu, Zap, ArrowRight, Bot } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Neural Link established. I am the Nexa AI Concierge. How can I optimize your digital revenue today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: messages }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Connection interrupted. Please try WhatsApp direct for priority support." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Neural lag detected. Use the WhatsApp link for immediate consultation." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed", bottom: "32px", right: "32px", zIndex: 999999,
          background: "#00F2FF", color: "#000", width: "60px", height: "60px",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 30px rgba(0,242,255,0.4)", border: "none", cursor: "pointer"
        }}
      >
        {isOpen ? <X size={28} /> : <div style={{ position: "relative" }}>
          <Bot size={28} />
          <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, background: "#fff", borderRadius: "50%", border: "2px solid #00F2FF" }} />
        </div>}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: "fixed", bottom: "104px", right: "32px", zIndex: 999998,
              width: "380px", maxWidth: "calc(100vw - 64px)", height: "520px",
              background: "#080808", border: "1px solid rgba(0,242,255,0.2)",
              display: "flex", flexDirection: "column", overflow: "hidden",
              boxShadow: "0 20px 80px rgba(0,0,0,0.6)"
            }}
          >
            {/* Header */}
            <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,242,255,0.02)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, border: "1px solid #00F2FF", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,242,255,0.05)" }}>
                <Cpu size={16} color="#00F2FF" />
              </div>
              <div>
                <h4 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 13, color: "#fff", letterSpacing: "0.05em", margin: 0 }}>NEXA AI CONCIERGE</h4>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 5, height: 5, background: "#00FF66", borderRadius: "50%" }} />
                  <span style={{ fontSize: 9, color: "rgba(0,255,102,0.6)", fontWeight: 600, fontFamily: "var(--font-geist-mono)" }}>NEURAL LINK ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ 
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%"
                }}>
                  <div style={{ 
                    padding: "12px 16px",
                    background: m.role === "user" ? "#00F2FF" : "rgba(255,255,255,0.03)",
                    color: m.role === "user" ? "#000" : "#E5E5E5",
                    border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.06)",
                    fontSize: 13,
                    fontFamily: m.role === "user" ? "var(--font-inter)" : "var(--font-geist-mono)",
                    lineHeight: 1.5
                  }}>
                    {m.content}
                  </div>
                  <span style={{ fontSize: 8, opacity: 0.2, marginTop: 4, display: "block", textAlign: m.role === "user" ? "right" : "left" }}>
                    {m.role === "user" ? "CLIENT_INPUT" : "NEXA_OS_RESPONSE"}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div style={{ alignSelf: "flex-start", padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(0,242,255,0.2)" }}>
                  <span style={{ fontSize: 10, color: "#00F2FF", letterSpacing: "0.1em", animation: "pulse 1.5s infinite" }}>PROCESSING...</span>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", gap: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", padding: "4px" }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about your revenue engine..."
                  style={{
                    flex: 1, background: "none", border: "none", color: "#fff",
                    padding: "12px 16px", fontFamily: "var(--font-geist-mono)", fontSize: 13, outline: "none"
                  }}
                />
                <button
                  onClick={handleSend}
                  style={{
                    background: "#00F2FF", border: "none", color: "#000",
                    width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
