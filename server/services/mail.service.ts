import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const isSmtpConfigured = (): boolean => {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
};

export const getMailTransporter = () => {
  if (!isSmtpConfigured()) {
    throw new Error("SMTP server environment parameters are unconfigured.");
  }

  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    secure: port === 465 || process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const escapeHtml = (input: string): string =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const sanitizeHeaderValue = (input: string): string => input.replace(/[\r\n]+/g, " ").trim();

export const formatContactName = (rawName?: string): string => {
  if (!rawName || !rawName.trim()) return "there";
  const trimmed = rawName.trim();
  const lower = trimmed.toLowerCase();
  
  if (
    lower === "name" ||
    lower === "user" ||
    lower === "there" ||
    lower === "guest" ||
    lower === "anonymous" ||
    lower === "test" ||
    lower === "tester" ||
    lower.startsWith("seo lead:") ||
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.includes("@")
  ) {
    return "there";
  }

  return trimmed
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const renderEmailFooter = (senderName: string, siteUrl?: string, showUnsubscribe?: boolean): string => {
  const effectiveUrl = siteUrl || process.env.SITE_URL || process.env.VITE_SITE_URL || "https://qmlab-indol.vercel.app";
  const displayHost = effectiveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const unsubscribeBlock = showUnsubscribe ? `
    <div style="margin-top: 12px; font-size: 10px; color: #94a3b8;">
      Don't want to receive Quarterly Tech Dispatches? <a href="${effectiveUrl}/#blog?action=unsubscribe" target="_blank" rel="noopener noreferrer" style="color: #64748b; text-decoration: underline;">Unsubscribe here</a>
    </div>
  ` : '';

  return `
  <div style="background-color: #f8fafc; padding: 24px 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <strong style="color: #0f172a; font-size: 13px; letter-spacing: -0.01em;">${escapeHtml(senderName)}</strong><br>
    <span style="color: #64748b; font-size: 11px; margin-top: 2px; display: inline-block;">Full-Stack Developer &amp; Technical SEO Specialist</span><br>
    <a href="${effectiveUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 11px; margin-top: 6px; display: inline-block;">${escapeHtml(displayHost)}</a>
    ${unsubscribeBlock}
  </div>
`;
};
