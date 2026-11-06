import fs from 'fs';

const pageId = '988923307629678';
const pageToken = 'EABAOROZAZCslUBSwZC6HeZBiV67KRgZBJIt0jqOTCGWzF1coGnfTaPO632WWDaE3ZCMpnyKvKEBLRHtfMcApPu1Bhllw0DrRqXZBAttYfzIP77BfLjXHHGB3eqQ2zWIc9GNK2ePAeAyI3a8g5U4klx0ksyiBgMnEfs2RlIcKg4JTODVjIBiWVYBbZAloZA0rL8u3wTMkZCJ3b6NWu37hWZCgCXZAaT67x7MrzPRxJD3A4NPZA6h4X3knagukfB1FMwTmU';
const imgPath = 'c:\\Users\\mi\\AN\\outputs\\post_01\\post_01_svg_logo_1080x1350.jpg';

const caption = `Most real estate brokerages think they have a lead generation problem. 

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

#AdyantNexa #RealEstateTech #PropTech #BrokerageGrowth #SpeedToLead #DubaiRealEstate`;

async function publishPhoto() {
  console.log('Reading image from:', imgPath);
  const fileBytes = fs.readFileSync(imgPath);
  const blob = new Blob([fileBytes], { type: 'image/jpeg' });
  const form = new FormData();
  form.append('source', blob, 'post_01_adyant_nexa.jpg');
  form.append('message', caption);

  console.log('Publishing photo to Facebook Page:', pageId);
  const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/photos?access_token=${pageToken}`, {
    method: 'POST',
    body: form
  });

  const data = await res.json();
  console.log('PUBLISH RESPONSE:', JSON.stringify(data, null, 2));
}

publishPhoto().catch(console.error);
