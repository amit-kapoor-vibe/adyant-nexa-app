import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, 'public');
const socialDir = path.join(publicDir, 'social');
const htmlStudioDir = path.join(projectRoot, 'scripts', 'social', 'studios');

if (!fs.existsSync(socialDir)) fs.mkdirSync(socialDir, { recursive: true });
if (!fs.existsSync(htmlStudioDir)) fs.mkdirSync(htmlStudioDir, { recursive: true });

// 1. Read Original Logo SVG
const logoPath = path.join(publicDir, 'logo.svg');
let logoSvgContent = '';
if (fs.existsSync(logoPath)) {
  logoSvgContent = fs.readFileSync(logoPath, 'utf8');
}

// 2. Build 1080 x 1350 High-End Brand Studio HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Day 04: The Golden Visa Trigger</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500;600;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      width: 1080px;
      height: 1350px;
      background-color: #F8F8FA;
      color: #0A0A0C;
      font-family: 'Inter', -apple-system, sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 80px 88px;
      position: relative;
    }

    /* Ambient Subtle Grid */
    .grid-bg {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 1px 1px, rgba(10, 10, 12, 0.04) 1.5px, transparent 0);
      background-size: 48px 48px;
      pointer-events: none;
      z-index: 1;
    }

    /* Top Brand Bar */
    .top-bar {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 28px;
      border-bottom: 1.5px solid rgba(10, 10, 12, 0.08);
    }

    .brand-identity {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-logo-wrap {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-logo-wrap svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .brand-name {
      font-family: 'Syne', sans-serif;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0A0A0C;
    }
    .brand-name span { color: #0047FF; }

    .tag-category {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #0047FF;
      background: #E7ECFF;
      padding: 8px 16px;
      border-radius: 999px;
      border: 1px solid rgba(0, 71, 255, 0.15);
    }

    /* Main Content Container */
    .main-block {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 36px;
      margin: auto 0;
    }

    .headline-wrap {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .super-label {
      font-family: 'Geist Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: #60606A;
      font-weight: 600;
    }

    .main-title {
      font-family: 'Syne', sans-serif;
      font-size: 64px;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.035em;
      color: #0A0A0C;
    }

    .main-italic {
      font-family: 'Instrument Serif', Georgia, serif;
      font-style: italic;
      font-size: 34px;
      font-weight: 400;
      color: #0047FF;
      line-height: 1.2;
      margin-top: 4px;
    }

    /* UI Card: The Nexa BANT & Golden Visa Node */
    .telemetry-card {
      background: #FFFFFF;
      border: 1.5px solid rgba(10, 10, 12, 0.08);
      border-radius: 24px;
      padding: 38px 42px;
      box-shadow: 0 16px 48px -4px rgba(10, 10, 12, 0.06);
      display: flex;
      flex-direction: column;
      gap: 24px;
      position: relative;
    }

    .telemetry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 18px;
      border-bottom: 1px solid rgba(10, 10, 12, 0.06);
    }

    .telemetry-status {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #0A0A0C;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 12px #10B981;
    }

    .telemetry-time {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: #60606A;
      letter-spacing: 0.1em;
    }

    /* Simulated Inbound Dialogue */
    .dialogue-box {
      background: #F8F8FA;
      border: 1px solid rgba(10, 10, 12, 0.06);
      border-radius: 14px;
      padding: 20px 22px;
    }

    .dialogue-user {
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: #0047FF;
      margin-bottom: 6px;
      text-transform: uppercase;
    }

    .dialogue-text {
      font-size: 15px;
      line-height: 1.5;
      color: #0A0A0C;
      font-weight: 500;
    }

    /* Grid of Verified Indicators */
    .telemetry-metrics {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .metric-pill {
      background: #FFFFFF;
      border: 1px solid rgba(10, 10, 12, 0.08);
      border-radius: 12px;
      padding: 16px 20px;
    }

    .metric-label {
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #60606A;
      margin-bottom: 4px;
    }

    .metric-value {
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #0A0A0C;
    }

    .metric-value.highlight-green {
      color: #059669;
    }

    .metric-value.highlight-cobalt {
      color: #0047FF;
    }

    /* Bottom Bar */
    .bottom-bar {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 28px;
      border-top: 1.5px solid rgba(10, 10, 12, 0.08);
    }

    .bottom-meta {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.2em;
      color: #60606A;
      text-transform: uppercase;
    }

    .bottom-cta {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #0A0A0C;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .bottom-cta span { color: #0047FF; }
  </style>
</head>
<body>
  <div class="grid-bg"></div>

  <!-- Top Header -->
  <div class="top-bar">
    <div class="brand-identity">
      <div class="brand-logo-wrap">
        ${logoSvgContent}
      </div>
      <div class="brand-name">ADYANT <span>NEXA.</span></div>
    </div>
    <div class="tag-category">DUBAI REAL ESTATE OS</div>
  </div>

  <!-- Main Showcase -->
  <div class="main-block">
    <div class="headline-wrap">
      <div class="super-label">AUTONOMOUS CONVERSATIONAL COMMERCE // 04</div>
      <h1 class="main-title">THE AED 2,000,000<br/>QUALIFICATION FILTER.</h1>
      <div class="main-italic">Qualifying overseas investors in 90 seconds while your brokers sleep.</div>
    </div>

    <!-- Live Telemetry Card -->
    <div class="telemetry-card">
      <div class="telemetry-header">
        <div class="telemetry-status">
          <div class="live-dot"></div>
          <span>AUTONOMOUS BANT ENGINE // LIVE TELEMETRY</span>
        </div>
        <div class="telemetry-time">LATENCY: 1.2 SECONDS</div>
      </div>

      <div class="dialogue-box">
        <div class="dialogue-user">Inbound Meta Inquiry // WhatsApp (London, UK)</div>
        <div class="dialogue-text">"Looking for a 3-bedroom off-plan penthouse in Downtown Dubai around 2.5M AED budget with high rental yield."</div>
      </div>

      <div class="telemetry-metrics">
        <div class="metric-pill">
          <div class="metric-label">BANT Lead Status</div>
          <div class="metric-value highlight-green">HOT LEAD · 88/100</div>
        </div>
        <div class="metric-pill">
          <div class="metric-label">Target Property Budget</div>
          <div class="metric-value">AED 2,500,000</div>
        </div>
        <div class="metric-pill">
          <div class="metric-label">10-Yr Golden Visa</div>
          <div class="metric-value highlight-green">ELIGIBLE (AED 2M+)</div>
        </div>
        <div class="metric-pill">
          <div class="metric-label">Developer Fleet Match</div>
          <div class="metric-value highlight-cobalt">EMAAR / DOWNTOWN</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Details -->
  <div class="bottom-bar">
    <div class="bottom-meta">DUBAI PRIME FLEET · EMAAR // SOBHA // DAMAC</div>
    <div class="bottom-cta">adyantnexa.com <span>↗</span></div>
  </div>
</body>
</html>
`;

const studioPath = path.join(htmlStudioDir, 'day04.html');
fs.writeFileSync(studioPath, html, 'utf8');
console.log('Saved HTML Studio to:', studioPath);

// 3. Render High-Resolution PNG via Microsoft Edge Headless
const outputPngPath = path.join(socialDir, 'day04_golden_visa_trigger.png');
const edgePath = 'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe';

const renderCmd = `"${edgePath}" --headless --screenshot="${outputPngPath}" --window-size=1080,1350 --hide-scrollbars "file:///${studioPath.replace(/\\\\/g, '/')}"`;

console.log('Rendering high-res 1080x1350 image...');
execSync(renderCmd, { stdio: 'inherit' });
console.log('Rendered image successfully to:', outputPngPath);
