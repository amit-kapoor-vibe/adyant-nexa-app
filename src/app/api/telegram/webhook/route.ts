import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const ai = new GoogleGenerativeAI(GOOGLE_API_KEY || "");

async function sendTelegramMessage(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "Markdown"
      })
    });
  } catch (err: any) {
    console.error("[Telegram Webhook] Failed to send message:", err.message);
  }
}

export async function POST(req: Request) {
  try {
    const update = await req.json();
    const message = update.message;

    if (!message) {
      return NextResponse.json({ status: "ignored_no_message" });
    }

    const chatId = String(message.chat.id);
    if (chatId !== String(TELEGRAM_CHAT_ID)) {
      return NextResponse.json({ status: "unauthorized" }, { status: 403 });
    }

    const text = message.text?.trim() || "";

    if (text === "/start" || text === "/help") {
      await sendTelegramMessage(`*AdyantNexa Command Center*

Commands:
/status - Live system and server health
/help - View available commands

You can also send any business, brand strategy, or D2C metrics question directly to query the AI Growth Strategist.`);
    } else if (text === "/status") {
      const statusText = `*AdyantNexa System Status*

*Environment:* Production
*Lead Delivery:* Active (Telegram & Supabase)
*D2C Readiness Diagnostic:* Online
*Growth Tools Layer:* Operational`;

      await sendTelegramMessage(statusText);
    } else if (text) {
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are a Senior Consumer Growth Strategist at Adyant Nexa (Consumer Growth & Commerce). Answer this executive question concisely and directly with zero emojis: "${text}"`;
      const res = await model.generateContent(prompt);
      await sendTelegramMessage(res.response.text());
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[Telegram Webhook POST Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Telegram Webhook Active", endpoint: "/api/telegram/webhook" });
}

