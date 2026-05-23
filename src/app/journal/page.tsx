"use client";

import { useNeuralTransition } from "@/context/TransitionContext";
import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";
import Link from "next/link";
import { FadeSection } from "@/components/FadeSection";
import { ArrowRight, ArrowLeft, Clock, Calendar } from "lucide-react";
import { JOURNAL_POSTS } from "@/data/journalData";

const POSTS = [
  {
    slug: "copilot-founder-paradigm",
    title: "J-031: THE CO-PILOT FOUNDER PARADIGM",
    excerpt: "How modern solo founders partner with advanced agentic AI architectures to bypass the hiring grind.",
    date: "May 27, 2026",
    readTime: "5 min read",
    category: "OPERATIONS"
  },
  {
    slug: "infrastructure-latency-cost",
    title: "J-030: THE COST OF INFRASTRUCTURE LATENCY",
    excerpt: "How every 100ms of loading lag directly decreases your conversion rate by 7%. Engineering speed.",
    date: "May 26, 2026",
    readTime: "4 min read",
    category: "ENGINEERING"
  },
  {
    slug: "vernacular-ai-agents-bharat",
    title: "J-029: VERNACULAR AI AGENTS FOR BHARAT",
    excerpt: "Why English-only sites fail in Tier-2/3 India. Implementing native voice and chat bots in Hindi.",
    date: "May 25, 2026",
    readTime: "5 min read",
    category: "INDIA_GROWTH"
  },
  {
    slug: "cashflow-velocity-metric",
    title: "J-028: METRIC THAT MATTERS: CASHFLOW VELOCITY",
    excerpt: "Moving away from standard ROAS metrics to understand blended unit economics and contribution margins.",
    date: "May 24, 2026",
    readTime: "6 min read",
    category: "STRATEGY"
  },
  {
    slug: "ai-concierge-hydrating-cold-traffic",
    title: "J-027: AI CONCIERGE: HYDRATING COLD D2C TRAFFIC",
    excerpt: "Converting passive website visitors into buyers using contextual AI concierge nodes that answer objections.",
    date: "May 23, 2026",
    readTime: "5 min read",
    category: "AI-AUTOMATION"
  },
  {
    slug: "death-of-meta-pixel-india",
    title: "J-026: THE DEATH OF THE Meta PIXEL IN INDIA",
    excerpt: "Standard browser pixels are obsolete. Transitioning Indian storefronts to server-side Conversions API.",
    date: "May 22, 2026",
    readTime: "6 min read",
    category: "DATA-INFRA"
  },
  {
    slug: "bant-qualification-high-ticket-d2c",
    title: "J-025: BANT QUALIFICATION SECRETS FOR HIGH-TICKET D2C",
    excerpt: "How to qualify prospects on autopilot using autonomous voice and chat agents before booking sales calls.",
    date: "May 21, 2026",
    readTime: "5 min read",
    category: "PERFORMANCE"
  },
  {
    slug: "ten-million-one-man-brand",
    title: "J-024: THE $10M ONE-MAN D2C BRAND",
    excerpt: "How elite founders use autonomous AI agent fleets to run multi-million dollar brands without employees.",
    date: "May 20, 2026",
    readTime: "6 min read",
    category: "GLOBAL_STRATEGY"
  },
  {
    slug: "threejs-webgl-conversion-multiplier",
    title: "J-023: THREE.JS & WEBGL: THE LATEST CONVERSION MULTIPLIER",
    excerpt: "Why static website templates convert poorly. How interactive 3D WebGL experiences boost time-on-site by 300%.",
    date: "May 19, 2026",
    readTime: "6 min read",
    category: "ENGINEERING"
  },
  {
    slug: "indian-d2c-attribution-trap",
    title: "J-022: THE INDIAN D2C ATTRIBUTION TRAP",
    excerpt: "Why standard Meta ad reporting lies to Indian founders, and how a custom Server-Side CAPI setup saves lakhs.",
    date: "May 18, 2026",
    readTime: "5 min read",
    category: "INDIA_GROWTH"
  },
  {
    slug: "reddit-economy-community-sentiment",
    title: "J-021: THE REDDIT ECONOMY & SENTIMENT",
    excerpt: "Why community trust is the new backlink. How to build 'Social Capital' that the AI engines love.",
    date: "May 02, 2026",
    readTime: "5 min read",
    category: "MARKET_INTEL"
  },
  {
    slug: "voice-search-2026-agents",
    title: "J-020: VOICE SEARCH 2026: AGENT OPTIMIZATION",
    excerpt: "Optimizing for Siri, Alexa, and GPT-Voice. Why your brand needs to sound as good as it looks.",
    date: "May 02, 2026",
    readTime: "4 min read",
    category: "MARKET_INTEL"
  },
  {
    slug: "predictive-ltv-ai-customers",
    title: "J-019: PREDICTIVE LTV VIA AI",
    excerpt: "Finding your top 1% customers before they even make their first purchase. High-velocity scaling for elite brands.",
    date: "May 01, 2026",
    readTime: "6 min read",
    category: "PERFORMANCE"
  },
  {
    slug: "capi-mastery-event-tracking",
    title: "J-018: CAPI MASTERY & SIGNAL RECOVERY",
    excerpt: "Beyond the Meta Pixel. Discover how Advanced CAPI implementations recover lost signals and boost attribution accuracy.",
    date: "May 01, 2026",
    readTime: "5 min read",
    category: "PERFORMANCE"
  },
  {
    slug: "llm-training-sales-machine",
    title: "J-017: TURNING PDFS INTO SALES MACHINES",
    excerpt: "How to train LLMs on your proprietary brand data to create a 'Digital Twin' of your best salesperson.",
    date: "April 30, 2026",
    readTime: "6 min read",
    category: "ENGINEERING"
  },
  {
    slug: "self-healing-code-architecture",
    title: "J-016: SELF-HEALING CODE ARCHITECTURE",
    excerpt: "Moving beyond maintenance. How our neural-linked codebases fix their own bugs and adapt to API shifts autonomously.",
    date: "April 30, 2026",
    readTime: "8 min read",
    category: "ENGINEERING"
  },
  {
    slug: "whatsapp-commerce-frontier",
    title: "J-015: WHATSAPP COMMERCE: THE FINAL FRONTIER",
    excerpt: "Why email is secondary in India. Building an autonomous WhatsApp ecosystem that closes sales in under 120 seconds.",
    date: "April 29, 2026",
    readTime: "4 min read",
    category: "INDIA_GROWTH"
  },
  {
    slug: "tier-2-india-revolution",
    title: "J-014: THE TIER-2 INDIA REVOLUTION",
    excerpt: "The next 400M buyers are in Tier-2 and Tier-3 India. How Adyant Nexa infrastructure optimizes for low-bandwidth dominance.",
    date: "April 29, 2026",
    readTime: "5 min read",
    category: "INDIA_GROWTH"
  },
  {
    slug: "pocketos-ai-agent-disaster",
    title: "J-013: THE POCKETOS AI DISASTER",
    excerpt: "9 seconds was all it took. Discover how an autonomous agent wiped a company's production database and backups.",
    date: "April 28, 2026",
    readTime: "12 min read",
    category: "AI-SAFETY"
  },
  {
    slug: "cross-border-dominance-ai",
    title: "J-012: CROSS-BORDER DOMINANCE VIA AI",
    excerpt: "Scaling US brands to EU and APAC markets without local teams. Using AI agents for 24/7 localized commerce.",
    date: "April 28, 2026",
    readTime: "7 min read",
    category: "GLOBAL_STRATEGY"
  },
  {
    slug: "us-ecommerce-recession-hack",
    title: "J-011: THE US E-COMMERCE RECESSION HACK",
    excerpt: "Discover why conversion velocity is the only metric that matters in a high-interest US market. How to cut CAC by 40%.",
    date: "April 28, 2026",
    readTime: "6 min read",
    category: "GLOBAL_STRATEGY"
  },
  {
    slug: "us-market-blueprint-ai-agents",
    title: "J-009: THE US MARKET BLUEPRINT: AI AGENTS OVER STAFFING",
    excerpt: "Why US-based D2C founders are firing support staff and hiring Autonomous Agents. The unit economics of the AI-first era.",
    date: "April 27, 2026",
    readTime: "6 min read",
    category: "GLOBAL_STRATEGY"
  },
  {
    slug: "india-scaling-playbook-roi-ads",
    title: "J-010: THE INDIA SCALING PLAYBOOK: ROI BEYOND ADS",
    excerpt: "Scaling to ₹10Cr/mo in the Indian market requires more than just Meta Ads. Discover the Adyant Nexa ROI Multiplier.",
    date: "April 27, 2026",
    readTime: "5 min read",
    category: "INDIA_GROWTH"
  },
  {
    slug: "death-of-chatbots-rise-of-agents",
    title: "J-001: THE DEATH OF CHATBOTS, THE RISE OF AGENTS",
    excerpt: "Market ab boring 'How can I help you?' wale chatbots se pak gaya hai. Discover why autonomous AI Agents are the only way to scale in 2026.",
    date: "April 27, 2026",
    readTime: "4 min read",
    category: "ENGINEERING"
  },
  {
    slug: "zero-click-marketing-ai-overviews",
    title: "J-002: ZERO-CLICK MARKETING & AI OVERVIEWS",
    excerpt: "Google's SGE is changing the gateway to brand discovery. Why 'Semantic Authority' and high-end vibe is now your primary SEO strategy.",
    date: "April 27, 2026",
    readTime: "5 min read",
    category: "MARKET_INTEL"
  },
  {
    slug: "post-search-era-ai-discovery",
    title: "J-003: THE POST-SEARCH ERA & AI DISCOVERY",
    excerpt: "Google is no longer the only gateway. Discover why 'Semantic Authority' is the new SEO for the 2026 AI ecosystem.",
    date: "April 26, 2026",
    readTime: "6 min read",
    category: "FUTURE-TECH"
  },
  {
    slug: "minimalist-architecture-lean-agency",
    title: "J-004: MINIMALIST ARCHITECTURE & LEAN OPERATIONS",
    excerpt: "Filtering the noise in your code and operations. Why a modular, lightweight tech stack is the ultimate competitive advantage.",
    date: "April 26, 2026",
    readTime: "4 min read",
    category: "OPERATIONS"
  },
  {
    slug: "creative-is-the-new-targeting",
    title: "J-005: CREATIVE IS THE NEW TARGETING",
    excerpt: "Why the visual is now more important than the interest-stack. How to build 'Performance Creative' that feeds the algorithm.",
    date: "April 25, 2026",
    readTime: "5 min read",
    category: "PERFORMANCE"
  },
  {
    slug: "signal-recovery-sst-2026",
    title: "J-006: THE 2026 SIGNAL RECOVERY PLAYBOOK",
    excerpt: "Browser-based tracking is dead. Discover how SST recovers 30% of lost signal and drops CAC by 22% instantly.",
    date: "April 23, 2026",
    readTime: "7 min read",
    category: "DATA-INFRA"
  },
  {
    slug: "attribution-gap-capi-ios14",
    title: "J-007: BEYOND ATTRIBUTION & REVENUE MIXING",
    excerpt: "Moving from simple click-tracking to holistic AI-driven incrementality. Proof that your ads are actually driving profit.",
    date: "April 21, 2026",
    readTime: "8 min read",
    category: "STRATEGY"
  },
  {
    slug: "ai-agent-economy-revenue",
    title: "J-008: THE AI-AGENT ECONOMY & CONVERSION",
    excerpt: "Replacing standard chatbots with autonomous LLM agents that book, follow-up, and close deals without human input.",
    date: "April 19, 2026",
    readTime: "10 min read",
    category: "AI-AUTOMATION"
  }
];

export default function BlogListing() {
  const lenisRef = useRef<Lenis | null>(null);
  const { isNavigating, triggerTransition } = useNeuralTransition();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeCategory, setActiveCategory] = useState("ALL");

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
          name: "Journal Subscriber",
          email: email,
          phone: "N/A",
          business: "Journal Newsletter",
          message: "SUBSCRIBED TO NEURAL PLAYBOOK via Journal Listing page",
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

  const categories = ["ALL", ...new Set(POSTS.map(p => p.category))];

  const filteredAndSortedPosts = [...POSTS]
    .filter(post => {
      const hasContent = !!JOURNAL_POSTS[post.slug as keyof typeof JOURNAL_POSTS];
      const isVisible = new Date(post.date) <= new Date();
      return hasContent && isVisible && (activeCategory === "ALL" || post.category === activeCategory);
    })
    .sort((a, b) => {
      const numA = parseInt(a.title.match(/J-(\d+)/)?.[1] || "0");
      const numB = parseInt(b.title.match(/J-(\d+)/)?.[1] || "0");
      return sortOrder === "desc" ? numB - numA : numA - numB;
    });

  return (
    <div style={{ minHeight: "100vh", background: "#020202", color: "#E5E5E5", overflowX: "hidden", fontFamily: "var(--font-inter)" }}>

      <motion.main
        animate={{ opacity: isNavigating ? 0 : 1, y: isNavigating ? 20 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ padding: "160px 28px 100px", maxWidth: 1280, margin: "0 auto" }}
      >
        <FadeSection>
          <span className="editorial-tag" style={{ display: "block", marginBottom: 24, color: "#00F2FF" }}>The Neural Journal_</span>
          <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2.5rem, 8vw, 5rem)", lineHeight: 0.95, letterSpacing: "-0.04em", marginBottom: 60 }}>
            Insights for <br /> <span style={{ color: "rgba(255,255,255,0.2)" }}>Digital Dominance.</span>
          </h1>
        </FadeSection>

        {/* ─── FILTERS & CONTROLS ─── */}
        <div style={{ marginBottom: 60, display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "24px 0" }}>

          {/* Categories */}
          <div style={{
            display: "flex",
            gap: 28,
            overflowX: "auto",
            whiteSpace: "nowrap",
            paddingBottom: 8,
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            flex: 1,
            marginRight: 20,
            WebkitMaskImage: "linear-gradient(to right, black 85%, transparent 100%)",
            maskImage: "linear-gradient(to right, black 85%, transparent 100%)"
          }}>
            <style dangerouslySetInnerHTML={{
              __html: `
              div::-webkit-scrollbar { display: none; }
            `}} />
            {categories.map(cat => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: "none",
                  border: "none",
                  color: activeCategory === cat ? "#00F2FF" : "rgba(255,255,255,0.3)",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  cursor: "pointer",
                  padding: "8px 0",
                  transition: "color 0.3s ease",
                  flexShrink: 0
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Order */}
          <button
            type="button"
            onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              padding: "10px 20px",
              fontFamily: "var(--font-geist-mono)",
              fontSize: 9,
              letterSpacing: "0.1em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
          >
            ORDER: <span style={{ color: "#00F2FF" }}>{sortOrder === "desc" ? "LATEST_FIRST" : "OLDEST_FIRST"}</span>
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 40 }}>
          {filteredAndSortedPosts.map((post, i) => (
            <FadeSection key={post.slug} delay={i * 0.05}>
              <Link
                href={`/journal/${post.slug}`}
                onClick={(e) => handleNavigate(e, `/journal/${post.slug}`)}
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <div className="glass-panel" style={{ padding: 40, height: "100%", display: "flex", flexDirection: "column", gap: 24, transition: "border-color 0.3s ease, background 0.3s ease", border: "1px solid rgba(255,255,255,0.05)" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "rgba(0,242,255,0.3)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.01)";
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="editorial-tag" style={{ fontSize: 9, color: "#00F2FF" }}>{post.category}</span>
                    <div style={{ display: "flex", gap: 16, opacity: 0.3 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontFamily: "var(--font-geist-mono)" }}><Calendar size={12} /> {post.date}</span>
                    </div>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 24, lineHeight: 1.2, color: "#fff" }}>{post.title}</h2>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(229,229,229,0.5)", lineHeight: 1.6, flex: 1 }}>{post.excerpt}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#00F2FF", fontFamily: "var(--font-geist-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>
                    ACCESS_REPORT <ArrowRight size={14} />
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
              {subscribed ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ color: "#00F2FF", fontFamily: "var(--font-geist-mono)", fontSize: 14 }}>
                  Transmission Complete. You have joined the elite.
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} style={{ display: "flex", flexWrap: "wrap", gap: 12, maxWidth: 500, margin: "0 auto", width: "100%", flexDirection: "column" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, width: "100%" }}>
                    <input
                      type="email"
                      required
                      placeholder="Business Email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,0.03)", border: `1px solid ${error ? "#FF4444" : "rgba(255,255,255,0.1)"}`, padding: "16px 24px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13, outline: "none" }}
                    />
                    <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: "0 32px", fontSize: 11, height: 50, opacity: isSubmitting ? 0.6 : 1, cursor: "pointer" }}>
                      {isSubmitting ? "SYNCING..." : "JOIN ELITE"}
                    </button>
                  </div>
                  {error && <span style={{ color: "#FF4444", fontSize: 10, fontFamily: "var(--font-geist-mono)", marginTop: 4, textAlign: "left", alignSelf: "flex-start" }}>{error}</span>}
                </form>
              )}
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
