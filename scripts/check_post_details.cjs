const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
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
}
loadEnv();

const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;
const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;

async function checkDetails() {
  // 1. Check Lark record fields
  const tokenRes = await fetch("https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const tokenData = await tokenRes.json();
  const token = tokenData.tenant_access_token;

  const recUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/reczz28X48BSphTD`;
  const res = await fetch(recUrl, { headers: { "Authorization": `Bearer ${token}` } });
  const d = await res.json();
  const f = d.data?.record?.fields || {};
  console.log("Lark Record Platform Field:", JSON.stringify(f.Platform));
  console.log("Lark Record Caption Field Raw:", JSON.stringify(f.Caption));
  console.log("Lark Record Image URL:", JSON.stringify(f["Visual Design Prompt"]));

  // 2. Check Ayrshare post by ID
  console.log("\nChecking Ayrshare Post History details...");
  const histRes = await fetch("https://app.ayrshare.com/api/history", {
    headers: { "Authorization": `Bearer ${AYRSHARE_API_KEY}` }
  });
  const histData = await histRes.json();
  console.log("Ayrshare History Count:", histData.length || 0);
  if (Array.isArray(histData) && histData[0]) {
    console.log("Most Recent Ayrshare Post:", JSON.stringify(histData[0], null, 2));
  }
}

checkDetails().catch(e => console.error(e));
