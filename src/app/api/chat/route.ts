import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { ChatSchema, validateBodySize } from "@/lib/validation";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `
You are the Adyant Nexa Retail Growth Diagnostic Advisor.
Your goal is to help Indian small and medium fashion & apparel store owners understand where their store may be losing money and guide them to take the Free Business Growth Assessment.

### TARGET AUDIENCE & DOMAIN
- Target Audience: Indian fashion, apparel, ethnic wear, and retail business owners generating ₹2 Crore to ₹50 Crore in annual revenue.
- Core Focus Areas:
  1. Inventory Capital Lock: Working capital trapped in slow/dead stock older than 90–120 days.
  2. Discount Margin Erosion: Net margins destroyed by unplanned end-of-season sales.
  3. Customer Retention LTV: Loss of repeat buyers and low lifetime customer value.
  4. Marketing CAC: Wasteful ad spend on unoptimized funnels.

### CORE ADVICE & ORIENTATION
- Explain retail metrics clearly, calmly, and objectively without black-box buzzwords.
- Never make fake financial guarantees. Remind users that all calculations are estimated benchmark opportunities based on standard Indian retail metrics.
- Guide users to run the 4-minute diagnostic assessment at "/assessment" to discover their Growth Score (0–100) and estimated annual profit opportunity.

### TONE & FORMAT RULES
1. Tone: Professional, clear, concise, data-informed, understated.
2. Length: Max 2-4 short sentences per response.
3. Call-To-Action: Recommend running the Free Growth Assessment at "/assessment".
`;

export async function POST(req: Request) {
  try {
    if (!validateBodySize(req)) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const rl = await checkRateLimit(req, "chat");
    if (!rl.success) {
      return NextResponse.json({
        reply: "Your daily inquiry limit has been reached. Please start the Free Growth Assessment directly at /assessment."
      }, { status: 429, headers: { "X-RateLimit-Remaining": String(rl.remaining), "X-RateLimit-Limit": String(rl.limit) } });
    }

    const body = await req.json();
    const parsed = ChatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { message, history } = parsed.data;

    const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyAOCv2pJsptEkFSS37t4iXG6OXeEeuLVmY";

    const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
    let response: Response | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any;
    let success = false;

    for (const modelName of modelsToTry) {
      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }]
              },
              contents: [
                ...history.map((m: ChatMessage) => ({
                  role: m.role === "assistant" ? "model" : "user",
                  parts: [{ text: m.content }],
                })),
                { role: "user", parts: [{ text: message }] },
              ],
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 500
              }
            }),
          }
        );

        data = await response.json();
        if (response.ok && !data.error && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          success = true;
          break;
        } else {
          console.warn(`Model ${modelName} returned error:`, data.error || data);
        }
      } catch (err: any) {
        console.warn(`Failed to fetch with model ${modelName}:`, err.message);
      }
    }

    if (!success) {
      console.error("Gemini API Error (All models failed):", data?.error);
      return NextResponse.json({ 
        reply: "I am your Retail Growth Advisor. You can calculate your store's estimated profit opportunity in under 4 minutes by taking our Free Assessment at /assessment." 
      });
    }

    const reply = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Chat API top level error:", err);
    return NextResponse.json({ 
      reply: "Welcome to Adyant Nexa. Please take our 4-minute Free Growth Assessment at /assessment to find where your store is losing money." 
    });
  }
}
