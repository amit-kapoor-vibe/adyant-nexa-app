import fs from "fs";
import path from "path";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

export const PLATFORM_SIZES = {
  square:   { width: 1024, height: 1024, label: "Facebook/LinkedIn Square (1:1)", format: "1:1" },
  portrait: { width: 768,  height: 960,  label: "Instagram Feed Portrait (4:5)", format: "3:4" }, // Nearest supported by Gemini
  reel:     { width: 768,  height: 1344, label: "Instagram Reels Vertical (9:16)", format: "9:16" },
} as const;

export type ImageFormat = keyof typeof PLATFORM_SIZES;

export function buildBrandPrompt(topic: string, format: ImageFormat = "square"): string {
  const compositionMap = {
    square: "centered square composition, equal visual weight on all sides",
    portrait: "vertical portrait composition, strong top element with space below for caption",
    reel: "vertical full-screen composition, bold central element, cinematic aspect ratio",
  };

  return `Professional tech startup social media graphic about "${topic}". 
Dark void black background (#020202), electric cyan blue (#00F2FF) glowing accents and light streaks, 
platinum white typography elements, futuristic minimalist design, 
${compositionMap[format]}, 
neural network or circuit board subtle background pattern, 
premium glassmorphism card elements, no text, no logos, 
high quality 4K render, sharp details, dramatic lighting`;
}

export async function generateImage(prompt: string, format: ImageFormat = "square", seed?: number): Promise<Buffer> {
  const sizeConfig = PLATFORM_SIZES[format] || PLATFORM_SIZES.square;
  const aspectRatio = sizeConfig.format;

  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not defined in environment variables.");
  }

  try {
    console.log(`[AgentOps] Calling Google Imagen 4 for format: ${format}...`);
    const body = {
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: aspectRatio,
        outputMimeType: "image/png"
      }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${GOOGLE_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok || !data.predictions?.[0]?.bytesBase64Encoded) {
      throw new Error(data.error?.message || `Google Imagen API Error: ${JSON.stringify(data)}`);
    }

    return Buffer.from(data.predictions[0].bytesBase64Encoded, "base64");
  } catch (googleError: any) {
    console.warn(`[AgentOps] Google Imagen failed: ${googleError.message}. Triggering fallback to NVIDIA FLUX.1...`);

    if (NVIDIA_API_KEY) {
      try {
        const body = {
          prompt: prompt,
          width: sizeConfig.width,
          height: sizeConfig.height,
          seed: seed ?? Math.floor(Math.random() * 999999)
        };

        const response = await fetch("https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${NVIDIA_API_KEY}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(body)
        });

        const data = await response.json();
        if (!response.ok || !data.artifacts?.[0]?.base64) {
          throw new Error(data.error?.message || `NVIDIA API Error: ${JSON.stringify(data)}`);
        }

        return Buffer.from(data.artifacts[0].base64, "base64");
      } catch (nvidiaError: any) {
        console.error("[AgentOps] NVIDIA FLUX.1 fallback failed:", nvidiaError.message);
        throw nvidiaError;
      }
    } else {
      throw googleError;
    }
  }
}

import { uploadMediaToCloudStorage } from "./storage";

export async function generateAndSaveAllSizes(topic: string, filename: string): Promise<Record<ImageFormat, string>> {
  const outputDir = path.join(process.cwd(), "public", "generated-images");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results: Record<string, string> = {};

  for (const format of Object.keys(PLATFORM_SIZES) as ImageFormat[]) {
    try {
      const prompt = buildBrandPrompt(topic, format);
      const imageBuffer = await generateImage(prompt, format);
      const fileNameWithExt = `${filename}-${format}.png`;
      const filePath = path.join(outputDir, fileNameWithExt);
      fs.writeFileSync(filePath, imageBuffer);
      
      // Upload to public Cloud Storage (Supabase CDN / Public URL fallback)
      const cloudUrl = await uploadMediaToCloudStorage(imageBuffer, fileNameWithExt, "image/png");
      results[format] = cloudUrl;
      console.log(`[AgentOps] Saved ${format} graphic to: ${filePath} -> Public URL: ${cloudUrl}`);
    } catch (err: any) {
      console.error(`[AgentOps] Failed to generate ${format} image: ${err.message}`);
      results[format] = `/generated-images/${filename}-${format}.png`;
    }
  }

  return results as Record<ImageFormat, string>;
}
