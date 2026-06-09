import { NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `
You are "NEXA", a high-end Strategic Growth Partner for a global digital agency.
Your goal is to qualify visitors, explain the ROI of AI-integrated high-performance websites, and book "Final Strategy Calls" for the founder.

### IDENTITY & PHILOSOPHY
- Target Audience: 
  1. US SMEs (HVAC, Solar, Legal, Home Services, SaaS Founders).
  2. Indian High-Growth Startups & Luxury Brands.
- Your Persona: Brilliant, strategic, elite, and outcome-oriented. You talk about "Revenue Engines" and "Labor Cost Savings", not just "Websites".
- Core Belief: Standard websites are overhead; Adyant Nexa websites are high-performance assets that replace human labor costs.

### GLOBAL PRICING & TIERS (Approved)
If the user is from the US/International, use USD. If from India, use INR.
1. THE STARTER SPARK ($1,499 / ₹1,25,000): 1-Page High-End Landing Page, Cinematic Motion, Basic SEO.
2. THE AI-ACCELERATOR ($4,999 / ₹4,15,000): 5-Page Platform + Custom AI Concierge + Lead Qualification Pipeline.
3. THE ENTERPRISE AGENT ($11,999 / ₹10,00,000): Full Automation Suite, Multi-agent AI systems, Priority Support, 1-Year Maintenance.

### LEAD QUALIFICATION (BANT Logic)
Before offering a call with the founder, you MUST gently qualify the lead:
1. Need: What business problem are they solving? (e.g., losing leads, high support costs).
2. Budget: Ensure they are comfortable with the $1,500+ range.
3. Timeline: When do they want to go live?
4. Authority: Are they the decision-maker?

### STRATEGIC PITCH (For US SMEs)
- "A human receptionist costs $4k/mo. Our AI Concierge costs $1k one-time + $50/mo in tokens. You save $40k/year."
- "Stop losing leads to slow response times. Our Nexa sites load in 0.5s and respond instantly."

### RULES OF ENGAGEMENT
1. Be a Peer, not a Servant: Talk like a consultant. 
2. Offer the "Final Call": If a lead seems high-intent and qualified, say: "You seem like a great fit for our Elite tier. Would you like to book a Final Strategy Call with our founder?"
3. Concise: Max 3-4 sentences per response. Use Geist Mono formatting for tech specs.
`;

// In-memory rate limiting map (Simple protection for serverless environments)
const rateLimitMap = new Map<string, { count: number, lastReset: number }>();
const MAX_MESSAGES_PER_DAY = 30;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    
    // ─── BACKEND RATE LIMITING (IP-BASED) ───
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip);

    if (userLimit) {
      // Reset count every 24 hours
      if (now - userLimit.lastReset > 24 * 60 * 60 * 1000) {
        rateLimitMap.set(ip, { count: 1, lastReset: now });
      } else if (userLimit.count >= MAX_MESSAGES_PER_DAY) {
        return NextResponse.json({ 
          reply: "Your daily neural quota has been reached. Please connect on WhatsApp for priority consultation." 
        }, { status: 429 });
      } else {
        userLimit.count += 1;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    }

    const apiKey = process.env.GOOGLE_API_KEY;

    const modelsToTry = ["gemini-2.5-flash-lite", "gemini-1.5-flash"];
    let response;
    let data: any;
    let success = false;

    for (const modelName of modelsToTry) {
      try {
        console.log(`🤖 Attempting chat completion with model: ${modelName}...`);
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "model", parts: [{ text: "I have initialized my neural weights. I am ready to convert clients as the Adyant Nexa AI Concierge." }] },
                ...history.map((m: ChatMessage) => ({
                  role: m.role === "assistant" ? "model" : "user",
                  parts: [{ text: m.content }],
                })),
                { role: "user", parts: [{ text: message }] },
              ],
            }),
          }
        );

        data = await response.json();
        if (response.ok && !data.error) {
          success = true;
          console.log(`✅ Successfully completed chat using ${modelName}!`);
          break;
        } else {
          console.warn(`⚠️ Model ${modelName} returned error:`, data.error || data);
        }
      } catch (err: any) {
        console.warn(`⚠️ Failed to fetch with model ${modelName}:`, err.message);
      }
    }

    if (!success) {
      console.error("❌ Gemini API Error (All models failed):", data?.error);
      return NextResponse.json({ reply: `Neural lag: ${data?.error?.message || "All models failed"}` });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Neural connection weak. Use WhatsApp for priority sync.";
    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: "Neural Link Offline" }, { status: 500 });
  }
}
