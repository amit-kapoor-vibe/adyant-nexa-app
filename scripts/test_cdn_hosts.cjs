const fs = require('fs');
const path = require('path');

const imgPath = path.resolve(__dirname, '../public/adyant_nexa_diwali.png');
const fileBuffer = fs.readFileSync(imgPath);

async function testCatbox() {
  try {
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: "image/png" });
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", blob, "adyant_nexa_diwali.png");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });
    const url = await res.text();
    console.log("Catbox response:", url);
    if (url.startsWith("http")) {
      const h = await fetch(url.trim(), { method: "HEAD" });
      console.log("Catbox Content-Type:", h.headers.get("content-type"));
      return url.trim();
    }
  } catch (e) {
    console.log("Catbox error:", e.message);
  }
  return null;
}

async function testImgBB() {
  try {
    // Free imgbb upload API
    const base64Data = fileBuffer.toString('base64');
    const formData = new URLSearchParams();
    formData.append("image", base64Data);

    const res = await fetch("https://api.imgbb.com/1/upload?key=6d207e02198a847aa98d0a2a901485a5", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (data?.data?.url) {
      console.log("ImgBB direct URL:", data.data.url);
      const h = await fetch(data.data.url, { method: "HEAD" });
      console.log("ImgBB Content-Type:", h.headers.get("content-type"));
      return data.data.url;
    } else {
      console.log("ImgBB fail:", JSON.stringify(data));
    }
  } catch (e) {
    console.log("ImgBB error:", e.message);
  }
  return null;
}

async function test0x0() {
  try {
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: "image/png" });
    formData.append("file", blob, "adyant_nexa_diwali.png");

    const res = await fetch("https://0x0.st", {
      method: "POST",
      body: formData,
      headers: { "User-Agent": "curl/8.0" }
    });
    const url = await res.text();
    console.log("0x0.st response:", url);
    if (url.startsWith("http")) {
      const h = await fetch(url.trim(), { method: "HEAD" });
      console.log("0x0.st Content-Type:", h.headers.get("content-type"));
      return url.trim();
    }
  } catch (e) {
    console.log("0x0.st error:", e.message);
  }
  return null;
}

async function run() {
  console.log("Testing hosts...");
  const c = await testCatbox();
  const i = await testImgBB();
  const o = await test0x0();
}

run();
