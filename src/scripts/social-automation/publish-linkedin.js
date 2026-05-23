/**
 * Adyant Nexa - Social Media Automation: LinkedIn Publisher
 * 
 * Securely publishes professional text updates and image shares to LinkedIn:
 * - Direct UGC Share API integration (supports urn:li:person and urn:li:organization)
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
function loadEnv() {
  const envPath = path.resolve(__dirname, '../../../.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const LINKEDIN_URN = process.env.LINKEDIN_URN; // e.g. "urn:li:person:12345" or "urn:li:organization:67890"

/**
 * Publishes a text share to LinkedIn
 * @param {string} text The copy/caption of the post
 * @param {string} imageUrl Optional publicly accessible image to attach
 */
async function publishToLinkedIn(text, imageUrl = "") {
  if (!LINKEDIN_ACCESS_TOKEN || !LINKEDIN_URN) {
    console.warn("⚠️ LinkedIn credentials not fully configured in .env.local. Skipping live post.");
    return "https://linkedin.com/in/amitkapoor (Mock)";
  }

  console.log(`💼 Publishing post to LinkedIn for author: ${LINKEDIN_URN}...`);

  const url = "https://api.linkedin.com/v2/ugcPosts";
  
  // Basic UGC Share Payload
  const payload = {
    author: LINKEDIN_URN,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: text
        },
        shareMediaCategory: imageUrl ? "IMAGE" : "NONE"
      }
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
    }
  };

  // If there's an image, attach media metadata
  if (imageUrl) {
    payload.specificContent["com.linkedin.ugc.ShareContent"].media = [
      {
        status: "READY",
        description: {
          text: "Adyant Nexa - AI Automation"
        },
        originalUrl: imageUrl,
        title: {
          text: "Adyant Nexa"
        }
      }
    ];
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok || data.message) {
      throw new Error(`LinkedIn Post Error: ${data.message || response.statusText}`);
    }

    // URN format: urn:li:share:123456789
    const shareUrn = data.id;
    const postId = shareUrn.split(":").pop();
    const postLink = `https://www.linkedin.com/feed/update/${shareUrn}`;
    
    console.log(`🎉 LinkedIn Post published live! URN: ${shareUrn}`);
    return postLink;
  } catch (error) {
    console.error("❌ LinkedIn Publication Failed:", error);
    throw error;
  }
}

module.exports = {
  publishToLinkedIn
};
