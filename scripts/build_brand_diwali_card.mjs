import fs from 'node:fs';
import path from 'node:path';

const inputImagePath = 'C:\\Users\\mi\\.gemini\\antigravity\\brain\\78fb201a-0338-4157-a58c-9509897f1b52\\adyant_nexa_diwali_minimalist_1794066907465.jpg';
const outputDir = path.resolve('public');
const imagesDir = path.join(outputDir, 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 1. Copy background image to public/images/
const publicBgPath = path.join(imagesDir, 'diwali-bg.jpg');
fs.copyFileSync(inputImagePath, publicBgPath);
console.log('Copied background image to:', publicBgPath);

// 2. Read background as Base64 for fully self-contained SVG
const imgBuffer = fs.readFileSync(inputImagePath);
const base64Img = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;

// Read logo.svg for direct embedding if present
let logoBase64 = '';
const logoPath = path.join(outputDir, 'logo.svg');
if (fs.existsSync(logoPath)) {
  const logoBuffer = fs.readFileSync(logoPath);
  logoBase64 = `data:image/svg+xml;base64,${logoBuffer.toString('base64')}`;
}

// 3. Generate Standalone 1080x1080 Brand-Accurate SVG with Syne + Instrument Serif + Geist Mono
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@600;700&amp;family=Instrument+Serif:ital@0;1&amp;family=Inter:wght@400;500;600&amp;family=Syne:wght@700;800&amp;display=swap');

      .tag-mono {
        font-family: 'Geist Mono', monospace;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.35em;
        text-transform: uppercase;
        fill: #FFFFFF;
        text-anchor: middle;
      }

      .tag-badge {
        fill: rgba(10, 10, 12, 0.75);
        stroke: rgba(255, 255, 255, 0.16);
        stroke-width: 1;
        rx: 999;
      }

      .pulse-dot {
        fill: #38BDF8;
      }

      /* Official Headings: Syne (Weight 800, Tracking -0.03em) */
      .headline-syne {
        font-family: 'Syne', sans-serif;
        font-size: 72px;
        font-weight: 800;
        letter-spacing: -0.03em;
        fill: #FFFFFF;
        text-anchor: middle;
      }

      /* Official Signature Editorial Accent: Instrument Serif (Italic, 400) */
      .headline-display-italic {
        font-family: 'Instrument Serif', Georgia, serif;
        font-style: italic;
        font-weight: 400;
        font-size: 38px;
        letter-spacing: -0.01em;
        fill: #38BDF8;
        text-anchor: middle;
      }

      /* Subheadline: Inter */
      .sub-inter {
        font-family: 'Inter', sans-serif;
        font-size: 15px;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        fill: #CBD5E1;
        text-anchor: middle;
      }

      /* Brand Footer: Syne + Cobalt Dot */
      .brand-title {
        font-family: 'Syne', sans-serif;
        font-size: 22px;
        font-weight: 800;
        letter-spacing: -0.02em;
        fill: #FFFFFF;
        text-anchor: middle;
      }

      .brand-dot {
        fill: #0047FF;
      }

      .brand-sub {
        font-family: 'Geist Mono', monospace;
        font-size: 11px;
        letter-spacing: 0.25em;
        fill: #94A3B8;
        text-anchor: middle;
        text-transform: uppercase;
      }

      .hairline {
        stroke: rgba(255, 255, 255, 0.12);
        stroke-width: 1;
      }
    </style>

    <linearGradient id="bottomGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A0A0C" stop-opacity="0" />
      <stop offset="40%" stop-color="#0A0A0C" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#0A0A0C" stop-opacity="0.97" />
    </linearGradient>

    <linearGradient id="topGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A0A0C" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#0A0A0C" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Clean Visual Base (Diya on Carrara Marble) -->
  <image href="${base64Img}" x="0" y="0" width="1080" height="1080" preserveAspectRatio="xMidYMid slice" />

  <!-- Top Subtle Contrast Overlay -->
  <rect x="0" y="0" width="1080" height="240" fill="url(#topGradient)" />

  <!-- Bottom Contrast Overlay for Readability -->
  <rect x="0" y="580" width="1080" height="500" fill="url(#bottomGradient)" />

  <!-- Top Metadata Badge (Geist Mono) -->
  <g transform="translate(540, 105)">
    <rect x="-195" y="-22" width="390" height="44" class="tag-badge" />
    <circle cx="-155" cy="0" r="4" class="pulse-dot" />
    <text x="10" y="5" class="tag-mono">ADYANT NEXA // DUBAI · INDIA CORE</text>
  </g>

  <!-- Thin Framing Hairlines -->
  <line x1="120" y1="710" x2="960" y2="710" class="hairline" />

  <!-- Primary Headline: Syne (800) -->
  <text x="540" y="795" class="headline-syne">HAPPY DIWALI</text>

  <!-- Signature Editorial Accent: Instrument Serif (Italic) -->
  <text x="540" y="850" class="headline-display-italic">May every foundation you build endure and prosper.</text>

  <!-- Subheadline: Inter (500) -->
  <text x="540" y="895" class="sub-inter">Wisdom · Clarity · Enduring Value</text>

  <!-- Bottom Framing Hairline -->
  <line x1="280" y1="945" x2="800" y2="945" class="hairline" />

  <!-- Brand Signature Footer -->
  <text x="540" y="995" class="brand-title">ADYANT NEXA<tspan class="brand-dot">.</tspan></text>
  <text x="540" y="1022" class="brand-sub">AUTONOMOUS REAL ESTATE OPERATING SYSTEMS</text>
</svg>
`;

const svgPath = path.join(outputDir, 'diwali-card.svg');
fs.writeFileSync(svgPath, svgContent, 'utf-8');
console.log('Generated brand-accurate SVG at:', svgPath);

// 4. Generate Interactive 1080x1080 HTML Studio with Exact App Fonts
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Adyant Nexa - Official Diwali Brand Creative</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@600;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --alabaster: #F8F8FA;
      --pure-white: #FFFFFF;
      --onyx: #0A0A0C;
      --cobalt: #0047FF;
      --slate: #60606A;
      --cyan: #38BDF8;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: #050507;
      color: var(--pure-white);
      font-family: 'Inter', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }

    .studio-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1080px;
      margin-bottom: 24px;
      padding: 16px 24px;
      background: #101015;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
    }

    .brand-meta {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.25em;
      color: var(--cyan);
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--cyan);
      box-shadow: 0 0 10px var(--cyan);
    }

    .btn-export {
      background: var(--cobalt);
      color: #FFFFFF;
      border: none;
      padding: 12px 24px;
      border-radius: 999px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .btn-export:hover {
      background: #0037D4;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 71, 255, 0.4);
    }

    /* 1080x1080 Creative Canvas */
    .creative-stage {
      width: 1080px;
      height: 1080px;
      position: relative;
      overflow: hidden;
      background: #0A0A0C;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1);
      border-radius: 16px;
    }

    .bg-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      inset: 0;
    }

    .overlay-top {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 260px;
      background: linear-gradient(180deg, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0) 100%);
      z-index: 2;
    }

    .overlay-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 520px;
      background: linear-gradient(180deg, rgba(10,10,12,0) 0%, rgba(10,10,12,0.72) 42%, rgba(10,10,12,0.97) 100%);
      z-index: 2;
    }

    .stage-content {
      position: relative;
      z-index: 10;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 80px 60px 60px;
      text-align: center;
    }

    .badge-wrap {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 10px 24px;
      background: rgba(10, 10, 12, 0.75);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 999px;
      font-family: 'Geist Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: #FFFFFF;
    }

    .badge-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--cyan);
      box-shadow: 0 0 10px var(--cyan);
    }

    .typography-block {
      width: 100%;
      max-width: 920px;
      margin-bottom: 20px;
    }

    .hairline-divider {
      width: 100%;
      height: 1px;
      background: rgba(255, 255, 255, 0.14);
      margin-bottom: 30px;
    }

    /* Locked Brand Headings: Syne 800 */
    .headline-syne {
      font-family: 'Syne', sans-serif;
      font-size: 76px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
      color: #FFFFFF;
      margin-bottom: 12px;
      text-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    }

    /* Signature Editorial Accent: Instrument Serif (Italic) */
    .headline-display-italic {
      font-family: 'Instrument Serif', Georgia, serif;
      font-style: italic;
      font-weight: 400;
      font-size: 38px;
      letter-spacing: -0.01em;
      color: var(--cyan);
      display: block;
      margin-bottom: 20px;
      text-shadow: 0 2px 16px rgba(56, 189, 248, 0.25);
    }

    /* Subheadline: Inter 500 */
    .sub-inter {
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 0.14em;
      line-height: 1.5;
      color: #CBD5E1;
      text-transform: uppercase;
      margin-bottom: 28px;
    }

    .hairline-bottom {
      width: 50%;
      margin: 0 auto 24px;
      height: 1px;
      background: rgba(255, 255, 255, 0.12);
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .footer-brand-title {
      font-family: 'Syne', sans-serif;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #FFFFFF;
    }

    .footer-brand-title span { color: var(--cobalt); }

    .footer-brand-sub {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #94A3B8;
    }

    /* Responsive scaling for preview */
    @media (max-width: 1120px) {
      .creative-stage {
        transform: scale(0.7);
        transform-origin: top center;
        margin-bottom: -320px;
      }
    }
    @media (max-width: 780px) {
      .creative-stage {
        transform: scale(0.48);
        transform-origin: top center;
        margin-bottom: -560px;
      }
    }
  </style>
</head>
<body>

  <div class="studio-bar">
    <div class="brand-meta">
      <div class="pulse"></div>
      <span>Adyant Nexa Typography Studio · Syne + Instrument Serif + Geist Mono</span>
    </div>
    <button class="btn-export" onclick="exportPNG()">
      Download 1080 × 1080 PNG ↗
    </button>
  </div>

  <div class="creative-stage" id="poster">
    <img src="/images/diwali-bg.jpg" alt="Minimalist Brass Diya" class="bg-img">
    <div class="overlay-top"></div>
    <div class="overlay-bottom"></div>

    <div class="stage-content">
      <div class="badge-wrap">
        <div class="badge-dot"></div>
        <span>ADYANT NEXA // DUBAI · INDIA CORE</span>
      </div>

      <div class="typography-block">
        <div class="hairline-divider"></div>
        <h1 class="headline-syne">HAPPY DIWALI</h1>
        <span class="headline-display-italic">May every foundation you build endure and prosper.</span>
        <p class="sub-inter">Wisdom · Clarity · Enduring Value</p>
        <div class="hairline-bottom"></div>

        <div class="footer-brand">
          <div class="footer-brand-title">ADYANT <span>NEXA.</span></div>
          <div class="footer-brand-sub">AUTONOMOUS REAL ESTATE OPERATING SYSTEMS</div>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
  <script>
    async function exportPNG() {
      const btn = document.querySelector('.btn-export');
      btn.innerText = 'Rendering 1080 × 1080...';
      btn.disabled = true;

      const element = document.getElementById('poster');
      
      const canvas = await html2canvas(element, {
        scale: 1,
        width: 1080,
        height: 1080,
        useCORS: true,
        backgroundColor: '#0A0A0C'
      });

      const link = document.createElement('a');
      link.download = 'adyant_nexa_diwali_brand_1080x1080.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      btn.innerText = 'Download 1080 × 1080 PNG ↗';
      btn.disabled = false;
    }
  </script>
</body>
</html>
`;

const htmlPath = path.join(outputDir, 'diwali-card.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
console.log('Generated interactive HTML studio at:', htmlPath);
