const token = 'EABAOROZAZCslUBS9QxL9lJcBLuB3an79DcV3NFZC1WZCzFIKNpjOXyR1VIpECr4nZAUIgIWq7Dmjeon6kp4EuhwVUwpBhpoeNNejPEAniBp380bil3tTtqvMZCviQSvJ2xwWl2ZBpDAbaNeo8amTFXNiXHmlu7ZA7d4b9FpR3eReCjZBvtMXrza8TR2KNWyaB9r99EDQxHPZBfo27Y3mDVrSSgFDPuq2nMAgOyfHQpOVS0jbHwER4oJRiXF2fa7nAGOzUoyI9JlNogqG9XWGLkWgOaWKRhFdWefXn7FgIZD';
const igId = '17841480179651485';
const pageId = '988923307629678';
const imageUrl = 'https://files.catbox.moe/zmibbm.jpg';

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

#AdyantNexa #RealEstateTech #PropTech #BrokerageGrowth #SpeedToLead #DubaiRealEstate #AutonomousSales`;

async function publishIG() {
  console.log('📸 1. Creating Instagram media container...');
  const res1 = await fetch('https://graph.facebook.com/v21.0/' + igId + '/media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      caption: caption,
      access_token: token
    })
  });
  const d1 = await res1.json();
  console.log('Container result:', d1);
  if (!d1.id) return null;

  console.log('📸 2. Publishing container to Instagram...');
  const res2 = await fetch('https://graph.facebook.com/v21.0/' + igId + '/media_publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: d1.id,
      access_token: token
    })
  });
  const d2 = await res2.json();
  console.log('Instagram Publish result:', d2);
  if (d2.id) {
    const link = 'https://www.instagram.com/p/' + d2.id;
    console.log('🎉 Instagram LIVE URL:', link);
    return link;
  }
  return null;
}

async function publishFB() {
  console.log('👤 3. Getting Page token for Facebook...');
  const pageRes = await fetch('https://graph.facebook.com/v21.0/' + pageId + '?fields=access_token&access_token=' + token);
  const pageData = await pageRes.json();
  const pageToken = pageData.access_token || token;

  console.log('👤 4. Posting photo to Facebook Page...');
  const res = await fetch('https://graph.facebook.com/v21.0/' + pageId + '/photos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: imageUrl,
      message: caption,
      access_token: pageToken
    })
  });
  const d = await res.json();
  console.log('Facebook Publish result:', d);
  const postId = d.post_id || d.id;
  if (postId) {
    const link = 'https://www.facebook.com/' + pageId + '/posts/' + postId;
    console.log('🎉 Facebook LIVE URL:', link);
    return link;
  }
  return null;
}

async function main() {
  const igLink = await publishIG();
  const fbLink = await publishFB();
  console.log('\n==================================');
  console.log('FINAL RESULTS:');
  console.log('Instagram:', igLink || 'Failed');
  console.log('Facebook:', fbLink || 'Failed');
  console.log('==================================');
}
main();
