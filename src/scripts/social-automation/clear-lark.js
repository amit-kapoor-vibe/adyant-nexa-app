/**
 * Adyant Nexa - Social Media Automation: Purge Lark Base Records
 * 
 * Fetches all existing records from the configured Lark Base table and deletes them.
 * Used for reset/fresh starts during testing or content pipeline revisions.
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
function loadEnv() {
  const envPath = path.resolve(__dirname, '../../../.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        process.env[key] = value;
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
  console.error("❌ Error: Missing Lark Configuration in .env.local");
  process.exit(1);
}

/**
 * Gets the Lark tenant_access_token
 */
async function getTenantAccessToken() {
  const url = "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_id: LARK_APP_ID,
      app_secret: LARK_APP_SECRET
    })
  });
  const data = await response.json();
  if (data.code === 0) {
    return data.tenant_access_token;
  } else {
    throw new Error(`Lark Token Auth Failed: ${data.msg}`);
  }
}

async function purgeLarkBase() {
  console.log("🧹 Initializing Lark Base cleanup sequence...");
  try {
    const token = await getTenantAccessToken();
    const fetchUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=500`;

    // 1. Fetch all records
    console.log("📥 Fetching existing records...");
    const fetchResponse = await fetch(fetchUrl, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    const fetchResult = await fetchResponse.json();
    if (fetchResult.code !== 0) {
      throw new Error(`Failed to fetch records: ${fetchResult.msg}`);
    }

    const items = fetchResult.data?.items || [];
    if (items.length === 0) {
      console.log("✅ Lark Base is already empty. No records to delete!");
      return;
    }

    console.log(`ℹ️ Found ${items.length} records in Lark Base CRM.`);

    // 2. Extract record IDs
    const recordIds = items.map(item => item.record_id);

    // 3. Batch delete (Lark supports up to 500 per batch delete call)
    console.log(`📤 Sending batch delete request for ${recordIds.length} records...`);
    const deleteUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/batch_delete`;
    
    const deleteResponse = await fetch(deleteUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        records: recordIds
      })
    });

    const deleteResult = await deleteResponse.json();
    if (deleteResult.code === 0) {
      console.log(`\n🎉 Success! Successfully purged ${recordIds.length} records from Lark Base.`);
      console.log("👉 Your CRM is now completely clean and ready for a fresh start!");
    } else {
      console.error("❌ Batch delete failed:", deleteResult.msg);
      console.error("👉 Detailed response:", JSON.stringify(deleteResult, null, 2));
    }
  } catch (error) {
    console.error("❌ Purge Process Encountered an Error:", error);
  }
}

purgeLarkBase();
