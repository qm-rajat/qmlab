import { Router } from "express";
import {
  isSmtpConfigured,
  getMailTransporter,
  escapeHtml,
  sanitizeHeaderValue,
  renderEmailFooter
} from "../services/mail.service.ts";
import { saveContacts, getContacts } from "../lib/store.ts";
import { Contact } from "../../src/types.ts";

const router = Router();
const SITE_URL = process.env.SITE_URL || "https://qmlab-indol.vercel.app";

const INQUIRY_META: { [key: string]: { subjectLabel: string; heading: string } } = {
  freelance_project: { subjectLabel: '🛠️ New Freelance Inquiry', heading: '🛠️ New Freelance / Project Inquiry' },
  general: { subjectLabel: '✉️ New Message', heading: '✉️ New General Inquiry' },
  audit: { subjectLabel: '📊 SEO Audit Requested', heading: '📊 New SEO Audit Report Request' },
};

router.get("/smtp-status", (req, res) => {
  const configured = isSmtpConfigured();
  res.json({
    status: "ok",
    configured,
    host: process.env.SMTP_HOST || null,
    user: process.env.SMTP_USER ? `${process.env.SMTP_USER.split("@")[0]}@...` : null,
    toEmail: process.env.SMTP_TO || process.env.SMTP_USER || null,
  });
});

router.post("/test-smtp", async (req, res) => {
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

router.post("/contact", async (req, res) => {
  const { name, email, message, estimated_value, priority, inquiry_type } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Name, email, and message fields are required." });
  }

  const isAuditLead = req.body.type === 'audit' || String(name).startsWith('SEO Lead:');
  const effectiveInquiryType = isAuditLead
    ? 'audit'
    : (inquiry_type && INQUIRY_META[inquiry_type] ? inquiry_type : 'general');

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

      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeMessage = escapeHtml(message).replace(/\\n/g, "<br>");
      const headerSafeName = sanitizeHeaderValue(name);

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

export default router;
