import { Router } from "express";
import {
  isStoreConfigured,
  getSettings,
  getProjects,
  getBlogs,
  saveBlogs,
  getCertificates,
  getServices,
  getFaqs,
  getWorkflowSteps,
  getTrustGuarantees,
} from "../lib/store.js";
import { recordPageView, recordResumeDownload, getResumeDownloads } from "../services/telemetry.service.js";
import { recordBotCrawl, identifyBot } from "../services/crawler.service.js";
import { rateLimiter } from "../lib/rateLimit.js";
import { resolveBaseUrl, resolveHost } from "../lib/domain.js";

const router = Router();

// Dynamic SEO info endpoint
router.get("/seo-info", async (req, res) => {
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
      customDomain: settings?.custom_domain || null,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

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
    const [settings, projects, blogs, certificates, services, faqs, workflowSteps, trustGuarantees] = await Promise.all([
      getSettings(),
      getProjects(),
      getBlogs(),
      getCertificates(),
      getServices(),
      getFaqs(),
      getWorkflowSteps(),
      getTrustGuarantees(),
    ]);
    res.json({ 
      success: true, 
      storeConfigured: isStoreConfigured(), 
      settings, 
      projects, 
      blogs, 
      certificates, 
      services,
      faqs,
      workflowSteps,
      trustGuarantees
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load site content." });
  }
});

router.get("/services", async (req, res) => {
  try {
    const services = await getServices();
    res.json({ success: true, services });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load services." });
  }
});

router.get("/faqs", async (req, res) => {
  try {
    const faqs = await getFaqs();
    res.json({ success: true, faqs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load FAQs." });
  }
});

router.get("/workflow-steps", async (req, res) => {
  try {
    const workflowSteps = await getWorkflowSteps();
    res.json({ success: true, workflowSteps });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load workflow steps." });
  }
});

router.get("/trust-guarantees", async (req, res) => {
  try {
    const trustGuarantees = await getTrustGuarantees();
    res.json({ success: true, trustGuarantees });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load trust guarantees." });
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
