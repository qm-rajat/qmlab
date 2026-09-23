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

// Dynamic LLMS.TXT endpoint adhering to https://llmstxt.org specification
router.get("/llms.txt", async (req: Request, res: Response) => {
  const userAgent = req.headers["user-agent"] || "";
  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
  recordBotCrawl(userAgent, "/llms.txt", "GET", 200, clientIp, 12);

  try {
    const settings = await getSettings().catch(() => null);
    const baseUrl = resolveBaseUrl(req, settings);
    const heroName = settings?.hero_name || "Rajat Kumar Dash";
    const brandName = settings?.company_name || "QM Labs";

    const content = `# ${brandName} & ${heroName} — Freelance Software Engineer & Web Development Services

> High-Performance Freelance Software Engineering, Custom Web Services, AI & MCP Systems, Product Strategy, and Technical SEO Consulting by ${heroName}.

${brandName} is a premier software engineering studio and freelance technical consultancy founded and led by ${heroName} (Freelance Full-Stack Software Engineer & Technical Product Manager). This document provides structured discovery data for Large Language Models (LLMs), AI Agents, search engines, and prospective clients looking to hire freelance software engineers or contract web development services.

## Web Ecosystem & Domain Routing
- [${heroName} Portfolio & CV](https://rajat.qmlab.in/): Primary personal portfolio hub for ${heroName}. Features verified academic credentials, B.Tech CSE & MBA in Product Management coursework, software engineering case studies, interactive resume, and technical competency matrix.
- [${brandName} Services & Solutions](${baseUrl}/): Primary agency and services hub. Showcases full-stack web engineering packages, AI/MCP server integration, technical SEO audits, cloud architecture advisory, and client booking console.

## Core Services & Solutions
- [Full-Stack Web Engineering & SaaS](${baseUrl}/#services): Production-ready React 19, TypeScript, and Node.js applications with robust REST APIs, secure authentication, and responsive Tailwind UI.
- [AI & LLM / MCP Server Integration](${baseUrl}/#services): Custom AI agents, Google Gemini 2.5/3.0 API integrations, Model Context Protocol (MCP) server deployments, RAG document search, and smart automation pipelines.
- [Product Strategy & Technical PRD Sprint](${baseUrl}/#services): Comprehensive Technical PRDs, database ERD schemas, user journeys, and prioritized sprint roadmaps bridging business vision and engineering.
- [Codebase Health, Speed & Security Audit](${baseUrl}/#services): Rapid 3-day deep-dive audit uncovering security vulnerabilities, Core Web Vitals latency, and architectural bottlenecks.
- [Technical SEO, AEO & GEO Optimization](${baseUrl}/#services): Schema.org JSON-LD structured data, Core Web Vitals optimization, and Answer Engine Optimization for ChatGPT, Perplexity, and Google SGE.
- [Cloud Architecture & DevOps Advisory](${baseUrl}/#services): Cloud Run, Docker containerization, CI/CD automated pipelines, and high-availability database setups.

## Case Studies & Engineering Portfolio
- [Data Classification & Privacy Dashboard](${baseUrl}/projects): Real-time governance dashboard processing PII datasets with automated risk classification.
- [Automated E2E Testing Suite](${baseUrl}/projects): Robust QA automation framework with cross-browser regression testing and CI/CD integration.
- [Model Context Protocol (MCP) CMS Engine](${baseUrl}/openapi.json): Programmatic API & MCP server enabling AI agents to manage CMS records safely.

## Technical Knowledge & Blog Articles
- [From Idea to Product: How I Turn Problems into Digital Solutions](${baseUrl}/blog): Actionable product strategy blueprint covering PRD drafting, sprint planning, and system architecture.

## Founder Profile & Verification
- [Interactive Resume & Career Trajectory](${baseUrl}/resume): Verified career history, technical leadership skills, and achievements of ${heroName}.
- [Verified Degrees & Certifications](${baseUrl}/certificates): GIET University B.Tech in CSE, Amity University MBA in Product Management, machine learning coursework, and cybersecurity credentials.

## Developer & AI Agent APIs
- [OpenAPI 3.0 Specification](${baseUrl}/openapi.json): Complete machine-readable REST API documentation for projects, blogs, certificates, and telemetry.
- [Model Context Protocol Endpoint](${baseUrl}/mcp): Live MCP tool interface for Claude Desktop, ChatGPT Custom GPTs, and autonomous agent workflows.
- [Dynamic XML Sitemap](${baseUrl}/sitemap.xml): Complete URL index of all published articles, case studies, and service offerings.
`;

    res.header("Content-Type", "text/plain; charset=utf-8");
    res.header("Cache-Control", "public, max-age=1800, s-maxage=3600");
    res.send(content);
  } catch (err) {
    res.status(500).send("Error rendering llms.txt");
  }
});

// Dynamic LLMS-FULL.TXT endpoint
router.get("/llms-full.txt", async (req: Request, res: Response) => {
  try {
    const settings = await getSettings().catch(() => null);
    const baseUrl = resolveBaseUrl(req, settings);
    const heroName = settings?.hero_name || "Rajat Kumar Dash";
    const brandName = settings?.company_name || "QM Labs";

    const content = `# ${brandName} & ${heroName} — Full Knowledge Base

> Comprehensive specifications, technical competencies, service packages, and career verification for AI Agents, ChatGPT, Claude, and Perplexity.

---

## 1. Executive Summary & Dual-Domain Architecture

- **Personal Portfolio Domain (https://rajat.qmlab.in/)**: The official personal engineering portfolio and career center for ${heroName}. Dedicated to product management case studies, software engineering projects, verified certifications, interactive resume, and technical credentials.
- **Enterprise Services Domain (${baseUrl}/)**: The flagship studio and consulting hub for ${brandName}. Dedicated to full-stack web engineering, custom AI agent development, Model Context Protocol (MCP) servers, technical SEO / AEO audits, and cloud infrastructure consulting. ${heroName} serves as Founder & Principal Software Architect.

---

## 2. Core Service Packages & Offerings

### Package 1: Full-Stack Web Engineering & SaaS
- **Starting Rate**: $2,500 (Fixed Scope)
- **Turnaround Time**: 2-4 Weeks
- **Tech Stack**: React 19, TypeScript, Next.js, Node.js / Express, PostgreSQL, Redis, Tailwind CSS v4.
- **Key Deliverables**: Production-ready web app, responsive Tailwind UI, REST/GraphQL API, secure Auth & Database.

### Package 2: AI & LLM / MCP Server Integration
- **Starting Rate**: $3,000 (Fixed Scope)
- **Turnaround Time**: 2-3 Weeks
- **Tech Stack**: Google GenAI SDK (Gemini 2.5 / 3.0), Model Context Protocol (MCP), Vector Embeddings, RAG Pipelines.
- **Key Deliverables**: Secure server-side AI proxy routes, MCP endpoints with strict JSON schemas, RAG document indexing.

### Package 3: Technical SEO, AEO & GEO Optimization
- **Starting Rate**: $1,500 (Fixed Scope)
- **Turnaround Time**: 1-2 Weeks
- **Key Deliverables**: 100/100 Lighthouse audit score compliance, Schema.org JSON-LD, Geo targeting, Core Web Vitals optimization.

### Package 4: Cloud Architecture & DevOps Advisory
- **Starting Rate**: $75/hr or $2,000 / sprint
- **Key Deliverables**: Cloud Run, Docker, CI/CD automated pipelines, database security hardening.

---

## 3. Verified Leadership Profile: ${heroName}

- **Role**: Founder & Principal Architect at ${brandName}; Technical Product Manager & Software Engineer.
- **Education**: MBA in Product Management (Amity University) & B.Tech in CSE (GIET University).
- **Portfolio URL**: [Personal Portfolio](https://rajat.qmlab.in) | [Services Hub](${baseUrl}/)
`;

    res.header("Content-Type", "text/plain; charset=utf-8");
    res.header("Cache-Control", "public, max-age=1800, s-maxage=3600");
    res.send(content);
  } catch (err) {
    res.status(500).send("Error rendering llms-full.txt");
  }
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
      { loc: `${baseUrl}/services`, lastmod: today, changefreq: "weekly", priority: "0.9" },
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
