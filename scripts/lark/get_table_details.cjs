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

async function getLarkTenantToken() {
  const url = "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const data = await res.json();
  if (data.code === 0) return data.tenant_access_token;
  throw new Error(`Auth Failed: ${data.msg}`);
}

async function inspect() {
  const token = await getLarkTenantToken();

  // 1. Fetch Fields and Options
  const fieldsUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/fields`;
  const fRes = await fetch(fieldsUrl, { headers: { "Authorization": `Bearer ${token}` } });
  const fData = await fRes.json();

  console.log("\n================ LARK CRM SCHEMA ================");
  (fData.data?.items || []).forEach(f => {
    let extra = "";
    if (f.property?.options) {
      extra = " | Options: [" + f.property.options.map(o => `"${o.name}"`).join(", ") + "]";
    }
    console.log(`Field: "${f.field_name}" (Type ${f.type})${extra}`);
  });

  // 2. Fetch Records
  const recUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=50`;
  const rRes = await fetch(recUrl, { headers: { "Authorization": `Bearer ${token}` } });
  const rData = await rRes.json();

  console.log(`\n================ EXISTING RECORDS (${rData.data?.total || 0}) ================`);
  (rData.data?.items || []).forEach((item, idx) => {
    console.log(`\n[Record ${idx + 1}] ID: ${item.record_id}`);
    Object.entries(item.fields || {}).forEach(([k, v]) => {
      const displayVal = typeof v === 'string' && v.length > 80 ? v.slice(0, 80) + '...' : JSON.stringify(v);
      console.log(`  ${k}: ${displayVal}`);
    });
  });
  console.log("\n=================================================\n");
}

inspect().catch(e => console.error("Error:", e.message));
