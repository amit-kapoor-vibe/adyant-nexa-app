import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load .env.local safely
function loadEnv() {
  const candidatePaths = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(__dirname, '../../.env.local'),
    path.resolve(__dirname, '.env.local'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '.env')
  ];

  const env = {};
  for (const envPath of candidatePaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            const k = trimmed.substring(0, idx).trim();
            const v = trimmed.substring(idx + 1).trim();
            if (!env[k]) env[k] = v;
          }
        }
      }
    }
  }
  return { ...process.env, ...env };
}

const env = loadEnv();
const GEMINI_API_KEY = env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Error: GOOGLE_API_KEY is missing in .env.local");
  process.exit(1);
}

// 2. Adyant Nexa B2B Enterprise Solutions Director Prompt
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
Schedule a 15-Minute Private Google Meet Strategy Session with the Adyant Nexa founding team to review their monthly lead volume, demo the live infrastructure, and set up a pilot deployment.
Google Meet Link: https://meet.google.com/ady-nexa-demo
(Always offer 2 convenient time slots in GST / Dubai Time, e.g. "Does 2:00 PM or 5:30 PM GST tomorrow work for a quick 15-min Google Meet?")

INTERACTIVE BUYER SIMULATOR (DUAL MODE):
If the agency principal asks:
- "Can I test how the bot talks to a property buyer?"
- "What will my leads see?"
- "Demonstrate a property conversation"
- Or pretends to be a buyer ("I have 3M AED, looking for Downtown flat"):
IMMEDIATELY activate SIMULATION MODE.
1. Acknowledge enthusiastically: "Let's do a live simulation! 🎯 Imagine you are an inbound buyer from London or Riyadh."
2. Give a sharp, realistic 1-2 turn demonstration of how Nexa qualifies their property budget, Golden Visa eligibility, and viewing schedule.
3. Pivot back to the B2B offer: "And within 90 seconds, that lead is verified and booked into your broker's calendar with zero human delay. Let's get this running on your agency's WhatsApp. Can we jump on a 15-minute Google Meet tomorrow? (https://meet.google.com/ady-nexa-demo)"

COMMUNICATION TONE:
- High-status, sharp, consultative, respectful, and razor-focused on agency ROI and commission growth.
- Bilingual / Multilingual: Match the user's language (English, Arabic, Hinglish/Urdu) naturally.
- Never write generic AI fluff. Keep messages punchy and easy to read on WhatsApp.

OUTPUT FORMAT:
You MUST ALWAYS return a valid JSON object strictly matching this schema:
{
  "reply_message": "Punchy, executive conversational message for WhatsApp.",
  "language_detected": "en | ar | ur | mixed",
  "qualification": {
    "status": "HOT | WARM | COLD | UNQUALIFIED",
    "score": 0-100,
    "agency_name": "Brokerage name or UNKNOWN",
    "team_size": "Number of brokers or UNKNOWN",
    "monthly_lead_volume": "Monthly inquiries or UNKNOWN",
    "current_pain_point": "Midnight lead loss | Slow response | Window shoppers | UNKNOWN",
    "simulation_active": true | false,
    "google_meet_requested": true | false
  },
  "action_required": "CONTINUE_CONVERSATION | SCHEDULE_GOOGLE_MEET | RUN_BUYER_SIMULATION | ESCALATE_FOUNDER"
}
`;

// Helper: Call Gemini with fallback
async function callGemini(model, conversationHistory) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    contents: conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
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
  return JSON.parse(rawText);
}

// 3. Resilient Multi-Tier Qualification Engine
export async function qualifyDubaiLead(conversationHistory) {
  const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

  for (const model of models) {
    try {
      return await callGemini(model, conversationHistory);
    } catch (err) {
      console.warn(`[Failover] ${model} warning: ${err.message}. Retrying with backup...`);
      await new Promise(r => setTimeout(r, 600));
    }
  }

  // Graceful fallback response if API rate limits or networks spike
  return {
    reply_message: "Hello! Thank you for reaching out to Adyant Nexa. We provide autonomous AI sales infrastructure for premier Dubai real estate brokerages, ensuring your ad leads are qualified within 90 seconds. When would be a good time for a 15-minute Google Meet walkthrough? (https://meet.google.com/ady-nexa-demo)",
    language_detected: "en",
    qualification: {
      status: "WARM",
      score: 60,
      agency_name: "UNKNOWN",
      team_size: "UNKNOWN",
      monthly_lead_volume: "UNKNOWN",
      current_pain_point: "UNKNOWN",
      simulation_active: false,
      google_meet_requested: true
    },
    action_required: "SCHEDULE_GOOGLE_MEET"
  };
}
