/**
 * Adyant Nexa - Social Media Automation: Meta Graph Publisher
 * 
 * Securely publishes visual content and captions to Meta platforms:
 * - Facebook Page posting (using Page Photos API)
 * - Instagram Business Profile posting (using Media Container API)
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

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;

/**
 * Publishes an image and caption to Instagram Business Profile
 * @param {string} imageUrl A publicly accessible image URL
 * @param {string} caption The post caption
 */
async function publishToInstagram(imageUrl, caption) {
  if (!META_ACCESS_TOKEN || !INSTAGRAM_BUSINESS_ACCOUNT_ID) {
    console.warn("⚠️ Meta credentials not fully configured for Instagram in .env.local. Skipping live post.");
    return "https://instagram.com/adyantnexa (Mock)";
  }

  console.log(`📸 Initiating Instagram upload container for: "${imageUrl.substring(0, 40)}..."`);
  
  // Step 1: Create the media container
  const containerUrl = `https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`;
  const containerPayload = {
    image_url: imageUrl,
    caption: caption,
    access_token: META_ACCESS_TOKEN
  };

  try {
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
    console.log(`✅ Media container created successfully. Container ID: ${creationId}`);

    // Step 2: Publish the media container
    console.log("🚀 Publishing container to live Instagram feed...");
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

    const postId = publishData.id;
    const postLink = `https://www.instagram.com/p/${postId}`;
    console.log(`🎉 Instagram Post published live! Post Link: ${postLink}`);
    return postLink;
  } catch (error) {
    console.error("❌ Instagram Publication Failed:", error);
    throw error;
  }
}

/**
 * Fetches the Page Access Token for Facebook Page posting
 */
async function getPageAccessToken() {
  const url = `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}?fields=access_token&access_token=${META_ACCESS_TOKEN}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.error) {
    throw new Error(`Failed to fetch Page Access Token: ${data.error.message}`);
  }
  return data.access_token;
}

/**
 * Publishes a photo and description to Facebook Page
 * @param {string} imageUrl A publicly accessible image URL
 * @param {string} description The post caption/copy
 */
async function publishToFacebook(imageUrl, description) {
  if (!META_ACCESS_TOKEN || !FACEBOOK_PAGE_ID) {
    console.warn("⚠️ Meta credentials not fully configured for Facebook in .env.local. Skipping live post.");
    return "https://facebook.com/adyantnexa (Mock)";
  }

  try {
    console.log("👤 Fetching Facebook Page Access Token...");
    const pageAccessToken = await getPageAccessToken();

    console.log("👤 Posting photo to Facebook Page...");
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
    const postLink = `https://www.facebook.com/${FACEBOOK_PAGE_ID}/posts/${postId}`;
    console.log(`🎉 Facebook Post published live! Post Link: ${postLink}`);
    return postLink;
  } catch (error) {
    console.error("❌ Facebook Publication Failed:", error);
    throw error;
  }
}

module.exports = {
  publishToInstagram,
  publishToFacebook
};
