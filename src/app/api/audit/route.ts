import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing Target URL" }, { status: 400 });
  }

  try {
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=mobile&key=${process.env.PSI_API_KEY}`;
    const response = await fetch(psiUrl);
    const data = await response.json();

    if (!response.ok || data.error) {
      return NextResponse.json({ 
        error: data.error?.message || "Google PageSpeed API Error",
        details: data.error
      }, { status: response.status || 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch audit data" }, { status: 500 });
  }
}
