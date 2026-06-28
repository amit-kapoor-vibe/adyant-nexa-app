import { z } from "zod";

export const LeadSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(254),
  phone: z.string().min(1).max(30),
  business: z.string().max(200).optional(),
  message: z.string().max(5000).optional(),
  budget: z.string().max(50).optional(),
});

export const ChatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      })
    )
    .max(50),
});

export const AuditSchema = z.object({
  url: z
    .string()
    .url()
    .max(2048)
    .refine(
      (val) => {
        try {
          const parsed = new URL(val);
          return ["http:", "https:"].includes(parsed.protocol);
        } catch {
          return false;
        }
      },
      { message: "Only HTTP/HTTPS URLs allowed" }
    ),
});

export const NeuralAuditSchema = z.object({
  url: z
    .string()
    .url()
    .max(2048)
    .refine(
      (val) => {
        try {
          const parsed = new URL(val);
          return ["http:", "https:"].includes(parsed.protocol);
        } catch {
          return false;
        }
      },
      { message: "Only HTTP/HTTPS URLs allowed" }
    ),
});

export const SocialAutomationSchema = z.object({
  action: z.enum(["generate", "publish", "regenerate-image"]),
  topic: z.string().max(200).optional(),
  filename: z.string().max(50).regex(/^[a-z0-9-]*$/, "Invalid filename").optional(),
  recordId: z.string().max(100).optional(),
  customTopic: z.string().max(200).optional(),
  directive: z.string().max(500).optional(),
});

export const MAX_BODY_SIZE = 1024 * 1024;

export function validateBodySize(req: Request): boolean {
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    return false;
  }
  return true;
}
