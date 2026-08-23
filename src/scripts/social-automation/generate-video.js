/**
 * Adyant Nexa - Google-Powered Video Automation Engine
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../../../.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

/**
 * Generate Voiceover MP3 using Google Cloud Text-to-Speech REST API
 */
async function generateVoiceover(text, destPath) {
  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not defined in .env.local");
  }

  // Clean text of hashtags and headers
  const cleanText = text
    .replace(/\[(LINKEDIN|INSTAGRAM|FACEBOOK)\]/gi, '')
    .replace(/#\w+/g, '')
    .trim();

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`;
  const payload = {
    input: { text: cleanText.substring(0, 500) },
    voice: {
      languageCode: "en-US",
      name: "en-US-Neural2-F"
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate: 1.05
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Google TTS Error: ${data.error ? data.error.message : res.statusText}`);
  }

  if (!data.audioContent) {
    throw new Error("No audioContent returned from Google TTS API");
  }

  const audioBuffer = Buffer.from(data.audioContent, 'base64');
  fs.writeFileSync(destPath, audioBuffer);
  return destPath;
}

/**
 * Compile video using FFmpeg with voiceover audio and void black aesthetic
 */
function compileVideo(audioPath, captionText, destPath) {
  return new Promise((resolve, reject) => {
    const outputDir = path.dirname(destPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Escape text for FFmpeg filter
    const safeCaption = captionText
      .substring(0, 120)
      .replace(/[\r\n]+/g, ' ')
      .replace(/'/g, "'\\\\''")
      .replace(/:/g, '\\:');

    // Create a 1080x1920 vertical reel video with black background and cyan text
    const command = `ffmpeg -y -f lavfi -i color=c=0x020202:s=1080x1920:r=30 -i "${audioPath}" -vf "drawtext=text='${safeCaption}':fontcolor=0xE5E5E5:fontsize=42:x=(w-text_w)/2:y=(h-text_h)/2:box=1:boxcolor=0x00F2FF@0.2:boxborderw=20" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -shortest "${destPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.warn("FFmpeg execution warning/error:", error.message);
        // If FFmpeg fails, reject so calling function can handle fallback
        return reject(error);
      }
      resolve(destPath);
    });
  });
}

/**
 * Main Video Generation pipeline
 */
async function generateReel(topic, captionText, safeFilename) {
  const outputDir = path.join(__dirname, '../../../public/generated-videos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const audioPath = path.join(outputDir, `${safeFilename}.mp3`);
  const videoPath = path.join(outputDir, `${safeFilename}.mp4`);

  console.log(`Generating voiceover for topic: "${topic}"...`);
  await generateVoiceover(captionText || topic, audioPath);

  console.log(`Compiling reel video to: ${videoPath}...`);
  await compileVideo(audioPath, topic, videoPath);

  return videoPath;
}

module.exports = {
  generateVoiceover,
  compileVideo,
  generateReel
};
