"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

// Formatter to render clean text, bold styling, and bullet points without raw asterisks
function FormattedMessage({ text, isUser }: { text: string; isUser: boolean }) {
  if (isUser) {
    return <span>{text}</span>;
  }

  // Clean out redundant consecutive asterisks (e.g. ****)
  const cleanedText = text.replace(/\*{3,}/g, "").trim();
  const lines = cleanedText.split("\n");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lineIdx} style={{ height: "4px" }} />;

        // Check if line is a bullet point (*, -, •)
        const isBullet = /^[*•-]\s+/.test(trimmed);
        const isNumbered = /^\d+\.\s+/.test(trimmed);

        let content = trimmed;
        if (isBullet) {
          content = trimmed.replace(/^[*•-]\s+/, "");
        }

        // Parse **bold** tags into styled elements
        const parts = content.split(/(\*\*.*?\*\*)/g);

        const renderedContent = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
            const inner = part.slice(2, -2);
            return (
              <strong key={pIdx} style={{ color: "#FFFFFF", fontWeight: 700 }}>
                {inner}
              </strong>
            );
          }
          // Remove any stray isolated single asterisks
          return part.replace(/^\*|\*$/g, "");
        });

        if (isBullet) {
          return (
            <div key={lineIdx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", paddingLeft: "4px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#00F2FF", marginTop: "7px", flexShrink: 0 }} />
              <span style={{ flex: 1, color: "rgba(229,229,229,0.9)", lineHeight: 1.55 }}>
                {renderedContent}
              </span>
            </div>
          );
        }

        if (isNumbered) {
          return (
            <div key={lineIdx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", paddingLeft: "4px" }}>
              <span style={{ flex: 1, color: "rgba(229,229,229,0.9)", lineHeight: 1.55 }}>
                {renderedContent}
              </span>
            </div>
          );
        }

        return (
          <p key={lineIdx} style={{ margin: 0, color: "rgba(229,229,229,0.9)", lineHeight: 1.55 }}>
            {renderedContent}
          </p>
        );
      })}
    </div>
  );
}

export function ChatWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Welcome to Adyant Nexa. I am your Retail Growth Advisor. Ask me anything about store profit leakages, unit margins, or start your Free Growth Diagnostic." 
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
      {/* Floating Trigger Bar */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            whileHover={{ scale: 1.01 }}
            style={{
              position: "fixed",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 999990,
              width: "calc(100% - 32px)",
              maxWidth: "580px",
              cursor: "pointer",
              touchAction: "manipulation",
            }}
            onClick={() => { setIsOpen(true); setShowHint(false); }}
          >
            <div 
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(6, 6, 6, 0.9)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(0, 242, 255, 0.3)",
                padding: "8px 10px 8px 16px",
                borderRadius: "9999px",
                boxShadow: "0 12px 35px rgba(0,0,0,0.7), 0 0 25px rgba(0,242,255,0.1)",
                transition: "all 0.3s ease",
              }}
            >
              <Cpu size={16} color="#00F2FF" style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, fontFamily: "var(--font-inter)", fontSize: 13, color: "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {showHint ? "Have questions about your growth diagnostic?" : "Ask Growth Advisor..."}
              </span>
              <div 
                className="btn-primary"
                style={{
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  flexShrink: 0,
                }}
              >
                ASK ADVISOR
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window & Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for click away on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                zIndex: 999995,
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="chat-modal-container"
              style={{
                position: "fixed",
                zIndex: 999998,
                background: "#080808",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(0, 242, 255, 0.25)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 25px 80px rgba(0,0,0,0.95), 0 0 40px rgba(0,242,255,0.08)",
              }}
            >
              {/* Header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#020202", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "10px", border: "1px solid rgba(0,242,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,242,255,0.08)" }}>
                    <Cpu size={18} color="#00F2FF" />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14, color: "#FFFFFF", margin: 0 }}>Growth Advisor</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "2px" }}>
                      <div className="pulse-dot" style={{ width: 6, height: 6, background: "#00F2FF", borderRadius: "50%" }} />
                      <span style={{ fontSize: 10, color: "#00F2FF", fontWeight: 600, fontFamily: "var(--font-geist-mono)", letterSpacing: "0.08em" }}>ONLINE DIAGNOSTIC</span>
                    </div>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "rgba(255,255,255,0.8)", cursor: "pointer", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", touchAction: "manipulation" }}
                  aria-label="Close Chat"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Messages Body */}
              <div 
                ref={scrollRef} 
                data-lenis-prevent
                style={{ flex: 1, padding: "16px 18px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, WebkitOverflowScrolling: "touch" }}
              >
                {messages.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "90%" }}>
                    <div style={{ 
                      padding: "12px 16px",
                      background: m.role === "user" ? "#00F2FF" : "rgba(255,255,255,0.03)",
                      color: m.role === "user" ? "#020202" : "#E5E5E5",
                      border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: m.role === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                      fontSize: 13.5, 
                      fontFamily: "var(--font-inter)",
                      lineHeight: 1.55,
                      fontWeight: m.role === "user" ? 600 : 400,
                    }}>
                      <FormattedMessage text={m.content} isUser={m.role === "user"} />
                    </div>
                  </div>
                ))}
                
                {messages.length === 1 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
                    <button 
                      type="button"
                      onClick={() => { setIsOpen(false); router.push("/assessment"); }}
                      style={{ background: "rgba(0,242,255,0.1)", border: "1px solid #00F2FF", color: "#00F2FF", padding: "12px 14px", borderRadius: "10px", fontSize: 12, cursor: "pointer", fontWeight: 700, fontFamily: "var(--font-inter)", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", touchAction: "manipulation" }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Sparkles size={14} /> Start Free Growth Diagnostic
                      </span>
                      <ArrowRight size={14} />
                    </button>

                    <button 
                      type="button"
                      onClick={() => handleSend("How is dead stock profit leakage calculated?")}
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(229,229,229,0.85)", padding: "12px 14px", borderRadius: "10px", fontSize: 12, cursor: "pointer", fontWeight: 500, fontFamily: "var(--font-inter)", textAlign: "left", touchAction: "manipulation" }}
                    >
                      How dead stock leakage is calculated
                    </button>

                    <button 
                      type="button"
                      onClick={() => handleSend("How to protect retail margins from heavy discounting?")}
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(229,229,229,0.85)", padding: "12px 14px", borderRadius: "10px", fontSize: 12, cursor: "pointer", fontWeight: 500, fontFamily: "var(--font-inter)", textAlign: "left", touchAction: "manipulation" }}
                    >
                      How to protect margins from discount erosion
                    </button>

                    <button 
                      type="button"
                      onClick={() => handleSend("How to increase customer repeat purchase rate to 35%?")}
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(229,229,229,0.85)", padding: "12px 14px", borderRadius: "10px", fontSize: 12, cursor: "pointer", fontWeight: 500, fontFamily: "var(--font-inter)", textAlign: "left", touchAction: "manipulation" }}
                    >
                      How to lift customer repeat rate &amp; LTV
                    </button>
                  </div>
                )}

                {isLoading && (
                  <div style={{ alignSelf: "flex-start", padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(0,242,255,0.3)", borderRadius: "10px" }}>
                    <span style={{ fontSize: 11, color: "#00F2FF", letterSpacing: "0.1em", fontFamily: "var(--font-geist-mono)" }}>ANALYZING METRICS...</span>
                  </div>
                )}
              </div>

              {/* Input Bar Section */}
              <div style={{ padding: "12px 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#020202", flexShrink: 0 }}>
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  style={{ display: "flex", gap: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "4px 4px 4px 14px", borderRadius: "9999px", alignItems: "center" }}
                >
                  <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Ask about margins, dead stock, repeat LTV..."
                    style={{ flex: 1, background: "none", border: "none", color: "#FFFFFF", fontFamily: "var(--font-inter)", fontSize: 15, outline: "none", padding: "8px 0" }} 
                  />
                  <button 
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    style={{ 
                      background: input.trim() ? "#00F2FF" : "rgba(255,255,255,0.1)", 
                      border: "none", 
                      color: input.trim() ? "#020202" : "rgba(255,255,255,0.3)", 
                      width: "36px", 
                      height: "36px", 
                      borderRadius: "50%", 
                      cursor: input.trim() ? "pointer" : "default", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      flexShrink: 0,
                      touchAction: "manipulation",
                      transition: "all 0.2s ease",
                    }}
                    aria-label="Send message"
                  >
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .chat-modal-container {
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: 92%;
          max-width: 580px;
          height: 560px;
          max-height: 80vh;
          border-radius: 20px;
        }

        @media (max-width: 640px) {
          .chat-modal-container {
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            transform: none !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 86vh !important;
            max-height: 86vh !important;
            border-radius: 20px 20px 0 0 !important;
            border-bottom: none !important;
          }
        }
      `}</style>
    </>
  );
}

