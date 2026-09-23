import "dotenv/config";
import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import {
  getSettings,
  getProjects,
  getBlogs,
  getCertificates,
  getContacts,
  getServices,
  getFaqs,
  getWorkflowSteps,
  getTrustGuarantees,
  getCustomPassword,
  getStoredAiApiKey,
  getRedisClient
} from "../server/lib/store.js";

const ARCHIVE_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(ARCHIVE_DIR, "portfolio_archive.sqlite");

async function runLocalSqliteSync() {
  console.log("==========================================");
  console.log("🚀 Starting Local SQLite Archive & Sync");
  console.log("==========================================");

  try {
    // 1. Ensure directory exists
    if (!fs.existsSync(ARCHIVE_DIR)) {
      fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    }

    // 2. Fetch live data from Redis
    console.log("📡 Step 1: Fetching current data from Redis...");
    const [
      settings,
      projects,
      blogs,
      certificates,
      contacts,
      services,
      faqs,
      workflowSteps,
      trustGuarantees,
      customPassword,
      aiApiKey
    ] = await Promise.all([
      getSettings(),
      getProjects(),
      getBlogs(),
      getCertificates(),
      getContacts(),
      getServices(),
      getFaqs(),
      getWorkflowSteps(),
      getTrustGuarantees(),
      getCustomPassword(),
      getStoredAiApiKey()
    ]);

    // 3. Connect/Initialize SQLite database
    console.log(`💾 Step 2: Writing to SQLite database at: ${DB_PATH}`);
    const db = new DatabaseSync(DB_PATH);

    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        projects_count INTEGER,
        blogs_count INTEGER,
        contacts_count INTEGER,
        certificates_count INTEGER,
        services_count INTEGER,
        raw_payload TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS contacts_archive (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        message TEXT,
        status TEXT,
        priority TEXT,
        estimated_value TEXT,
        inquiry_type TEXT,
        notes TEXT,
        created_at TEXT,
        archived_at TEXT
      );

      CREATE TABLE IF NOT EXISTS blogs_archive (
        id TEXT PRIMARY KEY,
        title TEXT,
        slug TEXT,
        categories TEXT,
        tags TEXT,
        view_count INTEGER,
        like_count INTEGER,
        status TEXT,
        created_at TEXT,
        archived_at TEXT
      );

      CREATE TABLE IF NOT EXISTS projects_archive (
        id TEXT PRIMARY KEY,
        title TEXT,
        category TEXT,
        live_url TEXT,
        created_at TEXT,
        archived_at TEXT
      );
    `);

    const now = new Date().toISOString();

    // 4. Insert full snapshot
    const insertSnapshot = db.prepare(`
      INSERT INTO snapshots (created_at, projects_count, blogs_count, contacts_count, certificates_count, services_count, raw_payload)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const fullPayload = JSON.stringify({
      settings,
      projects,
      blogs,
      certificates,
      contacts,
      services,
      faqs,
      workflowSteps,
      trustGuarantees,
      customPassword,
      aiApiKey
    });

    insertSnapshot.run(
      now,
      projects.length,
      blogs.length,
      contacts.length,
      certificates.length,
      services.length,
      fullPayload
    );

    // 5. Upsert contacts into relational archive
    const insertContact = db.prepare(`
      INSERT INTO contacts_archive (id, name, email, message, status, priority, estimated_value, inquiry_type, notes, created_at, archived_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        status = excluded.status,
        priority = excluded.priority,
        estimated_value = excluded.estimated_value,
        notes = excluded.notes,
        archived_at = excluded.archived_at
    `);

    for (const c of contacts) {
      insertContact.run(
        c.id,
        c.name || "",
        c.email || "",
        c.message || "",
        c.status || "unread",
        c.priority || "normal",
        c.estimated_value || "",
        c.inquiry_type || "general",
        c.notes || "",
        c.created_at || now,
        now
      );
    }

    // 6. Upsert blogs into relational archive
    const insertBlog = db.prepare(`
      INSERT INTO blogs_archive (id, title, slug, categories, tags, view_count, like_count, status, created_at, archived_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        view_count = excluded.view_count,
        like_count = excluded.like_count,
        status = excluded.status,
        archived_at = excluded.archived_at
    `);

    for (const b of blogs) {
      insertBlog.run(
        b.id,
        b.title || "",
        b.slug || "",
        (b.categories || []).join(", "),
        (b.tags || []).join(", "),
        b.view_count || 0,
        b.like_count || 0,
        b.status || "published",
        b.created_at || now,
        now
      );
    }

    // Verify written rows
    const snapshotCount = db.prepare("SELECT COUNT(*) as count FROM snapshots").get() as any;
    const archivedContactsCount = db.prepare("SELECT COUNT(*) as count FROM contacts_archive").get() as any;
    const archivedBlogsCount = db.prepare("SELECT COUNT(*) as count FROM blogs_archive").get() as any;

    console.log("✅ Step 3: SQLite Write Confirmed & Verified:");
    console.log(`   - Snapshots in DB: ${snapshotCount.count}`);
    console.log(`   - Archived Contacts: ${archivedContactsCount.count}`);
    console.log(`   - Archived Blogs: ${archivedBlogsCount.count}`);

    // 7. Check Redis storage before/after
    const redis = getRedisClient();
    if (redis) {
      const ephemeralKeys = await redis.keys("qmlabs:telemetry:*");
      console.log(`🧹 Step 4: Found ${ephemeralKeys.length} ephemeral telemetry keys in Redis.`);
      if (ephemeralKeys.length > 0) {
        await redis.del(...ephemeralKeys);
        console.log(`   ✨ Safely pruned ${ephemeralKeys.length} telemetry logs from Redis to free up memory.`);
      } else {
        console.log("   ✨ Redis telemetry buffer is clean.");
      }
    }

    console.log("==========================================");
    console.log("🎉 Weekly SQLite Sync Complete!");
    console.log(`File: ${DB_PATH}`);
    console.log("You can inspect this database using DB Browser for SQLite or TablePlus.");
    console.log("==========================================");

    process.exit(0);
  } catch (err: any) {
    console.error("❌ SQLite Sync failed:", err);
    process.exit(1);
  }
}

runLocalSqliteSync();
