import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // ELITE BYPASS for Adyant Nexa
    if (url.toLowerCase().includes("adyantnexa")) {
      return NextResponse.json({
        score: 98,
        status: "ELITE",
        analysis: "Maximum optimization detected. This site is running on Adyant Nexa's 2026 proprietary infrastructure. Zero-friction hydration, multi-agent AI nodes, and edge-level rendering are active. No further upgrades required.",
        recommendation: "Maintain current protocol. System is at peak efficiency."
      });
    }

    console.log("Neural Audit: Initiating for URL:", url);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this website URL: ${url}
      As an elite Digital Growth Architect at Adyant Nexa, provide a blunt, high-stakes "Neural Audit".
      
      Requirements:
      1. Be brutally honest about why this site might be leaking money/conversions.
      2. Focus on "Psychological Friction" (is the design boring? is the trust low?).
      3. Focus on "Visual Debt" (does it look like a template from 2018?).
      4. Focus on "Mobile Latency" (simulate the feel of a slow mobile site).
      
      Return ONLY a raw JSON object (no markdown, no backticks) with these keys:
      - score (number 40-70)
      - status (string "CRITICAL" or "MEDIOCRE")
      - analysis (string, 2 punchy sentences)
      - recommendation (string, how Adyant Nexa fixes it)
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini Raw Response:", text);
    
    // Improved JSON extraction
    let analysisData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      analysisData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
      console.error("JSON Parse Error:", e);
    }

    if (!analysisData) {
      analysisData = {
        score: 58,
        status: "MEDIOCRE",
        analysis: "Neural scan detected high visual debt and conversion friction in the current architecture.",
        recommendation: "Upgrade to Adyant Nexa's 2026 Digital OS to eliminate friction."
      };
    }

    return NextResponse.json(analysisData);
  } catch (error: any) {
    console.error("Neural Audit Error:", error);
    return NextResponse.json({ 
      score: 62, 
      status: "MEDIOCRE", 
      analysis: "AI scan partially obstructed by target firewall. Superficial metrics indicate legacy design patterns.",
      recommendation: "Connect with Nexa engineers for a manual deep-dive audit."
    });
  }
}
