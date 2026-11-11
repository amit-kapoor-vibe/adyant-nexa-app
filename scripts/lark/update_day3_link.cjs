/**
 * Sync Live Published Post Links back to Day 3 row in Lark Base
 */
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../../.env.local');
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, 'utf8');
  raw.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;

const LIVE_LINKS = "Instagram: https://www.instagram.com/p/17971259391194429 | Facebook: https://www.facebook.com/988923307629678/posts/988923307629678_122149087851189840 | LinkedIn: https://www.linkedin.com/company/adyantnexa/";

async function syncDay3Links() {
  console.log("Authenticating with Lark...");
  const authRes = await fetch("https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const authData = await authRes.json();
  if (authData.code !== 0) {
    console.error("Lark Auth Failed:", authData.msg);
    return;
  }
  const token = authData.tenant_access_token;

  console.log("Finding Day 3 record in Lark Base...");
  const listUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=20`;
  const listRes = await fetch(listUrl, { headers: { "Authorization": `Bearer ${token}` } });
  const listData = await listRes.json();

  let targetRecordId = null;
  if (listData.data?.items) {
    for (const item of listData.data.items) {
      const topic = JSON.stringify(item.fields?.Topic || "");
      if (topic.includes("Day 3")) {
        targetRecordId = item.record_id;
        break;
      }
    }
  }

  if (!targetRecordId) {
    console.error("Could not find Day 3 record in Lark table.");
    return;
  }

  console.log(`Updating record ${targetRecordId} to Status: 'Published' with live links...`);
  const updateUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/${targetRecordId}`;
  const updateRes = await fetch(updateUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fields: {
        "Status": "Published",
        "Post Link": LIVE_LINKS
      }
    })
  });

  const updateData = await updateRes.json();
  if (updateData.code === 0) {
    console.log("\nSUCCESS: Day 3 record in Lark Base has been updated to Status: 'Published' and Post Link is populated!");
  } else {
    console.error("Failed to update Lark record:", updateData.msg, updateData);
  }
}

syncDay3Links();
