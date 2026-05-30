import { Redis } from '@upstash/redis';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = UPSTASH_URL && UPSTASH_TOKEN ? new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN }) : null;

const inMemoryMap = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(key: string, maxRequests: number, windowMs: number): Promise<{ allowed: boolean; retryAfter?: number }> {
  if (redis) {
    try {
      const windowKey = Math.floor(Date.now() / windowMs);
      const redisKey = `ratelimit:${key}:${windowKey}`;
      const count = await redis.incr(redisKey);
      if (count === 1) await redis.expire(redisKey, Math.ceil(windowMs / 1000));
      if (count > maxRequests) {
        const ttl = await redis.ttl(redisKey);
        return { allowed: false, retryAfter: ttl > 0 ? ttl : 1 };
      }
      return { allowed: true };
    } catch {
      return { allowed: true };
    }
  }

  const now = Date.now();
  const entry = inMemoryMap.get(key);

  if (!entry || now > entry.resetAt) {
    inMemoryMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true };
}
