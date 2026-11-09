const fs = require('fs');
const path = require('path');

function loadEnv() {
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
}
loadEnv();

const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;
const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;

async function check() {
  // Check Lark Record
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
  console.log("Full Lark Record Response:", JSON.stringify(d, null, 2));

  // Check Ayrshare User Profile
  console.log("\nChecking Ayrshare User Profile...");
  const ayrRes = await fetch("https://app.ayrshare.com/api/user", {
    headers: { "Authorization": `Bearer ${AYRSHARE_API_KEY}` }
  });
  const ayrData = await ayrRes.json();
  console.log("Full Ayrshare Response:", JSON.stringify(ayrData, null, 2));

  // Check Ayrshare History to see what was posted to LinkedIn
  console.log("\nChecking Ayrshare Post History...");
  const histRes = await fetch("https://app.ayrshare.com/api/history?lastRecords=3", {
    headers: { "Authorization": `Bearer ${AYRSHARE_API_KEY}` }
  });
  const histData = await histRes.json();
  console.log("Recent Ayrshare Posts:", JSON.stringify(histData, null, 2));
}

check().catch(e => console.error(e));
