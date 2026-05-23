/**
 * Adyant Nexa - Social Media Automation: LinkedIn Publisher (via Ayrshare)
 *
 * Strategy:
 * 1. Ayrshare API → Direct company page post (primary)
 * 2. Fallback → Personal profile via LinkedIn API direct
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
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

const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const LINKEDIN_PERSON_URN = process.env.LINKEDIN_PERSON_URN || process.env.LINKEDIN_URN;

/**
 * Post to LinkedIn Company Page via Ayrshare API
 * Company page must be linked in Ayrshare dashboard
 */
async function postViaAyrshare(text, imageUrls = []) {
  console.log('🚀 Posting to Adyant Nexa company page via Ayrshare...');

  const body = {
    post: text,
    platforms: ['linkedin'],
  };

  if (imageUrls.length > 0) {
    body.mediaUrls = imageUrls;
  }

  const response = await fetch('https://app.ayrshare.com/api/post', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AYRSHARE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || data.status === 'error') {
    throw new Error(`Ayrshare Error: ${data.message || JSON.stringify(data)}`);
  }

  const linkedinResult = data.postIds?.find(p => p.platform === 'linkedin');
  const postId = linkedinResult?.id || data.id;

  console.log(`✅ Company page post live via Ayrshare! Post ID: ${postId}`);
  return `https://www.linkedin.com/feed/update/urn:li:share:${postId}`;
}

/**
 * Fallback: Post to personal profile via LinkedIn API directly
 */
async function postViaLinkedInDirect(text, imageUrl = '') {
  console.log('💼 Fallback: Posting to personal profile (Amit Kapoor)...');

  const payload = {
    author: LINKEDIN_PERSON_URN,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE',
        ...(imageUrl && {
          media: [{
            status: 'READY',
            description: { text: 'Adyant Nexa - AI Automation' },
            originalUrl: imageUrl,
            title: { text: 'Adyant Nexa' }
          }]
        })
      }
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
  };

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`LinkedIn Direct Error: ${JSON.stringify(data)}`);
  }

  const shareUrn = data.id;
  const postLink = `https://www.linkedin.com/feed/update/${shareUrn}`;
  console.log(`✅ Personal profile post live! ${postLink}`);
  return postLink;
}

/**
 * Main publish function
 * Tries Ayrshare (company page) first → falls back to personal profile
 */
async function publishToLinkedIn(text, imageUrl = '') {
  const imageUrls = imageUrl ? [imageUrl] : [];

  // Primary: Ayrshare (company page)
  if (AYRSHARE_API_KEY) {
    try {
      return await postViaAyrshare(text, imageUrls);
    } catch (err) {
      console.warn(`⚠️ Ayrshare failed: ${err.message}`);
      console.log('↩️ Falling back to personal profile...');
    }
  } else {
    console.warn('⚠️ AYRSHARE_API_KEY not set — using personal profile fallback');
  }

  // Fallback: LinkedIn direct (personal profile)
  if (LINKEDIN_ACCESS_TOKEN && LINKEDIN_PERSON_URN) {
    return await postViaLinkedInDirect(text, imageUrl);
  }

  console.warn('⚠️ No LinkedIn credentials configured. Skipping post.');
  return 'https://linkedin.com (Mock)';
}

module.exports = { publishToLinkedIn };
