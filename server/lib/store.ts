import Redis from "ioredis";
import { SiteSettings, Project, Blog, Certificate, Contact, FreelanceService } from "../../src/types.js";

const DEFAULT_SERVICES: FreelanceService[] = [
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

// Empty defaults in case Redis is completely fresh
const EMPTY_SETTINGS: SiteSettings = {
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

// Accepts whichever name the Vercel Redis integration (or a standalone Redis Cloud) injects for the standard redis:// connection string.
const getConnectionString = (): string | undefined =>
  process.env.REDIS_URL || process.env.KV_URL || process.env.REDIS_CONNECTION_STRING;

// We now ALWAYS have a store configured via Redis
export const isStoreConfigured = (): boolean => true;

let client: Redis | null = null;
const getClient = (): Redis | null => {
  if (!client) {
    const connectionString = getConnectionString();
    if (connectionString) {
      client = new Redis(connectionString, { maxRetriesPerRequest: 3 });
      client.on("error", (err) => console.error("Redis client error:", err.message));
    }
  }
  return client;
};

const KEYS = {
  settings: "qmlabs:settings",
  projects: "qmlabs:projects",
  blogs: "qmlabs:blogs",
  certificates: "qmlabs:certificates",
  contacts: "qmlabs:contacts",
  services: "qmlabs:services",
  password: "qmlabs:admin:password",
  aiApiKey: "qmlabs:ai:api_key",
} as const;

export async function readString(key: string): Promise<string | null> {
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

export async function writeString(key: string, value: string): Promise<void> {
  const redisClient = getClient();
  if (redisClient) {
    await redisClient.set(key, value);
  }
}

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const redisClient = getClient();
  
  if (redisClient) {
    try {
      const raw = await redisClient.get(key);
      if (raw != null) return JSON.parse(raw) as T;
    } catch (error) {
      console.error(`Redis read error for ${key}:`, error);
    }
  } else {
    console.warn(`[WARNING] Redis client is not initialized, check your REDIS_URL. Falling back to empty state for ${key}`);
  }
  
  return fallback;
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  const redisClient = getClient();
  
  if (redisClient) {
    await redisClient.set(key, JSON.stringify(value));
  } else {
    console.error(`[ERROR] Redis client is not initialized, cannot write data for ${key}`);
  }
}

export const getSettings = () => readJson<SiteSettings>(KEYS.settings, EMPTY_SETTINGS);
export const saveSettings = (value: SiteSettings) => writeJson(KEYS.settings, value);

export const getProjects = () => readJson<Project[]>(KEYS.projects, []);
export const saveProjects = (value: Project[]) => writeJson(KEYS.projects, value);

export const getBlogs = () => readJson<Blog[]>(KEYS.blogs, []);
export const saveBlogs = (value: Blog[]) => writeJson(KEYS.blogs, value);

export const getCertificates = () => readJson<Certificate[]>(KEYS.certificates, []);
export const saveCertificates = (value: Certificate[]) => writeJson(KEYS.certificates, value);

export const getContacts = () => readJson<Contact[]>(KEYS.contacts, []);
export const saveContacts = (value: Contact[]) => writeJson(KEYS.contacts, value);

export const getServices = () => readJson<FreelanceService[]>(KEYS.services, DEFAULT_SERVICES);
export const saveServices = (value: FreelanceService[]) => writeJson(KEYS.services, value);
export const getCustomPassword = () => readString(KEYS.password);
export const saveCustomPassword = (value: string) => writeString(KEYS.password, value);

export const getStoredAiApiKey = () => readString(KEYS.aiApiKey);
export const saveStoredAiApiKey = (value: string) => writeString(KEYS.aiApiKey, value);


