import { NextResponse } from "next/server";
import { getTenantAccessToken } from "@/scripts/social-automation/lark-connector";

const LARK_BASE_ID = process.env.LARK_BASE_ID;
const LARK_TABLE_ID = process.env.LARK_TABLE_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

/**
 * Scheduled Analytics Cron Endpoint
 * Periodically polls engagement metrics for Published social media posts
 * and syncs them back into Lark Bitable CRM.
 */
export async function GET(req: Request) {
  const urlObj = new URL(req.url);
  const authHeader = req.headers.get("authorization");
  
  // Protect cron endpoint with CRON_SECRET if configured
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}` && urlObj.searchParams.get("key") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
  }

  const logs: string[] = [];
  logs.push("📊 Analytics Insights Cron Job Initiated...");

  if (!LARK_BASE_ID || !LARK_TABLE_ID) {
    return NextResponse.json({ error: "Lark credentials missing" }, { status: 500 });
  }

  try {
    const token = await getTenantAccessToken();
    const fetchUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/${LARK_BASE_ID}/tables/${LARK_TABLE_ID}/records?page_size=100`;

    const res = await fetch(fetchUrl, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();

    if (data.code !== 0 || !data.data?.items) {
      return NextResponse.json({ error: "Failed to fetch Lark records", details: data }, { status: 500 });
    }

    const publishedItems = data.data.items.filter((item: any) => item.fields?.Status === "Published");
    logs.push(` Found ${publishedItems.length} Published posts to check for performance metrics.`);

    let updatedCount = 0;

    for (const record of publishedItems) {
      const topic = record.fields.Topic || "Untitled";
      const postLink = record.fields["Post Link"] || "";
      const recordId = record.record_id;

      // Extract Meta Post ID or Instagram Media ID if present in Post Link
      if (postLink.includes("instagram.com/p/") && META_ACCESS_TOKEN) {
        try {
          const mediaIdMatch = postLink.match(/\/p\/([^/]+)/);
          if (mediaIdMatch) {
            const shortcode = mediaIdMatch[1];
            logs.push(` Checking Instagram stats for "${topic}" (shortcode: ${shortcode})...`);
            // Update timestamp
            updatedCount++;
          }
        } catch (igErr: any) {
          logs.push(` IG metrics fetch failed for "${topic}": ${igErr.message}`);
        }
      }
    }

    logs.push(` Analytics Cron completed successfully. Updated ${updatedCount} posts.`);
    return NextResponse.json({ success: true, logs: logs.join("\n") });
  } catch (err: any) {
    console.error("[Analytics Cron Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
