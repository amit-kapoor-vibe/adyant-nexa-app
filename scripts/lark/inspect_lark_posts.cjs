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
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
}
loadEnv();

const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;

async function fetchAllLarkPosts() {
  if (!LARK_APP_ID || !LARK_APP_SECRET || !LARK_BASE_ID || !LARK_TABLE_ID) {
    console.error("Missing Lark credentials in .env.local");
    process.exit(1);
  }

  // 1. Get Tenant Token
  const authRes = await fetch("https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const authData = await authRes.json();
  if (authData.code !== 0) {
    console.error("Auth failed:", authData.msg);
    process.exit(1);
  }
  const token = authData.tenant_access_token;

  // 2. Fetch Records
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=100`;
  const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
  const data = await res.json();

  if (data.code === 0 && data.data?.items) {
    const records = data.data.items.map((it, idx) => {
      const f = it.fields || {};
      return {
        index: idx + 1,
        recordId: it.record_id,
        topic: f.Topic || f["Topic / Title"] || f.Title || "No Topic",
        status: f.Status || "No Status",
        platform: f.Platform || "Not Specified",
        postLink: f["Post Link"] || "None",
        captionPreview: (f.Caption || "").slice(0, 100).replace(/\n/g, ' ')
      };
    });

    console.log(JSON.stringify(records, null, 2));
  } else {
    console.error("Failed to fetch records:", data.msg);
  }
}

fetchAllLarkPosts();
