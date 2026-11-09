const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    return;
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Check buckets
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  if (bErr) {
    console.error("Supabase List Buckets Error:", bErr.message);
  } else {
    console.log("Supabase Buckets:", buckets.map(b => b.name));
  }

  // Check if we can create a public bucket or upload
  const bucketName = "public-assets";
  if (!buckets?.find(b => b.name === bucketName)) {
    console.log(`Creating bucket ${bucketName}...`);
    const { data: cb, error: cbErr } = await supabase.storage.createBucket(bucketName, { public: true });
    if (cbErr) console.log("Create bucket note:", cbErr.message);
  }

  const imgPath = path.resolve(__dirname, '../public/adyant_nexa_diwali.png');
  const buffer = fs.readFileSync(imgPath);

  const { data: up, error: upErr } = await supabase.storage.from(bucketName).upload("diwali-post.png", buffer, {
    contentType: "image/png",
    upsert: true
  });

  if (upErr) {
    console.error("Upload error:", upErr.message);
  } else {
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl("diwali-post.png");
    console.log("\n>>> SUPABASE PUBLIC IMAGE URL:", publicUrlData.publicUrl);

    // Verify headers with HEAD request
    const head = await fetch(publicUrlData.publicUrl, { method: "HEAD" });
    console.log("Status:", head.status);
    console.log("Content-Type:", head.headers.get("content-type"));
    console.log("Content-Length:", head.headers.get("content-length"));
  }
}

testSupabase().catch(e => console.error(e));
