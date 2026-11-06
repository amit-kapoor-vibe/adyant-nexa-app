const fs = require('fs');

async function listQueueRecords() {
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
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.data && data.data.items) {
      allRecords.push(...data.data.items);
      pageToken = data.data.page_token;
    } else {
      break;
    }
  } while (pageToken);

  console.log(`Total records in Social_Media_Queue: ${allRecords.length}`);
  allRecords.forEach((rec, idx) => {
    const topic = rec.fields['Topic'] || 'Untitled';
    const status = rec.fields['Status'] || 'No Status';
    const scheduled = rec.fields['Scheduled Date'] || rec.fields['Date'] || 'No Date';
    console.log(`[${idx + 1}] ID: ${rec.record_id} | Status: ${status} | Date: ${JSON.stringify(scheduled)} | Topic: ${topic.substring(0, 50)}`);
  });
}

listQueueRecords();
