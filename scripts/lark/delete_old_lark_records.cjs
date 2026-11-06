const fs = require('fs');

async function deleteOldRecords() {
  const env = fs.readFileSync('C:/Users/mi/adyant-nexa-app/.env.local', 'utf8');
  const envVars = {};
  env.split('\n').forEach(line => {
    const [k, ...v] = line.trim().split('=');
    if (k && !k.startsWith('#')) envVars[k.trim()] = v.join('=').trim();
  });

  const LARK_APP_ID = envVars.LARK_APP_ID;
  const LARK_APP_SECRET = envVars.LARK_APP_SECRET;
  const LARK_BASE_ID = envVars.LARK_BASE_ID;
  const LARK_TABLE_ID = envVars.LARK_TABLE_ID;

  // The 4 records to KEEP (November 2026 campaign)
  const KEEP_IDS = new Set([
    'reczz28W7laESRM4', // Day 1
    'reczz28W7lc4GZbT', // Day 2
    'reczz28W7ldwVXhl', // Day 3
    'reczz28W8j529tJe'  // Festive Dhanteras
  ]);

  const authRes = await fetch('https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const auth = await authRes.json();
  const token = auth.tenant_access_token;

  let allRecords = [];
  let pageToken = '';
  do {
    const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=100${pageToken ? '&page_token=' + pageToken : ''}`;
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await res.json();
    if (data.data && data.data.items) {
      allRecords.push(...data.data.items);
      pageToken = data.data.page_token;
    } else {
      break;
    }
  } while (pageToken);

  const toDelete = allRecords.filter(r => !KEEP_IDS.has(r.record_id)).map(r => r.record_id);
  console.log(`Found ${toDelete.length} records to delete.`);
  console.log(`Keeping ${allRecords.length - toDelete.length} records.`);

  // Lark batch delete API accepts up to 50 records at a time
  for (let i = 0; i < toDelete.length; i += 50) {
    const chunk = toDelete.slice(i, i + 50);
    const delRes = await fetch(`https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/batch_delete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records: chunk })
    });
    const delData = await delRes.json();
    console.log(`Batch delete [${i} - ${i + chunk.length}]:`, delData.msg);
  }
}

deleteOldRecords();

