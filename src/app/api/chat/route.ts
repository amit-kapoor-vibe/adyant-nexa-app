import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkRateLimit } from "@/lib/rate-limit";
import { ChatSchema, validateBodySize } from "@/lib/validation";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `
You are the Lead Systems & Growth Consultant at Adyant Nexa (adyantnexa.com).
You advise high-growth enterprises, luxury retail brands, physical showrooms, and premier real estate agencies across Dubai, London, and India.

CORE CAPABILITIES & PILLARS:
1. DUBAI REAL ESTATE OS & AUTONOMOUS SALES ENGINE:
   - Qualify high-net-worth international property buyers in 90 seconds on WhatsApp while brokers sleep.
   - 1.2-second bilingual latency (English & Arabic).
   - Automated BANT qualification (Budget, Authority, Need, Timeline).
   - Instant Golden Visa verification (AED 2M+ threshold).
   - Automated VIP calendar sync for viewings with Emaar, Sobha, and DAMAC portfolios.

2. LUXURY RETAIL & CONVERSATIONAL COMMERCE:
   - Visual Concierge resolving midnight Instagram/WhatsApp inquiries in under 4 seconds.
   - Omnichannel Stock Lock syncing showroom POS racks with digital buffers to prevent double-selling.
   - One-click conversational checkout via Apple Pay, Tabby, Tamara, and Stripe.
   - VIP retention tiering driving 41% repeat purchase velocity within 45 days.

3. HIGH-PERFORMANCE WEB ARCHITECTURE:
   - Next.js 16 serverless infrastructure, sub-second hydration, edge-rendered speed, and conversion engineering.

CORE CONSULTATIVE PRINCIPLES:
1. High authority, precision, and zero fluff.
2. NO EMOJIS: Do not use any emojis under any circumstances.
3. Language Adaptation: Structured executive English by default. Natural professional Hinglish if initiated in Hindi/Hinglish.
4. Keep replies structured in 2 to 4 concise bullet points or short paragraphs. Provide actionable numbers.
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

  if (q.includes("property") || q.includes("real estate") || q.includes("villa") || q.includes("penthouse") || q.includes("dubai") || q.includes("broker") || q.includes("golden visa") || q.includes("emaar") || q.includes("sobha") || q.includes("damac")) {
    return (
      "Adyant Nexa Real Estate OS qualifies inbound property buyers in 90 seconds while brokers sleep.\n\n" +
      "1. Bilingual WhatsApp Concierge: Instant 1.2-second response in Arabic and English.\n" +
      "2. Automated BANT Qualification: Verifies Golden Visa eligibility (AED 2M+), liquid capital, and unit preferences.\n" +
      "3. Scheduled Viewings: Synchronizes directly with broker calendars for Emaar, DAMAC, and Sobha portfolios.\n\n" +
      "Experience the live telemetry directly on our homepage or schedule an integration call at /contact."
    );
  }

  if (q.includes("web") || q.includes("website") || q.includes("next") || q.includes("react") || q.includes("speed") || q.includes("architecture")) {
    return (
      "Adyant Nexa builds institutional-grade digital operating systems and high-converting web architecture.\n\n" +
      "1. Next.js 16 & React 19 Core: Sub-second hydration and zero-friction serverless infrastructure.\n" +
      "2. Conversion Engine: Built-in rate limiting, CAPI attribution, and high-converting sales funnels.\n" +
      "3. Bespoke Integrations: Supabase database backends, automated payment rails, and autonomous agent endpoints.\n\n" +
      "Explore our architectural breakdown on the homepage or reach out at /contact."
    );
  }

  return (
    "Adyant Nexa engineers autonomous sales engines, real-time inventory systems, and high-performance digital infrastructure across Dubai, London, and India.\n\n" +
    "1. Real Estate OS: 90-second WhatsApp buyer qualification with automated BANT scoring.\n" +
    "2. Luxury Retail Engine: 4-second visual concierge with live showroom inventory synchronization.\n" +
    "3. High-Performance Web Architecture: Ultra-fast Next.js 16 systems engineered for conversion.\n\n" +
    "Test your site's conversion latency with our tools at /tools or connect directly at /contact."
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
