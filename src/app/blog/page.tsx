"use client";

import { useNeuralTransition } from "@/context/TransitionContext";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";
import Link from "next/link";
import { FadeSection } from "@/components/FadeSection";
import { ArrowRight, Clock, Calendar } from "lucide-react";

const POSTS = [
  {
    slug: "attribution-gap-capi-ios14",
    title: "The Attribution Gap: Why Browser Pixels are Dying",
    excerpt: "How server-side architecture (CAPI) is becoming the only way to scale ads in a privacy-first world.",
    date: "April 24, 2026",
    readTime: "6 min read",
    category: "AD-TECH"
  },
  {
    slug: "ai-agent-economy-revenue",
    title: "The AI-Agent Economy: Replacing Support with LLMs",
    excerpt: "Why the next billion-dollar agencies will be run by multi-agent AI ecosystems, not human teams.",
    date: "April 22, 2026",
    readTime: "8 min read",
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
      {/* ─── NAVIGATION ─── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(2,2,2,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "20px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
          <Link href="/" onClick={(e) => handleNavigate(e, "/")} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <img src="/Favicon transparent.png" alt="Adyant Nexa" width={28} height={28} />
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 14, color: "#fff" }}>ADYANT NEXA</span>
          </Link>
          <Link href="/#contact" onClick={(e) => handleNavigate(e, "/#contact")} className="btn-primary" style={{ fontSize: 10, padding: "8px 24px" }}>Engage Protocol</Link>
        </div>
      </nav>

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
      </motion.main>
    </div>
  );
}
