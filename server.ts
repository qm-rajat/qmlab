import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  isAdminAuthConfigured,
  verifyAdminCredentials,
  issueSessionCookie,
  clearSessionCookie,
  isValidSession,
  requireAdmin,
} from "./server/auth";
import {
  isStoreConfigured,
  getSettings,
  saveSettings,
  getProjects,
  saveProjects,
  getBlogs,
  saveBlogs,
  getCertificates,
  saveCertificates,
  getContacts,
  saveContacts,
} from "./server/store";
import { Contact } from "./src/types";

// Initialize environment configuration
dotenv.config();

// Canonical site URL used in outbound email links — configurable so it doesn't go
// stale if the deployment domain changes again.
const SITE_URL = process.env.SITE_URL || "https://qmlab-indol.vercel.app";

// Escapes user-supplied text before it's interpolated into an HTML email body.
const escapeHtml = (input: string): string =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Strips newlines from user-supplied text before it's used in an email header
// (subject/from/replyTo), so a message can't inject extra headers.
const sanitizeHeaderValue = (input: string): string => input.replace(/[\r\n]+/g, " ").trim();

// Shared footer block used across the recruiter/client-facing auto-reply emails.
const renderEmailFooter = (senderName: string): string => `
  <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
    <strong>${escapeHtml(senderName)}</strong><br>
    Technical SEO Expert &amp; Full-Stack Developer<br>
    <a href="https://qmlabs.tech" style="color: #475569; text-decoration: underline;">QM Labs Tech</a>
  </div>
`;

// Create Gemini client lazily
let geminiClient: GoogleGenAI | null = null;
const getGeminiClient = (): GoogleGenAI | null => {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      geminiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return geminiClient;
};

const app = express();
const PORT = 3000;

// Middleware for parsing requests
app.use(express.json());
app.use(cookieParser());

// Helper to check if SMTP is fully configured in environment
const isSmtpConfigured = (): boolean => {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
};

// Create Nodemailer Transporter lazily
const getMailTransporter = () => {
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
      rejectUnauthorized: false, // Prevents certificate self-sign rejections
    },
  });
};

// --- API ENDPOINTS ---

// 1. Get SMTP Configuration Status
app.get("/api/smtp-status", (req, res) => {
  const configured = isSmtpConfigured();
  res.json({
    status: "ok",
    configured,
    host: process.env.SMTP_HOST || null,
    user: process.env.SMTP_USER ? `${process.env.SMTP_USER.split("@")[0]}@...` : null,
    toEmail: process.env.SMTP_TO || process.env.SMTP_USER || null,
  });
});

// 2. Test SMTP Connection & Send Test Email
app.post("/api/test-smtp", async (req, res) => {
  try {
    if (!isSmtpConfigured()) {
      return res.status(400).json({
        success: false,
        error: "SMTP server environment parameters are unconfigured in .env.",
      });
    }

    const transporter = getMailTransporter();
    const recipient = process.env.SMTP_TO || process.env.SMTP_USER!;
    const senderName = process.env.SMTP_SENDER_NAME || "QM Labs";

    const mailOptions = {
      from: `"${senderName} SMTP Test" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject: "⚡ SMTP Connection Test - Rajat Portfolio CRM",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #0284c7; margin-top: 0;">Connection Test: Successful</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            Hello! This is an automated email verifying that your portfolio SMTP integrations are fully functional.
          </p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 12px; margin: 20px 0; border: 1px solid #f1f5f9; font-family: monospace; font-size: 12px; color: #475569;">
            <strong>SMTP Host:</strong> ${process.env.SMTP_HOST}<br>
            <strong>SMTP Port:</strong> ${process.env.SMTP_PORT}<br>
            <strong>Authenticated User:</strong> ${process.env.SMTP_USER}<br>
            <strong>Timestamp:</strong> ${new Date().toISOString()}
          </div>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 0; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            This email was dispatched automatically from your full-stack applet container server. No action is required.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: `Test email dispatched successfully to ${recipient}` });
  } catch (error: any) {
    console.error("SMTP Test Failure:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to dispatch test mail." });
  }
});

// Labels the admin notification email by why someone actually reached out, instead of
// always saying "New Lead" — the visitor picks freelance/project vs. general on the
// contact form; SEO audit report requests come through a separate flow but the same route.
const INQUIRY_META: { [key: string]: { subjectLabel: string; heading: string } } = {
  freelance_project: { subjectLabel: '🛠️ New Freelance Inquiry', heading: '🛠️ New Freelance / Project Inquiry' },
  general: { subjectLabel: '✉️ New Message', heading: '✉️ New General Inquiry' },
  audit: { subjectLabel: '📊 SEO Audit Requested', heading: '📊 New SEO Audit Report Request' },
};

// 3. Handle Contact Form Submission & Dispatches
app.post("/api/contact", async (req, res) => {
  const { name, email, message, estimated_value, priority, inquiry_type } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Name, email, and message fields are required." });
  }

  const isAuditLead = req.body.type === 'audit' || String(name).startsWith('SEO Lead:');
  const effectiveInquiryType = isAuditLead
    ? 'audit'
    : (inquiry_type && INQUIRY_META[inquiry_type] ? inquiry_type : 'general');

  // Persist the lead server-side so it actually shows up in the admin CRM inbox,
  // regardless of which browser/device the visitor submitted it from.
  const newContact: Contact = {
    id: `cont_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    email,
    message,
    status: "unread",
    created_at: new Date().toISOString(),
    ...(estimated_value ? { estimated_value } : {}),
    ...(priority ? { priority } : {}),
    ...(!isAuditLead && inquiry_type && INQUIRY_META[inquiry_type] ? { inquiry_type } : {}),
  };
  try {
    const existingContacts = await getContacts();
    await saveContacts([newContact, ...existingContacts]);
  } catch (storeError) {
    console.error("Failed to persist contact to KV store:", storeError);
  }

  const responsePayload: any = {
    success: true,
    smtp_active: isSmtpConfigured(),
    emails_sent: false,
    message: "Inquiry registered successfully.",
  };

  if (isSmtpConfigured()) {
    try {
      const transporter = getMailTransporter();
      const adminRecipient = process.env.SMTP_TO || process.env.SMTP_USER!;
      const senderName = process.env.SMTP_SENDER_NAME || "Rajat Kumar Dash";

      // Escape everything visitor-supplied before it lands in HTML, and strip
      // newlines from anything that flows into an email header.
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
      const headerSafeName = sanitizeHeaderValue(name);

      // estimated_value and priority are optional fields an admin can tag onto a lead
      // later from the CRM — they're almost never present at submission time, so only
      // render these rows when a value actually exists instead of showing fabricated
      // "Not Specified" placeholders.
      const inquiryMeta = INQUIRY_META[effectiveInquiryType];
      const subjectTag = priority === 'high' ? '🔥 URGENT LEAD' : inquiryMeta.subjectLabel;
      const budgetTag = estimated_value ? ` [${estimated_value}]` : '';
      const emailSubject = `${subjectTag}: ${headerSafeName}${budgetTag}`;

      const budgetRow = estimated_value ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 11px; text-transform: uppercase;">Estimated Budget</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #10b981; font-weight: 700; font-size: 14px;">${escapeHtml(estimated_value)}</td>
                </tr>` : '';
      const urgencyRow = priority ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 11px; text-transform: uppercase;">Project Urgency</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: ${priority === 'high' ? '#ef4444' : (priority === 'medium' ? '#f59e0b' : '#64748b')}; font-weight: bold; font-size: 13px; text-transform: uppercase;">
                    ${priority === 'high' ? '🔥 High (Urgent)' : (priority === 'medium' ? '⚡ Medium (1-3 Mo)' : 'Flexible (Low)')}
                  </td>
                </tr>` : '';

      // A. Dispatch Lead Notification Email to Admin
      const adminMailOptions = {
        from: `"${senderName} Portfolio" <${process.env.SMTP_USER}>`,
        to: adminRecipient,
        replyTo: email,
        subject: emailSubject,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background-color: #0f172a; padding: 25px; color: #ffffff;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #38bdf8;">QM Labs Portfolio CRM</span>
              <h2 style="margin: 5px 0 0 0; font-weight: 900; font-size: 20px;">${inquiryMeta.heading}</h2>
            </div>
            <div style="padding: 30px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 11px; text-transform: uppercase; width: 120px;">Lead Name</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-weight: 600; font-size: 14px;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 11px; text-transform: uppercase;">Sender Email</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #0284c7; font-weight: 600; font-size: 14px;"><a href="mailto:${safeEmail}" style="color: #0284c7; text-decoration: none;">${safeEmail}</a></td>
                </tr>${budgetRow}${urgencyRow}
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 11px; text-transform: uppercase;">Timestamp</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 12px; font-family: monospace;">${new Date().toLocaleString("en-IN")}</td>
                </tr>
              </table>

              <div style="margin-top: 10px;">
                <label style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 8px;">Inbound Message Description</label>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</div>
              </div>

              <div style="margin-top: 25px; text-align: center;">
                <a href="${SITE_URL}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; display: inline-block;">Open CRM Console</a>
              </div>
            </div>
            <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0;">
              This email alert was automatically generated by the QM Labs Full-Stack Server on behalf of ${escapeHtml(senderName)}.
            </div>
          </div>
        `,
      };

      // B. Dispatch Automated Polish Auto-Reply Email to the Sender (Recruiter / Client / Auditor)
      let siteHost = 'your website';
      if (name.startsWith('SEO Lead:')) {
        siteHost = name.replace('SEO Lead:', '').trim();
      }
      const safeSiteHost = escapeHtml(siteHost);
      const headerSafeSiteHost = sanitizeHeaderValue(siteHost);

      let userMailOptions;

      if (isAuditLead) {
        userMailOptions = {
          from: `"${senderName}" <${process.env.SMTP_USER}>`,
          to: email,
          subject: `⚡ Your SEO & Core Web Vitals Audit Report - ${headerSafeSiteHost}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <div style="background-color: #0f172a; padding: 30px; color: #ffffff;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #38bdf8;">QM Labs Diagnostics</span>
                <h1 style="margin: 5px 0 0 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">Report Compiled Successfully!</h1>
                <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">Technical SEO & Lighthouse Diagnostics for ${safeSiteHost}</p>
              </div>

              <div style="padding: 30px; color: #334155; font-size: 14px; line-height: 1.6;">
                <p style="font-size: 15px; font-weight: bold; margin-top: 0;">Hello,</p>

                <p>
                  Thank you for running a Technical SEO & Core Web Vitals audit on my platform! Your customized, lightweight Lighthouse diagnostics report for <strong>${safeSiteHost}</strong> has been successfully compiled and downloaded.
                </p>

                <p>
                  This audit analyzed your site’s page load metrics, key speed performance milestones (LCP, INP, CLS), robots configuration, sitemap index integrity, and vital accessibility scores.
                </p>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin: 25px 0;">
                  <h4 style="margin: 0 0 12px 0; color: #1e293b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">🛠️ Next Steps & Optimization:</h4>
                  <p style="margin: 0 0 10px 0; font-size: 13px; color: #475569;">
                    Deploying these optimization recommendations can substantially improve your organic search results, crawling efficiency, and Google PageSpeed benchmarks.
                  </p>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">💻 <a href="${SITE_URL}" style="color: #2563eb; text-decoration: none; font-weight: 600;">Technical Portfolio Home</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">⚡ <a href="${SITE_URL}" style="color: #2563eb; text-decoration: none; font-weight: 600;">Run Another SEO Audit</a></td>
                    </tr>
                  </table>
                </div>

                <p>
                  If you require comprehensive full-stack audits, custom React core engineering, or dedicated performance consulting to attain flawless 100% Core Web Vital scores, feel free to get in touch.
                </p>

                <p style="font-size: 12px; color: #64748b; font-style: italic; margin-top: 20px; margin-bottom: 0;">
                  Note: This was dispatched from my automated SMTP integration. If you want to append additional specifications or discuss custom enterprise solutions, please feel free to reply directly to this email!
                </p>
              </div>
              ${renderEmailFooter(senderName)}
            </div>
          `,
        };
      } else {
        userMailOptions = {
          from: `"${senderName}" <${process.env.SMTP_USER}>`,
          to: email,
          subject: `📬 Confirmation: Message received by Rajat Kumar Dash`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <div style="background-color: #2563eb; padding: 30px; color: #ffffff;">
                <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">Thank you for reaching out!</h1>
                <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">Your message has been received successfully.</p>
              </div>
              
              <div style="padding: 30px; color: #334155; font-size: 14px; line-height: 1.6;">
                <p style="font-size: 15px; font-weight: bold; margin-top: 0;">Hi ${safeName},</p>

                <p>
                  Thanks for checking out my website and leaving a message! This is an automated confirmation to let you know that your submission has been securely logged in my portfolio pipeline CRM database.
                </p>

                <p>
                  I review all incoming corporate requirements, freelance proposals, and technical recruitment queries daily. I will get back to you personally with a detailed response within <strong>24 hours</strong>.
                </p>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin: 25px 0;">
                  <h4 style="margin: 0 0 12px 0; color: #1e293b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">In the meantime, explore my engineering labs:</h4>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">💻 <a href="${SITE_URL}" style="color: #2563eb; text-decoration: none; font-weight: 600;">Technical Portfolio Home</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">⚡ <a href="${SITE_URL}" style="color: #2563eb; text-decoration: none; font-weight: 600;">Core Web Vitals & SEO Lab</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">🛠️ <a href="${SITE_URL}" style="color: #2563eb; text-decoration: none; font-weight: 600;">QA Test Suites & Case Studies</a></td>
                    </tr>
                  </table>
                </div>

                <p style="font-size: 12px; color: #64748b; font-style: italic; margin-bottom: 0;">
                  Note: This was dispatched from my automated SMTP integration. If you want to append additional specifications, designs, or files, please feel free to reply directly to this email!
                </p>
              </div>
              ${renderEmailFooter(senderName)}
            </div>
          `,
        };
      }

      // Execute both sends in parallel
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(userMailOptions),
      ]);

      responsePayload.emails_sent = true;
      responsePayload.message = "Message received. Notifications and follow-up emails successfully dispatched.";
    } catch (mailError: any) {
      console.error("Nodemailer dispatch failure:", mailError);
      responsePayload.smtp_error = mailError.message || "Unknown error";
      responsePayload.message = "Inquiry logged to portfolio CRM. However, SMTP notification engines failed to execute.";
    }
  }

  res.json(responsePayload);
});

// 4. AI-Powered Technical SEO Analysis Route
app.post("/api/seo/analyze", async (req, res) => {
  const { url, keyword, audience, existingTitle, existingDescription } = req.body;

  const cleanUrl = url || SITE_URL;
  const cleanKeyword = keyword || "Full-Stack Development";
  const cleanAudience = audience || "Tech Recruiters & CTOs";

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Analyze the following website context for Advanced Technical SEO Optimization:
URL: ${cleanUrl}
Primary Topic / Keyword: ${cleanKeyword}
Target Audience: ${cleanAudience}
Existing Title: ${existingTitle || "None"}
Existing Description: ${existingDescription || "None"}

Please generate:
1. Three high-click-through-rate (CTR) optimized Title tag suggestions under 60 characters, with brief explanations of why they work.
2. Two highly optimized Meta Description suggestions between 120-160 characters.
3. An optimized H1 header tag.
4. An NLP content brief including:
   - Word count recommendation.
   - Recommended H2/H3 outline headings.
   - Top 10 high-value semantic/NLP keywords to include.
   - 3 "People Also Ask" conversational questions for search engine feature rich snippets.
5. A custom JSON-LD schema block (valid Schema.org JSON) tailored to this content/business.

You MUST respond with a single, valid JSON object matching this exact TypeScript structure:
{
  "titles": [{"text": "Title string", "reason": "Explanation string"}],
  "descriptions": [{"text": "Description string", "reason": "Explanation string"}],
  "h1": "H1 tag string",
  "contentBrief": {
    "wordCountRecommendation": "e.g. 1500-2000 words",
    "outline": ["heading 1", "heading 2"],
    "nlpKeywords": ["keyword1", "keyword2"],
    "questions": ["q1", "q2"]
  },
  "schema": "formatted JSON-LD string"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are a professional enterprise Technical SEO Expert. You analyze meta structures, suggest crawl configurations, and return valid, optimized structures in strict JSON format.",
        },
      });

      const responseText = response.text || "{}";
      const data = JSON.parse(responseText.trim());

      return res.json({
        success: true,
        aiPowered: true,
        ...data,
      });
    } catch (apiError: any) {
      console.error("Gemini Technical SEO API Error:", apiError);
      // Fallback to high-quality procedural response on actual API error
    }
  }

  // Fallback Heuristics when Gemini API is unconfigured or fails
  return res.json({
    success: true,
    aiPowered: false,
    message: "Configure GEMINI_API_KEY in Settings > Secrets to unlock live AI analysis!",
    titles: [
      {
        text: `How to Dominate ${cleanKeyword}: Ultimate Guide for ${cleanAudience}`,
        reason: "Authoritative, benefit-driven title directly targeting your specific audience with strong CTR action verbs.",
      },
      {
        text: `Technical Blueprint: Maximizing Impact in ${cleanKeyword}`,
        reason: "Focuses on authority and architectural excellence, ideal for engineers, managers, and recruiters.",
      },
      {
        text: `Why ${cleanKeyword} is Your Core Web Vitals Key`,
        reason: "Bridges the primary topic with page performance criteria to grab search interest.",
      },
    ],
    descriptions: [
      {
        text: `Ready to master ${cleanKeyword}? Check out our complete expert breakdown. Learn about Core Web Vitals optimization, schema tags, and how to reach 100% scores.`,
        reason: "Includes secondary high-relevance terms like 'Core Web Vitals', 'optimization', and 'expert' to enhance organic search relevance.",
      },
      {
        text: `Discover technical SEO secrets of ${cleanKeyword} designed for ${cleanAudience}. Elevate your speed indexes and crawler mapping now.`,
        reason: "Creates a direct and compelling appeal to the target audience with a high-impact search CTA.",
      },
    ],
    h1: `The High-Performance Blueprint for ${cleanKeyword}`,
    contentBrief: {
      wordCountRecommendation: "1,750 - 2,100 words",
      outline: [
        `1. Introduction to ${cleanKeyword} and modern SEO indices`,
        `2. Addressing server response latency & optimization (TTFB)`,
        `3. Mastering milestone renders: First Contentful Paint & LCP`,
        `4. Minimizing visual layout shifts (CLS) on responsive screens`,
        `5. Semantic keywords & structured entities checklist`,
      ],
      nlpKeywords: [
        "Core Web Vitals",
        "Largest Contentful Paint",
        "Cumulative Layout Shift",
        "Time to First Byte",
        "Semantic schema",
        "Search indexing",
        "Robots directives",
        "Viewport responsiveness",
        "Lighthouse scores",
        "PageSpeed insights",
      ],
      questions: [
        `How does ${cleanKeyword} directly impact organic query rankings?`,
        "What are the best server frameworks to optimize LCP response timing?",
        "How can we configure Robots.txt to control aggressive AI scrapers?",
      ],
    },
    schema: `{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "The High-Performance Blueprint for ${cleanKeyword}",
  "description": "A comprehensive technical SEO guide to optimizing web architectures for modern indexing spiders and Core Web Vitals.",
  "url": "${cleanUrl}",
  "about": {
    "@type": "Thing",
    "name": "${cleanKeyword}"
  },
  "author": {
    "@type": "Person",
    "name": "Rajat Kumar Dash"
  }
}`,
  });
});

// 5. Admin Login — verifies email/password against ADMIN_EMAIL/ADMIN_PASSWORD_HASH
// and issues a signed, httpOnly session cookie. No credentials or hashes ever reach the client.
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email and password are required." });
  }
  if (!isAdminAuthConfigured()) {
    return res.status(503).json({
      success: false,
      error: "Admin auth is not configured on the server. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH, and SESSION_SECRET.",
    });
  }
  const valid = await verifyAdminCredentials(email, password);
  if (!valid) {
    return res.status(401).json({ success: false, error: "Invalid administrator credentials." });
  }
  issueSessionCookie(res);
  res.json({ success: true });
});

// 6. Admin Logout
app.post("/api/admin/logout", (req, res) => {
  clearSessionCookie(res);
  res.json({ success: true });
});

// 7. Admin Session Check — lets the frontend restore login state after a page refresh
app.get("/api/admin/session", (req, res) => {
  res.json({ loggedIn: isValidSession(req) });
});

// 8. Public Site Content — hydrates every visitor with the live projects/blogs/certs/settings.
// storeConfigured tells the client whether a KV store is wired up at all, so it can avoid
// clobbering its local cache with defaults when it isn't.
app.get("/api/content", async (req, res) => {
  try {
    const [settings, projects, blogs, certificates] = await Promise.all([
      getSettings(),
      getProjects(),
      getBlogs(),
      getCertificates(),
    ]);
    res.json({ success: true, storeConfigured: isStoreConfigured(), settings, projects, blogs, certificates });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load site content." });
  }
});

// 9. Admin Content Mutations — each replaces its whole collection, matching how the
// admin console already computes the full updated array client-side before saving.
app.put("/api/admin/settings", requireAdmin, async (req, res) => {
  try {
    await saveSettings(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save settings." });
  }
});

app.put("/api/admin/projects", requireAdmin, async (req, res) => {
  try {
    await saveProjects(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save projects." });
  }
});

app.put("/api/admin/blogs", requireAdmin, async (req, res) => {
  try {
    await saveBlogs(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save blogs." });
  }
});

app.put("/api/admin/certificates", requireAdmin, async (req, res) => {
  try {
    await saveCertificates(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save certificates." });
  }
});

// 10. Admin Contacts — the real CRM inbox, backed by the same store /api/contact writes to.
app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
  try {
    const contacts = await getContacts();
    res.json({ success: true, contacts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load contacts." });
  }
});

app.put("/api/admin/contacts", requireAdmin, async (req, res) => {
  try {
    await saveContacts(req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save contacts." });
  }
});

// --- VITE DEV AND PROD MIDDLEWARE SETUP ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
