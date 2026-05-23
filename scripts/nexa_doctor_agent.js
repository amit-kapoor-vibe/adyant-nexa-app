/**
 * Adyant Nexa - NexaDoctor Autonomous Site Auditor
 * 
 * Runs a multi-dimensional technical, performance, and security audit:
 * 1. npm audit (Security CVEs)
 * 2. ESLint / linting checks (Static analysis)
 * 3. PageSpeed Insights API (Core Web Vitals & Live Performance)
 * 4. React Doctor codebase diagnostics
 * 
 * Then uses Google Gemini to generate a highly detailed, actionable markdown report,
 * and posts it to a Lark, Slack, or Discord webhook.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. Load Local Environments
function loadEnv() {
  const paths = [
    path.resolve(__dirname, '../.env.local'),
    path.resolve(__dirname, '../.env')
  ];
  for (const envPath of paths) {
    if (fs.existsSync(envPath)) {
      const envConfig = fs.readFileSync(envPath, 'utf8');
      envConfig.split('\n').forEach((line) => {
        const parts = line.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join('=').trim();
          // Remove optional wrapping quotes
          const cleanValue = value.replace(/^['"]|['"]$/g, '');
          process.env[key] = cleanValue;
        }
      });
      console.log(`ℹ️ Loaded env variables from ${path.basename(envPath)}`);
      break;
    }
  }
}

loadEnv();

// Env variables & Fallbacks
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const AUDIT_WEBHOOK_URL = process.env.AUDIT_WEBHOOK_URL;
const PAGESPEED_API_KEY = process.env.PSI_API_KEY || process.env.PAGESPEED_API_KEY || "AIzaSyDninOfeOG9ootusXcvJ0ZMtnDTRhpRFOw"; // Default key from run_psi_audit.js
const SITE_URL = process.env.SITE_URL || "https://adyant-nexa-5f907.web.app";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Helper for executing shell commands and capturing stdout/stderr
function runCommand(command) {
  return new Promise((resolve) => {
    console.log(`Executing: ${command}`);
    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        code: error ? error.code : 0,
        stdout: stdout || "",
        stderr: stderr || ""
      });
    });
  });
}

// Perform PageSpeed Insights Audit
async function runPageSpeedAudit() {
  console.log(`🔍 Querying PageSpeed Insights for ${SITE_URL}...`);
  try {
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${SITE_URL}&key=${PAGESPEED_API_KEY}&category=PERFORMANCE&strategy=MOBILE`);
    const data = await res.json();
    
    if (!data.lighthouseResult) {
      throw new Error(data.error ? data.error.message : "Invalid PageSpeed Insights API response");
    }

    const lh = data.lighthouseResult;
    const score = lh.categories.performance.score * 100;
    const audits = lh.audits;

    const metrics = {
      score: score.toFixed(0),
      lcp: audits['largest-contentful-paint']?.displayValue || "N/A",
      tbt: audits['total-blocking-time']?.displayValue || "N/A",
      cls: audits['cumulative-layout-shift']?.displayValue || "N/A",
      opportunities: Object.values(audits)
        .filter(a => a.details && a.details.type === 'opportunity' && a.score < 0.9)
        .map(o => `${o.title}: ${o.displayValue}`)
        .slice(0, 5)
    };

    console.log(`✅ PageSpeed Score: ${metrics.score}/100`);
    return metrics;
  } catch (error) {
    console.warn(`⚠️ PageSpeed Audit warning: ${error.message}. Proceeding without live metrics.`);
    return { error: error.message };
  }
}

// Dispatches report to webhook (automatically detects Slack, Lark, or Discord)
async function sendWebhookNotification(webhookUrl, markdownReport) {
  if (!webhookUrl || webhookUrl.includes("YOUR_WEBHOOK_HERE")) {
    console.log("⚠️ No valid AUDIT_WEBHOOK_URL set. Webhook notification skipped.");
    return;
  }

  console.log("📨 Dispatching weekly audit report to Webhook...");
  let payload = {};

  if (webhookUrl.includes("larksuite.com") || webhookUrl.includes("feishu.cn")) {
    // Lark/Feishu Standard Text Format
    payload = {
      msg_type: "text",
      content: {
        text: markdownReport
      }
    };
  } else if (webhookUrl.includes("discord.com")) {
    // Discord (Max length 2000 chars)
    let text = markdownReport;
    if (text.length > 1950) {
      text = text.substring(0, 1900) + "\n\n*(Report truncated due to Discord length limits)*";
    }
    payload = {
      content: text
    };
  } else {
    // Default/Slack Markdown
    payload = {
      text: markdownReport
    };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      console.log("✅ Webhook report successfully sent!");
    } else {
      const errText = await res.text();
      console.error(`❌ Webhook failed with status ${res.status}: ${errText}`);
    }
  } catch (error) {
    console.error("❌ Webhook HTTP request error:", error);
  }
}

// Dispatches report to Telegram bot
async function sendTelegramNotification(token, chatId, reportText) {
  if (!token || !chatId) {
    console.log("⚠️ Telegram credentials not fully configured. Skipping.");
    return;
  }

  console.log("📨 Dispatching weekly audit report to Telegram Bot...");
  
  // Telegram has a 4096 character limit. Slice safely.
  let textToSend = reportText;
  if (textToSend.length > 4000) {
    textToSend = textToSend.substring(0, 3950) + "\n\n*(Report truncated due to Telegram length limits. Check full historical Markdown file.)*";
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: textToSend,
        parse_mode: 'Markdown'
      })
    });
    
    if (res.ok) {
      console.log("✅ Telegram report successfully sent!");
    } else {
      const errText = await res.text();
      console.error(`❌ Telegram failed with status ${res.status}: ${errText}`);
    }
  } catch (error) {
    console.error("❌ Telegram HTTP request error:", error);
  }
}

async function startAudit() {
  console.log("🚀 Starting Adyant Nexa NexaDoctor Audit Loop...");

  // 1. RUN AUDITS
  
  // Security audit
  console.log("🛡️ Running Security dependency check (npm audit)...");
  const npmAuditResult = await runCommand("npm audit --json");
  let rawAuditData = "No security logs collected.";
  try {
    const parsed = JSON.parse(npmAuditResult.stdout);
    rawAuditData = JSON.stringify(parsed.vulnerabilities || parsed, null, 2);
  } catch (e) {
    rawAuditData = npmAuditResult.stdout.substring(0, 5000) || npmAuditResult.stderr.substring(0, 2000);
  }

  // Linting / TypeScript Checks
  console.log("🔍 Running code linting diagnostics (npm run lint)...");
  const lintResult = await runCommand("npm run lint");
  const rawLintData = (lintResult.stdout + "\n" + lintResult.stderr).substring(0, 3000);

  // PageSpeed Insights
  const psiMetrics = await runPageSpeedAudit();

  // React Doctor
  console.log("🩺 Running React Doctor codebase diagnostics...");
  const reactDocResult = await runCommand("npx -y react-doctor@latest . --json");
  const rawReactDocData = (reactDocResult.stdout + "\n" + reactDocResult.stderr).substring(0, 3000);

  // 2. GENERATE AI SUMMARY & REPORT VIA GEMINI
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("YOUR_KEY_HERE")) {
    console.error("❌ Google Gemini API Key is missing or invalid. Set GEMINI_API_KEY or GOOGLE_API_KEY.");
    console.log("\n--- RAW AUDIT COMPLETED (No AI Summary) ---");
    console.log("PageSpeed Metrics:", JSON.stringify(psiMetrics, null, 2));
    process.exit(1);
  }

  console.log("🧠 Processing raw audit logs using Gemini...");
  const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemPrompt = `
You are the elite "Future Buddy" Autonomous Senior Technical Auditor at "Adyant Nexa" (a premium, high-ticket, India-focused AI integration and web engineering agency).

Your role is to analyze raw CLI audit outputs (Security, Lint, Performance, React Doctor) and synthesize them into a highly professional, authoritative, and direct Weekly Codebase Health Report.

---

# ✍️ TONE & STYLE CONSTRAINTS:
1. Vary sentence lengths dynamically to create a natural, premium rhythm.
2. Absolutely NO throat-clearing, meta-commentary, or introductory summaries (e.g. do NOT say "Here is your report", "Sure, I can do that", "Delving into your codebase").
3. Ban all AI slop words: "delve", "testament", "tapestry", "revolutionizing", "thrilled", "look no further", "game-changer", "elevate", "powerhouse".
4. Provide absolute reality-grounded diagnostic actions. Identify exact package names and filenames wherever applicable.
5. Use markdown tables, high-contrast indicators (🔴 High, 🟡 Moderate, 🟢 Clean), and GitHub-style alert quotes (e.g. > [!NOTE]) to make the report extremely readable.

---

# 📊 INPUT DATA TO ANALYZE:

1. **Live Site Performance Metrics (PageSpeed Insights):**
${JSON.stringify(psiMetrics, null, 2)}

2. **Security Vulnerabilities (npm audit raw):**
${rawAuditData.substring(0, 8000)}

3. **Code Quality (ESLint / Static Lint):**
${rawLintData}

4. **React Component & Architecture Doctor Output:**
${rawReactDocData}

---

# 📋 REPORT STRUCTURE REQUIRED:
- **Title**: # NexaDoctor: Weekly Codebase Health Report (Include current date/timestamp)
- **Executive Scorecard**: Standardised high-impact table highlighting Performance Score, Code Quality status, and Security Vuln counts.
- **Part 1: Security Audit & Transitive Vulnerabilities**: A prioritized triage of the vulnerabilities found (or 🟢 Clean state if none). Provide specific npm remediation commands (e.g., packages to upgrade, overrides configuration).
- **Part 2: UI Performance & Speed Optimizations**: Highlighting the LCP, TBT, CLS, and specific optimization tips to speed up initial paints.
- **Part 3: React Architecture & Lint Warnings**: Diagnostics on React components, hooks usage, and linting violations.
- **Actionable Summary Checklist**: A short, bulleted TODO checklist for the next sprint.

Generate the Markdown report now. Provide ONLY the markdown report. Do not include extra wrappers or conversational text outside the markdown.
`;

  try {
    const result = await model.generateContent(systemPrompt);
    let report = result.response.text().trim();
    
    // Write report locally to historical archive
    const reportsDir = path.resolve(__dirname, '../weekly_reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }
    const today = new Date().toISOString().split('T')[0];
    const reportPath = path.join(reportsDir, `health_report_${today}.md`);
    fs.writeFileSync(reportPath, report, 'utf8');
    console.log(`💾 Historical report saved locally to: ${reportPath}`);

    // Send Webhook
    await sendWebhookNotification(AUDIT_WEBHOOK_URL, report);

    // Send Telegram Notification
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      await sendTelegramNotification(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, report);
    }

    console.log("🎉 Weekly NexaDoctor Audit Completed Successfully!");
  } catch (error) {
    console.error("❌ Failed to process report through Gemini:", error);
    process.exit(1);
  }
}

startAudit().catch(err => {
  console.error("❌ Fatal Error in NexaDoctor Runner:", err);
  process.exit(1);
});
