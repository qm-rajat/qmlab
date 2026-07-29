import Redis from "ioredis";
import {
  DEFAULT_SETTINGS,
  DEFAULT_PROJECTS,
  DEFAULT_BLOGS,
  DEFAULT_CERTIFICATES,
} from "../src/data.js";
import { SiteSettings, Project, Blog, Certificate, Contact } from "../src/types.js";

// Accepts whichever name the Vercel Redis integration (or a standalone Redis Cloud /
// self-hosted instance) injects for the standard redis:// connection string.
// Read lazily (not as a top-level const) — server.ts calls dotenv.config() after its
// imports run, and ES module imports are hoisted, so a top-level read here would
// always see process.env as it was before .env got loaded.
const getConnectionString = (): string | undefined =>
  process.env.REDIS_URL || process.env.KV_URL || process.env.REDIS_CONNECTION_STRING;

export const isStoreConfigured = (): boolean => !!getConnectionString();

let client: Redis | null = null;
const getClient = (): Redis => {
  if (!client) {
    const connectionString = getConnectionString();
    if (!connectionString) {
      throw new Error(
        "No Redis store configured. Set REDIS_URL to a redis:// connection string."
      );
    }
    client = new Redis(connectionString, { maxRetriesPerRequest: 3 });
    // ioredis emits 'error' on connection issues (e.g. transient network blips); without
    // a listener Node treats that as an unhandled error and crashes the process.
    client.on("error", (err) => console.error("Redis client error:", err.message));
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
  if (!isStoreConfigured()) return fallback;
  const raw = await getClient().get(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await getClient().set(key, JSON.stringify(value));
}

export const getSettings = () => readJson<SiteSettings>(KEYS.settings, DEFAULT_SETTINGS);
export const saveSettings = (value: SiteSettings) => writeJson(KEYS.settings, value);

export const getProjects = () => readJson<Project[]>(KEYS.projects, DEFAULT_PROJECTS);
export const saveProjects = (value: Project[]) => writeJson(KEYS.projects, value);

export const getBlogs = () => readJson<Blog[]>(KEYS.blogs, DEFAULT_BLOGS);
export const saveBlogs = (value: Blog[]) => writeJson(KEYS.blogs, value);

export const getCertificates = () => readJson<Certificate[]>(KEYS.certificates, DEFAULT_CERTIFICATES);
export const saveCertificates = (value: Certificate[]) => writeJson(KEYS.certificates, value);

export const getContacts = () => readJson<Contact[]>(KEYS.contacts, []);
export const saveContacts = (value: Contact[]) => writeJson(KEYS.contacts, value);
