import Redis from "ioredis";
import { SiteSettings, Project, Blog, Certificate, Contact, FreelanceService, FAQItem, WorkflowStep, TrustGuarantee } from "../../src/types.js";

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
    starting_price: "₹15,000",
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
    starting_price: "₹18,000",
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
    starting_price: "₹8,000",
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
    starting_price: "₹1,500/hr",
    turnaround_time: "Flexible",
    is_active: true,
    sort_order: 4
  },
  {
    id: "srv-5",
    title: "Product Strategy & Technical PRD Sprint",
    slug: "product-strategy-prd-sprint",
    short_description: "Bridge business vision and engineering with detailed PRDs, system schemas, user journeys, and sprint backlogs.",
    full_description: "Leveraging a dual Computer Science and Product Management background, turn ambiguous ideas into an actionable, engineer-ready Product Requirements Document (PRD) with interactive wireframes and database schemas.",
    icon: "Layers",
    deliverables: ["Comprehensive Technical PRD", "System Architecture & ERD Schemas", "Prioritized Sprint Roadmap (Jira/Linear)", "Wireframes & User Flow Specs"],
    pricing_type: "fixed",
    starting_price: "₹10,000",
    turnaround_time: "1-2 Weeks",
    is_active: true,
    sort_order: 5
  },
  {
    id: "srv-6",
    title: "Codebase Health, Speed & Security Audit",
    slug: "codebase-health-security-audit",
    short_description: "Rapid 3-day deep-dive audit uncovering security vulnerabilities, performance bottlenecks, and scale limits.",
    full_description: "An intensive code and architecture review analyzing frontend bundle metrics, database query latency, API security risks, and technical debt with an actionable remediation playbook.",
    icon: "ShieldCheck",
    deliverables: ["Comprehensive Audit Report PDF", "Core Web Vitals Remediation Plan", "API Security & Vulnerability Scan", "1-on-1 Executive Walkthrough Call"],
    pricing_type: "fixed",
    starting_price: "₹5,000",
    turnaround_time: "3-5 Days",
    is_active: true,
    sort_order: 6
  }
];

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Who owns the intellectual property (IP) and source code?',
    answer: 'You retain 100% full intellectual property and commercial ownership. Upon project delivery and final milestone sign-off, all Git repositories, infrastructure configs, deployment keys, and documentation are transferred completely to your team with no vendor lock-in or recurring licensing fees.',
    category: 'Legal & Ownership',
    is_active: true,
    sort_order: 1
  },
  {
    id: 'faq-2',
    question: 'How do contract milestones and payments work?',
    answer: 'Engagements are structured into transparent, deliverables-based milestones (typically 30% upfront upon PRD sign-off, 40% mid-sprint MVP demo, and 30% upon production deployment and QA verification). Invoicing is conducted with strict milestone agreements.',
    category: 'Billing & Contracts',
    is_active: true,
    sort_order: 2
  },
  {
    id: 'faq-3',
    question: 'Can you integrate AI / Gemini agents and MCP into our existing codebase?',
    answer: 'Yes. Whether you are building from scratch or extending an existing React, Node.js, Python, or Next.js application, I integrate secure Model Context Protocol (MCP) servers, Google Gemini 2.5/3.0 APIs, and custom RAG pipelines directly with your existing database and authentication systems.',
    category: 'Technical & AI',
    is_active: true,
    sort_order: 3
  },
  {
    id: 'faq-4',
    question: 'Do you sign Non-Disclosure Agreements (NDAs)?',
    answer: 'Absolutely. Client confidentiality and proprietary data security are fundamental. I am happy to sign your standard company NDA or provide a mutual NDA prior to our initial technical discovery call.',
    category: 'Legal & Ownership',
    is_active: true,
    sort_order: 4
  },
  {
    id: 'faq-5',
    question: 'What is included in the 30-day post-launch warranty?',
    answer: 'Every engineering package includes 30 days of comprehensive post-launch warranty support. If any bug, edge-case defect, or configuration discrepancy arises within the agreed scope, it is diagnosed and resolved promptly at zero additional cost.',
    category: 'Delivery & Warranty',
    is_active: true,
    sort_order: 5
  },
  {
    id: 'faq-6',
    question: 'How do you handle collaboration and international timezones?',
    answer: 'I collaborate seamlessly with founders and engineering teams across US (PST/EST), Europe (GMT/CET), and APAC timezones using structured asynchronous updates via Slack/Discord, clear Linear/Jira sprint boards, and scheduled weekly video syncs.',
    category: 'Workflow & Communication',
    is_active: true,
    sort_order: 6
  }
];

const DEFAULT_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'wf-1',
    step: '01',
    title: 'Discovery & Architecture Review',
    timeline: '24–48 Hours',
    description: 'We align on business goals, technical constraints, data schemas, and target timelines to draft a precise scope of work.',
    icon: 'Compass',
    deliverables: ['Scope & Timeline Document', 'Tech Stack Evaluation', 'Milestone Agreement'],
    sort_order: 1
  },
  {
    id: 'wf-2',
    step: '02',
    title: 'PRD & Technical Blueprint',
    timeline: 'Week 1',
    description: 'Translating concepts into a comprehensive Product Requirements Document (PRD), database ERD models, and API interfaces.',
    icon: 'FileCheck',
    deliverables: ['Detailed Technical PRD', 'Database & API Architecture', 'Component & Wireframe Specs'],
    sort_order: 2
  },
  {
    id: 'wf-3',
    step: '03',
    title: 'High-Velocity Sprint Execution',
    timeline: 'Weeks 2–3',
    description: 'Iterative sprint development with modern React 19, TypeScript, secure Node.js APIs, and AI integrations with live demo staging.',
    icon: 'Terminal',
    deliverables: ['Modular TypeScript Codebase', 'Interactive Staging Previews', 'Continuous Async Demos'],
    sort_order: 3
  },
  {
    id: 'wf-4',
    step: '04',
    title: 'QA, Deployment & 30-Day Warranty',
    timeline: 'Week 4',
    description: 'Automated test suite validation, zero-downtime cloud deployment (Cloud Run/AWS), full repository handoff, and 30-day warranty.',
    icon: 'ShieldCheck',
    deliverables: ['Production Cloud Launch', 'Full Git & Secret Transfer', '30-Day Bug-Fix Guarantee'],
    sort_order: 4
  }
];

const DEFAULT_TRUST_GUARANTEES: TrustGuarantee[] = [
  {
    id: 'trust-1',
    title: '100% IP & Code Ownership',
    description: 'Full repository, credentials, and copyright transferred upon delivery.',
    icon: 'Lock',
    sort_order: 1
  },
  {
    id: 'trust-2',
    title: 'Strict NDA Adherence',
    description: 'Your business model, data schemas, and ideas remain 100% confidential.',
    icon: 'ShieldCheck',
    sort_order: 2
  },
  {
    id: 'trust-3',
    title: '30-Day Bug Warranty',
    description: 'Guaranteed post-launch fix coverage for all production deliverables.',
    icon: 'RefreshCw',
    sort_order: 3
  },
  {
    id: 'trust-4',
    title: 'Direct Founder Channel',
    description: 'Real-time sync on Slack, Discord, or email with fast turnaround.',
    icon: 'MessageSquare',
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
  overview_sixth_stat: { label: "", value: "" },
  mcp_enabled: true,
  mcp_edit_policy: "disabled",
  mcp_require_auth_for_view: false
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

export const getRedisClient = (): Redis | null => getClient();

export async function getRedisStorageInfo(): Promise<{
  connected: boolean;
  usedMemoryHuman: string;
  peakMemoryHuman: string;
  totalKeys: number;
  uptimeInDays: number;
  rawInfo?: string;
}> {
  const redis = getClient();
  if (!redis) {
    return {
      connected: false,
      usedMemoryHuman: "N/A (Offline)",
      peakMemoryHuman: "N/A",
      totalKeys: 0,
      uptimeInDays: 0,
    };
  }

  try {
    const [infoMemory, infoServer, keys] = await Promise.all([
      redis.info("memory").catch(() => ""),
      redis.info("server").catch(() => ""),
      redis.keys("qmlabs:*").catch(() => []),
    ]);

    const parseVal = (str: string, field: string) => {
      const match = str.match(new RegExp(`^${field}:(.*)$`, "m"));
      return match ? match[1].trim() : null;
    };

    const usedMem = parseVal(infoMemory, "used_memory_human") || "Unknown";
    const peakMem = parseVal(infoMemory, "used_memory_peak_human") || "Unknown";
    const uptimeSec = parseInt(parseVal(infoServer, "uptime_in_seconds") || "0", 10);
    const uptimeDays = Math.round((uptimeSec / 86400) * 10) / 10;

    return {
      connected: true,
      usedMemoryHuman: usedMem,
      peakMemoryHuman: peakMem,
      totalKeys: Array.isArray(keys) ? keys.length : 0,
      uptimeInDays: uptimeDays,
    };
  } catch (err) {
    console.error("Failed to read Redis storage info:", err);
    return {
      connected: false,
      usedMemoryHuman: "Error reading info",
      peakMemoryHuman: "N/A",
      totalKeys: 0,
      uptimeInDays: 0,
    };
  }
}

const KEYS = {
  settings: "qmlabs:settings",
  projects: "qmlabs:projects",
  blogs: "qmlabs:blogs",
  certificates: "qmlabs:certificates",
  contacts: "qmlabs:contacts",
  services: "qmlabs:services",
  faqs: "qmlabs:faqs",
  workflowSteps: "qmlabs:workflow_steps",
  trustGuarantees: "qmlabs:trust_guarantees",
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

export const getServices = async () => {
  const list = await readJson<FreelanceService[]>(KEYS.services, DEFAULT_SERVICES);
  // Auto-migrate any legacy $ dollar symbols stored in existing database records to INR (₹)
  const sanitized = list.map(s => {
    let price = s.starting_price || '';
    if (price.includes('$2,500')) price = '₹15,000';
    else if (price.includes('$3,000')) price = '₹18,000';
    else if (price.includes('$1,500')) price = '₹8,000';
    else if (price.includes('$150/hr')) price = '₹1,500/hr';
    else if (price.includes('$1,800')) price = '₹10,000';
    else if (price.includes('$1,200')) price = '₹5,000';
    else if (price.includes('$')) price = price.replace(/\$/g, '₹');
    return { ...s, starting_price: price };
  });
  return sanitized;
};
export const saveServices = (value: FreelanceService[]) => writeJson(KEYS.services, value);

export const getFaqs = () => readJson<FAQItem[]>(KEYS.faqs, DEFAULT_FAQS);
export const saveFaqs = (value: FAQItem[]) => writeJson(KEYS.faqs, value);

export const getWorkflowSteps = () => readJson<WorkflowStep[]>(KEYS.workflowSteps, DEFAULT_WORKFLOW_STEPS);
export const saveWorkflowSteps = (value: WorkflowStep[]) => writeJson(KEYS.workflowSteps, value);

export const getTrustGuarantees = () => readJson<TrustGuarantee[]>(KEYS.trustGuarantees, DEFAULT_TRUST_GUARANTEES);
export const saveTrustGuarantees = (value: TrustGuarantee[]) => writeJson(KEYS.trustGuarantees, value);

export const getCustomPassword = () => readString(KEYS.password);
export const saveCustomPassword = (value: string) => writeString(KEYS.password, value);

export const getStoredAiApiKey = () => readString(KEYS.aiApiKey);
export const saveStoredAiApiKey = (value: string) => writeString(KEYS.aiApiKey, value);


