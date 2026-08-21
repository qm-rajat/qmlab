import { Router } from "express";
import { exec } from "child_process";
import util from "util";
import {
  isAdminAuthConfigured,
  sendAdminOtp,
  verifyAdminOtp,
  issueSessionCookie,
  clearSessionCookie,
  isValidSession,
  requireAdmin,
} from "../lib/auth";
import { getMailTransporter, isSmtpConfigured } from "../services/mail.service";

const execPromise = util.promisify(exec);
import {
  saveSettings,
  saveProjects,
  saveBlogs,
  saveCertificates,
  getContacts,
  saveContacts,
} from "../lib/store";

const router = Router();

// Auth Endpoints
router.post("/login", async (req, res) => {
  const { email, otp } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: "Admin email is required." });
  }
  if (!isAdminAuthConfigured()) {
    return res.status(503).json({
      success: false,
      error: "Admin OTP login is not configured. Set ADMIN_EMAIL, SESSION_SECRET, Redis, and SMTP variables.",
    });
  }

  try {
    if (!otp) {
      if (!isSmtpConfigured()) {
        return res.status(503).json({ success: false, error: "SMTP is not configured to send the admin OTP." });
      }
      const code = await sendAdminOtp(email);
      if (!code) return res.status(401).json({ success: false, error: "Use the configured administrator email." });
      const transporter = getMailTransporter();
      await transporter.sendMail({
        from: `"QM Labs Admin" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "Your QM Labs admin login code",
        text: `Your QM Labs admin login code is ${code}. It expires in 10 minutes. If you did not request it, ignore this email.`,
        html: `<p>Your QM Labs admin login code is:</p><p style="font-size:28px;font-weight:bold;letter-spacing:8px">${code}</p><p>This code expires in 10 minutes.</p>`,
      });
      return res.json({ success: true, otpRequired: true });
    }

    if (!(await verifyAdminOtp(email, otp))) {
      return res.status(401).json({ success: false, error: "Invalid or expired OTP." });
    }
    issueSessionCookie(res);
    return res.json({ success: true });
  } catch (error: any) {
    console.error("Admin OTP login failed:", error);
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
