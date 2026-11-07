"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface LeadMessage {
  role: "user" | "model";
  text: string;
  timestamp?: string;
}

interface LeadQualification {
  status?: "HOT" | "WARM" | "COLD" | "UNQUALIFIED";
  score?: number;
  budget_aed?: string;
  preferred_areas?: string[];
  property_type?: string;
  timeline?: string;
  golden_visa_interested?: boolean;
  agency_name?: string;
  team_size?: string;
  monthly_lead_volume?: string;
  current_pain_point?: string;
}

interface Lead {
  raw_jid: string;
  phone: string;
  display_title: string;
  formatted_phone: string;
  is_lid?: boolean;
  push_name?: string;
  last_message: string;
  qualification: LeadQualification;
  action?: string;
  human_takeover?: boolean;
  messages: LeadMessage[];
  updated_at?: string;
}

const FALLBACK_LEADS: Lead[] = [
  {
    raw_jid: "971528964833@s.whatsapp.net",
    phone: "+971 52 ••• 4833",
    display_title: "Apex Horizon Realty (18 Brokers)",
    formatted_phone: "+971 52 ••• 4833",
    last_message: "Hi, I run an agency in Business Bay with 18 brokers. We spend $12k/mo on Meta ads. Can we see a demo?",
    qualification: {
      status: "HOT",
      score: 92,
      agency_name: "Apex Horizon Realty",
      team_size: "18 brokers",
      monthly_lead_volume: "350+ inquiries/mo",
      current_pain_point: "Midnight lead loss from UK/Saudi",
      budget_aed: "AED 3.5M Avg",
      preferred_areas: ["Downtown", "Business Bay", "Dubai Hills"],
      property_type: "Off-Plan & Ready Luxury",
      timeline: "Immediate 30-Day Pilot"
    },
    human_takeover: false,
    messages: [
      {
        role: "user",
        text: "Hi, I run an agency in Business Bay with 18 brokers. We spend $12k/mo on Meta ads. Can we see a demo?",
        timestamp: "18:42"
      },
      {
        role: "model",
        text: "Excellent to connect! For Apex Horizon Realty with 18 brokers, Adyant Nexa eliminates midnight lead dropoff. We qualify inbound inquiries in 1.2s and book viewings directly into your team's calendar. Does tomorrow 2:00 PM or 5:30 PM GST work for a quick 15-min Google Meet walkthrough? (https://meet.google.com/ady-nexa-demo)",
        timestamp: "18:43"
      }
    ]
  },
  {
    raw_jid: "447891234567@s.whatsapp.net",
    phone: "+44 78 ••• 4567",
    display_title: "London Investor (Inbound Meta Ad)",
    formatted_phone: "+44 78 ••• 4567",
    last_message: "Saw your Downtown penthouse ad. Looking for 3-bed with high rental yield, budget is around 2.8M AED.",
    qualification: {
      status: "HOT",
      score: 88,
      budget_aed: "AED 2,800,000",
      preferred_areas: ["Downtown Dubai", "Dubai Marina"],
      property_type: "3-Bed Penthouse",
      timeline: "Next 30 Days",
      golden_visa_interested: true
    },
    human_takeover: false,
    messages: [
      {
        role: "user",
        text: "Saw your Downtown penthouse ad. Looking for 3-bed with high rental yield, budget is around 2.8M AED.",
        timestamp: "17:15"
      },
      {
        role: "model",
        text: "Welcome! Downtown offers exceptional 8-10% rental yields. At AED 2.8M, your purchase qualifies for the UAE 10-Year Golden Visa. Are you looking for immediate ready units or off-plan with 1% monthly payment plans?",
        timestamp: "17:15"
      }
    ]
  },
  {
    raw_jid: "966501234567@s.whatsapp.net",
    phone: "+966 50 ••• 1289",
    display_title: "Riyadh Family Office (Sobha Villas)",
    formatted_phone: "+966 50 ••• 1289",
    last_message: "نبحث عن فيلا 4 غرف في دبي هيلز أو شوبا هارتلاند بميزانية 5 مليون درهم",
    qualification: {
      status: "HOT",
      score: 95,
      budget_aed: "AED 5,000,000",
      preferred_areas: ["Dubai Hills", "Sobha Hartland II"],
      property_type: "4-Bed Luxury Villa",
      timeline: "Immediate Cash",
      golden_visa_interested: true
    },
    human_takeover: false,
    messages: [
      {
        role: "user",
        text: "نبحث عن فيلا 4 غرف في دبي هيلز أو شوبا هارتلاند بميزانية 5 مليون درهم",
        timestamp: "16:02"
      },
      {
        role: "model",
        text: "أهلاً بك! لدينا فلل حصرية جاهزة وقيد الإنشاء في شوبا هارتلاند ودبي هيلز ضمن ميزانية 5 مليون درهم مع خطط دفع مرنة وتأشيرة الإقامة الذهبية. هل تود حجز موعد لمعاينة خاصة عبر جوجل ميت غداً؟",
        timestamp: "16:03"
      }
    ]
  }
];

export default function CommandTerminalPage() {
  const [leads, setLeads] = useState<Lead[]>(FALLBACK_LEADS || []);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [filter, setFilter] = useState<"all" | "hot" | "takeover">("all");
  const [search, setSearch] = useState<string>("");
  const [composerText, setComposerText] = useState<string>("");
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);
  const [dubaiTime, setDubaiTime] = useState<string>("");
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const composerInputRef = useRef<HTMLInputElement>(null);
  const threadBoxRef = useRef<HTMLDivElement>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // Clock in Dubai (GST = UTC+4)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const gst = new Date(utc + 3600000 * 4);
      setDubaiTime(gst.toLocaleTimeString("en-GB", { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Poll Engine Leads from /api/leads (proxied to port 3050 in next.config.ts)
  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLeads(data);
          setIsLiveConnected(true);
          return;
        }
      }
    } catch {
      // Backend starting or offline - fallback leads persist
    }
    setIsLiveConnected(false);
  }, []);

  useEffect(() => {
    fetchLeads();
    const timer = setInterval(fetchLeads, 2500);
    return () => clearInterval(timer);
  }, [fetchLeads]);

  // Scroll chat to bottom on select
  useEffect(() => {
    if (threadBoxRef.current) {
      threadBoxRef.current.scrollTop = threadBoxRef.current.scrollHeight;
    }
  }, [selectedIdx, leads]);

  // Filtered list
  const filteredLeads = leads.filter((lead) => {
    if (filter === "hot" && (lead.qualification?.score || 0) < 80) return false;
    if (filter === "takeover" && !lead.human_takeover) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const title = (lead.display_title || "").toLowerCase();
    const phone = (lead.formatted_phone || lead.phone || "").toLowerCase();
    const lastMsg = (lead.last_message || "").toLowerCase();
    const areas = (lead.qualification?.preferred_areas || []).join(" ").toLowerCase();
    return title.includes(q) || phone.includes(q) || lastMsg.includes(q) || areas.includes(q);
  });

  const currentLead: Lead | undefined = filteredLeads[selectedIdx] || filteredLeads[0];

  // Actions
  const handleSendMessage = async () => {
    if (!composerText.trim() || !currentLead) return;
    const text = composerText.trim();
    setComposerText("");
    notify("Dispatching to lead via WhatsApp...");

    const newMsg: LeadMessage = {
      role: "model",
      text: text,
      timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    };

    // Update local state immediately for interactive demo
    setLeads((prev) =>
      prev.map((l) =>
        l.raw_jid === currentLead.raw_jid
          ? { ...l, last_message: text, messages: [...l.messages, newMsg] }
          : l
      )
    );

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jid: currentLead.raw_jid, text }),
      });
      if (res.ok) {
        notify("✓ Message delivered to investor");
        fetchLeads();
      } else {
        notify("Demo Mode: Message delivered in simulated session");
      }
    } catch {
      notify("Demo Mode: Message delivered in simulated session");
    }
  };

  const handleToggleTakeover = async () => {
    if (!currentLead) return;
    const nextState = !currentLead.human_takeover;

    // Toggle local state immediately
    setLeads((prev) =>
      prev.map((l) =>
        l.raw_jid === currentLead.raw_jid ? { ...l, human_takeover: nextState } : l
      )
    );
    notify(nextState ? "Human Operator In Control (AI Paused)" : "AI Supervision Resumed");

    try {
      const res = await fetch("/api/toggle-takeover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jid: currentLead.raw_jid }),
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch {
      // Offline fallback state already applied
    }
  };

  const handleSendBrief = async () => {
    if (!currentLead) return;
    notify("Dispatching Luxury Agency Architecture Brief...");

    const briefMsg: LeadMessage = {
      role: "model",
      text: "[Automated Dispatch] Sent 'Adyant Nexa Real Estate AI Architecture Dossier (PDF)' to investor WhatsApp.",
      timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    };

    setLeads((prev) =>
      prev.map((l) =>
        l.raw_jid === currentLead.raw_jid
          ? { ...l, messages: [...l.messages, briefMsg] }
          : l
      )
    );

    try {
      const res = await fetch("/api/dispatch-brochure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jid: currentLead.raw_jid }),
      });
      if (res.ok) {
        notify("✓ Agency Brief dispatched on WhatsApp");
        fetchLeads();
      }
    } catch {
      notify("Demo Mode: Architecture Brief dispatched to chat");
    }
  };

  const handleSendMeet = async () => {
    if (!currentLead) return;
    notify("Generating Google Meet 15-Min Strategy Invitation...");

    const meetMsg: LeadMessage = {
      role: "model",
      text: "[Calendar Slot Confirmed] 15-Minute Strategy Walkthrough invitation generated: https://meet.google.com/ady-nexa-demo",
      timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    };

    setLeads((prev) =>
      prev.map((l) =>
        l.raw_jid === currentLead.raw_jid
          ? { ...l, messages: [...l.messages, meetMsg] }
          : l
      )
    );

    try {
      const res = await fetch("/api/schedule-meet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jid: currentLead.raw_jid }),
      });
      if (res.ok) {
        notify("✓ Google Meet invite sent on WhatsApp");
        fetchLeads();
      }
    } catch {
      notify("Demo Mode: Google Meet link generated in chat");
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === "Escape") (e.target as HTMLElement).blur();
        return;
      }

      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.min(filteredLeads.length - 1, prev + 1));
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        handleToggleTakeover();
      } else if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        handleSendBrief();
      } else if (e.key === "m" || e.key === "M" || e.key === "v" || e.key === "V") {
        e.preventDefault();
        handleSendMeet();
      } else if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        setInspectorOpen((prev) => !prev);
      } else if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredLeads.length, handleToggleTakeover, handleSendBrief, handleSendMeet]);

  const countAll = leads.length;
  const countHot = leads.filter((l) => (l.qualification?.score || 0) >= 80).length;
  const countTakeover = leads.filter((l) => l.human_takeover).length;

  return (
    <div className="terminal-wrapper">
      <style jsx global>{`
        :root {
          --term-bg: #0A0A0E;
          --term-surface: #121218;
          --term-card: #181822;
          --term-border: rgba(255, 255, 255, 0.08);
          --term-border-active: #0047FF;
          --term-text: #F8F9FA;
          --term-muted: #8E8EA0;
          --term-cobalt: #0047FF;
          --term-cyan: #00F2FF;
          --term-emerald: #10B981;
          --term-amber: #F59E0B;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; outline: none; }
        body { background: var(--term-bg); color: var(--term-text); overflow: hidden; }

        .terminal-wrapper {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--term-bg);
          font-family: var(--font-inter), -apple-system, sans-serif;
          font-size: 13px;
        }

        /* Top Bar */
        .term-top-bar {
          height: 48px;
          background: var(--term-surface);
          border-bottom: 1px solid var(--term-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          flex-shrink: 0;
          z-index: 50;
        }
        .term-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .term-logo-img {
          width: 22px;
          height: 22px;
          object-fit: contain;
        }
        .term-brand-name {
          font-family: var(--font-syne), sans-serif;
          font-size: 13px;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }
        .term-brand-name span { color: var(--term-cyan); }
        .term-badge {
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(0, 242, 255, 0.1);
          color: var(--term-cyan);
          border: 1px solid rgba(0, 242, 255, 0.25);
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .term-telemetry {
          display: flex;
          align-items: center;
          gap: 20px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          color: var(--term-muted);
        }
        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--term-emerald);
          box-shadow: 0 0 8px var(--term-emerald);
          display: inline-block;
          margin-right: 6px;
        }
        .kbd-pill {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          padding: 1px 6px;
          border-radius: 4px;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 600;
        }

        /* Main Workspace 3-Grid */
        .term-body {
          flex: 1;
          display: grid;
          grid-template-columns: 220px 330px 1fr;
          overflow: hidden;
        }

        /* Col 1: Filters Sidebar */
        .col-sidebar {
          background: var(--term-surface);
          border-right: 1px solid var(--term-border);
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .side-title {
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: var(--term-muted);
          text-transform: uppercase;
          margin-bottom: 12px;
          padding-left: 8px;
        }
        .filter-btn {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          color: var(--term-muted);
          padding: 9px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.15s ease;
          margin-bottom: 4px;
        }
        .filter-btn:hover { background: rgba(255, 255, 255, 0.04); color: #FFF; }
        .filter-btn.active { background: rgba(0, 71, 255, 0.18); color: var(--term-cyan); font-weight: 600; }
        .filter-cnt {
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          background: rgba(255, 255, 255, 0.08);
          padding: 2px 6px;
          border-radius: 999px;
          color: #FFF;
        }

        /* Col 2: Feed */
        .col-feed {
          background: var(--term-bg);
          border-right: 1px solid var(--term-border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .feed-search-box {
          padding: 12px 14px;
          border-bottom: 1px solid var(--term-border);
          position: relative;
        }
        .feed-input {
          width: 100%;
          background: var(--term-surface);
          border: 1px solid var(--term-border);
          border-radius: 8px;
          padding: 8px 12px;
          color: #FFF;
          font-size: 12px;
        }
        .feed-input:focus { border-color: var(--term-cobalt); }
        .feed-list {
          flex: 1;
          overflow-y: auto;
        }
        .lead-card {
          padding: 14px;
          border-bottom: 1px solid var(--term-border);
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .lead-card:hover { background: rgba(255, 255, 255, 0.02); }
        .lead-card.selected {
          background: rgba(0, 71, 255, 0.1);
          border-left: 3px solid var(--term-cyan);
        }
        .lead-card-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 4px;
        }
        .lead-card-name { font-weight: 600; color: #FFF; font-size: 13px; }
        .lead-card-score {
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          color: var(--term-cyan);
          background: rgba(0, 242, 255, 0.12);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .lead-card-preview {
          font-size: 12px;
          color: var(--term-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 6px;
        }
        .lead-card-tags {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          color: #94A3B8;
        }

        /* Col 3: Canvas + Inspector */
        .col-canvas-wrap {
          display: flex;
          flex: 1;
          overflow: hidden;
          background: var(--term-surface);
        }
        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-right: 1px solid var(--term-border);
        }
        .chat-header {
          padding: 12px 20px;
          border-bottom: 1px solid var(--term-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(18, 18, 24, 0.8);
          backdrop-filter: blur(10px);
        }
        .chat-client-title { font-size: 14px; font-weight: 700; color: #FFF; }
        .chat-client-phone { font-family: var(--font-geist-mono), monospace; font-size: 11px; color: var(--term-muted); }

        .chat-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .term-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--term-border);
          color: #FFF;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
        }
        .term-btn:hover { background: rgba(255, 255, 255, 0.12); }
        .term-btn-primary {
          background: var(--term-cobalt);
          border-color: var(--term-cobalt);
          color: #FFF;
        }
        .term-btn-primary:hover { background: #0038D1; }
        .term-btn-takeover-active {
          background: #DC2626;
          border-color: #DC2626;
          color: #FFF;
        }

        .chat-stream {
          flex: 1;
          overflow-y: auto;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .msg-row {
          display: flex;
          flex-direction: column;
          max-width: 75%;
        }
        .msg-row.user { align-self: flex-start; }
        .msg-row.model { align-self: flex-end; }
        .msg-label {
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          color: var(--term-muted);
          margin-bottom: 4px;
          display: flex;
          gap: 8px;
        }
        .msg-bubble {
          padding: 12px 16px;
          border-radius: 12px;
          line-height: 1.5;
          font-size: 13px;
        }
        .msg-row.user .msg-bubble {
          background: var(--term-card);
          color: #FFF;
          border: 1px solid var(--term-border);
          border-top-left-radius: 2px;
        }
        .msg-row.model .msg-bubble {
          background: #0036C7;
          color: #FFF;
          border-top-right-radius: 2px;
        }

        .chat-composer {
          padding: 14px 20px;
          border-top: 1px solid var(--term-border);
          background: var(--term-surface);
        }
        .composer-input-row {
          display: flex;
          gap: 8px;
        }
        .composer-input {
          flex: 1;
          background: var(--term-bg);
          border: 1px solid var(--term-border);
          border-radius: 8px;
          padding: 10px 14px;
          color: #FFF;
          font-size: 13px;
        }
        .composer-input:focus { border-color: var(--term-cobalt); }

        /* Dossier Inspector */
        .col-inspector {
          width: 290px;
          background: var(--term-surface);
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .dossier-card {
          background: var(--term-card);
          border: 1px solid var(--term-border);
          border-radius: 10px;
          padding: 16px;
        }
        .dossier-lbl {
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          color: var(--term-muted);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .dossier-val {
          font-size: 14px;
          font-weight: 600;
          color: #FFF;
        }

        /* Toast */
        .toast-banner {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: rgba(18, 18, 24, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid var(--term-cyan);
          color: #FFF;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          z-index: 100;
          font-family: var(--font-geist-mono), monospace;
        }
      `}</style>

      {/* Top Header */}
      <header className="term-top-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/" className="term-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Adyant Nexa Logo" className="term-logo-img" />
            <div className="term-brand-name">
              ADYANT <span>NEXA.</span>
            </div>
          </Link>
          <span className="term-badge">LIVE DEMO TERMINAL // CLIENT SHOWCASE</span>
        </div>

        <div className="term-telemetry">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="live-dot" style={{ background: isLiveConnected ? "#10B981" : "#00F2FF" }} />
            <span>{isLiveConnected ? "LIVE ENGINE CONNECTED" : "INTERACTIVE DEMO SIMULATOR"}</span>
          </div>
          <div>📍 {dubaiTime || "Dubai GST"}</div>
          <a
            href="https://wa.me/?text=Hi%2C%20I%20tested%20the%20Adyant%20Nexa%20demo%20terminal%20and%20want%20to%20deploy%20this%20for%20my%20agency."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "var(--term-cobalt)",
              color: "#FFFFFF",
              padding: "5px 14px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            Deploy For Agency ↗
          </a>
          <Link href="/" style={{ color: "var(--term-cyan)", textDecoration: "none" }}>
            ← Back
          </Link>
        </div>
      </header>

      {/* Main 3-Column Cockpit */}
      <div className="term-body">
        {/* Column 1: Filters & Nav */}
        <aside className="col-sidebar">
          <div>
            <div className="side-title">INQUIRY FEEDS</div>
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              <span>All Inbound</span>
              <span className="filter-cnt">{countAll}</span>
            </button>
            <button
              className={`filter-btn ${filter === "hot" ? "active" : ""}`}
              onClick={() => setFilter("hot")}
            >
              <span>🔥 Hot Leads (BANT 80+)</span>
              <span className="filter-cnt">{countHot}</span>
            </button>
            <button
              className={`filter-btn ${filter === "takeover" ? "active" : ""}`}
              onClick={() => setFilter("takeover")}
            >
              <span>⚡ Human Takeover</span>
              <span className="filter-cnt">{countTakeover}</span>
            </button>

            <div className="side-title" style={{ marginTop: 28 }}>
              CHANNELS
            </div>
            <div style={{ padding: "4px 12px", color: "var(--term-muted)", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
              <span className="live-dot" /> WhatsApp Business
            </div>
            <div style={{ padding: "4px 12px", color: "var(--term-muted)", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
              <span className="live-dot" style={{ background: "#38BDF8" }} /> Meta Direct / Ads
            </div>
            <div style={{ padding: "4px 12px", color: "var(--term-muted)", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
              <span className="live-dot" style={{ background: "#EC4899" }} /> Instagram DM
            </div>
          </div>

          <div>
            <div className="side-title">KEYBOARD SHORTCUTS</div>
            <div style={{ color: "var(--term-muted)", fontSize: 11, lineHeight: 1.8 }}>
              <div><span className="kbd-pill">J</span> / <span className="kbd-pill">K</span> Next/Prev</div>
              <div><span className="kbd-pill">T</span> Toggle Takeover</div>
              <div><span className="kbd-pill">M</span> Send Google Meet</div>
              <div><span className="kbd-pill">B</span> Send Brief</div>
              <div><span className="kbd-pill">/</span> Search Leads</div>
            </div>
          </div>
        </aside>

        {/* Column 2: Leads List */}
        <section className="col-feed">
          <div className="feed-search-box">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search investor, area, budget... (/)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="feed-input"
            />
          </div>

          <div className="feed-list">
            {filteredLeads.map((lead, idx) => {
              const isSelected = lead.raw_jid === currentLead?.raw_jid;
              const q = lead.qualification || {};
              const score = q.score || 85;
              const areas = (q.preferred_areas && q.preferred_areas[0]) || "Downtown";
              const budget = q.budget_aed || "AED 2M+";

              return (
                <div
                  key={lead.raw_jid || idx}
                  className={`lead-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedIdx(idx)}
                >
                  <div className="lead-card-top">
                    <span className="lead-card-name">{lead.display_title || lead.formatted_phone}</span>
                    <span className="lead-card-score">{score}/100</span>
                  </div>
                  <div className="lead-card-preview">{lead.last_message}</div>
                  <div className="lead-card-tags">
                    <span>{areas}</span>
                    <span>·</span>
                    <span style={{ color: "var(--term-cyan)" }}>{budget}</span>
                    {lead.human_takeover && (
                      <span style={{ color: "#EF4444", fontWeight: 700 }}>· HUMAN</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Column 3: Chat Area + Inspector */}
        <main className="col-canvas-wrap">
          <div className="chat-area">
            {/* Chat Header */}
            <div className="chat-header">
              <div>
                <div className="chat-client-title">
                  {currentLead?.display_title || "Verified Dubai Investor"}
                </div>
                <div className="chat-client-phone">
                  {currentLead?.formatted_phone || currentLead?.phone} · WhatsApp Verified · <span style={{ color: "var(--term-cyan)", fontSize: "10px", letterSpacing: "0.08em" }}>[DEMO SHOWCASE MASKED]</span>
                </div>
              </div>

              <div className="chat-actions">
                <button
                  className={`term-btn ${currentLead?.human_takeover ? "term-btn-takeover-active" : ""}`}
                  onClick={handleToggleTakeover}
                >
                  <span>{currentLead?.human_takeover ? "Resume AI" : "Takeover"}</span>
                  <span className="kbd-pill">T</span>
                </button>
                <button className="term-btn" onClick={handleSendBrief}>
                  <span>Agency Brief</span> <span className="kbd-pill">B</span>
                </button>
                <button className="term-btn term-btn-primary" onClick={handleSendMeet}>
                  <span>Google Meet</span> <span className="kbd-pill">M</span>
                </button>
                <button className="term-btn" onClick={() => setInspectorOpen((prev) => !prev)}>
                  <span>Dossier</span> <span className="kbd-pill">D</span>
                </button>
              </div>
            </div>

            {/* Chat Stream */}
            <div ref={threadBoxRef} className="chat-stream">
              {(currentLead?.messages || []).map((msg, i) => {
                const isModel = msg.role === "model";
                return (
                  <div key={i} className={`msg-row ${isModel ? "model" : "user"}`}>
                    <div className="msg-label">
                      <span>{isModel ? "Adyant Nexa AI" : currentLead?.display_title || "Lead"}</span>
                      <span>{msg.timestamp || ""}</span>
                    </div>
                    <div className="msg-bubble">{msg.text}</div>
                  </div>
                );
              })}
            </div>

            {/* Composer */}
            <div className="chat-composer">
              <div className="composer-input-row">
                <input
                  ref={composerInputRef}
                  type="text"
                  placeholder="Reply directly to this lead on WhatsApp... (Press Enter to Send)"
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  className="composer-input"
                />
                <button className="term-btn term-btn-primary" onClick={handleSendMessage}>
                  Send ↗
                </button>
              </div>
            </div>
          </div>

          {/* Dossier Inspector Panel */}
          {inspectorOpen && currentLead && (
            <aside className="col-inspector">
              <div className="side-title">BUYER DOSSIER // BANT TELEMETRY</div>

              <div className="dossier-card">
                <div className="dossier-lbl">QUALIFICATION SCORE</div>
                <div className="dossier-val" style={{ color: "var(--term-cyan)", fontSize: 18 }}>
                  {currentLead.qualification?.status || "HOT"} · {currentLead.qualification?.score || 85}/100
                </div>
              </div>

              <div className="dossier-card">
                <div className="dossier-lbl">VERIFIED BUDGET</div>
                <div className="dossier-val">
                  {currentLead.qualification?.budget_aed || "AED 2,500,000"}
                </div>
              </div>

              <div className="dossier-card">
                <div className="dossier-lbl">TARGET AREAS</div>
                <div className="dossier-val">
                  {(currentLead.qualification?.preferred_areas || ["Downtown Dubai"]).join(", ")}
                </div>
              </div>

              <div className="dossier-card">
                <div className="dossier-lbl">PROPERTY INTENT</div>
                <div className="dossier-val">
                  {currentLead.qualification?.property_type || "Luxury Residential / Golden Visa"}
                </div>
              </div>

              <div className="dossier-card">
                <div className="dossier-lbl">PRIMARY CTA</div>
                <div className="dossier-val" style={{ fontSize: 12, color: "#10B981" }}>
                  15-Min Google Meet Strategy Call
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: "var(--term-muted)", wordBreak: "break-all" }}>
                  https://meet.google.com/ady-nexa-demo
                </div>
              </div>
            </aside>
          )}
        </main>
      </div>

      {/* Toast Notification */}
      {toast && <div className="toast-banner">{toast}</div>}
    </div>
  );
}
