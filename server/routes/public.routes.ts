import { Router } from "express";
import {
  isStoreConfigured,
  getSettings,
  getProjects,
  getBlogs,
  saveBlogs,
  getCertificates,
} from "../lib/store.js";
import { recordPageView, recordResumeDownload, getResumeDownloads } from "../services/telemetry.service.js";
import { recordBotCrawl, identifyBot } from "../services/crawler.service.js";
import { rateLimiter } from "../lib/rateLimit.js";

const router = Router();

// Rate limit telemetry endpoints to avoid log flooding
const telemetryRateLimiter = rateLimiter("telemetry", {
  windowMs: 60 * 1000,
  maxRequests: 60, // 60 telemetry events per minute per IP
  message: "Telemetry rate limit reached."
});

const interactionRateLimiter = rateLimiter("blog-interaction", {
  windowMs: 60 * 1000,
  maxRequests: 30,
  message: "Too many interactions. Slow down."
});

router.get("/content", async (req, res) => {
  try {
    const [settings, projects, blogs, certificates] = await Promise.all([
      getSettings(),
      getProjects(),
      getBlogs(),
      getCertificates(),
    ]);
    res.json({ success: true, storeConfigured: isStoreConfigured(), settings, projects, blogs, certificates });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load site content." });
  }
});

// Telemetry: Record Page Visit
router.post("/telemetry/visit", telemetryRateLimiter, (req, res) => {
  try {
    const { path = "/", referrer = "" } = req.body;
    const userAgent = String(req.headers["user-agent"] || "").slice(0, 500);
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
    const safePath = String(path).slice(0, 200);
    const safeReferrer = String(referrer).slice(0, 500);

    // If request is from a crawler, record bot crawl
    if (identifyBot(userAgent)) {
      recordBotCrawl(userAgent, safePath, "GET", 200, clientIp, 20);
    } else {
      recordPageView(safePath, userAgent, clientIp, safeReferrer);
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Telemetry: Record Resume Download
router.post("/telemetry/resume-download", telemetryRateLimiter, (req, res) => {
  try {
    const count = recordResumeDownload();
    res.json({ success: true, count });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Increment real blog view count
router.post("/blogs/:id/view", interactionRateLimiter, async (req, res) => {
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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to increment blog view." });
  }
});

// Real blog like count toggle
router.post("/blogs/:id/like", interactionRateLimiter, async (req, res) => {
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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to update blog like count." });
  }
});

export default router;
