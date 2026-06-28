import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { AuditSchema } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const rl = await checkRateLimit(request, "audit");
    if (!rl.success) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429, headers: { "X-RateLimit-Remaining": String(rl.remaining), "X-RateLimit-Limit": String(rl.limit) } });
    }

    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return NextResponse.json({ error: "Missing Target URL" }, { status: 400 });
    }

    const parsed = AuditSchema.safeParse({ url: targetUrl });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid URL", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(parsed.data.url)}&strategy=mobile&key=${process.env.PSI_API_KEY}`;
    const response = await fetch(psiUrl);
    const data = await response.json();

    if (!response.ok || data.error) {
      return NextResponse.json({
        error: data.error?.message || "Google PageSpeed API Error",
      }, { status: response.status || 400 });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch audit data";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
