"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, RefreshCw, Send, Image as ImageIcon, CheckCircle, 
  AlertTriangle, Play, Sparkles, Terminal, FileText, Globe, 
  ExternalLink, Layers, ShieldCheck, ChevronRight
} from "lucide-react";

interface SocialPost {
  id: string;
  topic: string;
  platforms: string[];
  caption: string;
  visualPrompt: string;
  status: "Draft" | "Approved" | "Published" | "Failed";
  visualUrl: string;
  postLink: string;
}

export default function AgentOpsDashboard() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string>("SYSTEM // Connected to Adyant Neural Network.\nWaiting for direct action command...\n");
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeFormat, setActiveFormat] = useState<"square" | "portrait" | "reel">("square");

  const [customTopicInput, setCustomTopicInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Fetch all posts from API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/social-automation");
      const data = await res.json();
      if (data.success) {
        setPosts(data.records || []);
        // Automatically select first post for the Studio if available
        if (data.records && data.records.length > 0 && !selectedPost) {
          setSelectedPost(data.records[0]);
          setCustomPrompt(data.records[0].visualPrompt);
        }
      }
    } catch (err) {
      logToTerminal(`❌ System Error: Failed to query Lark CRM ledger.\n`);
    } finally {
      setLoading(false);
    }
  };

  const logToTerminal = (text: string) => {
    setTerminalLogs(prev => prev + `[${new Date().toLocaleTimeString()}] ${text}\n`);
  };

  const triggerGeneration = async () => {
    if (pipelineRunning) return;
    setPipelineRunning(true);
    logToTerminal("🤖 INITIATING STAGE 1: Content Writer Agent (Gemini 2.5-Flash)...");
    if (customTopicInput) {
      logToTerminal(`🎯 Custom Campaign Topic Triggered: "${customTopicInput}"`);
    } else {
      logToTerminal("🔗 Scanning default B2B Brand Themes & Copywriting Empathy Rules...");
    }
    
    try {
      const res = await fetch("/api/social-automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "generate",
          customTopic: customTopicInput || undefined 
        })
      });
      const data = await res.json();
      if (data.success) {
        logToTerminal("✅ Generation Success! Drafts pushed to Lark CRM.");
        if (data.logs) {
          setTerminalLogs(prev => prev + `\n--- terminal stdout ---\n${data.logs}\n-----------------------\n`);
        }
        await fetchPosts();
      } else {
        logToTerminal(`❌ Generator Failed: ${data.error}`);
      }
    } catch (err: any) {
      logToTerminal(`❌ Network Error triggering pipeline: ${err.message}`);
    } finally {
      setPipelineRunning(false);
    }
  };

  // Run Live Publisher
  const triggerPublishing = async () => {
    if (pipelineRunning) return;
    setPipelineRunning(true);
    logToTerminal("🚀 INITIATING STAGE 2: Social Media Publisher Agent...");
    logToTerminal("📥 Querying Lark Base for 'Approved' records...");
    
    try {
      const res = await fetch("/api/social-automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" })
      });
      const data = await res.json();
      if (data.success) {
        logToTerminal("✅ Publishing Loop Complete!");
        if (data.logs) {
          setTerminalLogs(prev => prev + `\n--- terminal stdout ---\n${data.logs}\n-----------------------\n`);
        }
        await fetchPosts();
      } else {
        logToTerminal(`❌ Publisher Failed: ${data.error}`);
      }
    } catch (err: any) {
      logToTerminal(`❌ Network Error triggering publisher: ${err.message}`);
    } finally {
      setPipelineRunning(false);
    }
  };

  // Regenerate Image using NVIDIA FLUX.1
  const regenerateVisual = async () => {
    if (!selectedPost || isRegenerating) return;
    setIsRegenerating(true);
    logToTerminal(`🎨 INITIATING IMAGE STUDIO: Spawning Google Imagen 3...`);
    logToTerminal(`📐 Custom prompt: "${customPrompt.substring(0, 50)}..."`);
    
    try {
      const res = await fetch("/api/social-automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "regenerate-image",
          topic: selectedPost.topic,
          filename: selectedPost.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          recordId: selectedPost.id
        })
      });
      
      const data = await res.json();
      if (data.success && data.urls) {
        logToTerminal(`✅ Image Render Successful! Format square, portrait, and reel generated.`);
        // Update selected post with the new square url preview
        setSelectedPost(prev => prev ? {
          ...prev,
          visualUrl: `http://localhost:3000${data.urls[activeFormat]}`
        } : null);
        
        // Refresh full posts list
        await fetchPosts();
      } else {
        logToTerminal(`❌ Image Studio Failed: ${data.error}`);
      }
    } catch (err: any) {
      logToTerminal(`❌ Network Error generating image: ${err.message}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Sync format changes to display correct asset sizes
  const handleFormatChange = (format: "square" | "portrait" | "reel") => {
    setActiveFormat(format);
    if (selectedPost) {
      const cleanTopic = selectedPost.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      setSelectedPost({
        ...selectedPost,
        visualUrl: `/generated-images/${cleanTopic}-${format}.png`
      });
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 32, alignItems: "start" }}>
      
      {/* LEFT COLUMN: PIPELINE TRIGGERS, CONSOLE & QUEUE */}
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        
        {/* PIPELINE CONTROL STRIP */}
        <div className="glass-panel" style={{ padding: 28, borderLeft: "2px solid #00F2FF", background: "rgba(8,8,8,0.5)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <span className="editorial-tag" style={{ color: "#00F2FF", fontSize: 9 }}>AGENT EXECUTIVE DIRECTIVES_</span>
              <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18, marginTop: 4 }}>Orchestrate Pipelines</h3>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, background: "rgba(255,255,255,0.03)", padding: "6px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="pulse-dot" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#00F2FF" }} />
                <span style={{ fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.6)" }}>AI CO-FOUNDER ACTIVE</span>
              </div>
            </div>
          </div>

          {/* CUSTOM STEERING INPUT */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 9, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8, letterSpacing: "0.05em" }}>STEER THE AI WRITER: Enter Custom Campaign Topic / Idea (Optional)</label>
            <input 
              placeholder="e.g. WhatsApp Commerce for D2C brands in India (or leave empty to generate core themes)..." 
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
                padding: "14px 16px",
                fontSize: 13,
                fontFamily: "var(--font-inter)",
                outline: "none",
                borderRadius: 4
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <button 
              onClick={triggerGeneration} 
              disabled={pipelineRunning}
              style={{
                background: "rgba(0, 242, 255, 0.05)",
                border: "1px solid #00F2FF",
                color: "#00F2FF",
                padding: "16px 24px",
                fontFamily: "var(--font-geist-mono)",
                fontWeight: 700,
                fontSize: 11,
                borderRadius: 4,
                cursor: pipelineRunning ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                transition: "0.3s"
              }}
            >
              {pipelineRunning ? <RefreshCw size={14} className="spin" /> : <Sparkles size={14} />}
              TRIGGER AI CONTENT WRITER (GEMINI)
            </button>
            
            <button 
              onClick={triggerPublishing} 
              disabled={pipelineRunning}
              style={{
                background: "rgba(0, 255, 102, 0.05)",
                border: "1px solid #00FF66",
                color: "#00FF66",
                padding: "16px 24px",
                fontFamily: "var(--font-geist-mono)",
                fontWeight: 700,
                fontSize: 11,
                borderRadius: 4,
                cursor: pipelineRunning ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                transition: "0.3s"
              }}
            >
              {pipelineRunning ? <RefreshCw size={14} className="spin" /> : <Play size={14} />}
              TRIGGER LIVE PUBLISHING ENGINE
            </button>
          </div>
        </div>

        {/* HIGH-TECH TERMINAL LOGS FEED */}
        <div className="glass-panel" style={{ padding: 24, background: "#050505", border: "1px solid rgba(0, 242, 255, 0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#00F2FF" }}>
              <Terminal size={14} />
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>AGENT OPERATIONS CONSOLE</span>
            </div>
            <span style={{ fontSize: 9, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.3)" }}>STATUS: LISTENING</span>
          </div>

          <div style={{ 
            height: 180, 
            overflowY: "auto", 
            fontFamily: "var(--font-geist-mono)", 
            fontSize: 12, 
            lineHeight: 1.6, 
            color: "#00F2FF", 
            whiteSpace: "pre-wrap", 
            background: "rgba(0,0,0,0.4)", 
            padding: 16, 
            borderRadius: 4, 
            border: "1px solid rgba(255,255,255,0.03)" 
          }}>
            {terminalLogs}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* DRAFTS CONTENT QUEUE */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h4 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18 }}>Active Content Ledger</h4>
            <button onClick={fetchPosts} className="btn-util" style={{ fontSize: 10 }}>
              <RefreshCw size={12} className={loading ? "spin" : ""} /> Sync Queue
            </button>
          </div>

          <div className="glass-panel" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <th style={{ padding: "16px 20px", textTransform: "uppercase", fontSize: 9, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.3)", textAlign: "left" }}>Topic</th>
                    <th style={{ padding: "16px 20px", textTransform: "uppercase", fontSize: 9, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.3)", textAlign: "left" }}>Platforms</th>
                    <th style={{ padding: "16px 20px", textTransform: "uppercase", fontSize: 9, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.3)", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "16px 20px", textTransform: "uppercase", fontSize: 9, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.3)", textAlign: "left" }}>Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr 
                      key={post.id} 
                      onClick={() => {
                        setSelectedPost(post);
                        setCustomPrompt(post.visualPrompt);
                      }}
                      style={{ 
                        borderBottom: "1px solid rgba(255,255,255,0.03)", 
                        background: selectedPost?.id === post.id ? "rgba(0, 242, 255, 0.02)" : "transparent",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      <td style={{ padding: "20px", verticalAlign: "middle" }}>
                        <span style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>{post.topic}</span>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                          {post.caption.substring(0, 60)}...
                        </div>
                      </td>
                      <td style={{ padding: "20px", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {post.platforms.map((p, idx) => (
                            <span 
                              key={idx} 
                              style={{ 
                                padding: "2px 8px", 
                                background: "rgba(255,255,255,0.03)", 
                                border: "1px solid rgba(255,255,255,0.05)", 
                                color: "#00F2FF", 
                                fontSize: 9, 
                                fontFamily: "var(--font-geist-mono)" 
                              }}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "20px", verticalAlign: "middle" }}>
                        <span style={{ 
                          padding: "4px 10px", 
                          background: post.status === "Published" ? "rgba(0,255,102,0.1)" : post.status === "Approved" ? "rgba(0,242,255,0.1)" : "rgba(255,255,255,0.03)", 
                          color: post.status === "Published" ? "#00FF66" : post.status === "Approved" ? "#00F2FF" : "rgba(255,255,255,0.4)", 
                          fontSize: 9, 
                          fontWeight: 800, 
                          fontFamily: "var(--font-geist-mono)" 
                        }}>
                          {post.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "20px", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#00F2FF", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}>
                          Studio Code <ChevronRight size={12} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                        No generated drafts found in Lark Base table. Trigger Content Writer to begin.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: INTERACTIVE VISUAL STUDIO */}
      <div style={{ position: "sticky", top: 120 }}>
        {selectedPost ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: 32, border: "1px solid rgba(255,255,255,0.05)" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 16, marginBottom: 24 }}>
              <div>
                <span className="editorial-tag" style={{ color: "#00F2FF", fontSize: 9 }}>INTERACTIVE CREATIVE STUDIO_</span>
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18, marginTop: 4 }}>Visual Sandbox</h3>
              </div>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>IMAGEN 3</span>
            </div>

            {/* PLATFORM RESIZE TABS */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: 4, borderRadius: 6, marginBottom: 20 }}>
              {(["square", "portrait", "reel"] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => handleFormatChange(fmt)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: activeFormat === fmt ? "rgba(0, 242, 255, 0.1)" : "transparent",
                    color: activeFormat === fmt ? "#00F2FF" : "rgba(255,255,255,0.4)",
                    border: "none",
                    borderRadius: 4,
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    transition: "0.2s"
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* INTERACTIVE DYNAMIC PREVIEW CANVAS */}
            <div style={{ 
              background: "#020202", 
              border: "1px solid rgba(255,255,255,0.05)", 
              position: "relative",
              width: "100%", 
              aspectRatio: activeFormat === "square" ? "1/1" : activeFormat === "portrait" ? "4/5" : "9/16",
              maxHeight: 380,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              borderRadius: 4
            }}>
              {isRegenerating ? (
                <div style={{ textAlign: "center", color: "#00F2FF" }}>
                  <RefreshCw className="spin" size={32} style={{ margin: "0 auto 12px" }} />
                  <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>RENDERING NEURAL CANVAS...</div>
                </div>
              ) : selectedPost.visualUrl ? (
                <img 
                  src={selectedPost.visualUrl} 
                  alt="Dynamic Render" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  onError={(e) => {
                    // Fallback to locally served preview image if absolute host URL is not active
                    const cleanTopic = selectedPost.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    e.currentTarget.src = `/generated-images/${cleanTopic}-${activeFormat}.png`;
                  }}
                />
              ) : (
                <div style={{ textAlign: "center", padding: 24, color: "rgba(255,255,255,0.3)" }}>
                  <ImageIcon size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                  <div style={{ fontSize: 12 }}>No graphic rendered yet. Hit Regenerate to run Imagen 3.</div>
                </div>
              )}
            </div>

            {/* VISUAL PROMPT CUSTOM EDITOR */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>VISUAL DESIGN SPECIFICATION</label>
              <textarea 
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                style={{
                  width: "100%",
                  height: 100,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#fff",
                  padding: 14,
                  outline: "none",
                  fontSize: 12,
                  fontFamily: "var(--font-inter)",
                  resize: "none",
                  borderRadius: 4
                }}
              />
            </div>

            {/* TRIGGER REGENERATION */}
            <button
              onClick={regenerateVisual}
              disabled={isRegenerating}
              style={{
                width: "100%",
                background: "#00F2FF",
                color: "#000",
                padding: "16px",
                border: "none",
                fontFamily: "var(--font-geist-mono)",
                fontWeight: 800,
                fontSize: 11,
                cursor: isRegenerating ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                borderRadius: 4
              }}
            >
              {isRegenerating ? <RefreshCw size={14} className="spin" /> : <ImageIcon size={14} />}
              REGENERATE GRAPHIC (GOOGLE IMAGEN 3)
            </button>

            {/* LIVE POST META */}
            <div style={{ marginTop: 24, padding: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-geist-mono)" }}>LARK INTEGRATED KEY</span>
                <span style={{ fontSize: 11, color: "#fff", fontFamily: "var(--font-geist-mono)" }}>{selectedPost.id.substring(0, 10)}...</span>
              </div>
              {selectedPost.postLink && (
                <a 
                  href={selectedPost.postLink} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 6, color: "#00F2FF", fontSize: 12, marginTop: 12, textDecoration: "none", fontWeight: 700 }}
                >
                  View live post on platform <ExternalLink size={12} />
                </a>
              )}
            </div>

          </motion.div>
        ) : (
          <div className="glass-panel" style={{ padding: 80, textAlign: "center", color: "rgba(255,255,255,0.2)" }}>
            <Cpu size={40} style={{ margin: "0 auto 16px", opacity: 0.2 }} />
            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 18, color: "#fff", marginBottom: 8 }}>Studio Offline</h3>
            <p style={{ fontSize: 12 }}>Select any draft card from the Content Queue to start the interactive editor.</p>
          </div>
        )}
      </div>

    </div>
  );
}
