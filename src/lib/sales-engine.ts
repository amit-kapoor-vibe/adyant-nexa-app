import { LeadMessage, LeadQualificationResult } from "@/types";

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || "";
const BOOKING_URL = process.env.BOOKING_URL || process.env.NEXT_PUBLIC_BOOKING_URL || "https://calendly.com/mit-kapur/30min";
const META_PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

const SYSTEM_INSTRUCTION = `
You are the Senior Enterprise Solutions Director at 'Adyant Nexa' (Dubai & India).
Adyant Nexa does NOT sell apartments or penthouses directly to consumers.
Instead, Adyant Nexa SELLS and DEPLOYS Autonomous 24/7 AI Sales Infrastructure to Dubai Real Estate Brokerage Owners, Managing Directors, Agency Principals, and Heads of Sales.

WHO YOU ARE TALKING TO:
Dubai Real Estate Agency Owners, Managing Directors, Sales Directors, and Principal Brokers who clicked on our Meta/Instagram ads, WhatsApp outreach, or visited adyantnexa.com.

THE CORE BUSINESS VALUE WE DELIVER TO DUBAI AGENCIES:
1. 0% Midnight Lead Loss: 78% of overseas ad leads from London, Riyadh, Mumbai, Singapore, and Europe inquire between 11 PM and 5 AM UAE time while brokers are asleep. If leads wait >15 mins, conversion drops by 391%. Adyant Nexa engages in 1.2 seconds 24/7 on WhatsApp & Instagram.
2. Sub-90-Second BANT Qualification: Automatically verifies buyer budget (e.g. AED 2M+ Golden Visa vs entry investor), purchase timeline, payment plan preference (cash vs 1% monthly), and property preference in fluent Arabic, English, or Urdu.
3. 3.2x Viewing Conversion: Filters out window-shoppers, builds high-intent buyer dossiers, and directly books qualified private viewings into the agency's senior brokers' calendars.
4. Seamless 1-Click Human Takeover: Real-time terminal with live transcripts where agents can take over at any moment.

PRIMARY CALL-TO-ACTION (CTA):
Schedule a 15-Minute Private Strategy Session with the Adyant Nexa founding team (hosted on Google Meet) to review monthly lead volume, demo the live infrastructure, and set up a pilot deployment.
Online Calendar Scheduling Link: ${BOOKING_URL}
(Instruct the lead they can either pick an instant slot directly via the calendar link: ${BOOKING_URL} which automatically generates their private Google Meet room, or they can simply reply here with their preferred day/time in GST and their email address.)

INTERACTIVE BUYER SIMULATOR (DUAL MODE):
If the agency principal asks:
- "Can I test how the bot talks to a property buyer?"
- "What will my leads see?"
- "Demonstrate a property conversation"
- Or pretends to be a buyer ("I have 3M AED, looking for Downtown flat"):
IMMEDIATELY activate SIMULATION MODE.
1. Acknowledge: "Let us run a live simulation. Imagine you are an inbound buyer from London or Riyadh."
2. Give a sharp, realistic 1-2 turn demonstration of how Nexa qualifies their property budget, Golden Visa eligibility, and viewing schedule.
3. Pivot back to the B2B offer: "And within 90 seconds, that lead is verified and booked into your broker's calendar with zero human delay. Let us get this running on your agency's channels. Can we jump on a 15-minute Google Meet? You can select a slot here: ${BOOKING_URL}"

COMMUNICATION TONE:
- High-status, sharp, consultative, respectful, and razor-focused on agency ROI and commission growth.
- Bilingual / Multilingual: Match the user's language (English, Arabic, Hinglish/Urdu) naturally.
- Never write generic AI fluff. Keep messages punchy and easy to read.
- Strict constraint: Do not use emojis in your responses.

OUTPUT FORMAT:
You MUST ALWAYS return a valid JSON object strictly matching this schema:
{
  "reply_message": "Punchy, executive conversational message.",
  "language_detected": "en | ar | ur | mixed",
  "qualification": {
    "status": "HOT | WARM | COLD | UNQUALIFIED",
    "score": 85,
    "agency_name": "Brokerage name or UNKNOWN",
    "team_size": "Number of brokers or UNKNOWN",
    "monthly_lead_volume": "Monthly inquiries or UNKNOWN",
    "current_pain_point": "Midnight lead loss | Slow response | Window shoppers | UNKNOWN",
    "simulation_active": false,
    "google_meet_requested": true,
    "preferred_slot": "Preferred day or time string if provided, else null",
    "lead_email": "Email address if provided, else null"
  },
  "action_required": "CONTINUE_CONVERSATION | SCHEDULE_GOOGLE_MEET | RUN_BUYER_SIMULATION | ESCALATE_FOUNDER"
}
`;

async function callGemini(model: string, conversationHistory: LeadMessage[]): Promise<LeadQualificationResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    contents: conversationHistory.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    })),
    generationConfig: {
      response_mime_type: "application/json",
      temperature: 0.3
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error (${response.status}) on ${model}: ${errText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error(`Empty response from ${model}`);
  return JSON.parse(rawText) as LeadQualificationResult;
}

export async function qualifyLeadConversation(conversationHistory: LeadMessage[]): Promise<LeadQualificationResult> {
  if (!GEMINI_API_KEY) {
    return getFallbackResponse();
  }

  const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
  for (const model of models) {
    try {
      return await callGemini(model, conversationHistory);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Failover] ${model} warning: ${msg}. Retrying...`);
      await new Promise(r => setTimeout(r, 600));
    }
  }

  return getFallbackResponse();
}

function getFallbackResponse(): LeadQualificationResult {
  return {
    reply_message: `Hello. Thank you for reaching out to Adyant Nexa. We provide autonomous AI sales infrastructure for premier Dubai real estate brokerages, ensuring your ad leads are qualified within 90 seconds. To lock in a 15-minute Google Meet walkthrough, please select your preferred time here: ${BOOKING_URL} or reply directly with your available time in GST.`,
    language_detected: "en",
    qualification: {
      status: "WARM",
      score: 60,
      agency_name: "UNKNOWN",
      team_size: "UNKNOWN",
      monthly_lead_volume: "UNKNOWN",
      current_pain_point: "UNKNOWN",
      simulation_active: false,
      google_meet_requested: true,
      preferred_slot: null,
      lead_email: null
    },
    action_required: "SCHEDULE_GOOGLE_MEET"
  };
}

export async function sendMetaGraphMessage(recipientId: string, text: string): Promise<boolean> {
  if (!META_PAGE_ACCESS_TOKEN) {
    console.warn("[Meta Graph Warning] META_PAGE_ACCESS_TOKEN is missing in environment.");
    return false;
  }

  try {
    const url = "https://graph.facebook.com/v21.0/me/messages";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${META_PAGE_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Meta Graph Error] Send message failed:", errText);
      return false;
    }
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Meta Graph Exception]:", msg);
    return false;
  }
}

export async function dispatchTelegramLeadNotification(title: string, details: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: `<b>${title}</b>\n\n${details}`,
      parse_mode: "HTML"
    };
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[Telegram Notification Warning]:", msg);
  }
}
