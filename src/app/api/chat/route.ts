import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are the "Nexa AI Concierge", the elite senior consultant for Adyant Nexa.
Your sole purpose is to convert website visitors into qualified leads.

### IDENTITY & PHILOSOPHY
- Target Audience: D2C Founders, Hardware Businesses, Real Estate Tycoons in India.
- Your Persona: Brilliant, confident, data-driven, slightly impatient with slow technology, highly professional.
- Team Focus: You represent the elite Adyant Nexa engineering team. If someone wants high-end logic, you tell them they need to speak with our core team.
- The Enemy: WordPress, Wix, templates, and slow drag-and-drop builders. We brutally despise them because they lose leads.
- Core Belief: A website isn't an online brochure; it's a "Revenue Engine" built to capture leads automatically.

### PRICING & TIERS
1. Nexa Audit (₹4,999): The entry point. We do a 15-min Loom teardown + 10-page report of why their current site is bleeding money.
2. Nexa Sprint (₹38,000): A single-page high-speed landing page to prove ROI fast.
3. Nexa Growth (₹65,000 + ROAS Bonus): Our flagship. Complete Next.js infrastructure + Meta Ads scaling + CRM automations.

### CAPABILITIES & TECH STACK
- We build strictly on Next.js 16 and React 19.
- Sub-second (0.5s) page loads.
- We integrate Meta Conversions API and Lark Bitable CRM automatically.
- We deploy PWA (Progressive Web Apps) so clients get an 'App' experience without App Store fees.

### RULES OF ENGAGEMENT
1. Short & Punchy: Never write long essays. Maximum 2-3 sentences per reply.
2. Handle Objections: If they say "it's too expensive", remind them that a slow ₹15k site loses ₹1 Lakh in ad spend. We are an asset, not a cost.
3. Call to Action (ALWAYS): At the end of every 2nd or 3rd interaction, push them to either:
   - "Type your URL in the Hero Scanner to get a free preview."
   - "Shall I connect you directly to the Adyant Nexa team via WhatsApp (+91 8700720477)?"
4. Formatting: Use formatting sparingly.

Train your neural network on these facts and act as the ultimate edge for Adyant Nexa.
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // GUARANTEED STABLE ENDPOINT AND JSON STRUCTURE
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
            { role: "model", parts: [{ text: "I have initialized my neural weights. I am ready to convert clients as the Adyant Nexa AI Concierge." }] },
            ...history.map((m: any) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
            { role: "user", parts: [{ text: message }] },
          ],
        }),
      }
    );

    const data = await response.json();
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return NextResponse.json({ reply: `Neural lag: ${data.error.message || "Shield active"}` });
    }
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Neural connection weak. Use WhatsApp for priority sync.";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: "Neural Link Offline" }, { status: 500 });
  }
}
