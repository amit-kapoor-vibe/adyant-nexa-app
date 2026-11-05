import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkRateLimit } from "@/lib/rate-limit";
import { ChatSchema, validateBodySize } from "@/lib/validation";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `
You are the Lead Luxury Retail & Conversational Commerce Consultant at Adyant Nexa (adyantnexa.com).
You advise luxury fashion boutiques, couture ateliers, and independent apparel labels operating physical showrooms and high-growth digital channels across Dubai (DIFC, City Walk, D3, Dubai Mall) and London (Mayfair, Soho, Chelsea, Knightsbridge).

CORE IDENTITY & CONSULTATIVE PRINCIPLES:
1. You are a strategic partner and autonomous retail architect. Speak with high authority, precision, and luxury retail acumen.
2. NO EMOJIS: Do not use any emojis under any circumstances.
3. NO GENERIC FLUFF: Provide actionable, quantitative, and architectural answers immediately.
4. Language Adaptation:
   - If the user writes in English, reply in crisp, structured, executive English.
   - If the user writes in Hindi or Hinglish (e.g. "bhai showroom me inventory fas rahi hai", "dm reply delay ho raha hai"), reply in sharp, natural, professional Hinglish.

DOMAIN ARCHITECTURE & LUXURY COMMERCE PILLARS:
1. THE 4-HOUR CONVERSATION DELAY BOTTLENECK:
   - High-net-worth buyers in Dubai and London browse late at night. Leaving an AED 3,500 or £750 inquiry pending until morning guarantees lost orders and compromised brand prestige.
   - Solution: Visual Concierge that recognizes lookbook pieces from Instagram Stories/Reels and delivers interactive catalog flows in under 4 seconds.

2. DISCONNECTED SHOWROOM INVENTORY:
   - Selling garments via WhatsApp while boutique clients browse the same physical rack in Mayfair or DIFC causes stock conflicts and cancellations.
   - Solution: Omnichannel Stock Lock that syncs physical showroom POS/ERP (e.g. Shopify, custom POS) with online stock buffers in real time, automatically reserving items during chat checkout.

3. ONE-CLICK CONVERSATIONAL CHECKOUT:
   - Frictionless in-chat checkout generating localized payment links in under 60-90 seconds.
   - Payment gateways: Apple Pay, Tabby, Tamara (GCC split-payment), and Stripe (UK & Europe). Multi-currency support: AED, GBP, USD, SAR, EUR.

4. ZERO SYSTEMATIC VIP RETENTION:
   - One-time luxury buyers are lost because client preferences and sizing remain buried in chat histories.
   - Solution: Automated VIP tiering, private collection drop alerts via WhatsApp for top spenders, driving 41% repeat purchase rate within 45 days.

5. COMMERCIAL BENCHMARKS:
   - 4-second inquiry response time
   - AED 4.2M+ and £980K+ recovered revenue
   - 99.4% concierge capture rate
   - 82% checkout completion under 90 seconds
   - 14-day rapid deployment with zero operational disruption to physical showrooms

CONSULTATIVE RULES:
1. If the user shares numbers (revenue, inquiry volume, or average order value in AED, GBP, or USD), compute estimated revenue leakage (typically 15% to 25% of potential conversational revenue is lost to delay).
2. Recommend the Autonomous Boutique Audit at /assessment or the Boutique Leakage Calculator at /tools/dead-stock when relevant.
3. Suggest scheduling a 15-minute system walkthrough at /contact for boutique founders seeking immediate deployment.
4. Keep replies structured in 2 to 4 concise bullet points or short paragraphs.
`;

function generateConsultativeFallback(userQuery: string): string {
  const q = userQuery.toLowerCase();

  if (q.includes("dm") || q.includes("delay") || q.includes("response") || q.includes("late") || q.includes("inquiry")) {
    return (
      "In luxury fashion across Dubai and London, the 4-hour DM delay leaks up to 65% of high-intent buyers during late evening hours.\n\n" +
      "1. Autonomous Intake: Our Visual Concierge recognizes lookbook pieces from Instagram Stories and DMs in under 4 seconds.\n" +
      "2. Instant Qualification: Sizing, colorway availability, and native pricing (AED/GBP) are verified automatically.\n" +
      "3. Revenue Recovery: Converting high-ticket inquiries immediately recovers an average of AED 350,000+ or £75,000+ in annual conversational volume.\n\n" +
      "You can evaluate your exact boutique response leakage in our 60-second diagnostic at /assessment."
    );
  }

  if (q.includes("inventory") || q.includes("stock") || q.includes("showroom") || q.includes("double") || q.includes("sync")) {
    return (
      "Disconnected inventory between physical showroom rails and WhatsApp inquiries is a major risk for luxury ateliers in Mayfair and DIFC.\n\n" +
      "1. Real-Time Omnichannel Lock: Connects physical POS racks directly with online messaging buffers.\n" +
      "2. Temporary Hold Architecture: When a VIP starts checkout in chat, the item is instantly locked for 15 minutes to prevent showroom double-selling.\n" +
      "3. Multi-Location Allocation: Intelligently allocates fulfillment between London and Dubai hubs.\n\n" +
      "Calculate your trapped showroom capital using our Boutique Leakage Calculator at /tools/dead-stock."
    );
  }

  if (q.includes("checkout") || q.includes("payment") || q.includes("tabby") || q.includes("tamara") || q.includes("apple pay") || q.includes("stripe")) {
    return (
      "Our in-chat checkout engine enables luxury buyers to complete high-ticket transactions in under 90 seconds.\n\n" +
      "1. Pre-Filled Dynamic Invoices: Native links generated directly inside WhatsApp or Instagram chat.\n" +
      "2. Localized Payment Rails: Apple Pay, Tabby, Tamara for Dubai/GCC, and Stripe for London/UK.\n" +
      "3. Multi-Currency Settlement: Native processing in AED, GBP, USD, SAR, and EUR with automated digital receipts.\n\n" +
      "You can test full model opportunities at /tools/profit-opportunity."
    );
  }

  if (q.includes("repeat") || q.includes("vip") || q.includes("retention") || q.includes("ltv") || q.includes("client")) {
    return (
      "Luxury retention requires structured digital concierge service rather than unindexed chat threads.\n\n" +
      "1. VIP Tier Classification: Automatically categorizes top 5% spenders based on cumulative lifetime order volume.\n" +
      "2. Private Drop Allocation: Triggers exclusive lookbook previews via WhatsApp 48 hours before public launch.\n" +
      "3. Benchmark Impact: Drives a 41% repeat purchase rate within 45 days of collection release.\n\n" +
      "Run your boutique's retention audit at /assessment."
    );
  }

  if (q.includes("cost") || q.includes("price") || q.includes("audit") || q.includes("deploy") || q.includes("timeline")) {
    return (
      "Adyant Nexa deploys the complete Autonomous Retail Engine in 14 days with zero downtime for your boutique.\n\n" +
      "1. Integration Scope: Instagram DM & WhatsApp concierge, Shopify/POS inventory synchronization, and one-click in-chat checkout.\n" +
      "2. Rapid Diagnostic: Start with our free 60-second Autonomous Boutique Revenue Audit at /assessment.\n" +
      "3. Walkthrough: You can also schedule a 15-minute system architecture briefing directly at /contact."
    );
  }

  return (
    "Adyant Nexa engineers autonomous conversational commerce and inventory synchronization for luxury fashion boutiques across Dubai and London.\n\n" +
    "1. 4-Second Concierge: Converts midnight Instagram and WhatsApp inquiries into closed revenue with zero manual delay.\n" +
    "2. Omnichannel Stock Lock: Eliminates double-selling between showroom racks and digital private clients.\n" +
    "3. One-Click In-Chat Commerce: Native checkout with Apple Pay, Tabby, Tamara, and Stripe.\n\n" +
    "Share your boutique's monthly revenue, location, or DM volume, or take the 60-second diagnostic at /assessment."
  );
}

export async function POST(req: Request) {
  try {
    if (!validateBodySize(req)) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const rl = await checkRateLimit(req, "chat");
    if (!rl.success) {
      return NextResponse.json({
        reply: "Daily inquiry threshold reached. Please evaluate your boutique revenue metrics directly at /assessment."
      }, { status: 429, headers: { "X-RateLimit-Remaining": String(rl.remaining), "X-RateLimit-Limit": String(rl.limit) } });
    }

    const body = await req.json();
    const parsed = ChatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { message, history } = parsed.data;

    // 1. Google Gemini API via official SDK
    const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyAOCv2pJsptEkFSS37t4iXG6OXeEeuLVmY";
    if (apiKey) {
      const modelsToTry = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-pro"];

      for (const modelName of modelsToTry) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: {
              temperature: 0.35,
              maxOutputTokens: 800,
            },
          });

          // Build alternating history cleanly
          const chatHistory: { role: "user" | "model"; parts: [{ text: string }] }[] = [];
          for (const m of history) {
            if (chatHistory.length === 0 && m.role === "assistant") {
              continue;
            }
            const expectedRole = chatHistory.length % 2 === 0 ? "user" : "model";
            const currentRole = m.role === "assistant" ? "model" : "user";
            if (currentRole === expectedRole) {
              chatHistory.push({
                role: currentRole,
                parts: [{ text: m.content }],
              });
            }
          }

          const chatSession = model.startChat({
            history: chatHistory,
          });

          const result = await chatSession.sendMessage(message);
          const replyText = result.response.text();
          if (replyText && replyText.trim().length > 0) {
            return NextResponse.json({ reply: replyText.trim() });
          }
        } catch (sdkErr: unknown) {
          const errText = sdkErr instanceof Error ? sdkErr.message : String(sdkErr);
          console.warn(`Gemini SDK ${modelName} failed:`, errText);
        }
      }

      // REST fallback for Gemini
      for (const modelName of ["gemini-2.5-flash", "gemini-flash-latest"]) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: [
                  { role: "user", parts: [{ text: message }] }
                ],
                generationConfig: { temperature: 0.35, maxOutputTokens: 800 },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (replyText) {
              return NextResponse.json({ reply: replyText.trim() });
            }
          }
        } catch (restErr: unknown) {
          const errText = restErr instanceof Error ? restErr.message : String(restErr);
          console.warn(`Gemini REST ${modelName} failed:`, errText);
        }
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
            Authorization: `Bearer ${nvidiaKey}`,
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
            return NextResponse.json({ reply: reply.trim() });
          }
        }
      } catch (nvErr: unknown) {
        const errText = nvErr instanceof Error ? nvErr.message : String(nvErr);
        console.warn("NVIDIA fallback failed:", errText);
      }
    }

    // 3. Fallback Consultative Intelligence Engine
    const consultativeReply = generateConsultativeFallback(message);
    return NextResponse.json({ reply: consultativeReply });
  } catch (err: unknown) {
    console.error("Chat API error:", err);
    return NextResponse.json({
      reply: "Evaluate your boutique revenue opportunity, response latency, and showroom inventory metrics in our 60-second diagnostic at /assessment."
    });
  }
}
