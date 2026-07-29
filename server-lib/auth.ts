import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";

const COOKIE_NAME = "qmlabs_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const getSessionSecret = (): string => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not configured.");
  }
  return secret;
};

export const isAdminAuthConfigured = (): boolean =>
  !!(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH && process.env.SESSION_SECRET);

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !adminHash) return false;
  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) return false;
  return bcrypt.compare(password, adminHash);
}

export function issueSessionCookie(res: Response): void {
  const token = jwt.sign({ role: "admin" }, getSessionSecret(), { expiresIn: SESSION_TTL_SECONDS });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS * 1000,
    path: "/",
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, { path: "/" });
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
