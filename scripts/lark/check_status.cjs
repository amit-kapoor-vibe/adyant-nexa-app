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

async function checkLarkAndWebhook() {
  console.log("=== ADYANT NEXA LIVE PUBLISHING AUDIT ===");

  // 1. Check Lark Records
  const authRes = await fetch("https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const authData = await authRes.json();
  if (authData.code !== 0) {
    console.error("Lark Auth Error:", authData.msg);
    return;
  }
  const token = authData.tenant_access_token;

  console.log("1. Fetching latest records from Lark Base...");
  const recordsUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=10`;
  const recordsRes = await fetch(recordsUrl, { headers: { "Authorization": `Bearer ${token}` } });
  const recordsData = await recordsRes.json();

  if (recordsData.code === 0 && recordsData.data?.items) {
    console.log(`Found ${recordsData.data.items.length} records in Lark:`);
    recordsData.data.items.forEach((item, i) => {
      const f = item.fields;
      console.log(`[#${i+1}] Topic: "${JSON.stringify(f.Topic)}" | Status: "${JSON.stringify(f.Status)}" | Post Link: "${JSON.stringify(f["Post Link"] || "None")}"`);
    });
  } else {
    console.log("Could not fetch records:", recordsData.msg);
  }

  // 2. Test live Vercel webhook with Day 3 payload
  console.log("\n2. Pinging live Vercel webhook (https://adyantnexa.com/api/lark/webhook)...");
  const testPayload = {
    topic: "Day 3: Your Brokers Are Closers",
    caption: "If your top real estate brokers are spending hours on manual data entry instead of closing high-value deals, your operational architecture is bleeding margins.\n\nAt Adyant Nexa, we deploy institutional-grade autonomous pipelines.\n\n#AdyantNexa #RealEstateTech #AutonomousOperations",
    platform: "Instagram, Facebook, LinkedIn",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
  };

  try {
    const hookRes = await fetch("https://adyantnexa.com/api/lark/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload)
    });

    const status = hookRes.status;
    const body = await hookRes.json();
    console.log(`Webhook HTTP Status: ${status}`);
    console.log("Webhook Full Response:", JSON.stringify(body, null, 2));
  } catch (hookErr) {
    console.error("Webhook Call Error:", hookErr.message);
  }
}

checkLarkAndWebhook();
