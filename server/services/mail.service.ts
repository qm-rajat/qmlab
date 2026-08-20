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

export const renderEmailFooter = (senderName: string): string => `
  <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
    <strong>${escapeHtml(senderName)}</strong><br>
    Technical SEO Expert &amp; Full-Stack Developer<br>
    <a href="https://qmlabs.tech" style="color: #475569; text-decoration: underline;">QM Labs Tech</a>
  </div>
`;
