import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const PUBLIC_HOST_URL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

/**
 * Uploads a media file buffer (image PNG/JPEG or video MP4) to public Cloud Storage.
 * Priority:
 * 1. Supabase Storage (Free 1GB tier, zero egress fees, built-in)
 * 2. Fallback to full public host URL (e.g. https://adyantnexa.com/generated-images/...)
 */
export async function uploadMediaToCloudStorage(
  buffer: Buffer,
  fileName: string,
  contentType: string = "image/png",
  bucketName: string = "social-media-assets"
): Promise<string> {
  // Option 1: Supabase Storage
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

      // Ensure bucket exists (ignore error if already exists)
      try {
        await supabase.storage.createBucket(bucketName, { public: true });
      } catch {
        // Bucket might already exist
      }

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, buffer, {
          contentType,
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          console.log(`[AgentOps Storage] Successfully uploaded to Supabase CDN: ${publicUrlData.publicUrl}`);
          return publicUrlData.publicUrl;
        }
      } else if (error) {
        console.warn(`[AgentOps Storage] Supabase storage upload warning: ${error.message}`);
      }
    } catch (err: any) {
      console.warn(`[AgentOps Storage] Supabase storage error: ${err.message}`);
    }
  }

  // Option 2: Fallback to full public host URL
  const publicUrl = `${PUBLIC_HOST_URL}/generated-images/${fileName}`;
  console.log(`[AgentOps Storage] Using host URL fallback: ${publicUrl}`);
  return publicUrl;
}
