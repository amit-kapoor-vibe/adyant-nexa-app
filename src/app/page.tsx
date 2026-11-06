"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { SYSTEM_PILLARS, FLEET_PORTFOLIO } from "@/data/fleetData";

const RoiYieldCalculator = dynamic(
  () => import("@/components/roi/RoiYieldCalculator").then((mod) => mod.RoiYieldCalculator),
  { ssr: false }
);

export default function AdyantNexaRealEstateOS() {

  return (
    <div className="an-page-wrapper">
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
          padding: 90px 48px 80px;
          overflow: hidden;
        }

        .ghost-watermark {
          position: absolute;
          top: 40px;
          right: -20px;
          font-family: var(--font-syne), sans-serif;
          font-weight: 800;
          font-size: clamp(8rem, 22vw, 19rem);
          line-height: 0.8;
          color: rgba(10, 10, 12, 0.03);
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
          line-height: 1.2;
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
          line-height: 1.1;
          color: var(--onyx);
        }
        .section-h2 em {
          font-family: var(--font-display), serif;
          font-style: italic;
          font-weight: 400;
          color: var(--cobalt);
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
          background: var(--onyx);
          color: var(--pure-white);
          padding: 100px 48px;
          border-radius: 28px;
          max-width: 1260px;
          margin: 0 auto 100px;
          position: relative;
          overflow: hidden;
        }
        .roi-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .roi-h2 {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(2rem, 3.8vw, 3.2rem);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.1;
          margin-bottom: 18px;
        }
        .roi-h2 em {
          font-family: var(--font-display), serif;
          font-style: italic;
          color: var(--cyan-bright);
        }
        .roi-sub {
          font-size: 15px;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .slider-container {
          background: #14141A;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 32px;
        }
        .slider-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 16px;
        }
        .slider-lbl {
          font-family: var(--font-geist-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--blue-tint);
        }
        .slider-val {
          font-family: var(--font-syne), sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: var(--pure-white);
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
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--cobalt);
          border: 3px solid var(--pure-white);
          cursor: pointer;
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
          color: var(--pure-white);
        }
        .result-lbl {
          font-size: 12px;
          color: #94A3B8;
          margin-top: 4px;
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

        /* Responsive Breakpoints */
        @media (max-width: 960px) {
          .showcase-grid { grid-template-columns: 1fr; }
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
          .hero-wrap { padding: 48px 20px 40px; }
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

      {/* Top Navigation */}
      <header className="top-nav">
        <Link href="/" className="brand-group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Adyant Nexa Logo" className="brand-logo-img" />
          <div className="brand-logo-fallback">ADYANT <span>NEXA.</span></div>
        </Link>

        <nav className="nav-center">
          <a href="#architecture">Architecture</a>
          <a href="#intelligence">BANT Intelligence</a>
          <a href="#portfolio">Developer Fleet</a>
          <a href="#roi">Yield Calculator</a>
          <Link href="/tools">Tools</Link>
          <Link href="/about">About</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="nav-actions">
          <Link href="/admin" className="btn-pill-secondary">
            Command Centre →
          </Link>
          <a
            href="https://wa.me/?text=Hi%2C%20I%20am%20a%20Dubai%20Real%20Estate%20Agency%20Principal.%20I%20want%20to%20see%20the%20Nexa%20AI%20Sales%20Engine%20demo."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-primary"
          >
            Connect WhatsApp ↗
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-wrap">
        <div className="ghost-watermark">NEXA</div>

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
            >
              Launch Live WhatsApp Demo ↗
            </a>
            <Link href="/admin" className="btn-pill-secondary btn-cta-lg">
              Explore Internal Terminal
            </Link>
          </div>
        </div>

        {/* Hero Cinematic Architectural Showcase */}
        <div className="hero-media-showcase">
          <div className="hero-image-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/dubai-skyline.jpg" alt="Dubai Downtown Architecture" className="hero-main-img" />
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
          </div>

          {/* Right Card: Live WhatsApp Dialogue Simulation */}
          <div className="device-card" id="intelligence">
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
            BUILT FOR EMAAR, DAMAC &amp; SOBHA PORTFOLIOS
          </div>
        </div>

        <div className="pillar-grid">
          {SYSTEM_PILLARS.map((pillar) => (
            <div key={pillar.id} className="pillar-box">
              <div className="pillar-img-box">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pillar.image} alt={pillar.imageAlt} className="pillar-img" />
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
            <div className="tag-mono" style={{ marginBottom: 12, display: "inline-block" }}>PORTFOLIO EXCLUSIVES</div>
            <h2 className="section-h2">
              Pre-integrated with
              <em>Dubai&apos;s Tier-1 Developers.</em>
            </h2>
          </div>
          <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, letterSpacing: "0.2em", color: "var(--slate)" }}>
            AUTOMATED INVENTORY MATCHING &amp; VIP VIEWINGS
          </div>
        </div>

        <div className="portfolio-grid">
          {FLEET_PORTFOLIO.map((property) => (
            <div key={property.id} className="portfolio-card">
              <div className="portfolio-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={property.image} alt={property.title} />
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
      </section>

      {/* Section 3: Interactive Agency ROI Model */}
      <RoiYieldCalculator />

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand-emblem">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Adyant Nexa Logo" className="footer-logo-img" />
            <div className="footer-brand-title">ADYANT <span>NEXA.</span></div>
            <div className="footer-brand-sub">Autonomous Real Estate Operating Systems · Dubai // India Core</div>
          </div>

          <div className="footer-links">
            <a href="#architecture">Architecture</a>
            <span>·</span>
            <a href="#intelligence">BANT Intelligence</a>
            <span>·</span>
            <a href="#portfolio">Developer Fleet</a>
            <span>·</span>
            <a href="#roi">Yield Calculator</a>
            <span>·</span>
            <Link href="/tools">Diagnostic Tools</Link>
            <span>·</span>
            <Link href="/how-it-works">How We Work</Link>
            <span>·</span>
            <Link href="/about">About</Link>
            <span>·</span>
            <Link href="/journal">Journal</Link>
            <span>·</span>
            <Link href="/contact">Contact</Link>
            <span>·</span>
            <Link href="/admin">Command Centre ↗</Link>
          </div>

          <div className="footer-meta-bar">
            <div>© 2026 ADYANT NEXA. ALL RIGHTS RESERVED.</div>
            <div>INTELLIGENT SYSTEMS. BETTER BUSINESS OUTCOMES.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
