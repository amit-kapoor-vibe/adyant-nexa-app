import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || "";
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";

let redis: Redis | null = null;
let chatRateLimit: Ratelimit | null = null;
let leadsRateLimit: Ratelimit | null = null;
let auditRateLimit: Ratelimit | null = null;
let assessmentRateLimit: Ratelimit | null = null;
let defaultRateLimit: Ratelimit | null = null;

if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
  });

  chatRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "24 h"),
    prefix: "adyant-nexa:chat",
  });

  leadsRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "24 h"),
    prefix: "adyant-nexa:leads",
  });

  auditRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    prefix: "adyant-nexa:audit",
  });

  assessmentRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    prefix: "adyant-nexa:assessment",
  });

  defaultRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 h"),
    prefix: "adyant-nexa:default",
  });
}

export function getIpFromRequest(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

export async function checkRateLimit(
  req: Request,
  type: "chat" | "leads" | "audit" | "assessment" | "default" = "default"
): Promise<{ success: boolean; remaining: number; limit: number }> {
  if (!redis) {
    return { success: true, remaining: 100, limit: 100 };
  }

  const ip = getIpFromRequest(req);

  let limiter: Ratelimit | null;
  switch (type) {
    case "chat":
      limiter = chatRateLimit;
      break;
    case "leads":
      limiter = leadsRateLimit;
      break;
    case "audit":
      limiter = auditRateLimit;
      break;
    case "assessment":
      limiter = assessmentRateLimit;
      break;
    default:
      limiter = defaultRateLimit;
  }

  if (!limiter) {
    return { success: true, remaining: 100, limit: 100 };
  }

  const { success, remaining, limit } = await limiter.limit(ip);
  return { success, remaining, limit };
}
