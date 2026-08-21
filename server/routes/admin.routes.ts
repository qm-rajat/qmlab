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
} from "../lib/auth.ts";
import { getMailTransporter, isSmtpConfigured } from "../services/mail.service.ts";

const execPromise = util.promisify(exec);
import {
  saveSettings,
  saveProjects,
  saveBlogs,
  saveCertificates,
  getContacts,
  saveContacts,
} from "../lib/store.ts";

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
      const senderName = process.env.SMTP_SENDER_NAME || "QM Labs";
      await transporter.sendMail({
        from: `"${senderName}" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `${code} is your QM Labs verification code`,
        text: `Your QM Labs verification code is ${code}. It expires in 10 minutes. If you did not request this code, you can safely ignore this email.`,
        html: `
          <div style="margin:0;background:#eef4f8;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#172b3a;">
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your QM Labs admin verification code expires in 10 minutes.</div>
            <div style="max-width:560px;margin:0 auto;">
              <div style="padding:0 8px 18px;text-align:center;">
                <div style="display:inline-block;border:1px solid #c9dce7;border-radius:12px;background:#ffffff;padding:10px 16px;color:#0b7894;font-size:14px;font-weight:700;letter-spacing:1px;">
                  QM LABS
                </div>
              </div>
              <div style="overflow:hidden;border:1px solid #d9e5eb;border-radius:18px;background:#ffffff;box-shadow:0 8px 24px rgba(23,43,58,.08);">
                <div style="background:#123b52;padding:30px 32px;color:#ffffff;">
                  <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8ed8e7;">Admin console security</div>
                  <h1 style="margin:10px 0 0;font-size:26px;line-height:1.25;font-weight:700;">Verify your sign-in</h1>
                </div>
                <div style="padding:32px;">
                  <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#385265;">Use the verification code below to securely access your QM Labs admin console.</p>
                  <div style="margin:26px 0;padding:22px 16px;border:1px solid #b9e2e8;border-radius:14px;background:#f0fbfc;text-align:center;">
                    <div style="margin-bottom:8px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#4f7180;">Your one-time code</div>
                    <div style="font-size:36px;line-height:1.2;font-weight:700;letter-spacing:10px;color:#087f91;">${code}</div>
                  </div>
                  <p style="margin:0;font-size:14px;line-height:1.6;color:#5d7380;"><strong style="color:#385265;">This code expires in 10 minutes.</strong> For your security, never share it with anyone.</p>
                  <div style="height:1px;margin:26px 0;background:#e4edf1;"></div>
                  <p style="margin:0;font-size:13px;line-height:1.6;color:#718592;">If you did not try to sign in, you can safely ignore this email. Your account remains protected.</p>
                </div>
              </div>
              <p style="margin:18px 0 0;text-align:center;font-size:11px;line-height:1.5;color:#78909c;">This is an automated security message from QM Labs.<br>Technical SEO Expert &amp; Full-Stack Developer</p>
            </div>
          </div>
        `,
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
