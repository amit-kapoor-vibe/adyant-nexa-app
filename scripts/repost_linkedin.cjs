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

const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;
const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;
const RECORD_ID = "reczz28X48BSphTD";

const caption = `May the festival of lights bring enduring clarity, peace, and abundance to your homes and ventures.

Diwali is a timeless reminder that every meaningful journey begins with light: the light of wisdom, clear vision, and purposeful effort.

In business and in life, the things that truly endure are built quietly—with patience, shared values, and trust.

To our clients, partners, collaborators, and friends across India, Dubai, and around the world: we wish you and your families a joyous, prosperous, and peaceful Diwali.

Wishing you and your loved ones a very Happy Diwali.

Team Adyant Nexa
Dubai // India Core

#Diwali #AdyantNexa #FestivalOfLights #Dubai #India #Leadership #Foundations`;

// The Meta CDN URL from our live Facebook post (100% accessible everywhere)
const metaCdnUrl = "https://scontent.fdel8-2.fna.fbcdn.net/v/t39.30808-6/894924898_122148903663189840_2799085066857905965_n.jpg?_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=aa9190&_nc_ohc=2oeV3TgDoHgQ7kNvwGuuqHP&_nc_oc=Adpai1U35qBOzBslWkws9YpC68Am6Fdv-ELk1gHtnb60oLkFXDux62-TjsfBOf_HGOXWSuOuCfm38yUdhlPVTLZL&_nc_zt=23&_nc_ht=scontent.fdel8-2.fna&edm=AMAeTUEEAAAA&_nc_gid=w9qZkrk_eX_Ew9kKoUtM2w&_nc_tpa=Q5bMBQJ5ua62MizW-m6PpbDi2XnCS6KW0QZU6z2i0tIg743i-BDoSCILpE11tb3t3sGVuP3Z8VMfDXylBQ&oh=00_AQTPUMOGM45Tug_piksuj9o1axhFDkrgMsRRrwA2yRWGQA&oe=6AF5F18F";

async function postLinkedIn() {
  console.log("Publishing to LinkedIn via Ayrshare using Meta CDN image...");
  const body = {
    post: caption,
    platforms: ["linkedin"],
    mediaUrls: [metaCdnUrl]
  };

  const res = await fetch("https://app.ayrshare.com/api/post", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AYRSHARE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  console.log("Ayrshare Result:", JSON.stringify(data, null, 2));

  if (res.ok && data.status !== "error") {
    const lkId = data.postIds?.find(p => p.platform === "linkedin")?.id || data.id;
    const lkUrl = `https://www.linkedin.com/feed/update/urn:li:share:${lkId}`;
    console.log("LinkedIn Live Post:", lkUrl);

    // Update Lark CRM record
    const tokenRes = await fetch("https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
    });
    const tokenData = await tokenRes.json();
    const token = tokenData.tenant_access_token;

    const fullLinks = [
      `Instagram: https://www.instagram.com/p/18132150310694448`,
      `Facebook: https://www.facebook.com/988923307629678/photos/122148904521189840`,
      `LinkedIn: ${lkUrl}`
    ].join(" | ");

    const updateUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/${RECORD_ID}`;
    await fetch(updateUrl, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          "Status": "Published",
          "Post Link": fullLinks
        }
      })
    });
    console.log("Lark Record updated with all 3 live links!");
  }
}

postLinkedIn().catch(e => console.error(e));
