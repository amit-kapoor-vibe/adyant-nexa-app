/**
 * Adyant Nexa - Official Diwali Brand Post Scheduler (Lark Base)
 * Features:
 * - Public CDN upload of public/adyant_nexa_diwali.png via Catbox
 * - Non-salesy, warm, high-integrity brand copy
 * - Directly integrated with Lark Base & Auto Watcher Daemon
 */

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../../.env.local');
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8');
    raw.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
}
loadEnv();

const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;

if (!LARK_APP_ID || !LARK_APP_SECRET || !LARK_BASE_ID || !LARK_TABLE_ID) {
  console.error("Missing Lark configuration in .env.local");
  process.exit(1);
}

const postTopic = "Diwali 2026 - Warm Brand Greeting";

const postCaption = `May the festival of lights bring enduring clarity, peace, and abundance to your homes and ventures.

Diwali is a timeless reminder that every meaningful journey begins with light: the light of wisdom, clear vision, and purposeful effort.

In business and in life, the things that truly endure are built quietly—with patience, shared values, and trust.

To our clients, partners, collaborators, and friends across India, Dubai, and around the world: we wish you and your families a joyous, prosperous, and peaceful Diwali.

Wishing you and your loved ones a very Happy Diwali.

Team Adyant Nexa
Dubai // India Core

#Diwali #AdyantNexa #FestivalOfLights #Dubai #India #Leadership #Foundations`;

async function getLarkTenantToken() {
  const url = "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const data = await res.json();
  if (data.code === 0) return data.tenant_access_token;
  throw new Error(`Lark Token Auth Failed: ${data.msg}`);
}

async function uploadToCatbox(filePath) {
  try {
    console.log("Uploading public/adyant_nexa_diwali.png to Catbox CDN...");
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: "image/png" });
    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", blob, "adyant_nexa_diwali.png");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      const url = await res.text();
      if (url.startsWith("http")) {
        console.log("Public Image URL:", url.trim());
        return url.trim();
      }
    }
  } catch (err) {
    console.warn("Catbox upload warning:", err.message);
  }
  return "";
}

async function scheduleInLark(status = "Scheduled") {
  const token = await getLarkTenantToken();
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records`;

  const imagePath = path.resolve(__dirname, '../../public/adyant_nexa_diwali.png');
  const publicImageUrl = await uploadToCatbox(imagePath);

  const payload = {
    fields: {
      "Topic": postTopic,
      "Caption": postCaption,
      "Platform": ["LinkedIn", "Instagram", "Facebook"],
      "Status": status,
      "Visual Design Prompt": publicImageUrl
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (data.code === 0) {
    console.log("\nSuccess: Brand Diwali post scheduled in Lark Base.");
    console.log("Record ID:", data.data?.record?.record_id);
    console.log("Status set to:", status);
    console.log("Target Platforms: LinkedIn, Instagram, Facebook");
    if (status === "Approved") {
      console.log("Auto-watcher will publish this immediately.");
    } else {
      console.log("Review in Lark Base and set Status to 'Approved' when ready to publish.");
    }
  } else {
    throw new Error(`Lark insert failed: ${data.msg}`);
  }
}

const statusArg = process.argv[2] || "Scheduled";
scheduleInLark(statusArg).catch(err => {
  console.error("Execution error:", err.message);
  process.exit(1);
});
