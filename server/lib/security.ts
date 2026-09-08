import type { Request, Response, NextFunction } from "express";

/**
 * Lightweight HTTP Security Headers Middleware
 * Adds essential defensive headers without requiring external heavyweight packages.
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent browsers from MIME-sniffing a response away from the declared content-type
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking by specifying frame options (allows same-origin / iframe in sandbox)
  // We avoid strict DENY because AI studio runs inside preview iframes
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // Enable XSS filtering in older browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Control referrer information sent in HTTP headers
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Disable browser feature permissions that aren't used
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Hide server tech fingerprint
  res.removeHeader("X-Powered-By");

  next();
}

/**
 * Basic CORS / Origin verification middleware
 */
export function corsHeaders(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, x-api-key, X-API-KEY, mcp-session-id, x-session-id, Accept, Origin, Cache-Control"
  );
  res.setHeader("Access-Control-Expose-Headers", "Content-Type, Authorization, x-api-key, mcp-session-id, x-session-id");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
}
