const fs = require('fs');

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

const caption = `On Dhanteras, tradition calls for investing in gold, physical assets, and tokens of enduring prosperity.

In luxury real estate and high-ticket dealmaking, true wealth is measured by conversion speed — how fast high-value inquiries turn into closed revenue.

Here is the reality in 2026:
If your agency spends millions acquiring high-net-worth property inquiries across Dubai, London, and Singapore...
Every lead that waits 10 hours for a broker's morning callback is wealth leaking directly out of your pipeline.

Gold preserves capital.
Autonomous infrastructure multiplies it.

When an 8-figure investor reaches out at 11:30 PM:
• Traditional Agencies: Wait until 10 AM. Lead goes cold. Deal lost.
• Adyant Nexa Infrastructure: Engages in under 30 seconds on WhatsApp & Instagram. Qualifies budget, location preference, and purchase timeline. Locks VIP calendar appointments automatically.

This festive season, don't just accumulate assets. Build the infrastructure that compounds them 24/7/365.

Wishing our partners, founders, and brokerage directors a prosperous and high-velocity Dhanteras.

Experience live autonomous qualification at adyantnexa.com or comment 'DHANTERAS'.

#HappyDhanteras #Dhanteras2026 #AdyantNexa #WealthCreation #AutonomousSales #RealEstateDubai #PropTech #SpeedToLead #LuxuryRealEstate`;

async function pushDhanteras() {
  console.log("Authenticating with Lark...");
  const authRes = await fetch('https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const auth = await authRes.json();
  const token = auth.tenant_access_token;

  const payload = {
    fields: {
      'Topic': 'Festive Special: True Wealth Is Converted In Seconds (Happy Dhanteras)',
      'Platform': ['LinkedIn', 'Instagram', 'Facebook'],
      'Caption': caption,
      'Visual Design Prompt': 'Visual Asset CDN: https://files.catbox.moe/ltenlw.jpg\nLocal Path: c:\\Users\\mi\\AN\\outputs\\dhanteras\\dhanteras_white_theme_final.jpg\nTheme: Crisp White / Daylight Architectural Luxury with Brushed Bullion Gold Diya, Official Cobalt Vector Logo, Polished Marble Reflection',
      'Status': 'Draft'
    }
  };

  const res = await fetch('https://open.larksuite.com/open-apis/bitable/v1/apps/' + LARK_BASE_ID + '/tables/' + LARK_TABLE_ID + '/records', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.code === 0) {
    console.log('✅ Lark Push SUCCESS! Record ID:', data.data.record.record_id);
  } else {
    console.error('❌ Lark Push Failed:', data.msg);
  }
}
pushDhanteras();
