/**
 * Adyant Nexa - NVIDIA FLUX.1 Image Generator
 * Platform-specific dimensions:
 *   Facebook / LinkedIn : 1080x1080 (Square)
 *   Instagram Feed      : 1080x1350 (Portrait 4:5)
 *   Instagram Reels     : 1080x1920 (Vertical 9:16)
 */

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../../../.env.local');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        process.env[trimmed.substring(0, eqIndex).trim()] = trimmed.substring(eqIndex + 1).trim();
      }
    });
  }
}

loadEnv();

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

// Platform dimension configs
// NVIDIA FLUX.1 supported values: 768, 832, 896, 960, 1024, 1088, 1152, 1216, 1280, 1344
const PLATFORM_SIZES = {
  square:   { width: 1024, height: 1024, label: 'Facebook/LinkedIn Square (1:1)' },
  portrait: { width: 768,  height: 960,  label: 'Instagram Feed Portrait (4:5)' },  // 768/960 = 0.8 = 4:5 ✅
  reel:     { width: 768,  height: 1344, label: 'Instagram Reels Vertical (9:16)' }, // closest to 9:16 ✅
};

/**
 * Generate image using NVIDIA FLUX.1-dev
 * @param {string} prompt - Image generation prompt
 * @param {'square'|'portrait'|'reel'} format - Platform format
 * @param {number} seed - Optional seed for reproducibility
 * @returns {Buffer} PNG image buffer
 */
async function generateImage(prompt, format = 'square', seed = null) {
  if (!NVIDIA_API_KEY) {
    throw new Error('NVIDIA_API_KEY not set in .env.local');
  }

  const size = PLATFORM_SIZES[format];
  if (!size) throw new Error(`Invalid format: ${format}. Use: square, portrait, reel`);

  console.log(`🎨 Generating ${size.label} image...`);
  console.log(`📐 Dimensions: ${size.width}x${size.height}`);
  console.log(`💬 Prompt: ${prompt.substring(0, 80)}...`);

  const body = {
    prompt,
    width: size.width,
    height: size.height,
    seed: seed ?? Math.floor(Math.random() * 999999),
  };

  const response = await fetch('https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || !data.artifacts?.[0]?.base64) {
    throw new Error(`NVIDIA API Error: ${JSON.stringify(data)}`);
  }

  const imageBuffer = Buffer.from(data.artifacts[0].base64, 'base64');
  console.log(`✅ Image generated! Size: ${(imageBuffer.length / 1024).toFixed(1)} KB`);
  return imageBuffer;
}

/**
 * Generate all platform sizes for a single topic
 * @param {string} prompt - Image prompt
 * @param {string} outputDir - Directory to save images
 * @param {string} filename - Base filename (without extension)
 * @returns {object} Paths to all generated images
 */
async function generateAllSizes(prompt, outputDir = '.', filename = 'post') {
  fs.mkdirSync(outputDir, { recursive: true });

  const results = {};

  for (const [format, size] of Object.entries(PLATFORM_SIZES)) {
    try {
      const imageBuffer = await generateImage(prompt, format);
      const filePath = path.join(outputDir, `${filename}-${format}.png`);
      fs.writeFileSync(filePath, imageBuffer);
      results[format] = {
        path: filePath,
        label: size.label,
        width: size.width,
        height: size.height,
      };
      console.log(`💾 Saved: ${filePath}`);
    } catch (err) {
      console.error(`❌ Failed to generate ${format}: ${err.message}`);
      results[format] = { error: err.message };
    }
  }

  return results;
}

/**
 * Build a brand-consistent prompt for Adyant Nexa
 * @param {string} topic - Post topic (e.g. "AI Automation", "Self-Healing Code")
 * @param {string} format - Platform format
 */
function buildBrandPrompt(topic, format = 'square') {
  const compositionMap = {
    square: 'centered square composition, equal visual weight on all sides',
    portrait: 'vertical portrait composition, strong top element with space below for caption',
    reel: 'vertical full-screen composition, bold central element, cinematic aspect ratio',
  };

  return `Professional tech startup social media graphic about "${topic}". 
Dark void black background (#020202), electric cyan blue (#00F2FF) glowing accents and light streaks, 
platinum white typography elements, futuristic minimalist design, 
${compositionMap[format]}, 
neural network or circuit board subtle background pattern, 
premium glassmorphism card elements, no text, no logos, 
high quality 4K render, sharp details, dramatic lighting`;
}

module.exports = { generateImage, generateAllSizes, buildBrandPrompt, PLATFORM_SIZES };
