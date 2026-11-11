const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
let metaToken = "";
let pageId = "";
let igId = "";

const content = fs.readFileSync(envPath, 'utf8');
for (const line of content.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('META_ACCESS_TOKEN=')) metaToken = trimmed.split('=')[1].trim();
  if (trimmed.startsWith('FACEBOOK_PAGE_ID=')) pageId = trimmed.split('=')[1].trim();
  if (trimmed.startsWith('INSTAGRAM_BUSINESS_ACCOUNT_ID=')) igId = trimmed.split('=')[1].trim();
}

async function debugMeta() {
  console.log("Debugging Meta Token & Permissions...");
  console.log("Page ID:", pageId);
  console.log("IG Account ID:", igId);

  // 1. Check Token Debug Info
  const debugUrl = `https://graph.facebook.com/debug_token?input_token=${metaToken}&access_token=${metaToken}`;
  const debugRes = await fetch(debugUrl);
  const debugData = await debugRes.json();
  console.log("\nToken Debug Info:", JSON.stringify(debugData, null, 2));

  // 2. Check Facebook Page Access
  const pageUrl = `https://graph.facebook.com/v21.0/${pageId}?fields=name,access_token&access_token=${metaToken}`;
  const pageRes = await fetch(pageUrl);
  const pageData = await pageRes.json();
  console.log("\nPage Data:", JSON.stringify(pageData, null, 2));

  // 3. Check Instagram Business Account
  const igUrl = `https://graph.facebook.com/v21.0/${igId}?fields=username,name&access_token=${metaToken}`;
  const igRes = await fetch(igUrl);
  const igData = await igRes.json();
  console.log("\nInstagram Account Data:", JSON.stringify(igData, null, 2));
}

debugMeta();
