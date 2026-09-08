import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { getCustomPassword, getStoredAiApiKey, getSettings } from "./store.js";

const COOKIE_NAME = "qmlabs_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Brute-force protection: Lockout tracking per IP
interface LoginAttempt {
  count: number;
  lockedUntil: number;
  lastAttempt: number;
}

const loginAttempts = new Map<string, LoginAttempt>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function checkLoginLockout(ip: string): { isLocked: boolean; remainingMinutes: number } {
  const record = loginAttempts.get(ip);
  if (!record) return { isLocked: false, remainingMinutes: 0 };

  const now = Date.now();
  if (record.lockedUntil > now) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
    return { isLocked: true, remainingMinutes };
  }

  // If lockout has passed, reset count
  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    loginAttempts.delete(ip);
  }

  return { isLocked: false, remainingMinutes: 0 };
}

export function recordFailedLogin(ip: string): { attemptsLeft: number; isLockedNow: boolean } {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockedUntil: 0, lastAttempt: now };

  record.count += 1;
  record.lastAttempt = now;

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(ip, record);
    return { attemptsLeft: 0, isLockedNow: true };
  }

  loginAttempts.set(ip, record);
  return { attemptsLeft: MAX_FAILED_ATTEMPTS - record.count, isLockedNow: false };
}

export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

const getAdminPassword = (): string => process.env.ADMIN_PASSWORD || "";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Constant-time string comparison to prevent timing side-channel attacks
 */
function timingSafeEqualStrings(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Perform dummy timing calculation to avoid leaking length
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

const getSessionSecret = (): string => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // If no session secret is configured in env, fallback to a persistent hash of ADMIN_PASSWORD + salt
    const adminPass = process.env.ADMIN_PASSWORD || "fallback_salt_key_123";
    return crypto.createHash("sha256").update(`session_${adminPass}`).digest("hex");
  }
  return secret;
};

export const isAdminAuthConfigured = (): boolean =>
  !!(process.env.ADMIN_PASSWORD || process.env.SESSION_SECRET);

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const customPasswordHash = await getCustomPassword();
  
  if (customPasswordHash) {
    const inputHash = hashPassword(password);
    return timingSafeEqualStrings(inputHash, customPasswordHash);
  }
  
  // Fallback to Env Var
  const adminPassword = getAdminPassword();
  if (!adminPassword) return false;
  return timingSafeEqualStrings(password, adminPassword);
}

export function issueSessionCookie(res: Response): void {
  const token = jwt.sign({ role: "admin", iat: Math.floor(Date.now() / 1000) }, getSessionSecret(), { expiresIn: SESSION_TTL_SECONDS });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true, // Must be true for sameSite: "none"
    sameSite: "none", // Required for cross-origin iframes like the AI Studio preview
    maxAge: SESSION_TTL_SECONDS * 1000,
    path: "/",
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    path: "/",
    secure: true,
    sameSite: "none",
  });
}

export function isValidSession(req: Request): boolean {
  // Check cookie or Bearer Authorization header
  let token = req.cookies?.[COOKIE_NAME];
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.slice(7);
  }

  if (!token) return false;

  try {
    const decoded = jwt.verify(token, getSessionSecret()) as { role?: string };
    return decoded && decoded.role === "admin";
  } catch {
    return false;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!isValidSession(req)) {
    return res.status(401).json({ success: false, error: "Unauthorized. Please log in as admin." });
  }
  next();
}

export async function getActiveAiApiKey(): Promise<string> {
  const storedKey = await getStoredAiApiKey();
  if (storedKey && storedKey.trim()) return storedKey.trim();

  const settings = await getSettings();
  if (settings.ai_api_key && settings.ai_api_key.trim()) return settings.ai_api_key.trim();

  if (process.env.AI_API_KEY && process.env.AI_API_KEY.trim()) return process.env.AI_API_KEY.trim();

  const adminPass = process.env.ADMIN_PASSWORD || "qmlabs_portfolio_key";
  return `qm_ai_${crypto.createHash("sha256").update(`ai_key_${adminPass}`).digest("hex").slice(0, 32)}`;
}

export async function verifyAiOrAdminAuth(req: Request): Promise<boolean> {
  if (isValidSession(req)) return true;

  const headerKey = (req.headers["x-api-key"] as string) ||
                    (req.headers["api-key"] as string) ||
                    (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : "");

  const queryKey = (req.query.api_key as string) || (req.query.key as string) || "";
  const providedKey = (headerKey || queryKey || "").trim();

  if (!providedKey) return false;

  const expectedKey = await getActiveAiApiKey();
  if (timingSafeEqualStrings(providedKey, expectedKey)) return true;

  const isValidAdminPass = await verifyAdminPassword(providedKey);
  if (isValidAdminPass) return true;

  return false;
}

export async function requireAiOrAdminAuth(req: Request, res: Response, next: NextFunction) {
  const isAuthorized = await verifyAiOrAdminAuth(req);
  if (!isAuthorized) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized AI / Admin request. Please provide a valid 'x-api-key' or Bearer token.",
      help: "You can generate or view your AI API Key in your Admin Console -> AI & ChatGPT Integrations."
    });
  }
  next();
}

