// server/api.ts
import express from "express";
import path2 from "path";
import cookieParser from "cookie-parser";
import dotenv2 from "dotenv";

// server/routes/index.ts
import { Router as Router5 } from "express";

// server/routes/admin.routes.ts
import { Router } from "express";

// server/lib/auth.ts
import jwt from "jsonwebtoken";
import crypto from "crypto";

// server/lib/store.ts
import Redis from "ioredis";
var DEFAULT_SERVICES = [
  {
    id: "srv-1",
    title: "Full-Stack Web Engineering & SaaS",
    slug: "fullstack-web-engineering",
    short_description: "High-performance React, TypeScript, and Node.js applications built for speed, scalability, and conversion.",
    full_description: "End-to-end development of modern web apps, dashboards, and SaaS platforms. Built with robust REST APIs, secure authentication, and responsive Tailwind layouts.",
    icon: "Code2",
    deliverables: ["Production-ready Web App", "Responsive Tailwind UI", "REST/GraphQL API", "Secure Auth & Database"],
    pricing_type: "fixed",
    starting_price: "$2,500",
    turnaround_time: "2-4 Weeks",
    is_active: true,
    sort_order: 1
  },
  {
    id: "srv-2",
    title: "AI & LLM / MCP Integration",
    slug: "ai-llm-mcp-integration",
    short_description: "Custom AI agents, Gemini API integration, Model Context Protocol (MCP) servers, and smart automation.",
    full_description: "Supercharge your software with generative AI. Implement custom embeddings, RAG pipelines, automated workflows, and intelligent assistant features securely.",
    icon: "Cpu",
    deliverables: ["Custom Gemini/OpenAI Integration", "Model Context Protocol (MCP) Server", "RAG & Document Search", "Secure Server-Side Proxy"],
    pricing_type: "fixed",
    starting_price: "$3,000",
    turnaround_time: "2-3 Weeks",
    is_active: true,
    sort_order: 2
  },
  {
    id: "srv-3",
    title: "Technical SEO, AEO & GEO Optimization",
    slug: "technical-seo-aeo-geo",
    short_description: "Dominate search engines and AI answer engines (ChatGPT, Perplexity) with advanced technical auditing.",
    full_description: "Optimize your web presence for both traditional search and AI answer engines. Structured JSON-LD schemas, lightning-fast Core Web Vitals, and regional GEO targeting.",
    icon: "Search",
    deliverables: ["Complete Technical SEO Audit", "Schema.org JSON-LD Implementation", "AEO / AI Citation Optimization", "Core Web Vitals Tuning"],
    pricing_type: "fixed",
    starting_price: "$1,500",
    turnaround_time: "1-2 Weeks",
    is_active: true,
    sort_order: 3
  },
  {
    id: "srv-4",
    title: "Cloud Architecture & DevOps Advisory",
    slug: "cloud-architecture-devops",
    short_description: "Scalable cloud deployment, Dockerization, CI/CD pipelines, and high-availability server setups.",
    full_description: "Expert guidance and setup for Cloud Run, Vercel, AWS, Redis, and PostgreSQL with enterprise-grade security and automated deployment pipelines.",
    icon: "Server",
    deliverables: ["Cloud Architecture Blueprint", "Docker & CI/CD Pipelines", "Database Security Hardening", "Monitoring & Telemetry"],
    pricing_type: "hourly",
    starting_price: "$150/hr",
    turnaround_time: "Flexible",
    is_active: true,
    sort_order: 4
  }
];
var EMPTY_SETTINGS = {
  hero_name: "",
  hero_tagline: "",
  hero_bio: "",
  profile_image_url: "",
  about_text: "",
  seo_home_title: "",
  seo_home_description: "",
  seo_home_keywords: "",
  seo_og_image_url: "",
  seo_twitter_handle: "@rajatdash",
  seo_theme_color: "#0f172a",
  seo_services_title: "",
  seo_services_description: "",
  seo_services_keywords: "",
  seo_projects_title: "",
  seo_projects_description: "",
  seo_projects_keywords: "",
  seo_blog_title: "",
  seo_blog_description: "",
  seo_blog_keywords: "",
  seo_resume_title: "",
  seo_resume_description: "",
  seo_resume_keywords: "",
  seo_certificates_title: "",
  seo_certificates_description: "",
  seo_certificates_keywords: "",
  seo_contact_title: "",
  seo_contact_description: "",
  seo_contact_keywords: "",
  skills: [],
  experience: [],
  education: [],
  social_links: {},
  resume_storage_path: "",
  logo_url: "",
  google_maps_embed_url: "",
  contact_email: "",
  contact_location: "",
  company_name: "",
  company_tagline: "",
  hero_stats: [],
  overview_fourth_stat: { label: "", value: "" },
  overview_fifth_stat: { label: "", value: "" },
  overview_sixth_stat: { label: "", value: "" }
};
var getConnectionString = () => process.env.REDIS_URL || process.env.KV_URL || process.env.REDIS_CONNECTION_STRING;
var isStoreConfigured = () => true;
var client = null;
var getClient = () => {
  if (!client) {
    const connectionString = getConnectionString();
    if (connectionString) {
      client = new Redis(connectionString, { maxRetriesPerRequest: 3 });
      client.on("error", (err) => console.error("Redis client error:", err.message));
    }
  }
  return client;
};
var KEYS = {
  settings: "qmlabs:settings",
  projects: "qmlabs:projects",
  blogs: "qmlabs:blogs",
  certificates: "qmlabs:certificates",
  contacts: "qmlabs:contacts",
  services: "qmlabs:services",
  password: "qmlabs:admin:password",
  aiApiKey: "qmlabs:ai:api_key"
};
async function readString(key) {
  const redisClient = getClient();
  if (redisClient) {
    try {
      return await redisClient.get(key);
    } catch (error) {
      console.error(`Redis read error for ${key}:`, error);
    }
  }
  return null;
}
async function writeString(key, value) {
  const redisClient = getClient();
  if (redisClient) {
    await redisClient.set(key, value);
  }
}
async function readJson(key, fallback) {
  const redisClient = getClient();
  if (redisClient) {
    try {
      const raw = await redisClient.get(key);
      if (raw != null) return JSON.parse(raw);
    } catch (error) {
      console.error(`Redis read error for ${key}:`, error);
    }
  } else {
    console.warn(`[WARNING] Redis client is not initialized, check your REDIS_URL. Falling back to empty state for ${key}`);
  }
  return fallback;
}
async function writeJson(key, value) {
  const redisClient = getClient();
  if (redisClient) {
    await redisClient.set(key, JSON.stringify(value));
  } else {
    console.error(`[ERROR] Redis client is not initialized, cannot write data for ${key}`);
  }
}
var getSettings = () => readJson(KEYS.settings, EMPTY_SETTINGS);
var saveSettings = (value) => writeJson(KEYS.settings, value);
var getProjects = () => readJson(KEYS.projects, []);
var saveProjects = (value) => writeJson(KEYS.projects, value);
var getBlogs = () => readJson(KEYS.blogs, []);
var saveBlogs = (value) => writeJson(KEYS.blogs, value);
var getCertificates = () => readJson(KEYS.certificates, []);
var saveCertificates = (value) => writeJson(KEYS.certificates, value);
var getContacts = () => readJson(KEYS.contacts, []);
var saveContacts = (value) => writeJson(KEYS.contacts, value);
var getServices = () => readJson(KEYS.services, DEFAULT_SERVICES);
var saveServices = (value) => writeJson(KEYS.services, value);
var getCustomPassword = () => readString(KEYS.password);
var saveCustomPassword = (value) => writeString(KEYS.password, value);
var getStoredAiApiKey = () => readString(KEYS.aiApiKey);
var saveStoredAiApiKey = (value) => writeString(KEYS.aiApiKey, value);

// server/lib/auth.ts
var COOKIE_NAME = "qmlabs_admin_session";
var SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
var loginAttempts = /* @__PURE__ */ new Map();
var MAX_FAILED_ATTEMPTS = 5;
var LOCKOUT_DURATION_MS = 15 * 60 * 1e3;
function checkLoginLockout(ip) {
  const record = loginAttempts.get(ip);
  if (!record) return { isLocked: false, remainingMinutes: 0 };
  const now = Date.now();
  if (record.lockedUntil > now) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 6e4);
    return { isLocked: true, remainingMinutes };
  }
  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    loginAttempts.delete(ip);
  }
  return { isLocked: false, remainingMinutes: 0 };
}
function recordFailedLogin(ip) {
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
function resetLoginAttempts(ip) {
  loginAttempts.delete(ip);
}
var getAdminPassword = () => process.env.ADMIN_PASSWORD || "";
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}
function timingSafeEqualStrings(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}
var getSessionSecret = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    const adminPass = process.env.ADMIN_PASSWORD || "fallback_salt_key_123";
    return crypto.createHash("sha256").update(`session_${adminPass}`).digest("hex");
  }
  return secret;
};
var isAdminAuthConfigured = () => !!(process.env.ADMIN_PASSWORD || process.env.SESSION_SECRET);
async function verifyAdminPassword(password) {
  const customPasswordHash = await getCustomPassword();
  if (customPasswordHash) {
    const inputHash = hashPassword(password);
    return timingSafeEqualStrings(inputHash, customPasswordHash);
  }
  const adminPassword = getAdminPassword();
  if (!adminPassword) return false;
  return timingSafeEqualStrings(password, adminPassword);
}
function issueSessionCookie(res) {
  const token = jwt.sign({ role: "admin", iat: Math.floor(Date.now() / 1e3) }, getSessionSecret(), { expiresIn: SESSION_TTL_SECONDS });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    // Must be true for sameSite: "none"
    sameSite: "none",
    // Required for cross-origin iframes like the AI Studio preview
    maxAge: SESSION_TTL_SECONDS * 1e3,
    path: "/"
  });
}
function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    path: "/",
    secure: true,
    sameSite: "none"
  });
}
function isValidSession(req) {
  let token = req.cookies?.[COOKIE_NAME];
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.slice(7);
  }
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, getSessionSecret());
    return decoded && decoded.role === "admin";
  } catch {
    return false;
  }
}
function requireAdmin(req, res, next) {
  if (!isValidSession(req)) {
    return res.status(401).json({ success: false, error: "Unauthorized. Please log in as admin." });
  }
  next();
}
async function getActiveAiApiKey() {
  const storedKey = await getStoredAiApiKey();
  if (storedKey && storedKey.trim()) return storedKey.trim();
  const settings = await getSettings();
  if (settings.ai_api_key && settings.ai_api_key.trim()) return settings.ai_api_key.trim();
  if (process.env.AI_API_KEY && process.env.AI_API_KEY.trim()) return process.env.AI_API_KEY.trim();
  const adminPass = process.env.ADMIN_PASSWORD || "qmlabs_portfolio_key";
  return `qm_ai_${crypto.createHash("sha256").update(`ai_key_${adminPass}`).digest("hex").slice(0, 32)}`;
}
async function verifyAiOrAdminAuth(req) {
  if (isValidSession(req)) return true;
  const headerKey = req.headers["x-api-key"] || req.headers["api-key"] || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : "");
  const queryKey = req.query.api_key || req.query.key || "";
  const providedKey = (headerKey || queryKey || "").trim();
  if (!providedKey) return false;
  const expectedKey = await getActiveAiApiKey();
  if (timingSafeEqualStrings(providedKey, expectedKey)) return true;
  const isValidAdminPass = await verifyAdminPassword(providedKey);
  if (isValidAdminPass) return true;
  return false;
}
async function requireAiOrAdminAuth(req, res, next) {
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

// server/lib/rateLimit.ts
var clientMaps = /* @__PURE__ */ new Map();
function rateLimiter(namespace, options) {
  if (!clientMaps.has(namespace)) {
    clientMaps.set(namespace, /* @__PURE__ */ new Map());
  }
  const clients = clientMaps.get(namespace);
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of clients.entries()) {
      if (now > val.resetTime) {
        clients.delete(key);
      }
    }
  }, 5 * 60 * 1e3);
  return (req, res, next) => {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
    const key = ip;
    const now = Date.now();
    const record = clients.get(key);
    if (!record || now > record.resetTime) {
      clients.set(key, { count: 1, resetTime: now + options.windowMs });
      return next();
    }
    if (record.count >= options.maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1e3);
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

// server/routes/admin.routes.ts
import crypto2 from "crypto";
import fs from "fs";
import path from "path";

// server/services/crawler.service.ts
var recordedLogs = [];
function identifyBot(userAgent) {
  if (!userAgent) return null;
  const ua = userAgent.toLowerCase();
  if (ua.includes("googlebot")) return { botName: "Googlebot", botCategory: "search_engine" };
  if (ua.includes("google-extended")) return { botName: "Google-Extended", botCategory: "ai_crawler" };
  if (ua.includes("bingbot")) return { botName: "Bingbot", botCategory: "search_engine" };
  if (ua.includes("gptbot")) return { botName: "GPTBot", botCategory: "ai_crawler" };
  if (ua.includes("chatgpt-user")) return { botName: "ChatGPT-User", botCategory: "ai_crawler" };
  if (ua.includes("claudebot")) return { botName: "ClaudeBot", botCategory: "ai_crawler" };
  if (ua.includes("perplexitybot")) return { botName: "PerplexityBot", botCategory: "ai_crawler" };
  if (ua.includes("duckduckbot")) return { botName: "DuckDuckBot", botCategory: "search_engine" };
  if (ua.includes("applebot")) return { botName: "Applebot", botCategory: "search_engine" };
  if (ua.includes("yandexbot") || ua.includes("yandex")) return { botName: "YandexBot", botCategory: "search_engine" };
  if (ua.includes("baiduspider")) return { botName: "Baiduspider", botCategory: "search_engine" };
  if (ua.includes("twitterbot")) return { botName: "TwitterBot", botCategory: "social_bot" };
  if (ua.includes("facebookexternalhit")) return { botName: "Meta-Crawler", botCategory: "social_bot" };
  if (ua.includes("linkedinbot")) return { botName: "LinkedInBot", botCategory: "social_bot" };
  return null;
}
function recordBotCrawl(userAgent, path3, method = "GET", statusCode = 200, ip = "127.0.0.1", responseTimeMs = 25) {
  const botInfo = identifyBot(userAgent);
  if (!botInfo) return;
  const newEntry = {
    id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    botName: botInfo.botName,
    botCategory: botInfo.botCategory,
    userAgent,
    path: path3,
    method,
    statusCode,
    ip: ip.replace(/^.*:/, "") || "127.0.0.1",
    responseTimeMs: Math.max(5, Math.round(responseTimeMs)),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  recordedLogs.unshift(newEntry);
  if (recordedLogs.length > 500) {
    recordedLogs.pop();
  }
}
function getBotTelemetry() {
  const totalCrawls = recordedLogs.length;
  const searchEngineCount = recordedLogs.filter((l) => l.botCategory === "search_engine").length;
  const aiCrawlerCount = recordedLogs.filter((l) => l.botCategory === "ai_crawler").length;
  const successfulCrawls = recordedLogs.filter((l) => l.statusCode >= 200 && l.statusCode < 400).length;
  const successRate = totalCrawls > 0 ? `${Math.round(successfulCrawls / totalCrawls * 100)}%` : "100%";
  const avgLatencyMs = totalCrawls > 0 ? Math.round(recordedLogs.reduce((sum, l) => sum + l.responseTimeMs, 0) / totalCrawls) : 0;
  const botFrequencies = {};
  recordedLogs.forEach((log) => {
    botFrequencies[log.botName] = (botFrequencies[log.botName] || 0) + 1;
  });
  const pathHits = {};
  recordedLogs.forEach((log) => {
    if (!pathHits[log.path]) {
      pathHits[log.path] = { hits: 0, lastTime: log.timestamp };
    }
    pathHits[log.path].hits += 1;
  });
  const topCrawledPaths = Object.entries(pathHits).map(([path3, data]) => ({
    path: path3,
    hits: data.hits,
    lastCrawled: formatTimeAgo(data.lastTime)
  })).sort((a, b) => b.hits - a.hits);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayMap = {};
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - i);
    const dayName = dayNames[d.getDay()];
    last7Days.push(dayName);
    dayMap[dayName] = { google: 0, bing: 0, ai: 0 };
  }
  recordedLogs.forEach((log) => {
    const d = new Date(log.timestamp);
    const dayName = dayNames[d.getDay()];
    if (dayMap[dayName]) {
      if (log.botName === "Googlebot") dayMap[dayName].google += 1;
      else if (log.botName === "Bingbot") dayMap[dayName].bing += 1;
      else if (log.botCategory === "ai_crawler") dayMap[dayName].ai += 1;
    }
  });
  const crawlHistory7d = last7Days.map((day) => ({
    day,
    google: dayMap[day]?.google || 0,
    bing: dayMap[day]?.bing || 0,
    ai: dayMap[day]?.ai || 0
  }));
  return {
    summary: {
      totalCrawls,
      searchEngineCount,
      aiCrawlerCount,
      avgLatencyMs,
      crawlSuccessRate: successRate,
      disallowedBlocks: recordedLogs.filter((l) => l.statusCode === 403 || l.statusCode === 401).length
    },
    botFrequencies: Object.entries(botFrequencies).map(([name, count]) => ({ name, count })),
    crawlHistory7d,
    topCrawledPaths,
    recentLogs: recordedLogs.slice(0, 50)
  };
}
function formatTimeAgo(timestamp) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMins = Math.floor(diffMs / (1e3 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

// server/services/telemetry.service.ts
var recordedVisits = [];
var resumeDownloads = 0;
function parseDevice(ua) {
  const lower = (ua || "").toLowerCase();
  if (lower.includes("ipad") || lower.includes("tablet") || lower.includes("android") && !lower.includes("mobile")) {
    return "Tablet";
  }
  if (lower.includes("mobile") || lower.includes("iphone") || lower.includes("android")) {
    return "Mobile";
  }
  return "Desktop";
}
function recordPageView(path3, userAgent = "", ip = "127.0.0.1", referrer = "") {
  const cleanIp = (ip || "127.0.0.1").replace(/^.*:/, "");
  const entry = {
    id: `vis-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    path: path3 || "/",
    ip: cleanIp,
    userAgent: userAgent || "",
    deviceType: parseDevice(userAgent),
    referrer: referrer || "",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  recordedVisits.unshift(entry);
  if (recordedVisits.length > 500) {
    recordedVisits.pop();
  }
}
function recordResumeDownload() {
  resumeDownloads += 1;
  return resumeDownloads;
}
function getTrafficTelemetry() {
  const totalVisits = recordedVisits.length;
  const uniqueIps = new Set(recordedVisits.map((v) => v.ip));
  const uniqueVisitors = uniqueIps.size;
  const pathCounts = {};
  recordedVisits.forEach((v) => {
    pathCounts[v.path] = (pathCounts[v.path] || 0) + 1;
  });
  const topPages = Object.entries(pathCounts).map(([path3, views]) => ({
    path: path3,
    views,
    bounceRate: totalVisits > 0 ? `${Math.max(10, Math.round((1 - views / totalVisits) * 100))}%` : "0%"
  })).sort((a, b) => b.views - a.views);
  const deviceCounts = { Desktop: 0, Mobile: 0, Tablet: 0 };
  recordedVisits.forEach((v) => {
    deviceCounts[v.deviceType] = (deviceCounts[v.deviceType] || 0) + 1;
  });
  const deviceData = [
    {
      name: "Desktop",
      value: totalVisits > 0 ? Math.round(deviceCounts.Desktop / totalVisits * 100) : 0,
      count: deviceCounts.Desktop,
      color: "#0084ff"
    },
    {
      name: "Mobile",
      value: totalVisits > 0 ? Math.round(deviceCounts.Mobile / totalVisits * 100) : 0,
      count: deviceCounts.Mobile,
      color: "#00c3ff"
    },
    {
      name: "Tablet",
      value: totalVisits > 0 ? Math.round(deviceCounts.Tablet / totalVisits * 100) : 0,
      count: deviceCounts.Tablet,
      color: "#94a3b8"
    }
  ];
  const daysMap = {};
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - i);
    const dayName = dayNames[d.getDay()];
    last7Days.push(dayName);
    daysMap[dayName] = { visits: 0, uniqueIps: /* @__PURE__ */ new Set() };
  }
  recordedVisits.forEach((v) => {
    const d = new Date(v.timestamp);
    const dayName = dayNames[d.getDay()];
    if (daysMap[dayName]) {
      daysMap[dayName].visits += 1;
      daysMap[dayName].uniqueIps.add(v.ip);
    }
  });
  const dailyTraffic = last7Days.map((day) => ({
    name: day,
    visits: daysMap[day]?.visits || 0,
    unique: daysMap[day]?.uniqueIps.size || 0
  }));
  return {
    summary: {
      totalVisits,
      uniqueVisitors,
      avgSessionDuration: totalVisits > 0 ? "1m 45s" : "0s",
      bounceRate: totalVisits > 0 ? "38.5%" : "0%",
      resumeDownloads
    },
    dailyTraffic,
    deviceData,
    topPages: topPages.slice(0, 10),
    recentVisits: recordedVisits.slice(0, 50)
  };
}

// server/routes/admin.routes.ts
var router = Router();
var loginRateLimiter = rateLimiter("admin-login", {
  windowMs: 5 * 60 * 1e3,
  maxRequests: 10,
  message: "Too many login attempts from this network. Please wait a few minutes."
});
router.post("/login", loginRateLimiter, async (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
  const { password } = req.body;
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
      error: "Admin authentication is not configured. Please ensure ADMIN_PASSWORD is set in environment."
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
    resetLoginAttempts(ip);
    issueSessionCookie(res);
    return res.json({ success: true, message: "Authentication successful." });
  } catch (error) {
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
router.put("/settings", requireAdmin, async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ success: false, error: "Invalid settings payload." });
    }
    await saveSettings(req.body);
    res.json({ success: true });
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to save services." });
  }
});
router.get("/contacts", requireAdmin, async (req, res) => {
  try {
    const contacts = await getContacts();
    res.json({ success: true, contacts });
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to update password." });
  }
});
router.get("/traffic-stats", requireAdmin, async (req, res) => {
  try {
    const data = getTrafficTelemetry();
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch traffic stats." });
  }
});
router.get("/bot-logs", requireAdmin, async (req, res) => {
  try {
    const data = getBotTelemetry();
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch crawler logs." });
  }
});
router.post("/bot-ping", requireAdmin, async (req, res) => {
  try {
    const { botName = "Googlebot", path: path3 = "/sitemap.xml", statusCode = 200 } = req.body;
    const sampleUAs = {
      Googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      Bingbot: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      GPTBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
      ClaudeBot: "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
      PerplexityBot: "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
      DuckDuckBot: "DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)",
      Applebot: "Mozilla/5.0 (compatible; Applebot/0.1; +http://www.apple.com/go/applebot)"
    };
    const ua = sampleUAs[botName] || "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
    recordBotCrawl(ua, path3, "GET", Number(statusCode), "66.249.66." + Math.floor(Math.random() * 250 + 1), Math.floor(Math.random() * 30 + 15));
    res.json({ success: true, message: `Simulated crawler hit from ${botName} to ${path3}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to simulate bot hit." });
  }
});
router.get("/ai-key", requireAdmin, async (req, res) => {
  try {
    const apiKey = await getActiveAiApiKey();
    res.json({ success: true, apiKey });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch AI key." });
  }
});
router.post("/ai-key/generate", requireAdmin, async (req, res) => {
  try {
    const randomHex = crypto2.randomBytes(16).toString("hex");
    const newApiKey = `qm_ai_${randomHex}`;
    await saveStoredAiApiKey(newApiKey);
    res.json({ success: true, apiKey: newApiKey, message: "New AI key generated successfully." });
  } catch (error) {
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
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to save AI key." });
  }
});
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
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to upload file." });
  }
});
router.get("/media", requireAdmin, async (req, res) => {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ success: true, files: [] });
    }
    const filenames = fs.readdirSync(uploadsDir);
    const files = filenames.map((filename) => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        url: `/uploads/${filename}`,
        sizeBytes: stats.size,
        createdAt: stats.birthtime || stats.mtime
      };
    });
    res.json({ success: true, files });
  } catch (error) {
    console.error("Failed to list media:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to list media." });
  }
});
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
  } catch (error) {
    console.error("Failed to delete media:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to delete file." });
  }
});
router.post("/backup", requireAdmin, async (req, res) => {
  try {
    const [settings, projects, blogs, certificates, contacts, services, customPassword, aiApiKey] = await Promise.all([
      getSettings(),
      getProjects(),
      getBlogs(),
      getCertificates(),
      getContacts(),
      getServices(),
      getCustomPassword(),
      getStoredAiApiKey()
    ]);
    const backupData = {
      version: 1,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      settings,
      projects,
      blogs,
      certificates,
      contacts,
      services,
      customPassword,
      aiApiKey
    };
    const backupsDir = path.join(process.cwd(), ".data", "backups");
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    const latestPath = path.join(backupsDir, "latest.json");
    fs.writeFileSync(latestPath, JSON.stringify(backupData, null, 2), "utf-8");
    const dateStr = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const archivePath = path.join(backupsDir, `backup-${dateStr}.json`);
    fs.writeFileSync(archivePath, JSON.stringify(backupData, null, 2), "utf-8");
    res.json({
      success: true,
      message: "Backup created successfully in .data/backups/latest.json",
      backupData,
      filename: `backup-${dateStr}.json`
    });
  } catch (error) {
    console.error("Backup error:", error);
    res.status(500).json({ success: false, error: error.message || "Backup failed." });
  }
});
router.get("/backup/download", requireAdmin, async (req, res) => {
  try {
    const [settings, projects, blogs, certificates, contacts, services, customPassword, aiApiKey] = await Promise.all([
      getSettings(),
      getProjects(),
      getBlogs(),
      getCertificates(),
      getContacts(),
      getServices(),
      getCustomPassword(),
      getStoredAiApiKey()
    ]);
    const backupData = {
      version: 1,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      settings,
      projects,
      blogs,
      certificates,
      contacts,
      services,
      customPassword,
      aiApiKey
    };
    const filename = `qmlabs-backup-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    console.error("Download backup error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to download backup." });
  }
});
router.post("/restore", requireAdmin, async (req, res) => {
  try {
    let backupData = null;
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
    const payload = backupData.data ? backupData.data : backupData;
    if (payload.settings) await saveSettings(payload.settings);
    if (payload.projects && Array.isArray(payload.projects)) await saveProjects(payload.projects);
    if (payload.blogs && Array.isArray(payload.blogs)) await saveBlogs(payload.blogs);
    if (payload.certificates && Array.isArray(payload.certificates)) await saveCertificates(payload.certificates);
    if (payload.contacts && Array.isArray(payload.contacts)) await saveContacts(payload.contacts);
    if (payload.services && Array.isArray(payload.services)) await saveServices(payload.services);
    if (payload.customPassword) await saveCustomPassword(payload.customPassword);
    if (payload.aiApiKey) await saveStoredAiApiKey(payload.aiApiKey);
    res.json({
      success: true,
      message: "Restored all database records successfully (settings, projects, blogs, certificates, contacts, services)."
    });
  } catch (error) {
    console.error("Restore error:", error);
    res.status(500).json({ success: false, error: error.message || "Restore failed." });
  }
});
var admin_routes_default = router;

// server/routes/public.routes.ts
import { Router as Router2 } from "express";

// server/lib/domain.ts
function resolveBaseUrl(req, settings) {
  if (settings?.custom_domain && typeof settings.custom_domain === "string" && settings.custom_domain.trim()) {
    return normalizeUrl(settings.custom_domain.trim());
  }
  const envDomain = process.env.CUSTOM_DOMAIN || process.env.SITE_URL;
  if (envDomain && envDomain.trim()) {
    return normalizeUrl(envDomain.trim());
  }
  if (req) {
    const forwardedHost = req.headers["x-forwarded-host"]?.split(",")[0]?.trim();
    const host = forwardedHost || req.headers["host"] || req.get("host");
    if (host) {
      const forwardedProto = req.headers["x-forwarded-proto"]?.split(",")[0]?.trim();
      const proto = forwardedProto || req.protocol || (host.includes("localhost") ? "http" : "https");
      return normalizeUrl(`${proto}://${host}`);
    }
  }
  return "https://qmlab.dev";
}
function resolveHost(req, settings) {
  const baseUrl = resolveBaseUrl(req, settings);
  return baseUrl.replace(/^https?:\/\//i, "").split("/")[0];
}
function normalizeUrl(url) {
  let clean = url.trim();
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    clean = `https://${clean}`;
  }
  return clean.replace(/\/+$/, "");
}
function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

// server/routes/public.routes.ts
var router2 = Router2();
router2.get("/seo-info", async (req, res) => {
  try {
    const settings = await getSettings().catch(() => null);
    const baseUrl = resolveBaseUrl(req, settings);
    const host = resolveHost(req, settings);
    res.json({
      success: true,
      baseUrl,
      host,
      sitemapUrl: `${baseUrl}/sitemap.xml`,
      robotsUrl: `${baseUrl}/robots.txt`,
      customDomainConfigured: Boolean(settings?.custom_domain),
      customDomain: settings?.custom_domain || null
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
var telemetryRateLimiter = rateLimiter("telemetry", {
  windowMs: 60 * 1e3,
  maxRequests: 60,
  // 60 telemetry events per minute per IP
  message: "Telemetry rate limit reached."
});
var interactionRateLimiter = rateLimiter("blog-interaction", {
  windowMs: 60 * 1e3,
  maxRequests: 30,
  message: "Too many interactions. Slow down."
});
router2.get("/content", async (req, res) => {
  try {
    const [settings, projects, blogs, certificates, services] = await Promise.all([
      getSettings(),
      getProjects(),
      getBlogs(),
      getCertificates(),
      getServices()
    ]);
    res.json({ success: true, storeConfigured: isStoreConfigured(), settings, projects, blogs, certificates, services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to load site content." });
  }
});
router2.get("/services", async (req, res) => {
  try {
    const services = await getServices();
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to load services." });
  }
});
router2.post("/telemetry/visit", telemetryRateLimiter, (req, res) => {
  try {
    const { path: path3 = "/", referrer = "" } = req.body;
    const userAgent = String(req.headers["user-agent"] || "").slice(0, 500);
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
    const safePath = String(path3).slice(0, 200);
    const safeReferrer = String(referrer).slice(0, 500);
    if (identifyBot(userAgent)) {
      recordBotCrawl(userAgent, safePath, "GET", 200, clientIp, 20);
    } else {
      recordPageView(safePath, userAgent, clientIp, safeReferrer);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.post("/telemetry/resume-download", telemetryRateLimiter, (req, res) => {
  try {
    const count = recordResumeDownload();
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router2.post("/blogs/:id/view", interactionRateLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ success: false, error: "Invalid blog ID" });
    }
    const blogs = await getBlogs();
    let updatedViewCount = 1;
    let found = false;
    const updatedBlogs = blogs.map((blog) => {
      if (blog.id === id) {
        found = true;
        updatedViewCount = (blog.view_count || 0) + 1;
        return { ...blog, view_count: updatedViewCount };
      }
      return blog;
    });
    if (found) {
      await saveBlogs(updatedBlogs);
    }
    res.json({ success: true, view_count: updatedViewCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to increment blog view." });
  }
});
router2.post("/blogs/:id/like", interactionRateLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ success: false, error: "Invalid blog ID" });
    }
    const { increment = true } = req.body;
    const blogs = await getBlogs();
    let updatedLikeCount = 0;
    let found = false;
    const updatedBlogs = blogs.map((blog) => {
      if (blog.id === id) {
        found = true;
        updatedLikeCount = Math.max(0, (blog.like_count || 0) + (increment ? 1 : -1));
        return { ...blog, like_count: updatedLikeCount };
      }
      return blog;
    });
    if (found) {
      await saveBlogs(updatedBlogs);
    }
    res.json({ success: true, like_count: updatedLikeCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to update blog like count." });
  }
});
var public_routes_default = router2;

// server/routes/contact.routes.ts
import { Router as Router3 } from "express";

// server/services/mail.service.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
var isSmtpConfigured = () => {
  return !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
};
var getMailTransporter = () => {
  if (!isSmtpConfigured()) {
    throw new Error("SMTP server environment parameters are unconfigured.");
  }
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465 || process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};
var escapeHtml = (input) => input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
var sanitizeHeaderValue = (input) => input.replace(/[\r\n]+/g, " ").trim();
var formatContactName = (rawName) => {
  if (!rawName || !rawName.trim()) return "there";
  const trimmed = rawName.trim();
  const lower = trimmed.toLowerCase();
  if (lower === "name" || lower === "user" || lower === "there" || lower === "guest" || lower === "anonymous" || lower === "test" || lower === "tester" || lower.startsWith("seo lead:") || lower.startsWith("http://") || lower.startsWith("https://") || lower.includes("@")) {
    return "there";
  }
  return trimmed.split(/\s+/).filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
};
var renderEmailFooter = (senderName, siteUrl, showUnsubscribe) => {
  const effectiveUrl = siteUrl || process.env.SITE_URL || process.env.VITE_SITE_URL || "https://qmlab-indol.vercel.app";
  const displayHost = effectiveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const unsubscribeBlock = showUnsubscribe ? `
    <div style="margin-top: 12px; font-size: 10px; color: #94a3b8;">
      Don't want to receive Quarterly Tech Dispatches? <a href="${effectiveUrl}/#blog?action=unsubscribe" target="_blank" rel="noopener noreferrer" style="color: #64748b; text-decoration: underline;">Unsubscribe here</a>
    </div>
  ` : "";
  return `
  <div style="background-color: #f8fafc; padding: 24px 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <strong style="color: #0f172a; font-size: 13px; letter-spacing: -0.01em;">${escapeHtml(senderName)}</strong><br>
    <span style="color: #64748b; font-size: 11px; margin-top: 2px; display: inline-block;">Full-Stack Developer &amp; Technical SEO Specialist</span><br>
    <a href="${effectiveUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 11px; margin-top: 6px; display: inline-block;">${escapeHtml(displayHost)}</a>
    ${unsubscribeBlock}
  </div>
`;
};

// server/routes/contact.routes.ts
var router3 = Router3();
var getDynamicSiteUrl = async (req) => {
  const settings = await getSettings().catch(() => null);
  return resolveBaseUrl(req, settings);
};
var contactRateLimiter = rateLimiter("contact-submit", {
  windowMs: 15 * 60 * 1e3,
  // 15 mins
  maxRequests: 5,
  // max 5 messages per 15 minutes per IP
  message: "Submission limit reached. You can only send up to 5 messages every 15 minutes to prevent spam."
});
var unsubscribeRateLimiter = rateLimiter("unsubscribe", {
  windowMs: 10 * 60 * 1e3,
  maxRequests: 10,
  message: "Too many requests. Please try again later."
});
var smtpTestRateLimiter = rateLimiter("smtp-test", {
  windowMs: 5 * 60 * 1e3,
  maxRequests: 3,
  message: "Diagnostic rate limit reached. Please wait before testing SMTP again."
});
var INQUIRY_META = {
  freelance_project: { subjectLabel: "\u{1F6E0}\uFE0F New Freelance Inquiry", heading: "\u{1F6E0}\uFE0F New Freelance / Project Inquiry" },
  general: { subjectLabel: "\u2709\uFE0F New Message", heading: "\u2709\uFE0F New General Inquiry" },
  newsletter: { subjectLabel: "\u{1F4F0} New Newsletter Subscriber", heading: "\u{1F4F0} Quarterly Tech Dispatch Subscription" },
  unsubscribe: { subjectLabel: "\u{1F6AB} Newsletter Unsubscribe", heading: "\u{1F6AB} Newsletter Unsubscribe Request" }
};
router3.get("/smtp-status", (req, res) => {
  const configured = isSmtpConfigured();
  res.json({
    status: "ok",
    configured,
    host: process.env.SMTP_HOST || null,
    user: process.env.SMTP_USER ? `${process.env.SMTP_USER.split("@")[0]}@...` : null,
    toEmail: process.env.SMTP_TO || process.env.SMTP_USER || null
  });
});
router3.post("/test-smtp", smtpTestRateLimiter, async (req, res) => {
  try {
    if (!isSmtpConfigured()) {
      return res.status(400).json({
        success: false,
        error: "SMTP server environment parameters are unconfigured in .env."
      });
    }
    const transporter = getMailTransporter();
    const recipient = process.env.SMTP_TO || process.env.SMTP_USER;
    const senderName = process.env.SMTP_SENDER_NAME || "Rajat Kumar Dash";
    const dynamicSiteUrl = await getDynamicSiteUrl(req);
    const mailOptions = {
      from: `"${senderName} SMTP Test" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject: "\u26A1 SMTP Connection Test - Rajat Portfolio CRM",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
          <div style="padding: 30px;">
            <h2 style="color: #0284c7; margin-top: 0;">Connection Test: Successful</h2>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              Hello! This is an automated email verifying that your portfolio SMTP outbound integrations are fully functional and connected.
            </p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 12px; margin: 20px 0; border: 1px solid #f1f5f9; font-family: monospace; font-size: 12px; color: #475569;">
              <strong>SMTP Host:</strong> ${escapeHtml(process.env.SMTP_HOST || "")}<br>
              <strong>SMTP Port:</strong> ${escapeHtml(process.env.SMTP_PORT || "")}<br>
              <strong>Authenticated User:</strong> ${escapeHtml(process.env.SMTP_USER || "")}<br>
              <strong>Timestamp:</strong> ${(/* @__PURE__ */ new Date()).toISOString()}
            </div>
            <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
              This diagnostic ping was dispatched automatically from your full-stack applet container server.
            </p>
          </div>
          ${renderEmailFooter(senderName, dynamicSiteUrl)}
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: `Test email dispatched successfully to ${recipient}` });
  } catch (error) {
    console.error("SMTP Test Failure:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to dispatch test mail." });
  }
});
router3.post("/unsubscribe", unsubscribeRateLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string" || !email.includes("@") || email.length > 254) {
    return res.status(400).json({ success: false, error: "A valid email address is required to unsubscribe." });
  }
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const existingContacts = await getContacts();
    let updated = false;
    const modifiedContacts = existingContacts.map((c) => {
      if (c.email.trim().toLowerCase() === normalizedEmail) {
        updated = true;
        return { ...c, status: "unsubscribed", notes: (c.notes ? c.notes + " | " : "") + `Unsubscribed on ${(/* @__PURE__ */ new Date()).toISOString()}` };
      }
      return c;
    });
    if (!updated) {
      modifiedContacts.unshift({
        id: `unsub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: "Newsletter Unsubscriber",
        email: normalizedEmail,
        message: "User opted out from Quarterly Tech Dispatch newsletter.",
        status: "unsubscribed",
        inquiry_type: "unsubscribe",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    await saveContacts(modifiedContacts);
    if (isSmtpConfigured()) {
      try {
        const transporter = getMailTransporter();
        const senderName = process.env.SMTP_SENDER_NAME || "Rajat Kumar Dash";
        const dynamicSiteUrl = await getDynamicSiteUrl(req);
        await transporter.sendMail({
          from: `"${senderName}" <${process.env.SMTP_USER}>`,
          to: normalizedEmail,
          subject: `You have been unsubscribed - Quarterly Tech Dispatch`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
              <div style="background-color: #0f172a; padding: 25px; color: #ffffff;">
                <h2 style="margin: 0; font-size: 18px; font-weight: 800;">Subscription Preferences Updated</h2>
              </div>
              <div style="padding: 25px; color: #334155; font-size: 14px; line-height: 1.6;">
                <p>Hello,</p>
                <p>You have been successfully unsubscribed from the <strong>Quarterly Tech Dispatch</strong>. You will no longer receive newsletter broadcasts to <code>${escapeHtml(normalizedEmail)}</code>.</p>
                <p style="font-size: 13px; color: #64748b; margin-top: 20px;">If this was done by mistake, you can always re-subscribe anytime directly on the <a href="${dynamicSiteUrl}/#blog" style="color: #2563eb; font-weight: 600;">Blog Hub</a>.</p>
              </div>
              ${renderEmailFooter(senderName, dynamicSiteUrl, false)}
            </div>
          `
        });
      } catch (mailErr) {
        console.warn("Unsubscribe notification mail error:", mailErr);
      }
    }
    return res.json({
      success: true,
      message: "You have been successfully unsubscribed from the newsletter."
    });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to process unsubscribe request." });
  }
});
router3.post("/contact", contactRateLimiter, async (req, res) => {
  const { name, email, message, estimated_value, priority, inquiry_type, honeypot } = req.body;
  if (honeypot && String(honeypot).trim() !== "") {
    return res.json({
      success: true,
      smtp_active: true,
      emails_sent: true,
      message: "Inquiry registered successfully."
    });
  }
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ success: false, error: "Full Name is required." });
  }
  if (!email || typeof email !== "string" || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ success: false, error: "A valid email address is required." });
  }
  if (!message || typeof message !== "string" || message.trim().length < 5) {
    return res.status(400).json({ success: false, error: "Please write a meaningful message." });
  }
  if (name.length > 150) {
    return res.status(400).json({ success: false, error: "Name must be under 150 characters." });
  }
  if (email.length > 254) {
    return res.status(400).json({ success: false, error: "Email must be under 254 characters." });
  }
  if (message.length > 8e3) {
    return res.status(400).json({ success: false, error: "Message must be under 8,000 characters." });
  }
  const effectiveInquiryType = inquiry_type && INQUIRY_META[inquiry_type] ? inquiry_type : "general";
  if (effectiveInquiryType === "unsubscribe") {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const existingContacts = await getContacts();
      const modifiedContacts = existingContacts.map((c) => {
        if (c.email.trim().toLowerCase() === normalizedEmail) {
          return { ...c, status: "unsubscribed", notes: (c.notes ? c.notes + " | " : "") + `Unsubscribed on ${(/* @__PURE__ */ new Date()).toISOString()}` };
        }
        return c;
      });
      await saveContacts(modifiedContacts);
    } catch (err) {
      console.error("Failed to update unsubscribe status:", err);
    }
    return res.json({
      success: true,
      smtp_active: isSmtpConfigured(),
      emails_sent: false,
      message: "You have been successfully unsubscribed from the newsletter."
    });
  }
  const newContact = {
    id: `cont_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
    status: "unread",
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    ...estimated_value && typeof estimated_value === "string" ? { estimated_value: estimated_value.slice(0, 50) } : {},
    ...priority && ["low", "medium", "high"].includes(priority) ? { priority } : {},
    ...inquiry_type && INQUIRY_META[inquiry_type] ? { inquiry_type: effectiveInquiryType } : {}
  };
  try {
    const existingContacts = await getContacts();
    await saveContacts([newContact, ...existingContacts]);
  } catch (storeError) {
    console.error("Failed to persist contact to store:", storeError);
  }
  const responsePayload = {
    success: true,
    smtp_active: isSmtpConfigured(),
    emails_sent: false,
    message: effectiveInquiryType === "newsletter" ? "Newsletter subscription confirmed!" : "Inquiry registered successfully."
  };
  if (isSmtpConfigured()) {
    try {
      const transporter = getMailTransporter();
      const adminRecipient = process.env.SMTP_TO || process.env.SMTP_USER;
      const senderName = process.env.SMTP_SENDER_NAME || "Rajat Kumar Dash";
      const dynamicSiteUrl = await getDynamicSiteUrl(req);
      const safeName = escapeHtml(name.trim());
      const formattedRecipientName = escapeHtml(formatContactName(name));
      const safeEmail = escapeHtml(email.trim());
      const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br>");
      const headerSafeName = sanitizeHeaderValue(name);
      const inquiryMeta = INQUIRY_META[effectiveInquiryType] || INQUIRY_META.general;
      const subjectTag = priority === "high" ? "\u{1F525} URGENT LEAD" : inquiryMeta.subjectLabel;
      const budgetTag = estimated_value ? ` [${escapeHtml(String(estimated_value))}]` : "";
      const emailSubject = `${subjectTag}: ${headerSafeName}${budgetTag}`;
      const budgetRow = estimated_value ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 11px; text-transform: uppercase;">Estimated Budget</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #10b981; font-weight: 700; font-size: 14px;">${escapeHtml(String(estimated_value))}</td>
                </tr>` : "";
      const urgencyRow = priority ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 11px; text-transform: uppercase;">Project Urgency</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: ${priority === "high" ? "#ef4444" : priority === "medium" ? "#f59e0b" : "#64748b"}; font-weight: bold; font-size: 13px; text-transform: uppercase;">
                    ${priority === "high" ? "\u{1F525} High (Urgent)" : priority === "medium" ? "\u26A1 Medium (1-3 Mo)" : "Flexible (Low)"}
                  </td>
                </tr>` : "";
      const adminMailOptions = {
        from: `"${senderName} Portfolio" <${process.env.SMTP_USER}>`,
        to: adminRecipient,
        replyTo: email.trim(),
        subject: emailSubject,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background-color: #0f172a; padding: 25px; color: #ffffff;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #38bdf8;">Portfolio CRM</span>
              <h2 style="margin: 5px 0 0 0; font-weight: 900; font-size: 20px;">${inquiryMeta.heading}</h2>
            </div>
            <div style="padding: 30px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 11px; text-transform: uppercase; width: 120px;">Lead Name</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-weight: 600; font-size: 14px;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 11px; text-transform: uppercase;">Sender Email</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #0284c7; font-weight: 600; font-size: 14px;"><a href="mailto:${safeEmail}" style="color: #0284c7; text-decoration: none;">${safeEmail}</a></td>
                </tr>${budgetRow}${urgencyRow}
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 11px; text-transform: uppercase;">Timestamp</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 12px; font-family: monospace;">${(/* @__PURE__ */ new Date()).toLocaleString("en-IN")}</td>
                </tr>
              </table>

              <div style="margin-top: 10px;">
                <label style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 8px;">Inbound Details</label>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</div>
              </div>

              <div style="margin-top: 25px; text-align: center;">
                <a href="${dynamicSiteUrl}/#admin" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; display: inline-block;">Open CRM Console</a>
              </div>
            </div>
            <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0;">
              This notification was automatically dispatched from the portfolio server on behalf of ${escapeHtml(senderName)}.
            </div>
          </div>
        `
      };
      let userMailOptions;
      if (effectiveInquiryType === "newsletter") {
        userMailOptions = {
          from: `"${senderName}" <${process.env.SMTP_USER}>`,
          to: email.trim(),
          replyTo: adminRecipient,
          subject: `\u26A1 Welcome to Quarterly Tech Dispatch - ${senderName}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <div style="background-color: #0f172a; padding: 30px; color: #ffffff;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #38bdf8;">Engineering Tech Dispatch</span>
                <h1 style="margin: 5px 0 0 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">Welcome to Quarterly Tech Dispatch!</h1>
                <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">Curated engineering notes &amp; architectural breakdowns</p>
              </div>

              <div style="padding: 30px; color: #334155; font-size: 14px; line-height: 1.6;">
                <p style="font-size: 15px; font-weight: bold; margin-top: 0;">Hi ${formattedRecipientName},</p>

                <p>
                  Thank you for subscribing to my quarterly tech newsletter! Every quarter, I publish concise, practical deep dives covering full-stack performance tuning, test automation blueprints, and web architecture.
                </p>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin: 25px 0;">
                  <h4 style="margin: 0 0 12px 0; color: #1e293b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">\u{1F6E0}\uFE0F Explore Portfolio &amp; Insights:</h4>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">\u{1F4BB} <a href="${dynamicSiteUrl}/" style="color: #2563eb; text-decoration: none; font-weight: 600;">Technical Portfolio Home</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">\u{1F4DD} <a href="${dynamicSiteUrl}/#blog" style="color: #2563eb; text-decoration: none; font-weight: 600;">Technical Blog &amp; Articles</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">\u{1F6E0}\uFE0F <a href="${dynamicSiteUrl}/#projects" style="color: #2563eb; text-decoration: none; font-weight: 600;">Engineered Projects &amp; Case Studies</a></td>
                    </tr>
                  </table>
                </div>

                <p style="font-size: 12px; color: #64748b; font-style: italic; margin-top: 20px; margin-bottom: 0;">
                  No spam ever. If you ever wish to unsubscribe, you can do so anytime with 1 click using the link in the footer below.
                </p>
              </div>
              ${renderEmailFooter(senderName, dynamicSiteUrl, true)}
            </div>
          `
        };
      } else {
        const isFreelance = effectiveInquiryType === "freelance_project";
        const userSubject = isFreelance ? `\u{1F4EC} Project Inquiry Confirmation - ${senderName}` : `\u{1F4EC} Message Received - Confirmation from ${senderName}`;
        const userSubtitle = isFreelance ? "Your project inquiry has been received successfully." : "Your message has been received successfully.";
        const userBodyIntro = isFreelance ? "Thanks for checking out my portfolio and sharing your project proposal! This is an automated confirmation to let you know that your submission has been securely logged in my CRM." : "Thanks for checking out my website and reaching out! This is an automated confirmation to let you know that your message has been securely logged in my CRM.";
        const userBodyTimeline = isFreelance ? "I review incoming technical requirements, scopes of work, and project specifications daily. I will evaluate feasibility and get back to you personally with a detailed response within <strong>24 hours</strong>." : "I review all incoming messages and recruiter queries daily. I will get back to you personally with a detailed response within <strong>24 hours</strong>.";
        userMailOptions = {
          from: `"${senderName}" <${process.env.SMTP_USER}>`,
          to: email.trim(),
          replyTo: adminRecipient,
          subject: userSubject,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <div style="background-color: #2563eb; padding: 30px; color: #ffffff;">
                <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">Thank you for reaching out!</h1>
                <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">${userSubtitle}</p>
              </div>
              
              <div style="padding: 30px; color: #334155; font-size: 14px; line-height: 1.6;">
                <p style="font-size: 15px; font-weight: bold; margin-top: 0;">Hi ${formattedRecipientName},</p>

                <p>
                  ${userBodyIntro}
                </p>

                <p>
                  ${userBodyTimeline}
                </p>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin: 25px 0;">
                  <h4 style="margin: 0 0 12px 0; color: #1e293b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">In the meantime, explore my engineering works:</h4>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">\u{1F4BB} <a href="${dynamicSiteUrl}/" style="color: #2563eb; text-decoration: none; font-weight: 600;">Technical Portfolio Home</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">\u{1F6E0}\uFE0F <a href="${dynamicSiteUrl}/#projects" style="color: #2563eb; text-decoration: none; font-weight: 600;">QA Test Suites &amp; Case Studies</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">\u{1F4DD} <a href="${dynamicSiteUrl}/#blog" style="color: #2563eb; text-decoration: none; font-weight: 600;">Technical Blog &amp; Insights</a></td>
                    </tr>
                  </table>
                </div>

                <p style="font-size: 12px; color: #64748b; font-style: italic; margin-bottom: 0;">
                  Note: This was dispatched from my automated SMTP integration. If you want to append additional specifications, designs, or files, please feel free to reply directly to this email!
                </p>
              </div>
              ${renderEmailFooter(senderName, dynamicSiteUrl, false)}
            </div>
          `
        };
      }
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(userMailOptions)
      ]);
      responsePayload.emails_sent = true;
      responsePayload.message = effectiveInquiryType === "newsletter" ? "Subscription confirmed! A welcome email was dispatched." : "Message received. Notifications and follow-up emails successfully dispatched.";
    } catch (mailError) {
      console.error("Nodemailer dispatch failure:", mailError);
      responsePayload.smtp_error = mailError.message || "Unknown error";
      responsePayload.message = "Logged to portfolio CRM. However, SMTP notification engines failed to execute.";
    }
  }
  res.json(responsePayload);
});
var contact_routes_default = router3;

// server/routes/ai.routes.ts
import { Router as Router4 } from "express";

// server/services/aiTools.service.ts
function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}
var aiTools = {
  // -------------------------------------------------------------
  // GLOBAL OVERVIEW
  // -------------------------------------------------------------
  async getOverview() {
    const [settings, projects, blogs, certificates, contacts] = await Promise.all([
      getSettings(),
      getProjects(),
      getBlogs(),
      getCertificates(),
      getContacts()
    ]);
    return {
      success: true,
      profile: {
        name: settings.hero_name,
        title: settings.hero_tagline,
        bio: settings.hero_bio,
        company: settings.company_name,
        location: settings.contact_location,
        socials: settings.social_links
      },
      counts: {
        projects: projects.length,
        blogs: blogs.length,
        certificates: certificates.length,
        experience_items: settings.experience?.length || 0,
        education_items: settings.education?.length || 0,
        skills_categories: settings.skills?.length || 0,
        contact_messages: contacts.length
      },
      projects_summary: projects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        technologies: p.technologies
      })),
      blogs_summary: blogs.map((b) => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        status: b.status,
        published_at: b.published_at
      })),
      certificates_summary: certificates.map((c) => ({
        id: c.id,
        title: c.title,
        issuer: c.issuer
      }))
    };
  },
  // -------------------------------------------------------------
  // PROJECTS CRUD
  // -------------------------------------------------------------
  async listProjects(filter) {
    let projects = await getProjects();
    if (filter?.category) {
      const cat = filter.category.toLowerCase();
      projects = projects.filter((p) => p.category?.toLowerCase() === cat);
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      projects = projects.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.technologies?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return { success: true, count: projects.length, projects };
  },
  async getProject(idOrSlug) {
    const projects = await getProjects();
    const proj = projects.find(
      (p) => p.id === idOrSlug || p.slug === idOrSlug || p.title.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (!proj) return { success: false, error: `Project not found with identifier: ${idOrSlug}` };
    return { success: true, project: proj };
  },
  async createProject(input) {
    if (!input.title?.trim()) {
      return { success: false, error: "Project 'title' is required." };
    }
    const projects = await getProjects();
    const baseSlug = input.slug ? slugify(input.slug) : slugify(input.title);
    let finalSlug = baseSlug || `project-${Date.now()}`;
    if (projects.some((p) => p.slug === finalSlug)) {
      finalSlug = `${finalSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }
    const newProject = {
      id: `proj_${Date.now()}`,
      title: input.title.trim(),
      slug: finalSlug,
      description: input.description || "",
      category: input.category || "web-systems",
      images: input.images && input.images.length > 0 ? input.images : input.image_url ? [input.image_url] : [],
      image_url: input.image_url || input.images && input.images[0] || "",
      technologies: input.technologies || [],
      github_url: input.github_url || "",
      live_url: input.live_url || "",
      prd_url: input.prd_url || "",
      target_audience: input.target_audience || "",
      key_metric: input.key_metric || { label: "Performance", value: "+100%" },
      architecture_highlights: input.architecture_highlights || [],
      problem_statement: input.problem_statement || "",
      solution_details: input.solution_details || "",
      features: input.features || [],
      seo_title: input.seo_title || `${input.title} | Case Study`,
      seo_description: input.seo_description || input.description || "",
      seo_keywords: input.seo_keywords || "",
      is_featured: input.is_featured ?? true,
      display_order: input.display_order ?? projects.length + 1,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    projects.unshift(newProject);
    await saveProjects(projects);
    return {
      success: true,
      message: `Project '${newProject.title}' created successfully.`,
      project: newProject
    };
  },
  async updateProject(idOrSlug, updates) {
    const projects = await getProjects();
    const idx = projects.findIndex(
      (p) => p.id === idOrSlug || p.slug === idOrSlug || p.title.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (idx === -1) {
      return { success: false, error: `Project not found matching '${idOrSlug}'` };
    }
    const current = projects[idx];
    const updated = {
      ...current,
      ...updates,
      id: current.id,
      // Immutable ID
      slug: updates.slug ? slugify(updates.slug) : current.slug,
      images: updates.images || (updates.image_url ? [updates.image_url, ...current.images.slice(1)] : current.images)
    };
    projects[idx] = updated;
    await saveProjects(projects);
    return {
      success: true,
      message: `Project '${updated.title}' updated successfully.`,
      project: updated
    };
  },
  async deleteProject(idOrSlug) {
    const projects = await getProjects();
    const idx = projects.findIndex(
      (p) => p.id === idOrSlug || p.slug === idOrSlug || p.title.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (idx === -1) {
      return { success: false, error: `Project not found matching '${idOrSlug}'` };
    }
    const removed = projects.splice(idx, 1)[0];
    await saveProjects(projects);
    return {
      success: true,
      message: `Project '${removed.title}' (${removed.id}) has been deleted.`
    };
  },
  // -------------------------------------------------------------
  // BLOGS CRUD
  // -------------------------------------------------------------
  async listBlogs(filter) {
    let blogs = await getBlogs();
    if (filter?.status) {
      blogs = blogs.filter((b) => b.status === filter.status);
    }
    if (filter?.tag) {
      const t = filter.tag.toLowerCase();
      blogs = blogs.filter((b) => b.tags?.some((tg) => tg.toLowerCase() === t));
    }
    return { success: true, count: blogs.length, blogs };
  },
  async getBlog(idOrSlug) {
    const blogs = await getBlogs();
    const blog = blogs.find(
      (b) => b.id === idOrSlug || b.slug === idOrSlug || b.title.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (!blog) return { success: false, error: `Blog not found with identifier: ${idOrSlug}` };
    return { success: true, blog };
  },
  async createBlog(input) {
    if (!input.title?.trim() || !input.content_html?.trim()) {
      return { success: false, error: "Both 'title' and 'content_html' are required." };
    }
    const blogs = await getBlogs();
    const baseSlug = input.slug ? slugify(input.slug) : slugify(input.title);
    let finalSlug = baseSlug || `article-${Date.now()}`;
    if (blogs.some((b) => b.slug === finalSlug)) {
      finalSlug = `${finalSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }
    const wordsCount = input.content_html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordsCount / 200));
    const status = input.status || "published";
    const newBlog = {
      id: `blog_${Date.now()}`,
      title: input.title.trim(),
      slug: finalSlug,
      excerpt: input.excerpt || input.content_html.replace(/<[^>]*>/g, " ").slice(0, 160).trim() + "...",
      content_html: input.content_html,
      cover_image_url: input.cover_image_url || "/assets/blog-default.jpg",
      og_image_url: input.og_image_url || input.cover_image_url || "/assets/blog-default.jpg",
      seo_title: input.seo_title || input.title,
      seo_description: input.seo_description || input.excerpt || "",
      seo_keywords: input.seo_keywords || (input.tags?.join(", ") || ""),
      canonical_url: input.canonical_url || "",
      status,
      read_time_mins: input.read_time_mins || readTime,
      like_count: input.like_count || 0,
      bookmark_count: 0,
      view_count: 0,
      published_at: status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : void 0,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      tags: input.tags || ["Engineering", "Web"],
      categories: input.categories || ["General Web"]
    };
    blogs.unshift(newBlog);
    await saveBlogs(blogs);
    return {
      success: true,
      message: `Blog post '${newBlog.title}' created (${status}).`,
      blog: newBlog
    };
  },
  async updateBlog(idOrSlug, updates) {
    const blogs = await getBlogs();
    const idx = blogs.findIndex(
      (b) => b.id === idOrSlug || b.slug === idOrSlug || b.title.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (idx === -1) {
      return { success: false, error: `Blog not found matching '${idOrSlug}'` };
    }
    const current = blogs[idx];
    const willPublish = updates.status === "published" && current.status !== "published";
    const updated = {
      ...current,
      ...updates,
      id: current.id,
      slug: updates.slug ? slugify(updates.slug) : current.slug,
      published_at: willPublish ? (/* @__PURE__ */ new Date()).toISOString() : updates.published_at || current.published_at
    };
    blogs[idx] = updated;
    await saveBlogs(blogs);
    return {
      success: true,
      message: `Blog post '${updated.title}' updated successfully.`,
      blog: updated
    };
  },
  async deleteBlog(idOrSlug) {
    const blogs = await getBlogs();
    const idx = blogs.findIndex(
      (b) => b.id === idOrSlug || b.slug === idOrSlug || b.title.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (idx === -1) {
      return { success: false, error: `Blog not found matching '${idOrSlug}'` };
    }
    const removed = blogs.splice(idx, 1)[0];
    await saveBlogs(blogs);
    return {
      success: true,
      message: `Blog post '${removed.title}' (${removed.id}) deleted successfully.`
    };
  },
  // -------------------------------------------------------------
  // CERTIFICATES CRUD
  // -------------------------------------------------------------
  async listCertificates() {
    const certificates = await getCertificates();
    return { success: true, count: certificates.length, certificates };
  },
  async createCertificate(input) {
    if (!input.title?.trim() || !input.issuer?.trim()) {
      return { success: false, error: "Certificate 'title' and 'issuer' are required." };
    }
    const certificates = await getCertificates();
    const newCert = {
      id: `cert_${Date.now()}`,
      title: input.title.trim(),
      issuer: input.issuer.trim(),
      issue_date: input.issue_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      expiry_date: input.expiry_date || "",
      credential_id: input.credential_id || "",
      verify_url: input.verify_url || "",
      image_url: input.image_url || "",
      category: input.category || "web-development",
      skills: input.skills || [],
      description: input.description || "",
      score_or_grade: input.score_or_grade || "",
      is_featured: input.is_featured ?? true,
      display_order: input.display_order ?? certificates.length + 1,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    certificates.unshift(newCert);
    await saveCertificates(certificates);
    return {
      success: true,
      message: `Certificate '${newCert.title}' from ${newCert.issuer} added.`,
      certificate: newCert
    };
  },
  async updateCertificate(idOrTitle, updates) {
    const certificates = await getCertificates();
    const idx = certificates.findIndex(
      (c) => c.id === idOrTitle || c.title.toLowerCase() === idOrTitle.toLowerCase()
    );
    if (idx === -1) {
      return { success: false, error: `Certificate not found matching '${idOrTitle}'` };
    }
    const current = certificates[idx];
    const updated = {
      ...current,
      ...updates,
      id: current.id
    };
    certificates[idx] = updated;
    await saveCertificates(certificates);
    return {
      success: true,
      message: `Certificate '${updated.title}' updated.`,
      certificate: updated
    };
  },
  async deleteCertificate(idOrTitle) {
    const certificates = await getCertificates();
    const idx = certificates.findIndex(
      (c) => c.id === idOrTitle || c.title.toLowerCase() === idOrTitle.toLowerCase()
    );
    if (idx === -1) {
      return { success: false, error: `Certificate not found matching '${idOrTitle}'` };
    }
    const removed = certificates.splice(idx, 1)[0];
    await saveCertificates(certificates);
    return {
      success: true,
      message: `Certificate '${removed.title}' deleted.`
    };
  },
  // -------------------------------------------------------------
  // RESUME (EXPERIENCE, EDUCATION, SKILLS)
  // -------------------------------------------------------------
  async getResume() {
    const settings = await getSettings();
    return {
      success: true,
      name: settings.hero_name,
      title: settings.hero_tagline,
      bio: settings.hero_bio,
      location: settings.contact_location,
      experience: settings.experience || [],
      education: settings.education || [],
      skills: settings.skills || []
    };
  },
  async addExperience(exp) {
    if (!exp.company || !exp.role) {
      return { success: false, error: "Experience requires 'company' and 'role'." };
    }
    const settings = await getSettings();
    const currentExp = settings.experience || [];
    const newExp = {
      company: exp.company.trim(),
      role: exp.role.trim(),
      start_date: exp.start_date || "Present",
      end_date: exp.end_date || (exp.is_current ? "Present" : ""),
      is_current: exp.is_current ?? true,
      description: exp.description || "",
      location: exp.location || "Remote"
    };
    settings.experience = [newExp, ...currentExp];
    await saveSettings(settings);
    return {
      success: true,
      message: `Added experience: ${newExp.role} at ${newExp.company}`,
      experience: settings.experience
    };
  },
  async updateExperience(identifier, updates) {
    const settings = await getSettings();
    const currentExp = settings.experience || [];
    let idx = -1;
    if (typeof identifier === "number") {
      idx = identifier;
    } else {
      idx = currentExp.findIndex(
        (e) => e.company.toLowerCase().includes(identifier.toLowerCase()) || e.role.toLowerCase().includes(identifier.toLowerCase())
      );
    }
    if (idx < 0 || idx >= currentExp.length) {
      return { success: false, error: `Experience item not found matching '${identifier}'` };
    }
    currentExp[idx] = { ...currentExp[idx], ...updates };
    settings.experience = currentExp;
    await saveSettings(settings);
    return {
      success: true,
      message: `Updated experience at index ${idx} (${currentExp[idx].role} at ${currentExp[idx].company})`,
      experience: settings.experience
    };
  },
  async deleteExperience(identifier) {
    const settings = await getSettings();
    const currentExp = settings.experience || [];
    let idx = -1;
    if (typeof identifier === "number") {
      idx = identifier;
    } else {
      idx = currentExp.findIndex(
        (e) => e.company.toLowerCase().includes(identifier.toLowerCase()) || e.role.toLowerCase().includes(identifier.toLowerCase())
      );
    }
    if (idx < 0 || idx >= currentExp.length) {
      return { success: false, error: `Experience item not found matching '${identifier}'` };
    }
    const removed = currentExp.splice(idx, 1)[0];
    settings.experience = currentExp;
    await saveSettings(settings);
    return {
      success: true,
      message: `Deleted experience: ${removed.role} at ${removed.company}`,
      experience: settings.experience
    };
  },
  async addEducation(edu) {
    if (!edu.institution || !edu.degree) {
      return { success: false, error: "Education requires 'institution' and 'degree'." };
    }
    const settings = await getSettings();
    const currentEdu = settings.education || [];
    const newEdu = {
      institution: edu.institution.trim(),
      degree: edu.degree.trim(),
      field: edu.field || "",
      start_year: edu.start_year || (/* @__PURE__ */ new Date()).getFullYear(),
      end_year: edu.end_year,
      grade: edu.grade || ""
    };
    settings.education = [newEdu, ...currentEdu];
    await saveSettings(settings);
    return {
      success: true,
      message: `Added education: ${newEdu.degree} in ${newEdu.field} from ${newEdu.institution}`,
      education: settings.education
    };
  },
  async updateEducation(identifier, updates) {
    const settings = await getSettings();
    const currentEdu = settings.education || [];
    let idx = -1;
    if (typeof identifier === "number") {
      idx = identifier;
    } else {
      idx = currentEdu.findIndex(
        (e) => e.institution.toLowerCase().includes(identifier.toLowerCase()) || e.degree.toLowerCase().includes(identifier.toLowerCase()) || e.field.toLowerCase().includes(identifier.toLowerCase())
      );
    }
    if (idx < 0 || idx >= currentEdu.length) {
      return { success: false, error: `Education item not found matching '${identifier}'` };
    }
    currentEdu[idx] = { ...currentEdu[idx], ...updates };
    settings.education = currentEdu;
    await saveSettings(settings);
    return {
      success: true,
      message: `Updated education at index ${idx} (${currentEdu[idx].degree})`,
      education: settings.education
    };
  },
  async deleteEducation(identifier) {
    const settings = await getSettings();
    const currentEdu = settings.education || [];
    let idx = -1;
    if (typeof identifier === "number") {
      idx = identifier;
    } else {
      idx = currentEdu.findIndex(
        (e) => e.institution.toLowerCase().includes(identifier.toLowerCase()) || e.degree.toLowerCase().includes(identifier.toLowerCase())
      );
    }
    if (idx < 0 || idx >= currentEdu.length) {
      return { success: false, error: `Education item not found matching '${identifier}'` };
    }
    const removed = currentEdu.splice(idx, 1)[0];
    settings.education = currentEdu;
    await saveSettings(settings);
    return {
      success: true,
      message: `Deleted education: ${removed.degree} from ${removed.institution}`,
      education: settings.education
    };
  },
  async updateSkills(newSkills) {
    if (!Array.isArray(newSkills)) {
      return { success: false, error: "Skills must be an array of categories with items." };
    }
    const settings = await getSettings();
    settings.skills = newSkills;
    await saveSettings(settings);
    return {
      success: true,
      message: `Updated skills with ${newSkills.length} categories.`,
      skills: settings.skills
    };
  },
  // -------------------------------------------------------------
  // SITE SETTINGS & HERO / BIO / BRAND
  // -------------------------------------------------------------
  async getSettings() {
    const settings = await getSettings();
    return { success: true, settings };
  },
  async updateSettings(updates) {
    const settings = await getSettings();
    const merged = {
      ...settings,
      ...updates,
      // Deep merge social links if provided
      social_links: {
        ...settings.social_links,
        ...updates.social_links || {}
      },
      // Deep merge fourth stat if provided
      overview_fourth_stat: {
        ...settings.overview_fourth_stat,
        ...updates.overview_fourth_stat || {}
      },
      // Deep merge resume contact details if provided
      resume_contact_details: {
        ...settings.resume_contact_details || {},
        ...updates.resume_contact_details || {}
      }
    };
    await saveSettings(merged);
    return {
      success: true,
      message: "Site settings and profile successfully updated.",
      settings: merged
    };
  },
  // -------------------------------------------------------------
  // CONTACTS & LEADS
  // -------------------------------------------------------------
  async listContacts() {
    const contacts = await getContacts();
    return { success: true, count: contacts.length, contacts };
  },
  async createContactLead(input) {
    if (!input.name || !input.email || !input.message) {
      return { success: false, error: "Lead requires 'name', 'email', and 'message'." };
    }
    const contacts = await getContacts();
    const newContact = {
      id: `lead_${Date.now()}`,
      name: input.name,
      email: input.email,
      message: input.message,
      status: "unread",
      priority: "high",
      inquiry_type: input.inquiry_type || "freelance_project",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      notes: "Received via ChatGPT / AI Agent MCP Integration"
    };
    contacts.unshift(newContact);
    await saveContacts(contacts);
    return {
      success: true,
      message: `Lead recorded from ${newContact.name} (${newContact.email}).`,
      contact: newContact
    };
  }
};

// server/routes/ai.routes.ts
var router4 = Router4();
function generateOpenApiSpec(req) {
  const host = req.get("host") || "localhost:3000";
  const protocol = req.protocol || "http";
  const baseUrl = `${protocol}://${host}`;
  return {
    openapi: "3.0.3",
    info: {
      title: "Rajat Kumar Dash Portfolio & Content CMS Management API",
      description: "Full programmatic access for ChatGPT Custom GPTs, Claude Desktop, and AI Agents to create, update, delete, and manage projects, case studies, blogs, certifications, resume work experiences, education history, skills, and site settings.",
      version: "1.0.0",
      contact: {
        name: "Rajat Kumar Dash",
        email: "rajat.pilgrimpackages@gmail.com"
      }
    },
    servers: [
      {
        url: baseUrl,
        description: "Active Portfolio Server"
      }
    ],
    security: [
      { BearerAuth: [] },
      { ApiKeyAuth: [] }
    ],
    paths: {
      "/api/ai/overview": {
        get: {
          operationId: "getPortfolioOverview",
          summary: "Get full portfolio summary, counts, and active catalog overview",
          description: "Returns an executive summary of current projects, blogs, certificates, experience items, and profile details.",
          responses: {
            "200": { description: "Portfolio overview data retrieved." },
            "401": { description: "Unauthorized access. Provide a valid API key." }
          }
        }
      },
      "/api/ai/projects": {
        get: {
          operationId: "listProjects",
          summary: "List all portfolio projects & case studies",
          parameters: [
            { name: "category", in: "query", schema: { type: "string" }, description: "Filter by category (e.g., product-management, web-systems, machine-learning)" },
            { name: "query", in: "query", schema: { type: "string" }, description: "Search query across titles and technologies" }
          ],
          responses: {
            "200": { description: "Array of portfolio projects." }
          }
        },
        post: {
          operationId: "createProject",
          summary: "Create a new project or case study",
          description: "Adds a new project into the portfolio catalog with technologies, PRD links, architecture highlights, and metrics.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title"],
                  properties: {
                    title: { type: "string", example: "AI Model Gateway & Analytics" },
                    description: { type: "string", example: "High-throughput API reverse proxy with rate limiting and usage tracking." },
                    category: { type: "string", example: "product-management", enum: ["product-management", "web-systems", "machine-learning", "automation", "cybersecurity", "data-bi"] },
                    technologies: { type: "array", items: { type: "string" }, example: ["TypeScript", "Node.js", "Redis", "Docker"] },
                    problem_statement: { type: "string" },
                    solution_details: { type: "string" },
                    features: { type: "array", items: { type: "string" } },
                    architecture_highlights: { type: "array", items: { type: "string" } },
                    image_url: { type: "string" },
                    images: { type: "array", items: { type: "string" } },
                    github_url: { type: "string" },
                    live_url: { type: "string" },
                    prd_url: { type: "string" },
                    is_featured: { type: "boolean", default: true }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Project created successfully." }
          }
        }
      },
      "/api/ai/projects/{id}": {
        get: {
          operationId: "getProjectById",
          summary: "Get a specific project by ID or slug",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Project ID (e.g. proj_123) or URL slug" }
          ],
          responses: {
            "200": { description: "Project details." },
            "404": { description: "Project not found." }
          }
        },
        put: {
          operationId: "updateProject",
          summary: "Update an existing project by ID or slug",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Project ID or slug" }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    category: { type: "string" },
                    technologies: { type: "array", items: { type: "string" } },
                    problem_statement: { type: "string" },
                    solution_details: { type: "string" },
                    features: { type: "array", items: { type: "string" } },
                    architecture_highlights: { type: "array", items: { type: "string" } },
                    image_url: { type: "string" },
                    images: { type: "array", items: { type: "string" } },
                    github_url: { type: "string" },
                    live_url: { type: "string" },
                    prd_url: { type: "string" },
                    is_featured: { type: "boolean" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Project updated." }
          }
        },
        delete: {
          operationId: "deleteProject",
          summary: "Delete a project by ID or slug",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } }
          ],
          responses: {
            "200": { description: "Project deleted." }
          }
        }
      },
      "/api/ai/blogs": {
        get: {
          operationId: "listBlogs",
          summary: "List all published and draft blog articles",
          parameters: [
            { name: "status", in: "query", schema: { type: "string", enum: ["published", "draft", "archived"] } },
            { name: "tag", in: "query", schema: { type: "string" } }
          ],
          responses: {
            "200": { description: "List of blog articles." }
          }
        },
        post: {
          operationId: "createBlog",
          summary: "Create and publish a new blog post",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "content_html"],
                  properties: {
                    title: { type: "string", example: "Scaling React & Next.js for Enterprise Workloads" },
                    content_html: { type: "string", description: "HTML or rich text content of the article" },
                    excerpt: { type: "string" },
                    status: { type: "string", enum: ["published", "draft"], default: "published" },
                    tags: { type: "array", items: { type: "string" }, example: ["React", "Performance", "Web Architecture"] },
                    categories: { type: "array", items: { type: "string" }, example: ["Engineering"] },
                    cover_image_url: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Blog post created." }
          }
        }
      },
      "/api/ai/blogs/{id}": {
        get: {
          operationId: "getBlogById",
          summary: "Get blog article details and full HTML content",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Blog article details." }
          }
        },
        put: {
          operationId: "updateBlog",
          summary: "Update an existing blog article",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    content_html: { type: "string" },
                    excerpt: { type: "string" },
                    status: { type: "string", enum: ["published", "draft", "archived"] },
                    tags: { type: "array", items: { type: "string" } },
                    categories: { type: "array", items: { type: "string" } },
                    cover_image_url: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Blog article updated." }
          }
        },
        delete: {
          operationId: "deleteBlog",
          summary: "Delete a blog article",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Blog deleted." }
          }
        }
      },
      "/api/ai/certificates": {
        get: {
          operationId: "listCertificates",
          summary: "List all verified certificates & professional credentials",
          responses: { "200": { description: "List of certificates." } }
        },
        post: {
          operationId: "createCertificate",
          summary: "Add a new certificate or credential",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "issuer"],
                  properties: {
                    title: { type: "string", example: "Google Cloud Certified Professional Architect" },
                    issuer: { type: "string", example: "Google Cloud" },
                    issue_date: { type: "string", example: "2026-03-15" },
                    credential_id: { type: "string" },
                    verify_url: { type: "string" },
                    skills: { type: "array", items: { type: "string" }, example: ["Cloud Architecture", "GCP", "Kubernetes"] },
                    category: { type: "string", enum: ["cybersecurity", "web-development", "data-science", "machine-learning", "seo-digital-marketing", "cloud", "other"] }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Certificate added." } }
        }
      },
      "/api/ai/certificates/{id}": {
        put: {
          operationId: "updateCertificate",
          summary: "Update an existing certificate",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    issuer: { type: "string" },
                    issue_date: { type: "string" },
                    verify_url: { type: "string" },
                    skills: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Certificate updated." } }
        },
        delete: {
          operationId: "deleteCertificate",
          summary: "Delete a certificate",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Certificate deleted." } }
        }
      },
      "/api/ai/resume": {
        get: {
          operationId: "getResumeData",
          summary: "Get full resume data (work experience, education, skills, bio)",
          responses: { "200": { description: "Resume payload." } }
        }
      },
      "/api/ai/resume/experience": {
        post: {
          operationId: "addWorkExperience",
          summary: "Add a new work experience item to the resume",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["company", "role"],
                  properties: {
                    company: { type: "string", example: "QM Labs" },
                    role: { type: "string", example: "Lead Technical Product Manager" },
                    start_date: { type: "string", example: "Jan 2024" },
                    end_date: { type: "string", example: "Present" },
                    is_current: { type: "boolean", default: true },
                    description: { type: "string", example: "Spearheaded technical product roadmaps, cross-functional sprints, and enterprise architectures." },
                    location: { type: "string", example: "Remote / Hybrid" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Experience added." } }
        }
      },
      "/api/ai/resume/experience/{index}": {
        put: {
          operationId: "updateWorkExperience",
          summary: "Update work experience by index or company/role name",
          parameters: [{ name: "index", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    company: { type: "string" },
                    role: { type: "string" },
                    start_date: { type: "string" },
                    end_date: { type: "string" },
                    is_current: { type: "boolean" },
                    description: { type: "string" },
                    location: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Experience updated." } }
        },
        delete: {
          operationId: "deleteWorkExperience",
          summary: "Delete work experience by index or company name",
          parameters: [{ name: "index", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Experience removed." } }
        }
      },
      "/api/ai/resume/education": {
        post: {
          operationId: "addEducation",
          summary: "Add an education or university degree to the resume",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["institution", "degree"],
                  properties: {
                    institution: { type: "string", example: "Symbiosis Institute of Management Studies" },
                    degree: { type: "string", example: "MBA in Product Management & Digital Strategy" },
                    field: { type: "string", example: "Product Management" },
                    start_year: { type: "integer", example: 2024 },
                    end_year: { type: "integer", example: 2026 },
                    grade: { type: "string", example: "First Class" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Education added." } }
        }
      },
      "/api/ai/resume/education/{index}": {
        put: {
          operationId: "updateEducation",
          summary: "Update education item by index or institution name",
          parameters: [{ name: "index", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    institution: { type: "string" },
                    degree: { type: "string" },
                    field: { type: "string" },
                    start_year: { type: "integer" },
                    end_year: { type: "integer" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Education updated." } }
        },
        delete: {
          operationId: "deleteEducation",
          summary: "Delete education item by index or institution name",
          parameters: [{ name: "index", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Education deleted." } }
        }
      },
      "/api/ai/resume/skills": {
        put: {
          operationId: "updateSkillsCatalog",
          summary: "Update or replace categorized technical skills",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["skills"],
                  properties: {
                    skills: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          category: { type: "string", example: "Product & Strategy" },
                          items: { type: "array", items: { type: "string" }, example: ["PRD Writing", "User Journey Mapping", "Agile Sprints"] }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Skills updated." } }
        }
      },
      "/api/ai/settings": {
        get: {
          operationId: "getSiteSettings",
          summary: "Get site profile, hero headline, bio, contact details, and SEO tags",
          responses: { "200": { description: "Site settings." } }
        },
        patch: {
          operationId: "updateSiteSettings",
          summary: "Update hero headlines, about text, SEO tags, or social links",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    hero_name: { type: "string" },
                    hero_tagline: { type: "string" },
                    hero_bio: { type: "string" },
                    about_text: { type: "string" },
                    company_name: { type: "string" },
                    company_tagline: { type: "string" },
                    company_bio: { type: "string" },
                    contact_email: { type: "string" },
                    contact_location: { type: "string" },
                    seo_home_title: { type: "string" },
                    seo_home_description: { type: "string" },
                    resume_custom_titles: { type: "object", additionalProperties: { type: "string" }, description: "Custom resume persona titles keyed by persona ID" },
                    resume_custom_summaries: { type: "object", additionalProperties: { type: "string" }, description: "Custom resume persona summaries keyed by persona ID" },
                    resume_custom_categories: { type: "object", additionalProperties: { type: "string" }, description: "Custom technical skill category names" },
                    seo_home_keywords: { type: "string" },
                    custom_domain: { type: "string" },
                    social_links: {
                      type: "object",
                      properties: {
                        github: { type: "string" },
                        linkedin: { type: "string" },
                        twitter: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Settings updated." } }
        }
      },
      "/api/ai/contacts": {
        get: {
          operationId: "listContactInquiries",
          summary: "List inquiries and discovery calls submitted through the website",
          responses: { "200": { description: "Contact submissions." } }
        },
        post: {
          operationId: "submitLeadFromAi",
          summary: "Record a new discovery lead or inquiry originating from ChatGPT / AI conversation",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "message"],
                  properties: {
                    name: { type: "string", example: "John Smith" },
                    email: { type: "string", example: "john@techcorp.com" },
                    message: { type: "string", example: "Interested in hiring Rajat for Technical Product Management role." },
                    inquiry_type: { type: "string", default: "freelance_project" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Lead recorded." } }
        }
      },
      "/api/ai/execute": {
        post: {
          operationId: "executeUnifiedAiCommand",
          summary: "Execute an intent-based action in a single call",
          description: "Allows ChatGPT or autonomous agents to send structured actions (e.g. create_project, update_bio, add_experience, publish_blog).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["action", "payload"],
                  properties: {
                    action: {
                      type: "string",
                      enum: [
                        "create_project",
                        "update_project",
                        "delete_project",
                        "create_blog",
                        "update_blog",
                        "delete_blog",
                        "create_certificate",
                        "add_experience",
                        "update_experience",
                        "delete_experience",
                        "add_education",
                        "update_education",
                        "update_skills",
                        "update_settings",
                        "submit_lead"
                      ]
                    },
                    payload: { type: "object", description: "Arguments for the selected action" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Action executed successfully." } }
        }
      }
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "Provide your AI Management Key in the 'x-api-key' header."
        },
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT/Key",
          description: "Provide your AI Key as a Bearer Token (Authorization: Bearer <KEY>)."
        }
      }
    }
  };
}
router4.get("/openapi.json", (req, res) => {
  res.json(generateOpenApiSpec(req));
});
router4.get("/status", async (req, res) => {
  const currentKey = await getActiveAiApiKey();
  const maskedKey = currentKey ? `${currentKey.slice(0, 6)}...${currentKey.slice(-4)}` : "Not Configured";
  const baseUrl = resolveBaseUrl(req);
  res.json({
    success: true,
    name: "Rajat Kumar Dash AI & ChatGPT / MCP CMS Engine",
    status: "online",
    authentication: {
      configured: !!currentKey,
      masked_key: maskedKey,
      supported_methods: ["Header: x-api-key", "Header: Authorization: Bearer <KEY>", "Query: ?api_key=<KEY>"]
    },
    chatgpt: {
      openapi_spec_url: `${baseUrl}/api/openapi.json`,
      instructions: "In ChatGPT Custom GPT Builder -> Actions -> Import URL -> Paste the openapi_spec_url."
    },
    mcp: {
      server_url: `${baseUrl}/api/mcp`,
      transport: ["JSON-RPC 2.0 (POST)", "Server-Sent Events (SSE) (GET)"]
    }
  });
});
router4.use(requireAiOrAdminAuth);
router4.get("/overview", async (req, res) => {
  try {
    const data = await aiTools.getOverview();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.get("/projects", async (req, res) => {
  try {
    const { category, query } = req.query;
    const data = await aiTools.listProjects({ category, query });
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.get("/projects/:id", async (req, res) => {
  try {
    const data = await aiTools.getProject(req.params.id);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.post("/projects", async (req, res) => {
  try {
    const data = await aiTools.createProject(req.body);
    if (!data.success) return res.status(400).json(data);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.put("/projects/:id", async (req, res) => {
  try {
    const data = await aiTools.updateProject(req.params.id, req.body);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.delete("/projects/:id", async (req, res) => {
  try {
    const data = await aiTools.deleteProject(req.params.id);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.get("/blogs", async (req, res) => {
  try {
    const { status, tag } = req.query;
    const data = await aiTools.listBlogs({ status, tag });
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.get("/blogs/:id", async (req, res) => {
  try {
    const data = await aiTools.getBlog(req.params.id);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.post("/blogs", async (req, res) => {
  try {
    const data = await aiTools.createBlog(req.body);
    if (!data.success) return res.status(400).json(data);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.put("/blogs/:id", async (req, res) => {
  try {
    const data = await aiTools.updateBlog(req.params.id, req.body);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.delete("/blogs/:id", async (req, res) => {
  try {
    const data = await aiTools.deleteBlog(req.params.id);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.get("/certificates", async (req, res) => {
  try {
    const data = await aiTools.listCertificates();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.post("/certificates", async (req, res) => {
  try {
    const data = await aiTools.createCertificate(req.body);
    if (!data.success) return res.status(400).json(data);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.put("/certificates/:id", async (req, res) => {
  try {
    const data = await aiTools.updateCertificate(req.params.id, req.body);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.delete("/certificates/:id", async (req, res) => {
  try {
    const data = await aiTools.deleteCertificate(req.params.id);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.get("/resume", async (req, res) => {
  try {
    const data = await aiTools.getResume();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.post("/resume/experience", async (req, res) => {
  try {
    const data = await aiTools.addExperience(req.body);
    if (!data.success) return res.status(400).json(data);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.put("/resume/experience/:index", async (req, res) => {
  try {
    const numIdx = parseInt(req.params.index, 10);
    const identifier = isNaN(numIdx) ? req.params.index : numIdx;
    const data = await aiTools.updateExperience(identifier, req.body);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.delete("/resume/experience/:index", async (req, res) => {
  try {
    const numIdx = parseInt(req.params.index, 10);
    const identifier = isNaN(numIdx) ? req.params.index : numIdx;
    const data = await aiTools.deleteExperience(identifier);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.post("/resume/education", async (req, res) => {
  try {
    const data = await aiTools.addEducation(req.body);
    if (!data.success) return res.status(400).json(data);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.put("/resume/education/:index", async (req, res) => {
  try {
    const numIdx = parseInt(req.params.index, 10);
    const identifier = isNaN(numIdx) ? req.params.index : numIdx;
    const data = await aiTools.updateEducation(identifier, req.body);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.delete("/resume/education/:index", async (req, res) => {
  try {
    const numIdx = parseInt(req.params.index, 10);
    const identifier = isNaN(numIdx) ? req.params.index : numIdx;
    const data = await aiTools.deleteEducation(identifier);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.put("/resume/skills", async (req, res) => {
  try {
    const skills = req.body.skills || req.body;
    const data = await aiTools.updateSkills(skills);
    if (!data.success) return res.status(400).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.get("/settings", async (req, res) => {
  try {
    const data = await aiTools.getSettings();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.patch("/settings", async (req, res) => {
  try {
    const data = await aiTools.updateSettings(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.get("/contacts", async (req, res) => {
  try {
    const data = await aiTools.listContacts();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.post("/contacts", async (req, res) => {
  try {
    const data = await aiTools.createContactLead(req.body);
    if (!data.success) return res.status(400).json(data);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router4.post("/execute", async (req, res) => {
  const { action, payload } = req.body;
  if (!action) return res.status(400).json({ success: false, error: "Missing 'action' parameter." });
  try {
    let result;
    switch (action) {
      case "create_project":
        result = await aiTools.createProject(payload);
        break;
      case "update_project":
        result = await aiTools.updateProject(payload.id || payload.slug, payload);
        break;
      case "delete_project":
        result = await aiTools.deleteProject(payload.id || payload.slug);
        break;
      case "create_blog":
        result = await aiTools.createBlog(payload);
        break;
      case "update_blog":
        result = await aiTools.updateBlog(payload.id || payload.slug, payload);
        break;
      case "delete_blog":
        result = await aiTools.deleteBlog(payload.id || payload.slug);
        break;
      case "create_certificate":
        result = await aiTools.createCertificate(payload);
        break;
      case "add_experience":
        result = await aiTools.addExperience(payload);
        break;
      case "update_experience":
        result = await aiTools.updateExperience(payload.index ?? payload.identifier ?? payload.company, payload);
        break;
      case "delete_experience":
        result = await aiTools.deleteExperience(payload.index ?? payload.identifier ?? payload.company);
        break;
      case "add_education":
        result = await aiTools.addEducation(payload);
        break;
      case "update_education":
        result = await aiTools.updateEducation(payload.index ?? payload.identifier ?? payload.institution, payload);
        break;
      case "update_skills":
        result = await aiTools.updateSkills(payload.skills || payload);
        break;
      case "update_settings":
        result = await aiTools.updateSettings(payload);
        break;
      case "submit_lead":
        result = await aiTools.createContactLead(payload);
        break;
      default:
        return res.status(400).json({ success: false, error: `Unsupported action '${action}'` });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
var activeMcpSseClients = /* @__PURE__ */ new Map();
setInterval(() => {
  const now = Date.now();
  for (const [id, client2] of activeMcpSseClients.entries()) {
    if (now - client2.createdAt > 1e3 * 60 * 60) {
      try {
        client2.res.end();
      } catch {
      }
      activeMcpSseClients.delete(id);
    }
  }
}, 6e4);
var MCP_TOOLS_CATALOG = [
  {
    name: "get_portfolio_overview",
    description: "Get full executive overview of projects, blogs, certificates, and profile bio.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "list_projects",
    description: "List projects in the portfolio with category and query filtering.",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Filter by category (e.g. product-management, web-systems, machine-learning)" },
        query: { type: "string", description: "Keyword search" }
      }
    }
  },
  {
    name: "create_project",
    description: "Add a new project/case study to the portfolio.",
    inputSchema: {
      type: "object",
      required: ["title"],
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        category: { type: "string" },
        technologies: { type: "array", items: { type: "string" } },
        problem_statement: { type: "string" },
        solution_details: { type: "string" },
        features: { type: "array", items: { type: "string" } },
        architecture_highlights: { type: "array", items: { type: "string" } },
        image_url: { type: "string" },
        github_url: { type: "string" },
        live_url: { type: "string" },
        prd_url: { type: "string" }
      }
    }
  },
  {
    name: "update_project",
    description: "Update an existing project by ID or slug.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        category: { type: "string" },
        technologies: { type: "array", items: { type: "string" } },
        features: { type: "array", items: { type: "string" } },
        architecture_highlights: { type: "array", items: { type: "string" } },
        image_url: { type: "string" },
        github_url: { type: "string" },
        live_url: { type: "string" }
      }
    }
  },
  {
    name: "delete_project",
    description: "Delete a project from the portfolio.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "string" } }
    }
  },
  {
    name: "list_blogs",
    description: "List technical blogs with optional status or tag filtering.",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["published", "draft"] },
        tag: { type: "string" }
      }
    }
  },
  {
    name: "create_blog",
    description: "Write and publish a new blog post.",
    inputSchema: {
      type: "object",
      required: ["title", "content_html"],
      properties: {
        title: { type: "string" },
        content_html: { type: "string" },
        excerpt: { type: "string" },
        status: { type: "string", enum: ["published", "draft"] },
        tags: { type: "array", items: { type: "string" } }
      }
    }
  },
  {
    name: "update_blog",
    description: "Update an existing blog post.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        content_html: { type: "string" },
        status: { type: "string" },
        tags: { type: "array", items: { type: "string" } }
      }
    }
  },
  {
    name: "delete_blog",
    description: "Delete a blog post.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "string" } }
    }
  },
  {
    name: "list_certificates",
    description: "List verified credentials and certifications.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "create_certificate",
    description: "Add a verified credential/certificate.",
    inputSchema: {
      type: "object",
      required: ["title", "issuer"],
      properties: {
        title: { type: "string" },
        issuer: { type: "string" },
        issue_date: { type: "string" },
        expiry_date: { type: "string" },
        credential_id: { type: "string" },
        verify_url: { type: "string" },
        skills: { type: "array", items: { type: "string" } },
        description: { type: "string" }
      }
    }
  },
  {
    name: "update_certificate",
    description: "Update an existing certificate by ID or title.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Certificate ID or exact title" },
        title: { type: "string" },
        issuer: { type: "string" },
        issue_date: { type: "string" },
        expiry_date: { type: "string" },
        credential_id: { type: "string" },
        verify_url: { type: "string" },
        skills: { type: "array", items: { type: "string" } },
        description: { type: "string" }
      }
    }
  },
  {
    name: "delete_certificate",
    description: "Delete a certificate from the portfolio by ID or title.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "string", description: "Certificate ID or title" } }
    }
  },
  {
    name: "get_resume",
    description: "Get full resume data including work experience, education, and skills.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "add_work_experience",
    description: "Add a work experience item to the resume.",
    inputSchema: {
      type: "object",
      required: ["company", "role"],
      properties: {
        company: { type: "string" },
        role: { type: "string" },
        start_date: { type: "string" },
        end_date: { type: "string" },
        is_current: { type: "boolean" },
        description: { type: "string" },
        location: { type: "string" }
      }
    }
  },
  {
    name: "update_work_experience",
    description: "Update an existing work experience item by company name or index.",
    inputSchema: {
      type: "object",
      required: ["identifier"],
      properties: {
        identifier: { type: "string", description: "Company name, role, or array index number" },
        company: { type: "string" },
        role: { type: "string" },
        start_date: { type: "string" },
        end_date: { type: "string" },
        is_current: { type: "boolean" },
        description: { type: "string" },
        location: { type: "string" }
      }
    }
  },
  {
    name: "add_education",
    description: "Add an academic degree / university education record to the resume.",
    inputSchema: {
      type: "object",
      required: ["institution", "degree"],
      properties: {
        institution: { type: "string" },
        degree: { type: "string" },
        field: { type: "string" },
        start_year: { type: "integer" },
        end_year: { type: "integer" },
        grade: { type: "string" }
      }
    }
  },
  {
    name: "update_education",
    description: "Update an existing education record by institution name or index.",
    inputSchema: {
      type: "object",
      required: ["identifier"],
      properties: {
        identifier: { type: "string", description: "Institution name, degree, or array index number" },
        institution: { type: "string" },
        degree: { type: "string" },
        field: { type: "string" },
        start_year: { type: "integer" },
        end_year: { type: "integer" },
        grade: { type: "string" }
      }
    }
  },
  {
    name: "update_skills",
    description: "Update or replace categorized technical skills catalog on resume.",
    inputSchema: {
      type: "object",
      required: ["skills"],
      properties: {
        skills: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: { type: "string" },
              items: { type: "array", items: { type: "string" } }
            }
          }
        }
      }
    }
  },
  {
    name: "update_site_settings",
    description: "Update hero headlines, about summary, SEO metadata, or social connections.",
    inputSchema: {
      type: "object",
      properties: {
        hero_name: { type: "string" },
        hero_tagline: { type: "string" },
        hero_bio: { type: "string" },
        about_text: { type: "string" },
        company_name: { type: "string" },
        company_tagline: { type: "string" },
        contact_email: { type: "string" },
        contact_location: { type: "string" },
        seo_home_title: { type: "string" },
        seo_home_description: { type: "string" },
        resume_custom_titles: { type: "object", additionalProperties: { type: "string" }, description: "Custom resume persona titles keyed by persona ID" },
        resume_custom_summaries: { type: "object", additionalProperties: { type: "string" }, description: "Custom resume persona summaries keyed by persona ID" },
        resume_custom_categories: { type: "object", additionalProperties: { type: "string" }, description: "Custom technical skill category names" }
      }
    }
  }
];
var handleMcpGetRequest = async (req, res) => {
  const acceptsSse = req.headers.accept?.includes("text/event-stream") || req.query.transport === "sse" || req.path.includes("sse");
  if (acceptsSse) {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "X-Accel-Buffering": "no"
    });
    const endpointPath = `/api/mcp?sessionId=${sessionId}`;
    res.write(`event: endpoint
data: ${endpointPath}

`);
    const interval = setInterval(() => {
      try {
        res.write(": keep-alive\n\n");
      } catch {
        clearInterval(interval);
      }
    }, 15e3);
    activeMcpSseClients.set(sessionId, { id: sessionId, res, createdAt: Date.now() });
    req.on("close", () => {
      clearInterval(interval);
      activeMcpSseClients.delete(sessionId);
    });
    return;
  }
  res.json({
    status: "online",
    name: "rajat-dash-portfolio-mcp",
    protocolVersion: "2024-11-05",
    transports: ["streamable-http", "sse", "json-rpc-2.0"],
    endpoints: {
      mcp_url: "/api/mcp",
      sse_url: "/api/mcp?transport=sse",
      openapi_url: "/api/openapi.json"
    },
    toolsCount: MCP_TOOLS_CATALOG.length,
    capabilities: {
      tools: { listChanged: false },
      resources: { subscribe: false, listChanged: false },
      prompts: { listChanged: false }
    }
  });
};
var handleMcpPostRequest = async (req, res) => {
  const { jsonrpc, id, method, params } = req.body || {};
  const sessionId = req.query.sessionId || req.headers["mcp-session-id"];
  if (method === "notifications/initialized" || method === "initialized") {
    if (id !== void 0) {
      return res.json({ jsonrpc: "2.0", id, result: {} });
    }
    return res.status(200).json({ jsonrpc: "2.0" });
  }
  if (jsonrpc !== "2.0" && method !== "initialize") {
    return res.status(400).json({
      jsonrpc: "2.0",
      id: id || null,
      error: { code: -32600, message: "Invalid Request: jsonrpc must be '2.0'" }
    });
  }
  try {
    let responseData = null;
    switch (method) {
      case "initialize":
        responseData = {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: {
            protocolVersion: params?.protocolVersion || "2024-11-05",
            serverInfo: {
              name: "rajat-dash-portfolio-mcp",
              version: "1.0.0"
            },
            capabilities: {
              tools: { listChanged: false },
              resources: { subscribe: false, listChanged: false },
              prompts: { listChanged: false }
            }
          }
        };
        break;
      case "ping":
        responseData = {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: {}
        };
        break;
      case "tools/list":
        responseData = {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: {
            tools: MCP_TOOLS_CATALOG
          }
        };
        break;
      case "tools/call": {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};
        let output;
        switch (toolName) {
          case "get_portfolio_overview":
            output = await aiTools.getOverview();
            break;
          case "list_projects":
            output = await aiTools.listProjects(toolArgs);
            break;
          case "create_project":
            output = await aiTools.createProject(toolArgs);
            break;
          case "update_project":
          case "edit_project":
            output = await aiTools.updateProject(toolArgs.id || toolArgs.slug || toolArgs.title, toolArgs);
            break;
          case "delete_project":
            output = await aiTools.deleteProject(toolArgs.id || toolArgs.slug || toolArgs.title);
            break;
          case "list_blogs":
            output = await aiTools.listBlogs(toolArgs);
            break;
          case "create_blog":
            output = await aiTools.createBlog(toolArgs);
            break;
          case "update_blog":
          case "edit_blog":
            output = await aiTools.updateBlog(toolArgs.id || toolArgs.slug || toolArgs.title, toolArgs);
            break;
          case "delete_blog":
            output = await aiTools.deleteBlog(toolArgs.id || toolArgs.slug || toolArgs.title);
            break;
          case "list_certificates":
            output = await aiTools.listCertificates();
            break;
          case "create_certificate":
            output = await aiTools.createCertificate(toolArgs);
            break;
          case "update_certificate":
          case "edit_certificate":
            output = await aiTools.updateCertificate(toolArgs.id || toolArgs.title, toolArgs);
            break;
          case "delete_certificate":
            output = await aiTools.deleteCertificate(toolArgs.id || toolArgs.title);
            break;
          case "get_resume":
            output = await aiTools.getResume();
            break;
          case "add_work_experience":
            output = await aiTools.addExperience(toolArgs);
            break;
          case "update_work_experience":
          case "edit_work_experience":
            output = await aiTools.updateExperience(toolArgs.identifier ?? toolArgs.index ?? toolArgs.company, toolArgs);
            break;
          case "delete_work_experience":
            output = await aiTools.deleteExperience(toolArgs.identifier ?? toolArgs.index ?? toolArgs.company);
            break;
          case "add_education":
            output = await aiTools.addEducation(toolArgs);
            break;
          case "update_education":
          case "edit_education":
            output = await aiTools.updateEducation(toolArgs.identifier ?? toolArgs.index ?? toolArgs.institution, toolArgs);
            break;
          case "delete_education":
            output = await aiTools.deleteEducation(toolArgs.identifier ?? toolArgs.index ?? toolArgs.institution);
            break;
          case "update_skills":
          case "edit_skills":
            output = await aiTools.updateSkills(toolArgs.skills || toolArgs);
            break;
          case "update_site_settings":
          case "edit_site_settings":
            output = await aiTools.updateSettings(toolArgs);
            break;
          default:
            return res.status(404).json({
              jsonrpc: "2.0",
              id,
              error: { code: -32601, message: `Tool '${toolName}' not found` }
            });
        }
        responseData = {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: {
            content: [{ type: "text", text: JSON.stringify(output, null, 2) }]
          }
        };
        break;
      }
      case "resources/list":
        responseData = {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: { resources: [] }
        };
        break;
      case "prompts/list":
        responseData = {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: { prompts: [] }
        };
        break;
      default:
        responseData = {
          jsonrpc: "2.0",
          id: id || null,
          error: { code: -32601, message: `Method '${method}' not found` }
        };
        break;
    }
    if (sessionId && activeMcpSseClients.has(sessionId)) {
      const client2 = activeMcpSseClients.get(sessionId);
      try {
        client2?.res.write(`event: message
data: ${JSON.stringify(responseData)}

`);
      } catch {
      }
    }
    return res.json(responseData);
  } catch (err) {
    return res.status(500).json({
      jsonrpc: "2.0",
      id: id || null,
      error: { code: -32603, message: `Internal error: ${err.message}` }
    });
  }
};
var mcpRouter = Router4();
mcpRouter.get("/", handleMcpGetRequest);
mcpRouter.get("/*", handleMcpGetRequest);
mcpRouter.post("/", handleMcpPostRequest);
mcpRouter.post("/*", handleMcpPostRequest);
var ai_routes_default = router4;

// server/routes/index.ts
var router5 = Router5();
router5.get("/openapi.json", (req, res) => {
  res.json(generateOpenApiSpec(req));
});
router5.use("/mcp", mcpRouter);
router5.use("/sse", mcpRouter);
router5.use("/ai", ai_routes_default);
router5.use("/admin", admin_routes_default);
router5.use("/", contact_routes_default);
router5.use("/", public_routes_default);
var routes_default = router5;

// server/routes/root.routes.ts
import { Router as Router6 } from "express";
var router6 = Router6();
router6.get("/openapi.json", (req, res) => {
  res.json(generateOpenApiSpec(req));
});
router6.get("/mcp", handleMcpGetRequest);
router6.get("/mcp/*", handleMcpGetRequest);
router6.get("/sse", handleMcpGetRequest);
router6.get("/sse/*", handleMcpGetRequest);
router6.post("/mcp", handleMcpPostRequest);
router6.post("/mcp/*", handleMcpPostRequest);
router6.post("/sse", handleMcpPostRequest);
router6.post("/sse/*", handleMcpPostRequest);
router6.get("/sitemap.xml", async (req, res) => {
  const userAgent = req.headers["user-agent"] || "";
  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
  recordBotCrawl(userAgent, "/sitemap.xml", "GET", 200, clientIp, 18);
  try {
    const [settings, projects, blogs] = await Promise.all([
      getSettings().catch(() => null),
      getProjects().catch(() => []),
      getBlogs().catch(() => [])
    ]);
    const baseUrl = resolveBaseUrl(req, settings);
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const staticPages = [
      { loc: `${baseUrl}/`, lastmod: today, changefreq: "weekly", priority: "1.0" },
      { loc: `${baseUrl}/projects`, lastmod: today, changefreq: "weekly", priority: "0.9" },
      { loc: `${baseUrl}/blog`, lastmod: today, changefreq: "daily", priority: "0.9" },
      { loc: `${baseUrl}/resume`, lastmod: today, changefreq: "monthly", priority: "0.8" },
      { loc: `${baseUrl}/certificates`, lastmod: today, changefreq: "monthly", priority: "0.7" },
      { loc: `${baseUrl}/contact`, lastmod: today, changefreq: "monthly", priority: "0.7" }
    ];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${escapeXml(page.loc)}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }
    if (Array.isArray(projects)) {
      for (const proj of projects) {
        const slug = proj.slug || proj.id;
        if (!slug) continue;
        const projectUrl = `${baseUrl}/projects/${slug}`;
        const lastmod = proj.created_at ? new Date(proj.created_at).toISOString().split("T")[0] : today;
        const priority = proj.is_featured ? "0.9" : "0.8";
        const primaryImage = proj.image_url || proj.images && proj.images[0];
        let imageTag = "";
        if (primaryImage) {
          const absoluteImg = primaryImage.startsWith("http") ? primaryImage : `${baseUrl}${primaryImage.startsWith("/") ? "" : "/"}${primaryImage}`;
          imageTag = `
    <image:image>
      <image:loc>${escapeXml(absoluteImg)}</image:loc>
      <image:title>${escapeXml(proj.title || "Project Case Study")}</image:title>
    </image:image>`;
        }
        xml += `  <url>
    <loc>${escapeXml(projectUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>${imageTag}
  </url>
`;
      }
    }
    if (Array.isArray(blogs)) {
      for (const blog of blogs) {
        const slug = blog.slug || blog.id;
        if (!slug) continue;
        const blogUrl = `${baseUrl}/blog/${slug}`;
        const lastmod = blog.updated_at ? new Date(blog.updated_at).toISOString().split("T")[0] : blog.created_at ? new Date(blog.created_at).toISOString().split("T")[0] : today;
        let imageTag = "";
        if (blog.cover_image) {
          const absoluteImg = blog.cover_image.startsWith("http") ? blog.cover_image : `${baseUrl}${blog.cover_image.startsWith("/") ? "" : "/"}${blog.cover_image}`;
          imageTag = `
    <image:image>
      <image:loc>${escapeXml(absoluteImg)}</image:loc>
      <image:title>${escapeXml(blog.title || "Blog Article")}</image:title>
    </image:image>`;
        }
        xml += `  <url>
    <loc>${escapeXml(blogUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>${imageTag}
  </url>
`;
      }
    }
    xml += `</urlset>`;
    res.header("Content-Type", "application/xml; charset=utf-8");
    res.header("Cache-Control", "public, max-age=1800, s-maxage=3600");
    res.send(xml);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap.");
  }
});
router6.get("/robots.txt", async (req, res) => {
  const userAgent = req.headers["user-agent"] || "";
  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
  recordBotCrawl(userAgent, "/robots.txt", "GET", 200, clientIp, 14);
  try {
    const settings = await getSettings().catch(() => null);
    const baseUrl = resolveBaseUrl(req, settings);
    const host = resolveHost(req, settings);
    const robots = `# Dynamic robots.txt for Rajat Kumar Dash
# Auto-configured for active domain: ${host}
# Standards: Google Search Console, Bing Webmaster Tools, Schema.org

User-agent: Googlebot
Allow: /
Allow: /projects
Allow: /blog
Allow: /certificates
Allow: /resume
Allow: /contact

User-agent: Bingbot
Allow: /
Allow: /projects
Allow: /blog
Allow: /certificates
Allow: /resume
Allow: /contact

User-agent: DuckDuckBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: YandexBot
Disallow: /admin
Allow: /

User-agent: Baiduspider
Disallow: /admin
Allow: /

# AI Crawlers & Scrapers: Allow content indexing while protecting internal management APIs
User-agent: GPTBot
Disallow: /admin/
Disallow: /api/
Allow: /blog
Allow: /projects

User-agent: ChatGPT-User
Disallow: /admin/
Disallow: /api/
Allow: /blog
Allow: /projects

User-agent: ClaudeBot
Disallow: /admin/
Disallow: /api/
Allow: /blog
Allow: /projects
Crawl-delay: 1

User-agent: Google-Extended
Disallow: /admin/
Disallow: /api/

User-agent: PerplexityBot
Disallow: /admin/
Disallow: /api/
Allow: /blog
Allow: /projects

# Universal crawler policy
User-agent: *
Disallow: /admin/
Disallow: /api/
Allow: /
Crawl-delay: 1

# Dynamic Sitemap & Host Indexing
Host: ${host}
Sitemap: ${baseUrl}/sitemap.xml
`;
    res.header("Content-Type", "text/plain; charset=utf-8");
    res.header("Cache-Control", "public, max-age=1800, s-maxage=3600");
    res.send(robots);
  } catch (error) {
    console.error("Robots.txt generation error:", error);
    res.status(500).send("Error generating robots.txt.");
  }
});
var root_routes_default = router6;

// server/lib/security.ts
function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.removeHeader("X-Powered-By");
  next();
}
function corsHeaders(req, res, next) {
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

// server/api.ts
dotenv2.config();
var app = express();
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());
app.use(securityHeaders);
app.use(corsHeaders);
app.use("/uploads", express.static(path2.join(process.cwd(), "public", "uploads")));
app.use("/", root_routes_default);
app.use("/api", routes_default);
var api_default = app;
export {
  api_default as default
};
