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
  getSettings,
  getProjects,
  getBlogs,
  getCertificates,
  getCustomPassword,
  getStoredAiApiKey,
  getServices,
  saveServices,
  getFaqs,
  saveFaqs,
  getWorkflowSteps,
  saveWorkflowSteps,
  getTrustGuarantees,
  saveTrustGuarantees,
  getRedisStorageInfo,
  getRedisClient,
} from "../lib/store.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { getBotTelemetry, recordBotCrawl } from "../services/crawler.service.js";
import { getTrafficTelemetry } from "../services/telemetry.service.js";
import { generateSqliteArchiveBuffer } from "../services/sqlite-archive.service.js";

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

router.put("/services", requireAdmin, async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ success: false, error: "Services payload must be an array." });
    }
    await saveServices(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save services." });
  }
});

router.put("/faqs", requireAdmin, async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ success: false, error: "FAQs payload must be an array." });
    }
    await saveFaqs(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save FAQs." });
  }
});

router.put("/workflow-steps", requireAdmin, async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ success: false, error: "Workflow steps payload must be an array." });
    }
    await saveWorkflowSteps(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save workflow steps." });
  }
});

router.put("/trust-guarantees", requireAdmin, async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ success: false, error: "Trust guarantees payload must be an array." });
    }
    await saveTrustGuarantees(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save trust guarantees." });
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

// File Upload endpoint for local storage / public/uploads sync with Git
router.post("/upload", requireAdmin, async (req, res) => {
  try {
    const { filename, data } = req.body;
    if (!filename || !data) {
      return res.status(400).json({ success: false, error: "Filename and data are required." });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, safeName);

    let base64Data = data;
    if (data.includes(";base64,")) {
      base64Data = data.split(";base64,").pop();
    }
    const buffer = Buffer.from(base64Data, "base64");

    fs.writeFileSync(filePath, buffer);

    const url = `/uploads/${safeName}`;
    res.json({ success: true, url, message: "Image uploaded successfully to /public/uploads/" });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to upload file." });
  }
});

// Media Library: List uploaded files
router.get("/media", requireAdmin, async (req, res) => {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ success: true, files: [] });
    }
    const filenames = fs.readdirSync(uploadsDir);
    const files = filenames.map(filename => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        url: `/uploads/${filename}`,
        sizeBytes: stats.size,
        createdAt: stats.birthtime || stats.mtime,
      };
    });
    res.json({ success: true, files });
  } catch (error: any) {
    console.error("Failed to list media:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to list media." });
  }
});

// Media Library: Delete file
router.delete("/media", requireAdmin, async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename || typeof filename !== "string") {
      return res.status(400).json({ success: false, error: "Filename is required." });
    }
    const safeFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), "public", "uploads", safeFilename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: `Deleted ${safeFilename} successfully.` });
    } else {
      res.status(404).json({ success: false, error: "File not found." });
    }
  } catch (error: any) {
    console.error("Failed to delete media:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to delete file." });
  }
});

// Backup All Data to JSON
router.post("/backup", requireAdmin, async (req, res) => {
  try {
    const [settings, projects, blogs, certificates, contacts, services, faqs, workflowSteps, trustGuarantees, customPassword, aiApiKey] = await Promise.all([
      getSettings(),
      getProjects(),
      getBlogs(),
      getCertificates(),
      getContacts(),
      getServices(),
      getFaqs(),
      getWorkflowSteps(),
      getTrustGuarantees(),
      getCustomPassword(),
      getStoredAiApiKey(),
    ]);

    const backupData = {
      version: 1,
      timestamp: new Date().toISOString(),
      settings,
      projects,
      blogs,
      certificates,
      contacts,
      services,
      faqs,
      workflowSteps,
      trustGuarantees,
      customPassword,
      aiApiKey,
    };

    const backupsDir = path.join(process.cwd(), ".data", "backups");
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    const latestPath = path.join(backupsDir, "latest.json");
    fs.writeFileSync(latestPath, JSON.stringify(backupData, null, 2), "utf-8");

    const dateStr = new Date().toISOString().replace(/[:.]/g, "-");
    const archivePath = path.join(backupsDir, `backup-${dateStr}.json`);
    fs.writeFileSync(archivePath, JSON.stringify(backupData, null, 2), "utf-8");

    res.json({ 
      success: true, 
      message: "Backup created successfully in .data/backups/latest.json",
      backupData,
      filename: `backup-${dateStr}.json`
    });
  } catch (error: any) {
    console.error("Backup error:", error);
    res.status(500).json({ success: false, error: error.message || "Backup failed." });
  }
});

// Download latest backup JSON file directly
router.get("/backup/download", requireAdmin, async (req, res) => {
  try {
    const [settings, projects, blogs, certificates, contacts, services, faqs, workflowSteps, trustGuarantees, customPassword, aiApiKey] = await Promise.all([
      getSettings(),
      getProjects(),
      getBlogs(),
      getCertificates(),
      getContacts(),
      getServices(),
      getFaqs(),
      getWorkflowSteps(),
      getTrustGuarantees(),
      getCustomPassword(),
      getStoredAiApiKey(),
    ]);

    const backupData = {
      version: 1,
      timestamp: new Date().toISOString(),
      settings,
      projects,
      blogs,
      certificates,
      contacts,
      services,
      faqs,
      workflowSteps,
      trustGuarantees,
      customPassword,
      aiApiKey,
    };

    const filename = `qmlabs-backup-${new Date().toISOString().split("T")[0]}.json`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(backupData, null, 2));
  } catch (error: any) {
    console.error("Download backup error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to download backup." });
  }
});

// Download latest full Redis state as a local SQLite (.sqlite) database file
router.get("/backup/download-sqlite", requireAdmin, async (req, res) => {
  try {
    const { buffer, filename } = await generateSqliteArchiveBuffer();
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/x-sqlite3");
    res.setHeader("Content-Length", buffer.length.toString());
    res.send(buffer);
  } catch (error: any) {
    console.error("Download SQLite backup error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate SQLite archive." });
  }
});

// Restore All Data from JSON (Supports uploaded backup payload or latest.json)
router.post("/restore", requireAdmin, async (req, res) => {
  try {
    let backupData: any = null;

    if (req.body && req.body.backupData && typeof req.body.backupData === "object") {
      backupData = req.body.backupData;
    } else {
      const backupsDir = path.join(process.cwd(), ".data", "backups");
      const latestPath = path.join(backupsDir, "latest.json");

      if (!fs.existsSync(latestPath)) {
        return res.status(404).json({ success: false, error: "No backup found (.data/backups/latest.json)." });
      }

      const raw = fs.readFileSync(latestPath, "utf-8");
      backupData = JSON.parse(raw);
    }

    // Support nested data format if coming from scripts/backup.ts (which used backup.data)
    const payload = backupData.data ? backupData.data : backupData;

    if (payload.settings) await saveSettings(payload.settings);
    if (payload.projects && Array.isArray(payload.projects)) await saveProjects(payload.projects);
    if (payload.blogs && Array.isArray(payload.blogs)) await saveBlogs(payload.blogs);
    if (payload.certificates && Array.isArray(payload.certificates)) await saveCertificates(payload.certificates);
    if (payload.contacts && Array.isArray(payload.contacts)) await saveContacts(payload.contacts);
    if (payload.services && Array.isArray(payload.services)) await saveServices(payload.services);
    if (payload.faqs && Array.isArray(payload.faqs)) await saveFaqs(payload.faqs);
    if (payload.workflowSteps && Array.isArray(payload.workflowSteps)) await saveWorkflowSteps(payload.workflowSteps);
    if (payload.trustGuarantees && Array.isArray(payload.trustGuarantees)) await saveTrustGuarantees(payload.trustGuarantees);
    if (payload.customPassword) await saveCustomPassword(payload.customPassword);
    if (payload.aiApiKey) await saveStoredAiApiKey(payload.aiApiKey);

    res.json({ 
      success: true, 
      message: "Restored all database records successfully (settings, projects, blogs, certificates, contacts, services, faqs, workflowSteps, trustGuarantees)." 
    });
  } catch (error: any) {
    console.error("Restore error:", error);
    res.status(500).json({ success: false, error: error.message || "Restore failed." });
  }
});

// Storage Health: Get live Redis memory statistics and local backup state
router.get("/storage-health", requireAdmin, async (req, res) => {
  try {
    const redisInfo = await getRedisStorageInfo();

    // Check local backup existence
    const backupsDir = path.join(process.cwd(), ".data", "backups");
    let latestBackupTime: string | null = null;
    let latestBackupSize = "0 KB";
    const latestPath = path.join(backupsDir, "latest.json");

    if (fs.existsSync(latestPath)) {
      const stat = fs.statSync(latestPath);
      latestBackupTime = stat.mtime.toISOString();
      latestBackupSize = `${Math.round(stat.size / 1024)} KB`;
    }

    res.json({
      success: true,
      redis: redisInfo,
      localBackup: {
        exists: Boolean(latestBackupTime),
        lastModified: latestBackupTime,
        size: latestBackupSize,
      }
    });
  } catch (error: any) {
    console.error("Storage health check error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Safe Purge: Clear high-volume ephemeral telemetry from Redis (leaves content 100% intact)
router.post("/prune-ephemeral", requireAdmin, async (req, res) => {
  try {
    const redis = getRedisClient();
    if (!redis) {
      return res.status(503).json({ success: false, error: "Redis not connected." });
    }

    // Identify ephemeral keys only
    const ephemeralKeys = await redis.keys("qmlabs:telemetry:*");
    const sessionKeys = await redis.keys("qmlabs:rate:*");
    const allEphemeral = [...ephemeralKeys, ...sessionKeys];

    if (allEphemeral.length > 0) {
      await redis.del(...allEphemeral);
    }

    res.json({
      success: true,
      message: `Safely pruned ${allEphemeral.length} temporary telemetry/rate keys from Redis. All CMS content is preserved.`,
      prunedCount: allEphemeral.length,
    });
  } catch (error: any) {
    console.error("Prune error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
