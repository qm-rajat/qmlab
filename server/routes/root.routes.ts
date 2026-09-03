import { Router } from "express";
import { recordBotCrawl } from "../services/crawler.service.js";

const router = Router();

router.get("/sitemap.xml", (req, res) => {
  const userAgent = req.headers["user-agent"] || "";
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
  recordBotCrawl(userAgent, "/sitemap.xml", "GET", 200, clientIp, 18);

  const siteUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || "https://qmlab-indol.vercel.app";
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>2026-06-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/projects</loc>
    <lastmod>2026-06-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>2026-06-18</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/certificates</loc>
    <lastmod>2026-06-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/contact</loc>
    <lastmod>2026-06-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(sitemap);
});

router.get("/robots.txt", (req, res) => {
  const userAgent = req.headers["user-agent"] || "";
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
  recordBotCrawl(userAgent, "/robots.txt", "GET", 200, clientIp, 14);

  const siteUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || "https://qmlab-indol.vercel.app";

  const robots = `# Optimized robots.txt for QM Labs & Rajat Kumar Dash
# Technical SEO Audit Standard
# Allow all reputable Search Engine crawlers fully
User-agent: Googlebot
Allow: /
Allow: /projects
Allow: /blog
Allow: /certificates
Allow: /contact

User-agent: Bingbot
Allow: /
Allow: /projects
Allow: /blog
Allow: /certificates
Allow: /contact

User-agent: DuckDuckBot
Allow: /

User-agent: Slurp
Allow: /

User-agent: Baiduspider
Disallow: /admin
Allow: /

User-agent: YandexBot
Disallow: /admin
Allow: /

# Prevent aggressive AI scraper crawlers from draining process bandwidth while maintaining article visibility
User-agent: GPTBot
Disallow: /admin/
Disallow: /api/
Allow: /blog

User-agent: ChatGPT-User
Disallow: /admin/
Disallow: /api/
Allow: /blog

User-agent: ClaudeBot
Disallow: /admin/
Allow: /blog
Crawl-delay: 1

User-agent: Google-Extended
Disallow: /admin/
Disallow: /api/

User-agent: Omgilibot
Disallow: /

User-agent: PerplexityBot
Disallow: /admin/
Allow: /blog

# Global rule for other agents
User-agent: *
Disallow: /admin/
Disallow: /api/
Allow: /
Crawl-delay: 1

# Sitemap Location
Sitemap: ${siteUrl}/sitemap.xml`;

  res.header("Content-Type", "text/plain");
  res.send(robots);
});

export default router;
