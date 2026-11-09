import { NextResponse } from "next/server";

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || process.env.META_PAGE_ACCESS_TOKEN;
const META_PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const MAKE_LINKEDIN_WEBHOOK_URL = process.env.MAKE_LINKEDIN_WEBHOOK_URL;

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
    const body = await req.json();

    // Support both direct payloads and nested Lark record objects
    const fields = body.fields || body;
    const topic = extractText(fields.Topic || fields.topic || body.topic) || "Social Post";
    const caption = extractText(fields.Caption || fields.caption || fields.Content || fields.content || body.caption) || "";
    const rawPlatforms = fields.Platform || fields.platform || fields.Platforms || body.platforms || body.platform;
    const platforms = normalizePlatforms(rawPlatforms);

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

    if (platforms.length === 0) {
      return NextResponse.json({
        error: "No valid platforms detected in payload",
        received_platforms: rawPlatforms,
      }, { status: 400 });
    }

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
        errors[platform] = err.message || "Failed to publish";
      }
    }

    return NextResponse.json({
      success: Object.keys(published).length > 0,
      topic,
      published,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    return NextResponse.json({
      error: "Internal server error during webhook processing",
      details: err.message,
    }, { status: 500 });
  }
}
