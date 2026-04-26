import { NextResponse } from "next/server";

// ─── BACKEND RATE LIMITING (IP-BASED) ───
const rateLimitMap = new Map<string, { count: number, lastReset: number }>();
const MAX_LEADS_PER_DAY = 5;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip);

    if (userLimit) {
      // Reset count every 24 hours
      if (now - userLimit.lastReset > 24 * 60 * 60 * 1000) {
        rateLimitMap.set(ip, { count: 1, lastReset: now });
      } else if (userLimit.count >= MAX_LEADS_PER_DAY) {
        return NextResponse.json({ 
          error: "Neural link saturated. Please try again in 24 hours or use WhatsApp for priority sync." 
        }, { status: 429 });
      } else {
        userLimit.count += 1;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    }

    const { name, email, phone, business, message, budget } = await request.json();

    // 1. Get Tenant Access Token from Lark
    const authResponse = await fetch("https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_id: process.env.LARK_APP_ID,
        app_secret: process.env.LARK_APP_SECRET,
      }),
    });

    const authData = await authResponse.json();
    if (authData.code !== 0) {
      throw new Error("Lark Authentication Failed");
    }

    const tenantAccessToken = authData.tenant_access_token;

    // 2. Add Record to Lark Bitable
    const bitableResponse = await fetch(
      `https://open.larksuite.com/open-apis/bitable/v1/apps/${process.env.LARK_BASE_ID}/tables/${process.env.LARK_TABLE_ID}/records`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tenantAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Client Name": name,
            "Email": email,
            "Phone": phone,
            "Service Type": business || "Not Specified",
            "Project Status": (message && message.includes("CRITICAL")) ? "HOT LEAD" : "Lead",
            "Timeline": Date.now(),
            "Message": message || "No message provided",
            "Revenue": budget ? (typeof budget === 'string' ? parseInt(budget.replace(/[^0-9]/g, "")) : budget) : 0,
          },
        }),
      }
    );

    const bitableData = await bitableResponse.json();

    if (bitableData.code !== 0) {
      console.error("Lark Bitable Error:", bitableData);
      return NextResponse.json({ error: bitableData.msg }, { status: 500 });
    }

    return NextResponse.json({ success: true, record_id: bitableData.data.record.record_id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Lead Automation Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
