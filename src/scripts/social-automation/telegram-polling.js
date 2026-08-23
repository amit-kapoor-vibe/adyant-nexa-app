/**
 * Adyant Nexa - Agent Ops Telegram Management Bot (via Long Polling)
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.resolve(__dirname, '../../../.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error("Error: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in .env.local");
  process.exit(1);
}

// Import existing social automation libraries
const { generateSocialPosts } = require('./generate-content');
const { syncPostsToLark, fetchApprovedPosts, updatePostStatus } = require('./lark-connector');
const { publishToInstagram, publishToFacebook } = require('./publish-meta');
const { publishToLinkedIn } = require('./publish-linkedin');
const { getTenantAccessToken } = require('./lark-connector');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const { generateAllSizes } = require('./generate-images');
const { generateReel } = require('./generate-video');

const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;

let lastOffset = 0;
let draftsCache = []; // In-memory cache for /approve indexing
const pendingUploads = {}; // In-memory session state for uploads without caption

async function sendTelegramMessage(text) {
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
  } catch (err) {
    console.error("Failed to send telegram message:", err.message);
  }
}

async function sendTelegramPhoto(filePath, caption) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
  try {
    if (!fs.existsSync(filePath)) {
      console.warn("[TelegramBot] Photo file does not exist:", filePath);
      return;
    }
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: "image/png" });
    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("photo", blob, path.basename(filePath));
    if (caption) {
      formData.append("caption", caption.substring(0, 1024)); // Telegram caption length limit is 1024 chars
    }

    await fetch(url, {
      method: "POST",
      body: formData
    });
  } catch (err) {
    console.error("[TelegramBot] Failed to send photo:", err.message);
  }
}

async function sendTelegramVideo(filePath, caption) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendVideo`;
  try {
    if (!fs.existsSync(filePath)) {
      console.warn("[TelegramBot] Video file does not exist:", filePath);
      return;
    }
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: "video/mp4" });
    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("video", blob, path.basename(filePath));
    if (caption) {
      formData.append("caption", caption.substring(0, 1024));
    }

    await fetch(url, {
      method: "POST",
      body: formData
    });
  } catch (err) {
    console.error("[TelegramBot] Failed to send video:", err.message);
  }
}

function parsePlatformCaptions(fullCaption) {
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


async function handleStart() {
  const helpText = `*Adyant Nexa Agent Ops Bot*

Use these commands to manage your automated agency marketing:

/status - Check agents and CRM status
/list - List latest drafts from Lark CRM
/preview <number> - View generated image and caption for a draft
/reel <number> - Generate AI voiceover and video reel for a draft
/approve <number> - Approve a draft by its index number
/generate <topic> - Trigger Gemini writer on a custom topic
/publish - Publish all approved drafts to social media
/help - Show this message`;

  await sendTelegramMessage(helpText);
}

async function handleStatus() {
  try {
    const token = await getTenantAccessToken();
    const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=100`;
    const response = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();
    
    let draftCount = 0;
    let approvedCount = 0;
    let publishedCount = 0;
    let failedCount = 0;

    if (data.code === 0 && data.data && data.data.items) {
      data.data.items.forEach(item => {
        const status = item.fields.Status;
        if (status === "Draft") draftCount++;
        else if (status === "Approved") approvedCount++;
        else if (status === "Published") publishedCount++;
        else if (status === "Failed") failedCount++;
      });
    }

    const statusText = `*Agent Ops System Status*

*Active Agents:*
* CEO Agent (Aria): ACTIVE
* CMO Agent (Nova): LISTENING
* CTO Agent (Krypton): SECURED

*CRM Ledger Statistics:*
* Drafts in Queue: ${draftCount}
* Approved Posts (Pending Publish): ${approvedCount}
* Successfully Published: ${publishedCount}
* Failed Posts: ${failedCount}`;

    await sendTelegramMessage(statusText);
  } catch (err) {
    await sendTelegramMessage(`Failed to fetch status: ${err.message}`);
  }
}

async function handleList() {
  try {
    const token = await getTenantAccessToken();
    const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=100`;
    const response = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();

    if (data.code === 0 && data.data && data.data.items) {
      // Get only Drafts
      const drafts = data.data.items.filter(item => item.fields.Status === "Draft");
      draftsCache = drafts; // Cache in memory

      if (drafts.length === 0) {
        await sendTelegramMessage("No drafts found in Lark Bitable CRM. Run /generate to create some.");
        return;
      }

      let listText = `*Draft Queue (${drafts.length} posts found):*\n\n`;
      drafts.forEach((item, index) => {
        const topic = item.fields.Topic || "Untitled";
        const platforms = (item.fields.Platform || []).join(", ");
        listText += `*${index + 1}.* "${topic}" (${platforms})\n`;
      });
      listText += `\nUse \`/preview <number>\` to view the graphic, or \`/approve <number>\` to approve it for publishing.`;
      
      await sendTelegramMessage(listText);
    } else {
      await sendTelegramMessage("Failed to fetch drafts from Lark CRM.");
    }
  } catch (err) {
    await sendTelegramMessage(`Error: ${err.message}`);
  }
}

async function ensureDraftsCache() {
  if (draftsCache.length > 0) return;
  console.log("[TelegramBot] Cache is empty. Fetching drafts from Lark Base...");
  const token = await getTenantAccessToken();
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=100`;
  const response = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await response.json();
  if (data.code === 0 && data.data && data.data.items) {
    draftsCache = data.data.items.filter(item => item.fields.Status === "Draft");
    console.log(`[TelegramBot] Cache populated with ${draftsCache.length} drafts.`);
  }
}


async function handleApprove(indexStr) {
  try {
    await ensureDraftsCache();
  } catch (err) {
    await sendTelegramMessage(`Failed to fetch drafts list: ${err.message}`);
    return;
  }

  const index = parseInt(indexStr, 10) - 1;
  if (isNaN(index) || index < 0 || index >= draftsCache.length) {
    await sendTelegramMessage("Invalid index. Use /list to see active drafts and specify a valid number.");
    return;
  }

  const post = draftsCache[index];
  const recordId = post.record_id;
  const topic = post.fields.Topic || "Untitled";

  try {
    await sendTelegramMessage(`Approving post: "${topic}"...`);
    await updatePostStatus(recordId, "Approved");
    await sendTelegramMessage(`Approved successfully! Post is ready to be published via /publish.`);
    // Refresh list cache
    await handleList();
  } catch (err) {
    await sendTelegramMessage(`Approval failed: ${err.message}`);
  }
}

async function handlePreview(indexStr) {
  try {
    await ensureDraftsCache();
  } catch (err) {
    await sendTelegramMessage(`Failed to fetch drafts list: ${err.message}`);
    return;
  }

  const index = parseInt(indexStr, 10) - 1;
  if (isNaN(index) || index < 0 || index >= draftsCache.length) {
    await sendTelegramMessage("Invalid index. Use /list to see active drafts first.");
    return;
  }

  const post = draftsCache[index];
  const topic = post.fields.Topic || "Untitled";
  const caption = post.fields.Caption || "";
  const platforms = (post.fields.Platform || []).join(", ");
  
  const safeFilename = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").substring(0, 30);
  const imagePath = path.join(__dirname, '../../../public/generated-images', `${safeFilename}-square.png`);

  if (!fs.existsSync(imagePath)) {
    await sendTelegramMessage(`Generating preview graphic for: "${topic}"...`);
    try {
      await generateAllSizes(topic, path.join(__dirname, '../../../public/generated-images'), safeFilename);
    } catch (imgErr) {
      console.error("Preview graphic generation failed:", imgErr.message);
    }
  }

  if (fs.existsSync(imagePath)) {
    const captionText = `*Preview Draft #${index + 1}: ${topic}*\n\n${caption}\n\nPlatforms: [${platforms}]`;
    await sendTelegramPhoto(imagePath, captionText);
  } else {
    const captionText = `*Preview Draft #${index + 1}: ${topic}*\n\n${caption}\n\nPlatforms: [${platforms}]\n\n*(Graphic not found)*`;
    await sendTelegramMessage(captionText);
  }
}

async function handleReel(indexStr) {
  try {
    await ensureDraftsCache();
  } catch (err) {
    await sendTelegramMessage(`Failed to fetch drafts list: ${err.message}`);
    return;
  }

  const index = parseInt(indexStr, 10) - 1;
  if (isNaN(index) || index < 0 || index >= draftsCache.length) {
    await sendTelegramMessage("Invalid index. Use /list to see active drafts first.");
    return;
  }

  const post = draftsCache[index];
  const topic = post.fields.Topic || "Untitled";
  const caption = post.fields.Caption || "";

  const safeFilename = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").substring(0, 30);
  const videoPath = path.join(__dirname, '../../../public/generated-videos', `${safeFilename}.mp4`);

  await sendTelegramMessage(`Generating Google Neural voiceover and vertical reel for: "${topic}"...`);

  try {
    const renderedPath = await generateReel(topic, caption || topic, safeFilename);
    if (fs.existsSync(renderedPath)) {
      const captionText = `*AI Reel Generated #${index + 1}: ${topic}*\n\nVoice: Google Neural2-F\nFormat: 1080x1920 Vertical Reel`;
      await sendTelegramVideo(renderedPath, captionText);
    } else {
      await sendTelegramMessage("Reel render completed, but output file was not found.");
    }
  } catch (err) {
    console.error("Reel generation failed:", err.message);
    await sendTelegramMessage(`Reel generation failed: ${err.message}`);
  }
}

async function handleGenerate(topic) {
  if (!topic) {
    await sendTelegramMessage("Please specify a topic. Usage: /generate <your topic>");
    return;
  }

  await sendTelegramMessage(`CMO Agent (Nova) initiated content generation for topic: "${topic}"...`);
  try {
    const posts = await generateSocialPosts(topic);
    await sendTelegramMessage(`Successfully generated ${posts.length} drafts! Syncing to Lark CRM and rendering brand graphics...`);
    
    // Sync to Lark
    await syncPostsToLark(posts);

    // Generate graphics and send previews to Telegram
    for (const post of posts) {
      const safeFilename = post.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").substring(0, 30);
      try {
        await generateAllSizes(post.topic, path.join(__dirname, '../../../public/generated-images'), safeFilename);
        
        const imagePath = path.join(__dirname, '../../../public/generated-images', `${safeFilename}-square.png`);
        if (fs.existsSync(imagePath)) {
          const captionText = `*Draft Generated: ${post.topic}*\n\n${post.caption}\n\nPlatforms: [${post.platforms.join(", ")}]`;
          await sendTelegramPhoto(imagePath, captionText);
        }
      } catch (imgErr) {
        console.error(`Failed to generate visual for ${post.topic}:`, imgErr.message);
        await sendTelegramMessage(`*Draft Generated: ${post.topic}*\n\n${post.caption}\n\nPlatforms: [${post.platforms.join(", ")}]`);
      }
    }

    await sendTelegramMessage(`All drafts and graphics created. Use /list to manage approving/publishing.`);
  } catch (err) {
    await sendTelegramMessage(`Generation failed: ${err.message}`);
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

      await sendTelegramMessage(`Publishing: "${topic}" → [${platforms.join(", ")}]`);

      let successCount = 0;
      let targetCount = platforms.length;
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
        } catch (pubErr) {
          await sendTelegramMessage(`Failed to publish to ${platform}: ${pubErr.message}`);
        }
      }

      const finalStatus = successCount === targetCount ? "Published" : (successCount > 0 ? "Published" : "Failed");
      await updatePostStatus(recordId, finalStatus, lastPostLink);

      if (successCount > 0) {
        await sendTelegramMessage(`Published successfully: "${topic}"!\nLink: ${lastPostLink || "Stored in CRM"}`);
      } else {
        await sendTelegramMessage(`Publish failed for: "${topic}"`);
      }
    }
  } catch (err) {
    await sendTelegramMessage(`Publisher failed: ${err.message}`);
  }
}

async function downloadFile(fileId, destPath) {
  const fileUrlRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
  const fileData = await fileUrlRes.json();
  if (fileData.ok && fileData.result) {
    const filePath = fileData.result.file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
    const fileRes = await fetch(downloadUrl);
    const arrayBuffer = await fileRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    return true;
  }
  return false;
}

async function executePublishingFlow(filePath, cleanCaption, platforms) {
  // Create record in Lark CRM
  const postRecord = {
    topic: `Telegram Upload - ${new Date().toLocaleDateString()}`,
    caption: cleanCaption,
    platforms: platforms,
    visualPrompt: "User uploaded visual from Telegram"
  };

  await syncPostsToLark([postRecord]);
  
  // Fetch the newly synced post to get its recordId
  const token = await getTenantAccessToken();
  const larkUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=5`;
  const response = await fetch(larkUrl, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const larkData = await response.json();
  let recordId = null;
  if (larkData.code === 0 && larkData.data && larkData.data.items) {
    const matched = larkData.data.items.find(item => item.fields.Topic && item.fields.Topic.includes("Telegram Upload"));
    if (matched) recordId = matched.record_id;
  }

  // Now publish
  const defaultNeonGraphic = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop";
  let publicImageUrl = defaultNeonGraphic; // Fallback URL for social platforms
  
  let successCount = 0;
  let lastPostLink = "";

  for (const platform of platforms) {
    try {
      if (platform === "Instagram") {
        const link = await publishToInstagram(publicImageUrl, cleanCaption);
        successCount++;
        lastPostLink = link;
      } else if (platform === "Facebook") {
        const link = await publishToFacebook(publicImageUrl, cleanCaption);
        successCount++;
        lastPostLink = link;
      } else if (platform === "LinkedIn") {
        const link = await publishToLinkedIn(cleanCaption, publicImageUrl);
        successCount++;
        lastPostLink = link;
      }
    } catch (pubErr) {
      await sendTelegramMessage(`Failed to publish to ${platform}: ${pubErr.message}`);
    }
  }

  const finalStatus = successCount === platforms.length ? "Published" : (successCount > 0 ? "Published" : "Failed");
  if (recordId) {
    await updatePostStatus(recordId, finalStatus, lastPostLink);
  }

  if (successCount > 0) {
    await sendTelegramMessage(`Media successfully published to [${platforms.join(", ")}]!\nLink: ${lastPostLink || "Stored in CRM"}`);
  } else {
    await sendTelegramMessage("Publish failed for uploaded media.");
  }
}

async function handleMediaUpload(message, chat_id) {
  let fileId = null;
  let fileExtension = "png";
  
  if (message.photo && message.photo.length > 0) {
    fileId = message.photo[message.photo.length - 1].file_id;
    fileExtension = "png";
  } else if (message.video) {
    fileId = message.video.file_id;
    fileExtension = "mp4";
  } else if (message.document) {
    fileId = message.document.file_id;
    const docName = message.document.file_name || "";
    fileExtension = docName.split('.').pop() || "png";
  }
  
  if (!fileId) return;

  const timestamp = Date.now();
  const filename = `telegram-upload-${timestamp}.${fileExtension}`;
  const destPath = path.join(__dirname, '../../../public/generated-images', filename);

  const captionText = message.caption || "";
  
  if (!captionText) {
    // Media uploaded without caption! Store in session and ask the user for caption
    await sendTelegramMessage("Media detected. Downloading to local gallery...");
    try {
      const downloadSuccess = await downloadFile(fileId, destPath);
      if (!downloadSuccess) {
        await sendTelegramMessage("Failed to download media file from Telegram.");
        return;
      }
      
      // Store in session
      pendingUploads[chat_id] = {
        filePath: destPath,
        fileExtension: fileExtension,
        timestamp: timestamp
      };
      
      await sendTelegramMessage("Media downloaded successfully! Please reply with the caption you want to publish. You can include hashtags like #linkedin, #instagram, #facebook to specify platforms. Type /cancel to abort.");
    } catch (err) {
      await sendTelegramMessage(`Error downloading media: ${err.message}`);
    }
    return;
  }

  // Caption is present, proceed with immediate publishing
  const lowerCaption = captionText.toLowerCase();
  
  let platforms = [];
  if (lowerCaption.includes("#linkedin")) platforms.push("LinkedIn");
  if (lowerCaption.includes("#instagram")) platforms.push("Instagram");
  if (lowerCaption.includes("#facebook")) platforms.push("Facebook");
  
  if (platforms.length === 0) {
    platforms = ["LinkedIn", "Instagram", "Facebook"];
  }

  const cleanCaption = captionText
    .replace(/#linkedin/gi, "")
    .replace(/#instagram/gi, "")
    .replace(/#facebook/gi, "")
    .trim();

  await sendTelegramMessage("Media upload detected with caption. Downloading file...");
  
  try {
    const downloadSuccess = await downloadFile(fileId, destPath);
    if (!downloadSuccess) {
      await sendTelegramMessage("Failed to download media file from Telegram.");
      return;
    }

    await sendTelegramMessage(`Media downloaded! Syncing to Lark CRM and publishing to [${platforms.join(", ")}]...`);
    await executePublishingFlow(destPath, cleanCaption, platforms);
  } catch (err) {
    await sendTelegramMessage(`Error processing media upload: ${err.message}`);
  }
}

async function handleImagePrompt(promptText) {
  if (!promptText) {
    await sendTelegramMessage("Please specify an image prompt. Usage: /image <your prompt>");
    return;
  }

  await sendTelegramMessage(`Generating 4K Brand Graphic for prompt: "${promptText}"...`);
  try {
    const safeFilename = promptText.toLowerCase().replace(/[^a-z0-9]+/g, "-").substring(0, 30);
    await generateAllSizes(promptText, path.join(__dirname, '../../../public/generated-images'), safeFilename);
    const imagePath = path.join(__dirname, '../../../public/generated-images', `${safeFilename}-square.png`);
    
    if (fs.existsSync(imagePath)) {
      const captionText = `*Adyant Nexa AI Brand Graphic*\n\nPrompt: "${promptText}"`;
      await sendTelegramPhoto(imagePath, captionText);
    } else {
      await sendTelegramMessage("Graphic generation finished, but image file was not found.");
    }
  } catch (err) {
    console.error("Image generation failed:", err.message);
    await sendTelegramMessage(`Image generation failed: ${err.message}`);
  }
}

async function handleNaturalLanguage(text) {
  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `You are Nova, the CMO AI Agent for Adyant Nexa. The user is the owner/admin.
You have access to the following backend commands:
- status: Check operational and CRM stats. (Trigger format: ACTION_TRIGGER:STATUS)
- list: List recent draft posts. (Trigger format: ACTION_TRIGGER:LIST)
- approve: Approve a draft by list index. (Trigger format: ACTION_TRIGGER:APPROVE <index>)
- publish: Publish all approved drafts to social platforms. (Trigger format: ACTION_TRIGGER:PUBLISH)
- generate: Trigger generation on a topic. (Trigger format: ACTION_TRIGGER:GENERATE <topic>)
- image: Generate standalone 4K brand graphic on prompt. (Trigger format: ACTION_TRIGGER:IMAGE <prompt>)
- preview: View visual preview of a draft by index. (Trigger format: ACTION_TRIGGER:PREVIEW <index>)
- reel: Generate AI voiceover and video reel for a draft by index. (Trigger format: ACTION_TRIGGER:REEL <index>)

If the user wants to execute one of these commands (e.g. 'status check karo', 'drafts list dikhao', 'approve post 2', 'image banao cyan network', 'publish templates', 'generate post on WhatsApp', 'show preview for post 3', 'make reel for post 1'), you MUST output the corresponding ACTION_TRIGGER: code on the very first line.
Otherwise, if they are just chatting, asking marketing questions, or planning strategy, respond in a helpful, professional CMO agent persona. Keep it short, direct, and focused. Do not use emojis in your response.`
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: text }] }]
    });
    
    const responseText = result.response.text().trim();
    console.log(`[TelegramBot] Gemini interpreted response:`, responseText);
    
    if (responseText.startsWith("ACTION_TRIGGER:")) {
      const parts = responseText.split("\n")[0].substring(15).trim().split(" ");
      const action = parts[0].toLowerCase();
      const args = parts.slice(1).join(" ");
      
      console.log(`[TelegramBot] Executing natural language action: ${action} with args: ${args}`);
      
      if (action === "status") {
        await handleStatus();
      } else if (action === "list") {
        await handleList();
      } else if (action === "preview") {
        await handlePreview(args);
      } else if (action === "reel") {
        await handleReel(args);
      } else if (action === "approve") {
        await handleApprove(args);
      } else if (action === "generate") {
        await handleGenerate(args);
      } else if (action === "image") {
        await handleImagePrompt(args);
      } else if (action === "publish") {
        await handlePublish();
      } else {
        await sendTelegramMessage(responseText);
      }
    } else {
      await sendTelegramMessage(responseText);
    }
  } catch (err) {
    console.error("Failed to process natural language:", err.message);
    await sendTelegramMessage(`Sorry, I encountered an error while processing your request: ${err.message}`);
  }
}

async function processUpdate(update) {
  const message = update.message;
  if (!message) return;

  const chat_id = String(message.chat.id);
  if (chat_id !== String(TELEGRAM_CHAT_ID)) {
    console.log(`Unauthorized message blocked from chat ID: ${chat_id}`);
    return;
  }

  // Check if there is a pending upload for this chat
  if (pendingUploads[chat_id] && message.text) {
    const text = message.text.trim();
    if (text.toLowerCase() === "/cancel") {
      try {
        const filePath = pendingUploads[chat_id].filePath;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete cancelled file:", err.message);
      }
      delete pendingUploads[chat_id];
      await sendTelegramMessage("Upload cancelled.");
      return;
    }

    // Treat text as caption
    const lowerCaption = text.toLowerCase();
    let platforms = [];
    if (lowerCaption.includes("#linkedin")) platforms.push("LinkedIn");
    if (lowerCaption.includes("#instagram")) platforms.push("Instagram");
    if (lowerCaption.includes("#facebook")) platforms.push("Facebook");
    
    if (platforms.length === 0) {
      platforms = ["LinkedIn", "Instagram", "Facebook"];
    }

    const cleanCaption = text
      .replace(/#linkedin/gi, "")
      .replace(/#instagram/gi, "")
      .replace(/#facebook/gi, "")
      .trim();

    const filePath = pendingUploads[chat_id].filePath;
    
    await sendTelegramMessage(`Caption received! Syncing to Lark CRM and publishing to [${platforms.join(", ")}]...`);
    
    try {
      await executePublishingFlow(filePath, cleanCaption, platforms);
    } catch (err) {
      await sendTelegramMessage(`Error publishing media: ${err.message}`);
    }

    delete pendingUploads[chat_id];
    return;
  }

  // Handle image/video/document uploads
  if (message.photo || message.video || message.document) {
    await handleMediaUpload(message, chat_id);
    return;
  }

  if (!message.text) return;

  const text = message.text.trim();
  const commandParts = text.split(" ");
  const command = commandParts[0].toLowerCase();
  const args = commandParts.slice(1).join(" ");

  console.log(`Processing command: ${command} with args: ${args}`);

  try {
    if (command === "/start" || command === "/help") {
      await handleStart();
    } else if (command === "/status") {
      await handleStatus();
    } else if (command === "/list") {
      await handleList();
    } else if (command === "/preview") {
      await handlePreview(args);
    } else if (command === "/reel") {
      await handleReel(args);
    } else if (command === "/approve") {
      await handleApprove(args);
    } else if (command === "/generate") {
      await handleGenerate(args);
    } else if (command === "/image" || command === "/graphic") {
      await handleImagePrompt(args);
    } else if (command === "/publish") {
      await handlePublish();
    } else if (command.startsWith("/")) {
      await sendTelegramMessage("Unknown command. Type /help to see all available commands.");
    } else {
      await handleNaturalLanguage(text);
    }
  } catch (err) {
    console.error(`Error processing command ${command}:`, err);
    await sendTelegramMessage(`System Error: ${err.message}`);
  }
}

async function pollUpdates() {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${lastOffset}&timeout=30`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.ok && data.result) {
      for (const update of data.result) {
        lastOffset = update.update_id + 1;
        await processUpdate(update);
      }
    }
  } catch (err) {
    console.error("Polling error:", err.message);
  }

  setTimeout(pollUpdates, 2000);
}

console.log("Telegram Agent Ops Bot started polling...");
sendTelegramMessage("Connected to Adyant Nexa Agent Ops Command Center. Bot online and listening.");
pollUpdates();
