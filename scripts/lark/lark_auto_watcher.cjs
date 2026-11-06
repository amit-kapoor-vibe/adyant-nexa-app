/**
 * Adyant Nexa - Real-Time Lark Base Social Media Watcher Daemon (v2)
 * 
 * Supports: LinkedIn, Instagram, Facebook
 * Reports exact platform success/failure back to Lark Base.
 */

const fs = require('fs');
const path = require('path');

const LARK_APP_ID = "cli_a96c3d501578de15";
const LARK_APP_SECRET = "zMF175wzt2NXl8SxxoYYmWUgeGcEq2Re";
const LARK_BASE_ID = "XNytbpOecasAlUsMGbXjYN6LpQh";
const LARK_TABLE_ID = "tblAx5CVIwMMlxIG";

const AYRSHARE_API_KEY = "69BDC822-610646B8-BCA15AA0-700C7450";

// Meta credentials
const META_ACCESS_TOKEN = "EABAOROZAZCslUBS9QxL9lJcBLuB3an79DcV3NFZC1WZCzFIKNpjOXyR1VIpECr4nZAUIgIWq7Dmjeon6kp4EuhwVUwpBhpoeNNejPEAniBp380bil3tTtqvMZCviQSvJ2xwWl2ZBpDAbaNeo8amTFXNiXHmlu7ZA7d4b9FpR3eReCjZBvtMXrza8TR2KNWyaB9r99EDQxHPZBfo27Y3mDVrSSgFDPuq2nMAgOyfHQpOVS0jbHwER4oJRiXF2fa7nAGOzUoyI9JlNogqG9XWGLkWgOaWKRhFdWefXn7FgIZD";
const INSTAGRAM_BUSINESS_ACCOUNT_ID = "17841480179651485";
const FACEBOOK_PAGE_ID = "988923307629678";

let cachedToken = null;
let tokenExpiry = 0;

async function getTenantAccessToken() {
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
  console.log("💼 Posting to LinkedIn via Ayrshare...");
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
  console.log(`📸 Posting to Instagram (${INSTAGRAM_BUSINESS_ACCOUNT_ID})...`);
  // 1. Create container
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
    throw new Error(`Instagram Error: ${d1.error.message}`);
  }
  const creationId = d1.id;

  // 2. Publish container
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
  console.log(`👤 Posting to Facebook Page (${FACEBOOK_PAGE_ID})...`);
  // Get page token
  const pageRes = await fetch(`https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}?fields=access_token&access_token=${META_ACCESS_TOKEN}`);
  const pageData = await pageRes.json();
  const pageToken = pageData.access_token || META_ACCESS_TOKEN;

  const url = `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/photos`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: imageUrl,
      message: caption,
      access_token: pageToken
    })
  });
  const d = await res.json();
  if (d.error) {
    throw new Error(`Facebook Error: ${d.error.message}`);
  }
  const postId = d.post_id || d.id;
  return `https://www.facebook.com/${FACEBOOK_PAGE_ID}/posts/${postId}`;
}

async function checkAndPublish() {
  try {
    const token = await getTenantAccessToken();
    const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=50`;
    const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
    const data = await res.json();

    if (data.code === 0 && data.data?.items) {
      const approved = data.data.items.filter(item => item.fields?.Status === "Approved");
      if (approved.length === 0) return;

      console.log(`[${new Date().toLocaleTimeString()}] 🚀 Found ${approved.length} APPROVED post(s) in Lark!`);

      for (const item of approved) {
        const recordId = item.record_id;
        const f = item.fields;
        const topic = f.Topic;
        const caption = f.Caption;
        const platforms = f.Platform || [];

        const cdnMatch = (f["Visual Design Prompt"] || "").match(/https:\/\/files\.catbox\.moe\/[a-zA-Z0-9._-]+/);
        const imageUrl = cdnMatch ? cdnMatch[0] : "";

        console.log(`\n📬 Processing: "${topic}"`);
        console.log(`   Target Platforms: [${platforms.join(", ")}]`);

        const publishedLinks = [];
        const errors = [];

        for (const platform of platforms) {
          try {
            if (platform === "LinkedIn") {
              const link = await publishToLinkedIn(caption, imageUrl);
              publishedLinks.push(`LinkedIn: ${link}`);
              console.log(`✅ Live on LinkedIn: ${link}`);
            } else if (platform === "Instagram") {
              const link = await publishToInstagram(imageUrl, caption);
              publishedLinks.push(`Instagram: ${link}`);
              console.log(`✅ Live on Instagram: ${link}`);
            } else if (platform === "Facebook") {
              const link = await publishToFacebook(imageUrl, caption);
              publishedLinks.push(`Facebook: ${link}`);
              console.log(`✅ Live on Facebook: ${link}`);
            }
          } catch (pErr) {
            console.error(`❌ Failed on ${platform}: ${pErr.message}`);
            errors.push(`${platform} Error: ${pErr.message}`);
          }
        }

        const updateUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/${recordId}`;
        
        let newStatus = "Failed";
        let finalPostLink = "";

        if (publishedLinks.length > 0) {
          newStatus = "Published";
          finalPostLink = publishedLinks.join(" | ");
        } else {
          finalPostLink = errors.join("; ");
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

        console.log(`Updated Lark record ${recordId} to Status: "${newStatus}"!`);
      }
    }
  } catch (err) {
    console.error("Watcher tick error:", err.message);
  }
}

console.log("👀 Adyant Nexa Lark Watcher Daemon v2 started!");
console.log("Listening for 'Approved' records every 15 seconds...");

checkAndPublish();
setInterval(checkAndPublish, 15000);
