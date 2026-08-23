import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { SocialAutomationSchema, validateBodySize } from "@/lib/validation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateAndSaveAllSizes } from "@/lib/agent-ops/imaging";
import { publishToLinkedIn, publishToInstagram, publishToFacebook } from "@/lib/agent-ops/publishing";

const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// --- Lark Auth ---
async function getTenantAccessToken() {
  const url = "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_id: LARK_APP_ID,
      app_secret: LARK_APP_SECRET
    })
  });

  const data = await response.json();
  if (data.code === 0) {
    return data.tenant_access_token;
  }
  throw new Error(`Failed to obtain Lark access token: ${data.msg}`);
}

function parsePlatformCaptions(fullCaption: string) {
  const result = {
    linkedin: fullCaption,
    instagram: fullCaption,
    facebook: fullCaption
  };
  
  if (fullCaption.includes("[LINKEDIN]") || fullCaption.includes("[INSTAGRAM]") || fullCaption.includes("[FACEBOOK]")) {
    const linkedinMatch = fullCaption.match(/\[LINKEDIN\]([\s\S]*?)(?=\[INSTAGRAM\]|\[FACEBOOK\]|$)/i);
    const instagramMatch = fullCaption.match(/\[INSTAGRAM\]([\s\S]*?)(?=\[LINKEDIN\]|\[FACEBOOK\]|$)/i);
    const facebookMatch = fullCaption.match(/\[FACEBOOK\]([\s\S]*?)(?=\[LINKEDIN\]|\[INSTAGRAM\]|$)/i);
    
    if (linkedinMatch) result.linkedin = linkedinMatch[1].trim();
    if (instagramMatch) result.instagram = instagramMatch[1].trim();
    if (facebookMatch) result.facebook = facebookMatch[1].trim();
  }
  
  return result;
}

// --- Inline Content Generator (replaces child process) ---
const CORE_THEMES = [
  "The Death of Chatbots, The Rise of Autonomous Agents in Business",
  "The Tier-2 India Revolution: Why local D2C brands are scaling with AI",
  "WhatsApp Commerce: Moving beyond support into fully automated sales engines",
  "Self-Healing Code Architecture: Reducing server costs and downtime",
  "CAPI Mastery & Signal Recovery: How Meta Ads are winning without cookies",
  "Predictive LTV via AI: Knowing your customer value before they purchase"
];

async function generateSocialPosts(customTopic: string | null, directive: string | null, previousTopics: string[] = []): Promise<Record<string, unknown>[]> {
  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not configured in environment variables.");
  }

  const ai = new GoogleGenerativeAI(GOOGLE_API_KEY);
  const themesToUse = customTopic ? [customTopic] : CORE_THEMES;

  const directiveBlock = directive
    ? `\n  ---\n  # 🎯 CEO STRATEGIC DIRECTIVE (HIGHEST PRIORITY):\n  The CEO has issued the following directive. ALL content must align with this strategic focus:\n  "${directive}"\n  Ensure every post's hook, body, CTA, and visual prompt is laser-focused on this directive.\n  ---\n  `
    : '';

  const dedupBlock = previousTopics.length > 0
    ? `\n  ---\n  # 🚫 CONTENT MEMORY — DO NOT REPEAT:\n  The following topics/headlines have ALREADY been posted. You MUST NOT reuse these topics, angles, or similar headlines. Create completely FRESH perspectives:\n  ${previousTopics.map((t, i) => `  ${i + 1}. "${t}"`).join('\n')}\n  \n  Generate content with NEW angles, different hooks, and fresh insights that haven't been covered above.\n  ---\n  `
    : '';

  const prompt = `
  You are the Lead Creative Director, Elite Copywriter, and CTO at "Adyant Nexa", a premium, high-ticket, India-focused AI integration and web engineering agency.
  
  Your goal is to write highly authoritative, high-converting social media content that qualifies prospective high-ticket B2B clients (SaaS founders, SMEs, enterprise managers) by demonstrating deep technical authority and financial value.
  ${directiveBlock}${dedupBlock}
  ---
  
  # 🎯 BRAND IDENTITIES & DESIGN SKILL RULES:
  - Brand Palette: Void Black (#020202), Electric Cyan (#00F2FF), Platinum White (#E5E5E5).
  - Graphic Design Style: Apple/Stripe-like high-end minimalist tech aesthetic. High-contrast layout, procedural 3D geometric grids, glassmorphism panels, and thin glowing neon-cyan cyberlines. 
  - DO NOT recommend generic stock photos, cartoon cliparts, or boring colorful corporate gradients.
  
  ---
  
  # 📝 ELITE COPYWRITING RULES:
  1. Ban all AI Tells & Slop:
     - Absolute BAN on: "delve", "testament", "tapestry", "revolutionizing", "thrilled", "look no further", "in a world where...", "unlock the potential", "beacon", "game-changer", "elevate", "powerhouse", "dynamic".
     - No throat-clearing introductions, meta-commentary, or rhetorical announcements.
     - Avoid dramatic fragmentation, false agency, or passive voice.
  2. Vary sentence lengths dynamically to create a highly natural, human rhythm.
     - Active voice ONLY. Use strong, decisive verbs.
  3. B2B Copywriting Frameworks:
     - Use the PAS (Problem, Agitate, Solve) framework for LinkedIn posts.
  
  ---
  
  Generate exactly 5 distinct, high-impact social media posts based on these themes:
  ${JSON.stringify(themesToUse, null, 2)}
  
  For each post, output a JSON object containing:
  1. "topic": A short 3-5 word high-impact headline.
  2. "platforms": An array containing target channels (choose from: ["LinkedIn", "Instagram", "Facebook"]).
  3. "caption": Elite, high-conversion copy. You must generate platform-specific versions formatted inside this single string using the following exact headers:
     [LINKEDIN]
     (Detailed B2B copy using the PAS framework, high technical depth, professional tone, ending with a link to adyantnexa.com)
     
     [INSTAGRAM]
     (Visual-first, punchy copy with line breaks and relevant hashtags, ending with link-in-bio call-to-action)
     
     [FACEBOOK]
     (Short, direct, high-impact copy tailored for a Facebook Page update, ending with a link to adyantnexa.com)
  4. "visualPrompt": A specific instruction describing a social media graphic with #020202 black background, #00F2FF cyan accents, bold uppercase text overlay, and premium tech-aesthetic mockup.
  
  Return the output ONLY as a valid JSON array of objects. Do not include markdown code block syntax or any extra text.
  `;

  const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash"];
  let lastError: Error | null = null;

  for (const modelName of modelsToTry) {
    try {
      const model = ai.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      let text = result.response.text();

      // Clean up markdown blocks if returned
      if (text.startsWith("```json")) {
        text = text.substring(7);
      }
      if (text.endsWith("```")) {
        text = text.substring(0, text.length - 3);
      }
      text = text.trim();

      const posts = JSON.parse(text);
      return posts;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError || new Error("All Gemini models failed.");
}

// --- Inline Lark Sync (replaces child process) ---
async function syncPostsToLark(posts: Record<string, unknown>[]) {
  const token = await getTenantAccessToken();
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records`;
  const logs: string[] = [];

  for (const post of posts) {
    let visualPromptStr = "";
    if (typeof post.visualPrompt === 'object' && post.visualPrompt !== null) {
      visualPromptStr = JSON.stringify(post.visualPrompt);
    } else {
      visualPromptStr = String(post.visualPrompt || "");
    }

    const recordPayload = {
      fields: {
        "Topic": post.topic,
        "Platform": post.platforms,
        "Caption": post.caption,
        "Visual Design Prompt": visualPromptStr,
        "Status": "Draft"
      }
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(recordPayload)
      });

      const resData = await response.json();
      if (resData.code === 0) {
        logs.push(`✅ Draft synced: "${post.topic}"`);
      } else {
        logs.push(`❌ Sync Failed for "${post.topic}": ${resData.msg}`);
      }
    } catch (err) {
      logs.push(`❌ Network error syncing "${post.topic}": ${err}`);
    }
  }

  return logs;
}

// --- Inline Publisher (replaces child process) ---
async function runPublisher() {
  const token = await getTenantAccessToken();
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records`;
  const logs: string[] = [];

  const response = await fetch(url, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await response.json();
  if (data.code === 0 && data.data && data.data.items) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const approvedItems = data.data.items.filter((item: any) => item.fields && item.fields.Status === "Approved");
    logs.push(`📥 Found ${approvedItems.length} approved posts ready for publishing.`);

    if (approvedItems.length === 0) {
      logs.push("ℹ️ No posts marked as 'Approved' in Lark Base. Nothing to publish.");
      return { logs };
    }

    const defaultNeonGraphic = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const record of approvedItems) {
      const recordId = record.record_id;
      const topic = record.fields["Topic"] || "Untitled";
      const platforms = record.fields["Platform"] || [];
      const caption = record.fields["Caption"] || "";
      
      let imageUrl = record.fields["Visual Asset URL"] || defaultNeonGraphic;
      // Social API platforms (Meta, LinkedIn) reject localhost/internal URLs
      if (imageUrl.includes("localhost") || imageUrl.startsWith("/") || !imageUrl.startsWith("http")) {
        imageUrl = defaultNeonGraphic;
      }

      logs.push(`📬 Processing: "${topic}" → platforms: [${platforms.join(", ")}]`);

      let successCount = 0;
      let targetCount = platforms.length;
      let lastPostLink = "";

      const captions = parsePlatformCaptions(caption);

      for (const platform of platforms) {
        try {
          if (platform === "Instagram") {
            logs.push(`📸 Posting "${topic}" to Instagram Business Account...`);
            const link = await publishToInstagram(imageUrl, captions.instagram);
            successCount++;
            lastPostLink = link;
            logs.push(`✅ Instagram Post Live: ${link}`);
          } else if (platform === "Facebook") {
            logs.push(`👤 Posting "${topic}" to Facebook Page...`);
            const link = await publishToFacebook(imageUrl, captions.facebook);
            successCount++;
            lastPostLink = link;
            logs.push(`✅ Facebook Post Live: ${link}`);
          } else if (platform === "LinkedIn") {
            logs.push(`💼 Posting "${topic}" to LinkedIn...`);
            const link = await publishToLinkedIn(captions.linkedin, imageUrl);
            successCount++;
            lastPostLink = link;
            logs.push(`✅ LinkedIn Post Live: ${link}`);
          }
        } catch (pubErr: any) {
          logs.push(`❌ Failed to publish to ${platform}: ${pubErr.message}`);
        }
      }

      // Update status in Lark
      const finalStatus = successCount === targetCount ? "Published" : (successCount > 0 ? "Published" : "Failed");
      try {
        const updateUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/${recordId}`;
        await fetch(updateUrl, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ 
            fields: { 
              "Status": finalStatus,
              ...(lastPostLink ? { "Post Link": lastPostLink } : {})
            } 
          })
        });
        logs.push(`✅ Lark base status updated to "${finalStatus}" for "${topic}".`);
      } catch (err: any) {
        logs.push(`❌ Failed to update status in Lark CRM: ${err.message}`);
      }
    }
  } else {
    logs.push("ℹ️ No records found in Lark Base.");
  }

  return { logs };
}

// --- GET: Fetch all records from Lark ---
export async function GET(req: Request) {
  try {
    const authResult = await verifyAdmin(req);
    if (!(authResult as { authorized: true }).authorized) return authResult as NextResponse;

    if (!LARK_APP_ID || !LARK_APP_SECRET || !LARK_BASE_ID || !LARK_TABLE_ID) {
      return NextResponse.json({ error: "Missing Lark Configuration in env" }, { status: 500 });
    }

    const token = await getTenantAccessToken();
    const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=50`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await response.json();
    if (data.code === 0 && data.data && data.data.items) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const records = data.data.items.map((item: any) => ({
        id: item.record_id,
        topic: item.fields["Topic"] || "Untitled",
        platforms: item.fields["Platform"] || [],
        caption: item.fields["Caption"] || "",
        visualPrompt: item.fields["Visual Design Prompt"] || "",
        status: item.fields["Status"] || "Draft",
        visualUrl: item.fields["Visual Asset URL"] || "",
        postLink: item.fields["Post Link"] || ""
      }));
      return NextResponse.json({ success: true, records });
    } else {
      return NextResponse.json({ success: true, records: [] });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("GET Lark Records Error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// --- POST: Generate, Publish, or Regenerate Image ---
export async function POST(request: Request) {
  try {
    const authResult = await verifyAdmin(request);
    if (!(authResult as { authorized: true }).authorized) return authResult as NextResponse;

    if (!validateBodySize(request)) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const rl = await checkRateLimit(request, "default");
    if (!rl.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = SocialAutomationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { action, topic, filename, recordId, customTopic, directive } = parsed.data;

    // --- ACTION: GENERATE ---
    if (action === "generate") {
      const allLogs: string[] = [];
      allLogs.push("🤖 Content Writer Agent (Gemini) starting...");

      if (customTopic) {
        allLogs.push(`🎯 Custom Campaign Topic: "${customTopic}"`);
      }
      if (directive) {
        allLogs.push(`📋 CEO Directive Active: "${directive}"`);
      }

      // Step 0: Fetch existing posts from Lark to prevent duplicate content
      let previousTopics: string[] = [];
      try {
        if (LARK_APP_ID && LARK_APP_SECRET && LARK_BASE_ID && LARK_TABLE_ID) {
          const token = await getTenantAccessToken();
          const fetchUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=100`;
          const existingRes = await fetch(fetchUrl, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
          });
          const existingData = await existingRes.json();
          if (existingData.code === 0 && existingData.data?.items) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            previousTopics = existingData.data.items
              .map((item: any) => item.fields?.["Topic"] as string)
              .filter(Boolean);
            allLogs.push(`🧠 Content Memory loaded: ${previousTopics.length} previous posts found. Will avoid duplicates.`);
          }
        }
      } catch (memErr) {
        allLogs.push(`⚠️ Could not load content memory: ${memErr}. Generating without dedup.`);
      }

      // Step 1: Generate posts via Gemini (with content memory)
      const posts = await generateSocialPosts(customTopic || null, directive || null, previousTopics);
      allLogs.push(`✅ Generated ${posts.length} premium social posts!`);

      // Step 2: Sync to Lark CRM
      try {
        const syncLogs = await syncPostsToLark(posts);
        allLogs.push(...syncLogs);
        allLogs.push("🎉 Stage 1 Complete! Drafts synced to Lark Base CRM.");
      } catch (syncErr) {
        allLogs.push(`❌ Lark sync failed: ${syncErr}. Posts generated but not synced.`);
      }

      return NextResponse.json({ success: true, logs: allLogs.join("\n") });
    }

    // --- ACTION: PUBLISH ---
    if (action === "publish") {
      const result = await runPublisher();
      return NextResponse.json({ success: true, logs: result.logs.join("\n") });
    }

    // --- ACTION: REGENERATE IMAGE ---
    if (action === "regenerate-image") {
      if (!topic) {
        return NextResponse.json({ error: "Topic is required for regenerate-image" }, { status: 400 });
      }

      const safeFilename = (filename || topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")).substring(0, 30);
      if (/^[a-z0-9-]+$/.test(safeFilename) === false) {
        return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
      }

      const logs: string[] = [];
      logs.push(`🎨 Spawning Image Generation for: "${topic}"`);

      let generatedUrls: Record<string, string>;
      try {
        generatedUrls = await generateAndSaveAllSizes(topic, safeFilename);
        logs.push(`✅ Graphics generated successfully for square, portrait, and reel.`);
      } catch (genErr: any) {
        logs.push(`❌ Image Generation Failed: ${genErr.message}`);
        return NextResponse.json({ error: `Image Generation Failed: ${genErr.message}`, logs: logs.join("\n") }, { status: 500 });
      }

      const localVisualUrl = generatedUrls.square;
      const localVisualPortraitUrl = generatedUrls.portrait;
      const localVisualReelUrl = generatedUrls.reel;

      if (recordId) {
        try {
          const token = await getTenantAccessToken();
          const updateUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/${recordId}`;

          const host = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
          const fullHostUrl = `${host}${localVisualUrl}`;

          await fetch(updateUrl, {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              fields: {
                "Visual Asset URL": fullHostUrl
              }
            })
          });
          logs.push(`✅ Lark Base record updated with new Visual Asset URL: ${fullHostUrl}`);
        } catch (larkErr: any) {
          logs.push(`⚠️ Lark Base record update failed: ${larkErr.message}`);
        }
      }

      return NextResponse.json({
        success: true,
        logs: logs.join("\n"),
        urls: {
          square: localVisualUrl,
          portrait: localVisualPortraitUrl,
          reel: localVisualReelUrl
        }
      });
    }

    return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("POST Social Automation Error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
