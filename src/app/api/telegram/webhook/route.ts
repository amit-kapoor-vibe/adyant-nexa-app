import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateAllSizes } from "@/scripts/social-automation/generate-images";
import { generateReel } from "@/scripts/social-automation/generate-video";
import { generateSocialPosts } from "@/scripts/social-automation/generate-content";
import { syncPostsToLark, fetchApprovedPosts, updatePostStatus, getTenantAccessToken } from "@/scripts/social-automation/lark-connector";
import { publishToInstagram, publishToFacebook } from "@/lib/agent-ops/publishing";
import { publishToLinkedIn } from "@/lib/agent-ops/publishing";
import { uploadMediaToCloudStorage } from "@/lib/agent-ops/storage";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const ai = new GoogleGenerativeAI(GOOGLE_API_KEY || "");
let draftsCache: any[] = [];

async function sendTelegramMessage(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "Markdown"
      })
    });
  } catch (err: any) {
    console.error("[Telegram Webhook] Failed to send message:", err.message);
  }
}

async function sendTelegramPhoto(filePath: string, caption?: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
  try {
    if (!fs.existsSync(filePath)) return;
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: "image/png" });
    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("photo", blob, path.basename(filePath));
    if (caption) formData.append("caption", caption.substring(0, 1024));

    await fetch(url, { method: "POST", body: formData });
  } catch (err: any) {
    console.error("[Telegram Webhook] Photo send error:", err.message);
  }
}

async function sendTelegramVideo(filePath: string, caption?: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendVideo`;
  try {
    if (!fs.existsSync(filePath)) return;
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: "video/mp4" });
    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("video", blob, path.basename(filePath));
    if (caption) formData.append("caption", caption.substring(0, 1024));

    await fetch(url, { method: "POST", body: formData });
  } catch (err: any) {
    console.error("[Telegram Webhook] Video send error:", err.message);
  }
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

async function ensureDraftsCache() {
  if (draftsCache.length > 0) return;
  const token = await getTenantAccessToken();
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=100`;
  const response = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await response.json();
  if (data.code === 0 && data.data && data.data.items) {
    draftsCache = data.data.items.filter((item: any) => item.fields.Status === "Draft");
  }
}

async function handleStatus() {
  try {
    const token = await getTenantAccessToken();
    const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=100`;
    const response = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
    const data = await response.json();
    
    let draftCount = 0, approvedCount = 0, publishedCount = 0, failedCount = 0;
    if (data.code === 0 && data.data?.items) {
      data.data.items.forEach((item: any) => {
        const s = item.fields.Status;
        if (s === "Draft") draftCount++;
        else if (s === "Approved") approvedCount++;
        else if (s === "Published") publishedCount++;
        else if (s === "Failed") failedCount++;
      });
    }

    const statusText = `*Agent Ops System Status (Serverless Webhook)*

*Active Agents:*
* CEO Agent (Aria): ACTIVE
* CMO Agent (Nova): LISTENING
* CTO Agent (Krypton): SECURED

*CRM Ledger Statistics:*
* Drafts in Queue: ${draftCount}
* Approved Posts: ${approvedCount}
* Successfully Published: ${publishedCount}
* Failed Posts: ${failedCount}`;

    await sendTelegramMessage(statusText);
  } catch (err: any) {
    await sendTelegramMessage(`Status error: ${err.message}`);
  }
}

async function handleList() {
  try {
    const token = await getTenantAccessToken();
    const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=100`;
    const response = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
    const data = await response.json();

    if (data.code === 0 && data.data?.items) {
      const drafts = data.data.items.filter((item: any) => item.fields.Status === "Draft");
      draftsCache = drafts;

      if (drafts.length === 0) {
        await sendTelegramMessage("No drafts in Lark Bitable CRM. Run /generate <topic> to create some.");
        return;
      }

      let listText = `*Draft Queue (${drafts.length} posts found):*\n\n`;
      drafts.forEach((item: any, index: number) => {
        const topic = item.fields.Topic || "Untitled";
        const platforms = (item.fields.Platform || []).join(", ");
        listText += `*${index + 1}.* "${topic}" (${platforms})\n`;
      });
      listText += `\nUse \`/preview <number>\` to view visual, or \`/approve <number>\` to approve.`;
      await sendTelegramMessage(listText);
    }
  } catch (err: any) {
    await sendTelegramMessage(`Error listing drafts: ${err.message}`);
  }
}

async function handleApprove(indexStr: string) {
  await ensureDraftsCache();
  const index = parseInt(indexStr, 10) - 1;
  if (isNaN(index) || index < 0 || index >= draftsCache.length) {
    await sendTelegramMessage("Invalid draft index. Use /list to see active drafts.");
    return;
  }

  const post = draftsCache[index];
  const recordId = post.record_id;
  const topic = post.fields.Topic || "Untitled";

  try {
    await sendTelegramMessage(`Approving post: "${topic}"...`);
    await updatePostStatus(recordId, "Approved");
    await sendTelegramMessage(`Approved successfully! Execute /publish to publish.`);
  } catch (err: any) {
    await sendTelegramMessage(`Approval failed: ${err.message}`);
  }
}

async function handlePublish() {
  await sendTelegramMessage("Publisher Agent activated. Scanning Lark Base for 'Approved' posts...");
  try {
    const approvedPosts = await fetchApprovedPosts();
    if (approvedPosts.length === 0) {
      await sendTelegramMessage("No posts marked as 'Approved' in Lark. Nothing to publish.");
      return;
    }

    const defaultNeonGraphic = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop";

    for (const record of approvedPosts) {
      const recordId = record.record_id;
      const fields = record.fields;
      const topic = fields.Topic || "Untitled";
      const caption = fields.Caption || "";
      const platforms = fields.Platform || [];
      
      let imageUrl = fields["Visual Asset URL"] || defaultNeonGraphic;
      if (imageUrl.includes("localhost") || imageUrl.startsWith("/") || !imageUrl.startsWith("http")) {
        imageUrl = defaultNeonGraphic;
      }

      await sendTelegramMessage(`Publishing: "${topic}" -> [${platforms.join(", ")}]`);

      let successCount = 0;
      let lastPostLink = "";
      const captions = parsePlatformCaptions(caption);

      for (const platform of platforms) {
        try {
          if (platform === "Instagram") {
            const link = await publishToInstagram(imageUrl, captions.instagram);
            successCount++;
            lastPostLink = link;
          } else if (platform === "Facebook") {
            const link = await publishToFacebook(imageUrl, captions.facebook);
            successCount++;
            lastPostLink = link;
          } else if (platform === "LinkedIn") {
            const link = await publishToLinkedIn(captions.linkedin, imageUrl);
            successCount++;
            lastPostLink = link;
          }
        } catch (pubErr: any) {
          await sendTelegramMessage(`Failed to publish to ${platform}: ${pubErr.message}`);
        }
      }

      const finalStatus = successCount === platforms.length ? "Published" : (successCount > 0 ? "Published" : "Failed");
      await updatePostStatus(recordId, finalStatus, lastPostLink);

      if (successCount > 0) {
        await sendTelegramMessage(`Published successfully: "${topic}"!\nLink: ${lastPostLink || "Stored in CRM"}`);
      } else {
        await sendTelegramMessage(`Publish failed for: "${topic}"`);
      }
    }
  } catch (err: any) {
    await sendTelegramMessage(`Publisher failed: ${err.message}`);
  }
}

async function handleGenerate(topic: string) {
  if (!topic) {
    await sendTelegramMessage("Please specify a topic. Usage: /generate <your topic>");
    return;
  }

  await sendTelegramMessage(`CMO Agent (Nova) generating posts for topic: "${topic}"...`);
  try {
    const posts = await (generateSocialPosts as any)(topic);
    await sendTelegramMessage(`Generated ${posts.length} drafts! Syncing to Lark CRM...`);
    await syncPostsToLark(posts);
    await sendTelegramMessage(`All drafts created! Use /list to view or approve.`);
  } catch (err: any) {
    await sendTelegramMessage(`Generation error: ${err.message}`);
  }
}

export async function POST(req: Request) {
  try {
    const update = await req.json();
    const message = update.message;

    if (!message) {
      return NextResponse.json({ status: "ignored_no_message" });
    }

    const chatId = String(message.chat.id);
    if (chatId !== String(TELEGRAM_CHAT_ID)) {
      return NextResponse.json({ status: "unauthorized" }, { status: 403 });
    }

    const text = message.text?.trim() || "";

    if (text === "/start" || text === "/help") {
      await sendTelegramMessage(`*Adyant Nexa Agent Ops Command Center*

Commands:
/status - System and CRM statistics
/list - Active drafts queue
/preview <num> - Graphic preview
/reel <num> - AI Voiceover Reel
/approve <num> - Approve draft
/generate <topic> - Write posts
/publish - Multi-platform publish`);
    } else if (text === "/status") {
      await handleStatus();
    } else if (text === "/list") {
      await handleList();
    } else if (text.startsWith("/approve")) {
      const args = text.split(" ").slice(1).join(" ");
      await handleApprove(args);
    } else if (text.startsWith("/generate")) {
      const args = text.split(" ").slice(1).join(" ");
      await handleGenerate(args);
    } else if (text === "/publish") {
      await handlePublish();
    } else if (text) {
      // Natural language Gemini fallback
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are Nova, CMO Agent at Adyant Nexa. Respond to this admin message directly and concisely without emojis: "${text}"`;
      const res = await model.generateContent(prompt);
      await sendTelegramMessage(res.response.text());
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[Telegram Webhook POST Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Telegram Webhook Active", endpoint: "/api/telegram/webhook" });
}
