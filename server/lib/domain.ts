import { Request } from "express";
import { SiteSettings } from "../../src/types.js";

/**
 * Resolves the canonical base URL dynamically.
 * Priority:
 * 1. Explicit domain configured in SiteSettings (via Admin Settings)
 * 2. Explicit environment variable (CUSTOM_DOMAIN or SITE_URL)
 * 3. Dynamic HTTP request headers (x-forwarded-proto, x-forwarded-host, host)
 * 4. Fallback to standard protocol + host
 */
export function resolveBaseUrl(req?: Request, settings?: SiteSettings | null): string {
  // 1. Explicit setting saved in database
  if (settings?.custom_domain && typeof settings.custom_domain === "string" && settings.custom_domain.trim()) {
    return normalizeUrl(settings.custom_domain.trim());
  }

  // 2. Explicit environment variable
  const envDomain = process.env.CUSTOM_DOMAIN || process.env.SITE_URL;
  if (envDomain && envDomain.trim()) {
    return normalizeUrl(envDomain.trim());
  }

  // 3. Dynamic request detection
  if (req) {
    const forwardedHost = (req.headers["x-forwarded-host"] as string)?.split(",")[0]?.trim();
    const host = forwardedHost || req.headers["host"] || req.get("host");

    if (host) {
      const forwardedProto = (req.headers["x-forwarded-proto"] as string)?.split(",")[0]?.trim();
      const proto = forwardedProto || req.protocol || (host.includes("localhost") ? "http" : "https");
      return normalizeUrl(`${proto}://${host}`);
    }
  }

  // 4. Default fallback
  return "https://qmlab.dev";
}

/**
 * Resolves just the hostname (e.g. "rajatdash.com" without protocol or path)
 */
export function resolveHost(req?: Request, settings?: SiteSettings | null): string {
  const baseUrl = resolveBaseUrl(req, settings);
  return baseUrl.replace(/^https?:\/\//i, "").split("/")[0];
}

/**
 * Normalizes URL: ensures protocol, removes trailing slash and query/hash
 */
export function normalizeUrl(url: string): string {
  let clean = url.trim();
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    clean = `https://${clean}`;
  }
  return clean.replace(/\/+$/, "");
}

/**
 * XML escape utility to guarantee valid XML output for sitemaps
 */
export function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}
