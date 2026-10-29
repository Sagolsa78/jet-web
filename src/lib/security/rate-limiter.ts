/**
 * Bounded In-Memory Sliding-Window Rate Limiter & Abuse Prevention Guard
 *
 * Designed to prevent denial-of-service and lead spam while bounding memory consumption.
 * When scaled across multi-region serverless clusters without Redis, this provides
 * reliable per-instance defense and bounds memory to prevent container OOM.
 */

interface WindowConfig {
  windowMs: number;
  maxRequests: number;
  maxEntries: number;
}

export class BoundedRateLimiter {
  private log: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private readonly maxEntries: number;

  constructor(config: WindowConfig) {
    this.windowMs = config.windowMs;
    this.maxRequests = config.maxRequests;
    this.maxEntries = config.maxEntries;
  }

  public check(key: string): boolean {
    const now = Date.now();
    this.pruneIfNeeded();

    const timestamps = this.log.get(key) || [];
    const validTimestamps = timestamps.filter((t) => now - t < this.windowMs);

    if (validTimestamps.length >= this.maxRequests) {
      this.log.set(key, validTimestamps);
      return false;
    }

    validTimestamps.push(now);

    // Enforce hard memory bound if new key pushes map beyond capacity
    if (!this.log.has(key) && this.log.size >= this.maxEntries) {
      this.evictOldest();
    }

    this.log.set(key, validTimestamps);
    return true;
  }

  public size(): number {
    return this.log.size;
  }

  public reset(): void {
    this.log.clear();
  }

  private pruneIfNeeded(): void {
    // Perform pruning when map grows above 50% capacity
    if (this.log.size < this.maxEntries / 2) return;

    const now = Date.now();
    for (const [key, timestamps] of this.log.entries()) {
      const active = timestamps.filter((t) => now - t < this.windowMs);
      if (active.length === 0) {
        this.log.delete(key);
      } else {
        this.log.set(key, active);
      }
    }
  }

  private evictOldest(): void {
    // Evict the first key in insertion order
    const firstKey = this.log.keys().next().value;
    if (firstKey !== undefined) {
      this.log.delete(firstKey);
    }
  }
}

// 5 submissions per 10 minutes per client IP (bounded to 5,000 entries)
export const ipLimiter = new BoundedRateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 5,
  maxEntries: 5000,
});

// Max 2 leads within 2 minutes per unique phone number (bounded to 5,000 entries)
export const phoneLimiter = new BoundedRateLimiter({
  windowMs: 2 * 60 * 1000,
  maxRequests: 2,
  maxEntries: 5000,
});

export function normalizeClientIp(rawHeaderIp: string | null | undefined): string {
  if (!rawHeaderIp) return 'anonymous';
  
  // Extract client IP (leftmost entry in standard reverse proxies, or direct header)
  const candidate = rawHeaderIp.split(',')[0].trim();
  
  // Basic validation: length & allowed chars for IPv4 and IPv6
  if (candidate.length > 45 || !/^[0-9a-fA-F:.]+$/.test(candidate)) {
    return 'anonymous';
  }
  
  return candidate;
}

export function checkRateLimit(clientIp: string): boolean {
  return ipLimiter.check(clientIp);
}

export function checkPhoneThrottle(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length < 10) return true;
  return phoneLimiter.check(cleanPhone);
}

export function resetAllRateLimits(): void {
  ipLimiter.reset();
  phoneLimiter.reset();
}
