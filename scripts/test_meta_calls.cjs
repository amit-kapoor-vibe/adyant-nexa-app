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

const testImageUrl = "https://tmpfiles.org/dl/wZAK5Ku2mmZe/adyant_nexa_diwali.png";
const testCaption = "May the festival of lights bring enduring clarity, peace, and abundance.\n\nTeam Adyant Nexa";

async function testIG() {
  console.log("--- TESTING INSTAGRAM CONTAINER CREATION ---");
  const containerUrl = `https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`;
  const res1 = await fetch(containerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: testImageUrl,
      caption: testCaption,
      access_token: META_ACCESS_TOKEN
    })
  });
  const d1 = await res1.json();
  console.log("IG Container Creation Result:", JSON.stringify(d1, null, 2));

  if (d1.id) {
    console.log("Container created! ID:", d1.id);
  }
}

async function testFB() {
  console.log("\n--- TESTING FACEBOOK PAGE PUBLISH ---");
  const pageRes = await fetch(`https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}?fields=access_token&access_token=${META_ACCESS_TOKEN}`);
  const pageData = await pageRes.json();
  const pageToken = pageData.access_token || META_PAGE_ACCESS_TOKEN || META_ACCESS_TOKEN;
  console.log("Using Page Token:", pageToken ? "Retrieved successfully" : "None");

  const url = `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/photos`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: testImageUrl,
      message: testCaption,
      access_token: pageToken
    })
  });
  const d = await res.json();
  console.log("FB Photo Result:", JSON.stringify(d, null, 2));
}

async function testLinkedInAyrshare() {
  console.log("\n--- TESTING AYRSHARE POST PAYLOAD ---");
  const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;
  // Let's inspect the body sent to Ayrshare in lark_auto_watcher.cjs
  // Body was: { post: caption, platforms: ["linkedin"], mediaUrls: [imageUrl] }
  console.log("Caption length:", testCaption.length);
  console.log("Image URL:", testImageUrl);
}

Promise.all([testIG(), testFB(), testLinkedInAyrshare()]).catch(e => console.error(e));
