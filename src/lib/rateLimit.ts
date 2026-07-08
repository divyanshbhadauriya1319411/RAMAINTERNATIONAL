/**
 * Simple in-memory rate limiter helper for serverless Next.js routes.
 * Prevents brute force and API spamming.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const activeLimitCache = new Map<string, RateLimitRecord>();

export function checkRateLimit(ip: string, limit: number = 30, windowMs: number = 60000): { isBlocked: boolean; remaining: number } {
  const now = Date.now();
  const record = activeLimitCache.get(ip);

  if (!record) {
    activeLimitCache.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { isBlocked: false, remaining: limit - 1 };
  }

  if (now > record.resetTime) {
    // Reset window
    record.count = 1;
    record.resetTime = now + windowMs;
    return { isBlocked: false, remaining: limit - 1 };
  }

  record.count += 1;

  if (record.count > limit) {
    return { isBlocked: true, remaining: 0 };
  }

  return { isBlocked: false, remaining: limit - record.count };
}

// Clean up expired entries hourly to save memory
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of activeLimitCache.entries()) {
      if (now > value.resetTime) {
        activeLimitCache.delete(key);
      }
    }
  }, 3600000);
}
