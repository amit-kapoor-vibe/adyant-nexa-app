import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { qualifyDubaiLead } from './nexa_sales_engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local safely
function loadEnv() {
  const candidatePaths = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(__dirname, '../../.env.local'),
    path.resolve(__dirname, '.env.local'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '.env')
  ];

  const env = {};
  for (const envPath of candidatePaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            const k = trimmed.substring(0, idx).trim();
            const v = trimmed.substring(idx + 1).trim();
            if (!env[k]) env[k] = v;
          }
        }
      }
    }
  }
  return { ...process.env, ...env };
}

const env = loadEnv();
const BOOKING_URL = env.BOOKING_URL || env.CALENDLY_URL || 'https://calendly.com/mit-kapur/30min';
const TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID;

async function sendTelegramAlert(title, details) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    const text = `<b>${title}</b>\n\n${details}`;
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML'
      })
    });
  } catch (err) {
    console.warn('[Telegram Alert Warning]', err.message);
  }
}

const PORT = process.env.PORT || env.PORT || 3050;
const AUTH_FOLDER = path.resolve(__dirname, 'whatsapp_auth_session');
const LEADS_FILE = path.resolve(__dirname, 'whatsapp_qualified_leads.json');
const BRAND_DIR = path.resolve(__dirname, '../../public/brand');
const IMAGES_DIR = path.resolve(__dirname, '../../public/images');
const QR_HTML_FILE = path.resolve(__dirname, 'qr_code.html');
const TERMINAL_HTML_FILE = path.resolve(__dirname, 'terminal.html');
const LANDING_HTML_FILE = path.resolve(__dirname, 'index.html');

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
            try {
              await Promise.race([
                globalSock.sendMessage(jid, { text }),
                new Promise((_, r) => setTimeout(() => r(new Error('Socket timeout')), 4000))
              ]);
            } catch (e) {
              console.warn('[WhatsApp Socket Notice]', e.message);
            }
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
          const brochureMsg = `*ADYANT NEXA — AUTONOMOUS SALES INFRASTRUCTURE BRIEF*\nHere is our executive agency briefing on how top Dubai brokerages deploy Nexa OS to capture 100% of midnight ad leads and achieve 3.2x viewing conversion:\n\nhttps://adyantnexa.com/nexa-agency-brief.pdf\n\nOur Founding Director is available for a 15-min Google Meet walkthrough. Select your preferred slot here:\n${BOOKING_URL}`;

          if (globalSock) {
            try {
              await Promise.race([
                globalSock.sendMessage(jid, { text: brochureMsg }),
                new Promise((_, r) => setTimeout(() => r(new Error('Socket timeout')), 4000))
              ]);
            } catch (e) {
              console.warn('[WhatsApp Socket Notice]', e.message);
            }
          }

          if (!conversations.has(jid)) conversations.set(jid, []);
          const history = conversations.get(jid);
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          history.push({ role: 'model', text: brochureMsg, timestamp: time });
          recordLead(jid, brochureMsg, null, '', history);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: "Agency Brief dispatched on WhatsApp" }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    // 5. API: POST /api/schedule-viewing (Google Meet 15-Min Strategy Session)
    if ((req.url === '/api/schedule-viewing' || req.url === '/api/schedule-meet') && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { jid } = JSON.parse(body);
          const viewingMsg = `*ADYANT NEXA — 15-MIN STRATEGY CALL (GOOGLE MEET)*\nWe have reserved a 15-minute private architecture walkthrough to show how Adyant Nexa eliminates midnight lead dropoff and qualifies buyers in 90 seconds.\n\nLock in your slot directly on our calendar (Google Meet invitation generated automatically):\n${BOOKING_URL}\n\nPrefer to book directly in chat? Simply reply with your preferred day/time (GST) and email address, and our director will confirm your calendar invite.`;

          if (globalSock) {
            try {
              await Promise.race([
                globalSock.sendMessage(jid, { text: viewingMsg }),
                new Promise((_, r) => setTimeout(() => r(new Error('Socket timeout')), 4000))
              ]);
            } catch (e) {
              console.warn('[WhatsApp Socket Notice]', e.message);
            }
          }

          if (!conversations.has(jid)) conversations.set(jid, []);
          const history = conversations.get(jid);
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          history.push({ role: 'model', text: viewingMsg, timestamp: time });
          recordLead(jid, viewingMsg, null, '', history);

          const phoneInfo = formatCleanPhone(jid);
          sendTelegramAlert(
            'VIP VIEWING INVITE DISPATCHED',
            `<b>Recipient:</b> ${phoneInfo.formatted_phone}\n<b>Booking Link:</b> ${BOOKING_URL}\n<b>Time:</b> ${time}`
          );

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: "Google Meet invitation sent on WhatsApp" }));
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
    if (req.url === '/' || req.url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      if (fs.existsSync(LANDING_HTML_FILE)) {
        res.end(fs.readFileSync(LANDING_HTML_FILE, 'utf8'));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('index.html not found');
      }
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  server.listen(PORT, () => {
    console.log(`💎 ADYANT NEXA — LANDING PAGE LIVE ON http://localhost:${PORT}`);
    console.log(`💎 EXECUTIVE COMMAND CENTRE ON http://localhost:${PORT}/admin`);
  });
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

        console.log(`[AI Response] Reply sent to ${remoteJid}`);
        recordLead(remoteJid, userText, result, pushName, history);

        // Instant notification when a meeting or preferred slot is mentioned
        const q = result.qualification || {};
        if (
          result.action_required === 'SCHEDULE_GOOGLE_MEET' ||
          q.google_meet_requested === true ||
          q.preferred_slot ||
          userText.toLowerCase().includes('meet') ||
          userText.toLowerCase().includes('call') ||
          userText.toLowerCase().includes('zoom') ||
          userText.toLowerCase().includes('schedule')
        ) {
          const phoneInfo = formatCleanPhone(remoteJid, pushName);
          const alertBody = [
            `<b>Investor/Broker:</b> ${phoneInfo.display_title}`,
            `<b>Phone:</b> ${phoneInfo.formatted_phone}`,
            `<b>Preferred Slot:</b> ${q.preferred_slot || 'Pending confirmation'}`,
            `<b>Email:</b> ${q.lead_email || 'Not provided'}`,
            `<b>Agency:</b> ${q.agency_name || 'N/A'} (${q.team_size || 'N/A'})`,
            `<b>Message:</b> ${userText}`,
            `<b>AI Reply:</b> ${replyText}`,
            `<b>Booking Link:</b> ${BOOKING_URL}`,
            `<b>Terminal:</b> https://adyantnexa.com/terminal`
          ].join('\n');
          sendTelegramAlert('HIGH INTENT: GOOGLE MEET INQUIRY', alertBody);
        }
      } catch (err) {
        console.error('[Gemini Error]', err.message);
      }
    }
  });
}

// Start both WhatsApp socket & Dashboard Server together
startDashboardServer();
startWhatsAppBot().catch(console.error);
