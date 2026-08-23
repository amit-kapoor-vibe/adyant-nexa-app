import { createClient } from "@supabase/supabase-js";

const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;

// --- LinkedIn Helpers ---

async function getLinkedInTokens() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return {
      accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
      personUrn: process.env.LINKEDIN_PERSON_URN || process.env.LINKEDIN_URN,
    };
  }
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data, error } = await supabase
      .from("social_tokens")
      .select("access_token, person_urn")
      .eq("provider", "linkedin")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return {
        accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
        personUrn: process.env.LINKEDIN_PERSON_URN || process.env.LINKEDIN_URN,
      };
    }
    return { accessToken: data.access_token, personUrn: data.person_urn };
  } catch (err: any) {
    console.warn("[AgentOps] Supabase token fetch failed — falling back to env:", err.message);
    return {
      accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
      personUrn: process.env.LINKEDIN_PERSON_URN || process.env.LINKEDIN_URN,
    };
  }
}

async function postViaAyrshare(text: string, imageUrls: string[] = []): Promise<string> {
  console.log("[AgentOps] Posting to LinkedIn via Ayrshare...");
  const body: any = {
    post: text,
    platforms: ["linkedin"],
  };
  if (imageUrls.length > 0) {
    body.mediaUrls = imageUrls;
  }

  const response = await fetch("https://app.ayrshare.com/api/post", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AYRSHARE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok || data.status === "error") {
    throw new Error(`Ayrshare Error: ${data.message || JSON.stringify(data)}`);
  }

  const linkedinResult = data.postIds?.find((p: any) => p.platform === "linkedin");
  const postId = linkedinResult?.id || data.id;
  return `https://www.linkedin.com/feed/update/urn:li:share:${postId}`;
}

async function postViaLinkedInDirect(text: string, imageUrl: string = ""): Promise<string> {
  const tokens = await getLinkedInTokens();
  if (!tokens.accessToken || !tokens.personUrn) {
    throw new Error("Missing direct LinkedIn credentials (access token or person URN).");
  }

  console.log("[AgentOps] Posting to LinkedIn personal profile directly...");
  const payload = {
    author: tokens.personUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: imageUrl ? "IMAGE" : "NONE",
        ...(imageUrl && {
          media: [{
            status: "READY",
            description: { text: "Adyant Nexa - AI Automation" },
            originalUrl: imageUrl,
            title: { text: "Adyant Nexa" }
          }]
        })
      }
    },
    visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
  };

  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${tokens.accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`LinkedIn Direct Error: ${JSON.stringify(data)}`);
  }

  return `https://www.linkedin.com/feed/update/${data.id}`;
}

export async function publishToLinkedIn(text: string, imageUrl: string = ""): Promise<string> {
  if (AYRSHARE_API_KEY) {
    try {
      return await postViaAyrshare(text, imageUrl ? [imageUrl] : []);
    } catch (err: any) {
      console.warn(`[AgentOps] Ayrshare failed: ${err.message}. Trying direct personal LinkedIn posting...`);
    }
  }

  return await postViaLinkedInDirect(text, imageUrl);
}

// --- Instagram Helpers ---

export async function publishToInstagram(imageUrl: string, caption: string): Promise<string> {
  if (!META_ACCESS_TOKEN || !INSTAGRAM_BUSINESS_ACCOUNT_ID) {
    throw new Error("Meta access token or Instagram business ID not configured.");
  }

  console.log(`[AgentOps] Initiating Instagram upload container for: ${imageUrl}`);
  const containerUrl = `https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`;
  const containerPayload = {
    image_url: imageUrl,
    caption: caption,
    access_token: META_ACCESS_TOKEN
  };

  const response = await fetch(containerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(containerPayload)
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(`Instagram Container Error: ${data.error ? data.error.message : response.statusText}`);
  }

  const creationId = data.id;
  console.log(`[AgentOps] Media container created. Container ID: ${creationId}`);

  // Step 2: Publish the media container
  const publishUrl = `https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`;
  const publishPayload = {
    creation_id: creationId,
    access_token: META_ACCESS_TOKEN
  };

  const publishResponse = await fetch(publishUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(publishPayload)
  });

  const publishData = await publishResponse.json();
  if (!publishResponse.ok || publishData.error) {
    throw new Error(`Instagram Publish Error: ${publishData.error ? publishData.error.message : publishResponse.statusText}`);
  }

  return `https://www.instagram.com/p/${publishData.id}`;
}

// --- Facebook Helpers ---

async function getPageAccessToken(): Promise<string> {
  const url = `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}?fields=access_token&access_token=${META_ACCESS_TOKEN}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.error) {
    throw new Error(`Failed to fetch Page Access Token: ${data.error.message}`);
  }
  return data.access_token;
}

export async function publishToFacebook(imageUrl: string, description: string): Promise<string> {
  if (!META_ACCESS_TOKEN || !FACEBOOK_PAGE_ID) {
    throw new Error("Meta access token or Facebook page ID not configured.");
  }

  console.log("[AgentOps] Fetching Facebook Page Access Token...");
  const pageAccessToken = await getPageAccessToken();

  console.log("[AgentOps] Posting photo to Facebook Page...");
  const url = `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/photos`;
  const params = new URLSearchParams({
    url: imageUrl,
    message: description,
    access_token: pageAccessToken
  });

  const response = await fetch(`${url}?${params.toString()}`, {
    method: "POST"
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(`Facebook Post Error: ${data.error ? data.error.message : response.statusText}`);
  }

  const postId = data.post_id || data.id;
  return `https://www.facebook.com/${FACEBOOK_PAGE_ID}/posts/${postId}`;
}
