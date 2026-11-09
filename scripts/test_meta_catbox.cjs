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

const validImageUrl = "https://files.catbox.moe/osphti.png";
const testCaption = `May the festival of lights bring enduring clarity, peace, and abundance to your homes and ventures.

Diwali is a timeless reminder that every meaningful journey begins with light: the light of wisdom, clear vision, and purposeful effort.

In business and in life, the things that truly endure are built quietly—with patience, shared values, and trust.

To our clients, partners, collaborators, and friends across India, Dubai, and around the world: we wish you and your families a joyous, prosperous, and peaceful Diwali.

Wishing you and your loved ones a very Happy Diwali.

Team Adyant Nexa
Dubai // India Core

#Diwali #AdyantNexa #FestivalOfLights #Dubai #India #Leadership #Foundations`;

async function testIG() {
  console.log("--- 1. TESTING INSTAGRAM WITH CATBOX PNG ---");
  const containerUrl = `https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`;
  const res1 = await fetch(containerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: validImageUrl,
      caption: testCaption,
      access_token: META_ACCESS_TOKEN
    })
  });
  const d1 = await res1.json();
  console.log("IG Container Result:", JSON.stringify(d1, null, 2));
  return d1.id;
}

async function testFB() {
  console.log("\n--- 2. TESTING FACEBOOK PAGE TOKEN & PHOTO ---");
  const pageRes = await fetch(`https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}?fields=access_token&access_token=${META_ACCESS_TOKEN}`);
  const pageData = await pageRes.json();
  const pageToken = pageData.access_token || META_PAGE_ACCESS_TOKEN || META_ACCESS_TOKEN;

  // Validate photo payload on Facebook
  const pUrl = `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/photos`;
  const pRes = await fetch(pUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: validImageUrl,
      message: testCaption,
      published: false, // validate without broadcasting live
      access_token: pageToken
    })
  });
  const d2 = await pRes.json();
  console.log("FB Validation Result:", JSON.stringify(d2, null, 2));
}

async function main() {
  const containerId = await testIG();
  await testFB();
  console.log("\nDiagnostic complete.");
}

main().catch(e => console.error(e));
