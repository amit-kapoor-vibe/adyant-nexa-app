const pageToken = "EABAOROZAZCslUBS7DYsGst4Ye0E84IAv0CJNyoqxpOxOfwSbMjYmrahW1TooHZAZBLI1WZBm9azTRFOuTcS5JmyWGGJZAAGVsFDqKEDu2ryk5NoRVpHN4YYw04xKMWXWvwRZBAxq7qyFcWbxjaMxFnhAhmN5rAeZBJWYFz6iqL0TXoeE2V3rhDZARRZAruWIjCHLxIITZC2ZCUvN";
const systemToken = "EABAOROZAZCslUBS476ZA7Fc6SE47oglXTbWVQSUnmJNrCUPBk49oApFg7LVnzeNM0eE2zXUF00FSdeW1tVLINshXFuiqD5xssEGoxN5HkKZB8qDaQ2OULiMzV9zZBk8bNRWWr2ibumAUZBPqNmTMBU4DAwbcckvV7ueyKScQNt1N3mCOfOt8hGFkKu4MxhZAQZDZD";
const igId = "17841480179651485";
const pageId = "988923307629678";
const imageUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop";
const caption = "Adyant Nexa | Architectural Test Post";

async function testFacebookDirect() {
  console.log("Testing Facebook Page Post with Page Token...");
  const url = `https://graph.facebook.com/v21.0/${pageId}/photos`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: imageUrl, message: caption, access_token: pageToken })
  });
  const data = await res.json();
  console.log("Facebook Response:", JSON.stringify(data, null, 2));
}

async function testInstagramDirect() {
  console.log("\nTesting Instagram Post with System Token...");
  // Step 1: Create Container
  const containerUrl = `https://graph.facebook.com/v21.0/${igId}/media`;
  const res1 = await fetch(containerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl, caption: caption, access_token: systemToken })
  });
  const d1 = await res1.json();
  console.log("Instagram Container Created:", JSON.stringify(d1, null, 2));
  if (!d1.id) return;

  // Wait 4 seconds for container status
  console.log("Waiting 4 seconds for container to finish downloading image...");
  await new Promise(r => setTimeout(r, 4000));

  const checkRes = await fetch(`https://graph.facebook.com/v21.0/${d1.id}?fields=status_code&access_token=${systemToken}`);
  const checkData = await checkRes.json();
  console.log("Container Status:", JSON.stringify(checkData, null, 2));

  // Step 2: Publish
  if (checkData.status_code === "FINISHED") {
    const publishUrl = `https://graph.facebook.com/v21.0/${igId}/media_publish`;
    const res2 = await fetch(publishUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: d1.id, access_token: systemToken })
    });
    const d2 = await res2.json();
    console.log("Instagram Publish Response:", JSON.stringify(d2, null, 2));
  }
}

async function main() {
  await testFacebookDirect();
  await testInstagramDirect();
}

main();
