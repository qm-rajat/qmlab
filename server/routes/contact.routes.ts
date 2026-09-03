import { Router } from "express";
import {
  isSmtpConfigured,
  getMailTransporter,
  escapeHtml,
  sanitizeHeaderValue,
  formatContactName,
  renderEmailFooter
} from "../services/mail.service.js";
import { saveContacts, getContacts } from "../lib/store.js";
import { Contact } from "../../src/types.js";
import { rateLimiter } from "../lib/rateLimit.js";

const router = Router();
const SITE_URL = process.env.SITE_URL || process.env.VITE_SITE_URL || "https://qmlab-indol.vercel.app";

// Strict rate limiters for contact submissions & SMTP diagnostics to stop spam and mail-bombing
const contactRateLimiter = rateLimiter("contact-submit", {
  windowMs: 15 * 60 * 1000, // 15 mins
  maxRequests: 5, // max 5 messages per 15 minutes per IP
  message: "Submission limit reached. You can only send up to 5 messages every 15 minutes to prevent spam."
});

const unsubscribeRateLimiter = rateLimiter("unsubscribe", {
  windowMs: 10 * 60 * 1000,
  maxRequests: 10,
  message: "Too many requests. Please try again later."
});

const smtpTestRateLimiter = rateLimiter("smtp-test", {
  windowMs: 5 * 60 * 1000,
  maxRequests: 3,
  message: "Diagnostic rate limit reached. Please wait before testing SMTP again."
});

const INQUIRY_META: { [key: string]: { subjectLabel: string; heading: string } } = {
  freelance_project: { subjectLabel: '🛠️ New Freelance Inquiry', heading: '🛠️ New Freelance / Project Inquiry' },
  general: { subjectLabel: '✉️ New Message', heading: '✉️ New General Inquiry' },
  newsletter: { subjectLabel: '📰 New Newsletter Subscriber', heading: '📰 Quarterly Tech Dispatch Subscription' },
  unsubscribe: { subjectLabel: '🚫 Newsletter Unsubscribe', heading: '🚫 Newsletter Unsubscribe Request' },
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

router.post("/test-smtp", smtpTestRateLimiter, async (req, res) => {
  try {
    if (!isSmtpConfigured()) {
      return res.status(400).json({
        success: false,
        error: "SMTP server environment parameters are unconfigured in .env.",
      });
    }

    const transporter = getMailTransporter();
    const recipient = process.env.SMTP_TO || process.env.SMTP_USER!;
    const senderName = process.env.SMTP_SENDER_NAME || "Rajat Kumar Dash";

    const mailOptions = {
      from: `"${senderName} SMTP Test" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject: "⚡ SMTP Connection Test - Rajat Portfolio CRM",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
          <div style="padding: 30px;">
            <h2 style="color: #0284c7; margin-top: 0;">Connection Test: Successful</h2>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              Hello! This is an automated email verifying that your portfolio SMTP outbound integrations are fully functional and connected.
            </p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 12px; margin: 20px 0; border: 1px solid #f1f5f9; font-family: monospace; font-size: 12px; color: #475569;">
              <strong>SMTP Host:</strong> ${escapeHtml(process.env.SMTP_HOST || "")}<br>
              <strong>SMTP Port:</strong> ${escapeHtml(process.env.SMTP_PORT || "")}<br>
              <strong>Authenticated User:</strong> ${escapeHtml(process.env.SMTP_USER || "")}<br>
              <strong>Timestamp:</strong> ${new Date().toISOString()}
            </div>
            <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
              This diagnostic ping was dispatched automatically from your full-stack applet container server.
            </p>
          </div>
          ${renderEmailFooter(senderName, SITE_URL)}
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

// Handle direct Unsubscribe endpoint with rate limiting
router.post("/unsubscribe", unsubscribeRateLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string" || !email.includes("@") || email.length > 254) {
    return res.status(400).json({ success: false, error: "A valid email address is required to unsubscribe." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existingContacts = await getContacts();
    let updated = false;
    const modifiedContacts = existingContacts.map((c) => {
      if (c.email.trim().toLowerCase() === normalizedEmail) {
        updated = true;
        return { ...c, status: 'unsubscribed' as const, notes: (c.notes ? c.notes + " | " : "") + `Unsubscribed on ${new Date().toISOString()}` };
      }
      return c;
    });

    if (!updated) {
      modifiedContacts.unshift({
        id: `unsub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: "Newsletter Unsubscriber",
        email: normalizedEmail,
        message: "User opted out from Quarterly Tech Dispatch newsletter.",
        status: "unsubscribed",
        inquiry_type: "unsubscribe",
        created_at: new Date().toISOString()
      });
    }

    await saveContacts(modifiedContacts);

    // Optional confirmation email
    if (isSmtpConfigured()) {
      try {
        const transporter = getMailTransporter();
        const senderName = process.env.SMTP_SENDER_NAME || "Rajat Kumar Dash";
        await transporter.sendMail({
          from: `"${senderName}" <${process.env.SMTP_USER}>`,
          to: normalizedEmail,
          subject: `You have been unsubscribed - Quarterly Tech Dispatch`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
              <div style="background-color: #0f172a; padding: 25px; color: #ffffff;">
                <h2 style="margin: 0; font-size: 18px; font-weight: 800;">Subscription Preferences Updated</h2>
              </div>
              <div style="padding: 25px; color: #334155; font-size: 14px; line-height: 1.6;">
                <p>Hello,</p>
                <p>You have been successfully unsubscribed from the <strong>Quarterly Tech Dispatch</strong>. You will no longer receive newsletter broadcasts to <code>${escapeHtml(normalizedEmail)}</code>.</p>
                <p style="font-size: 13px; color: #64748b; margin-top: 20px;">If this was done by mistake, you can always re-subscribe anytime directly on the <a href="${SITE_URL}/#blog" style="color: #2563eb; font-weight: 600;">Blog Hub</a>.</p>
              </div>
              ${renderEmailFooter(senderName, SITE_URL, false)}
            </div>
          `
        });
      } catch (mailErr) {
        console.warn("Unsubscribe notification mail error:", mailErr);
      }
    }

    return res.json({
      success: true,
      message: "You have been successfully unsubscribed from the newsletter."
    });
  } catch (err: any) {
    console.error("Unsubscribe error:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to process unsubscribe request." });
  }
});

router.post("/contact", contactRateLimiter, async (req, res) => {
  const { name, email, message, estimated_value, priority, inquiry_type, honeypot } = req.body;

  // Bot Protection: Silent drop / rejection if hidden honeypot field is filled
  if (honeypot && String(honeypot).trim() !== "") {
    // Return fake success response to trick spam bot without sending mail or storing spam
    return res.json({
      success: true,
      smtp_active: true,
      emails_sent: true,
      message: "Inquiry registered successfully."
    });
  }

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ success: false, error: "Full Name is required." });
  }

  if (!email || typeof email !== "string" || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ success: false, error: "A valid email address is required." });
  }

  if (!message || typeof message !== "string" || message.trim().length < 5) {
    return res.status(400).json({ success: false, error: "Please write a meaningful message." });
  }

  // Length constraints to prevent payload bloating attacks
  if (name.length > 150) {
    return res.status(400).json({ success: false, error: "Name must be under 150 characters." });
  }
  if (email.length > 254) {
    return res.status(400).json({ success: false, error: "Email must be under 254 characters." });
  }
  if (message.length > 8000) {
    return res.status(400).json({ success: false, error: "Message must be under 8,000 characters." });
  }

  const effectiveInquiryType = (inquiry_type && INQUIRY_META[inquiry_type]) ? inquiry_type : 'general';

  // If inquiry is an unsubscription request
  if (effectiveInquiryType === 'unsubscribe') {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const existingContacts = await getContacts();
      const modifiedContacts = existingContacts.map((c) => {
        if (c.email.trim().toLowerCase() === normalizedEmail) {
          return { ...c, status: 'unsubscribed' as const, notes: (c.notes ? c.notes + " | " : "") + `Unsubscribed on ${new Date().toISOString()}` };
        }
        return c;
      });
      await saveContacts(modifiedContacts);
    } catch (err) {
      console.error("Failed to update unsubscribe status:", err);
    }

    return res.json({
      success: true,
      smtp_active: isSmtpConfigured(),
      emails_sent: false,
      message: "You have been successfully unsubscribed from the newsletter."
    });
  }

  const newContact: Contact = {
    id: `cont_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
    status: "unread",
    created_at: new Date().toISOString(),
    ...(estimated_value && typeof estimated_value === "string" ? { estimated_value: estimated_value.slice(0, 50) } : {}),
    ...(priority && ['low', 'medium', 'high'].includes(priority) ? { priority } : {}),
    ...(inquiry_type && INQUIRY_META[inquiry_type] ? { inquiry_type: effectiveInquiryType } : {}),
  };

  try {
    const existingContacts = await getContacts();
    await saveContacts([newContact, ...existingContacts]);
  } catch (storeError) {
    console.error("Failed to persist contact to store:", storeError);
  }

  const responsePayload: any = {
    success: true,
    smtp_active: isSmtpConfigured(),
    emails_sent: false,
    message: effectiveInquiryType === 'newsletter' ? "Newsletter subscription confirmed!" : "Inquiry registered successfully.",
  };

  if (isSmtpConfigured()) {
    try {
      const transporter = getMailTransporter();
      const adminRecipient = process.env.SMTP_TO || process.env.SMTP_USER!;
      const senderName = process.env.SMTP_SENDER_NAME || "Rajat Kumar Dash";

      const safeName = escapeHtml(name.trim());
      const formattedRecipientName = escapeHtml(formatContactName(name));
      const safeEmail = escapeHtml(email.trim());
      const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br>");
      const headerSafeName = sanitizeHeaderValue(name);

      const inquiryMeta = INQUIRY_META[effectiveInquiryType] || INQUIRY_META.general;
      const subjectTag = priority === 'high' ? '🔥 URGENT LEAD' : inquiryMeta.subjectLabel;
      const budgetTag = estimated_value ? ` [${escapeHtml(String(estimated_value))}]` : '';
      const emailSubject = `${subjectTag}: ${headerSafeName}${budgetTag}`;

      const budgetRow = estimated_value ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 11px; text-transform: uppercase;">Estimated Budget</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #10b981; font-weight: 700; font-size: 14px;">${escapeHtml(String(estimated_value))}</td>
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
        replyTo: email.trim(),
        subject: emailSubject,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background-color: #0f172a; padding: 25px; color: #ffffff;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #38bdf8;">Portfolio CRM</span>
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
                <label style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 8px;">Inbound Details</label>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</div>
              </div>

              <div style="margin-top: 25px; text-align: center;">
                <a href="${SITE_URL}/#admin" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; display: inline-block;">Open CRM Console</a>
              </div>
            </div>
            <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0;">
              This notification was automatically dispatched from the portfolio server on behalf of ${escapeHtml(senderName)}.
            </div>
          </div>
        `,
      };

      let userMailOptions;

      if (effectiveInquiryType === 'newsletter') {
        userMailOptions = {
          from: `"${senderName}" <${process.env.SMTP_USER}>`,
          to: email.trim(),
          replyTo: adminRecipient,
          subject: `⚡ Welcome to Quarterly Tech Dispatch - ${senderName}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <div style="background-color: #0f172a; padding: 30px; color: #ffffff;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #38bdf8;">Engineering Tech Dispatch</span>
                <h1 style="margin: 5px 0 0 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">Welcome to Quarterly Tech Dispatch!</h1>
                <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">Curated engineering notes &amp; architectural breakdowns</p>
              </div>

              <div style="padding: 30px; color: #334155; font-size: 14px; line-height: 1.6;">
                <p style="font-size: 15px; font-weight: bold; margin-top: 0;">Hi ${formattedRecipientName},</p>

                <p>
                  Thank you for subscribing to my quarterly tech newsletter! Every quarter, I publish concise, practical deep dives covering full-stack performance tuning, test automation blueprints, and web architecture.
                </p>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin: 25px 0;">
                  <h4 style="margin: 0 0 12px 0; color: #1e293b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">🛠️ Explore Portfolio &amp; Insights:</h4>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">💻 <a href="${SITE_URL}/" style="color: #2563eb; text-decoration: none; font-weight: 600;">Technical Portfolio Home</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">📝 <a href="${SITE_URL}/#blog" style="color: #2563eb; text-decoration: none; font-weight: 600;">Technical Blog &amp; Articles</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">🛠️ <a href="${SITE_URL}/#projects" style="color: #2563eb; text-decoration: none; font-weight: 600;">Engineered Projects &amp; Case Studies</a></td>
                    </tr>
                  </table>
                </div>

                <p style="font-size: 12px; color: #64748b; font-style: italic; margin-top: 20px; margin-bottom: 0;">
                  No spam ever. If you ever wish to unsubscribe, you can do so anytime with 1 click using the link in the footer below.
                </p>
              </div>
              ${renderEmailFooter(senderName, SITE_URL, true)}
            </div>
          `,
        };
      } else {
        const isFreelance = effectiveInquiryType === 'freelance_project';
        const userSubject = isFreelance
          ? `📬 Project Inquiry Confirmation - ${senderName}`
          : `📬 Message Received - Confirmation from ${senderName}`;
        const userSubtitle = isFreelance
          ? "Your project inquiry has been received successfully."
          : "Your message has been received successfully.";
        const userBodyIntro = isFreelance
          ? "Thanks for checking out my portfolio and sharing your project proposal! This is an automated confirmation to let you know that your submission has been securely logged in my CRM."
          : "Thanks for checking out my website and reaching out! This is an automated confirmation to let you know that your message has been securely logged in my CRM.";
        const userBodyTimeline = isFreelance
          ? "I review incoming technical requirements, scopes of work, and project specifications daily. I will evaluate feasibility and get back to you personally with a detailed response within <strong>24 hours</strong>."
          : "I review all incoming messages and recruiter queries daily. I will get back to you personally with a detailed response within <strong>24 hours</strong>.";

        userMailOptions = {
          from: `"${senderName}" <${process.env.SMTP_USER}>`,
          to: email.trim(),
          replyTo: adminRecipient,
          subject: userSubject,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <div style="background-color: #2563eb; padding: 30px; color: #ffffff;">
                <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">Thank you for reaching out!</h1>
                <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">${userSubtitle}</p>
              </div>
              
              <div style="padding: 30px; color: #334155; font-size: 14px; line-height: 1.6;">
                <p style="font-size: 15px; font-weight: bold; margin-top: 0;">Hi ${formattedRecipientName},</p>

                <p>
                  ${userBodyIntro}
                </p>

                <p>
                  ${userBodyTimeline}
                </p>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin: 25px 0;">
                  <h4 style="margin: 0 0 12px 0; color: #1e293b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">In the meantime, explore my engineering works:</h4>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">💻 <a href="${SITE_URL}/" style="color: #2563eb; text-decoration: none; font-weight: 600;">Technical Portfolio Home</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">🛠️ <a href="${SITE_URL}/#projects" style="color: #2563eb; text-decoration: none; font-weight: 600;">QA Test Suites &amp; Case Studies</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px;">📝 <a href="${SITE_URL}/#blog" style="color: #2563eb; text-decoration: none; font-weight: 600;">Technical Blog &amp; Insights</a></td>
                    </tr>
                  </table>
                </div>

                <p style="font-size: 12px; color: #64748b; font-style: italic; margin-bottom: 0;">
                  Note: This was dispatched from my automated SMTP integration. If you want to append additional specifications, designs, or files, please feel free to reply directly to this email!
                </p>
              </div>
              ${renderEmailFooter(senderName, SITE_URL, false)}
            </div>
          `,
        };
      }

      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(userMailOptions),
      ]);

      responsePayload.emails_sent = true;
      responsePayload.message = effectiveInquiryType === 'newsletter'
        ? "Subscription confirmed! A welcome email was dispatched."
        : "Message received. Notifications and follow-up emails successfully dispatched.";
    } catch (mailError: any) {
      console.error("Nodemailer dispatch failure:", mailError);
      responsePayload.smtp_error = mailError.message || "Unknown error";
      responsePayload.message = "Logged to portfolio CRM. However, SMTP notification engines failed to execute.";
    }
  }

  res.json(responsePayload);
});

export default router;
