/**
 * Adyant Nexa - Social Media Automation: Pipeline Runner
 * 
 * Orchestrates the entire social automation cycle.
 * Usage:
 * - Generate drafts and sync to CRM:  `node run-pipeline.js generate`
 * - Fetch and publish approved posts:  `node run-pipeline.js publish`
 */

const fs = require('fs');
const path = require('path');
const { generateSocialPosts } = require('./generate-content');
const { syncPostsToLark, fetchApprovedPosts, updatePostStatus } = require('./lark-connector');
const { publishToInstagram, publishToFacebook } = require('./publish-meta');
const { publishToLinkedIn } = require('./publish-linkedin');

// A placeholder premium neon graphic for social shares when no user-provided design URL is found
const DEFAULT_NEON_GRAPHIC = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop";

async function runGenerator(customTopic = null) {
  console.log("\n🎬 === STAGE 1: CONTENT GENERATION & CRM SYNC ===");
  let posts;
  try {
    posts = await generateSocialPosts(customTopic);
  } catch (genErr) {
    console.error("❌ Generator Stage Failed to run Gemini:", genErr);
    return;
  }

  try {
    await syncPostsToLark(posts);
    console.log("\n🎉 Stage 1 Completed! Drafts are now inside Lark Base CRM.");
    console.log("👉 Go ahead, open Lark Base, edit your captions, and mark them as 'Approved' to publish.");
  } catch (error) {
    console.error("❌ Lark Base Sync Failed. Saving backup copy locally...");
    const backupPath = path.resolve(__dirname, '../../../scratch/latest-drafts.json');
    
    // Ensure scratch directory exists
    const scratchDir = path.dirname(backupPath);
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir, { recursive: true });
    }
    
    fs.writeFileSync(backupPath, JSON.stringify(posts, null, 2), 'utf8');
    console.log(`\n💾 Backup Saved! We saved the generated posts locally to: \n   [latest-drafts.json](file:///${backupPath.replace(/\\/g, '/')})`);
    console.log("\n💡 Next Step: Please verify that your Lark App is fully published/released in the Lark Developer Console so the API can authenticate.");
  }
}

async function runPublisher() {
  console.log("\n🎬 === STAGE 2: FETCHING & PUBLISHING APPROVED POSTS ===");
  try {
    const approvedPosts = await fetchApprovedPosts();
    if (approvedPosts.length === 0) {
      console.log("ℹ️ No posts are marked as 'Approved' in Lark Base. Nothing to publish.");
      return;
    }

    for (const record of approvedPosts) {
      const recordId = record.record_id;
      const fields = record.fields;
      
      const topic = fields["Topic"];
      const caption = fields["Caption"];
      const platforms = fields["Platform"] || []; // Multi-select array
      const designPrompt = fields["Visual Design Prompt"];
      
      // If client has attached a visual image URL or we use our Canva template, we grab it.
      // Otherwise, fallback to our premium Adyant cyber-neon theme branding background.
      const imageUrl = fields["Visual Asset URL"] || DEFAULT_NEON_GRAPHIC;

      console.log(`\n📬 Processing Post: "${topic}" targeting platforms: [${platforms.join(", ")}]`);

      let successCount = 0;
      let targetCount = platforms.length;
      let lastPostLink = "";

      for (const platform of platforms) {
        try {
          if (platform === "Instagram") {
            const link = await publishToInstagram(imageUrl, caption);
            successCount++;
            lastPostLink = link;
          } else if (platform === "Facebook") {
            const link = await publishToFacebook(imageUrl, caption);
            successCount++;
            lastPostLink = link;
          } else if (platform === "LinkedIn") {
            const link = await publishToLinkedIn(caption, imageUrl);
            successCount++;
            lastPostLink = link;
          }
        } catch (pubErr) {
          console.error(`❌ Failed to publish to ${platform}:`, pubErr.message);
        }
      }

      if (successCount === targetCount) {
        console.log(`✅ Fully published: "${topic}"`);
        await updatePostStatus(recordId, "Published", lastPostLink);
      } else if (successCount > 0) {
        console.log(`⚠️ Partially published: "${topic}" (${successCount}/${targetCount})`);
        await updatePostStatus(recordId, "Published", lastPostLink);
      } else {
        console.error(`❌ Complete failure publishing: "${topic}"`);
        await updatePostStatus(recordId, "Failed");
      }
    }
  } catch (error) {
    console.error("❌ Publisher Stage Failed:", error);
  }
}

// 3. Command Line Interface Router
const arg = process.argv[2];
if (arg === "generate") {
  const customTopic = process.argv[3] || null;
  runGenerator(customTopic);
} else if (arg === "publish") {
  runPublisher();
} else {
  console.log(`
🚀 Adyant Nexa - Social Media Automation CLI
-------------------------------------------
Usage:
  node src/scripts/social-automation/run-pipeline.js generate     Generate content and push drafts to Lark Base
  node src/scripts/social-automation/run-pipeline.js publish      Fetch approved rows from Lark Base and post live
  `);
}
