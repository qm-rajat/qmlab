import { Router, Request, Response } from "express";
import { recordBotCrawl } from "../services/crawler.service.js";
import { getSettings, getProjects, getBlogs } from "../lib/store.js";
import { resolveBaseUrl, resolveHost, escapeXml } from "../lib/domain.js";
import { generateOpenApiSpec, handleMcpGetRequest, handleMcpPostRequest } from "./ai.routes.js";

const router = Router();

// OpenAPI Spec directly accessible at /openapi.json
router.get("/openapi.json", (req, res) => {
  res.json(generateOpenApiSpec(req));
});

// Direct Model Context Protocol (MCP) endpoints at /mcp, /sse, /messages
router.get("/mcp", handleMcpGetRequest);
router.get("/mcp/*", handleMcpGetRequest);
router.get("/sse", handleMcpGetRequest);
router.get("/sse/*", handleMcpGetRequest);

router.post("/mcp", handleMcpPostRequest);
router.post("/mcp/*", handleMcpPostRequest);
router.post("/sse", handleMcpPostRequest);
router.post("/sse/*", handleMcpPostRequest);


// DYNAMIC SITEMAP.XML
router.get("/sitemap.xml", async (req: Request, res: Response) => {
  const userAgent = req.headers["user-agent"] || "";
  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
  recordBotCrawl(userAgent, "/sitemap.xml", "GET", 200, clientIp, 18);

  try {
    const [settings, projects, blogs] = await Promise.all([
      getSettings().catch(() => null),
      getProjects().catch(() => []),
      getBlogs().catch(() => [])
    ]);

    const baseUrl = resolveBaseUrl(req, settings);
    const today = new Date().toISOString().split("T")[0];

    // Core application static pages
    const staticPages = [
      { loc: `${baseUrl}/`, lastmod: today, changefreq: "weekly", priority: "1.0" },
      { loc: `${baseUrl}/projects`, lastmod: today, changefreq: "weekly", priority: "0.9" },
      { loc: `${baseUrl}/blog`, lastmod: today, changefreq: "daily", priority: "0.9" },
      { loc: `${baseUrl}/resume`, lastmod: today, changefreq: "monthly", priority: "0.8" },
      { loc: `${baseUrl}/certificates`, lastmod: today, changefreq: "monthly", priority: "0.7" },
      { loc: `${baseUrl}/contact`, lastmod: today, changefreq: "monthly", priority: "0.7" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // 1. Static Pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${escapeXml(page.loc)}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // 2. Dynamic Projects (Case studies, PRDs, code systems)
    if (Array.isArray(projects)) {
      for (const proj of projects) {
        const slug = proj.slug || proj.id;
        if (!slug) continue;
        const projectUrl = `${baseUrl}/projects/${slug}`;
        const lastmod = proj.created_at ? new Date(proj.created_at).toISOString().split("T")[0] : today;
        const priority = proj.is_featured ? "0.9" : "0.8";

        const primaryImage = proj.image_url || (proj.images && proj.images[0]);
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

    // 3. Dynamic Blog Articles
    if (Array.isArray(blogs)) {
      for (const blog of blogs) {
        const slug = blog.slug || blog.id;
        if (!slug) continue;
        const blogUrl = `${baseUrl}/blog/${slug}`;
        const lastmod = blog.updated_at
          ? new Date(blog.updated_at).toISOString().split("T")[0]
          : blog.created_at
          ? new Date(blog.created_at).toISOString().split("T")[0]
          : today;

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
  } catch (error: any) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap.");
  }
});

// DYNAMIC ROBOTS.TXT
router.get("/robots.txt", async (req: Request, res: Response) => {
  const userAgent = req.headers["user-agent"] || "";
  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
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
  } catch (error: any) {
    console.error("Robots.txt generation error:", error);
    res.status(500).send("Error generating robots.txt.");
  }
});

export default router;
