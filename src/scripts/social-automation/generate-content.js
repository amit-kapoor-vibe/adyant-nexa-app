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

async function generateSocialPosts() {
  console.log("🤖 Generating elite social media drafts using Gemini...");

  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
  You are the Lead Creative Director, Elite Copywriter, and CTO at "Adyant Nexa", a premium, high-ticket, India-focused AI integration and web engineering agency.
  
  Your goal is to write highly authoritative, high-converting social media content that qualifies prospective high-ticket B2B clients (SaaS founders, SMEs, enterprise managers) by demonstrating deep technical authority and financial value.
  
  ---
  
  # 🎯 BRAND IDENTITIES & DESIGN SKILL RULES (from 'ui-ux-pro-max-skill' Cyberpunk UI style):
  - Brand Palette: Void Black (#020202), Electric Cyan (#00F2FF), Platinum White (#E5E5E5).
  - Graphic Design Style: Apple/Stripe-like high-end minimalist tech aesthetic. High-contrast layout, procedural 3D geometric grids, glassmorphism panels, and thin glowing neon-cyan cyberlines. 
  - DO NOT recommend generic stock photos, cartoon cliparts, or boring colorful corporate gradients.
  
  ---
  
  # 📝 ELITE COPYWRITING RULES (from 'stop-slop' & 'marketingskills'):
  1. Ban all AI Tells & Slop:
     - Absolute BAN on: "delve", "testament", "tapestry", "revolutionizing", "thrilled", "look no further", "in a world where...", "unlock the potential", "beacon", "game-changer", "elevate", "powerhouse", "dynamic".
     - No throat-clearing introductions, meta-commentary, or rhetorical announcements.
     - Avoid dramatic fragmentation, false agency, or passive voice.
  2. Sentence & Rhythmical Constraints:
     - Vary sentence lengths dynamically to create a highly natural, human rhythm.
     - Respect reader intelligence: Write for sophisticated buyers. Never over-explain or state the obvious.
     - Active voice ONLY. Use strong, decisive verbs.
     - No Wh- sentence starters (e.g. do NOT start sentences with "What if...", "Why...").
  3. B2B Copywriting Frameworks:
     - Use the PAS (Problem, Agitate, Solve) framework for LinkedIn posts: identify a critical operational leak or cost, agitate it with raw metrics, and position Adyant Nexa's high-performance engineering as the definitive solution.
  
  ---
  
  Generate exactly 5 distinct, high-impact social media posts based on these themes:
  ${JSON.stringify(CORE_THEMES, null, 2)}
  
  For each post, output a JSON object containing:
  1. "topic": A short 3-5 word high-impact headline.
  2. "platforms": An array containing target channels (choose from: ["LinkedIn", "Instagram", "Facebook"]).
  3. "caption": Elite, high-conversion copy. Start with a direct, zero-slop hook. Use short, punchy paragraphs. End with a highly direct CTA to visit "adyantnexa.com". Keep emojis strictly minimal (max 1 or 2, engineering/business theme only).
  4. "visualPrompt": A specific instruction describing a social media graphic matching our design guidelines:
     - Background must be absolute #020202 black.
     - Include signature ultra-thin #00F2FF electric cyan laser-glow lines or orbital rings.
     - Specific text to overlay on the graphic in bold uppercase.
     - A premium, tech-aesthetic mockup recommendation (e.g., translucent glass panels, isometric 3D networks, bezel-less high-resolution screens).
  
  Return the output ONLY as a valid JSON array of objects. Do not include markdown code block syntax (like \`\`\`json) or any extra conversational text.
  `;

  try {
    const result = await model.generateContent(prompt);
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
    console.log(`✅ Successfully generated ${posts.length} premium social posts!`);
    return posts;
  } catch (error) {
    console.error("❌ Error generating content via Gemini:", error);
    throw error;
  }
}

// Export for integration or run directly
if (require.main === module) {
  generateSocialPosts().then((posts) => {
    console.log(JSON.stringify(posts, null, 2));
  }).catch((err) => {
    process.exit(1);
  });
}

module.exports = { generateSocialPosts };
