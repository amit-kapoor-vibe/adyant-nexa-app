"use client";

import { useNeuralTransition } from "@/context/TransitionContext";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";
import Link from "next/link";
import { FadeSection } from "@/components/FadeSection";
import { ArrowRight, ArrowLeft, Clock, Calendar } from "lucide-react";

const POSTS = [
  {
    slug: "post-search-era-ai-discovery",
    title: "The Post-Search Era: Brand Discovery in the Age of LLMs",
    excerpt: "Google is no longer the only gateway. Discover why 'Semantic Authority' is the new SEO for the 2026 AI ecosystem.",
    date: "April 27, 2026",
    readTime: "6 min read",
    category: "FUTURE-TECH"
  },
  {
    slug: "minimalist-architecture-lean-agency",
    title: "Minimalist Architecture: Why the Leanest Agencies Win",
    excerpt: "Filtering the noise in your code and operations. Why a modular, lightweight tech stack is the ultimate competitive advantage.",
    date: "April 27, 2026",
    readTime: "4 min read",
    category: "OPERATIONS"
  },
  {
    slug: "creative-is-the-new-targeting",
    title: "Creative is the New Targeting: Scaling in the AI Era",
    excerpt: "Why the visual is now more important than the interest-stack. How to build 'Performance Creative' that feeds the algorithm.",
    date: "April 26, 2026",
    readTime: "5 min read",
    category: "PERFORMANCE"
  },
  {
    slug: "signal-recovery-sst-2026",
    title: "The 2026 Signal Recovery Playbook: Server-Side GTM",
    excerpt: "Browser-based tracking is dead. Discover how SST recovers 30% of lost signal and drops CAC by 22% instantly.",
    date: "April 24, 2026",
    readTime: "7 min read",
    category: "DATA-INFRA"
  },
  {
    slug: "attribution-gap-capi-ios14",
    title: "Beyond Attribution: The Rise of Revenue Mix Modeling",
    excerpt: "Moving from simple click-tracking to holistic AI-driven incrementality. Proof that your ads are actually driving profit.",
    date: "April 22, 2026",
    readTime: "8 min read",
    category: "STRATEGY"
  },
  {
    slug: "ai-agent-economy-revenue",
    title: "The AI-Agent Economy: Autonomous Lead Conversion",
    excerpt: "Replacing standard chatbots with autonomous LLM agents that book, follow-up, and close deals without human input.",
    date: "April 20, 2026",
    readTime: "10 min read",
    category: "AI-AUTOMATION"
  }
];

export default function BlogListing() {
  const [lenisRef, setLenisRef] = useState<Lenis | null>(null);
  const { isNavigating, triggerTransition } = useNeuralTransition();

  useEffect(() => {
    const lenis = new Lenis({ duration: 0.95 });
    setLenisRef(lenis);
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    triggerTransition(target, lenisRef);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020202", color: "#E5E5E5", overflowX: "hidden", fontFamily: "var(--font-inter)" }}>

      <motion.main
        animate={{ opacity: isNavigating ? 0 : 1, y: isNavigating ? 20 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ padding: "160px 28px 100px", maxWidth: 1280, margin: "0 auto" }}
      >
        <FadeSection>
          <span className="editorial-tag" style={{ display: "block", marginBottom: 24, color: "#00F2FF" }}>The Neural Journal_</span>
          <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.5rem, 8vw, 5rem)", lineHeight: 0.95, letterSpacing: "-0.04em", marginBottom: 80 }}>
            Insights for <br /> <span style={{ color: "rgba(255,255,255,0.2)" }}>Digital Dominance.</span>
          </h1>
        </FadeSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 40 }}>
          {POSTS.map((post, i) => (
            <FadeSection key={post.slug} delay={i * 0.1}>
              <Link 
                href={`/blog/${post.slug}`} 
                onClick={(e) => handleNavigate(e, `/blog/${post.slug}`)}
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <div className="glass-panel" style={{ padding: 40, height: "100%", display: "flex", flexDirection: "column", gap: 24, transition: "border-color 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,242,255,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="editorial-tag" style={{ fontSize: 9, color: "#00F2FF" }}>{post.category}</span>
                    <div style={{ display: "flex", gap: 16, opacity: 0.3 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontFamily: "var(--font-geist-mono)" }}><Calendar size={12}/> {post.date}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontFamily: "var(--font-geist-mono)" }}><Clock size={12}/> {post.readTime}</span>
                    </div>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 28, lineHeight: 1.2, color: "#fff" }}>{post.title}</h2>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "rgba(229,229,229,0.45)", lineHeight: 1.6, flex: 1 }}>{post.excerpt}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#00F2FF", fontFamily: "var(--font-geist-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>
                    READ ANALYSIS <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </FadeSection>
          ))}
        </div>

        {/* ─── NEWSLETTER & RETURN ─── */}
        <FadeSection delay={0.4}>
          <div style={{ marginTop: 100, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 100, textAlign: "center" }}>
            <div className="glass-panel" style={{ padding: "60px 28px", maxWidth: 800, margin: "0 auto 60px", background: "rgba(0,242,255,0.01)" }}>
              <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 20, display: "block" }}>Subscribe to Intelligence_</span>
              <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: "#fff", marginBottom: 32 }}>
                Get the <span style={{ color: "#00F2FF" }}>Neural Scaling</span> Playbook.
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, maxWidth: 500, margin: "0 auto" }}>
                <input 
                  type="email" 
                  placeholder="Business Email" 
                  style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "16px 24px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13 }} 
                />
                <button className="btn-primary" style={{ padding: "0 32px", fontSize: 11, height: 50 }}>JOIN ELITE</button>
              </div>
            </div>

            <Link 
              href="/" 
              onClick={(e) => handleNavigate(e, "/")}
              style={{ 
                fontFamily: "var(--font-geist-mono)", 
                fontSize: 10, 
                color: "rgba(255,255,255,0.3)", 
                textDecoration: "none",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: 12
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#00F2FF"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
            >
              <ArrowLeft size={12} /> BACK TO GENESIS
            </Link>
          </div>
        </FadeSection>
      </motion.main>
    </div>
  );
}
