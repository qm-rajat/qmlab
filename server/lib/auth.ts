import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { getCustomPassword } from "./store.js";

const COOKIE_NAME = "qmlabs_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const getAdminPassword = (): string => process.env.ADMIN_PASSWORD || "";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const getSessionSecret = (): string => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not configured.");
  }
  return secret;
};

export const isAdminAuthConfigured = (): boolean =>
  !!process.env.SESSION_SECRET; // The password could be in the database, so just checking secret is enough now

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const customPasswordHash = await getCustomPassword();
  
  if (customPasswordHash) {
    return hashPassword(password) === customPasswordHash;
  }
  
  // Fallback to Env Var
  const adminPassword = getAdminPassword();
  if (!adminPassword) return false;
  return password === adminPassword;
}

export function issueSessionCookie(res: Response): void {
  const token = jwt.sign({ role: "admin" }, getSessionSecret(), { expiresIn: SESSION_TTL_SECONDS });
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
  const token = req.cookies?.[COOKIE_NAME];
  if (!token || !process.env.SESSION_SECRET) return false;

  try {
    jwt.verify(token, process.env.SESSION_SECRET);
    return true;
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
