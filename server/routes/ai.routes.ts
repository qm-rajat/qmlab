import { Router, Request, Response } from "express";
import crypto from "crypto";
import { aiTools } from "../services/aiTools.service.js";
import { requireAiOrAdminAuth, getActiveAiApiKey, isValidSession } from "../lib/auth.js";
import { getSettings, saveStoredAiApiKey } from "../lib/store.js";
import { resolveBaseUrl } from "../lib/domain.js";

const router = Router();

// ============================================================================
// OPENAPI 3.0.3 SPECIFICATION GENERATOR (FOR CHATGPT CUSTOM GPTS & ACTIONS)
// ============================================================================
export function generateOpenApiSpec(req: Request) {
  const host = req.get("host") || "localhost:3000";
  const protocol = req.protocol || "http";
  const baseUrl = `${protocol}://${host}`;

  return {
    openapi: "3.0.3",
    info: {
      title: "Rajat Dash Portfolio & Content CMS Management API",
      description:
        "Full programmatic access for ChatGPT Custom GPTs, Claude Desktop, and AI Agents to create, update, delete, and manage projects, case studies, blogs, certifications, resume work experiences, education history, skills, and site settings.",
      version: "1.0.0",
      contact: {
        name: "Rajat Kumar Dash",
        email: "rajat.pilgrimpackages@gmail.com",
      },
    },
    servers: [
      {
        url: baseUrl,
        description: "Active Portfolio Server",
      },
    ],
    security: [
      { BearerAuth: [] },
      { ApiKeyAuth: [] },
    ],
    paths: {
      "/api/ai/overview": {
        get: {
          operationId: "getPortfolioOverview",
          summary: "Get full portfolio summary, counts, and active catalog overview",
          description: "Returns an executive summary of current projects, blogs, certificates, experience items, and profile details.",
          responses: {
            "200": { description: "Portfolio overview data retrieved." },
            "401": { description: "Unauthorized access. Provide a valid API key." },
          },
        },
      },
      "/api/ai/projects": {
        get: {
          operationId: "listProjects",
          summary: "List all portfolio projects & case studies",
          parameters: [
            { name: "category", in: "query", schema: { type: "string" }, description: "Filter by category (e.g., product-management, web-systems, machine-learning)" },
            { name: "query", in: "query", schema: { type: "string" }, description: "Search query across titles and technologies" },
          ],
          responses: {
            "200": { description: "Array of portfolio projects." },
          },
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
                    is_featured: { type: "boolean", default: true },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Project created successfully." },
          },
        },
      },
      "/api/ai/projects/{id}": {
        get: {
          operationId: "getProjectById",
          summary: "Get a specific project by ID or slug",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Project ID (e.g. proj_123) or URL slug" },
          ],
          responses: {
            "200": { description: "Project details." },
            "404": { description: "Project not found." },
          },
        },
        put: {
          operationId: "updateProject",
          summary: "Update an existing project by ID or slug",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Project ID or slug" },
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
                    is_featured: { type: "boolean" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Project updated." },
          },
        },
        delete: {
          operationId: "deleteProject",
          summary: "Delete a project by ID or slug",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Project deleted." },
          },
        },
      },
      "/api/ai/blogs": {
        get: {
          operationId: "listBlogs",
          summary: "List all published and draft blog articles",
          parameters: [
            { name: "status", in: "query", schema: { type: "string", enum: ["published", "draft", "archived"] } },
            { name: "tag", in: "query", schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "List of blog articles." },
          },
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
                    cover_image_url: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Blog post created." },
          },
        },
      },
      "/api/ai/blogs/{id}": {
        get: {
          operationId: "getBlogById",
          summary: "Get blog article details and full HTML content",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Blog article details." },
          },
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
                    cover_image_url: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Blog article updated." },
          },
        },
        delete: {
          operationId: "deleteBlog",
          summary: "Delete a blog article",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Blog deleted." },
          },
        },
      },
      "/api/ai/certificates": {
        get: {
          operationId: "listCertificates",
          summary: "List all verified certificates & professional credentials",
          responses: { "200": { description: "List of certificates." } },
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
                    category: { type: "string", enum: ["cybersecurity", "web-development", "data-science", "machine-learning", "seo-digital-marketing", "cloud", "other"] },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Certificate added." } },
        },
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
                    skills: { type: "array", items: { type: "string" } },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Certificate updated." } },
        },
        delete: {
          operationId: "deleteCertificate",
          summary: "Delete a certificate",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Certificate deleted." } },
        },
      },
      "/api/ai/resume": {
        get: {
          operationId: "getResumeData",
          summary: "Get full resume data (work experience, education, skills, bio)",
          responses: { "200": { description: "Resume payload." } },
        },
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
                    location: { type: "string", example: "Remote / Hybrid" },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Experience added." } },
        },
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
                    location: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Experience updated." } },
        },
        delete: {
          operationId: "deleteWorkExperience",
          summary: "Delete work experience by index or company name",
          parameters: [{ name: "index", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Experience removed." } },
        },
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
                    grade: { type: "string", example: "First Class" },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Education added." } },
        },
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
                    end_year: { type: "integer" },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Education updated." } },
        },
        delete: {
          operationId: "deleteEducation",
          summary: "Delete education item by index or institution name",
          parameters: [{ name: "index", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Education deleted." } },
        },
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
                          items: { type: "array", items: { type: "string" }, example: ["PRD Writing", "User Journey Mapping", "Agile Sprints"] },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Skills updated." } },
        },
      },
      "/api/ai/settings": {
        get: {
          operationId: "getSiteSettings",
          summary: "Get site profile, hero headline, bio, contact details, and SEO tags",
          responses: { "200": { description: "Site settings." } },
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
                        twitter: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Settings updated." } },
        },
      },
      "/api/ai/contacts": {
        get: {
          operationId: "listContactInquiries",
          summary: "List inquiries and discovery calls submitted through the website",
          responses: { "200": { description: "Contact submissions." } },
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
                    inquiry_type: { type: "string", default: "freelance_project" },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Lead recorded." } },
        },
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
                        "submit_lead",
                      ],
                    },
                    payload: { type: "object", description: "Arguments for the selected action" },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Action executed successfully." } },
        },
      },
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "Provide your AI Management Key in the 'x-api-key' header.",
        },
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT/Key",
          description: "Provide your AI Key as a Bearer Token (Authorization: Bearer <KEY>).",
        },
      },
    },
  };
}

// ============================================================================
// PUBLIC SPECIFICATION & INTEGRATION INFO ENDPOINTS
// ============================================================================
router.get("/openapi.json", (req, res) => {
  res.json(generateOpenApiSpec(req));
});

router.get("/status", async (req, res) => {
  const currentKey = await getActiveAiApiKey();
  const maskedKey = currentKey ? `${currentKey.slice(0, 6)}...${currentKey.slice(-4)}` : "Not Configured";
  const baseUrl = resolveBaseUrl(req);

  res.json({
    success: true,
    name: "Rajat Dash AI & ChatGPT / MCP CMS Engine",
    status: "online",
    authentication: {
      configured: !!currentKey,
      masked_key: maskedKey,
      supported_methods: ["Header: x-api-key", "Header: Authorization: Bearer <KEY>", "Query: ?api_key=<KEY>"],
    },
    chatgpt: {
      openapi_spec_url: `${baseUrl}/api/openapi.json`,
      instructions: "In ChatGPT Custom GPT Builder -> Actions -> Import URL -> Paste the openapi_spec_url.",
    },
    mcp: {
      server_url: `${baseUrl}/api/mcp`,
      transport: ["JSON-RPC 2.0 (POST)", "Server-Sent Events (SSE) (GET)"],
    },
  });
});

// ============================================================================
// AI REST API ROUTES (SECURED VIA API KEY / ADMIN SESSION)
// ============================================================================
router.use(requireAiOrAdminAuth);

// Overview
router.get("/overview", async (req, res) => {
  try {
    const data = await aiTools.getOverview();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Projects
router.get("/projects", async (req, res) => {
  try {
    const { category, query } = req.query as { category?: string; query?: string };
    const data = await aiTools.listProjects({ category, query });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/projects/:id", async (req, res) => {
  try {
    const data = await aiTools.getProject(req.params.id);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/projects", async (req, res) => {
  try {
    const data = await aiTools.createProject(req.body);
    if (!data.success) return res.status(400).json(data);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/projects/:id", async (req, res) => {
  try {
    const data = await aiTools.updateProject(req.params.id, req.body);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    const data = await aiTools.deleteProject(req.params.id);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Blogs
router.get("/blogs", async (req, res) => {
  try {
    const { status, tag } = req.query as { status?: string; tag?: string };
    const data = await aiTools.listBlogs({ status, tag });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/blogs/:id", async (req, res) => {
  try {
    const data = await aiTools.getBlog(req.params.id);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/blogs", async (req, res) => {
  try {
    const data = await aiTools.createBlog(req.body);
    if (!data.success) return res.status(400).json(data);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/blogs/:id", async (req, res) => {
  try {
    const data = await aiTools.updateBlog(req.params.id, req.body);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/blogs/:id", async (req, res) => {
  try {
    const data = await aiTools.deleteBlog(req.params.id);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Certificates
router.get("/certificates", async (req, res) => {
  try {
    const data = await aiTools.listCertificates();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/certificates", async (req, res) => {
  try {
    const data = await aiTools.createCertificate(req.body);
    if (!data.success) return res.status(400).json(data);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/certificates/:id", async (req, res) => {
  try {
    const data = await aiTools.updateCertificate(req.params.id, req.body);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/certificates/:id", async (req, res) => {
  try {
    const data = await aiTools.deleteCertificate(req.params.id);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Resume
router.get("/resume", async (req, res) => {
  try {
    const data = await aiTools.getResume();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/resume/experience", async (req, res) => {
  try {
    const data = await aiTools.addExperience(req.body);
    if (!data.success) return res.status(400).json(data);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/resume/experience/:index", async (req, res) => {
  try {
    const numIdx = parseInt(req.params.index, 10);
    const identifier = isNaN(numIdx) ? req.params.index : numIdx;
    const data = await aiTools.updateExperience(identifier, req.body);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/resume/experience/:index", async (req, res) => {
  try {
    const numIdx = parseInt(req.params.index, 10);
    const identifier = isNaN(numIdx) ? req.params.index : numIdx;
    const data = await aiTools.deleteExperience(identifier);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/resume/education", async (req, res) => {
  try {
    const data = await aiTools.addEducation(req.body);
    if (!data.success) return res.status(400).json(data);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/resume/education/:index", async (req, res) => {
  try {
    const numIdx = parseInt(req.params.index, 10);
    const identifier = isNaN(numIdx) ? req.params.index : numIdx;
    const data = await aiTools.updateEducation(identifier, req.body);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/resume/education/:index", async (req, res) => {
  try {
    const numIdx = parseInt(req.params.index, 10);
    const identifier = isNaN(numIdx) ? req.params.index : numIdx;
    const data = await aiTools.deleteEducation(identifier);
    if (!data.success) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/resume/skills", async (req, res) => {
  try {
    const skills = req.body.skills || req.body;
    const data = await aiTools.updateSkills(skills);
    if (!data.success) return res.status(400).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Settings
router.get("/settings", async (req, res) => {
  try {
    const data = await aiTools.getSettings();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch("/settings", async (req, res) => {
  try {
    const data = await aiTools.updateSettings(req.body);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Contacts
router.get("/contacts", async (req, res) => {
  try {
    const data = await aiTools.listContacts();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/contacts", async (req, res) => {
  try {
    const data = await aiTools.createContactLead(req.body);
    if (!data.success) return res.status(400).json(data);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Unified Execute Command
router.post("/execute", async (req, res) => {
  const { action, payload } = req.body;
  if (!action) return res.status(400).json({ success: false, error: "Missing 'action' parameter." });

  try {
    let result: any;
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
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// MODEL CONTEXT PROTOCOL (MCP) JSON-RPC 2.0 & SSE HANDLER FOR CHATGPT & CLAUDE
// ============================================================================

const activeMcpSseClients = new Map<string, { id: string; res: Response; createdAt: number }>();

// Clean up stale SSE connections periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, client] of activeMcpSseClients.entries()) {
    if (now - client.createdAt > 1000 * 60 * 60) {
      try {
        client.res.end();
      } catch {}
      activeMcpSseClients.delete(id);
    }
  }
}, 60000);

const MCP_TOOLS_CATALOG = [
  {
    name: "get_portfolio_overview",
    description: "Get full executive overview of projects, blogs, certificates, and profile bio.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "list_projects",
    description: "List projects in the portfolio with category and query filtering.",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Filter by category (e.g. product-management, web-systems, machine-learning)" },
        query: { type: "string", description: "Keyword search" },
      },
    },
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
        prd_url: { type: "string" },
      },
    },
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
        live_url: { type: "string" },
      },
    },
  },
  {
    name: "delete_project",
    description: "Delete a project from the portfolio.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "string" } },
    },
  },
  {
    name: "list_blogs",
    description: "List technical blogs with optional status or tag filtering.",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["published", "draft"] },
        tag: { type: "string" },
      },
    },
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
        tags: { type: "array", items: { type: "string" } },
      },
    },
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
        tags: { type: "array", items: { type: "string" } },
      },
    },
  },
  {
    name: "delete_blog",
    description: "Delete a blog post.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "string" } },
    },
  },
  {
    name: "list_certificates",
    description: "List verified credentials and certifications.",
    inputSchema: { type: "object", properties: {} },
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
        description: { type: "string" },
      },
    },
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
        description: { type: "string" },
      },
    },
  },
  {
    name: "delete_certificate",
    description: "Delete a certificate from the portfolio by ID or title.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "string", description: "Certificate ID or title" } },
    },
  },
  {
    name: "get_resume",
    description: "Get full resume data including work experience, education, and skills.",
    inputSchema: { type: "object", properties: {} },
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
        location: { type: "string" },
      },
    },
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
        location: { type: "string" },
      },
    },
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
        grade: { type: "string" },
      },
    },
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
        grade: { type: "string" },
      },
    },
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
              items: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    },
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
        resume_custom_categories: { type: "object", additionalProperties: { type: "string" }, description: "Custom technical skill category names" },
      },
    },
  },
];

export const handleMcpGetRequest = async (req: Request, res: Response) => {
  const acceptsSse =
    req.headers.accept?.includes("text/event-stream") ||
    req.query.transport === "sse" ||
    req.path.includes("sse");

  if (acceptsSse) {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "X-Accel-Buffering": "no",
    });

    const endpointPath = `/api/mcp?sessionId=${sessionId}`;
    res.write(`event: endpoint\ndata: ${endpointPath}\n\n`);

    const interval = setInterval(() => {
      try {
        res.write(": keep-alive\n\n");
      } catch {
        clearInterval(interval);
      }
    }, 15000);

    activeMcpSseClients.set(sessionId, { id: sessionId, res, createdAt: Date.now() });

    req.on("close", () => {
      clearInterval(interval);
      activeMcpSseClients.delete(sessionId);
    });
    return;
  }

  // General GET: Return server status and info
  res.json({
    status: "online",
    name: "rajat-dash-portfolio-mcp",
    protocolVersion: "2024-11-05",
    transports: ["streamable-http", "sse", "json-rpc-2.0"],
    endpoints: {
      mcp_url: "/api/mcp",
      sse_url: "/api/mcp?transport=sse",
      openapi_url: "/api/openapi.json",
    },
    toolsCount: MCP_TOOLS_CATALOG.length,
    capabilities: {
      tools: { listChanged: false },
      resources: { subscribe: false, listChanged: false },
      prompts: { listChanged: false },
    },
  });
};

export const handleMcpPostRequest = async (req: Request, res: Response) => {
  const { jsonrpc, id, method, params } = req.body || {};
  const sessionId = (req.query.sessionId as string) || (req.headers["mcp-session-id"] as string);

  // Handle initialization notifications
  if (method === "notifications/initialized" || method === "initialized") {
    if (id !== undefined) {
      return res.json({ jsonrpc: "2.0", id, result: {} });
    }
    return res.status(200).json({ jsonrpc: "2.0" });
  }

  if (jsonrpc !== "2.0" && method !== "initialize") {
    return res.status(400).json({
      jsonrpc: "2.0",
      id: id || null,
      error: { code: -32600, message: "Invalid Request: jsonrpc must be '2.0'" },
    });
  }

  try {
    let responseData: any = null;

    switch (method) {
      case "initialize":
        responseData = {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: {
            protocolVersion: params?.protocolVersion || "2024-11-05",
            serverInfo: {
              name: "rajat-dash-portfolio-mcp",
              version: "1.0.0",
            },
            capabilities: {
              tools: { listChanged: false },
              resources: { subscribe: false, listChanged: false },
              prompts: { listChanged: false },
            },
          },
        };
        break;

      case "ping":
        responseData = {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: {},
        };
        break;

      case "tools/list":
        responseData = {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: {
            tools: MCP_TOOLS_CATALOG,
          },
        };
        break;

      case "tools/call": {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};
        let output: any;

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
              error: { code: -32601, message: `Tool '${toolName}' not found` },
            });
        }

        responseData = {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: {
            content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
          },
        };
        break;
      }

      case "resources/list":
        responseData = {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: { resources: [] },
        };
        break;

      case "prompts/list":
        responseData = {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: { prompts: [] },
        };
        break;

      default:
        responseData = {
          jsonrpc: "2.0",
          id: id || null,
          error: { code: -32601, message: `Method '${method}' not found` },
        };
        break;
    }

    if (sessionId && activeMcpSseClients.has(sessionId)) {
      const client = activeMcpSseClients.get(sessionId);
      try {
        client?.res.write(`event: message\ndata: ${JSON.stringify(responseData)}\n\n`);
      } catch {}
    }

    return res.json(responseData);
  } catch (err: any) {
    return res.status(500).json({
      jsonrpc: "2.0",
      id: id || null,
      error: { code: -32603, message: `Internal error: ${err.message}` },
    });
  }
};

export const mcpRouter = Router();

// Dedicated MCP router handling both SSE and HTTP JSON-RPC 2.0 without auth blockers
mcpRouter.get("/", handleMcpGetRequest);
mcpRouter.get("/*", handleMcpGetRequest);
mcpRouter.post("/", handleMcpPostRequest);
mcpRouter.post("/*", handleMcpPostRequest);

export default router;
