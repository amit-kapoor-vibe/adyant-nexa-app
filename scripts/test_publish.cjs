const fs = require('fs');
const path = require('path');

function loadEnv() {
  // Try both single and double parent directory
  const paths = [
    path.resolve(__dirname, '../.env.local'),
    path.resolve(__dirname, '../../.env.local')
  ];
  for (const envPath of paths) {
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
      console.log("Loaded .env.local from:", envPath);
      break;
    }
  }
}
loadEnv();

const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;

const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;

async function getLarkTenantToken() {
  const url = "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const data = await res.json();
  return data.tenant_access_token;
}

async function runDiagnostics() {
  console.log("=== 1. CHECKING LARK RECORD reczz28X48BSphTD ===");
  try {
    const token = await getLarkTenantToken();
    const recUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/reczz28X48BSphTD`;
    const res = await fetch(recUrl, { headers: { "Authorization": `Bearer ${token}` } });
    const d = await res.json();
    const fields = d.data?.record?.fields || {};
    console.log("Status in Lark:", fields.Status);
    console.log("Post Link in Lark:", fields["Post Link"]);
    console.log("Topic in Lark:", fields.Topic);
    console.log("Caption in Lark:", fields.Caption ? fields.Caption.slice(0, 100) + '...' : 'EMPTY');
    console.log("Visual Design Prompt (Image URL):", fields["Visual Design Prompt"]);
  } catch (e) {
    console.error("Lark check failed:", e.message);
  }

  console.log("\n=== 2. TESTING META ACCESS TOKEN & PERMISSIONS ===");
  try {
    const debugUrl = `https://graph.facebook.com/v21.0/me?access_token=${META_ACCESS_TOKEN}`;
    const mRes = await fetch(debugUrl);
    const mData = await mRes.json();
    console.log("Meta /me response:", JSON.stringify(mData));
  } catch (e) {
    console.error("Meta Token test failed:", e.message);
  }

  console.log("\n=== 3. TESTING INSTAGRAM API DIRECTLY ===");
  try {
    const igUrl = `https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}?fields=id,username,name&access_token=${META_ACCESS_TOKEN}`;
    const igRes = await fetch(igUrl);
    const igData = await igRes.json();
    console.log("Instagram Account:", JSON.stringify(igData));
  } catch (e) {
    console.error("Instagram test failed:", e.message);
  }

  console.log("\n=== 4. TESTING FACEBOOK PAGE DIRECTLY ===");
  try {
    const fbUrl = `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}?fields=id,name,access_token&access_token=${META_ACCESS_TOKEN}`;
    const fbRes = await fetch(fbUrl);
    const fbData = await fbRes.json();
    console.log("Facebook Page Info:", JSON.stringify(fbData));
  } catch (e) {
    console.error("Facebook direct test failed:", e.message);
  }

  console.log("\n=== 5. TESTING AYRSHARE LINKEDIN ACCOUNT & RECENT POSTS ===");
  try {
    const ayrCheck = await fetch("https://app.ayrshare.com/api/user", {
      headers: { "Authorization": `Bearer ${AYRSHARE_API_KEY}` }
    });
    const ayrData = await ayrCheck.json();
    console.log("Ayrshare Active Platforms:", ayrData.activeSocialAccounts);

    const histRes = await fetch("https://app.ayrshare.com/api/history?lastRecords=2", {
      headers: { "Authorization": `Bearer ${AYRSHARE_API_KEY}` }
    });
    const histData = await histRes.json();
    console.log("Recent Ayrshare Post History:");
    (Array.isArray(histData) ? histData : []).forEach((p, idx) => {
      console.log(`[Post ${idx + 1}] ID: ${p.id}, Platforms: ${p.platforms}, Post Text: "${p.post ? p.post.slice(0, 60) + '...' : 'EMPTY'}", Media: ${p.mediaUrls}`);
    });
  } catch (e) {
    console.error("Ayrshare check failed:", e.message);
  }
}

runDiagnostics();
