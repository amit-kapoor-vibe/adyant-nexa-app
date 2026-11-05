"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  X, 
  ArrowUp, 
  Sparkles, 
  RotateCcw, 
  Cpu, 
  ExternalLink 
} from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Welcome to Adyant Nexa. I am your Autonomous Retail Advisor for Dubai & London fashion boutiques, ateliers, and apparel labels.\n\n" +
    "How can I assist your boutique today with DM response latency, showroom inventory sync, or in-chat conversational checkout?",
};

const SUGGESTED_QUERIES = [
  "How to cut DM delay from 4 hours to 4 seconds?",
  "How showroom stock sync stops double-selling",
  "In-chat checkout with Apple Pay & Tabby",
];

function FormattedContent({ text, isUser }: { text: string; isUser: boolean }) {
  if (isUser) {
    return <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>;
  }

  const cleaned = text.replace(/\*{3,}/g, "").trim();
  const lines = cleaned.split("\n");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} style={{ height: "4px" }} />;

        const isBullet = /^[*•-]\s+/.test(trimmed);
        const isNumbered = /^\d+\.\s+/.test(trimmed);
        const rawContent = isBullet
          ? trimmed.replace(/^[*•-]\s+/, "")
          : isNumbered
          ? trimmed.replace(/^\d+\.\s+/, "")
          : trimmed;

        const parts = rawContent.split(/(\*\*.*?\*\*)/g);
        const rendered = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
            return (
              <strong key={pIdx} style={{ color: "var(--text-color)", fontWeight: 700 }}>
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part.replace(/^\*|\*$/g, "");
        });

        if (isBullet || isNumbered) {
          return (
            <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", paddingLeft: "2px" }}>
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "var(--accent-color)",
                  marginTop: "7px",
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, color: "var(--text-color)", lineHeight: 1.55 }}>
                {rendered}
              </span>
            </div>
          );
        }

        return (
          <p key={idx} style={{ margin: 0, color: "var(--text-color)", lineHeight: 1.55 }}>
            {rendered}
          </p>
        );
      })}
    </div>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    if (!queryText) setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: messages }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Our Autonomous Retail Engine audits your boutique metrics at /assessment.",
        },
      ]);
      if (!isOpen) setHasUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Our live retail consultative engine is synchronizing. You can immediately evaluate your boutique latency and inventory lock metrics at /assessment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  };

  return (
    <>
      {/* Floating Trigger in Bottom-Right */}
      <div
        id="chat-widget"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 999990,
        }}
      >
        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? "Close Concierge" : "Open Luxury Retail Concierge"}
          style={{
            position: "relative",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "var(--surface-color)",
            border: "1px solid rgba(0, 71, 255, 0.35)",
            boxShadow: "0 8px 30px rgba(0, 71, 255, 0.25), 0 2px 8px rgba(10, 10, 12, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        >
          {isOpen ? (
            <X size={22} color="var(--text-color)" />
          ) : (
            <>
              <MessageSquare size={22} color="var(--accent-color)" />
              {hasUnread && (
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--accent-color)",
                    boxShadow: "0 0 8px var(--accent-color)",
                  }}
                />
              )}
            </>
          )}
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="chat-mobile-backdrop"
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(10,10,12,0.45)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                zIndex: 999995,
              }}
            />

            {/* Chat Box Panel */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="chat-window-panel"
              style={{
                position: "fixed",
                zIndex: 999998,
                background: "var(--surface-color)",
                border: "1px solid var(--border-color)",
                boxShadow: "0 28px 80px rgba(10,10,12,0.22), 0 0 45px rgba(0,71,255,0.08)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "14px 18px",
                  borderBottom: "1px solid var(--border-color)",
                  background: "var(--bg-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(0,71,255,0.08)",
                      border: "1px solid rgba(0,71,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Cpu size={16} color="var(--accent-color)" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 700,
                        fontSize: "13px",
                        color: "var(--text-color)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Retail Concierge
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "1px" }}>
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: "var(--accent-color)",
                          boxShadow: "0 0 6px var(--accent-color)",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-geist-mono)",
                          fontSize: "10px",
                          color: "var(--muted-text)",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        Dubai &amp; London Engine
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Reset conversation"
                    aria-label="Reset conversation"
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color)",
                      background: "transparent",
                      color: "var(--muted-text)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <RotateCcw size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    title="Close"
                    aria-label="Close"
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color)",
                      background: "transparent",
                      color: "var(--muted-text)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div
                ref={scrollRef}
                data-lenis-prevent
                style={{
                  flex: 1,
                  padding: "16px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                      maxWidth: "88%",
                    }}
                  >
                    <div
                      style={{
                        padding: "11px 14px",
                        background:
                          m.role === "user" ? "var(--accent-color)" : "rgba(248, 248, 250, 0.95)",
                        color: m.role === "user" ? "#FFFFFF" : "var(--text-color)",
                        border: m.role === "user" ? "none" : "1px solid var(--border-color)",
                        borderRadius:
                          m.role === "user"
                            ? "14px 14px 3px 14px"
                            : "14px 14px 14px 3px",
                        fontSize: "13px",
                        fontFamily: "var(--font-inter)",
                        lineHeight: 1.5,
                        boxShadow:
                          m.role === "user"
                            ? "0 4px 14px rgba(0,71,255,0.2)"
                            : "0 2px 6px rgba(10,10,12,0.02)",
                      }}
                    >
                      <FormattedContent text={m.content} isUser={m.role === "user"} />
                    </div>
                  </div>
                ))}

                {/* Suggested Queries on first load */}
                {messages.length === 1 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                    {SUGGESTED_QUERIES.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => handleSend(q)}
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-color)",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontFamily: "var(--font-inter)",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Loading indicator */}
                {isLoading && (
                  <div
                    style={{
                      alignSelf: "flex-start",
                      padding: "8px 12px",
                      background: "rgba(0,71,255,0.04)",
                      border: "1px dashed rgba(0,71,255,0.25)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: "10px",
                        color: "var(--accent-color)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Consulting Engine...
                    </span>
                  </div>
                )}
              </div>

              {/* Action Banner to Assessment */}
              <div
                style={{
                  padding: "8px 16px",
                  background: "rgba(0,71,255,0.03)",
                  borderTop: "1px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={12} color="var(--accent-color)" />
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "11px",
                      color: "var(--muted-text)",
                    }}
                  >
                    Boutique Revenue Diagnostic
                  </span>
                </div>
                <Link
                  href="/assessment"
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--accent-color)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  AUDIT
                  <ExternalLink size={11} />
                </Link>
              </div>

              {/* Input Row */}
              <div
                style={{
                  padding: "12px 14px",
                  background: "var(--bg-color)",
                  borderTop: "1px solid var(--border-color)",
                  flexShrink: 0,
                }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#FFFFFF",
                    border: "1px solid var(--border-color)",
                    borderRadius: "9999px",
                    padding: "4px 6px 4px 14px",
                  }}
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about DM latency, showroom stock..."
                    style={{
                      flex: 1,
                      background: "none",
                      border: "none",
                      color: "var(--text-color)",
                      fontFamily: "var(--font-inter)",
                      fontSize: "13px",
                      outline: "none",
                      padding: "6px 0",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    aria-label="Send message"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: "none",
                      background: input.trim() ? "var(--accent-color)" : "rgba(10,10,12,0.08)",
                      color: input.trim() ? "#FFFFFF" : "rgba(10,10,12,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: input.trim() ? "pointer" : "default",
                      flexShrink: 0,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <ArrowUp size={15} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .chat-window-panel {
          bottom: 92px;
          right: 24px;
          width: 380px;
          max-width: calc(100vw - 32px);
          height: 540px;
          max-height: calc(100vh - 120px);
          border-radius: 16px;
        }

        .chat-mobile-backdrop {
          display: none;
        }

        @media (max-width: 640px) {
          .chat-mobile-backdrop {
            display: block;
          }

          .chat-window-panel {
            bottom: 0 !important;
            right: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 85vh !important;
            max-height: 85vh !important;
            border-radius: 20px 20px 0 0 !important;
            border-bottom: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default ChatWidget;
