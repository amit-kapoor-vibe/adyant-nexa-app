async function testLiveWebhook() {
  const url = "https://adyantnexa.com/api/lark/webhook";
  console.log("Testing live Vercel endpoint:", url);

  const payload = {
    topic: "Adyant Nexa | Live Automation Verification",
    caption: "Verifying live Vercel webhook integration for Adyant Nexa social architecture.\n\n#AdyantNexa #Automation",
    platform: "Instagram, Facebook, LinkedIn",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const status = res.status;
    const data = await res.json();
    console.log(`Status: ${status}`);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testLiveWebhook();
