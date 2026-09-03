import type { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number; // e.g. 60 * 1000 for 1 min
  maxRequests: number;
  message?: string;
}

interface ClientRecord {
  count: number;
  resetTime: number;
}

const clientMaps = new Map<string, Map<string, ClientRecord>>();

export function rateLimiter(namespace: string, options: RateLimitOptions) {
  if (!clientMaps.has(namespace)) {
    clientMaps.set(namespace, new Map<string, ClientRecord>());
  }
  const clients = clientMaps.get(namespace)!;

  // Periodically clean up expired entries every 5 minutes to prevent memory leak
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of clients.entries()) {
      if (now > val.resetTime) {
        clients.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
    const key = ip;
    const now = Date.now();

    const record = clients.get(key);

    if (!record || now > record.resetTime) {
      clients.set(key, { count: 1, resetTime: now + options.windowMs });
      return next();
    }

    if (record.count >= options.maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.set("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        success: false,
        error: options.message || `Too many requests. Please try again in ${retryAfterSeconds} seconds.`
      });
    }

    record.count++;
    next();
  };
}
