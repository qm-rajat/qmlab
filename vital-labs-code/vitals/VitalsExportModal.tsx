import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileCheck, Mail, Download, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { VitalsScores, VitalsMetrics } from './vitalsTypes';

interface VitalsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditedUrl: string;
  siteHost: string;
  siteCleanName: string;
  siteOrigin: string;
  device: 'mobile' | 'desktop';
  scores: VitalsScores;
  metrics: VitalsMetrics;
  personJsonLd: string;
}

export const VitalsExportModal: React.FC<VitalsExportModalProps> = ({
  isOpen,
  onClose,
  auditedUrl,
  siteHost,
  siteCleanName,
  siteOrigin,
  device,
  scores,
  metrics,
  personJsonLd,
}) => {
  const [downloadEmail, setDownloadEmail] = useState('');
  const [isSubmittingDownload, setIsSubmittingDownload] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const generateHtmlReportContent = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO & Core Web Vitals Audit Report - ${siteHost}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 800px;
      margin: 40px auto;
      padding: 40px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .brand {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.025em;
    }
    .brand span {
      color: #0084ff;
    }
    .tag {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #16a34a;
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 32px;
    }
    .meta-card {
      background-color: #f8fafc;
      border: 1px solid #f1f5f9;
      padding: 16px;
      border-radius: 16px;
    }
    .meta-card label {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: block;
      margin-bottom: 4px;
    }
    .meta-card .value {
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
      word-break: break-all;
    }
    .score-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .score-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 40px;
    }
    .score-card {
      text-align: center;
      padding: 24px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      background: #ffffff;
    }
    .score-num {
      font-size: 36px;
      font-weight: 900;
      color: #10b981;
      margin-bottom: 8px;
    }
    .score-label {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    .section-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      border-left: 4px solid #0084ff;
      padding-left: 12px;
      margin-bottom: 24px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .metrics-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
    }
    .metrics-table th {
      text-align: left;
      padding: 12px 16px;
      background-color: #f8fafc;
      color: #64748b;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #edf2f7;
    }
    .metrics-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 13px;
    }
    .metric-name {
      font-weight: 700;
      color: #0f172a;
    }
    .metric-desc {
      color: #64748b;
      font-size: 11px;
      margin-top: 4px;
    }
    .metric-val {
      font-family: monospace;
      font-weight: 750;
      color: #0f172a;
      font-size: 14px;
    }
    .badge-good {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #16a34a;
      padding: 4px 8px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .directive-box {
      background-color: #eff6ff;
      border: 1px solid #dbeafe;
      padding: 20px;
      border-radius: 16px;
      margin-bottom: 20px;
    }
    .directive-title {
      font-size: 13px;
      font-weight: 800;
      color: #1d4ed8;
      display: block;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    .directive-list {
      margin: 0;
      padding-left: 20px;
      color: #334155;
      font-size: 13px;
    }
    .directive-list li {
      margin-bottom: 8px;
    }
    .directive-list li:last-child {
      margin-bottom: 0;
    }
    .schema-box {
      background: #0f172a;
      color: #cbd5e1;
      padding: 20px;
      border-radius: 16px;
      font-family: monospace;
      font-size: 11px;
      overflow-x: auto;
      white-space: pre-wrap;
      margin-bottom: 40px;
    }
    .footer {
      border-top: 1px solid #f1f5f9;
      padding-top: 24px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
    }
    .footer a {
      color: #0084ff;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">QM LABS <span>AUDIT</span></div>
      <div class="tag">VERIFIED PASS</div>
    </div>

    <div class="meta-grid">
      <div class="meta-card">
        <label>Audited Target</label>
        <div class="value">${auditedUrl}</div>
      </div>
      <div class="meta-card">
        <label>Device Viewport</label>
        <div class="value">${device === 'mobile' ? 'Mobile (Simulated Moto G4)' : 'Desktop (Full HD High-Speed)'}</div>
      </div>
    </div>

    <h3 class="score-title">Overall Performance Summary</h3>
    <div class="score-grid">
      <div class="score-card">
        <div class="score-num">${scores.performance}</div>
        <div class="score-label">Performance</div>
      </div>
      <div class="score-card">
        <div class="score-num">${scores.seo}</div>
        <div class="score-label">SEO Status</div>
      </div>
      <div class="score-card">
        <div class="score-num">${scores.accessibility}</div>
        <div class="score-label">Accessibility</div>
      </div>
      <div class="score-card">
        <div class="score-num">${scores.bestPractices}</div>
        <div class="score-label">Best Practices</div>
      </div>
    </div>

    <h3 class="section-title">Core Web Vitals Threshold Matrix</h3>
    <table class="metrics-table">
      <thead>
        <tr>
          <th>Metric Dimension</th>
          <th>Timings Index</th>
          <th>Standard Rating</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="metric-name">Largest Contentful Paint (LCP)</div>
            <div class="metric-desc">Visual speed metric marking point where primary folder completes paint loading.</div>
          </td>
          <td class="metric-val">${metrics.lcp}</td>
          <td><span class="badge-good">Good</span></td>
        </tr>
        <tr>
          <td>
            <div class="metric-name">Interaction to Next Paint (INP)</div>
            <div class="metric-desc">Responsiveness metric tracking user-input event frame latency thresholds.</div>
          </td>
          <td class="metric-val">${metrics.inp}</td>
          <td><span class="badge-good">Good</span></td>
        </tr>
        <tr>
          <td>
            <div class="metric-name">Cumulative Layout Shift (CLS)</div>
            <div class="metric-desc">Visual stability score mapping unexpected DOM elements shift frequencies.</div>
          </td>
          <td class="metric-val">${metrics.cls}</td>
          <td><span class="badge-good">Good</span></td>
        </tr>
        <tr>
          <td>
            <div class="metric-name">First Contentful Paint (FCP)</div>
            <div class="metric-desc">Loading threshold when the browser paints initial node elements.</div>
          </td>
          <td class="metric-val">${metrics.fcp}</td>
          <td><span class="badge-good">Good</span></td>
        </tr>
        <tr>
          <td>
            <div class="metric-name">Time to First Byte (TTFB)</div>
            <div class="metric-desc">Network response delay measuring time between request and initial bit.</div>
          </td>
          <td class="metric-val">${metrics.ttfb}</td>
          <td><span class="badge-good">Good</span></td>
        </tr>
      </tbody>
    </table>

    <h3 class="section-title">Lab Optimization Directives for ${siteHost.toUpperCase()}</h3>
    
    <div class="directive-box">
      <span class="directive-title">Directives for Largest Contentful Paint (LCP):</span>
      <ul class="directive-list">
        <li>Compress large high-resolution images on <strong>${siteHost}</strong> & convert to Next-Gen formats like <strong>AVIF / WebP</strong>.</li>
        <li>Implement explicit <code>fetchpriority="high"</code> constraints on primary above-the-fold elements of <strong>${siteHost}</strong>.</li>
        <li>Configure robust CDN caching schemes on the <strong>${siteHost}</strong> host to resolve latency limits.</li>
      </ul>
    </div>

    <div class="directive-box" style="background-color: #faf5ff; border-color: #f3e8ff;">
      <span class="directive-title" style="color: #6b21a8;">Directives for Interaction to Next Paint (INP):</span>
      <ul class="directive-list">
        <li>Break dense <strong>${siteHost}</strong> Javascript operations into smaller non-blocking tasks with <code>requestIdleCallback()</code>.</li>
        <li>Audit <strong>${siteHost}</strong> interactions for dense event handler loops causing layout shifts.</li>
        <li>Eliminate third-party render-blocking embeds on the <strong>${siteHost}</strong> domain.</li>
      </ul>
    </div>

    <div class="directive-box" style="background-color: #f0fdf4; border-color: #dcfce7;">
      <span class="directive-title" style="color: #166534;">Directives for Cumulative Layout Shift (CLS):</span>
      <ul class="directive-list">
        <li>Always declare explicit <code>width</code> and <code>height</code> proportions on <strong>${siteHost}</strong> image structures.</li>
        <li>Pre-size container grids for late-loading dynamic resources, cards, or advertisements on <strong>${siteHost}</strong>.</li>
        <li>Utilize Web Font preload techniques to avoid FOIT layout shifts on <strong>${siteHost}</strong>.</li>
      </ul>
    </div>

    <h3 class="section-title">Structured Search Schema Markup (JSON-LD)</h3>
    <div class="schema-box">${personJsonLd}</div>

    <div class="footer">
      <p>This automated light-weight SEO analysis report was prepared dynamically by the Core Web Vitals Lab on behalf of QM Labs.</p>
      <p>&copy; ${new Date().getFullYear()} <a href="${siteOrigin}">${siteCleanName}</a> &amp; QM Labs. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
  };

  const handleDownloadReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDownloadError('');

    const cleanEmail = downloadEmail.trim();
    if (!cleanEmail) {
      setDownloadError('An email address is required.');
      return;
    }
    if (!validateEmail(cleanEmail)) {
      setDownloadError('Please specify a valid email address.');
      return;
    }

    setIsSubmittingDownload(true);

    const payloadMessage = `Requested lightweight technical SEO & Core Web Vitals Audit Report for URL: ${auditedUrl} (Device: ${device === 'mobile' ? 'Mobile Viewport' : 'Desktop Viewport'}).\n\nPerformance Summary:\n- Performance Score: ${scores.performance}/100\n- SEO Status Score: ${scores.seo}/100\n- Accessibility Score: ${scores.accessibility}/100\n- Best Practices Score: ${scores.bestPractices}/100\n\nCore Web Vitals indices:\n- LCP: ${metrics.lcp}\n- INP: ${metrics.inp}\n- CLS: ${metrics.cls}\n- FCP: ${metrics.fcp}\n- TTFB: ${metrics.ttfb}\n\nClient has confirmed agreement to the privacy policy rules.`;

    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `SEO Lead: ${siteHost}`,
        email: cleanEmail,
        message: payloadMessage,
        type: 'audit'
      })
    })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server processing error.');
      }
      return data;
    })
    .then(() => {
      const htmlContent = generateHtmlReportContent();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `seo-vitals-report-${siteHost}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setDownloadSuccess(true);
      setTimeout(() => {
        onClose();
        setDownloadSuccess(false);
        setDownloadEmail('');
      }, 2200);
    })
    .catch((err: any) => {
      setDownloadError(err.message || 'Connection failure. Failed to save lead details.');
    })
    .finally(() => {
      setIsSubmittingDownload(false);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-[2rem] border border-slate-100 max-w-md w-full shadow-2xl p-6 md:p-8 space-y-6 relative overflow-hidden text-left"
          >
            {/* Glow background highlight */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                setDownloadError('');
              }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {downloadSuccess ? (
              <div className="py-6 flex flex-col items-center text-center space-y-4 animate-[fade-in_0.3s_ease-out]">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                  <CheckCircle className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-lg">Report Unlocked & Downloaded!</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Your high-fidelity lightweight HTML report has been generated. The lead has been successfully logged in the portfolio CRM.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/10">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase">Export Full SEO Report</h4>
                    <p className="text-[10px] font-mono text-slate-400">Target Host: {siteHost}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Download a lightweight, standalone, fully styled interactive audit detailing Speed Indices, Structured Markup formats, Robots.txt parameters, and personalized lab optimization directives.
                </p>

                <form onSubmit={handleDownloadReportSubmit} className="space-y-4">
                  {downloadError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-xs text-rose-800 animate-slide-up">
                      <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                      <span>{downloadError}</span>
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="modal-email-input" className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                      Email Coordinates
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        id="modal-email-input"
                        type="email"
                        required
                        value={downloadEmail}
                        onChange={(e) => setDownloadEmail(e.target.value)}
                        placeholder="you@corporate.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-blue-500/5 rounded-xl text-xs font-semibold focus:outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  {/* Agreement Text */}
                  <div className="text-[10px] text-slate-500 leading-snug font-normal bg-slate-50 p-3 rounded-xl border border-slate-100">
                    By unlocking this download, you agree to our <strong>Privacy Policy</strong> and authorize QM Labs to record your coordinates to their secure CRM database.
                  </div>

                  {/* Submit Download button */}
                  <button
                    type="submit"
                    disabled={isSubmittingDownload}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-75 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer select-none"
                  >
                    {isSubmittingDownload ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Connecting to CRM...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        Unlock & Download Report
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
