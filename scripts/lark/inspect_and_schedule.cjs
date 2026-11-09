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

if (!LARK_APP_ID || !LARK_APP_SECRET || !LARK_BASE_ID || !LARK_TABLE_ID) {
  console.error("Missing Lark configuration in .env.local");
  process.exit(1);
}

async function getLarkTenantToken() {
  const url = "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const data = await res.json();
  if (data.code === 0) return data.tenant_access_token;
  throw new Error(`Lark Token Auth Failed: ${data.msg}`);
}

async function uploadToCatbox(filePath) {
  try {
    console.log("Uploading public/adyant_nexa_diwali.png to Catbox CDN...");
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: "image/png" });
    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", blob, "adyant_nexa_diwali.png");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      const url = await res.text();
      if (url.startsWith("http")) {
        console.log("Public Image CDN URL:", url.trim());
        return url.trim();
      }
    }
  } catch (err) {
    console.warn("Catbox upload warning:", err.message);
  }
  return "";
}

async function run() {
  try {
    const token = await getLarkTenantToken();
    console.log("Lark Authentication Successful.");

    // 1. Fetch exact Table Schema
    const fieldsUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/fields`;
    const fieldsRes = await fetch(fieldsUrl, { headers: { "Authorization": `Bearer ${token}` } });
    const fieldsData = await fieldsRes.json();

    if (fieldsData.code !== 0) {
      console.error("Failed to read Lark fields:", fieldsData.msg);
      return;
    }

    const fields = fieldsData.data?.items || [];
    console.log("\n--- Lark Base Schema Analysis ---");
    console.log(`Base ID: ${LARK_BASE_ID}`);
    console.log(`Table ID: ${LARK_TABLE_ID}`);
    console.log("Existing Columns in your CRM Table:");
    fields.forEach(f => {
      console.log(`- ${f.field_name} (Type: ${f.type}, UI Type: ${f.ui_type || 'standard'})`);
    });

    // 2. Fetch existing records to check schema patterns
    const recordsUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=5`;
    const recRes = await fetch(recordsUrl, { headers: { "Authorization": `Bearer ${token}` } });
    const recData = await recRes.json();
    console.log(`\nCurrent Records in CRM: ${recData.data?.total || 0}`);

    // 3. Prepare Brand Copy & Asset
    const imagePath = path.resolve(__dirname, '../../public/adyant_nexa_diwali.png');
    const publicImageUrl = await uploadToCatbox(imagePath);

    const caption = `May the festival of lights bring enduring clarity, peace, and abundance to your homes and ventures.

Diwali is a timeless reminder that every meaningful journey begins with light: the light of wisdom, clear vision, and purposeful effort.

In business and in life, the things that truly endure are built quietly—with patience, shared values, and trust.

To our clients, partners, collaborators, and friends across India, Dubai, and around the world: we wish you and your families a joyous, prosperous, and peaceful Diwali.

Wishing you and your loved ones a very Happy Diwali.

Team Adyant Nexa
Dubai // India Core

#Diwali #AdyantNexa #FestivalOfLights #Dubai #India #Leadership #Foundations`;

    // 4. Adapt payload strictly to existing fields
    const newFields = {};
    const fieldMap = new Map(fields.map(f => [f.field_name.toLowerCase(), f]));

    // Helper to safely assign
    const assignIfFieldExists = (name, value) => {
      const match = fieldMap.get(name.toLowerCase());
      if (match) {
        // If single select (type 3), string is required. If multi-select (type 4), array is required.
        if (match.type === 4 && typeof value === 'string') {
          newFields[match.field_name] = [value];
        } else if (match.type === 3 && Array.isArray(value)) {
          newFields[match.field_name] = value[0];
        } else {
          newFields[match.field_name] = value;
        }
      }
    };

    assignIfFieldExists("Topic", "Diwali 2026 - Warm Brand Greeting");
    assignIfFieldExists("Caption", caption);
    assignIfFieldExists("Platform", ["LinkedIn", "Instagram", "Facebook"]);
    
    // Status: default to "Scheduled" so you see it in Lark and can review/trigger from there
    const statusArg = process.argv[2] || "Scheduled";
    assignIfFieldExists("Status", statusArg);

    if (fieldMap.has("visual design prompt")) {
      newFields[fieldMap.get("visual design prompt").field_name] = publicImageUrl;
    } else if (fieldMap.has("image url")) {
      newFields[fieldMap.get("image url").field_name] = publicImageUrl;
    } else if (fieldMap.has("image")) {
      newFields[fieldMap.get("image").field_name] = publicImageUrl;
    }

    console.log("\nSubmitting Payload to Lark Base:", JSON.stringify(newFields, null, 2));

    const createUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records`;
    const createRes = await fetch(createUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fields: newFields })
    });

    const createResult = await createRes.json();
    if (createResult.code === 0) {
      console.log("\n=======================================================");
      console.log("SUCCESSFULLY INSERTED INTO LARK CRM!");
      console.log("Record ID:", createResult.data?.record?.record_id);
      console.log("Status:", newFields["Status"] || statusArg);
      console.log("Direct Table Link: https://open.larksuite.com/base/" + LARK_BASE_ID);
      console.log("=======================================================\n");
    } else {
      console.error("\nLark Insert Rejected with code:", createResult.code);
      console.error("Reason:", createResult.msg);
    }

  } catch (err) {
    console.error("Execution error:", err.message);
  }
}

run();
