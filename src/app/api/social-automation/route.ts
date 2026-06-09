import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execPromise = promisify(exec);

// Load environment variables directly if not loaded
const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;

/**
 * Gets the Lark tenant_access_token
 */
async function getTenantAccessToken() {
  const url = "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal";
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_id: LARK_APP_ID,
      app_secret: LARK_APP_SECRET
    })
  });
  
  const data = await response.json();
  if (data.code === 0) {
    return data.tenant_access_token;
  } else {
    throw new Error(`Lark Token Auth Failed: ${data.msg}`);
  }
}

/**
 * GET: Fetches all records from Lark Base CRM
 */
export async function GET() {
  try {
    if (!LARK_APP_ID || !LARK_APP_SECRET || !LARK_BASE_ID || !LARK_TABLE_ID) {
      return NextResponse.json({ error: "Missing Lark Configuration in env" }, { status: 500 });
    }

    const token = await getTenantAccessToken();
    const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=50`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await response.json();
    if (data.code === 0 && data.data && data.data.items) {
      // Format items cleanly
      const records = data.data.items.map((item: any) => ({
        id: item.record_id,
        topic: item.fields["Topic"] || "Untitled",
        platforms: item.fields["Platform"] || [],
        caption: item.fields["Caption"] || "",
        visualPrompt: item.fields["Visual Design Prompt"] || "",
        status: item.fields["Status"] || "Draft",
        visualUrl: item.fields["Visual Asset URL"] || "",
        postLink: item.fields["Post Link"] || ""
      }));
      return NextResponse.json({ success: true, records });
    } else {
      return NextResponse.json({ success: true, records: [] });
    }
  } catch (error: any) {
    console.error("GET Lark Records Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Triggers automation pipeline actions (generate, publish, regenerate-image)
 */
export async function POST(request: Request) {
  try {
    const { action, topic, filename, recordId, customTopic } = await request.json();

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    const projectRoot = process.cwd();

    if (action === "generate") {
      console.log("🎬 Spawning Content Generator Pipeline...");
      const command = customTopic 
        ? `node src/scripts/social-automation/run-pipeline.js generate "${customTopic.replace(/"/g, '\\"')}"`
        : `node src/scripts/social-automation/run-pipeline.js generate`;
      
      const { stdout, stderr } = await execPromise(command, {
        cwd: projectRoot
      });
      return NextResponse.json({ success: true, logs: stdout, errorLogs: stderr });
    }

    if (action === "publish") {
      console.log("🎬 Spawning Live Publisher Pipeline...");
      const { stdout, stderr } = await execPromise("node src/scripts/social-automation/run-pipeline.js publish", {
        cwd: projectRoot
      });
      return NextResponse.json({ success: true, logs: stdout, errorLogs: stderr });
    }

    if (action === "regenerate-image") {
      if (!topic) {
        return NextResponse.json({ error: "Topic is required for image generation" }, { status: 400 });
      }

      console.log(`🎨 Spawning FLUX Image Generation for topic: "${topic}"...`);
      
      // Ensure public output folder exists
      const outputDir = path.join(projectRoot, "public", "generated-images");
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const safeFilename = (filename || topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")).substring(0, 30);
      const command = `node src/scripts/social-automation/generate-images.js "${topic}" "${safeFilename}" "${outputDir}"`;
      
      const { stdout, stderr } = await execPromise(command, {
        cwd: projectRoot
      });

      // After rendering locally in public folder, we build the asset link served by Next.js
      const localVisualUrl = `/generated-images/${safeFilename}-square.png`;
      const localVisualPortraitUrl = `/generated-images/${safeFilename}-portrait.png`;
      const localVisualReelUrl = `/generated-images/${safeFilename}-reel.png`;

      // Optionally update Lark base with the newly rendered asset URL
      if (recordId) {
        try {
          const token = await getTenantAccessToken();
          const updateUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records/${recordId}`;
          
          // Since we are running locally, the image asset URL can point to localhost:3000
          // In production, this would be a Supabase storage URL or fully qualified host URL
          const fullHostUrl = `http://localhost:3000${localVisualUrl}`;

          await fetch(updateUrl, {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              fields: {
                "Visual Asset URL": fullHostUrl
              }
            })
          });
          console.log(`✅ Lark Base record ${recordId} updated with visual link: ${fullHostUrl}`);
        } catch (larkErr) {
          console.error("⚠️ Failed to update Lark base with new visual link:", larkErr);
        }
      }

      return NextResponse.json({
        success: true,
        logs: stdout,
        errorLogs: stderr,
        urls: {
          square: localVisualUrl,
          portrait: localVisualPortraitUrl,
          reel: localVisualReelUrl
        }
      });
    }

    return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (error: any) {
    console.error("POST Social Automation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
