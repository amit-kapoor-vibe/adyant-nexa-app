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
const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;

const PHOTO_ID = "122148903657189840";

async function testFacebookToInstagram() {
  const pageRes = await fetch(`https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}?fields=access_token&access_token=${META_ACCESS_TOKEN}`);
  const pageData = await pageRes.json();
  const pageToken = pageData.access_token || META_PAGE_ACCESS_TOKEN || META_ACCESS_TOKEN;

  // 1. Get Facebook CDN image source
  console.log("Fetching direct Meta CDN URL from Facebook photo...");
  const pRes = await fetch(`https://graph.facebook.com/v21.0/${PHOTO_ID}?fields=images,source&access_token=${pageToken}`);
  const pData = await pRes.json();
  console.log("Photo source:", pData.source);

  if (!pData.source) {
    console.error("No source found");
    return;
  }

  // 2. Feed this Meta CDN URL to Instagram Container!
  console.log("Feeding Meta CDN URL to Instagram /media container...");
  const cRes = await fetch(`https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: pData.source,
      caption: "May the festival of lights bring enduring clarity, peace, and abundance to your homes and ventures.\n\nTeam Adyant Nexa",
      access_token: META_ACCESS_TOKEN
    })
  });
  const cData = await cRes.json();
  console.log("\n>>> INSTAGRAM CONTAINER RESULT:", JSON.stringify(cData, null, 2));
}

testFacebookToInstagram().catch(e => console.error(e));
