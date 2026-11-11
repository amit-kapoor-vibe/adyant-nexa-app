/**
 * Create a New Test Record in Lark Base for Live Approval Verification
 */
const fs = require('fs');
const path = require('path');

// 1. Load environment variables
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

const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;

async function getTenantToken() {
  const res = await fetch("https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const data = await res.json();
  if (data.code === 0) return data.tenant_access_token;
  throw new Error(`Auth failed: ${data.msg}`);
}

async function createRecord() {
  console.log("Authenticating with Lark Base API...");
  const token = await getTenantToken();

  // Fetch existing records to grab exact Day 3 data
  console.log("Fetching Day 3 data from Lark...");
  const listUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=20`;
  const listRes = await fetch(listUrl, { headers: { "Authorization": `Bearer ${token}` } });
  const listData = await listRes.json();

  let day3Fields = null;
  if (listData.data?.items) {
    for (const item of listData.data.items) {
      const topic = JSON.stringify(item.fields?.Topic || "");
      if (topic.includes("Day 3")) {
        day3Fields = item.fields;
        break;
      }
    }
  }

  // Fallback defaults if not found
  const caption = day3Fields?.Caption || 
    "If your top real estate brokers are spending hours on manual data entry instead of closing high-value deals, your operational architecture is bleeding margins.\n\nAt Adyant Nexa, we deploy institutional-grade autonomous pipelines that handle CRM sync, lead nurturing, and client tracking seamlessly.\n\n#AdyantNexa #RealEstateTech #AutonomousOperations #PropTech #EnterpriseAutomation";
  
  const visualPrompt = day3Fields?.["Visual Design Prompt"] || 
    "Visual Asset CDN: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop";

  const platforms = day3Fields?.Platform || ["Instagram", "Facebook", "LinkedIn"];

  const newRecord = {
    fields: {
      "Topic": "Day 3 (Live Automation Test): Your Brokers Are Closers",
      "Platform": Array.isArray(platforms) ? platforms : ["Instagram", "Facebook", "LinkedIn"],
      "Caption": caption,
      "Visual Design Prompt": visualPrompt,
      "Status": "Draft"
    }
  };

  console.log("Creating new test record with Status: 'Draft'...");
  const createUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records`;
  const createRes = await fetch(createUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newRecord)
  });

  const createData = await createRes.json();
  if (createData.code === 0) {
    console.log("\n========================================================");
    console.log("SUCCESS: New test record created in Lark Base!");
    console.log(`Record ID: ${createData.data.record.record_id}`);
    console.log(`Topic: ${createData.data.record.fields.Topic}`);
    console.log(`Initial Status: ${createData.data.record.fields.Status}`);
    console.log("========================================================");
    console.log("\nInstructions for User:");
    console.log("1. Open Lark Base ('Social_Media_Queue' table).");
    console.log("2. Find the new row: 'Day 3 (Live Automation Test): Your Brokers Are Closers'.");
    console.log("3. Change its Status from 'Draft' to 'Approved'.");
    console.log("4. Lark automation will immediately trigger the webhook!");
  } else {
    console.error("Failed to create record:", createData.msg, createData);
  }
}

createRecord().catch(err => console.error("Error:", err.message));
