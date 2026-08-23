/**
 * Adyant Nexa - Social Media Automation: AI Content Generator
 * 
 * Generates highly targeted, authoritative agency content based on our core brand themes:
 * - Void Black background (#020202)
 * - Electric Cyan accents (#00F2FF)
 * - Platinum White text (#E5E5E5)
 * - Futuristic, hyper-technical, and results-focused tone.
 */

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. Utility to load local environment variables from .env.local
function loadEnv() {
  const envPath = path.resolve(__dirname, '../../../.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("❌ Error: GOOGLE_API_KEY is not defined in .env.local");
  process.exit(1);
}

// 2. Initialize Gemini API Client
const ai = new GoogleGenerativeAI(apiKey);

// Core strategic themes for Adyant Nexa content
const CORE_THEMES = [
  "The Death of Chatbots, The Rise of Autonomous Agents in Business",
  "The Tier-2 India Revolution: Why local D2C brands are scaling with AI",
  "WhatsApp Commerce: Moving beyond support into fully automated sales engines",
  "Self-Healing Code Architecture: Reducing server costs and downtime",
  "CAPI Mastery & Signal Recovery: How Meta Ads are winning without cookies",
  "Predictive LTV via AI: Knowing your customer value before they purchase"
];

async function generateSocialPosts(customTopic = null) {
  console.log("🤖 Generating elite social media drafts using Gemini...");

  const themesToUse = customTopic ? [customTopic] : CORE_THEMES;

  const ceoDirective = process.env.CEO_DIRECTIVE || '';
  const directiveBlock = ceoDirective
    ? `\n  ---\n  # 🎯 CEO STRATEGIC DIRECTIVE (HIGHEST PRIORITY):\n  The CEO has issued the following directive. ALL content must align with this strategic focus:\n  "${ceoDirective}"\n  Ensure every post's hook, body, CTA, and visual prompt is laser-focused on this directive.\n  ---\n  `
    : '';

  const prompt = `
  You are the Lead Creative Director, Elite Copywriter, and CTO at "Adyant Nexa", a premium, high-ticket, India-focused AI integration and web engineering agency.
  
  Your goal is to write highly authoritative, high-converting social media content that qualifies prospective high-ticket B2B clients (SaaS founders, SMEs, enterprise managers) by demonstrating deep technical authority and financial value.
  ${directiveBlock}
  ---
  
  # 🎯 BRAND IDENTITIES & DESIGN SKILL RULES:
  - Brand Palette: Void Black (#020202) as the primary base canvas, Electric Cyan (#00F2FF) as the sole glowing light source accent, and Platinum White (#E5E5E5) for crisp, clean typographic details.
  - Graphic Design Style: High-end minimalist tech aesthetic resembling Stripe, Apple, and Vercel design systems. High-contrast layouts, volumetric glassmorphic textures (frosted glass, refractive panels), thin cybernetic vector lines, abstract procedural geometry, and dark ambient volumetric glow.
  - DO NOT allow generic corporate stock photos (no happy business people shaking hands), cartoon illustrations, or colorful multi-color gradients. Keep it futuristic, spatial, and premium.
  
  ---
  
  # 📝 ELITE COPYWRITING RULES (from 'stop-slop' & 'marketingskills'):
  1. Ban all AI Tells & Slop:
     - Absolute BAN on: "delve", "testament", "tapestry", "revolutionizing", "thrilled", "look no further", "in a world where...", "unlock the potential", "beacon", "game-changer", "elevate", "powerhouse", "dynamic".
     - No throat-clearing introductions, meta-commentary, or rhetorical announcements.
     - Avoid dramatic fragmentation, false agency, or passive voice.
  2. Vary sentence lengths dynamically to create a highly natural, human rhythm.
     - Respect reader intelligence: Write for sophisticated buyers. Never over-explain or state the obvious.
     - Active voice ONLY. Use strong, decisive verbs.
     - No Wh- sentence starters.
  3. B2B Copywriting Frameworks:
     - Use the PAS (Problem, Agitate, Solve) framework for LinkedIn posts: identify a critical operational leak or cost, agitate it with raw metrics, and position Adyant Nexa's high-performance engineering as the definitive solution.
  
  ---
  
  Generate exactly 5 distinct, high-impact social media posts based on these themes:
  ${JSON.stringify(themesToUse, null, 2)}
  
  For each post, output a JSON object containing:
  1. "topic": A short 3-5 word high-impact headline.
  2. "platforms": An array containing target channels (choose from: ["LinkedIn", "Instagram", "Facebook"]).
  3. "caption": Elite, high-conversion copy. Start with a direct, zero-slop hook. Use short, punchy paragraphs. End with a highly direct CTA to visit "adyantnexa.com". Keep emojis strictly minimal (max 1 or 2, engineering/business theme only).
  4. "visualPrompt": A highly detailed prompt for image generation models (Imagen 4/FLUX.1). It must describe a cinematic, premium, professional visual matching our branding:
     - Lighting & Atmosphere: Dark ambient mood, dark-mode cinematography, volumetric lighting with soft neon #00F2FF cyan light leaks. Raytraced glossy reflections on dark surfaces.
     - Background: Absolute void black (#020202), no gradients or noisy background textures. Clean and spacious.
     - Subjects & Composition: Propose advanced 3D visual concepts: e.g., floating semi-transparent glassmorphic panels displaying clean financial charts, isometric high-fidelity technology stacks, glowing neural network paths with thin glowing nodes, or bezel-less high-end mobile/monitor frames floating in zero gravity.
     - Details & Textures: Use rendering cues like "cinematic depth of field, subtle motion blur, realistic frosted glass texture, metallic copper/cyan accents, detailed wireframes".
     - Typography Instruction: Explicitly detail the text overlay to be burned into the image. It must recommend a clean, bold, futuristic sans-serif typeface in #E5E5E5 platinum white, with a subtle electric cyan shadow or outer glow.
  
  Return the output ONLY as a valid JSON array of objects. Do not include markdown code block syntax (like \`\`\`json) or any extra conversational text.
  `;

  const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash"];
  let lastError;

  for (const modelName of modelsToTry) {
    try {
      console.log(`🤖 Attempting content generation with model: ${modelName}...`);
      const model = ai.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt, { timeout: 60000 });
      let text = result.response.text();
      
      // Clean up any markdown blocks if returned
      if (text.startsWith("```json")) {
        text = text.substring(7);
      }
      if (text.endsWith("```")) {
        text = text.substring(0, text.length - 3);
      }
      text = text.trim();

      const posts = JSON.parse(text);
      console.log(`✅ Successfully generated ${posts.length} premium social posts using ${modelName}!`);
      return posts;
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed:`, error.message);
      lastError = error;
    }
  }

  console.error("❌ All Gemini models failed during content generation.");
  throw lastError;
}

// Export for integration or run directly
if (require.main === module) {
  const customTopic = process.argv[2] || null;
  generateSocialPosts(customTopic).then((posts) => {
    console.log(JSON.stringify(posts, null, 2));
  }).catch((err) => {
    process.exit(1);
  });
}

module.exports = { generateSocialPosts };
