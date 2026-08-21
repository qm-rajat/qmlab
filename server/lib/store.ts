import Redis from "ioredis";
import { SiteSettings, Project, Blog, Certificate, Contact } from "../../src/types.ts";

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
  company_bio: "",
  company_about_html: "",
  hero_stats: [],
  overview_fourth_stat: { label: "", value: "" }
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
} as const;

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

