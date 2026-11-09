const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../../.env.local');
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

const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;
const RECORD_ID = "reczz28X48BSphTD";

async function getLarkTenantToken() {
  const url = "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
  });
  const data = await res.json();
  if (data.code === 0) return data.tenant_access_token;
  throw new Error(`Lark Token Auth Failed: ${data.msg}`);
}

async function uploadImage() {
  const imagePath = path.resolve(__dirname, '../../public/adyant_nexa_diwali.png');
  const fileBuffer = fs.readFileSync(imagePath);

  // Method 1: tmpfiles.org
  try {
    console.log("Trying tmpfiles.org...");
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: "image/png" });
    formData.append("file", blob, "adyant_nexa_diwali.png");

    const res = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: formData
    });
    const d = await res.json();
    if (d?.data?.url) {
      // Convert https://tmpfiles.org/12345/file.png to direct download https://tmpfiles.org/dl/12345/file.png
      const directUrl = d.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
      console.log("Uploaded to tmpfiles.org:", directUrl);
      return directUrl;
    }
  } catch (e) {
    console.warn("tmpfiles.org failed:", e.message);
  }

  // Method 2: 0x0.st
  try {
    console.log("Trying 0x0.st...");
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: "image/png" });
    formData.append("file", blob, "adyant_nexa_diwali.png");

    const res = await fetch("https://0x0.st", {
      method: "POST",
      body: formData
    });
    if (res.ok) {
      const text = await res.text();
      if (text.startsWith("http")) {
        console.log("Uploaded to 0x0.st:", text.trim());
        return text.trim();
      }
    }
  } catch (e) {
    console.warn("0x0.st failed:", e.message);
  }

  // Method 3: Catbox
  try {
    console.log("Trying Catbox.moe...");
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: "image/png" });
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", blob, "adyant_nexa_diwali.png");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData
    });
    if (res.ok) {
      const text = await res.text();
      if (text.startsWith("http")) {
        console.log("Uploaded to Catbox:", text.trim());
        return text.trim();
      }
    }
  } catch (e) {
    console.warn("Catbox failed:", e.message);
  }

  return "";
}

async function update() {
  const imageUrl = await uploadImage();
  if (!imageUrl) {
    console.error("Failed to upload image to any CDN provider.");
    return;
  }

  const token = await getLarkTenantToken();
  const updateUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/${RECORD_ID}`;

  const res = await fetch(updateUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fields: {
        "Visual Design Prompt": imageUrl
      }
    })
  });

  const data = await res.json();
  if (data.code === 0) {
    console.log("\nSuccessfully updated Lark Record with Image URL!");
    console.log("Record ID:", RECORD_ID);
    console.log("Image URL:", imageUrl);
  } else {
    console.error("Lark Update Error:", data.msg);
  }
}

update();
