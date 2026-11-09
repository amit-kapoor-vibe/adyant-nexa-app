/**
 * Adyant Nexa - Automated 10:00 AM IST Post Scheduler & Publisher
 * Automatically queues the Diwali brand post into Lark Base and triggers publishing at 10:00 AM IST sharp.
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

const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || process.env.META_PAGE_ACCESS_TOKEN;
const META_PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;

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

async function publishToLinkedIn(caption, imageUrl) {
  if (!AYRSHARE_API_KEY) return null;
  console.log("Publishing to LinkedIn...");
  const body = { post: caption, platforms: ["linkedin"], ...(imageUrl ? { mediaUrls: [imageUrl] } : {}) };
  const res = await fetch("https://app.ayrshare.com/api/post", {
    method: "POST",
    headers: { "Authorization": `Bearer ${AYRSHARE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (res.ok && data.status !== "error") {
    const lkId = data.postIds?.find(p => p.platform === "linkedin")?.id || data.id;
    return `https://www.linkedin.com/feed/update/urn:li:share:${lkId}`;
  }
  throw new Error(data.message || JSON.stringify(data));
}

async function publishToInstagram(imageUrl, caption) {
  if (!META_ACCESS_TOKEN || !INSTAGRAM_BUSINESS_ACCOUNT_ID) return null;
  console.log("Publishing to Instagram...");
  const cRes = await fetch(`https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: META_ACCESS_TOKEN })
  });
  const cData = await cRes.json();
  if (cData.error) throw new Error(cData.error.message);

  const pRes = await fetch(`https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: cData.id, access_token: META_ACCESS_TOKEN })
  });
  const pData = await pRes.json();
  if (pData.error) throw new Error(pData.error.message);
  return `https://www.instagram.com/p/${pData.id}`;
}

async function publishToFacebook(imageUrl, caption) {
  if (!META_ACCESS_TOKEN || !FACEBOOK_PAGE_ID) return null;
  console.log("Publishing to Facebook...");
  const pageToken = META_PAGE_ACCESS_TOKEN || META_ACCESS_TOKEN;
  const res = await fetch(`https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: imageUrl, message: caption, access_token: pageToken })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return `https://www.facebook.com/${FACEBOOK_PAGE_ID}/posts/${data.post_id || data.id}`;
}

async function main() {
  const token = await getLarkTenantToken();

  // Target: Today at 10:00:00 AM IST
  // ISO string with +05:30 offset
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const targetTime = new Date(`${todayDateStr}T10:00:00+05:30`);
  
  const now = Date.now();
  const delayMs = targetTime.getTime() - now;

  console.log("Target Scheduled Time: 10:00:00 AM IST");
  console.log(`Current Time: ${new Date().toLocaleTimeString()} IST`);

  // 1. Prepare asset & insert record into Lark
  const imagePath = path.resolve(__dirname, '../../public/adyant_nexa_diwali.png');
  const publicImageUrl = await uploadToCatbox(imagePath);

  const recordPayload = {
    fields: {
      "Topic": postTopic,
      "Caption": postCaption,
      "Platform": ["LinkedIn", "Instagram", "Facebook"],
      "Status": "Scheduled",
      "Visual Design Prompt": publicImageUrl,
      "Scheduled Time": targetTime.getTime()
    }
  };

  const createUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records`;
  const createRes = await fetch(createUrl, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(recordPayload)
  });
  const createData = await createRes.json();
  const recordId = createData.data?.record?.record_id;

  console.log("\nRecord created in Lark Base:");
  console.log(`Record ID: ${recordId}`);
  console.log("Status: Scheduled");

  if (delayMs <= 0) {
    console.log("\n10:00 AM IST has arrived! Triggering publishing immediately...");
    await executePublish(token, recordId, publicImageUrl);
  } else {
    const mins = Math.floor(delayMs / 60000);
    const secs = Math.floor((delayMs % 60000) / 1000);
    console.log(`\nWaiting ${mins}m ${secs}s until 10:00:00 AM IST...`);
    console.log("This terminal will automatically publish at 10:00 AM IST. Leave this process running.");

    // Periodic countdown logger
    const interval = setInterval(() => {
      const remaining = targetTime.getTime() - Date.now();
      if (remaining <= 0) {
        clearInterval(interval);
      } else {
        const m = Math.floor(remaining / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        if (m % 15 === 0 && s < 2) {
          console.log(`[${new Date().toLocaleTimeString()}] Countdown to 10:00 AM IST: ${m}m ${s}s remaining...`);
        }
      }
    }, 1000);

    setTimeout(async () => {
      clearInterval(interval);
      console.log(`\n[${new Date().toLocaleTimeString()}] It is 10:00:00 AM IST! Publishing post now...`);
      await executePublish(token, recordId, publicImageUrl);
    }, delayMs);
  }
}

async function executePublish(token, recordId, imageUrl) {
  // Update Lark to Approved
  const updateUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/${recordId}`;
  await fetch(updateUrl, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { "Status": "Approved" } })
  });

  const links = [];
  const errors = [];

  try {
    const lk = await publishToLinkedIn(postCaption, imageUrl);
    if (lk) { links.push(`LinkedIn: ${lk}`); console.log("Live on LinkedIn:", lk); }
  } catch (e) { errors.push(`LinkedIn: ${e.message}`); }

  try {
    const ig = await publishToInstagram(imageUrl, postCaption);
    if (ig) { links.push(`Instagram: ${ig}`); console.log("Live on Instagram:", ig); }
  } catch (e) { errors.push(`Instagram: ${e.message}`); }

  try {
    const fb = await publishToFacebook(imageUrl, postCaption);
    if (fb) { links.push(`Facebook: ${fb}`); console.log("Live on Facebook:", fb); }
  } catch (e) { errors.push(`Facebook: ${e.message}`); }

  const finalStatus = links.length > 0 ? "Published" : "Failed";
  const postLinkText = links.length > 0 ? links.join(" | ") : errors.join("; ");

  await fetch(updateUrl, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { "Status": finalStatus, "Post Link": postLinkText } })
  });

  console.log(`\nProcess Complete! Status updated in Lark to "${finalStatus}".`);
  console.log("Post Links:", postLinkText);
  process.exit(0);
}

main().catch(err => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
