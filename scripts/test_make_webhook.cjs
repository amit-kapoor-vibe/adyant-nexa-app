const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.resolve(__dirname, '../.env.local');
let webhookUrl = "https://hook.eu1.make.com/1319prt2fb3851gujl6bx3i9e43awxxp";

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('MAKE_LINKEDIN_WEBHOOK_URL=')) {
      webhookUrl = trimmed.split('=')[1].trim();
    }
  }
}

async function testWebhook() {
  console.log("Sending test payload to Make.com LinkedIn Webhook...");
  console.log("Target URL:", webhookUrl);

  const payload = {
    caption: "Adyant Nexa | Autonomous OS Integration Test\n\nVerifying institutional-grade social architecture pipeline with zero-watermark distribution.\n\n#AdyantNexa #EnterpriseAutomation #DigitalInfrastructure",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const status = res.status;
    const body = await res.text();
    console.log(`Response Status: ${status}`);
    console.log(`Response Body: ${body}`);

    if (res.ok) {
      console.log("\nSUCCESS: Webhook successfully accepted by Make.com!");
      console.log("Check Make.com and your Adyant Nexa LinkedIn Company Page to see the live post.");
    } else {
      console.error("\nFAILED: Webhook rejected with status", status);
    }
  } catch (err) {
    console.error("Network Error:", err.message);
  }
}

testWebhook();
