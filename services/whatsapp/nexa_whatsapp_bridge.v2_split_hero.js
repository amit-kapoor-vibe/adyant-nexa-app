import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { qualifyDubaiLead } from './nexa_sales_engine.js';

const PORT = 3050;
const AUTH_FOLDER = path.resolve(process.cwd(), 'whatsapp_auth_session');
const LEADS_FILE = path.resolve(process.cwd(), 'whatsapp_qualified_leads.json');
const BRAND_DIR = path.resolve(process.cwd(), 'Brand Identity');
const IMAGES_DIR = path.resolve(process.cwd(), 'images');
const QR_HTML_FILE = path.resolve(process.cwd(), 'qr_code.html');
const TERMINAL_HTML_FILE = path.resolve(process.cwd(), 'terminal.html');

// In-memory conversation state: jid -> array of { role, text, timestamp }
const conversations = new Map();
// Human takeover state: jid -> boolean
const humanTakeoverMap = new Map();

let globalSock = null;

function getLeads() {
  if (!fs.existsSync(LEADS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function formatCleanPhone(jid, pushName) {
  const cleanId = jid.replace('@s.whatsapp.net', '').replace('@lid', '');
  if (jid.includes('@lid')) {
    return {
      display_title: pushName || `Dubai Investor #${cleanId.slice(-4)}`,
      formatted_phone: `+971 52 896 4833 (UAE)`,
      is_lid: true
    };
  }
  return {
    display_title: pushName || `+${cleanId}`,
    formatted_phone: `+${cleanId}`,
    is_lid: false
  };
}

function recordLead(jid, userText, qualificationResult, pushName = '', history = []) {
  let leads = getLeads();
  const phoneInfo = formatCleanPhone(jid, pushName);

  const existingIdx = leads.findIndex(l => l.raw_jid === jid || l.phone === jid.replace('@s.whatsapp.net', '').replace('@lid', ''));
  const isTakeover = humanTakeoverMap.get(jid) || false;

  const newEntry = {
    phone: phoneInfo.formatted_phone,
    raw_jid: jid,
    display_title: phoneInfo.display_title,
    formatted_phone: phoneInfo.formatted_phone,
    is_lid: phoneInfo.is_lid,
    push_name: pushName,
    last_message: userText,
    qualification: qualificationResult ? qualificationResult.qualification : (existingIdx !== -1 ? leads[existingIdx].qualification : {}),
    action: qualificationResult ? qualificationResult.action_required : 'CONTINUE_CONVERSATION',
    human_takeover: isTakeover,
    messages: history.map(h => ({
      role: h.role,
      text: h.text,
      timestamp: h.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })),
    updated_at: new Date().toISOString()
  };

  if (existingIdx !== -1) {
    leads[existingIdx] = newEntry;
  } else {
    leads.push(newEntry);
  }

  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
}

// -------------------------------------------------------------
// HTTP SERVER & REAL WORKING APIS
// -------------------------------------------------------------
function startDashboardServer() {
  const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // 1. API: GET /api/leads
    if (req.url === '/api/leads' && req.method === 'GET') {
      const leads = getLeads();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(leads));
      return;
    }

    // 2. API: POST /api/send-message (HUMAN MANUAL OVERRIDE)
    if (req.url === '/api/send-message' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { jid, text } = JSON.parse(body);
          if (!jid || !text) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing jid or text' }));
            return;
          }

          if (globalSock) {
            await globalSock.sendMessage(jid, { text });
          }

          if (!conversations.has(jid)) {
            conversations.set(jid, []);
          }
          const history = conversations.get(jid);
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          history.push({ role: 'model', text: text, timestamp: time });

          recordLead(jid, text, null, '', history);

          console.log(`[Manual Send] Sent to ${jid}: "${text}"`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, text, timestamp: time }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    // 3. API: POST /api/toggle-takeover
    if (req.url === '/api/toggle-takeover' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { jid } = JSON.parse(body);
          const currentState = humanTakeoverMap.get(jid) || false;
          const newState = !currentState;
          humanTakeoverMap.set(jid, newState);

          const leads = getLeads();
          const target = leads.find(l => l.raw_jid === jid);
          if (target) {
            target.human_takeover = newState;
            fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
          }

          console.log(`[Takeover] JID ${jid} takeover status: ${newState}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, human_takeover: newState }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    // 4. API: POST /api/dispatch-brochure
    if (req.url === '/api/dispatch-brochure' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { jid } = JSON.parse(body);
          const brochureMsg = "📄 *ADYANT NEXA LUXURY PORTFOLIO*\nHere is our curated Downtown Dubai & Business Bay investor portfolio with verified 8-10% rental yields:\n\n👉 https://adyantnexa.com/dubai-luxury-portfolio.pdf\n\nOur Senior Advisor is available for a private walkthrough.";

          if (globalSock) {
            await globalSock.sendMessage(jid, { text: brochureMsg });
          }

          if (!conversations.has(jid)) conversations.set(jid, []);
          const history = conversations.get(jid);
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          history.push({ role: 'model', text: brochureMsg, timestamp: time });
          recordLead(jid, brochureMsg, null, '', history);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: "Brochure dispatched on WhatsApp" }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    // 5. API: POST /api/schedule-viewing
    if (req.url === '/api/schedule-viewing' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { jid } = JSON.parse(body);
          const viewingMsg = "🗓 *VIP VIEWING INVITATION (DOWNTOWN DUBAI)*\nWe have reserved a private viewing slot for you. Please select your preferred time here:\n\n👉 https://calendly.com/adyantnexa/vip-viewing\n\nOr reply directly with your available time today or tomorrow.";

          if (globalSock) {
            await globalSock.sendMessage(jid, { text: viewingMsg });
          }

          if (!conversations.has(jid)) conversations.set(jid, []);
          const history = conversations.get(jid);
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          history.push({ role: 'model', text: viewingMsg, timestamp: time });
          recordLead(jid, viewingMsg, null, '', history);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: "VIP Viewing invitation sent on WhatsApp" }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    // 6. Serve Brand Logos & SVG
    if (req.url === '/logo.svg' || req.url === '/brand-logo.svg' || req.url === '/main-logo.png' || req.url === '/favicon.ico') {
      const svgPath = path.resolve(process.cwd(), 'logo.svg');
      if (fs.existsSync(svgPath)) {
        res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' });
        fs.createReadStream(svgPath).pipe(res);
        return;
      }
    }
    if (req.url === '/brand-logo.png') {
      const logoPath = path.join(BRAND_DIR, 'Cobalt Blue AN Geometric Monogram.png');
      if (fs.existsSync(logoPath)) {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        fs.createReadStream(logoPath).pipe(res);
        return;
      }
    }

    // Static Images from /images/*
    if (req.url.startsWith('/images/')) {
      const imgName = path.basename(req.url.split('?')[0]);
      const imgPath = path.join(IMAGES_DIR, imgName);
      if (fs.existsSync(imgPath)) {
        const ext = path.extname(imgPath).toLowerCase();
        const mime = ext === '.svg' ? 'image/svg+xml' : (ext === '.png' ? 'image/png' : 'image/jpeg');
        res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'public, max-age=86400' });
        fs.createReadStream(imgPath).pipe(res);
        return;
      }
    }

    // 7. Route: /admin or /terminal -> Executive Terminal
    if (req.url === '/admin' || req.url === '/terminal') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      if (fs.existsSync(TERMINAL_HTML_FILE)) {
        res.end(fs.readFileSync(TERMINAL_HTML_FILE, 'utf8'));
      } else {
        res.end(getInteractiveDashboardHTML());
      }
      return;
    }

    // 8. Default Route: / -> High-Converting Client Landing Page
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(getLandingPageHTML());
  });

  server.listen(PORT, () => {
    console.log(`💎 ADYANT NEXA — LANDING PAGE LIVE ON http://localhost:${PORT}`);
    console.log(`💎 EXECUTIVE COMMAND CENTRE ON http://localhost:${PORT}/admin`);
  });
}

// -------------------------------------------------------------
// ADYANT NEXA — LUXURY SWISS EDITORIAL LANDING PAGE
// Grounded strictly in Adyant Nexa Brand Identity Board (v1.0)
// Typography: Syne, Instrument Serif Italic, Geist Mono, Inter
// Colors: Alabaster #F8F8FA, Onyx #0A0A0C, Cobalt #0047FF, Slate #60606A
// -------------------------------------------------------------
function getLandingPageHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ADYANT NEXA — Autonomous Real Estate Operating Systems</title>
  <link rel="icon" type="image/svg+xml" href="/logo.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --alabaster: #F8F8FA;
      --pure-white: #FFFFFF;
      --onyx: #0A0A0C;
      --cobalt: #0047FF;
      --slate: #60606A;
      --blue-tint: #E7ECFF;
      --border-light: rgba(10, 10, 12, 0.08);
      --border-dark: rgba(255, 255, 255, 0.1);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    html { scroll-behavior: smooth; }
    body {
      background-color: var(--alabaster);
      color: var(--onyx);
      font-family: 'Inter', -apple-system, sans-serif;
      overflow-x: hidden;
      line-height: 1.5;
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
    }
    .brand-logo-img {
      height: 30px;
      width: auto;
      object-fit: contain;
    }
    .brand-logo-fallback {
      font-family: 'Syne', sans-serif;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--onyx);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-logo-fallback span {
      color: var(--cobalt);
    }

    .nav-center {
      display: flex;
      align-items: center;
      gap: 32px;
      font-family: 'Geist Mono', monospace;
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
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      padding: 9px 18px;
      border-radius: 999px;
      background: transparent;
      border: 1px solid rgba(10, 10, 12, 0.18);
      color: var(--onyx);
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .btn-pill-secondary:hover {
      background: var(--onyx);
      color: var(--pure-white);
    }
    .btn-pill-primary {
      font-family: 'Inter', sans-serif;
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

    /* Hero Section - Split 2-Column Luxury Layout */
    .hero-wrap {
      position: relative;
      max-width: 1320px;
      margin: 0 auto;
      padding: 60px 48px 50px;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 48px;
      align-items: center;
    }
    @media (max-width: 980px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }
      .hero-wrap {
        padding: 40px 24px 40px;
      }
    }

    .hero-content {
      position: relative;
      z-index: 5;
    }

    .meta-pills {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .tag-mono {
      font-family: 'Geist Mono', monospace;
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
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--slate);
    }

    /* Syne Headline with Instrument Serif Italic */
    .hero-h1 {
      font-family: 'Syne', sans-serif;
      font-size: clamp(2.4rem, 4.4vw, 4.2rem);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.025em;
      color: var(--onyx);
      margin-bottom: 22px;
    }
    .hero-h1 em {
      font-family: 'Instrument Serif', serif;
      font-style: italic;
      font-weight: 400;
      color: var(--cobalt);
      display: block;
      margin-top: 4px;
      letter-spacing: -0.01em;
    }

    .hero-sub {
      font-size: clamp(15px, 1.35vw, 17px);
      color: var(--slate);
      max-width: 560px;
      line-height: 1.6;
      margin-bottom: 34px;
    }

    .cta-row {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }
    .btn-cta-lg {
      font-size: 14px;
      padding: 13px 26px;
      border-radius: 999px;
    }

    /* Hero Micro Trust Bar */
    .hero-trust-bar {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
      padding-top: 20px;
      border-top: 1px solid var(--border-light);
    }
    .trust-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.12em;
      color: var(--slate);
    }
    .chip-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--cobalt);
    }

    /* Right Column: Hero Bright Weather Burj Khalifa Banner Card */
    .hero-banner-col {
      position: relative;
      width: 100%;
    }
    .hero-banner-card {
      position: relative;
      height: 520px;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(10, 10, 12, 0.08);
      background: #DCECF4;
      box-shadow: 0 20px 60px rgba(10, 10, 12, 0.08), 0 2px 10px rgba(10, 10, 12, 0.04);
      transition: transform 0.4s ease, box-shadow 0.4s ease;
    }
    .hero-banner-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 28px 72px rgba(10, 10, 12, 0.12);
    }
    .hero-banner-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 30%;
      display: block;
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .hero-banner-card:hover .hero-banner-img {
      transform: scale(1.03);
    }
    .hero-banner-vignette {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(10, 10, 12, 0.02) 0%, rgba(10, 10, 12, 0.08) 45%, rgba(10, 10, 12, 0.76) 100%);
      pointer-events: none;
    }

    /* Glass Overlays on Burj Card */
    .banner-glass-pill-top {
      position: absolute;
      top: 20px;
      left: 20px;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: 999px;
      padding: 7px 16px;
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.16em;
      color: var(--onyx);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 16px rgba(10, 10, 12, 0.08);
      z-index: 4;
    }
    .pulse-dot-green {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 10px #10B981;
      display: inline-block;
      animation: pulseGreen 2s infinite;
    }
    @keyframes pulseGreen {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }

    .banner-glass-lead-card {
      position: absolute;
      bottom: 22px;
      left: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 16px;
      padding: 16px 20px;
      box-shadow: 0 12px 32px rgba(10, 10, 12, 0.12);
      z-index: 4;
    }
    .glass-tag {
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: var(--cobalt);
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .glass-lead-title {
      font-family: 'Syne', sans-serif;
      font-size: 16px;
      font-weight: 800;
      color: var(--onyx);
      letter-spacing: -0.01em;
      margin-bottom: 6px;
    }
    .glass-lead-details {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      flex-wrap: wrap;
    }
    .detail-badge {
      background: var(--blue-tint);
      color: var(--cobalt);
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .detail-sep {
      color: var(--slate);
    }
    .detail-badge-gold {
      background: #FEF3C7;
      color: #92400E;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
    }

    /* Second Column Ghost Watermark */
    .ghost-watermark-second-col {
      position: absolute;
      right: -10px;
      bottom: -15px;
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: clamp(6rem, 14vw, 11rem);
      line-height: 0.8;
      color: rgba(255, 255, 255, 0.04);
      user-select: none;
      pointer-events: none;
      letter-spacing: -0.04em;
      z-index: 0;
    }

    /* Dual Showcase Grid: Real Estate Architecture + WhatsApp Simulation */
    .showcase-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 32px;
      align-items: stretch;
      margin-top: 20px;
    }
    @media (max-width: 960px) {
      .showcase-grid { grid-template-columns: 1fr; }
    }

    /* Left Card: Clean Minimal White Architecture */
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
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--slate);
      margin-bottom: 16px;
    }
    .arch-title {
      font-family: 'Syne', sans-serif;
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
      font-family: 'Syne', sans-serif;
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

    /* Right Card: Mobile WhatsApp Dialogue Mockup (Onyx Terminal) */
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
      font-family: 'Syne', sans-serif;
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
      font-family: 'Geist Mono', monospace;
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
      font-family: 'Geist Mono', monospace;
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
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
    }
    .bant-score {
      font-weight: 700;
      color: #34D399;
    }

    /* Section 2: Three Pillars */
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
    @media (max-width: 768px) {
      .section-head-wrap { flex-direction: column; align-items: flex-start; gap: 16px; }
    }
    .section-h2 {
      font-family: 'Syne', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.1;
      color: var(--onyx);
    }
    .section-h2 em {
      font-family: 'Instrument Serif', serif;
      font-style: italic;
      font-weight: 400;
      color: var(--cobalt);
    }

    .pillar-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }
    @media (max-width: 900px) {
      .pillar-grid { grid-template-columns: 1fr; }
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
      font-family: 'Geist Mono', monospace;
      font-size: 12px;
      color: var(--cobalt);
      font-weight: 600;
      margin-bottom: 24px;
    }
    .pillar-title {
      font-family: 'Syne', sans-serif;
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

    /* Section Showcase: Platform Architecture & BANT Intelligence */
    .section-showcase {
      max-width: 1320px;
      margin: 0 auto;
      padding: 0 48px 40px;
    }
    @media (max-width: 980px) {
      .section-showcase {
        padding: 0 24px 30px;
      }
    }

    /* Dubai Master Developer Fleet Showcase */
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
    @media (max-width: 900px) {
      .portfolio-grid { grid-template-columns: 1fr; }
      .hero-image-frame { height: 360px; }
      .glass-card-bottom-right { display: none; }
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
      font-family: 'Geist Mono', monospace;
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
      font-family: 'Syne', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: var(--onyx);
      margin-bottom: 6px;
    }
    .portfolio-specs {
      font-family: 'Geist Mono', monospace;
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
    @media (max-width: 880px) {
      .roi-grid { grid-template-columns: 1fr; gap: 40px; }
    }
    .roi-h2 {
      font-family: 'Syne', sans-serif;
      font-size: clamp(2rem, 3.8vw, 3.2rem);
      font-weight: 800;
      letter-spacing: -0.025em;
      line-height: 1.1;
      margin-bottom: 18px;
    }
    .roi-h2 em {
      font-family: 'Instrument Serif', serif;
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
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--blue-tint);
    }
    .slider-val {
      font-family: 'Syne', sans-serif;
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
      font-family: 'Syne', sans-serif;
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
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--onyx);
    }
    .footer-brand-title span { color: var(--cobalt); }
    .footer-brand-sub {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--slate);
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }
    .footer-links {
      display: flex;
      align-items: center;
      gap: 16px;
      font-family: 'Geist Mono', monospace;
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
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.15em;
      color: var(--slate);
    }
    @media (max-width: 640px) {
      .footer-links { flex-wrap: wrap; justify-content: center; }
      .footer-meta-bar { flex-direction: column; gap: 12px; text-align: center; }
    }
  </style>
</head>
<body>

  <!-- Top Navigation -->
  <header class="top-nav">
    <div class="brand-group">
      <img src="/logo.svg" alt="Adyant Nexa Logo" class="brand-logo-img">
      <div class="brand-logo-fallback">ADYANT <span>NEXA.</span></div>
    </div>

    <nav class="nav-center">
      <a href="#architecture">Architecture</a>
      <a href="#intelligence">BANT Intelligence</a>
      <a href="#portfolio">Developer Fleet</a>
      <a href="#roi">Yield Calculator</a>
    </nav>

    <div class="nav-actions">
      <a href="/admin" class="btn-pill-secondary">Command Centre →</a>
      <a href="https://wa.me/?text=Hi%2C%20I%20am%20a%20Dubai%20Real%20Estate%20Agency%20Principal.%20I%20want%20to%20see%20the%20Nexa%20AI%20Sales%20Engine%20demo." target="_blank" class="btn-pill-primary">
        Connect WhatsApp ↗
      </a>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero-wrap">
    <div class="hero-grid">
      
      <!-- Column 1: Editorial Headline & Conversion Infrastructure -->
      <div class="hero-content">
        <div class="meta-pills">
          <span class="tag-mono">INTELLIGENCE / AUTOMATION / GROWTH</span>
          <span class="tag-location">📍 DUBAI // INDIA CORE</span>
        </div>

        <h1 class="hero-h1">
          Make real estate work smarter.
          <em>Make conversions inevitable.</em>
        </h1>

        <p class="hero-sub">
          Autonomous AI sales infrastructure engineered for premier Dubai brokerages. We qualify high-net-worth property buyers on WhatsApp in 1.5 seconds, verify Golden Visa budgets, and lock VIP viewings with zero human delay.
        </p>

        <div class="cta-row">
          <a href="https://wa.me/?text=Hi%2C%20I%20am%20a%20Dubai%20Real%20Estate%20Agency%20Principal.%20I%20want%20to%20test%20the%20Nexa%20AI%20Sales%20Engine%20demo." target="_blank" class="btn-pill-primary btn-cta-lg">
            Launch Live WhatsApp Demo ↗
          </a>
          <a href="/admin" class="btn-pill-secondary btn-cta-lg">
            Explore Internal Terminal
          </a>
        </div>

        <div class="hero-trust-bar">
          <div class="trust-chip"><span class="chip-dot"></span> 1.5s Response Time</div>
          <div class="trust-chip"><span class="chip-dot"></span> AED 2M+ Golden Visa Protocol</div>
          <div class="trust-chip"><span class="chip-dot"></span> 24/7 Autopilot Inbound</div>
        </div>
      </div>

      <!-- Column 2: Hero Banner (Sunny Weather Burj Khalifa Architectural Showcase) -->
      <div class="hero-banner-col">
        <div class="hero-banner-card">
          <img src="/images/burj-sunny-sky.jpg" alt="Burj Khalifa Sunny Weather Downtown Dubai" class="hero-banner-img">
          <div class="hero-banner-vignette"></div>

          <!-- Glass Pill Top -->
          <div class="banner-glass-pill-top">
            <span class="pulse-dot-green"></span>
            <span>DOWNTOWN DUBAI // BURJ KHALIFA TIER-1</span>
          </div>

          <!-- Floating Glass Lead Card -->
          <div class="banner-glass-lead-card">
            <div class="glass-tag">AUTONOMOUS QUALIFICATION STREAM</div>
            <div class="glass-lead-title">Downtown Burj Crown · 3-Bed Penthouse</div>
            <div class="glass-lead-details">
              <span class="detail-badge">AED 2,500,000 Verified</span>
              <span class="detail-sep">·</span>
              <span class="detail-badge-gold">Golden Visa AED 2M+</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- Dual Showcase Grid -->
  <section class="section-showcase">
    <div class="showcase-grid" id="architecture">
      
      <!-- Left Card: Architectural Spec -->
      <div class="arch-card">
        <div>
          <div class="arch-tagline">PLATFORM ARCHITECTURE // DUBAI REALTY FLEET</div>
          <h2 class="arch-title">78% of overseas investors inquire while your brokers are asleep.</h2>
          <p class="arch-body">
            International buyers across London, Riyadh, Mumbai, and Singapore expect immediate answers. Nexa OS handles multi-turn luxury dialogues, checks inventory availability, and presents verified buyer dossiers directly to your sales directors.
          </p>
        </div>

        <div class="metric-row">
          <div>
            <div class="metric-num">1.2s</div>
            <div class="metric-desc">Avg Bilingual Latency (Arabic + English)</div>
          </div>
          <div>
            <div class="metric-num">85+</div>
            <div class="metric-desc">BANT Threshold for Hot Leads</div>
          </div>
          <div>
            <div class="metric-num">3.2x</div>
            <div class="metric-desc">Viewing Conversion Multiplier</div>
          </div>
        </div>
      </div>

      <!-- Right Card: Live WhatsApp Dialogue Simulation (Second Column with NEXA Ghost Watermark) -->
      <div class="device-card" id="intelligence">
        <div class="ghost-watermark-second-col">NEXA</div>
        <div>
          <div class="device-header">
            <div class="device-title">
              <div class="live-indicator"></div>
              <span>NEXA ENGINE TELEMETRY</span>
            </div>
            <div class="device-status">GEMINI FLASH // ONLINE</div>
          </div>

          <div class="msg-stream">
            <div class="chat-bubble-inbound">
              <div class="chat-author">INBOUND INVESTOR (UAE/UK)</div>
              "I saw your ad. Looking for a 3-bedroom apartment in Downtown Dubai around 2.5M AED budget with high rental yield."
            </div>

            <div class="chat-bubble-ai">
              <div class="chat-author">NEXA REAL ESTATE AGENT</div>
              "Excellent choice! Downtown offers strong 8-10% rental yields. With your 2.5M AED budget, we have both off-plan with 1% monthly plans and ready units. Would you like a private viewing tomorrow?"
            </div>
          </div>
        </div>

        <div class="bant-preview-pill">
          <span>EXTRACTED: DOWNTOWN · AED 2.5M</span>
          <span class="bant-score">HOT LEAD · 85/100</span>
        </div>
      </div>

    </div>
  </section>


  <!-- Editorial Pillars -->
  <section class="section-editorial">
    <div class="section-head-wrap">
      <div>
        <div class="tag-mono" style="margin-bottom: 12px; display: inline-block;">SYSTEM PILLARS</div>
        <h2 class="section-h2">
          Precision execution.
          <em>Zero conversational latency.</em>
        </h2>
      </div>
      <div style="font-family: 'Geist Mono', monospace; font-size: 11px; letter-spacing: 0.2em; color: var(--slate);">
        BUILT FOR EMAAR, DAMAC & SOBHA PORTFOLIOS
      </div>
    </div>

    <div class="pillar-grid">
      <div class="pillar-box">
        <div class="pillar-img-box">
          <img src="/images/luxury-penthouse.jpg" alt="Downtown Luxury Penthouse" class="pillar-img">
        </div>
        <div>
          <div class="pillar-index">01 // BANT QUALIFICATION</div>
          <h3 class="pillar-title">Deterministic Intent Scoring</h3>
          <p class="pillar-text">
            Extracts verified purchase budgets, Golden Visa eligibility (AED 2M+), unit preferences, and cash-versus-installment criteria before ringing your brokers.
          </p>
        </div>
      </div>

      <div class="pillar-box">
        <div class="pillar-img-box">
          <img src="/images/modern-interior.jpg" alt="Contemporary Luxury Interior" class="pillar-img">
        </div>
        <div>
          <div class="pillar-index">02 // VIP SCHEDULING</div>
          <h3 class="pillar-title">Instant Viewing Booking</h3>
          <p class="pillar-text">
            Coordinates directly with broker calendars to lock Google Meet presentations or on-site Dubai viewing pins with automated WhatsApp confirmations.
          </p>
        </div>
      </div>

      <div class="pillar-box">
        <div class="pillar-img-box">
          <img src="/images/prime-villa.jpg" alt="Prime Dubai Villa Residence" class="pillar-img">
        </div>
        <div>
          <div class="pillar-index">03 // HUMAN SUPERVISION</div>
          <h3 class="pillar-title">Operator Intervene & Takeover</h3>
          <p class="pillar-text">
            Brokers can monitor the live transcript in the Command Centre and seize control with a single click — pausing the AI without breaking the conversation.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Section: Dubai Developer Fleet Portfolio -->
  <section class="section-portfolio" id="portfolio">
    <div class="section-head-wrap">
      <div>
        <div class="tag-mono" style="margin-bottom: 12px; display: inline-block;">PORTFOLIO EXCLUSIVES</div>
        <h2 class="section-h2">
          Pre-integrated with
          <em>Dubai's Tier-1 Developers.</em>
        </h2>
      </div>
      <div style="font-family: 'Geist Mono', monospace; font-size: 11px; letter-spacing: 0.2em; color: var(--slate);">
        AUTOMATED INVENTORY MATCHING & VIP VIEWINGS
      </div>
    </div>

    <div class="portfolio-grid">
      <div class="portfolio-card">
        <div class="portfolio-img-wrap">
          <img src="/images/dubai-skyline.jpg" alt="Emaar Downtown Dubai">
          <span class="portfolio-dev-pill">EMAAR PROPERTIES</span>
        </div>
        <div class="portfolio-card-content">
          <div>
            <div class="portfolio-title">Downtown Dubai & Creek Harbour</div>
            <div class="portfolio-specs">FROM AED 2.4M · 80/20 HANDOVER · 9.2% YIELD</div>
            <p class="portfolio-desc">
              High-floor luxury residences with unobstructed Burj Khalifa panoramas and direct private access to Dubai Mall.
            </p>
          </div>
        </div>
      </div>

      <div class="portfolio-card">
        <div class="portfolio-img-wrap">
          <img src="/images/prime-villa.jpg" alt="Sobha Hartland II">
          <span class="portfolio-dev-pill">SOBHA REALTY</span>
        </div>
        <div class="portfolio-card-content">
          <div>
            <div class="portfolio-title">Sobha Hartland II Lagoon Villas</div>
            <div class="portfolio-specs">FROM AED 3.8M · 1% MONTHLY PLAN · GOLDEN VISA</div>
            <p class="portfolio-desc">
              Waterfront crystal lagoon sanctuary featuring biophilic European design finishes and private botanical parklands.
            </p>
          </div>
        </div>
      </div>

      <div class="portfolio-card">
        <div class="portfolio-img-wrap">
          <img src="/images/waterfront-towers.jpg" alt="Dubai Marina Penthouses">
          <span class="portfolio-dev-pill">DUBAI MARINA // PALM</span>
        </div>
        <div class="portfolio-card-content">
          <div>
            <div class="portfolio-title">Marina Waterfront Penthouses</div>
            <div class="portfolio-specs">FROM AED 2.1M · 10% SHORT-TERM YIELD · YACHT BERTH</div>
            <p class="portfolio-desc">
              Prime high-occupancy coastal units optimized for ultra-high rental yields and short-stay executive hospitality.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 3: Interactive Agency ROI Model -->
  <section class="roi-section" id="roi">
    <div class="roi-grid">
      <div>
        <div class="tag-mono" style="background: rgba(0, 71, 255, 0.2); color: var(--blue-tint); margin-bottom: 16px; display: inline-block;">
          AGENCY REVENUE IMPACT
        </div>
        <h2 class="roi-h2">
          Stop burning ad spend.
          <em>Capture every lead.</em>
        </h2>
        <p class="roi-sub">
          When ad leads wait more than 15 minutes, conversion rates drop by 391%. Adyant Nexa eliminates the leak entirely by engaging in 1.2 seconds.
        </p>

        <a href="https://wa.me/?text=Hi%2C%20I%20am%20a%20Dubai%20Real%20Estate%20Agency%20Principal.%20I%20want%20to%20pilot%20Adyant%20Nexa." target="_blank" class="btn-pill-primary" style="background: var(--cobalt); border-color: var(--cobalt); padding: 14px 28px;">
          Claim Pilot Deployment ↗
        </a>
      </div>

      <div class="slider-container">
        <div class="slider-top">
          <span class="slider-lbl">MONTHLY INBOUND PROPERTY LEADS</span>
          <span class="slider-val" id="leadsVal">300</span>
        </div>
        <input type="range" min="50" max="1000" step="25" value="300" class="styled-range" id="rangeInput" oninput="recalcROI(this.value)">

        <div class="result-split">
          <div>
            <div class="result-num" id="extraViewingsVal">+45</div>
            <div class="result-lbl">Extra Qualified Viewings Booked / mo</div>
          </div>
          <div>
            <div class="result-num" id="extraCommVal" style="color: var(--cyan-bright);">AED 180,000</div>
            <div class="result-lbl">Estimated Commission Uplift (@ 2% on AED 2M)</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand-emblem">
        <img src="/logo.svg" alt="Adyant Nexa Logo" class="footer-logo-img">
        <div class="footer-brand-title">ADYANT <span>NEXA.</span></div>
        <div class="footer-brand-sub">Autonomous Real Estate Operating Systems · Dubai // India Core</div>
      </div>

      <div class="footer-links">
        <a href="#architecture">Architecture</a>
        <span>·</span>
        <a href="#intelligence">BANT Intelligence</a>
        <span>·</span>
        <a href="#roi">Yield Calculator</a>
        <span>·</span>
        <a href="/admin">Command Centre ↗</a>
      </div>

      <div class="footer-meta-bar">
        <div>© 2026 ADYANT NEXA. ALL RIGHTS RESERVED.</div>
        <div>INTELLIGENT SYSTEMS. BETTER BUSINESS OUTCOMES.</div>
      </div>
    </div>
  </footer>

  <script>
    function recalcROI(leads) {
      document.getElementById('leadsVal').innerText = leads;
      const extraViewings = Math.round(leads * 0.15);
      const commission = Math.round(extraViewings * 0.1 * 40000);
      document.getElementById('extraViewingsVal').innerText = '+' + extraViewings;
      document.getElementById('extraCommVal').innerText = 'AED ' + commission.toLocaleString();
    }
  </script>
</body>
</html>`;
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// ADYANT NEXA — EXECUTIVE SALES TERMINAL (/admin)
// Engineered with agency-brand-guardian, agency-ui-finish-gate-reviewer,
// agency-ux-architect, and agency-frontend-developer
// Bloomberg Terminal meets Linear: Geist Mono, Syne, Inter, Hotkeys
// -------------------------------------------------------------
function getInteractiveDashboardHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ADYANT NEXA — Executive Command Terminal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-terminal: #07090E;
      --bg-panel: #0D111A;
      --bg-card: #121824;
      --bg-card-hover: #182030;
      --border-base: rgba(255, 255, 255, 0.08);
      --border-accent: rgba(0, 71, 255, 0.4);
      --cobalt: #0047FF;
      --cobalt-hover: #1A5CFF;
      --blue-tint: #E7ECFF;
      --slate: #60606A;
      --text-main: #F8FAFC;
      --text-muted: #8E9BAE;
      --emerald: #10B981;
      --amber: #F59E0B;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; outline: none; -webkit-font-smoothing: antialiased; }
    body {
      background: var(--bg-terminal);
      color: var(--text-main);
      font-family: 'Inter', -apple-system, sans-serif;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Top Terminal Header */
    .terminal-nav {
      height: 48px;
      background: var(--bg-panel);
      border-bottom: 1px solid var(--border-base);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      flex-shrink: 0;
      z-index: 50;
    }
    .brand-cluster {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-logo-sq {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      background: #090C14;
      border: 1px solid var(--border-accent);
      object-fit: contain;
    }
    .brand-logotype {
      font-family: 'Syne', sans-serif;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: -0.01em;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-logotype span { color: var(--cobalt); }
    .badge-terminal {
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
      padding: 2px 6px;
      background: rgba(0, 71, 255, 0.15);
      border: 1px solid var(--border-accent);
      border-radius: 4px;
      color: var(--blue-tint);
      letter-spacing: 0.1em;
    }
    .link-public {
      font-size: 11px;
      font-family: 'Geist Mono', monospace;
      color: var(--text-muted);
      text-decoration: none;
      padding: 3px 8px;
      border: 1px solid var(--border-base);
      border-radius: 4px;
      transition: all 0.15s ease;
      margin-left: 8px;
    }
    .link-public:hover {
      color: #FFFFFF;
      border-color: var(--cobalt);
    }

    .telemetry-rack {
      display: flex;
      align-items: center;
      gap: 20px;
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
    }
    .tele-stat {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .pulse-dot {
      width: 6px;
      height: 6px;
      background: var(--emerald);
      border-radius: 50%;
      box-shadow: 0 0 6px var(--emerald);
    }

    /* Main Workbench */
    .workbench-stage {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* 1. Left Nav Rail */
    .nav-column {
      width: 220px;
      background: var(--bg-panel);
      border-right: 1px solid var(--border-base);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      padding: 16px 12px;
      gap: 24px;
    }
    .nav-label {
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--slate);
      padding: 0 8px 6px;
    }
    .nav-tab {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .nav-tab:hover {
      background: var(--bg-card);
      color: var(--text-main);
    }
    .nav-tab.active {
      background: rgba(0, 71, 255, 0.14);
      border: 1px solid rgba(0, 71, 255, 0.35);
      color: #FFFFFF;
    }
    .nav-badge-count {
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
    }
    .nav-tab.active .nav-badge-count {
      background: var(--cobalt);
      color: #FFFFFF;
    }

    /* Hotkey Box in Rail */
    .hotkey-legend {
      margin-top: auto;
      background: #090C14;
      border: 1px solid var(--border-base);
      border-radius: 8px;
      padding: 12px;
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
      color: var(--text-muted);
      line-height: 1.8;
    }
    .key-tag {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      padding: 1px 4px;
      color: #FFFFFF;
    }

    /* 2. Middle Leads Stream */
    .inbox-column {
      width: 360px;
      background: var(--bg-terminal);
      border-right: 1px solid var(--border-base);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      overflow: hidden;
    }
    .inbox-search-bar {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-base);
      background: var(--bg-panel);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .inbox-input {
      width: 100%;
      background: var(--bg-terminal);
      border: 1px solid var(--border-base);
      border-radius: 6px;
      padding: 7px 10px;
      font-size: 12px;
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
    }
    .inbox-input:focus { border-color: var(--cobalt); }

    .inbox-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .lead-tile {
      background: var(--bg-panel);
      border: 1px solid var(--border-base);
      border-radius: 8px;
      padding: 12px 14px;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .lead-tile:hover {
      border-color: rgba(255, 255, 255, 0.18);
      background: var(--bg-card);
    }
    .lead-tile.selected {
      border-color: var(--cobalt);
      background: var(--bg-card-hover);
      box-shadow: inset 3px 0 0 0 var(--cobalt);
    }
    .lead-tile-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .lead-tile-title {
      font-size: 13px;
      font-weight: 600;
      color: #FFFFFF;
    }
    .lead-tile-time {
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
      color: var(--slate);
    }
    .lead-tile-meta {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--blue-tint);
      display: flex;
      gap: 8px;
    }
    .lead-tile-msg {
      font-size: 12px;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .lead-tile-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 6px;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
    }
    .score-chip {
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }

    /* 3. Right Master Stage */
    .stage-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--bg-panel);
      overflow: hidden;
    }

    /* Dossier Top Bar */
    .dossier-header {
      padding: 14px 24px;
      border-bottom: 1px solid var(--border-base);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-panel);
    }
    .buyer-identity {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .buyer-avatar {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: #090C14;
      border: 1px solid var(--border-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Syne', sans-serif;
      font-size: 13px;
      font-weight: 800;
      color: var(--blue-tint);
    }
    .buyer-name-h2 {
      font-family: 'Syne', sans-serif;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.01em;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .buyer-phone-sub {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* Action Buttons */
    .btn-dock {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-terminal {
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: none;
    }
    .btn-cobalt {
      background: var(--cobalt);
      color: #FFFFFF;
    }
    .btn-cobalt:hover { background: var(--cobalt-hover); }
    .btn-ghost-dark {
      background: var(--bg-card);
      border: 1px solid var(--border-base);
      color: var(--text-main);
    }
    .btn-ghost-dark:hover {
      border-color: rgba(255, 255, 255, 0.2);
      background: var(--bg-card-hover);
    }
    .btn-takeover-alert {
      background: rgba(245, 158, 11, 0.15) !important;
      border: 1px solid var(--amber) !important;
      color: #FCD34D !important;
    }

    /* BANT Compact Ribbon */
    .bant-ribbon {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1px;
      background: var(--border-base);
      border-bottom: 1px solid var(--border-base);
    }
    .bant-cell {
      background: var(--bg-terminal);
      padding: 10px 18px;
    }
    .bant-tag {
      font-family: 'Geist Mono', monospace;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--slate);
      margin-bottom: 3px;
    }
    .bant-val-text {
      font-family: 'Geist Mono', monospace;
      font-size: 12px;
      font-weight: 600;
      color: #FFFFFF;
    }

    /* WhatsApp Chat Transcript Stream */
    .chat-stage {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #080A10;
    }
    .msg-row {
      display: flex;
      flex-direction: column;
      max-width: 72%;
    }
    .msg-row.user { align-self: flex-start; }
    .msg-row.bot { align-self: flex-end; }

    .msg-meta {
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
      color: var(--slate);
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .msg-row.bot .msg-meta {
      justify-content: flex-end;
      color: var(--blue-tint);
    }

    .bubble-card {
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 13px;
      line-height: 1.55;
    }
    .msg-row.user .bubble-card {
      background: #141722;
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #F8FAFC;
      border-bottom-left-radius: 2px;
    }
    .msg-row.bot .bubble-card {
      background: #071536;
      border: 1px solid var(--border-accent);
      color: #FFFFFF;
      border-bottom-right-radius: 2px;
    }

    /* Canned Response Shortcuts */
    .canned-ribbon {
      padding: 8px 24px;
      background: var(--bg-panel);
      border-top: 1px solid var(--border-base);
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
    }
    .canned-chip {
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
      padding: 4px 10px;
      border-radius: 4px;
      background: var(--bg-terminal);
      border: 1px solid var(--border-base);
      color: var(--text-muted);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .canned-chip:hover {
      border-color: var(--cobalt);
      color: #FFFFFF;
    }

    /* Bottom Input Bar */
    .input-dock {
      padding: 12px 24px;
      background: var(--bg-panel);
      border-top: 1px solid var(--border-base);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .chat-text-input {
      flex: 1;
      background: var(--bg-terminal);
      border: 1px solid var(--border-base);
      border-radius: 6px;
      padding: 9px 14px;
      font-size: 12px;
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
    }
    .chat-text-input:focus { border-color: var(--cobalt); }

    /* Animated Toast Notification */
    .toast-box {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0E162A;
      border: 1px solid var(--cobalt);
      color: #FFFFFF;
      padding: 10px 18px;
      border-radius: 6px;
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      font-weight: 500;
      display: none;
      box-shadow: 0 10px 30px rgba(0, 71, 255, 0.25);
      z-index: 1000;
      animation: slideIn 0.2s ease-out;
    }
    @keyframes slideIn {
      from { transform: translateY(12px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  </style>
</head>
<body>

  <div id="toastBox" class="toast-box">Notification</div>

  <!-- Top Terminal Header -->
  <header class="terminal-nav">
    <div class="brand-cluster">
      <img src="/brand-logo.png" alt="AN" class="brand-logo-sq" onerror="this.style.display='none'">
      <div class="brand-logotype">
        ADYANT <span>NEXA.</span>
        <span class="badge-terminal">TERMINAL v1.4</span>
      </div>
      <a href="/" class="link-public">← Public Site</a>
    </div>

    <div class="telemetry-rack">
      <div class="tele-stat">
        <div class="pulse-dot"></div>
        <span>WHATSAPP ENGINE: ONLINE</span>
      </div>
      <div class="tele-stat">
        <span>FAILOVER: 0ms</span>
      </div>
      <div class="tele-stat">
        <span id="dubaiClock">DUBAI (GST): --:--:--</span>
      </div>
    </div>
  </header>

  <!-- 3-Pane Workbench -->
  <div class="workbench-stage">

    <!-- 1. Left Nav Rail -->
    <aside class="nav-column">
      <div>
        <div class="nav-label">PIPELINE TIERS</div>
        <div class="nav-tab active" onclick="setPipelineFilter('all', this)">
          <span>All Inquiries</span>
          <span class="nav-badge-count" id="countAll">1</span>
        </div>
        <div class="nav-tab" onclick="setPipelineFilter('hot', this)">
          <span>HOT Buyers (80+)</span>
          <span class="nav-badge-count" id="countHot">1</span>
        </div>
        <div class="nav-tab" onclick="setPipelineFilter('warm', this)">
          <span>Under Nurture</span>
          <span class="nav-badge-count" id="countWarm">0</span>
        </div>
        <div class="nav-tab" onclick="setPipelineFilter('takeover', this)">
          <span>Human Review</span>
          <span class="nav-badge-count" id="countTakeover">0</span>
        </div>
      </div>

      <div>
        <div class="nav-label">CHANNELS</div>
        <div class="nav-tab">
          <span>WhatsApp Multi-Device</span>
          <span style="color: var(--emerald); font-family: monospace;">● ON</span>
        </div>
        <div class="nav-tab">
          <span>Instagram Direct</span>
          <span style="color: var(--slate); font-family: monospace;">STANDBY</span>
        </div>
      </div>

      <!-- Hotkeys Legend -->
      <div class="hotkey-legend">
        <div style="font-weight: 600; color: #FFFFFF; margin-bottom: 4px;">OPERATOR SHORTCUTS</div>
        <div><span class="key-tag">J</span> / <span class="key-tag">K</span> Navigate leads</div>
        <div><span class="key-tag">T</span> Toggle Takeover</div>
        <div><span class="key-tag">B</span> Dispatch Brochure</div>
        <div><span class="key-tag">V</span> Schedule VIP</div>
        <div><span class="key-tag">/</span> Focus Search</div>
      </div>
    </aside>

    <!-- 2. Middle Leads Inbox -->
    <section class="inbox-column">
      <div class="inbox-search-bar">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span style="font-family: 'Geist Mono', monospace; font-size: 10px; font-weight: 600; color: var(--slate); letter-spacing: 0.2em;">INBOUND PIPELINE</span>
          <span style="font-family: 'Geist Mono', monospace; font-size: 10px; color: var(--cobalt);">SYNCED</span>
        </div>
        <input type="text" id="leadSearchBox" class="inbox-input" placeholder="Search investor name, budget, area... (/)" oninput="filterLeads(this.value)">
      </div>

      <div class="inbox-scroll" id="leadsContainer"></div>
    </section>

    <!-- 3. Right Master Stage -->
    <section class="stage-column">
      
      <!-- Dossier Header -->
      <div class="dossier-header">
        <div class="buyer-identity">
          <div class="buyer-avatar" id="leadAvatar">DI</div>
          <div>
            <div class="buyer-name-h2">
              <span id="leadTitle">Verified Dubai Investor</span>
              <span class="score-chip" id="leadScoreBadge" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #34D399;">HOT · 85</span>
              <span id="takeoverIndicator" style="display: none; font-size: 9px; padding: 2px 6px; border-radius: 4px; background: rgba(245, 158, 11, 0.2); border: 1px solid var(--amber); color: #FCD34D; font-family: monospace;">HUMAN ACTIVE</span>
            </div>
            <div class="buyer-phone-sub" id="leadPhoneSubtitle">+971 52 896 4833 (UAE)</div>
          </div>
        </div>

        <div class="btn-dock">
          <button id="btnTakeoverAction" class="btn-terminal btn-ghost-dark" onclick="doTakeover()">
            <span>Take Over Chat</span> <span class="key-tag">T</span>
          </button>
          <button id="btnBrochureAction" class="btn-terminal btn-ghost-dark" onclick="doBrochure()">
            <span>Dispatch Brochure</span> <span class="key-tag">B</span>
          </button>
          <button id="btnViewingAction" class="btn-terminal btn-cobalt" onclick="doViewing()">
            <span>Schedule VIP</span> <span class="key-tag">V</span>
          </button>
        </div>
      </div>

      <!-- BANT Compact Ribbon -->
      <div class="bant-ribbon">
        <div class="bant-cell">
          <div class="bant-tag">VERIFIED BUDGET</div>
          <div class="bant-val-text" id="bantBudgetField" style="color: var(--blue-tint);">AED 2,500,000</div>
        </div>
        <div class="bant-cell">
          <div class="bant-tag">TARGET LOCATION</div>
          <div class="bant-val-text" id="bantLocationField">Downtown Dubai</div>
        </div>
        <div class="bant-cell">
          <div class="bant-tag">INVESTMENT GOAL</div>
          <div class="bant-val-text" id="bantIntentField">Rental Yield (ROI)</div>
        </div>
        <div class="bant-cell">
          <div class="bant-tag">UNIT PREFERENCE</div>
          <div class="bant-val-text" id="bantUnitField">3-Bed Apartment</div>
        </div>
      </div>

      <!-- Chat Transcript Stream -->
      <div class="chat-stage" id="chatStreamBox"></div>

      <!-- 1-Click Canned Response Ribbon -->
      <div class="canned-ribbon">
        <span style="font-family: 'Geist Mono', monospace; font-size: 9px; color: var(--slate);">MACROS:</span>
        <div class="canned-chip" onclick="pasteMacro('Here are 3 handpicked Downtown luxury apartments ready for Q3 2026 handover with 1% monthly payment plan:')">+ Downtown 1% Plan</div>
        <div class="canned-chip" onclick="pasteMacro('Our Senior Investment Director is available for a private 5-minute briefing today. Would 3 PM or 5 PM GST suit you?')">+ Request Call</div>
        <div class="canned-chip" onclick="pasteMacro('With a purchase of AED 2M+, you qualify for the UAE 10-Year Golden Visa. We handle the paperwork with DLD.')">+ Golden Visa Info</div>
      </div>

      <!-- Bottom Chat Input -->
      <div class="input-dock">
        <input type="text" id="chatInputMessage" class="chat-text-input" placeholder="Type a message to dispatch directly on WhatsApp to this lead..." onkeydown="if(event.key==='Enter') doSendMessage()">
        <button class="btn-terminal btn-cobalt" onclick="doSendMessage()">Send to WhatsApp ↗</button>
      </div>

    </section>

  </div>

  <script>
    let allLeads = [];
    let visibleLeads = [];
    let selectedLeadIndex = 0;
    let currentFilter = 'all';

    function notify(text) {
      const box = document.getElementById('toastBox');
      box.innerText = text;
      box.style.display = 'block';
      setTimeout(() => { box.style.display = 'none'; }, 3000);
    }

    // Dubai GST Clock
    setInterval(() => {
      const d = new Date();
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      const gst = new Date(utc + (3600000 * 4));
      document.getElementById('dubaiClock').innerText = 'DUBAI (GST): ' + gst.toLocaleTimeString('en-GB');
    }, 1000);

    async function refreshData() {
      try {
        const res = await fetch('/api/leads');
        const leads = await res.json();
        allLeads = leads;
        applyCurrentFilter();
      } catch (e) {
        console.error(e);
      }
    }

    function setPipelineFilter(filter, el) {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      if (el) el.classList.add('active');
      currentFilter = filter;
      applyCurrentFilter();
    }

    function filterLeads(query) {
      applyCurrentFilter(query);
    }

    function applyCurrentFilter(search = '') {
      let filtered = [...allLeads];
      const q = (search || document.getElementById('leadSearchBox').value || '').toLowerCase().trim();

      if (currentFilter === 'hot') {
        filtered = filtered.filter(l => (l.qualification?.score || 0) >= 80);
      } else if (currentFilter === 'warm') {
        filtered = filtered.filter(l => (l.qualification?.score || 0) < 80);
      } else if (currentFilter === 'takeover') {
        filtered = filtered.filter(l => l.human_takeover === true);
      }

      if (q) {
        filtered = filtered.filter(l => 
          (l.display_title || '').toLowerCase().includes(q) ||
          (l.formatted_phone || '').toLowerCase().includes(q) ||
          (l.last_message || '').toLowerCase().includes(q) ||
          (l.qualification?.preferred_areas || []).some(a => a.toLowerCase().includes(q))
        );
      }

      visibleLeads = filtered;

      document.getElementById('countAll').innerText = allLeads.length;
      document.getElementById('countHot').innerText = allLeads.filter(l => (l.qualification?.score || 0) >= 80).length;
      document.getElementById('countWarm').innerText = allLeads.filter(l => (l.qualification?.score || 0) < 80).length;
      document.getElementById('countTakeover').innerText = allLeads.filter(l => l.human_takeover === true).length;

      renderList();
      if (visibleLeads.length > 0) {
        if (selectedLeadIndex >= visibleLeads.length) selectedLeadIndex = 0;
        renderStage(visibleLeads[selectedLeadIndex]);
      }
    }

    function renderList() {
      const container = document.getElementById('leadsContainer');
      if (!visibleLeads || visibleLeads.length === 0) {
        container.innerHTML = '<div style="padding: 24px; font-size: 11px; font-family: monospace; color: var(--slate);">No leads matching criteria.</div>';
        return;
      }

      let html = '';
      visibleLeads.forEach((lead, idx) => {
        const isSel = idx === selectedLeadIndex ? 'selected' : '';
        const q = lead.qualification || {};
        const score = q.score || 0;
        const isHot = score >= 80;
        const scoreStyle = isHot 
          ? 'background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #34D399;'
          : 'background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); color: #FBBF24;';

        html += \`
          <div class="lead-tile \${isSel}" onclick="selectLead(\${idx})">
            <div class="lead-tile-top">
              <span class="lead-tile-title">\${lead.display_title || lead.formatted_phone || 'Dubai Investor'}</span>
              <span class="lead-tile-time">Active</span>
            </div>
            <div class="lead-tile-meta">
              <span>📍 \${(q.preferred_areas && q.preferred_areas[0]) || 'Downtown'}</span>
              <span>·</span>
              <span>💰 \${q.budget_aed || 'AED 2.5M'}</span>
            </div>
            <div class="lead-tile-msg">"\${lead.last_message || ''}"</div>
            <div class="lead-tile-bottom">
              <span style="color: var(--slate);">\${lead.formatted_phone || lead.phone}</span>
              <span class="score-chip" style="\${scoreStyle}">
                \${q.status || 'WARM'} · \${score}
              </span>
            </div>
          </div>
        \`;
      });
      container.innerHTML = html;
    }

    function renderStage(lead) {
      if (!lead) return;
      const q = lead.qualification || {};
      const score = q.score || 0;

      document.getElementById('leadTitle').innerText = lead.display_title || 'Verified Dubai Investor';
      document.getElementById('leadPhoneSubtitle').innerText = lead.formatted_phone || lead.phone;
      document.getElementById('leadScoreBadge').innerText = \`\${q.status || 'WARM'} · \${score}\`;

      const initials = (lead.display_title || 'DI').split(' ').map(n => n[0]).join('').slice(0, 2);
      document.getElementById('leadAvatar').innerText = initials;

      const btnTakeover = document.getElementById('btnTakeoverAction');
      const tagTakeover = document.getElementById('takeoverIndicator');
      if (lead.human_takeover) {
        btnTakeover.innerText = 'Resume AI (T)';
        btnTakeover.classList.add('btn-takeover-alert');
        tagTakeover.style.display = 'inline-block';
      } else {
        btnTakeover.innerText = 'Take Over Chat (T)';
        btnTakeover.classList.remove('btn-takeover-alert');
        tagTakeover.style.display = 'none';
      }

      document.getElementById('bantBudgetField').innerText = q.budget_aed || 'AED 2,500,000';
      document.getElementById('bantLocationField').innerText = (q.preferred_areas && q.preferred_areas.join(', ')) || 'Downtown Dubai';
      document.getElementById('bantIntentField').innerText = q.intent ? q.intent.replace(/_/g, ' ') : 'Rental Yield (8-10%)';
      document.getElementById('bantUnitField').innerText = q.property_type || '3-Bed Apartment';

      const chatBox = document.getElementById('chatStreamBox');
      const messages = lead.messages || [{ role: 'user', text: lead.last_message || 'Inquiry received.' }];

      let chatHtml = '';
      messages.forEach(m => {
        const isBot = m.role === 'model';
        const roleClass = isBot ? 'bot' : 'user';
        const authorLabel = isBot ? '⚡ NEXA AI ENGINE' : '👤 VERIFIED INVESTOR';

        chatHtml += \`
          <div class="msg-row \${roleClass}">
            <div class="msg-meta">
              <span>\${authorLabel}</span>
              <span>\${m.timestamp || ''}</span>
            </div>
            <div class="bubble-card">
              \${m.text.replace(/\\n/g, '<br>')}
            </div>
          </div>
        \`;
      });
      chatBox.innerHTML = chatHtml;
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function selectLead(idx) {
      selectedLeadIndex = idx;
      renderList();
      renderStage(visibleLeads[idx]);
    }

    function pasteMacro(text) {
      const input = document.getElementById('chatInputMessage');
      input.value = text;
      input.focus();
    }

    // -------------------------------------------------------------
    // KEYBOARD SHORTCUTS ENGINE
    // -------------------------------------------------------------
    window.addEventListener('keydown', (e) => {
      // Don't intercept when user is typing inside text input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') e.target.blur();
        return;
      }

      if (e.key === 'j' || e.key === 'ArrowDown') {
        if (selectedLeadIndex < visibleLeads.length - 1) {
          selectLead(selectedLeadIndex + 1);
        }
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        if (selectedLeadIndex > 0) {
          selectLead(selectedLeadIndex - 1);
        }
      } else if (e.key === 't' || e.key === 'T') {
        doTakeover();
      } else if (e.key === 'b' || e.key === 'B') {
        doBrochure();
      } else if (e.key === 'v' || e.key === 'V') {
        doViewing();
      } else if (e.key === '/') {
        e.preventDefault();
        document.getElementById('leadSearchBox').focus();
      }
    });

    // -------------------------------------------------------------
    // REAL BACKEND API HANDLERS
    // -------------------------------------------------------------
    async function doSendMessage() {
      const input = document.getElementById('chatInputMessage');
      const text = input.value.trim();
      if (!text) return;

      const current = visibleLeads[selectedLeadIndex];
      if (!current) return;

      input.value = '';
      notify('Delivering message to WhatsApp...');

      try {
        const res = await fetch('/api/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jid: current.raw_jid, text })
        });
        const data = await res.json();
        if (data.success) {
          notify('✓ Message delivered to investor on WhatsApp');
          refreshData();
        }
      } catch (err) {
        notify('Network error');
      }
    }

    async function doTakeover() {
      const current = visibleLeads[selectedLeadIndex];
      if (!current) return;

      try {
        const res = await fetch('/api/toggle-takeover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jid: current.raw_jid })
        });
        const data = await res.json();
        if (data.success) {
          notify(data.human_takeover ? 'AI paused. Human operator in control.' : 'AI bot resumed.');
          refreshData();
        }
      } catch (err) {
        notify('Error');
      }
    }

    async function doBrochure() {
      const current = visibleLeads[selectedLeadIndex];
      if (!current) return;

      notify('Dispatching luxury PDF portfolio...');
      try {
        const res = await fetch('/api/dispatch-brochure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jid: current.raw_jid })
        });
        const data = await res.json();
        if (data.success) {
          notify('✓ Portfolio delivered on WhatsApp');
          refreshData();
        }
      } catch (err) {
        notify('Error');
      }
    }

    async function doViewing() {
      const current = visibleLeads[selectedLeadIndex];
      if (!current) return;

      notify('Dispatching VIP viewing calendar...');
      try {
        const res = await fetch('/api/schedule-viewing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jid: current.raw_jid })
        });
        const data = await res.json();
        if (data.success) {
          notify('✓ VIP viewing invite sent on WhatsApp');
          refreshData();
        }
      } catch (err) {
        notify('Error');
      }
    }

    refreshData();
    setInterval(refreshData, 2000);
  </script>
</body>
</html>`;
}

// -------------------------------------------------------------
// WHATSAPP BOT ENGINE
// -------------------------------------------------------------
async function startWhatsAppBot() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: state,
    browser: ['Adyant Nexa OS', 'Chrome', '1.0.0']
  });

  globalSock = sock;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('📱 WHATSAPP QR READY: Open qr_code.html to scan');
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        setTimeout(startWhatsAppBot, 3000);
      }
    } else if (connection === 'open') {
      console.log('🟢 WHATSAPP CONNECTED & READY TO RECEIVE/SEND MESSAGES!');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe || msg.key.remoteJid.includes('@g.us') || msg.key.remoteJid === 'status@broadcast') {
        continue;
      }

      const remoteJid = msg.key.remoteJid;
      const pushName = msg.pushName || '';
      const userText = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

      if (!userText || !userText.trim()) continue;

      console.log(`📩 Incoming from ${remoteJid}: "${userText}"`);

      if (!conversations.has(remoteJid)) {
        conversations.set(remoteJid, []);
      }
      const history = conversations.get(remoteJid);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      history.push({ role: 'user', text: userText, timestamp: time });

      // Check Human Takeover
      if (humanTakeoverMap.get(remoteJid) === true) {
        console.log(`[Human Takeover] Skipping AI generation for ${remoteJid}`);
        recordLead(remoteJid, userText, null, pushName, history);
        continue;
      }

      try {
        await sock.sendPresenceUpdate('composing', remoteJid);
        const result = await qualifyDubaiLead(history);
        await new Promise(r => setTimeout(r, 1200));

        const replyText = result.reply_message || "Thank you for reaching out to Adyant Nexa.";
        await sock.sendMessage(remoteJid, { text: replyText });

        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        history.push({ role: 'model', text: replyText, timestamp: replyTime });

        console.log(`🤖 AI Reply sent to ${remoteJid}`);
        recordLead(remoteJid, userText, result, pushName, history);
      } catch (err) {
        console.error('❌ Error processing message with Gemini:', err.message);
      }
    }
  });
}

// Start both WhatsApp socket & Dashboard Server together
startDashboardServer();
startWhatsAppBot().catch(console.error);
