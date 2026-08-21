import jwt from "jsonwebtoken";
import Redis from "ioredis";
import { randomInt } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const COOKIE_NAME = "qmlabs_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const OTP_TTL_SECONDS = 10 * 60;
const OTP_MAX_ATTEMPTS = 5;
const OTP_KEY = "qmlabs:admin:login-otp";

let redisClient: Redis | null = null;
const getRedisClient = (): Redis | null => {
  const connectionString = process.env.REDIS_URL || process.env.KV_URL || process.env.REDIS_CONNECTION_STRING;
  if (!connectionString) return null;
  if (!redisClient) {
    redisClient = new Redis(connectionString, { maxRetriesPerRequest: 3 });
    redisClient.on("error", (error) => console.error("Redis auth client error:", error.message));
  }
  return redisClient;
};

const getAdminEmail = (): string => process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";

const isAdminEmail = (email: string): boolean =>
  !!getAdminEmail() && email.trim().toLowerCase() === getAdminEmail();

const getSessionSecret = (): string => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not configured.");
  }
  return secret;
};

export const isAdminAuthConfigured = (): boolean =>
  !!(getAdminEmail() && process.env.SESSION_SECRET && getRedisClient());

export async function sendAdminOtp(email: string): Promise<string | null> {
  if (!isAdminEmail(email)) return null;
  const redis = getRedisClient();
  if (!redis) throw new Error("Redis is required for admin OTP login.");

  const otp = randomInt(10000, 100000).toString();
  await redis.hset(OTP_KEY, { email: getAdminEmail(), otp, attempts: "0" });
  await redis.expire(OTP_KEY, OTP_TTL_SECONDS);
  return otp;
}

export async function verifyAdminOtp(email: string, otp: string): Promise<boolean> {
  if (!isAdminEmail(email) || !/^\d{5}$/.test(otp)) return false;
  const redis = getRedisClient();
  if (!redis) return false;

  const stored = await redis.hgetall(OTP_KEY);
  const attempts = Number(stored.attempts || 0);
  if (!stored.otp || attempts >= OTP_MAX_ATTEMPTS) return false;
  if (stored.email !== getAdminEmail() || stored.otp !== otp) {
    await redis.hincrby(OTP_KEY, "attempts", 1);
    return false;
  }
  await redis.del(OTP_KEY);
  return true;
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
