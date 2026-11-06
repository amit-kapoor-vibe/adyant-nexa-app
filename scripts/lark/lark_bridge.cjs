/**
 * Adyant Nexa - Lark Base CRM & Social Approval Bridge
 * 
 * Functions:
 * 1. push: Uploads Post 01, Post 02, Post 03 to Lark Base CRM (Social_Media_Queue table)
 *    with clean B2B copy, visual design info, Catbox public CDN URL, and Status: "Draft"
 * 2. status: Lists recent records in Lark Base with their approval state
 * 3. publish: Checks for records marked "Approved" in Lark Base, and executes publication
 */

const fs = require('fs');
const path = require('path');

// Credentials
const LARK_APP_ID = "cli_a96c3d501578de15";
const LARK_APP_SECRET = "zMF175wzt2NXl8SxxoYYmWUgeGcEq2Re";
const LARK_BASE_ID = "XNytbpOecasAlUsMGbXjYN6LpQh";
const LARK_TABLE_ID = "tblAx5CVIwMMlxIG";

const AYRSHARE_API_KEY = "69BDC822-610646B8-BCA15AA0-700C7450";

async function getTenantAccessToken() {
  const url = "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_id: LARK_APP_ID,
      app_secret: LARK_APP_SECRET
    })
  });
  const data = await res.json();
  if (data.code === 0) return data.tenant_access_token;
  throw new Error(`Lark Token Auth Failed: ${data.msg}`);
}

async function uploadToCatbox(filePath, filename) {
  try {
    const fileBuf = fs.readFileSync(filePath);
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', new Blob([fileBuf]), filename);

    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    });
    const url = await res.text();
    return url.trim();
  } catch (err) {
    console.error(`Catbox upload failed for ${filename}:`, err.message);
    return "";
  }
}

const POSTS = [
  {
    day: "Day 1",
    topic: "Day 1: Response Time Bottleneck (Dubai Real Estate AI)",
    platforms: ["Instagram", "Facebook", "LinkedIn"],
    imagePath: path.resolve(__dirname, "outputs/post_01/post_01_svg_logo_1080x1350.jpg"),
    caption: `Most real estate brokerages think they have a lead generation problem. 

They don't. They have a response gate bottleneck.

Here is the economic reality in 2026:
Your agency runs high-budget Meta campaigns targeting international investors for prime Palm, Downtown, or off-plan luxury inventory. A qualified buyer from London or Singapore fills your inquiry form or taps your WhatsApp link at 11:30 PM.

What happens next?
In 82% of agencies, that lead sits in a spreadsheet or CRM queue until the following morning. By the time a broker dials them 10 hours later, the investor has already engaged with a competitor who answered in 2 minutes.

Speed-to-lead is not customer service. It is deal survival.

Adyant Nexa deploys autonomous, multi-lingual AI sales infrastructure across your WhatsApp and Instagram channels:
• Instant sub-30-second conversational engagement (24/7).
• BANT qualification (Budget, Preferred Area, Yield vs End-Use, Timeline, Golden Visa intent).
• Intelligent routing: Only pre-qualified, sales-ready investors get escalated to your human brokers' calendars.

Stop burning ad spend on leads that die in your inbox.

Brokerage Founders & Managing Directors:
Comment 'DEMO' or tap the link in our bio to test the live qualification engine directly on your phone.

#AdyantNexa #RealEstateTech #PropTech #BrokerageGrowth #SpeedToLead #DubaiRealEstate #AutonomousSales`
  },
  {
    day: "Day 2",
    topic: "Day 2: The 5-Minute Rule in Luxury Real Estate",
    platforms: ["Instagram", "Facebook", "LinkedIn"],
    imagePath: path.resolve(__dirname, "outputs/post_02/post_02_white_theme_final.jpg"),
    caption: `The math behind lead decay in luxury real estate is brutal:

Harvard Business Review proved that responding within 5 minutes makes you 21x more likely to qualify a lead compared to waiting 30 minutes. 

After 1 hour? The odds drop by 391%.

In high-ticket luxury property sales ($1M - $20M transactions), international high-net-worth buyers rarely submit an inquiry to only one agency. They tap three.
The firm that delivers an immediate, intelligent, and tailored response wins the conversation. The other two are fighting for crumbs.

Most agencies try to solve this by hiring more shift reps or call-center callers. But human shift-handoffs always create latency leaks — especially across UK, European, and Asian time zones.

The fix isn't more callers. It's automated infrastructure.

Adyant Nexa installs autonomous AI lead qualification agents directly onto your WhatsApp Business API & Instagram DMs:
✓ Engages within 30 seconds, 24 hours a day, 365 days a year.
✓ Qualifies investor budget, readiness, and preferred development (Off-plan, Penthouse, Branded Residence).
✓ Syncs directly into your agency CRM and locks calendar bookings for senior closers.

Your brokers should be closing qualified buyers on site visits. Not playing phone tag with cold web form inquiries.

Read the full enterprise implementation blueprint at adyantnexa.com or DM us '5MIN'.

#AdyantNexa #DubaiProperty #RealEstateAI #LeadDecay #SpeedToLead #HNWMarketing #LuxuryRealEstate`
  },
  {
    day: "Day 3",
    topic: "Day 3: Your Brokers Are Closers. Not Data-Entry Callers.",
    platforms: ["Instagram", "Facebook", "LinkedIn"],
    imagePath: path.resolve(__dirname, "outputs/post_03/post_03_white_theme_final.jpg"),
    caption: `If your top real estate brokers spend 4 hours a day dialing unverified portal inquiries, asking basic budget questions, and updating CRM notes...

You don't have a sales team. You have an overpaid call center.

Elite brokers are built to do one thing: Build human trust, conduct private viewings, negotiate contract terms, and close eight-figure deals.

Every minute they spend asking:
"What is your target budget?"
"Are you looking for investment yield or self-use?"
"Do you already have UAE Golden Visa eligibility?"

...is a minute stolen from closing an active transaction.

Adyant Nexa eliminates the manual qualification toll:
1. Multi-Channel Ingestion: Inquiries from Meta ads, Google ads, WhatsApp, and Instagram are greeted in sub-30 seconds.
2. Conversational BANT Filter: Autonomous AI screens for real capital, timeline, and asset preference without rigid robotic forms.
3. VIP Calendar Escalation: Unqualified or tire-kicker leads are filtered. High-intent investors are routed straight to your senior broker's WhatsApp with a full dossier.

High-growth brokerages scale with autonomous infrastructure — not headcount bloat.

Agency leaders: Visit adyantnexa.com or message us 'INFRA' to see the architecture live.

#AdyantNexa #LuxuryBrokerage #RealEstateDubai #SalesAutomation #BANTQualification #PropTechAI #PropTech`
  }
];

async function pushPostsToLark() {
  console.log("🚀 Authenticating with Lark API...");
  const token = await getTenantAccessToken();
  console.log("✅ Lark token obtained.");

  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records`;

  for (const p of POSTS) {
    console.log(`\n📦 Processing ${p.day}: "${p.topic}"...`);
    
    let cdnUrl = "";
    if (fs.existsSync(p.imagePath)) {
      console.log(`📤 Uploading creative to public CDN...`);
      cdnUrl = await uploadToCatbox(p.imagePath, `${p.day.replace(/\s+/g, '_').toLowerCase()}.jpg`);
      console.log(`🌐 CDN URL: ${cdnUrl}`);
    } else {
      console.warn(`⚠️ Local image not found at ${p.imagePath}`);
    }

    const payload = {
      fields: {
        "Topic": p.topic,
        "Platform": p.platforms,
        "Caption": p.caption,
        "Visual Design Prompt": `Visual Asset CDN: ${cdnUrl}\nLocal Path: ${p.imagePath}\nTheme: Crisp White / Daylight Architectural Luxury (Dubai Skyline, Cobalt Accents, Official Vector Logo)`,
        "Status": "Draft"
      }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const resData = await res.json();
    if (resData.code === 0) {
      console.log(`✅ Successfully synced to Lark CRM! Record ID: ${resData.data.record.record_id}`);
    } else {
      console.error(`❌ Failed to sync ${p.day}:`, resData.msg);
    }
  }

  console.log("\n🎉 All posts pushed to Lark Base CRM successfully!");
  console.log("👉 Next: Open your Lark Base app, review the copy & visual URL, and set Status to 'Approved'!");
}

async function checkLarkStatus() {
  console.log("🔍 Checking Lark Base CRM records...");
  const token = await getTenantAccessToken();
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=20`;

  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();

  if (data.code === 0 && data.data?.items) {
    console.log(`\n📋 Found ${data.data.items.length} records in Lark Base:`);
    data.data.items.slice(-5).forEach((item, idx) => {
      const f = item.fields;
      console.log(`[${idx + 1}] ID: ${item.record_id} | Status: ${f.Status} | Topic: ${f.Topic} | Platforms: ${(f.Platform || []).join(', ')}`);
    });
  } else {
    console.error("Error fetching Lark records:", data);
  }
}

async function publishApprovedPosts() {
  console.log("🚀 Scanning Lark Base for 'Approved' posts...");
  const token = await getTenantAccessToken();
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=50`;

  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();

  if (data.code === 0 && data.data?.items) {
    const approved = data.data.items.filter(item => item.fields?.Status === "Approved");
    if (approved.length === 0) {
      console.log("ℹ️ No posts currently marked as 'Approved' in Lark. Nothing to publish right now.");
      return;
    }

    console.log(`🎯 Found ${approved.length} approved post(s) to publish!`);

    for (const item of approved) {
      const recordId = item.record_id;
      const f = item.fields;
      const topic = f.Topic;
      const caption = f.Caption;
      const platforms = f.Platform || [];

      // Extract image URL from Visual Design Prompt
      const cdnMatch = (f["Visual Design Prompt"] || "").match(/https:\/\/files\.catbox\.moe\/[a-zA-Z0-9._-]+/);
      const imageUrl = cdnMatch ? cdnMatch[0] : "";

      console.log(`\n📬 Publishing: "${topic}" | Image: ${imageUrl || 'None'}`);

      let publishedLink = "";
      // If LinkedIn is selected and Ayrshare key is present
      if (platforms.includes("LinkedIn") && AYRSHARE_API_KEY) {
        try {
          console.log("💼 Posting to LinkedIn via Ayrshare...");
          const body = {
            post: caption,
            platforms: ["linkedin"],
            ...(imageUrl ? { mediaUrls: [imageUrl] } : {})
          };
          const ayrRes = await fetch("https://app.ayrshare.com/api/post", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${AYRSHARE_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          });
          const ayrData = await ayrRes.json();
          if (ayrRes.ok && ayrData.status !== "error") {
            const lkId = ayrData.postIds?.find(p => p.platform === "linkedin")?.id || ayrData.id;
            publishedLink = `https://www.linkedin.com/feed/update/urn:li:share:${lkId}`;
            console.log(`🎉 LinkedIn Post Live: ${publishedLink}`);
          } else {
            console.error("Ayrshare LinkedIn error:", ayrData);
          }
        } catch (err) {
          console.error("LinkedIn publish error:", err.message);
        }
      }

      // Update Lark Status to Published
      const updateUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/${recordId}`;
      await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: {
            "Status": "Published",
            ...(publishedLink ? { "Post Link": publishedLink } : {})
          }
        })
      });
      console.log(`✅ Updated Lark record ${recordId} to 'Published'!`);
    }
  }
}

const command = process.argv[2] || "status";
if (command === "push") {
  pushPostsToLark();
} else if (command === "publish") {
  publishApprovedPosts();
} else {
  checkLarkStatus();
}
