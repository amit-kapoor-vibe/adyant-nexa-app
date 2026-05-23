"use client";

import { useNeuralTransition } from "@/context/TransitionContext";
import { useEffect, useState, use, useRef } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";
import Link from "next/link";
import { FadeSection } from "@/components/FadeSection";
import { ArrowLeft, Share2, Mail } from "lucide-react";
import { JOURNAL_POSTS } from "@/data/journalData";

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

  if (!post) return <div style={{ color: "#fff", padding: 100 }}>Post not found.</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#020202", color: "#E5E5E5", overflowX: "hidden", fontFamily: "var(--font-inter)" }}>

      <motion.main
        animate={{ opacity: isNavigating ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{ padding: "160px 28px 100px", maxWidth: 800, margin: "0 auto" }}
      >
        <FadeSection>
          <div style={{ marginBottom: 40 }}>
            <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 16, display: "block" }}>{post.category}_</span>
            <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1, marginBottom: 24 }}>
              {post.title}
            </h1>
            <div style={{ display: "flex", gap: 24, opacity: 0.4, fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          <div style={{ fontFamily: "var(--font-inter)", fontSize: 17, lineHeight: 1.9, color: "rgba(229,229,229,0.7)", marginBottom: 80, whiteSpace: "pre-line" }}>
            {post.content}
          </div>

          {/* ─── LEAD MAGNET / NEWSLETTER ─── */}
          <div className="glass-panel" style={{ padding: 60, textAlign: "center", position: "relative", overflow: "hidden" }}>
             <div className="ambient-orb" style={{ top: "-50%", left: "-50%", width: "200%", height: "200%", opacity: 0.05 }} />
             <Mail size={48} color="#00F2FF" style={{ marginBottom: 32, opacity: 0.3 }} />
             <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 32, marginBottom: 16 }}>Join the <span style={{ color: "#00F2FF" }}>Elite.</span></h3>
             <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 40, maxWidth: 450, margin: "0 auto 40px" }}>
               Get our proprietary "Neural Scaling Playbook" and weekly insights on AI dominance directly in your inbox.
             </p>
             {subscribed ? (
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ color: "#00F2FF", fontFamily: "var(--font-geist-mono)", fontSize: 14 }}>
                 Transmission Complete. You have joined the elite.
               </motion.div>
             ) : (
               <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", maxWidth: 400, margin: "0 auto", gap: 12, width: "100%" }}>
                 <div style={{ display: "flex", gap: 12, width: "100%" }}>
                   <input
                     type="email"
                     required
                     placeholder="Enter your business email"
                     value={email}
                     onChange={(e) => { setEmail(e.target.value); setError(""); }}
                     style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: `1px solid ${error ? "#FF4444" : "rgba(255,255,255,0.1)"}`, padding: "16px 20px", color: "#fff", fontFamily: "var(--font-geist-mono)", fontSize: 13, outline: "none" }}
                   />
                   <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: "0 24px", fontSize: 10, opacity: isSubmitting ? 0.6 : 1, cursor: "pointer" }}>
                     {isSubmitting ? "SYNC..." : "JOIN"}
                   </button>
                 </div>
                 {error && <span style={{ color: "#FF4444", fontSize: 10, fontFamily: "var(--font-geist-mono)", marginTop: 4, textAlign: "left", alignSelf: "flex-start" }}>{error}</span>}
               </form>
             )}
          </div>
        </FadeSection>
      </motion.main>
    </div>
  );
}
