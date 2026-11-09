const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
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
}
loadEnv();

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;

async function testFacebookDirectUpload() {
  const pageRes = await fetch(`https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}?fields=access_token&access_token=${META_ACCESS_TOKEN}`);
  const pageData = await pageRes.json();
  const pageToken = pageData.access_token || META_PAGE_ACCESS_TOKEN || META_ACCESS_TOKEN;

  const imgPath = path.resolve(__dirname, '../public/adyant_nexa_diwali.png');
  const buffer = fs.readFileSync(imgPath);

  const formData = new FormData();
  formData.append("source", new Blob([buffer], { type: "image/png" }), "diwali.png");
  formData.append("message", "Test Diwali Greeting");
  formData.append("access_token", pageToken);
  formData.append("published", "false"); // validation mode, don't broadcast

  console.log("Testing FB direct binary upload to /photos...");
  const res = await fetch(`https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/photos`, {
    method: "POST",
    body: formData
  });
  const data = await res.json();
  console.log("FB Direct Upload Result:", JSON.stringify(data, null, 2));
}

testFacebookDirectUpload().catch(e => console.error(e));
