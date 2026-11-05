"use client";

import { useNeuralTransition } from "@/context/TransitionContext";
import React, { useEffect, useState, use, useRef } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";
import Link from "next/link";
import { FadeSection } from "@/components/FadeSection";
import { ArrowLeft, Mail } from "lucide-react";
import { JOURNAL_POSTS } from "@/data/journalData";

// Rich parser to transform markdown headings, inline links, lists, and bold text into styled interactive React elements
function ArticleContentRenderer({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\s*\n/);

  const parseInline = (text: string) => {
    const tokenRegex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g;
    const tokens = text.split(tokenRegex);

    return tokens.map((token, idx) => {
      if (!token) return null;

      // Link: [label](url)
      const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const [, label, url] = linkMatch;
        return (
          <Link
            key={idx}
            href={url}
            style={{
              color: "var(--accent-color)",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
          >
            {label}
          </Link>
        );
      }

      // Bold: **text**
      const boldMatch = token.match(/^\*\*(.*?)\*\*$/);
      if (boldMatch) {
        return (
          <strong key={idx} style={{ color: "var(--text-color)", fontWeight: 700 }}>
            {boldMatch[1]}
          </strong>
        );
      }

      return <span key={idx}>{token}</span>;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "60px" }}>
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Horizontal Divider
        if (trimmed === "---") {
          return (
            <hr
              key={bIdx}
              style={{
                border: "none",
                borderTop: "1px solid var(--border-color)",
                margin: "16px 0",
              }}
            />
          );
        }

        // Heading 2 (##)
        if (trimmed.startsWith("## ")) {
          const title = trimmed.replace(/^##\s+/, "");
          return (
            <h2
              key={bIdx}
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 700,
                fontSize: "clamp(1.4rem, 3.5vw, 1.85rem)",
                color: "var(--text-color)",
                marginTop: "16px",
                marginBottom: "4px",
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
              }}
            >
              {parseInline(title)}
            </h2>
          );
        }

        // Heading 3 (###)
        if (trimmed.startsWith("### ")) {
          const title = trimmed.replace(/^###\s+/, "");
          return (
            <h3
              key={bIdx}
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 700,
                fontSize: "clamp(1.15rem, 2.5vw, 1.4rem)",
                color: "var(--text-color)",
                marginTop: "12px",
                marginBottom: "4px",
                lineHeight: 1.35,
              }}
            >
              {parseInline(title)}
            </h3>
          );
        }

        // Heading 4 (####)
        if (trimmed.startsWith("#### ")) {
          const title = trimmed.replace(/^####\s+/, "");
          return (
            <h4
              key={bIdx}
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "var(--accent-color)",
                marginTop: "8px",
                marginBottom: "2px",
              }}
            >
              {parseInline(title)}
            </h4>
          );
        }

        // Preformatted Code or ASCII Diagrams
        if (trimmed.startsWith("```") || (trimmed.startsWith("┌") && trimmed.includes("┐")) || (trimmed.startsWith("[") && trimmed.includes("──"))) {
          const codeText = trimmed.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
          return (
            <div
              key={bIdx}
              className="glass-panel"
              style={{
                padding: "20px",
                borderRadius: "14px",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "12px",
                color: "var(--accent-color)",
                overflowX: "auto",
                whiteSpace: "pre",
                lineHeight: 1.5,
                background: "rgba(0, 71, 255, 0.03)",
                border: "1px solid rgba(0, 71, 255, 0.15)",
                margin: "12px 0",
              }}
            >
              {codeText}
            </div>
          );
        }

        // List items (* or - or numbered)
        const lines = trimmed.split("\n");
        const isList = lines.every(l => /^(\*|-|\d+\.)\s+/.test(l.trim()));

        if (isList) {
          return (
            <div key={bIdx} style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "4px" }}>
              {lines.map((line, lIdx) => {
                const lineTrimmed = line.trim();
                const isNumbered = /^\d+\.\s+/.test(lineTrimmed);
                const itemContent = lineTrimmed.replace(/^(\*|-|\d+\.)\s+/, "");

                return (
                  <div key={lIdx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    {isNumbered ? (
                      <span style={{ color: "var(--accent-color)", fontFamily: "var(--font-geist-mono)", fontSize: "13px", fontWeight: 700, marginTop: "2px" }}>
                        {lineTrimmed.match(/^\d+\./)?.[0]}
                      </span>
                    ) : (
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-color)", marginTop: "9px", flexShrink: 0 }} />
                    )}
                    <span style={{ flex: 1, fontFamily: "var(--font-inter)", fontSize: "clamp(15px, 1.8vw, 16.5px)", lineHeight: 1.75, color: "var(--text-color)" }}>
                      {parseInline(itemContent)}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p
            key={bIdx}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(15px, 1.8vw, 17px)",
              lineHeight: 1.85,
              color: "var(--muted-text)",
              margin: 0,
            }}
          >
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const lenisRef = useRef<Lenis | null>(null);
  const { isNavigating, triggerTransition } = useNeuralTransition();
  const post = JOURNAL_POSTS[slug as keyof typeof JOURNAL_POSTS];

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid business email.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Blog Subscriber",
          email: email,
          phone: "N/A",
          business: "Blog Newsletter",
          message: `SUBSCRIBED TO NEURAL PLAYBOOK via Blog: ${post?.title || slug}`,
          budget: "0"
        })
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
      } else {
        setError("Transmission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Connection failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const lenis = new Lenis({ duration: 0.95 });
    lenisRef.current = lenis;
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    triggerTransition(target, lenisRef.current);
  };

  if (!post) {
    return (
      <div style={{ position: "relative", zIndex: 10, minHeight: "100vh", background: "transparent", color: "var(--text-color)", padding: "140px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 28, marginBottom: 16 }}>Article in Preparation</h2>
        <p style={{ color: "var(--muted-text)", marginBottom: 32 }}>This journal intelligence report is currently being formatted.</p>
        <Link href="/journal" className="btn-primary" style={{ padding: "12px 28px", borderRadius: "9999px" }}>
          Return to Journal
        </Link>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", zIndex: 10, minHeight: "100vh", background: "transparent", color: "var(--text-color)", overflowX: "hidden", fontFamily: "var(--font-inter)" }}>

      <motion.main
        animate={{ opacity: isNavigating ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{ padding: "clamp(6rem, 12vw, 8.5rem) clamp(1rem, 4vw, 1.5rem) 5rem", maxWidth: 840, margin: "0 auto", position: "relative", zIndex: 10 }}
      >
        <FadeSection>
          {/* Header Metadata */}
          <div style={{ marginBottom: 40 }}>
            <Link href="/journal" onClick={(e) => handleNavigate(e, "/journal")} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--accent-color)", textDecoration: "none", fontSize: 12, fontFamily: "var(--font-geist-mono)", marginBottom: 24 }}>
              <ArrowLeft size={14} /> BACK TO JOURNAL
            </Link>
            <span className="editorial-tag" style={{ color: "var(--accent-color)", marginBottom: 16, display: "block" }}>{post.category.replace(/_/g, " ")}</span>
            <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.03em", color: "var(--text-color)" }}>
              {post.title}
            </h1>
            <div style={{ display: "flex", gap: 20, opacity: 0.7, fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--muted-text)" }}>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Formatted Article Content with Clickable Links */}
          <ArticleContentRenderer content={post.content} />

          {/* Bottom Diagnostic Action Strip */}
          <div className="glass-panel" style={{ borderRadius: "20px", padding: "clamp(1.5rem, 4vw, 2.5rem)", border: "1px solid var(--border-color)", backgroundColor: "var(--surface-color)", boxShadow: "0 4px 20px -2px rgba(10,10,12,0.04)", marginBottom: 60, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div>
              <span className="editorial-tag" style={{ display: "block", marginBottom: 6, fontSize: 10, color: "var(--accent-color)" }}>COMMERCIAL DIAGNOSTIC</span>
              <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-color)", margin: 0 }}>
                Evaluate Your Store Numbers
              </h4>
              <p style={{ color: "var(--muted-text)", fontSize: "0.88rem", marginTop: 4, margin: 0 }}>
                Run our mathematical profit leakage &amp; dead stock audit in 4 minutes.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/assessment" className="btn-primary" style={{ padding: "10px 22px", borderRadius: "9999px", fontSize: 12, fontWeight: 700 }}>
                Check D2C Readiness
              </Link>
              <Link href="/tools/profit-opportunity" className="btn-secondary" style={{ padding: "10px 20px", borderRadius: "9999px", fontSize: 12, fontWeight: 600 }}>
                Calculate Margin
              </Link>
            </div>
          </div>

          {/* ─── LEAD MAGNET / NEWSLETTER ─── */}
          <div className="glass-panel" style={{ padding: "clamp(2rem, 6vw, 4rem)", textAlign: "center", position: "relative", overflow: "hidden", borderRadius: "24px", backgroundColor: "var(--surface-color)", border: "1px solid var(--border-color)", boxShadow: "0 10px 40px rgba(10,10,12,0.05)" }}>
             <div className="ambient-orb" style={{ top: "-50%", left: "-50%", width: "200%", height: "200%", opacity: 0.05 }} />
             <Mail size={42} color="var(--accent-color)" style={{ marginBottom: 24, opacity: 0.8 }} />
             <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2rem)", marginBottom: 12, color: "var(--text-color)" }}>Join the <span style={{ color: "var(--accent-color)" }}>Elite.</span></h3>
             <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "var(--muted-text)", marginBottom: 32, maxWidth: 450, margin: "0 auto 32px", lineHeight: 1.6 }}>
               Get our proprietary "Neural Scaling Playbook" and weekly insights on retail margin protection directly in your inbox.
             </p>
             {subscribed ? (
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ color: "var(--accent-color)", fontFamily: "var(--font-geist-mono)", fontSize: 14 }}>
                 Transmission Complete. You have joined the elite.
               </motion.div>
             ) : (
               <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", maxWidth: 420, margin: "0 auto", gap: 12, width: "100%" }}>
                 <div style={{ display: "flex", gap: 10, width: "100%", flexWrap: "wrap" }}>
                   <input
                     type="email"
                     required
                     placeholder="Enter your business email"
                     value={email}
                     onChange={(e) => { setEmail(e.target.value); setError(""); }}
                     style={{ flex: "1 1 220px", background: "#FFFFFF", border: `1px solid ${error ? "#FF4444" : "var(--border-color)"}`, padding: "14px 18px", color: "var(--text-color)", fontFamily: "var(--font-inter)", fontSize: 14, outline: "none", borderRadius: "8px" }}
                   />
                   <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: "14px 24px", fontSize: 11, fontWeight: 700, opacity: isSubmitting ? 0.6 : 1, cursor: "pointer", borderRadius: "8px", flexShrink: 0 }}>
                     {isSubmitting ? "SYNC..." : "JOIN"}
                   </button>
                 </div>
                 {error && <span style={{ color: "#FF4444", fontSize: 11, fontFamily: "var(--font-geist-mono)", marginTop: 4, textAlign: "left", alignSelf: "flex-start" }}>{error}</span>}
               </form>
             )}
          </div>
        </FadeSection>
      </motion.main>
    </div>
  );
}
