import { Router } from "express";
import {
  isAdminAuthConfigured,
  verifyAdminPassword,
  issueSessionCookie,
  clearSessionCookie,
  isValidSession,
  requireAdmin,
  hashPassword,
  checkLoginLockout,
  recordFailedLogin,
  resetLoginAttempts,
  getActiveAiApiKey
} from "../lib/auth.js";
import { rateLimiter } from "../lib/rateLimit.js";
import {
  saveSettings,
  saveProjects,
  saveBlogs,
  saveCertificates,
  getContacts,
  saveContacts,
  saveCustomPassword,
  saveStoredAiApiKey,
} from "../lib/store.js";
import crypto from "crypto";
import { getBotTelemetry, recordBotCrawl } from "../services/crawler.service.js";
import { getTrafficTelemetry } from "../services/telemetry.service.js";

const router = Router();

// Rate limiter specifically for login: max 10 requests per 5 minutes per IP
const loginRateLimiter = rateLimiter("admin-login", {
  windowMs: 5 * 60 * 1000,
  maxRequests: 10,
  message: "Too many login attempts from this network. Please wait a few minutes."
});

// Auth Endpoints
router.post("/login", loginRateLimiter, async (req, res) => {
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
  const { password } = req.body;

  // 1. Check if IP is currently locked out
  const lockoutStatus = checkLoginLockout(ip);
  if (lockoutStatus.isLocked) {
    return res.status(429).json({
      success: false,
      error: `Too many failed login attempts. Your IP has been temporarily locked for ${lockoutStatus.remainingMinutes} more minute(s).`
    });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ success: false, error: "Admin password is required." });
  }

  if (!isAdminAuthConfigured()) {
    return res.status(503).json({
      success: false,
      error: "Admin authentication is not configured. Please ensure ADMIN_PASSWORD is set in environment.",
    });
  }

  try {
    const isValid = await verifyAdminPassword(password);
    
    if (!isValid) {
      const { attemptsLeft, isLockedNow } = recordFailedLogin(ip);
      if (isLockedNow) {
        return res.status(429).json({
          success: false,
          error: "Maximum failed attempts exceeded. Access locked for 15 minutes."
        });
      }
      return res.status(401).json({
        success: false,
        error: `Invalid password. ${attemptsLeft} attempt(s) remaining before temporary lockout.`
      });
    }

    // Success: Clear failed attempts and issue secure JWT cookie
    resetLoginAttempts(ip);
    issueSessionCookie(res);
    return res.json({ success: true, message: "Authentication successful." });
  } catch (error: any) {
    console.error("Admin login error:", error);
    return res.status(500).json({ success: false, error: "Unable to process admin login right now." });
  }
});

router.post("/logout", (req, res) => {
  clearSessionCookie(res);
  res.json({ success: true, message: "Logged out successfully." });
});

router.get("/session", (req, res) => {
  res.json({ loggedIn: isValidSession(req) });
});

// Admin Content Mutations (all strictly guarded by requireAdmin)
router.put("/settings", requireAdmin, async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ success: false, error: "Invalid settings payload." });
    }
    await saveSettings(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save settings." });
  }
});

router.put("/projects", requireAdmin, async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ success: false, error: "Projects payload must be an array." });
    }
    await saveProjects(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save projects." });
  }
});

router.put("/blogs", requireAdmin, async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ success: false, error: "Blogs payload must be an array." });
    }
    await saveBlogs(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save blogs." });
  }
});

router.put("/certificates", requireAdmin, async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ success: false, error: "Certificates payload must be an array." });
    }
    await saveCertificates(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save certificates." });
  }
});

router.get("/contacts", requireAdmin, async (req, res) => {
  try {
    const contacts = await getContacts();
    res.json({ success: true, contacts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load contacts." });
  }
});

router.put("/contacts", requireAdmin, async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ success: false, error: "Contacts payload must be an array." });
    }
    await saveContacts(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save contacts." });
  }
});

router.post("/change-password", requireAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({ success: false, error: "Password must be at least 8 characters long." });
    }
    await saveCustomPassword(hashPassword(newPassword));
    res.json({ success: true, message: "Admin password updated successfully." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to update password." });
  }
});

// Real Visitor Traffic Telemetry
router.get("/traffic-stats", requireAdmin, async (req, res) => {
  try {
    const data = getTrafficTelemetry();
    res.json({ success: true, ...data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch traffic stats." });
  }
});

// Bot & Crawler Telemetry
router.get("/bot-logs", requireAdmin, async (req, res) => {
  try {
    const data = getBotTelemetry();
    res.json({ success: true, ...data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch crawler logs." });
  }
});

router.post("/bot-ping", requireAdmin, async (req, res) => {
  try {
    const { botName = "Googlebot", path = "/sitemap.xml", statusCode = 200 } = req.body;
    const sampleUAs: { [key: string]: string } = {
      Googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      Bingbot: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      GPTBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
      ClaudeBot: "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
      PerplexityBot: "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
      DuckDuckBot: "DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)",
      Applebot: "Mozilla/5.0 (compatible; Applebot/0.1; +http://www.apple.com/go/applebot)"
    };

    const ua = sampleUAs[botName] || "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
    recordBotCrawl(ua, path, "GET", Number(statusCode), "66.249.66." + Math.floor(Math.random() * 250 + 1), Math.floor(Math.random() * 30 + 15));
    
    res.json({ success: true, message: `Simulated crawler hit from ${botName} to ${path}` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to simulate bot hit." });
  }
});

// AI Key Management
router.get("/ai-key", requireAdmin, async (req, res) => {
  try {
    const apiKey = await getActiveAiApiKey();
    res.json({ success: true, apiKey });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch AI key." });
  }
});

router.post("/ai-key/generate", requireAdmin, async (req, res) => {
  try {
    const randomHex = crypto.randomBytes(16).toString("hex");
    const newApiKey = `qm_ai_${randomHex}`;
    await saveStoredAiApiKey(newApiKey);
    res.json({ success: true, apiKey: newApiKey, message: "New AI key generated successfully." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to generate AI key." });
  }
});

router.post("/ai-key/set", requireAdmin, async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length < 8) {
      return res.status(400).json({ success: false, error: "API key must be at least 8 characters." });
    }
    const cleanKey = apiKey.trim();
    await saveStoredAiApiKey(cleanKey);
    res.json({ success: true, apiKey: cleanKey, message: "AI API key saved successfully." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save AI key." });
  }
});

export default router;
