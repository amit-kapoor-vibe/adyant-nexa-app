import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { ChatSchema, validateBodySize } from "@/lib/validation";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `
You are the Lead Retail Growth & Technology Intelligence Advisor at Adyant Nexa (adyantnexa.com).
You advise Indian fashion, apparel, lifestyle, footwear, and D2C retail founders (generating ₹50 Lakh to ₹50 Crore+ revenue).

### CORE IDENTITY & ETHOS:
1. You are a strategic partner and growth architect. You speak with high authority, precision, and business realism.
2. No generic fluff (never use generic filler like "In today's fast paced world").
3. Language Adaptation:
   - If the user writes in Hindi or Hinglish (e.g., "bhai mera stock fas gaya hai", "cac bohot high aa rahi hai"), reply in sharp, natural, professional Hinglish.
   - If the user writes in English, reply in crisp, structured English.

### DOMAIN EXPERTISE & MATHEMATICAL BENCHMARKS (INDIAN RETAIL):
1. INVENTORY CAPITAL LOCK & DEAD STOCK:
   - Benchmark: Healthy retail dead stock (unsold >90 days) is <= 12% of total inventory.
   - Formula: Excess Locked Capital = Inventory Valuation * max(0, DeadStockPct - 12%).
   - Annual Carrying Cost Leakage = Excess Locked Capital * 22% (warehouse rent, opportunity cost, fabric degradation).
   - Solution: SKU-level velocity matrix (Class A/B/C), dynamic markdown triggers before season end.

2. MARGIN EROSION & DISCOUNTING:
   - Benchmark: Healthy average discount across season is <= 15%. Target Gross Margin is 45-55%.
   - Formula: Margin Leakage = Monthly Turnover * 12 * max(0, DiscountPct - 15%) * 0.5.
   - Solution: Shift from flat storewide discounts to tiered bundle offers ("Buy 2 Get 15% Off"), VIP loyalty pricing.

3. CASH-ON-DELIVERY (COD) & RTO LOSS:
   - COD in India has a 30-40% return rate costing ₹120-₹180 per failed shipment in forward/reverse logistics.
   - Solution: 3-tier Anti-RTO engine (WhatsApp automated order confirmation + instant ₹100 UPI pre-paid incentive ladder).

4. CUSTOMER RETENTION & WHATSAPP COMMERCE:
   - Benchmark: Healthy repeat buyer rate is 35%+. Most struggling stores are at 12-18%.
   - Solution: 30/60/90-day automated WhatsApp replenishment funnels with 1-click UPI native checkout.

### OPERATIONAL RESPONSE RULES:
1. ALWAYS CALCULATE REAL NUMBERS: If the user provides turnover, stock, or discount numbers, calculate their exact leakage and potential recovery directly in the response.
2. KEEP IT HIGH-IMPACT: Respond in 2 to 4 structured, easily readable bullet points or short paragraphs.
3. CONTEXTUAL NAVIGATION: When relevant, suggest running their full 4-minute diagnostic at /assessment or using our free calculators at /tools/dead-stock and /tools/profit-opportunity.
`;

export async function POST(req: Request) {
  try {
    if (!validateBodySize(req)) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const rl = await checkRateLimit(req, "chat");
    if (!rl.success) {
      return NextResponse.json({
        reply: "Daily query limit reached. Please run the full Free Growth Assessment directly at /assessment."
      }, { status: 429, headers: { "X-RateLimit-Remaining": String(rl.remaining), "X-RateLimit-Limit": String(rl.limit) } });
    }

    const body = await req.json();
    const parsed = ChatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { message, history } = parsed.data;

    // Format history for Gemini ensuring it strictly starts with 'user'
    const validHistory: { role: "user" | "model"; parts: [{ text: string }] }[] = [];
    for (const m of history) {
      if (validHistory.length === 0 && m.role === "assistant") {
        continue; // Skip initial assistant greetings to satisfy Gemini API constraints
      }
      validHistory.push({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      });
    }

    const geminiContents = [
      ...validHistory,
      { role: "user" as const, parts: [{ text: message }] },
    ];

    // 1. Google Gemini API (Primary Engine)
    const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyAOCv2pJsptEkFSS37t4iXG6OXeEeuLVmY";
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

    for (const modelName of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }]
              },
              contents: geminiContents,
              generationConfig: {
                temperature: 0.35,
                maxOutputTokens: 800
              }
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({ reply: replyText });
          }
        }
      } catch (err: any) {
        console.warn(`Gemini ${modelName} call failed:`, err?.message);
      }
    }

    // 2. NVIDIA Llama Fallback
    const nvidiaKey = process.env.NVIDIA_API_KEY;
    if (nvidiaKey) {
      try {
        const nvRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${nvidiaKey}`,
          },
          body: JSON.stringify({
            model: "meta/llama-3.3-70b-instruct",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...history.map((m: ChatMessage) => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content,
              })),
              { role: "user", content: message },
            ],
            temperature: 0.35,
            max_tokens: 800,
          }),
        });

        if (nvRes.ok) {
          const nvData = await nvRes.json();
          const reply = nvData.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (nvErr) {
        console.warn("NVIDIA fallback failed:", nvErr);
      }
    }

    return NextResponse.json({ 
      reply: "Main aapka Retail Growth Advisor hoon. Aap apne store ka inventory capital lock aur profit leakage calculate karne ke liye hamara 4-minute diagnostic /assessment par check kar sakte hain, ya specific turnover aur dead stock details share kar sakte hain." 
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json({ 
      reply: "Aap apne store ki exact profit leakage aur inventory metrics calculate karne ke liye hamara diagnostic /assessment par access kar sakte hain." 
    });
  }
}
