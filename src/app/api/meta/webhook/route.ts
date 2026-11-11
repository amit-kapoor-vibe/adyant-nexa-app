import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { 
  qualifyLeadConversation, 
  sendMetaGraphMessage, 
  dispatchTelegramLeadNotification 
} from "@/lib/sales-engine";
import { LeadMessage, MetaWebhookPayload } from "@/types";

const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "adyant_nexa_meta_secret_2026";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const privilegedSupabase = createClient(supabaseUrl, supabaseServiceKey);

// In-memory short-term conversation memory for active sessions: senderId -> LeadMessage[]
const sessionStore = new Map<string, LeadMessage[]>();

/**
 * 1. GET: Meta Webhook Subscription Verification Handshake
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === META_VERIFY_TOKEN) {
    console.log("[Meta Webhook] Handshake verified successfully.");
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden: Verification token mismatch", { status: 403 });
}

/**
 * 2. POST: Inbound Messages from Instagram Direct & Facebook Messenger
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    if (!rawBody || rawBody.length > 500000) {
      return NextResponse.json({ error: "Payload too large or empty" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody) as MetaWebhookPayload;
    if (payload.object !== "page" && payload.object !== "instagram") {
      return NextResponse.json({ status: "IGNORED_OBJECT" }, { status: 200 });
    }

    const platform = payload.object === "instagram" ? "INSTAGRAM" : "FACEBOOK";

    for (const entry of payload.entry || []) {
      const events = entry.messaging || entry.standby || [];

      for (const event of events) {
        // Skip automated echoes sent by our own page
        if (event.message?.is_echo) continue;

        const senderId = event.sender?.id;
        const incomingText = event.message?.text || event.postback?.title;
        if (!senderId || !incomingText || !incomingText.trim()) continue;

        console.log(`[Meta Inbound] ${platform} sender: ${senderId} | "${incomingText}"`);

        // Manage session conversation history
        if (!sessionStore.has(senderId)) {
          sessionStore.set(senderId, []);
        }
        const history = sessionStore.get(senderId)!;
        const timeNow = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        history.push({ role: "user", text: incomingText, timestamp: timeNow });

        // Cap history to last 15 turns
        if (history.length > 15) {
          history.splice(0, history.length - 15);
        }

        // Run Gemini 2.5 Flash BANT Qualification
        const result = await qualifyLeadConversation(history);
        const replyText = result.reply_message;

        // Send reply directly into Instagram DM or Facebook Messenger
        const sendSuccess = await sendMetaGraphMessage(senderId, replyText);
        if (sendSuccess) {
          history.push({ role: "model", text: replyText, timestamp: timeNow });
        }

        // Notify founder via Telegram if lead shows high intent or requests Google Meet
        const q = result.qualification || {};
        if (
          result.action_required === "SCHEDULE_GOOGLE_MEET" ||
          q.google_meet_requested === true ||
          q.preferred_slot ||
          incomingText.toLowerCase().includes("meet") ||
          incomingText.toLowerCase().includes("call") ||
          incomingText.toLowerCase().includes("schedule") ||
          incomingText.toLowerCase().includes("viewing")
        ) {
          const details = [
            `<b>Platform:</b> ${platform} DIRECT MESSAGE`,
            `<b>Sender ID:</b> ${senderId}`,
            `<b>Preferred Slot:</b> ${q.preferred_slot || "Pending confirmation"}`,
            `<b>Email:</b> ${q.lead_email || "Not provided"}`,
            `<b>Agency / Investor:</b> ${q.agency_name || "N/A"}`,
            `<b>Message:</b> ${incomingText}`,
            `<b>AI Reply:</b> ${replyText}`,
            `<b>Status:</b> ${q.status || "HOT"} (${q.score || 85}/100)`,
            `<b>Booking Link:</b> https://calendly.com/mit-kapur/30min`
          ].join("\n");

          await dispatchTelegramLeadNotification(`NEW ${platform} LEAD QUALIFIED`, details);
        }

        // Persist to Supabase leads table
        if (supabaseUrl && supabaseServiceKey) {
          try {
            await privilegedSupabase.from("leads").insert([
              {
                name: `${platform} User #${senderId.slice(-4)}`,
                email: q.lead_email || `meta_${senderId}@adyantnexa.internal`,
                phone: `Meta ${platform} ID: ${senderId}`,
                business_type: `${platform} Direct Inquiry`,
                budget: q.budget_aed || "AED 2M+",
                message: `[${platform} Transcript]\nUser: ${incomingText}\nAI: ${replyText}`,
                status: q.status || "HOT"
              }
            ]);
          } catch (dbErr) {
            console.warn("[Supabase Meta Ingest Warning]:", dbErr);
          }
        }
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal error";
    console.error("[Meta Webhook Exception]:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
