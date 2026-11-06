const fs = require('fs');

async function checkTimestamps() {
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

  const res = await fetch(`https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=100`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  
  // Let's print the first 2 and the last 4
  console.log('Record 0 fields:', Object.keys(data.data.items[0]));
  console.log('Sample record 0 extra info:', data.data.items[0].record_id, data.data.items[0].fields['Topic']);
  console.log('Sample record 37 extra info:', data.data.items[37].record_id, data.data.items[37].fields['Topic']);
}

checkTimestamps();
