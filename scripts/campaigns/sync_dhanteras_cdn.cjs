const fs = require('fs');

async function uploadAndSync() {
  const filePath = 'c:\\Users\\mi\\AN\\outputs\\dhanteras\\dhanteras_white_theme_final.jpg';
  const fileBytes = fs.readFileSync(filePath);
  const blob = new Blob([fileBytes], { type: 'image/jpeg' });
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', blob, 'dhanteras_white_theme_final.jpg');

  console.log('Uploading to CDN...');
  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form });
  const cdnUrl = (await res.text()).trim();
  console.log('New CDN URL:', cdnUrl);

  // Update Lark record
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
  const RECORD_ID = 'reczz28W8j529tJe';

  const tokenRes = await fetch('https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const tokenData = await tokenRes.json();
  const token = tokenData.tenant_access_token;

  const updateRes = await fetch(`https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/${RECORD_ID}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fields: {
        'Visual Design Prompt': `Visual Asset CDN: ${cdnUrl}\nLocal Path: c:\\Users\\mi\\AN\\outputs\\dhanteras\\dhanteras_white_theme_final.jpg\nStatus: Rebuilt from scratch with 100% mathematical baseline alignment, matching Segoe UI typography, and official Brand Identity Kit lockup.`
      }
    })
  });
  const updateData = await updateRes.json();
  console.log('Lark updated result:', updateData.code === 0 ? 'SUCCESS' : updateData.msg);
}

uploadAndSync();
