import { NextResponse } from "next/server";

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || process.env.META_PAGE_ACCESS_TOKEN;
const META_PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const MAKE_LINKEDIN_WEBHOOK_URL = process.env.MAKE_LINKEDIN_WEBHOOK_URL;

const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;

// Fetch Lark tenant access token for direct API sync
async function getLarkTenantToken(): Promise<string | null> {
  if (!LARK_APP_ID || !LARK_APP_SECRET) return null;
  try {
    const res = await fetch("https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
    });
    const data = await res.json();
    return data.code === 0 ? data.tenant_access_token : null;
  } catch (err: any) {
    console.error("[Lark Auth Error]:", err.message);
    return null;
  }
}

// Fetch the active Approved record directly from Lark Base
async function fetchApprovedRecordFromLark(token: string): Promise<any | null> {
  try {
    const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=20`;
    const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
    const data = await res.json();
    if (data.code === 0 && data.data?.items) {
      for (const item of data.data.items) {
        const status = extractText(item.fields?.Status || item.fields?.status || "").toLowerCase();
        if (status === "approved") {
          return item;
        }
      }
    }
  } catch (err: any) {
    console.error("[Lark Direct Fetch Error]:", err.message);
  }
  return null;
}

// Update Lark record status to Published with live links
async function updateLarkRecord(token: string, recordId: string, status: string, postLinks: string): Promise<void> {
  try {
    const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/${recordId}`;
    await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          "Status": status,
          "Post Link": postLinks
        }
      })
    });
    console.log(`[Lark Table Synced] Record ${recordId} updated to "${status}"`);
  } catch (err: any) {
    console.error("[Lark Sync Error]:", err.message);
  }
}

// Helper to extract clean text from string, object, or array
function extractText(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val.trim();
  if (typeof val === "number") return String(val);
  if (Array.isArray(val)) {
    return val.map(extractText).filter(Boolean).join(", ").trim();
  }
  if (typeof val === "object") {
    return (val.text || val.name || val.value || "").trim();
  }
  return String(val).trim();
}

// Clean and extract a valid URL from any text (handles "Visual Asset CDN: https://...")
function cleanImageUrl(raw: any): string {
  if (!raw) return "";
  const str = extractText(raw);
  const match = str.match(/https?:\/\/[^\s"'<>)]+/i);
  if (match) {
    return match[0].replace(/[,;)]+$/, "");
  }
  return "";
}

// Normalize target platforms
function normalizePlatforms(platformField: any): string[] {
  if (!platformField) return [];
  const rawList = Array.isArray(platformField) ? platformField : [platformField];
  const normalized = new Set<string>();

  for (const p of rawList) {
    const s = extractText(p).toLowerCase();
    if (s.includes("link")) {
      normalized.add("LinkedIn");
    }
    if (s.includes("insta") || s === "ig") {
      normalized.add("Instagram");
    }
    if (s.includes("face") || s === "fb") {
      normalized.add("Facebook");
    }
    if (s.includes("meta")) {
      normalized.add("Facebook");
      normalized.add("Instagram");
    }
  }

  return Array.from(normalized);
}

// Publish to LinkedIn via Make.com Webhook (Zero Watermark)
async function publishToLinkedIn(caption: string, imageUrl?: string): Promise<string> {
  if (!MAKE_LINKEDIN_WEBHOOK_URL) {
    throw new Error("MAKE_LINKEDIN_WEBHOOK_URL not configured in environment");
  }

  const res = await fetch(MAKE_LINKEDIN_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caption, imageUrl: imageUrl || "" }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Make.com Error: ${errText}`);
  }

  return "https://www.linkedin.com/company/adyantnexa/";
}

// Publish to Instagram via Meta Graph API
async function publishToInstagram(imageUrl: string, caption: string): Promise<string> {
  if (!META_ACCESS_TOKEN || !INSTAGRAM_BUSINESS_ACCOUNT_ID) {
    throw new Error("META_ACCESS_TOKEN or INSTAGRAM_BUSINESS_ACCOUNT_ID missing in environment");
  }
  if (!imageUrl) {
    throw new Error("Instagram requires a public image URL.");
  }

  // 1. Create media container
  const containerUrl = `https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`;
  const res1 = await fetch(containerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: imageUrl,
      caption: caption,
      access_token: META_ACCESS_TOKEN,
    }),
  });

  const d1 = await res1.json();
  if (d1.error) {
    throw new Error(`Instagram Container Error: ${d1.error.message}`);
  }

  const creationId = d1.id;

  // Wait 4 seconds for Instagram CDN to process image
  await new Promise((r) => setTimeout(r, 4000));

  // 2. Publish media container
  const publishUrl = `https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`;
  const res2 = await fetch(publishUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: META_ACCESS_TOKEN,
    }),
  });

  const d2 = await res2.json();
  if (d2.error) {
    throw new Error(`Instagram Publish Error: ${d2.error.message}`);
  }

  return `https://www.instagram.com/p/${d2.id}`;
}

// Publish to Facebook Page via Meta Graph API
async function publishToFacebook(imageUrl: string, caption: string): Promise<string> {
  if (!META_ACCESS_TOKEN || !FACEBOOK_PAGE_ID) {
    throw new Error("META_ACCESS_TOKEN or FACEBOOK_PAGE_ID missing in environment");
  }

  // Fetch Page-specific Access Token
  let pageToken = META_PAGE_ACCESS_TOKEN || META_ACCESS_TOKEN;
  try {
    const pageRes = await fetch(
      `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}?fields=access_token&access_token=${META_ACCESS_TOKEN}`
    );
    const pageData = await pageRes.json();
    if (pageData.access_token) {
      pageToken = pageData.access_token;
    }
  } catch (err) {
    // Continue with existing token
  }

  const isPhotoPost = Boolean(imageUrl);
  const endpoint = isPhotoPost ? "photos" : "feed";
  const url = `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/${endpoint}`;

  const payload = isPhotoPost
    ? { url: imageUrl, message: caption, access_token: pageToken }
    : { message: caption, access_token: pageToken };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const d = await res.json();
  if (d.error) {
    throw new Error(`Facebook Error: ${d.error.message}`);
  }

  const postId = d.post_id || d.id;
  return `https://www.facebook.com/${FACEBOOK_PAGE_ID}/posts/${postId}`;
}

export async function POST(req: Request) {
  try {
    const rawText = await req.text();
    console.log("[Lark Webhook] Raw body received:", rawText.slice(0, 500));

    let body: any = {};
    try {
      body = JSON.parse(rawText);
    } catch (parseErr) {
      console.warn("[Lark Webhook] JSON.parse failed. Attempting resilient newline & quote sanitization...");
      try {
        const sanitized = rawText
          .replace(/[\r\n]+/g, "\\n")
          .replace(/\t/g, " ");
        body = JSON.parse(sanitized);
      } catch (sanitizedErr) {
        console.warn("[Lark Webhook] Sanitized JSON parse failed. Falling back to regex extraction.");
        body = {};
        const topicMatch = rawText.match(/"topic"\s*:\s*"([^"]+)"/i);
        const captionMatch = rawText.match(/"caption"\s*:\s*"([\s\S]*?)"\s*,\s*"/i);
        const platformMatch = rawText.match(/"platform"\s*:\s*"([^"]+)"/i);
        const imageMatch = rawText.match(/https?:\/\/[^\s"'<>)]+/i);

        if (topicMatch) body.topic = topicMatch[1];
        if (captionMatch) body.caption = captionMatch[1].replace(/\\n/g, "\n");
        if (platformMatch) body.platform = platformMatch[1];
        if (imageMatch) body.imageUrl = imageMatch[0];
      }
    }

    // Support both direct payloads and nested Lark record objects
    const fields = body.fields || body;
    let topic = extractText(fields.Topic || fields.topic || body.topic) || "Social Post";
    let caption = extractText(fields.Caption || fields.caption || fields.Content || fields.content || body.caption) || "";
    
    if (caption.includes("\\n")) {
      caption = caption.replace(/\\n/g, "\n");
    }

    const rawPlatforms = fields.Platform || fields.platform || fields.Platforms || body.platforms || body.platform;
    let platforms = normalizePlatforms(rawPlatforms);

    // Extract clean image URL safely
    let imageUrl = cleanImageUrl(fields["Visual Design Prompt"] || fields["Image URL"] || fields.imageUrl || fields.image || body.imageUrl);
    if (!imageUrl) {
      for (const val of Object.values(fields)) {
        const found = cleanImageUrl(val);
        if (found && (found.includes(".jpg") || found.includes(".jpeg") || found.includes(".png") || found.includes(".webp") || found.includes("catbox.moe") || found.includes("unsplash"))) {
          imageUrl = found;
          break;
        }
      }
    }
    if (!imageUrl) {
      const rawUrlMatch = rawText.match(/https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|webp)(\?[^\s"'<>]*)?/i);
      if (rawUrlMatch) {
        imageUrl = rawUrlMatch[0];
      }
    }

    let recordId = fields.record_id || body.record_id || "";
    let larkToken: string | null = null;

    // Detect if Lark sent literal template variables like "{{Platform}}" or "{{Caption}}"
    const hasUnresolvedTokens =
      caption.includes("{{") ||
      topic.includes("{{") ||
      !caption ||
      (typeof rawPlatforms === "string" && rawPlatforms.includes("{{")) ||
      platforms.length === 0 ||
      !imageUrl;

    if (hasUnresolvedTokens) {
      console.log("[Lark Webhook] Template tokens or missing fields detected. Fetching live record from Lark Base API...");
      larkToken = await getLarkTenantToken();
      if (larkToken) {
        const approvedItem = await fetchApprovedRecordFromLark(larkToken);
        if (approvedItem) {
          recordId = approvedItem.record_id;
          const af = approvedItem.fields || {};
          topic = extractText(af.Topic) || topic;
          caption = extractText(af.Caption) || caption;
          const directPlatforms = normalizePlatforms(af.Platform);
          if (directPlatforms.length > 0) {
            platforms = directPlatforms;
          }
          const directImage = cleanImageUrl(af["Visual Design Prompt"] || af["Image URL"]);
          if (directImage) {
            imageUrl = directImage;
          }
          console.log(`[Lark Direct Sync Success] Loaded real record: "${topic}" (ID: ${recordId})`);
        }
      }
    }

    // Default fallback if still no platforms detected
    if (platforms.length === 0) {
      console.log("[Lark Webhook] Defaulting broadcast platforms to: LinkedIn, Instagram, Facebook");
      platforms = ["LinkedIn", "Instagram", "Facebook"];
    }

    console.log(`[Lark Webhook Dispatching] Topic: "${topic}" | Platforms: [${platforms.join(", ")}] | Image: ${imageUrl ? "Yes" : "No"}`);

    const published: Record<string, string> = {};
    const errors: Record<string, string> = {};

    for (const platform of platforms) {
      try {
        if (platform === "LinkedIn") {
          published.LinkedIn = await publishToLinkedIn(caption, imageUrl);
        } else if (platform === "Instagram") {
          published.Instagram = await publishToInstagram(imageUrl, caption);
        } else if (platform === "Facebook") {
          published.Facebook = await publishToFacebook(imageUrl, caption);
        }
      } catch (err: any) {
        console.error(`[Lark Webhook] Failed on ${platform}:`, err.message);
        errors[platform] = err.message || "Failed to publish";
      }
    }

    const publishedLinks: string[] = [];
    for (const [p, link] of Object.entries(published)) {
      publishedLinks.push(`${p}: ${link}`);
    }

    // Auto-update Lark Base table record so user sees "Published" with live links
    if (recordId && Object.keys(published).length > 0) {
      if (!larkToken) larkToken = await getLarkTenantToken();
      if (larkToken) {
        const finalStatus = publishedLinks.length > 0 ? "Published" : "Failed";
        await updateLarkRecord(larkToken, recordId, finalStatus, publishedLinks.join(" | "));
      }
    }

    return NextResponse.json({
      success: Object.keys(published).length > 0,
      topic,
      published,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    console.error("[Lark Webhook Critical Exception]:", err);
    return NextResponse.json({
      error: "Internal server error during webhook processing",
      details: err.message,
    }, { status: 500 });
  }
}
