import { Router } from "express";
import { exec } from "child_process";
import util from "util";
import {
  isAdminAuthConfigured,
  verifyAdminPassword,
  issueSessionCookie,
  clearSessionCookie,
  isValidSession,
  requireAdmin,
} from "../lib/auth.js";

const execPromise = util.promisify(exec);

import {
  saveSettings,
  saveProjects,
  saveBlogs,
  saveCertificates,
  getContacts,
  saveContacts,
} from "../lib/store.js";

const router = Router();

// Auth Endpoints
router.post("/login", async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, error: "Admin password is required." });
  }

  if (!isAdminAuthConfigured()) {
    return res.status(503).json({
      success: false,
      error: "Admin password is not configured. Set ADMIN_PASSWORD and SESSION_SECRET environment variables.",
    });
  }

  try {
    if (!(await verifyAdminPassword(password))) {
      return res.status(401).json({ success: false, error: "Invalid password." });
    }

    issueSessionCookie(res);
    return res.json({ success: true });
  } catch (error: any) {
    console.error("Admin login failed:", error);
    return res.status(500).json({ success: false, error: "Unable to process admin login right now." });
  }
});

router.post("/logout", (req, res) => {
  clearSessionCookie(res);
  res.json({ success: true });
});

router.get("/session", (req, res) => {
  res.json({ loggedIn: isValidSession(req) });
});

// Admin Content Mutations
router.put("/settings", requireAdmin, async (req, res) => {
  try {
    await saveSettings(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save settings." });
  }
});

router.put("/projects", requireAdmin, async (req, res) => {
  try {
    await saveProjects(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save projects." });
  }
});

router.put("/blogs", requireAdmin, async (req, res) => {
  try {
    await saveBlogs(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save blogs." });
  }
});

router.put("/certificates", requireAdmin, async (req, res) => {
  try {
    await saveCertificates(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save certificates." });
  }
});

router.get("/contacts", requireAdmin, async (req, res) => {
  try {
    const contacts = await getContacts();
    res.json({ success: true, contacts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load contacts." });
  }
});

router.put("/contacts", requireAdmin, async (req, res) => {
  try {
    await saveContacts(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save contacts." });
  }
});

router.post("/backup", requireAdmin, async (req, res) => {
  try {
    const { stdout, stderr } = await execPromise("npm run backup");
    res.json({ success: true, message: "Backup completed successfully.", output: stdout });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Backup failed.", output: error.stdout });
  }
});

router.post("/restore", requireAdmin, async (req, res) => {
  try {
    const { stdout, stderr } = await execPromise("npm run restore -- --force");
    res.json({ success: true, message: "Restore completed successfully.", output: stdout });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Restore failed.", output: error.stdout });
  }
});

export default router;
