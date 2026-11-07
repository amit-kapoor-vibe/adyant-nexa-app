/**
 * Adyant Nexa - Real-Time Lark Base Social Media Watcher Daemon (v3 - Secure)
 * 
 * Supports: LinkedIn, Instagram, Facebook
 * Security: 100% Environment Variable Driven (Zero Hardcoded Secrets)
 * Fallback: Facebook text-feed publishing if no image is attached.
 */

const fs = require('fs');
const path = require('path');

// 1. Secure Environment Loader (reads .env.local safely)
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

// 2. Strict Configuration Validation from Environment
const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;

const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || process.env.META_PAGE_ACCESS_TOKEN;
const META_PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;

let cachedToken = null;
let tokenExpiry = 0;

async function getTenantAccessToken() {
  if (!LARK_APP_ID || !LARK_APP_SECRET) {
    throw new Error("LARK_APP_ID or LARK_APP_SECRET missing in .env.local");
  }
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) return cachedToken;
  const url = "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const data = await res.json();
  if (data.code === 0) {
    cachedToken = data.tenant_access_token;
    tokenExpiry = now + (data.expire - 300) * 1000;
    return cachedToken;
  }
  throw new Error(`Lark Token Auth Failed: ${data.msg}`);
}

async function publishToLinkedIn(caption, imageUrl) {
  if (!AYRSHARE_API_KEY) {
    throw new Error("AYRSHARE_API_KEY missing in .env.local");
  }
  console.log("Posting to LinkedIn via Ayrshare...");
  const body = {
    post: caption,
    platforms: ["linkedin"],
    ...(imageUrl ? { mediaUrls: [imageUrl] } : {})
  };
  const ayrRes = await fetch("https://app.ayrshare.com/api/post", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AYRSHARE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const ayrData = await ayrRes.json();
  if (ayrRes.ok && ayrData.status !== "error") {
    const lkId = ayrData.postIds?.find(p => p.platform === "linkedin")?.id || ayrData.id;
    return `https://www.linkedin.com/feed/update/urn:li:share:${lkId}`;
  } else {
    throw new Error(ayrData.message || JSON.stringify(ayrData));
  }
}

async function publishToInstagram(imageUrl, caption) {
  if (!META_ACCESS_TOKEN || !INSTAGRAM_BUSINESS_ACCOUNT_ID) {
    throw new Error("META_ACCESS_TOKEN or INSTAGRAM_BUSINESS_ACCOUNT_ID missing in .env.local");
  }
  if (!imageUrl) {
    throw new Error("Instagram requires a public image URL. Text-only posts are not supported by Instagram Graph API.");
  }

  console.log(`Posting to Instagram (${INSTAGRAM_BUSINESS_ACCOUNT_ID})...`);
  // 1. Create media container
  const containerUrl = `https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`;
  const res1 = await fetch(containerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: imageUrl,
      caption: caption,
      access_token: META_ACCESS_TOKEN
    })
  });
  const d1 = await res1.json();
  if (d1.error) {
    throw new Error(`Instagram Container Error: ${d1.error.message}`);
  }
  const creationId = d1.id;

  // 2. Publish media container
  const publishUrl = `https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`;
  const res2 = await fetch(publishUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: META_ACCESS_TOKEN
    })
  });
  const d2 = await res2.json();
  if (d2.error) {
    throw new Error(`Instagram Publish Error: ${d2.error.message}`);
  }
  return `https://www.instagram.com/p/${d2.id}`;
}

async function publishToFacebook(imageUrl, caption) {
  if (!META_ACCESS_TOKEN || !FACEBOOK_PAGE_ID) {
    throw new Error("META_ACCESS_TOKEN or FACEBOOK_PAGE_ID missing in .env.local");
  }

  console.log(`Posting to Facebook Page (${FACEBOOK_PAGE_ID})...`);

  // Obtain page token if required, with fallback to page access token
  let pageToken = META_PAGE_ACCESS_TOKEN || META_ACCESS_TOKEN;
  try {
    const pageRes = await fetch(`https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}?fields=access_token&access_token=${META_ACCESS_TOKEN}`);
    const pageData = await pageRes.json();
    if (pageData.access_token) {
      pageToken = pageData.access_token;
    }
  } catch (err) {
    // Continue with existing token
  }

  // If image is present, post to /photos; otherwise post text to /feed
  const isPhotoPost = Boolean(imageUrl);
  const endpoint = isPhotoPost ? "photos" : "feed";
  const url = `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/${endpoint}`;
  
  const payload = isPhotoPost
    ? { url: imageUrl, message: caption, access_token: pageToken }
    : { message: caption, access_token: pageToken };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const d = await res.json();
  if (d.error) {
    throw new Error(`Facebook Error: ${d.error.message}`);
  }
  const postId = d.post_id || d.id;
  return `https://www.facebook.com/${FACEBOOK_PAGE_ID}/posts/${postId}`;
}

// 3. Flexible Image URL Extractor
function extractImageUrl(fields) {
  const candidateKeys = [
    "Visual Design Prompt", "Image URL", "Media URL", "Image", "Visual", "Attachment", "Design Prompt"
  ];

  for (const key of candidateKeys) {
    const val = fields[key];
    if (typeof val === 'string') {
      const match = val.match(/https?:\/\/[^\s"'<>)]+/i);
      if (match) return match[0];
    } else if (Array.isArray(val) && val[0]) {
      if (val[0].url) return val[0].url;
      if (val[0].tmp_url) return val[0].tmp_url;
      if (typeof val[0] === 'string') {
        const match = val[0].match(/https?:\/\/[^\s"'<>)]+/i);
        if (match) return match[0];
      }
    }
  }

  // Broad fallback across all string fields
  for (const v of Object.values(fields)) {
    if (typeof v === 'string') {
      const match = v.match(/https?:\/\/[^\s"'<>)]+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^\s"'<>)]*)?/i)
        || v.match(/https?:\/\/files\.catbox\.moe\/[a-zA-Z0-9._-]+/i);
      if (match) return match[0];
    }
  }

  return "";
}

// 4. Flexible Platform Parser
function normalizePlatforms(platformField) {
  if (!platformField) return [];
  const rawList = Array.isArray(platformField) ? platformField : [platformField];
  const normalized = new Set();

  for (const p of rawList) {
    const s = String(p).toLowerCase().trim();
    if (s.includes("link")) {
      normalized.add("LinkedIn");
    } else if (s.includes("insta") || s === "ig") {
      normalized.add("Instagram");
    } else if (s.includes("face") || s === "fb") {
      normalized.add("Facebook");
    } else if (s.includes("meta")) {
      normalized.add("Facebook");
      normalized.add("Instagram");
    }
  }

  return Array.from(normalized);
}

// 5. Main Watcher Loop
async function checkAndPublish() {
  try {
    const token = await getTenantAccessToken();
    const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=50`;
    const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
    const data = await res.json();

    if (data.code === 0 && data.data?.items) {
      const approved = data.data.items.filter(item => item.fields?.Status === "Approved");
      if (approved.length === 0) return;

      console.log(`[${new Date().toLocaleTimeString()}] Found ${approved.length} APPROVED post(s) in Lark.`);

      for (const item of approved) {
        const recordId = item.record_id;
        const f = item.fields;
        const topic = f.Topic || "Untitled Post";
        const caption = f.Caption || "";
        const platforms = normalizePlatforms(f.Platform);
        const imageUrl = extractImageUrl(f);

        console.log(`\nProcessing: "${topic}"`);
        console.log(`Target Platforms: [${platforms.join(", ")}]`);
        console.log(`Image Detected: ${imageUrl ? imageUrl : "None (Text Only)"}`);

        const publishedLinks = [];
        const errors = [];

        for (const platform of platforms) {
          try {
            if (platform === "LinkedIn") {
              const link = await publishToLinkedIn(caption, imageUrl);
              publishedLinks.push(`LinkedIn: ${link}`);
              console.log(`Live on LinkedIn: ${link}`);
            } else if (platform === "Instagram") {
              const link = await publishToInstagram(imageUrl, caption);
              publishedLinks.push(`Instagram: ${link}`);
              console.log(`Live on Instagram: ${link}`);
            } else if (platform === "Facebook") {
              const link = await publishToFacebook(imageUrl, caption);
              publishedLinks.push(`Facebook: ${link}`);
              console.log(`Live on Facebook: ${link}`);
            }
          } catch (pErr) {
            console.error(`Failed on ${platform}: ${pErr.message}`);
            errors.push(`${platform} Error: ${pErr.message}`);
          }
        }

        const updateUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/${recordId}`;
        
        let newStatus = "Failed";
        let finalPostLink = "";

        if (publishedLinks.length > 0 && errors.length === 0) {
          newStatus = "Published";
          finalPostLink = publishedLinks.join(" | ");
        } else if (publishedLinks.length > 0 && errors.length > 0) {
          newStatus = "Published";
          finalPostLink = `${publishedLinks.join(" | ")} [Issues: ${errors.join("; ")}]`;
        } else {
          newStatus = "Failed";
          finalPostLink = `Errors: ${errors.join("; ")}`;
        }

        await fetch(updateUrl, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fields: {
              "Status": newStatus,
              "Post Link": finalPostLink
            }
          })
        });

        console.log(`Updated Lark record ${recordId} to Status: "${newStatus}"`);
      }
    }
  } catch (err) {
    console.error("Watcher tick error:", err.message);
  }
}

console.log("Adyant Nexa Lark Watcher Daemon v3 started (Zero Hardcoded Secrets).");
console.log("Listening for 'Approved' records every 15 seconds...");

checkAndPublish();
setInterval(checkAndPublish, 15000);
