import fs from "fs";
import path from "path";
import os from "os";
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
  getStoredAiApiKey
} from "../lib/store.js";

export async function generateSqliteArchiveBuffer(): Promise<{ buffer: Buffer; filename: string }> {
  // 1. Fetch current database state from Redis
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

  // 2. Create temporary SQLite database file
  const tempDir = os.tmpdir();
  const dateStr = new Date().toISOString().split("T")[0];
  const tempFilename = `portfolio_archive_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.sqlite`;
  const tempPath = path.join(tempDir, tempFilename);

  const db = new DatabaseSync(tempPath);

  // 3. Initialize schema for relational querying and portable backup
  db.exec(`
    CREATE TABLE IF NOT EXISTS metadata (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      projects_count INTEGER,
      blogs_count INTEGER,
      contacts_count INTEGER,
      certificates_count INTEGER,
      services_count INTEGER,
      faqs_count INTEGER,
      workflow_steps_count INTEGER,
      raw_payload TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT,
      slug TEXT,
      description TEXT,
      live_url TEXT,
      github_url TEXT,
      is_featured INTEGER DEFAULT 0,
      technologies TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT,
      categories TEXT,
      tags TEXT,
      excerpt TEXT,
      content_html TEXT,
      status TEXT,
      view_count INTEGER DEFAULT 0,
      like_count INTEGER DEFAULT 0,
      read_time_mins INTEGER DEFAULT 1,
      published_at TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT,
      status TEXT,
      priority TEXT,
      estimated_value TEXT,
      inquiry_type TEXT,
      notes TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      issuer TEXT,
      issue_date TEXT,
      expiry_date TEXT,
      credential_id TEXT,
      verify_url TEXT
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT,
      short_description TEXT,
      deliverables TEXT,
      pricing_type TEXT,
      starting_price TEXT,
      turnaround_time TEXT,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS workflow_steps (
      id TEXT PRIMARY KEY,
      step TEXT,
      title TEXT NOT NULL,
      timeline TEXT,
      description TEXT,
      deliverables TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS trust_guarantees (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      sort_order INTEGER DEFAULT 0
    );
  `);

  const now = new Date().toISOString();

  // Insert metadata
  const insertMeta = db.prepare("INSERT INTO metadata (key, value) VALUES (?, ?)");
  insertMeta.run("exported_at", now);
  insertMeta.run("version", "1.0");
  insertMeta.run("site_name", settings.hero_name || "Portfolio");
  insertMeta.run("site_contact_email", settings.contact_email || "");

  // Insert full JSON snapshot
  const insertSnapshot = db.prepare(`
    INSERT INTO snapshots (
      created_at, projects_count, blogs_count, contacts_count,
      certificates_count, services_count, faqs_count, workflow_steps_count, raw_payload
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const rawPayload = JSON.stringify({
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
    aiApiKey,
  });

  insertSnapshot.run(
    now,
    projects.length,
    blogs.length,
    contacts.length,
    certificates.length,
    services.length,
    faqs.length,
    workflowSteps.length,
    rawPayload
  );

  // Insert Projects
  const insertProject = db.prepare(`
    INSERT INTO projects (id, title, category, slug, description, live_url, github_url, is_featured, technologies, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const p of projects) {
    insertProject.run(
      p.id,
      p.title || "",
      p.category || "",
      p.slug || "",
      p.description || "",
      p.live_url || "",
      p.github_url || "",
      p.is_featured ? 1 : 0,
      Array.isArray(p.technologies) ? p.technologies.join(", ") : "",
      p.created_at || now
    );
  }

  // Insert Blogs
  const insertBlog = db.prepare(`
    INSERT INTO blogs (id, title, slug, categories, tags, excerpt, content_html, status, view_count, like_count, read_time_mins, published_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const b of blogs) {
    insertBlog.run(
      b.id,
      b.title || "",
      b.slug || "",
      Array.isArray(b.categories) ? b.categories.join(", ") : "",
      Array.isArray(b.tags) ? b.tags.join(", ") : "",
      b.excerpt || "",
      b.content_html || "",
      b.status || "published",
      b.view_count || 0,
      b.like_count || 0,
      b.read_time_mins || 1,
      b.published_at || now,
      b.created_at || now
    );
  }

  // Insert Contacts
  const insertContact = db.prepare(`
    INSERT INTO contacts (id, name, email, message, status, priority, estimated_value, inquiry_type, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      c.created_at || now
    );
  }

  // Insert Certificates
  const insertCert = db.prepare(`
    INSERT INTO certificates (id, title, issuer, issue_date, expiry_date, credential_id, verify_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const cert of certificates) {
    insertCert.run(
      cert.id,
      cert.title || "",
      cert.issuer || "",
      cert.issue_date || "",
      cert.expiry_date || "",
      cert.credential_id || "",
      cert.verify_url || ""
    );
  }

  // Insert Services
  const insertService = db.prepare(`
    INSERT INTO services (id, title, slug, short_description, deliverables, pricing_type, starting_price, turnaround_time, is_active, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const s of services) {
    insertService.run(
      s.id,
      s.title || "",
      s.slug || "",
      s.short_description || "",
      Array.isArray(s.deliverables) ? s.deliverables.join(", ") : "",
      s.pricing_type || "fixed",
      s.starting_price || "",
      s.turnaround_time || "",
      s.is_active ? 1 : 0,
      s.sort_order || 0
    );
  }

  // Insert FAQs
  const insertFaq = db.prepare(`
    INSERT INTO faqs (id, question, answer, category, is_active, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const f of faqs) {
    insertFaq.run(
      f.id,
      f.question || "",
      f.answer || "",
      f.category || "",
      f.is_active ? 1 : 0,
      f.sort_order || 0
    );
  }

  // Insert Workflow Steps
  const insertStep = db.prepare(`
    INSERT INTO workflow_steps (id, step, title, timeline, description, deliverables, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const step of workflowSteps) {
    insertStep.run(
      step.id,
      step.step || "",
      step.title || "",
      step.timeline || "",
      step.description || "",
      Array.isArray(step.deliverables) ? step.deliverables.join(", ") : "",
      step.sort_order || 0
    );
  }

  // Insert Trust Guarantees
  const insertTrust = db.prepare(`
    INSERT INTO trust_guarantees (id, title, description, icon, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const t of trustGuarantees) {
    insertTrust.run(
      t.id,
      t.title || "",
      t.description || "",
      t.icon || "",
      t.sort_order || 0
    );
  }

  // Read the buffer and cleanup temp file
  db.close();
  const fileBuffer = fs.readFileSync(tempPath);
  try {
    fs.unlinkSync(tempPath);
  } catch {}

  const finalFilename = `qmlabs-archive-${dateStr}.sqlite`;
  return {
    buffer: fileBuffer,
    filename: finalFilename,
  };
}
