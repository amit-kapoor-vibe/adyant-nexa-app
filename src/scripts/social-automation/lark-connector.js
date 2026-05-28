/**
 * Adyant Nexa - Social Media Automation: Lark Base Connector
 * 
 * Manages secure integrations with Lark Base API:
 * - Obtains Tenant Access Token
 * - Syncs generated posts to Lark Base CRM
 * - Fetches approved posts for publication
 * - Updates posting statuses dynamically
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

const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;

if (!LARK_APP_ID || !LARK_APP_SECRET || !LARK_BASE_ID || !LARK_TABLE_ID) {
  console.error("❌ Error: Missing Lark Configuration in .env.local");
  process.exit(1);
}

/**
 * Gets the Lark tenant_access_token (cached or fresh)
 */
async function getTenantAccessToken() {
  const url = "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal";
  
  try {
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
    } else {
      throw new Error(`Lark Token Auth Failed: ${data.msg}`);
    }
  } catch (error) {
    console.error("❌ Lark Authentication Error:", error);
    throw error;
  }
}

/**
 * Syncs an array of generated posts into Lark Base
 */
async function syncPostsToLark(posts) {
  console.log(`📤 Syncing ${posts.length} generated drafts to Lark Base CRM...`);
  const token = await getTenantAccessToken();
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records`;

  for (const post of posts) {
    let visualPromptStr = "";
    if (typeof post.visualPrompt === 'object' && post.visualPrompt !== null) {
      const vp = post.visualPrompt;
      const elementsStr = Array.isArray(vp.elements) 
        ? vp.elements.map(e => `- ${e}`).join('\n') 
        : JSON.stringify(vp.elements);
      visualPromptStr = `Style: ${vp.designstyle || vp.designStyle || ""}\nBG Color: ${vp.backgroundColor || ""}\nElements:\n${elementsStr}`;
    } else {
      visualPromptStr = String(post.visualPrompt || "");
    }

    const recordPayload = {
      fields: {
        "Topic": post.topic,
        "Platform": post.platforms, // Multi-select array
        "Caption": post.caption,
        "Visual Design Prompt": visualPromptStr,
        "Status": "Draft"
      }
    };

    try {
      console.log(`📤 Sending payload for "${post.topic}":`, JSON.stringify(recordPayload, null, 2));
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
        console.log(`✅ Draft synced: "${post.topic}"`);
      } else {
        console.error(`❌ Sync Failed for "${post.topic}":`, resData.msg);
        console.error(`👉 Detailed error details:`, JSON.stringify(resData.error || resData, null, 2));
      }
    } catch (err) {
      console.error(`❌ Network error syncing "${post.topic}":`, err);
    }
  }
}

/**
 * Fetches all posts from Lark Base with "Approved" status
 */
async function fetchApprovedPosts() {
  console.log("📥 Fetching approved posts from Lark Base...");
  const token = await getTenantAccessToken();
  
  // Use filter syntax for Bitable: Status = "Approved"
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (data.code === 0 && data.data && data.data.items) {
      const approvedItems = data.data.items.filter(item => item.fields && item.fields.Status === "Approved");
      console.log(`✅ Found ${approvedItems.length} approved posts ready for publishing.`);
      return approvedItems;
    } else {
      console.log("ℹ️ No approved posts found in social queue.");
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching approved posts from Lark:", error);
    throw error;
  }
}

/**
 * Updates the status of a specific Lark Base record
 */
async function updatePostStatus(recordId, newStatus, postLink = "") {
  const token = await getTenantAccessToken();
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/${recordId}`;

  const fields = { "Status": newStatus };
  if (postLink) {
    fields["Post Link"] = postLink;
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fields })
    });
    
    const resData = await response.json();
    if (resData.code === 0) {
      console.log(`✅ Status updated to "${newStatus}" for record: ${recordId}`);
    } else {
      console.error(`❌ Failed to update status for ${recordId}:`, resData.msg);
    }
  } catch (error) {
    console.error(`❌ Error updating Lark status for ${recordId}:`, error);
  }
}

module.exports = {
  syncPostsToLark,
  fetchApprovedPosts,
  updatePostStatus
};
