const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8');
    raw.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    });
  }
}
loadEnv();

const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;
const RECORD_ID = "reczz28X48BSphTD";

const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;

const caption = `May the festival of lights bring enduring clarity, peace, and abundance to your homes and ventures.

Diwali is a timeless reminder that every meaningful journey begins with light: the light of wisdom, clear vision, and purposeful effort.

In business and in life, the things that truly endure are built quietly—with patience, shared values, and trust.

To our clients, partners, collaborators, and friends across India, Dubai, and around the world: we wish you and your families a joyous, prosperous, and peaceful Diwali.

Wishing you and your loved ones a very Happy Diwali.

Team Adyant Nexa
Dubai // India Core

#Diwali #AdyantNexa #FestivalOfLights #Dubai #India #Leadership #Foundations`;

const imgPath = path.resolve(__dirname, '../public/adyant_nexa_diwali.png');
const fileBuffer = fs.readFileSync(imgPath);

async function getLarkTenantToken() {
  const url = "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const data = await res.json();
  return data.tenant_access_token;
}

async function publishFacebook() {
  console.log("\n1. Publishing to Facebook Page...");
  const pageRes = await fetch(`https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}?fields=access_token&access_token=${META_ACCESS_TOKEN}`);
  const pageData = await pageRes.json();
  const pageToken = pageData.access_token || META_PAGE_ACCESS_TOKEN || META_ACCESS_TOKEN;

  const formData = new FormData();
  formData.append("source", new Blob([fileBuffer], { type: "image/png" }), "diwali.png");
  formData.append("message", caption);
  formData.append("access_token", pageToken);
  formData.append("published", "true");

  const res = await fetch(`https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/photos`, {
    method: "POST",
    body: formData
  });
  const data = await res.json();
  if (data.error) throw new Error(`Facebook Error: ${data.error.message}`);
  
  const photoId = data.id;
  const postUrl = `https://www.facebook.com/${FACEBOOK_PAGE_ID}/photos/${photoId}`;
  console.log("Facebook Live Post:", postUrl);

  // Fetch Meta internal CDN URL for Instagram
  const photoDetailRes = await fetch(`https://graph.facebook.com/v21.0/${photoId}?fields=source&access_token=${pageToken}`);
  const photoDetailData = await photoDetailRes.json();
  const metaCdnUrl = photoDetailData.source;

  return { postUrl, photoId, metaCdnUrl };
}

async function publishInstagram(metaCdnUrl) {
  console.log("\n2. Publishing to Instagram...");
  if (!metaCdnUrl) throw new Error("Missing Meta CDN image URL");

  // Step A: Create container
  const cRes = await fetch(`https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: metaCdnUrl,
      caption: caption,
      access_token: META_ACCESS_TOKEN
    })
  });
  const cData = await cRes.json();
  if (cData.error) throw new Error(`Instagram Container Error: ${cData.error.message}`);
  const creationId = cData.id;
  console.log("Instagram Container Created:", creationId);

  // Small delay for Meta CDN media indexing
  await new Promise(r => setTimeout(r, 3000));

  // Step B: Publish container
  const pRes = await fetch(`https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: META_ACCESS_TOKEN
    })
  });
  const pData = await pRes.json();
  if (pData.error) throw new Error(`Instagram Publish Error: ${pData.error.message}`);
  
  const postUrl = `https://www.instagram.com/p/${pData.id}`;
  console.log("Instagram Live Post:", postUrl);
  return postUrl;
}

async function publishLinkedIn() {
  console.log("\n3. Publishing to LinkedIn via Ayrshare (Verified Image + Full Caption)...");
  const verifiedCdnUrl = "https://files.catbox.moe/osphti.png";
  const body = {
    post: caption,
    platforms: ["linkedin"],
    mediaUrls: [verifiedCdnUrl]
  };

  const res = await fetch("https://app.ayrshare.com/api/post", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AYRSHARE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (res.ok && data.status !== "error") {
    const lkId = data.postIds?.find(p => p.platform === "linkedin")?.id || data.id;
    const postUrl = `https://www.linkedin.com/feed/update/urn:li:share:${lkId}`;
    console.log("LinkedIn Live Post:", postUrl);
    return postUrl;
  }
  throw new Error(`LinkedIn Error: ${data.message || JSON.stringify(data)}`);
}

async function main() {
  const publishedLinks = [];
  const errors = [];

  // Facebook
  let metaCdnUrl = null;
  try {
    const fb = await publishFacebook();
    publishedLinks.push(`Facebook: ${fb.postUrl}`);
    metaCdnUrl = fb.metaCdnUrl;
  } catch (e) {
    console.error("Facebook failed:", e.message);
    errors.push(`Facebook: ${e.message}`);
  }

  // Instagram
  try {
    const ig = await publishInstagram(metaCdnUrl);
    publishedLinks.push(`Instagram: ${ig}`);
  } catch (e) {
    console.error("Instagram failed:", e.message);
    errors.push(`Instagram: ${e.message}`);
  }

  // LinkedIn
  try {
    const lk = await publishLinkedIn();
    publishedLinks.push(`LinkedIn: ${lk}`);
  } catch (e) {
    console.error("LinkedIn failed:", e.message);
    errors.push(`LinkedIn: ${e.message}`);
  }

  // Update Lark CRM Record
  console.log("\n4. Updating Lark CRM Record...");
  try {
    const token = await getLarkTenantToken();
    const updateUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/${RECORD_ID}`;
    
    const finalStatus = publishedLinks.length > 0 ? "Published" : "Failed";
    const postLinkText = publishedLinks.join(" | ") + (errors.length > 0 ? ` [Issues: ${errors.join("; ")}]` : "");

    await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          "Status": finalStatus,
          "Post Link": postLinkText,
          "Visual Design Prompt": "https://files.catbox.moe/osphti.png"
        }
      })
    });
    console.log("Lark Record updated successfully!");
  } catch (e) {
    console.error("Lark update failed:", e.message);
  }

  console.log("\n=======================================================");
  console.log("ALL PLATFORMS PROCESSED");
  console.log("Results:\n" + publishedLinks.join("\n"));
  if (errors.length > 0) {
    console.log("Errors:\n" + errors.join("\n"));
  }
  console.log("=======================================================\n");
}

main().catch(e => console.error(e));
