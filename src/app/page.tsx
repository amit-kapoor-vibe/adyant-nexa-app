"use client";

import Link from "next/link";
import { SYSTEM_PILLARS, FLEET_PORTFOLIO } from "@/data/fleetData";
import { RoiYieldCalculator } from "@/components/roi/RoiYieldCalculator";
import { MidnightLeakageDiagnostic } from "@/components/diagnostic/MidnightLeakageDiagnostic";
import { CalendlyBadge } from "@/components/CalendlyBadge";

const SYSTEM_DELIVERABLES = [
  {
    num: "01",
    title: "Official WhatsApp Cloud API",
    desc: "Direct integration via Meta Cloud API with high throughput and zero disconnection. Runs 24/7 independently of individual broker devices."
  },
  {
    num: "02",
    title: "Sub-90s BANT Qualification",
    desc: "Autonomous screening of buyer budget (AED 2M+), preferred towers/areas, and Golden Visa eligibility in fluent Arabic, English, or Urdu."
  },
  {
    num: "03",
    title: "Centralized Pipeline CRM",
    desc: "Real-time dashboard tracking inquiry velocity, lead status (Hot, Viewing Scheduled), and verified buyer dossiers accessible by principals."
  },
  {
    num: "04",
    title: "1-Click Human Broker Takeover",
    desc: "Live supervision cockpit with full transcripts. Senior brokers can seamlessly pause AI and take over conversations instantly on WhatsApp."
  },
  {
    num: "05",
    title: "Calendar & Viewing Scheduling",
    desc: "Automated booking of Google Meet strategy walkthroughs and private on-site viewings synced directly into senior brokers' calendars."
  },
  {
    num: "06",
    title: "Automated Follow-ups & Nurturing",
    desc: "Intelligent re-engagement sequences that follow up with overseas leads, sending updated developer brochures and 1% monthly payment plans."
  },
  {
    num: "07",
    title: "Weekly Telemetry & Reporting",
    desc: "Attribution reports detailing Meta ad spend efficiency, Cost Per Qualified Viewing, and midnight overseas lead recovery metrics."
  },
  {
    num: "08",
    title: "Continuous Developer Ingestion",
    desc: "Ongoing prompt tuning and catalog ingestion for newly launched off-plan and luxury projects across your agency's developer inventory."
  }
];

export default function AdyantNexaRealEstateOS() {

  return (
    <main id="main-content" className="an-page-wrapper">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <style jsx global>{`
        :root {
          --alabaster: #F8F8FA;
          --pure-white: #FFFFFF;
          --onyx: #0A0A0C;
          --cobalt: #0047FF;
          --slate: #60606A;
          --blue-tint: #E7ECFF;
          --cyan-bright: #38BDF8;
          --border-light: rgba(10, 10, 12, 0.08);
          --border-dark: rgba(255, 255, 255, 0.1);
        }

        /* Accessibility Skip Link & Focus Rings */
        .skip-link {
          position: fixed;
          top: -120px;
          left: 20px;
          background: var(--onyx);
          color: var(--pure-white);
          padding: 12px 20px;
          border-radius: 9999px;
          border: 2px solid var(--cobalt);
          font-family: var(--font-geist-mono), monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-decoration: none;
          z-index: 99999;
          box-shadow: 0 8px 24px rgba(0, 71, 255, 0.25);
          transition: top 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .skip-link:focus {
          top: 16px;
        }

        :focus-visible {
          outline: 2px solid var(--cobalt);
          outline-offset: 3px;
        }

        .an-page-wrapper {
          background-color: var(--alabaster);
          color: var(--onyx);
          font-family: var(--font-inter), -apple-system, sans-serif;
          overflow-x: hidden;
          line-height: 1.5;
          min-height: 100vh;
          position: relative;
        }

        /* Top Utility Header */
        .top-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 48px;
          background: rgba(248, 248, 250, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-light);
        }
        .brand-group {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .brand-logo-img {
          height: 30px;
          width: auto;
          object-fit: contain;
        }
        .brand-logo-fallback {
          font-family: var(--font-syne), sans-serif;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--onyx);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .brand-logo-fallback span {
          color: var(--cobalt);
        }

        .nav-center {
          display: flex;
          align-items: center;
          gap: 32px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }
        .nav-center a {
          color: var(--slate);
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .nav-center a:hover { color: var(--onyx); }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .btn-pill-secondary {
          font-family: var(--font-inter), sans-serif;
          font-size: 12px;
          font-weight: 600;
          padding: 9px 18px;
          border-radius: 999px;
          background: transparent;
          border: 1px solid rgba(10, 10, 12, 0.18);
          color: var(--onyx);
          text-decoration: none;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
        }
        .btn-pill-secondary:hover {
          background: var(--onyx);
          color: var(--pure-white);
        }
        .btn-pill-primary {
          font-family: var(--font-inter), sans-serif;
          font-size: 12px;
          font-weight: 600;
          padding: 9px 20px;
          border-radius: 999px;
          background: var(--onyx);
          border: 1px solid var(--onyx);
          color: var(--pure-white);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .btn-pill-primary:hover {
          background: var(--cobalt);
          border-color: var(--cobalt);
        }

        /* Hero Section */
        .hero-wrap {
          position: relative;
          max-width: 1300px;
          margin: 0 auto;
          padding: 132px 48px 80px;
          overflow: hidden;
        }

        .ghost-watermark-card {
          position: absolute;
          right: -10px;
          bottom: -15px;
          font-family: var(--font-syne), sans-serif;
          font-weight: 800;
          font-size: clamp(5rem, 12vw, 9rem);
          line-height: 0.8;
          color: rgba(255, 255, 255, 0.035);
          user-select: none;
          pointer-events: none;
          letter-spacing: -0.04em;
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 980px;
        }

        .meta-pills {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }
        .tag-mono {
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--cobalt);
          padding: 4px 12px;
          background: var(--blue-tint);
          border-radius: 4px;
        }
        .tag-location {
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--slate);
        }

        .hero-h1 {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(2.8rem, 6.2vw, 5.2rem);
          font-weight: 800;
          line-height: 1.04;
          letter-spacing: -0.025em;
          color: var(--onyx);
          margin-bottom: 24px;
        }
        .hero-h1 em {
          font-family: var(--font-display), serif;
          font-style: italic;
          font-weight: 400;
          color: var(--cobalt);
          display: block;
          margin-top: 4px;
          letter-spacing: -0.01em;
        }

        .hero-sub {
          font-size: clamp(16px, 1.8vw, 19px);
          color: var(--slate);
          max-width: 680px;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .cta-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 72px;
        }
        .btn-cta-lg {
          font-size: 14px;
          padding: 14px 28px;
          border-radius: 999px;
        }

        /* Dual Showcase Grid */
        .showcase-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 32px;
          align-items: stretch;
          margin-top: 20px;
        }

        .arch-card {
          background: var(--pure-white);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 4px 24px rgba(10, 10, 12, 0.04);
        }
        .arch-tagline {
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--slate);
          margin-bottom: 16px;
        }
        .arch-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: var(--onyx);
          letter-spacing: -0.02em;
          margin-bottom: 16px;
          line-height: 1.25;
          text-wrap: balance;
        }
        .arch-body {
          font-size: 15px;
          color: var(--slate);
          line-height: 1.65;
          margin-bottom: 32px;
        }
        .metric-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid var(--border-light);
        }
        .metric-num {
          font-family: var(--font-syne), sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: var(--cobalt);
        }
        .metric-desc {
          font-size: 12px;
          color: var(--slate);
          margin-top: 2px;
          line-height: 1.4;
        }

        /* Right Card: Device WhatsApp Terminal */
        .device-card {
          background: var(--onyx);
          border-radius: 20px;
          padding: 32px;
          color: var(--pure-white);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .device-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--border-dark);
          margin-bottom: 24px;
        }
        .device-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .live-indicator {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 10px #10B981;
        }
        .device-status {
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: var(--blue-tint);
        }

        .msg-stream {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }
        .chat-bubble-inbound {
          background: #18181D;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 13px;
          line-height: 1.5;
          color: #E2E8F0;
          max-width: 90%;
          align-self: flex-start;
        }
        .chat-bubble-ai {
          background: #00227A;
          border: 1px solid rgba(0, 71, 255, 0.4);
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 13px;
          line-height: 1.5;
          color: #FFFFFF;
          max-width: 92%;
          align-self: flex-end;
        }
        .chat-author {
          font-size: 10px;
          font-family: var(--font-geist-mono), monospace;
          color: var(--blue-tint);
          margin-bottom: 4px;
        }

        .bant-preview-pill {
          background: #141419;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
        }
        .bant-score {
          font-weight: 700;
          color: #34D399;
        }

        /* Hero Media Showcase */
        .hero-media-showcase {
          margin-top: 10px;
          margin-bottom: 60px;
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--border-light);
          box-shadow: 0 16px 48px rgba(10, 10, 12, 0.07);
        }
        .hero-image-frame {
          position: relative;
          height: 480px;
          width: 100%;
          overflow: hidden;
          background: var(--onyx);
        }
        .hero-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 36%;
          transform: scale(1.02);
          transition: transform 0.6s ease;
        }
        .hero-image-frame:hover .hero-main-img {
          transform: scale(1.04);
        }
        .hero-img-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(10,10,12,0.15) 0%, rgba(10,10,12,0.4) 50%, rgba(10,10,12,0.85) 100%);
        }

        .glass-badge-top {
          position: absolute;
          top: 24px;
          left: 24px;
          background: rgba(10, 10, 12, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          padding: 7px 16px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 5;
        }
        .pulse-dot-green {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
        }
        .glass-card-bottom-left {
          position: absolute;
          bottom: 28px;
          left: 28px;
          background: rgba(10, 10, 12, 0.82);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 14px;
          padding: 18px 24px;
          color: #FFFFFF;
          max-width: 400px;
          z-index: 5;
        }
        .glass-tag {
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #93C5FD;
          margin-bottom: 5px;
        }
        .glass-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .glass-meta {
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .glass-card-bottom-right {
          position: absolute;
          bottom: 28px;
          right: 28px;
          background: rgba(10, 10, 12, 0.82);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 14px;
          padding: 18px 24px;
          text-align: right;
          color: #FFFFFF;
          z-index: 5;
        }
        .glass-metric {
          font-family: var(--font-syne), sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #60A5FA;
        }
        .glass-metric-sub {
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 2px;
          letter-spacing: 0.1em;
        }

        /* Section: Editorial Pillars */
        .section-editorial {
          max-width: 1300px;
          margin: 0 auto;
          padding: 100px 48px;
        }
        .section-head-wrap {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 64px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-light);
        }
        .section-h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: var(--onyx);
          text-wrap: balance;
        }
        .section-h2 em {
          font-family: var(--font-display), serif;
          font-style: italic;
          font-weight: 400;
          color: var(--cobalt);
          display: block;
          margin-top: 6px;
        }

        .pillar-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .pillar-box {
          background: var(--pure-white);
          border: 1px solid var(--border-light);
          border-radius: 14px;
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.2s ease;
        }
        .pillar-box:hover {
          border-color: var(--cobalt);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 71, 255, 0.08);
        }
        .pillar-index {
          font-family: var(--font-geist-mono), monospace;
          font-size: 12px;
          color: var(--cobalt);
          font-weight: 600;
          margin-bottom: 24px;
        }
        .pillar-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: var(--onyx);
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .pillar-text {
          font-size: 14px;
          color: var(--slate);
          line-height: 1.6;
        }
        .pillar-img-box {
          width: 100%;
          height: 190px;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 22px;
          position: relative;
          background: var(--onyx);
        }
        .pillar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .pillar-box:hover .pillar-img {
          transform: scale(1.05);
        }

        /* Section: Dubai Developer Fleet Portfolio */
        .section-portfolio {
          max-width: 1300px;
          margin: 0 auto 100px;
          padding: 0 48px;
        }
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-top: 40px;
        }
        .portfolio-card {
          background: var(--pure-white);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(10, 10, 12, 0.03);
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
        }
        .portfolio-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 71, 255, 0.1);
          border-color: var(--cobalt);
        }
        .portfolio-img-wrap {
          height: 220px;
          width: 100%;
          position: relative;
          overflow: hidden;
          background: var(--onyx);
        }
        .portfolio-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .portfolio-card:hover .portfolio-img-wrap img {
          transform: scale(1.06);
        }
        .portfolio-dev-pill {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(10, 10, 12, 0.85);
          backdrop-filter: blur(8px);
          color: #FFFFFF;
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          padding: 5px 12px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .portfolio-card-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
        }
        .portfolio-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: var(--onyx);
          margin-bottom: 6px;
        }
        .portfolio-specs {
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          color: var(--cobalt);
          font-weight: 600;
          margin-bottom: 12px;
          letter-spacing: 0.05em;
        }
        .portfolio-desc {
          font-size: 13px;
          color: var(--slate);
          line-height: 1.55;
        }

        /* Section 3: Interactive Agency ROI Model */
        .roi-section {
          background: #0A0A0C;
          color: #FFFFFF;
          padding: 80px 48px;
          border-radius: 28px;
          max-width: 1260px;
          margin: 0 auto 100px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(10, 10, 12, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .roi-badge {
          display: inline-block;
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(0, 71, 255, 0.18);
          border: 1px solid rgba(0, 71, 255, 0.4);
          color: #60A5FA;
          margin-bottom: 20px;
        }
        .roi-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .roi-h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(2.2rem, 4vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.15;
          margin-bottom: 20px;
          color: #FFFFFF !important;
        }
        .roi-h2-title {
          display: block;
          color: #FFFFFF !important;
        }
        .roi-h2-accent {
          display: block;
          margin-top: 6px;
          font-family: var(--font-display), serif;
          font-style: italic;
          font-weight: 400;
          background: linear-gradient(135deg, #00F2FF 0%, #38BDF8 40%, #60A5FA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .roi-sub {
          font-size: 15px;
          color: #94A3B8;
          line-height: 1.65;
          margin-bottom: 32px;
          max-width: 520px;
        }
        .roi-cta-btn {
          background: var(--cobalt) !important;
          border-color: var(--cobalt) !important;
          color: #FFFFFF !important;
          padding: 14px 28px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.05em;
          box-shadow: 0 10px 30px rgba(0, 71, 255, 0.35);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .roi-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(0, 71, 255, 0.5);
        }
        .slider-container {
          background: #121217;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 36px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
        }
        .slider-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 20px;
        }
        .slider-lbl {
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #94A3B8;
        }
        .slider-val {
          font-family: var(--font-syne), sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #FFFFFF;
        }
        .styled-range {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #272730;
          outline: none;
          -webkit-appearance: none;
          margin-bottom: 32px;
        }
        .styled-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--cobalt);
          border: 3px solid #FFFFFF;
          cursor: pointer;
          box-shadow: 0 0 16px rgba(0, 71, 255, 0.6);
        }
        .result-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .result-num {
          font-family: var(--font-syne), sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: #FFFFFF;
        }
        .result-lbl {
          font-size: 12px;
          color: #94A3B8;
          margin-top: 6px;
          line-height: 1.4;
        }

        /* Footer */
        .site-footer {
          border-top: 1px solid var(--border-light);
          background: var(--pure-white);
          padding: 72px 48px 40px;
        }
        .footer-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 28px;
        }
        .footer-brand-emblem {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .footer-logo-img {
          width: 72px;
          height: 72px;
          object-fit: contain;
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(0, 71, 255, 0.08);
          border: 1px solid rgba(10, 10, 12, 0.06);
        }
        .footer-brand-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--onyx);
        }
        .footer-brand-title span { color: var(--cobalt); }
        .footer-brand-sub {
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          color: var(--slate);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .footer-links {
          display: flex;
          align-items: center;
          gap: 16px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          color: var(--slate);
        }
        .footer-links a {
          color: var(--onyx);
          text-decoration: none;
          transition: color 0.15s ease;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          padding: 0 4px;
        }
        .footer-links a:hover { color: var(--cobalt); }
        .footer-meta-bar {
          width: 100%;
          padding-top: 24px;
          border-top: 1px solid var(--border-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: var(--slate);
        }

        /* Deliverables Section */
        .section-deliverables {
          max-width: 1300px;
          margin: 0 auto;
          padding: 80px 48px;
        }
        .deliverables-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .deliverable-card {
          background: var(--pure-white);
          border: 1px solid var(--border-light);
          border-radius: 14px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.2s ease;
        }
        .deliverable-card:hover {
          border-color: var(--cobalt);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 71, 255, 0.06);
        }
        .deliverable-num {
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          color: var(--cobalt);
          font-weight: 700;
          margin-bottom: 16px;
        }
        .deliverable-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: var(--onyx);
          letter-spacing: -0.01em;
          margin-bottom: 8px;
        }
        .deliverable-desc {
          font-size: 13px;
          color: var(--slate);
          line-height: 1.55;
        }

        /* Founding 3 Offer Box */
        .section-founding {
          max-width: 1300px;
          margin: 0 auto;
          padding: 40px 48px 100px;
        }
        .founding-card {
          background: var(--onyx);
          color: var(--pure-white);
          border-radius: 24px;
          padding: 60px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(10, 10, 12, 0.25);
        }
        .founding-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.9fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 10;
        }
        .founding-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(0, 242, 255, 0.1);
          border: 1px solid rgba(0, 242, 255, 0.3);
          border-radius: 999px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          color: #00F2FF;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .founding-h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #FFFFFF;
          margin-bottom: 16px;
        }
        .founding-sub {
          font-size: 15px;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 28px;
          max-width: 580px;
        }
        .founding-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
        }
        .founding-feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #E2E8F0;
        }
        .founding-pricing-box {
          background: #121218;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 36px 32px;
          text-align: center;
        }
        .founding-price-tag {
          font-family: var(--font-syne), sans-serif;
          font-size: 40px;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .founding-price-sub {
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          color: #94A3B8;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 8px 0 16px;
        }
        .founding-retainer-pill {
          display: inline-block;
          background: rgba(0, 71, 255, 0.2);
          border: 1px solid rgba(0, 71, 255, 0.4);
          color: #60A5FA;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          font-family: var(--font-geist-mono), monospace;
          margin-bottom: 24px;
        }
        .founding-cta-btn {
          display: block;
          width: 100%;
          background: var(--cobalt);
          color: #FFFFFF;
          text-align: center;
          padding: 16px 24px;
          border-radius: 999px;
          font-family: var(--font-inter), sans-serif;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 10px 30px rgba(0, 71, 255, 0.35);
        }
        .founding-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(0, 71, 255, 0.5);
        }

        /* Responsive Breakpoints */
        @media (max-width: 960px) {
          .showcase-grid { grid-template-columns: 1fr; }
          .deliverables-grid { grid-template-columns: repeat(2, 1fr); }
          .founding-grid { grid-template-columns: 1fr; gap: 36px; }
          .founding-card { padding: 36px 24px; }
        }
        @media (max-width: 900px) {
          .pillar-grid { grid-template-columns: 1fr; }
          .portfolio-grid { grid-template-columns: 1fr; }
          .hero-image-frame { height: 360px; }
          .glass-card-bottom-right { display: none; }
        }
        @media (max-width: 880px) {
          .roi-grid { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 860px) {
          .top-nav { padding: 14px 20px; }
          .nav-center { display: none; }
          .brand-logo-fallback { font-size: 16px; }
          .brand-logo-img { height: 26px; }
          .nav-actions .btn-pill-secondary { display: none; }
          .nav-actions .btn-pill-primary { padding: 8px 14px; font-size: 11px; }
          .section-editorial, .section-portfolio { padding: 60px 24px; }
        }
        @media (max-width: 640px) {
          .hero-wrap { padding: 96px 20px 40px; }
          .meta-pills { flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
          .hero-h1 { font-size: clamp(2rem, 7.5vw, 2.9rem); line-height: 1.1; margin-bottom: 18px; }
          .hero-sub { font-size: 15px; line-height: 1.55; margin-bottom: 28px; }
          .cta-row { flex-direction: column; align-items: stretch; gap: 12px; margin-bottom: 40px; }
          .btn-cta-lg { width: 100%; text-align: center; justify-content: center; padding: 14px 20px; }
          .ghost-watermark { font-size: clamp(4.5rem, 22vw, 8.5rem); top: 15px; right: -10px; }
          .hero-image-frame { height: 300px; }
          .glass-badge-top { top: 12px; left: 12px; font-size: 10px; padding: 5px 12px; }
          .glass-card-bottom-right { display: none; }
          .glass-card-bottom-left { left: 12px; right: 12px; bottom: 12px; max-width: calc(100% - 24px); padding: 12px 14px; }
          .glass-title { font-size: 14px; }
          .arch-card, .device-card { padding: 24px 18px; }
          .arch-title { font-size: 20px; }
          .metric-row { grid-template-columns: 1fr; gap: 16px; padding-top: 18px; }
          .metric-num { font-size: 24px; }
          .section-editorial, .section-portfolio { padding: 48px 18px; }
          .section-h2 { font-size: 24px; }
          .section-head-wrap { margin-bottom: 32px; padding-bottom: 16px; }
          .pillar-box { padding: 24px 18px; }
          .footer-links { flex-wrap: wrap; justify-content: center; }
          .footer-meta-bar { flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-wrap">
        <div className="hero-content">
          <div className="meta-pills">
            <span className="tag-mono">INTELLIGENCE / AUTOMATION / GROWTH</span>
            <span className="tag-location">📍 DUBAI // INDIA CORE</span>
          </div>

          <h1 className="hero-h1">
            Qualify Dubai property buyers in 90 seconds.
            <em>While your brokers sleep.</em>
          </h1>

          <p className="hero-sub">
            Turn midnight Meta ad inquiries into scheduled viewings on WhatsApp. Instant budget verification, Golden Visa eligibility checks (AED 2M+), and zero lost leads.
          </p>

          <div className="cta-row">
            <a
              href="https://wa.me/?text=Hi%2C%20I%20am%20a%20Dubai%20Real%20Estate%20Agency%20Principal.%20I%20want%20to%20test%20the%20Nexa%20AI%20Sales%20Engine%20demo."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-primary btn-cta-lg"
              aria-label="Launch Live WhatsApp Demo in WhatsApp (opens in new window)"
            >
              Launch Live WhatsApp Demo ↗
            </a>
            <Link 
              href="/terminal" 
              className="btn-pill-secondary btn-cta-lg"
              aria-label="Explore Internal Terminal Interactive Demo"
            >
              Explore Internal Terminal
            </Link>
          </div>
        </div>

        {/* Hero Cinematic Architectural Showcase */}
        <div className="hero-media-showcase">
          <div className="hero-image-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/burj-sunny-sky.jpg" 
              alt="Burj Khalifa Sunny Downtown Architecture" 
              className="hero-main-img" 
              width={1280}
              height={540}
              loading="eager"
              decoding="async"
            />
            <div className="hero-img-gradient"></div>

            {/* Glass Overlay Telemetry */}
            <div className="glass-badge-top">
              <div className="pulse-dot-green"></div>
              <span>AUTONOMOUS FLEET ACTIVE // DUBAI PRIME</span>
            </div>

            <div className="glass-card-bottom-left">
              <div className="glass-tag">REAL-TIME INBOUND CONVERSION</div>
              <div className="glass-title">Downtown Burj Crown · 3-Bed Penthouse</div>
              <div className="glass-meta">
                <span>AED 2,500,000 Verified</span>
                <span>·</span>
                <span>10-Yr Golden Visa Eligible</span>
              </div>
            </div>

            <div className="glass-card-bottom-right">
              <div className="glass-metric">1.2s</div>
              <div className="glass-metric-sub">Bilingual WhatsApp Lead Engagement</div>
            </div>
          </div>
        </div>

        {/* Dual Showcase Grid */}
        <div className="showcase-grid" id="architecture">
          {/* Left Card: Architectural Spec */}
          <div className="arch-card">
            <div>
              <div className="arch-tagline">PLATFORM ARCHITECTURE // DUBAI REALTY FLEET</div>
              <h2 className="arch-title">78% of overseas investors inquire while your brokers are asleep.</h2>
              <p className="arch-body">
                International buyers across London, Riyadh, Mumbai, and Singapore expect immediate answers. Nexa OS handles multi-turn luxury dialogues, checks inventory availability, and presents verified buyer dossiers directly to your sales directors.
              </p>
            </div>

            <div className="metric-row">
              <div>
                <div className="metric-num">1.2s</div>
                <div className="metric-desc">Avg Bilingual Latency (Arabic + English)</div>
              </div>
              <div>
                <div className="metric-num">85+</div>
                <div className="metric-desc">BANT Threshold for Hot Leads</div>
              </div>
              <div>
                <div className="metric-num">3.2x</div>
                <div className="metric-desc">Viewing Conversion Multiplier</div>
              </div>
            </div>
            <div style={{ marginTop: 14, fontSize: 10, fontFamily: "var(--font-geist-mono), monospace", color: "var(--slate)", letterSpacing: "0.05em" }}>
              * Metrics reflect illustrative benchmark telemetry and typical overseas inquiry distributions under pilot testing.
            </div>
          </div>

          {/* Right Card: Live WhatsApp Dialogue Simulation */}
          <div className="device-card" id="intelligence">
            <div className="ghost-watermark-card">NEXA</div>
            <div>
              <div className="device-header">
                <div className="device-title">
                  <div className="live-indicator"></div>
                  <span>NEXA ENGINE TELEMETRY</span>
                </div>
                <div className="device-status">GEMINI FLASH // ONLINE</div>
              </div>

              <div className="msg-stream">
                <div className="chat-bubble-inbound">
                  <div className="chat-author">INBOUND INVESTOR (UAE/UK)</div>
                  &quot;I saw your ad. Looking for a 3-bedroom apartment in Downtown Dubai around 2.5M AED budget with high rental yield.&quot;
                </div>

                <div className="chat-bubble-ai">
                  <div className="chat-author">NEXA REAL ESTATE AGENT</div>
                  &quot;Excellent choice! Downtown offers strong 8-10% rental yields. With your 2.5M AED budget, we have both off-plan with 1% monthly plans and ready units. Would you like a private viewing tomorrow?&quot;
                </div>
              </div>
            </div>

            <div className="bant-preview-pill">
              <span>EXTRACTED: DOWNTOWN · AED 2.5M</span>
              <span className="bant-score">HOT LEAD · 85/100</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Midnight Leakage Diagnostic */}
      <MidnightLeakageDiagnostic />

      {/* Editorial Pillars */}
      <section className="section-editorial">
        <div className="section-head-wrap">
          <div>
            <div className="tag-mono" style={{ marginBottom: 12, display: "inline-block" }}>SYSTEM PILLARS</div>
            <h2 className="section-h2">
              Every conversation structured.
              <em>Every qualified buyer booked.</em>
            </h2>
          </div>
          <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, letterSpacing: "0.2em", color: "var(--slate)" }}>
            STRUCTURED LEAD QUALIFICATION
          </div>
        </div>

        <div className="pillar-grid">
          {SYSTEM_PILLARS.map((pillar) => (
            <div key={pillar.id} className="pillar-box">
              <div className="pillar-img-box">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={pillar.image} 
                  alt={pillar.imageAlt} 
                  className="pillar-img" 
                  width={400}
                  height={220}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <div className="pillar-index">{pillar.index}</div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-text">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Dubai Developer Fleet Portfolio */}
      <section className="section-portfolio" id="portfolio">
        <div className="section-head-wrap">
          <div>
            <div className="tag-mono" style={{ marginBottom: 12, display: "inline-block" }}>INVENTORY COMPATIBILITY</div>
            <h2 className="section-h2">
              Trained on your agency&apos;s active listings.
              <em>Off-plan or ready units, matched in seconds.</em>
            </h2>
          </div>
          <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, letterSpacing: "0.2em", color: "var(--slate)" }}>
            SAMPLE BUYER INQUIRY MATCHES
          </div>
        </div>

        <div className="portfolio-grid">
          {FLEET_PORTFOLIO.map((property) => (
            <div key={property.id} className="portfolio-card">
              <div className="portfolio-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={property.image} 
                  alt={property.title} 
                  width={600}
                  height={220}
                  loading="lazy"
                  decoding="async"
                />
                <span className="portfolio-dev-pill">{property.developer}</span>
              </div>
              <div className="portfolio-card-content">
                <div>
                  <div className="portfolio-title">{property.title}</div>
                  <div className="portfolio-specs">{property.specs}</div>
                  <p className="portfolio-desc">{property.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, fontSize: 11, fontFamily: "var(--font-geist-mono), monospace", color: "var(--slate)", letterSpacing: "0.04em", textAlign: "center", lineHeight: 1.6 }}>
          * Illustrates autonomous buyer matching across price points, payment plans, and location criteria for your agency&apos;s inventory.
        </div>
      </section>

      {/* Section 3: Interactive Agency ROI Model */}
      <RoiYieldCalculator />

      {/* Section 4: System Deliverables */}
      <section className="section-deliverables" id="deliverables">
        <div className="section-head-wrap">
          <div>
            <div className="tag-mono" style={{ marginBottom: 12, display: "inline-block" }}>SYSTEM DELIVERABLES</div>
            <h2 className="section-h2">
              Everything your sales team needs.
              <em>One intelligent system.</em>
            </h2>
          </div>
          <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, letterSpacing: "0.2em", color: "var(--slate)" }}>
            48-HOUR PRODUCTION DEPLOYMENT
          </div>
        </div>

        <div className="deliverables-grid">
          {SYSTEM_DELIVERABLES.map((item) => (
            <div key={item.num} className="deliverable-card">
              <div className="deliverable-num">{item.num}</div>
              <div>
                <h3 className="deliverable-title">{item.title}</h3>
                <p className="deliverable-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Founding 3 Dubai Offer */}
      <section className="section-founding" id="founding-offer">
        <div className="founding-card">
          <div className="ghost-watermark-card" style={{ fontSize: "140px", bottom: -20, right: -10 }}>FOUNDING 3</div>
          <div className="founding-grid">
            <div>
              <div className="founding-pill">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00F2FF", boxShadow: "0 0 8px #00F2FF", display: "inline-block" }}></span>
                LIMITED PILOT INITIATIVE // DUBAI BROKERAGES
              </div>
              <h2 className="founding-h2">
                FOUNDING 3 · DUBAI
              </h2>
              <p className="founding-sub">
                Be among the first three businesses to deploy Nexa. To establish benchmark conversion across Dubai Prime, we are accepting exactly three founding agency clients under a guaranteed founding tier.
              </p>

              <div className="founding-features">
                <div className="founding-feature-item">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00F2FF", display: "inline-block" }}></span>
                  Official WhatsApp Business API integration &amp; multi-agent setup
                </div>
                <div className="founding-feature-item">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00F2FF", display: "inline-block" }}></span>
                  Full ingestion of your brokerage&apos;s developer project inventory &amp; brochures
                </div>
                <div className="founding-feature-item">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00F2FF", display: "inline-block" }}></span>
                  Sub-90-second bilingual BANT qualification (Arabic + English)
                </div>
                <div className="founding-feature-item">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00F2FF", display: "inline-block" }}></span>
                  Direct Google Meet &amp; on-site viewing calendar synchronization
                </div>
                <div className="founding-feature-item">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00F2FF", display: "inline-block" }}></span>
                  1-Click human broker takeover cockpit &amp; real-time mobile alerts
                </div>
              </div>

              <div style={{ fontSize: 12, color: "#94A3B8", fontFamily: "var(--font-geist-mono), monospace" }}>
                Limited strictly to three signed founding clients.
              </div>
            </div>

            <div className="founding-pricing-box">
              <div className="founding-price-tag">AED 2,499</div>
              <div className="founding-price-sub">One-time implementation</div>
              
              <div className="founding-retainer-pill">
                AED 500 / month · Monthly support &amp; maintenance
              </div>

              <a
                href="https://wa.me/?text=Hi%2C%20I%20want%20to%20claim%20the%20Founding%203%20Dubai%20Offer%20(AED%202%2C499%20setup%20%2B%20AED%20500%2Fmo).%0A%0AAgency%20Name%3A%20%0ANumber%20of%20Brokers%3A%20%0ACurrent%20Monthly%20Lead%20Volume%3A%20%0APrimary%20Requirements%3A%20"
                target="_blank"
                rel="noopener noreferrer"
                className="founding-cta-btn"
                aria-label="Claim Founding Client Offer on WhatsApp (opens in new window)"
              >
                Claim Founding Client Offer ↗
              </a>

              <div style={{ marginTop: 16 }}>
                <Link href="/assessment" style={{ color: "#94A3B8", fontSize: 11, fontFamily: "var(--font-geist-mono), monospace", textDecoration: "underline" }}>
                  Calculate your agency&apos;s lead leakage first →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand-emblem">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/logo.svg" 
              alt="Adyant Nexa Logo" 
              className="footer-logo-img" 
              width={72}
              height={72}
              loading="lazy"
              decoding="async"
            />
            <div className="footer-brand-title">ADYANT <span>NEXA.</span></div>
            <div className="footer-brand-sub">Autonomous Real Estate Operating Systems · Dubai // India Core</div>
          </div>

          <div className="footer-links">
            <a href="#architecture">Architecture</a>
            <span>·</span>
            <a href="#intelligence">BANT Intelligence</a>
            <span>·</span>
            <a href="#diagnostic">Lead Diagnostic</a>
            <span>·</span>
            <a href="#portfolio">Developer Fleet</a>
            <span>·</span>
            <a href="#roi">Yield Calculator</a>
            <span>·</span>
            <a href="#founding-offer" style={{ color: "var(--cobalt)", fontWeight: 700 }}>Founding 3 Offer ↗</a>
            <span>·</span>
            <Link href="/terminal">Live Demo Terminal ↗</Link>
          </div>

          <div className="footer-meta-bar">
            <div>© 2026 ADYANT NEXA. ALL RIGHTS RESERVED.</div>
            <div>INTELLIGENT SYSTEMS. BETTER BUSINESS OUTCOMES.</div>
          </div>
        </div>
      </footer>
      <CalendlyBadge />
    </main>
  );
}
