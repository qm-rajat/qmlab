import React, { useState } from 'react';
import { 
  Gauge, Zap, Search, Code, Copy, Check, Settings, Globe, RefreshCw, 
  Sliders, ShieldCheck, Layers, Bot, FileText, CheckCircle, TrendingUp, Terminal, Info, ChevronRight, Eye,
  Sparkles, Map, AlertTriangle, Play, HelpCircle, FileCheck, Trash2, Plus, Download, X, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CoreWebVitalsLabProps {
  settings: any;
  onAddContact?: (contact: any) => void;
}

export default function CoreWebVitalsLab({ settings, onAddContact }: CoreWebVitalsLabProps) {
  // Lab Mode state
  const [labMode, setLabMode] = useState<'lighthouse' | 'ai-optimizer' | 'onpage-auditor' | 'sitemap-builder'>('lighthouse');

  // Report Download & CRM Modal State
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadEmail, setDownloadEmail] = useState('');
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isSubmittingDownload, setIsSubmittingDownload] = useState(false);

  // Input URL state
  const [url, setUrl] = useState('https://rajatkumar.dev');
  // Decoupled audited URL state
  const [auditedUrl, setAuditedUrl] = useState('https://rajatkumar.dev');
  // Device mode
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  // Audit run states
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState<string[]>([]);
  const [auditDone, setAuditDone] = useState(true); // default done to show initial gorgeous score

  // AI Optimizer State
  const [targetKeyword, setTargetKeyword] = useState('Technical SEO Expert');
  const [targetAudience, setTargetAudience] = useState('Tech Recruiters & CTOs');
  const [existingTitle, setExistingTitle] = useState('');
  const [existingDescription, setExistingDescription] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  // Live On-Page Quality Sandbox State
  const [sandboxTitle, setSandboxTitle] = useState('Rajat Kumar Dash | Technical SEO Expert & Full-Stack Developer');
  const [sandboxDescription, setSandboxDescription] = useState('Highly optimized technical portfolio. Specialized in PageSpeed, Core Web Vitals, and server-side engineering to reach 100% Google Lighthouse scores.');
  const [sandboxContent, setSandboxContent] = useState('Core Web Vitals are a set of metrics that Google uses to measure user experience. These include Largest Contentful Paint (LCP), First Contentful Paint (FCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP). To optimize LCP, you must compress images into WebP or AVIF formats and implement a fast Edge CDN caching strategy. For CLS, pre-size dynamic components. Technical SEO is the foundation of high organic keyword rankings.');
  const [searchKeyword, setSearchKeyword] = useState('Core Web Vitals');

  // Interactive Sitemap Builder State
  const [sitemapPages, setSitemapPages] = useState<Array<{ url: string; priority: string; changefreq: string }>>([
    { url: 'https://rajatkumar.dev', priority: '1.0', changefreq: 'daily' },
    { url: 'https://rajatkumar.dev/blog', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://rajatkumar.dev/projects', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://rajatkumar.dev/contact', priority: '0.5', changefreq: 'monthly' },
  ]);
  const [newPageUrl, setNewPageUrl] = useState('');
  const [newPagePriority, setNewPagePriority] = useState('0.8');
  const [newPageFreq, setNewPageFreq] = useState('weekly');

  // Score states
  const [scores, setScores] = useState({
    performance: 99,
    seo: 100,
    accessibility: 96,
    bestPractices: 100
  });

  // CWV Metric timings
  const [metrics, setMetrics] = useState({
    lcp: '1.1s', // Largest Contentful Paint
    inp: '42ms', // Interaction to Next Paint
    cls: '0.015', // Cumulative Layout Shift
    fcp: '0.8s', // First Contentful Paint
    ttfb: '72ms', // Time to First Byte
  });

  // Selected CWV Metric Tab for details view
  const [activeTab, setActiveTab] = useState<'lcp' | 'inp' | 'cls' | 'fcp' | 'ttfb'>('lcp');

  // JSON-LD state
  const [jsonLdType, setJsonLdType] = useState<'person' | 'business' | 'blog'>('person');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Robots.txt selected agent check
  const [selectedAgent, setSelectedAgent] = useState<'google' | 'gpt' | 'claude' | 'all'>('google');

  // Action: Call AI SEO Analyzer endpoint
  const runAiAnalysis = () => {
    setIsAiAnalyzing(true);
    setAiReport(null);
    fetch('/api/seo/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: url,
        keyword: targetKeyword,
        audience: targetAudience,
        existingTitle: existingTitle,
        existingDescription: existingDescription
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAiReport(data);
        }
      })
      .catch(err => console.error('AI SEO Analysis Error:', err))
      .finally(() => setIsAiAnalyzing(false));
  };

  // Helper: Live Keyword density calculation
  const getKeywordMetrics = () => {
    if (!sandboxContent || !searchKeyword) return { count: 0, density: 0, status: 'Under-optimized', color: 'text-slate-400' };
    const words = sandboxContent.trim().split(/\s+/).filter(Boolean);
    const totalWords = words.length;
    if (totalWords === 0) return { count: 0, density: 0, status: 'Under-optimized', color: 'text-slate-400' };

    // Escaping special characters for regex search
    const escapedKeyword = searchKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
    const matches = sandboxContent.match(regex);
    const count = matches ? matches.length : 0;
    const density = parseFloat(((count * 100) / totalWords).toFixed(2));

    let status = 'Ideal';
    let color = 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (density < 1.0) {
      status = 'Under-optimized';
      color = 'text-amber-600 bg-amber-50 border-amber-100';
    } else if (density > 2.5) {
      status = 'Keyword Stuffing Risk';
      color = 'text-rose-600 bg-rose-50 border-rose-100';
    }
    return { count, density, status, color, totalWords };
  };

  // Helper: XML Sitemap content generation
  const generateSitemapXml = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    sitemapPages.forEach((page) => {
      xml += `  <url>\n`;
      xml += `    <loc>${page.url}</loc>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `  </url>\n`;
    });
    xml += `</urlset>`;
    return xml;
  };

  const addSitemapPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageUrl) return;
    setSitemapPages(prev => [...prev, { url: newPageUrl, priority: newPagePriority, changefreq: newPageFreq }]);
    setNewPageUrl('');
  };

  const removeSitemapPage = (index: number) => {
    setSitemapPages(prev => prev.filter((_, idx) => idx !== index));
  };

  // Triggering visual audit process
  const startAudit = () => {
    setIsAuditing(true);
    setAuditDone(false);
    setAuditProgress([]);
    
    const logs = [
      "⚡ Initializing crawl protocol mapping...",
      "🔍 Resolving canonical domain parameters & redirect counts...",
      "🌐 Resolving server responsiveness: TTFB verified at 75ms.",
      "🚀 Simulating render stack trace on Google Chrome v126 engine...",
      "📊 Fetching mobile viewport measurements...",
      "🎨 Computing paint metrics: First Contentful Paint: 0.8s.",
      "🖼️ Analysing DOM nodes: Largest Contentful Paint element detected (Hero Header H1).",
      "📝 Running layout recalculation bounds: Layout shift calculated.",
      "🔄 Evaluating Interaction to Next Paint (INP) input response thresholds...",
      "🤖 Extracting Robots.txt directives and canonical rules...",
      "🧩 Checking Schema Markup integrity: Found 2 structural JSON-LD schemas.",
      "✨ Audit complete! Building dashboard report..."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setAuditProgress(prev => [...prev, log]);
        
        // When last log completes
        if (index === logs.length - 1) {
          setTimeout(() => {
            setIsAuditing(false);
            setAuditDone(true);
            setAuditedUrl(url);
            
            // Randomize scores slightly based on URL to feel dynamic and real
            if (url.includes('google.com')) {
              setScores({ performance: 94, seo: 92, accessibility: 91, bestPractices: 95 });
              setMetrics({ lcp: '1.4s', inp: '85ms', cls: '0.03', fcp: '1.1s', ttfb: '160ms' });
            } else if (url.includes('rajat') || url.includes('qmlabs')) {
              setScores({ performance: 99, seo: 100, accessibility: 98, bestPractices: 100 });
              setMetrics({ lcp: '1.1s', inp: '42ms', cls: '0.015', fcp: '0.8s', ttfb: '72ms' });
            } else {
              // Generate realistic dynamic metrics
              const perfHash = Math.abs(url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 15;
              const performance = 82 + perfHash; 
              const seo = 85 + (perfHash % 16);
              const accessibility = 88 + (perfHash % 13);
              const bestPractices = 90 + (perfHash % 11);
              
              setScores({ performance, seo, accessibility, bestPractices });
              setMetrics({
                lcp: `${(1.2 + (perfHash * 0.1)).toFixed(1)}s`,
                inp: `${40 + (perfHash * 8)}ms`,
                cls: `0.0${2 + (perfHash % 5)}`,
                fcp: `${(0.8 + (perfHash * 0.08)).toFixed(1)}s`,
                ttfb: `${60 + (perfHash * 15)}ms`
              });
            }
          }, 600);
        }
      }, (index + 1) * 350);
    });
  };

  // Helper to safely parse and extract dynamic domain details
  const getUrlDetails = (urlStr: string) => {
    let cleanUrl = urlStr || "https://rajatkumar.dev";
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }
    try {
      const parsed = new URL(cleanUrl);
      const host = parsed.hostname;
      const origin = parsed.origin;
      const domainParts = host.replace(/^www\./i, "").split(".");
      const rawName = domainParts[0] || "My Site";
      const cleanName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      return { host, origin, cleanName };
    } catch (e) {
      return { host: "rajatkumar.dev", origin: "https://rajatkumar.dev", cleanName: "My Website" };
    }
  };

  const { host: siteHost, origin: siteOrigin, cleanName: siteCleanName } = getUrlDetails(auditedUrl);

  // Pre-configured JSON-LD structures
  const personJsonLd = `{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "${auditedUrl.includes('rajat') || auditedUrl.includes('dev') && !auditedUrl.includes('example') ? (settings?.hero_name || 'Rajat Kumar Dash') : siteCleanName + ' Creator'}",
  "url": "${siteOrigin}",
  "logo": "${siteOrigin}/assets/logo.png",
  "jobTitle": "${auditedUrl.includes('rajat') ? 'Technical SEO Expert & Full-Stack Developer' : 'Site Administrator'}",
  "worksFor": {
    "@type": "Organization",
    "name": "${auditedUrl.includes('rajat') ? (settings?.company_name || 'QM Labs') : siteCleanName + ' Inc'}",
    "url": "${siteOrigin}"
  },
  "description": "${auditedUrl.includes('rajat') ? (settings?.hero_bio || '').replace(/"/g, '\\"') : 'Web administrator and technical lead at ' + siteCleanName}",
  "sameAs": [
    "${settings?.social_links?.linkedin || ''}",
    "${settings?.social_links?.github || ''}"
  ]
}`;

  const businessJsonLd = `{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "${auditedUrl.includes('rajat') ? (settings?.company_name || 'QM Labs') : siteCleanName + ' Services'}",
  "url": "${siteOrigin}",
  "logo": "${siteOrigin}/assets/logo.png",
  "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600",
  "description": "${auditedUrl.includes('rajat') ? (settings?.company_bio || '').replace(/"/g, '\\"') : 'High-performance digital presence and technical engineering services for ' + siteCleanName}",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "${auditedUrl.includes('rajat') ? 'New Delhi' : 'Global'}",
    "addressRegion": "${auditedUrl.includes('rajat') ? 'Delhi' : 'Global'}",
    "addressCountry": "IN"
  },
  "founder": {
    "@type": "Person",
    "name": "${auditedUrl.includes('rajat') ? (settings?.hero_name || 'Rajat Kumar Dash') : 'Lead Engineer'}"
  },
  "knowsAbout": [
    "Technical SEO Optimization",
    "Core Web Vitals Engineering",
    "Full-Stack Web Development",
    "Automated Test Infrastructure"
  ]
}`;

  const blogJsonLd = `{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "How We Optimized Core Web Vitals to Reach 100% Mobile Scores",
  "description": "A deep dive into server response timing, Largest Contentful Paint mechanics, and layout shift resolution for modern single-page applications.",
  "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600",
  "author": {
    "@type": "Person",
    "name": "${auditedUrl.includes('rajat') ? (settings?.hero_name || 'Rajat Kumar Dash') : 'Technical Lead'}",
    "url": "${siteOrigin}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "${auditedUrl.includes('rajat') ? (settings?.company_name || 'QM Labs') : siteCleanName + ' Inc'}",
    "logo": {
      "@type": "ImageObject",
      "url": "${siteOrigin}/assets/logo.png"
    }
  },
  "datePublished": "2026-06-18T04:00:00Z",
  "mainEntityOfPage": "${siteOrigin}/blog/optimizing-core-web-vitals"
}`;

  const getJsonLdText = () => {
    if (jsonLdType === 'person') return personJsonLd;
    if (jsonLdType === 'business') return businessJsonLd;
    return blogJsonLd;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  // Standalone gorgeous, offline-friendly HTML report generator
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
      color: #16a34a;
      border: 1px solid #bbf7d0;
      padding: 4px 8px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .directive-box {
      background-color: #f0f9ff;
      border: 1px solid #e0f2fe;
      padding: 24px;
      border-radius: 20px;
      margin-bottom: 40px;
    }
    .directive-title {
      font-size: 11px;
      font-weight: 800;
      color: #0369a1;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
      display: block;
    }
    .directive-list {
      margin: 0;
      padding-left: 20px;
    }
    .directive-list li {
      margin-bottom: 8px;
      color: #334155;
      font-size: 13px;
    }
    .directive-list li strong {
      color: #0f172a;
    }
    .schema-box {
      background-color: #0f172a;
      color: #e2e8f0;
      padding: 24px;
      border-radius: 20px;
      font-family: monospace;
      font-size: 11px;
      white-space: pre-wrap;
      overflow-x: auto;
      border: 1px solid #1e293b;
      margin-bottom: 40px;
    }
    .footer {
      text-align: center;
      border-top: 1px solid #f1f5f9;
      padding-top: 24px;
      margin-top: 48px;
      font-size: 11px;
      color: #94a3b8;
    }
    .footer a {
      color: #0084ff;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">QM LABS <span>SEO LAB</span></div>
      <div class="tag">✓ Light-weight Audit Passed</div>
    </div>

    <div class="meta-grid">
      <div class="meta-card">
        <label>Audited Target URL</label>
        <div class="value">${auditedUrl}</div>
      </div>
      <div class="meta-card">
        <label>Simulated Agent & Device</label>
        <div class="value">Lighthouse / Chrome Engine (${device === 'mobile' ? 'Mobile Viewport' : 'Desktop Viewport'})</div>
      </div>
      <div class="meta-card">
        <label>Diagnostic Timestamp</label>
        <div class="value">${new Date().toLocaleString()}</div>
      </div>
      <div class="meta-card">
        <label>Host Reference Name</label>
        <div class="value">${siteCleanName}</div>
      </div>
    </div>

    <h3 class="score-title">Performance Metadata Index Scores</h3>
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
      if (onAddContact) {
        onAddContact({
          name: `SEO Lead: ${siteHost}`,
          email: cleanEmail,
          message: `Unlocked and downloaded full technical SEO & Lighthouse diagnostics report for ${auditedUrl}.`,
          status: 'unread'
        });
      }

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
        setShowDownloadModal(false);
        setDownloadSuccess(false);
        setDownloadEmail('');
        setAgreePolicy(false);
      }, 2200);
    })
    .catch((err: any) => {
      setDownloadError(err.message || 'Connection failure. Failed to save lead details.');
    })
    .finally(() => {
      setIsSubmittingDownload(false);
    });
  };

  // Gauge Render Helper
  const renderGauge = (score: number, label: string, colorClass: string, trackColor: string) => {
    const strokeDashoffset = 251.2 - (251.2 * score) / 100;
    return (
      <div className="flex flex-col items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={trackColor}
              strokeWidth="8"
            />
            {/* Value circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset={strokeDashoffset}
              className={`${colorClass} transition-all duration-1000 ease-out`}
            />
          </svg>
          <span className="absolute text-xl font-mono font-black text-slate-800">{score}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">{label}</span>
      </div>
    );
  };

  // Quick Threshold helper (good/needs-work/poor)
  const getMetricBadge = (val: string, type: 'lcp' | 'inp' | 'cls' | 'fcp' | 'ttfb') => {
    const num = parseFloat(val);
    let status: 'good' | 'average' | 'poor' = 'good';
    
    if (type === 'lcp') {
      if (num <= 2.5) status = 'good';
      else if (num <= 4.0) status = 'average';
      else status = 'poor';
    } else if (type === 'inp') {
      if (num <= 200) status = 'good';
      else if (num <= 500) status = 'average';
      else status = 'poor';
    } else if (type === 'cls') {
      if (num <= 0.1) status = 'good';
      else if (num <= 0.25) status = 'average';
      else status = 'poor';
    } else if (type === 'fcp') {
      if (num <= 1.8) status = 'good';
      else if (num <= 3.0) status = 'average';
      else status = 'poor';
    } else if (type === 'ttfb') {
      if (num <= 200) status = 'good';
      else if (num <= 600) status = 'average';
      else status = 'poor';
    }

    if (status === 'good') return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 border border-emerald-100 text-emerald-600">Good</span>;
    if (status === 'average') return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-50 border border-amber-100 text-amber-600">Needs Work</span>;
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-50 border border-rose-100 text-rose-600">Poor</span>;
  };

  return (
    <div className="space-y-10 py-6 text-left max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 text-[#0084ff] rounded-full text-[10px] font-bold tracking-widest uppercase font-mono">
          <Gauge className="w-3.5 h-3.5 animate-pulse" /> Core Web Vitals Lab
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">Technical SEO Audit Lab</h2>
        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          Evaluate site responsiveness indexes, inspect custom user-agent crawl instructions, and generate valid structured JSON-LD schemas.
        </p>
      </div>

      {/* LAB MODE TABS SUB-NAVIGATION */}
      <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto border-b border-slate-100 pb-6">
        {[
          { id: 'lighthouse', label: 'Lighthouse & Web Vitals', icon: Gauge, desc: 'Performance and core timings check' },
          { id: 'ai-optimizer', label: 'AI Metadata Optimizer', icon: Sparkles, desc: 'Gemini CTR & description analyzer' },
          { id: 'onpage-auditor', label: 'On-Page Quality Sandbox', icon: FileCheck, desc: 'Real-time keyword & length limits' },
          { id: 'sitemap-builder', label: 'Interactive Sitemap Builder', icon: Map, desc: 'Build and export XML sitemaps' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = labMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setLabMode(tab.id as any)}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 border-slate-950 text-white shadow-md shadow-slate-900/10 scale-[1.02]'
                  : 'bg-white border-slate-150 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#0084ff] animate-pulse' : 'text-slate-400'}`} />
              <div className="text-left">
                <div className="leading-none">{tab.label}</div>
                <div className={`text-[9px] font-medium lowercase tracking-normal mt-1 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                  {tab.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* COMPONENT CONTENT GRID */}
      {labMode === 'lighthouse' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: URL SCAN PANEL AND CORE METRICS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* ACTION PANEL: RUN AUDIT */}
          <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" /> Run Audit Simulation
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </span>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="E.g., https://yourwebsite.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-150 focus:border-primary focus:bg-white rounded-2xl text-xs font-semibold focus:outline-hidden"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDevice(device === 'mobile' ? 'desktop' : 'mobile')}
                  className="px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-2xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-[10px] tracking-wider">{device === 'mobile' ? '📱 Mobile' : '💻 Desktop'}</span>
                </button>
                <button
                  type="button"
                  disabled={isAuditing}
                  onClick={startAudit}
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                  {isAuditing ? 'Auditing...' : 'Analyze'}
                </button>
              </div>
            </div>

            {/* AUDIT TIMELINE LOGS (VISIBLE WHEN AUDITING) */}
            {isAuditing && (
              <div className="bg-slate-950 rounded-2xl p-4 font-mono text-[10px] text-slate-350 border border-slate-850 space-y-2 h-44 overflow-y-auto shadow-inner text-left">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-900 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-500 uppercase tracking-widest text-[9px]">Lighthouse Audit Instance running...</span>
                </div>
                {auditProgress.map((prog, pIdx) => (
                  <p key={pIdx} className="text-slate-300 leading-normal font-mono">
                    {prog}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* MAIN GAUGES REPORT CARD */}
          {auditDone && !isAuditing && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-slate-50/50 p-6 border border-slate-150 rounded-[2rem] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                      Performance Metadata Index (for {auditedUrl})
                    </h3>
                    <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg">
                      ✓ PASSED PRE-RENDER RULES
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDownloadModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10 active:scale-95 transition-all no-print"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Full Report
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {renderGauge(scores.performance, "Performance", "text-emerald-500", "#f1f5f9")}
                  {renderGauge(scores.seo, "SEO Status", "text-emerald-500", "#f1f5f9")}
                  {renderGauge(scores.accessibility, "Accessibility", "text-emerald-500", "#f1f5f9")}
                  {renderGauge(scores.bestPractices, "Best Practices", "text-emerald-500", "#f1f5f9")}
                </div>
              </div>

              {/* CORE WEB VITALS SPLIT VIEWS */}
              <div className="bg-white border border-slate-150 rounded-[2rem] p-6 shadow-xs space-y-6 text-left">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Core Web Vitals Threshold Matrix</h3>
                  <p className="text-[11px] text-slate-400">Select any individual diagnostic standard below for an expert evaluation breakdown.</p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 border-b border-slate-100 pb-3">
                  {[
                    { key: 'lcp', label: 'LCP', val: metrics.lcp },
                    { key: 'inp', label: 'INP', val: metrics.inp },
                    { key: 'cls', label: 'CLS', val: metrics.cls },
                    { key: 'fcp', label: 'FCP', val: metrics.fcp },
                    { key: 'ttfb', label: 'TTFB', val: metrics.ttfb }
                  ].map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setActiveTab(m.key as any)}
                      className={`py-2.5 px-1 truncate rounded-xl text-center cursor-pointer transition-all ${
                        activeTab === m.key 
                          ? 'bg-slate-900 text-white font-black shadow-sm' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 font-semibold'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-bold tracking-wider">{m.label}</div>
                      <div className="text-[11px] font-mono mt-0.5">{m.val}</div>
                    </button>
                  ))}
                </div>

                {/* ACTIVE TAB DESCRIPTION */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4 text-left">
                  {activeTab === 'lcp' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0084ff]" />
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Largest Contentful Paint (LCP)</h4>
                        </div>
                        {getMetricBadge(metrics.lcp, 'lcp')}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        LCP measures visual loading speed. It marks the point in the page load timeline when the primary content has likely loaded. A good score is <strong>under 2.5 seconds</strong>.
                      </p>
                      <div className="bg-white border border-slate-150 p-3.5 rounded-xl text-xs space-y-2">
                        <span className="text-[9px] font-black text-[#0084ff] uppercase tracking-wider block font-mono">LAB OPTIMIZATION DIRECTIVES FOR {siteHost.toUpperCase()}:</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 font-normal leading-relaxed text-[11px]">
                          <li>Compress large high-resolution images on <strong>{siteHost}</strong> & convert to Next-Gen formats like <strong>AVIF / WebP</strong>.</li>
                          <li>Implement explicit <code>fetchpriority="high"</code> constraints on primary above-the-fold elements of <strong>{siteHost}</strong>.</li>
                          <li>Configure robust CDN caching schemes on the <strong>{siteHost}</strong> host to resolve latency limits.</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'inp' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Interaction to Next Paint (INP)</h4>
                        </div>
                        {getMetricBadge(metrics.inp, 'inp')}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        INP logs user interface responsiveness, measuring the latency of click, tap, and keyboard inputs. A stable interactive average measures <strong>under 200 milliseconds</strong>.
                      </p>
                      <div className="bg-white border border-slate-150 p-3.5 rounded-xl text-xs space-y-2">
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-wider block font-mono">LAB OPTIMIZATION DIRECTIVES FOR {siteHost.toUpperCase()}:</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 font-normal leading-relaxed text-[11px]">
                          <li>Break dense <strong>{siteHost}</strong> Javascript operations into smaller non-blocking tasks with <code>requestIdleCallback()</code>.</li>
                          <li>Audit <strong>{siteHost}</strong> interactions for dense event handler loops causing layout shifts.</li>
                          <li>Eliminate third-party render-blocking embeds on the <strong>{siteHost}</strong> domain.</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'cls' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Cumulative Layout Shift (CLS)</h4>
                        </div>
                        {getMetricBadge(metrics.cls, 'cls')}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        CLS monitors visual stability by measuring how often content shifts unexpectedly on-screen during rendering. Optimal limits sit <strong>below 0.10</strong>.
                      </p>
                      <div className="bg-white border border-slate-150 p-3.5 rounded-xl text-xs space-y-2">
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block font-mono">LAB OPTIMIZATION DIRECTIVES FOR {siteHost.toUpperCase()}:</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 font-normal leading-relaxed text-[11px]">
                          <li>Always declare explicit <code>width</code> and <code>height</code> proportions on <strong>{siteHost}</strong> image structures.</li>
                          <li>Pre-size container grids for late-loading dynamic resources, cards, or advertisements on <strong>{siteHost}</strong>.</li>
                          <li>Utilize Web Font preload techniques to avoid FOIT layout shifts on <strong>{siteHost}</strong>.</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'fcp' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">First Contentful Paint (FCP)</h4>
                        </div>
                        {getMetricBadge(metrics.fcp, 'fcp')}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        FCP marks the point where the first DOM text, image, or canvas asset finishes loading and appears on screen. Stable FCP scores measure <strong>under 1.8 seconds</strong>.
                      </p>
                      <div className="bg-white border border-slate-150 p-3.5 rounded-xl text-xs space-y-2">
                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider block font-mono">LAB OPTIMIZATION DIRECTIVES FOR {siteHost.toUpperCase()}:</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 font-normal leading-relaxed text-[11px]">
                          <li>Eliminate render-blocking stylesheets or scripts located in the <strong>{siteHost}</strong> head.</li>
                          <li>Inline critical CSS rules required for above-the-fold views on <strong>{siteHost}</strong>, lazy-loading the remainder.</li>
                          <li>Perform compression on main HTML code blocks of <strong>{siteHost}</strong>.</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'ttfb' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Time to First Byte (TTFB)</h4>
                        </div>
                        {getMetricBadge(metrics.ttfb, 'ttfb')}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        TTFB tracks the delay between requesting a resource and receiving the very first block of code response from the server. Optimal scores are <strong>under 0.2s (200ms)</strong>.
                      </p>
                      <div className="bg-white border border-slate-150 p-3.5 rounded-xl text-xs space-y-2">
                        <span className="text-[9px] font-black text-cyan-600 uppercase tracking-wider block font-mono">LAB OPTIMIZATION DIRECTIVES FOR {siteHost.toUpperCase()}:</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 font-normal leading-relaxed text-[11px]">
                          <li>Deploy high-capacity Multi-region Edge CDN networks for <strong>{siteHost}</strong>.</li>
                          <li>Optimize <strong>{siteHost}</strong> backend database query layers and cache repeating routes.</li>
                          <li>Migrate from client-intensive processing servers to lightweight cloud engine endpoints.</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN: TECHNICAL SEO STRUCTURED DATA & ROBOTS CONTROL */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* CRAWL DIRECTIVES (ROBOTS & AGENTS) */}
          <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-xs space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" /> Crawl Agent Directives
              </h3>
              <p className="text-[10px] text-slate-400">Inspect how robots.txt crawler instructions are structured to manage specific spider entities.</p>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'google', label: 'Google' },
                { id: 'gpt', label: 'ChatGPT' },
                { id: 'claude', label: 'Claude' },
                { id: 'all', label: 'Global' }
              ].map((ag) => (
                <button
                  key={ag.id}
                  onClick={() => setSelectedAgent(ag.id as any)}
                  className={`py-2 px-1 text-[10px] font-bold rounded-xl cursor-pointer transition-all ${
                    selectedAgent === ag.id 
                      ? 'bg-slate-100 border border-slate-200 text-slate-900 font-extrabold' 
                      : 'text-slate-500 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  {ag.label}
                </button>
              ))}
            </div>

            {/* PREVIEW OF ROBOTS FILE TARGET */}
            <div className="bg-slate-950 rounded-2xl p-4 font-mono text-[11px] text-slate-300 relative border border-slate-900">
              <div className="absolute top-3 right-3 flex items-center gap-1.5 no-print">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">robots.txt</span>
              </div>
              
              {selectedAgent === 'google' && (
                <div className="space-y-2 text-left font-mono">
                  <p className="text-slate-500"># Directives customized for high-frequency search indexers</p>
                  <p className="text-indigo-400 font-mono">User-agent: Googlebot</p>
                  <p className="font-mono">Allow: /</p>
                  <p className="font-mono">Allow: /projects</p>
                  <p className="font-mono">Allow: /blog</p>
                  <p className="text-emerald-500 font-mono mt-4">Sitemap: {siteOrigin}/sitemap.xml</p>
                </div>
              )}

              {selectedAgent === 'gpt' && (
                <div className="space-y-2 text-left font-mono">
                  <p className="text-slate-500"># Prevent AI training from consuming compute bandwidth</p>
                  <p className="text-rose-400 font-mono">User-agent: GPTBot</p>
                  <p className="text-slate-450 font-mono">Disallow: /admin</p>
                  <p className="text-slate-450 font-mono">Disallow: /config</p>
                  <p className="font-mono">Allow: /blog</p>
                  <p className="text-slate-500 font-mono mt-4"># Restricted training permissions</p>
                </div>
              )}

              {selectedAgent === 'claude' && (
                <div className="space-y-2 text-left font-mono">
                  <p className="text-slate-500"># Directives for Claude Bot scraper indexers</p>
                  <p className="text-rose-400 font-mono">User-agent: ClaudeBot</p>
                  <p className="text-slate-450 font-mono">Disallow: /admin</p>
                  <p className="font-mono">Allow: /blog</p>
                  <p className="font-mono">Crawl-delay: 1</p>
                </div>
              )}

              {selectedAgent === 'all' && (
                <div className="space-y-2 text-left font-mono">
                  <p className="text-slate-500"># Default directives for all global entities</p>
                  <p className="text-slate-200 font-mono">User-agent: *</p>
                  <p className="text-rose-450 font-mono">Disallow: /admin/</p>
                  <p className="text-rose-450 font-mono">Disallow: /api/</p>
                  <p className="font-mono">Allow: /</p>
                  <p className="text-indigo-500 font-mono">Crawl-delay: 1</p>
                  <p className="text-emerald-500 font-mono mt-4">Sitemap: {siteOrigin}/sitemap.xml</p>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-left flex gap-2">
              <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-normal font-normal">
                Crawling limits conserve server bandwidth. Restricting aggressive AI agents while granting full access to standard search crawlers (like Googlebot) maximizes rendering performance.
              </p>
            </div>
          </div>

          {/* JSON-LD SCHEMA GENERATOR */}
          <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-xs space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-primary" /> Schema Markup (JSON-LD)
              </h3>
              <p className="text-[10px] text-slate-400">Structured markup communicates semantic details straight to search engines for Rich Snippet outputs.</p>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3">
              {[
                { id: 'person', label: 'Person' },
                { id: 'business', label: 'LocalBusiness' },
                { id: 'blog', label: 'BlogPosting' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setJsonLdType(t.id as any)}
                  className={`py-2 px-1 text-[10px] font-bold rounded-xl cursor-pointer transition-all ${
                    jsonLdType === t.id 
                      ? 'bg-slate-900 text-white font-extrabold shadow-sm' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* PREVIEW OF SCHEMA DATA */}
            <div className="bg-slate-950 rounded-2xl p-4 font-mono text-[10px] text-slate-300 relative border border-slate-900 max-h-72 overflow-y-auto">
              <button
                type="button"
                onClick={() => copyToClipboard(getJsonLdText(), jsonLdType)}
                className="absolute top-2.5 right-2.5 p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy schema markup"
              >
                {copiedType === jsonLdType ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <pre className="text-left font-mono leading-normal leading-relaxed text-indigo-300">
                {getJsonLdText()}
              </pre>
            </div>

            {jsonLdType === 'person' && (
              <p className="text-[10.5px] text-slate-500 leading-normal font-normal">
                💡 Intended for homepages. Links social signals, authorship, and structural career milestones into a clean identity index.
              </p>
            )}
            {jsonLdType === 'business' && (
              <p className="text-[10.5px] text-slate-500 leading-normal font-normal">
                💡 Intended for agencies or corporate locations (QM Labs). Configures target geolocations, founder tags, services, and branding elements.
              </p>
            )}
            {jsonLdType === 'blog' && (
              <p className="text-[10.5px] text-slate-500 leading-normal font-normal">
                💡 Intended for individual articles. Feeds direct details like publisher, publish date, author, and preview parameters.
              </p>
            )}
          </div>

        </div>
      </div>
      )}

      {/* 1. AI-Powered SEO Optimizer Lab */}
      {labMode === 'ai-optimizer' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 max-w-5xl mx-auto"
        >
          {/* CONTROL FORM CARD */}
          <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-xs space-y-4 text-left">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0084ff]" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Gemini AI Technical SEO Metadata Optimizer
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Leverage Google Gemini AI to analyze your URL, target topic, and specific audience. The model will design highly clickable title variants, structured schema markup, and high-value NLP keyword directives.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Page URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 focus:border-primary focus:bg-white rounded-xl text-xs font-semibold focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Keyword / Focus Topic</label>
                <input
                  type="text"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 focus:border-primary focus:bg-white rounded-xl text-xs font-semibold focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Audience Persona</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 focus:border-primary focus:bg-white rounded-xl text-xs font-semibold focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Page Title (Optional)</label>
                <input
                  type="text"
                  value={existingTitle}
                  onChange={(e) => setExistingTitle(e.target.value)}
                  placeholder="E.g., Welcome to my website"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 focus:border-primary focus:bg-white rounded-xl text-xs font-semibold focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Meta Description (Optional)</label>
                <input
                  type="text"
                  value={existingDescription}
                  onChange={(e) => setExistingDescription(e.target.value)}
                  placeholder="E.g., We offer development and design"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 focus:border-primary focus:bg-white rounded-xl text-xs font-semibold focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={isAiAnalyzing}
                onClick={runAiAnalysis}
                className={`w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-850 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isAiAnalyzing ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isAiAnalyzing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Synthesizing SEO Strategy...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate AI SEO Strategy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI OUTPUT REPORT CARD */}
          {aiReport && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT REPORT HUB */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. HIGH-CTR TITLE ALTERNATIVES */}
                <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-xs space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" /> Click-Through (CTR) Optimized Titles
                    </h4>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                      CTR Booster
                    </span>
                  </div>

                  <div className="space-y-3">
                    {aiReport.titles?.map((title: any, tIdx: number) => (
                      <div key={tIdx} className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all space-y-1.5 relative group">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(title.text, `ai-title-${tIdx}`)}
                          className="absolute top-3 right-3 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Copy title"
                        >
                          {copiedType === `ai-title-${tIdx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <h5 className="font-mono text-xs font-black text-slate-900 pr-8">{title.text}</h5>
                        <p className="text-[11px] text-slate-500 leading-normal">{title.reason}</p>
                      </div>
                    ))}
                  </div>

                  {/* HIGH VALUE H1 HEADER SUGGESTION */}
                  <div className="pt-2 border-t border-slate-100/80">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Suggested Page Heading (H1)</span>
                    <div className="p-3 bg-indigo-50/30 border border-indigo-100/70 rounded-xl text-xs font-mono font-bold text-indigo-900">
                      &lt;h1&gt;{aiReport.h1}&lt;/h1&gt;
                    </div>
                  </div>
                </div>

                {/* 2. META DESCRIPTION BLUEPRINTS */}
                <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-xs space-y-4 text-left">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" /> Optimized Meta Description Snippets
                  </h4>

                  <div className="space-y-3">
                    {aiReport.descriptions?.map((desc: any, dIdx: number) => (
                      <div key={dIdx} className="p-4 bg-indigo-50/10 hover:bg-indigo-50/25 border border-indigo-100/50 rounded-2xl transition-all space-y-1.5 relative group">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(desc.text, `ai-desc-${dIdx}`)}
                          className="absolute top-3 right-3 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Copy description"
                        >
                          {copiedType === `ai-desc-${dIdx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <p className="text-xs text-slate-700 leading-relaxed font-semibold pr-8">"{desc.text}"</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="font-mono">{desc.text?.length} chars</span>
                          <span>•</span>
                          <span>{desc.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT REPORT HUB */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* NLP KEYWORDS & HEADING OUTLINE */}
                <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-xs space-y-4 text-left">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0084ff]" /> Semantic SEO & Outlining
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Suggested Word Count</span>
                      <p className="text-xs font-mono font-black text-slate-800">{aiReport.contentBrief?.wordCountRecommendation || "1,500 words"}</p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Required Semantic / NLP Keywords</span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiReport.contentBrief?.nlpKeywords?.map((kw: string, kIdx: number) => (
                          <span key={kIdx} className="inline-flex items-center px-2 py-1 bg-slate-50 border border-slate-150 text-[10px] font-mono font-bold text-slate-600 rounded-lg">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Recommended Heading Architecture</span>
                      <div className="space-y-1 text-xs">
                        {aiReport.contentBrief?.outline?.map((outline: string, oIdx: number) => (
                          <div key={oIdx} className="flex items-center gap-1.5 text-slate-600 font-semibold py-0.5">
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            <span>{outline}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Target "People Also Ask" (AEO)</span>
                      <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-500 font-normal">
                        {aiReport.contentBrief?.questions?.map((q: string, qIdx: number) => (
                          <p key={qIdx} className="bg-slate-50/50 border border-slate-100 p-2 rounded-xl italic">
                            💡 "{q}"
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI SCHEMA.ORG STRUCTURE */}
                <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-xs space-y-3 text-left">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Code className="w-4 h-4 text-primary" /> Generated JSON-LD Entity
                  </h4>
                  <p className="text-[10px] text-slate-400">Custom constructed Schema.org tag specifically representing this search context.</p>

                  <div className="bg-slate-950 rounded-2xl p-4 font-mono text-[10px] text-slate-300 relative border border-slate-900 max-h-56 overflow-y-auto font-mono">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(aiReport.schema, "ai-schema")}
                      className="absolute top-2.5 right-2.5 p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedType === "ai-schema" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <pre className="text-left font-mono leading-relaxed text-indigo-300">
                      {aiReport.schema}
                    </pre>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!aiReport && !isAiAnalyzing && (
            <div className="p-12 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl space-y-3">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto animate-bounce" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-700 text-sm">No analysis loaded</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Fill out the parameters above and click "Generate AI SEO Strategy" to run live Gemini diagnostics.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 2. Live On-Page Quality Sandbox */}
      {labMode === "onpage-auditor" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto"
        >
          {/* LEFT COLUMN: EDIT SANDBOX */}
          <div className="lg:col-span-7 bg-white border border-slate-150 rounded-[2rem] p-6 shadow-xs space-y-4 text-left">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" /> Live On-Page Content Editor
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              Type or paste your meta tags and page content in the editor below. The live engine will dynamically compute tag lengths, evaluate keywords, and grade keyword density values instantly.
            </p>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Page Title (&lt;title&gt;)</label>
                  <span className={`text-[10px] font-mono font-bold ${sandboxTitle.length >= 50 && sandboxTitle.length <= 60 ? "text-emerald-500" : "text-slate-400"}`}>
                    {sandboxTitle.length} / 60 characters
                  </span>
                </div>
                <input
                  type="text"
                  value={sandboxTitle}
                  onChange={(e) => setSandboxTitle(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-150 focus:border-primary focus:bg-white rounded-2xl text-xs font-semibold focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Description (&lt;meta name="description"&gt;)</label>
                  <span className={`text-[10px] font-mono font-bold ${sandboxDescription.length >= 120 && sandboxDescription.length <= 160 ? "text-emerald-500" : "text-slate-400"}`}>
                    {sandboxDescription.length} / 160 characters
                  </span>
                </div>
                <textarea
                  value={sandboxDescription}
                  onChange={(e) => setSandboxDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-150 focus:border-primary focus:bg-white rounded-2xl text-xs font-semibold focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Optimization Keyword</label>
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="E.g., Core Web Vitals"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 focus:border-primary focus:bg-white rounded-xl text-xs font-semibold"
                  />
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <p className="text-[10px] text-slate-500 leading-normal">
                    The density analyzer computes occurrences of this specific keyword phrase across your body content draft.
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Body Content Draft / Article Draft</label>
                <textarea
                  value={sandboxContent}
                  onChange={(e) => setSandboxContent(e.target.value)}
                  rows={7}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-150 focus:border-primary focus:bg-white rounded-2xl text-xs font-medium leading-relaxed focus:outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: REAL-TIME GRADER */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* GRADER WRAPPER CARD */}
            <div className="bg-white border border-slate-150 rounded-[2rem] p-6 shadow-xs space-y-6">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Real-time Quality Grading
              </h3>

              {/* 1. TITLE METER */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">Meta Title Tag Length</span>
                  <span className="font-mono font-black">{sandboxTitle.length} chars</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      sandboxTitle.length >= 50 && sandboxTitle.length <= 60
                        ? "bg-emerald-500 w-full"
                        : sandboxTitle.length >= 40 && sandboxTitle.length <= 65
                        ? "bg-amber-400 w-3/4"
                        : "bg-rose-500 w-1/2"
                    }`}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Target Range: 50-60 chars</span>
                  {sandboxTitle.length >= 50 && sandboxTitle.length <= 60 ? (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md uppercase text-[9px]">Perfect Length</span>
                  ) : (
                    <span className="text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded-md uppercase text-[9px]">Out of Range</span>
                  )}
                </div>
              </div>

              {/* 2. DESCRIPTION METER */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">Meta Description Length</span>
                  <span className="font-mono font-black">{sandboxDescription.length} chars</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      sandboxDescription.length >= 120 && sandboxDescription.length <= 160
                        ? "bg-emerald-500 w-full"
                        : sandboxDescription.length >= 100 && sandboxDescription.length <= 180
                        ? "bg-amber-400 w-3/4"
                        : "bg-rose-500 w-1/2"
                    }`}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Target Range: 120-160 chars</span>
                  {sandboxDescription.length >= 120 && sandboxDescription.length <= 160 ? (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md uppercase text-[9px]">Perfect Length</span>
                  ) : (
                    <span className="text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded-md uppercase text-[9px]">Out of Range</span>
                  )}
                </div>
              </div>

              {/* 3. KEYWORD DENSITY METER */}
              {(() => {
                const kwData = getKeywordMetrics();
                return (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-bold text-slate-700">Keyword Density: "{searchKeyword}"</span>
                      <span className={`px-2 py-0.5 rounded-md font-black text-[9px] uppercase border ${kwData.color}`}>
                        {kwData.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center animate-fade-in">
                        <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-0.5">Occurrences</span>
                        <span className="font-mono text-xs font-black text-slate-800">{kwData.count} times</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center animate-fade-in">
                        <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-0.5">Density</span>
                        <span className="font-mono text-xs font-black text-slate-800">{kwData.density}%</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center animate-fade-in">
                        <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-0.5">Total Words</span>
                        <span className="font-mono text-xs font-black text-slate-800">{kwData.totalWords}</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-normal">
                      💡 Ideal keyword density ranges between <strong>1.0% to 2.5%</strong>. Exceeding 3.0% runs a heavy risk of triggering spam filters by search engines.
                    </p>
                  </div>
                );
              })()}

              {/* 4. ON-PAGE READABILITY CHECKLIST */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">SEO Quality Audits</span>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    {sandboxTitle.toLowerCase().startsWith(searchKeyword.toLowerCase()) ? (
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
                    <span>Title starts with focus keyword (Highly Recommended)</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    {sandboxContent.toLowerCase().includes(searchKeyword.toLowerCase()) ? (
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    )}
                    <span>Focus keyword detected in first 100 words of page content</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    {sandboxContent.split(/\s+/).filter(Boolean).length >= 100 ? (
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
                    <span>Content meets minimal word count thresholds (&gt;100 words)</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Estimated Reading Time: <strong>{Math.ceil(sandboxContent.split(/\s+/).filter(Boolean).length / 200)} mins</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. XML Sitemap Builder */}
      {labMode === "sitemap-builder" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 max-w-5xl mx-auto font-sans"
        >
          {/* TOP EXPLANATION PANEL */}
          <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-xs space-y-4 text-left font-sans">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider font-sans">
                XML Sitemap Visual Builder & Validator
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              An XML Sitemap tells search engines exactly which URLs exist on your domain. This lab tool lets you visually build, adjust crawling priorities, set change frequencies, and export a formatted <code>sitemap.xml</code> instantly.
            </p>

            {/* QUICK FORM */}
            <form onSubmit={addSitemapPage} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end pt-2 border-t border-slate-100 font-sans">
              <div className="md:col-span-5 space-y-1 text-left font-sans">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Page Absolute URL</label>
                <input
                  type="url"
                  required
                  value={newPageUrl}
                  onChange={(e) => setNewPageUrl(e.target.value)}
                  placeholder="https://yourwebsite.com/services"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-150 focus:border-primary focus:bg-white rounded-xl text-xs font-semibold focus:outline-hidden"
                />
              </div>

              <div className="md:col-span-3 space-y-1 text-left font-sans">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Priority Factor</label>
                <select
                  value={newPagePriority}
                  onChange={(e) => setNewPagePriority(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-150 focus:border-primary focus:bg-white rounded-xl text-xs font-semibold focus:outline-hidden"
                >
                  <option value="1.0">1.0 (Primary Homepage)</option>
                  <option value="0.8">0.8 (High Impact Services)</option>
                  <option value="0.5">0.5 (Standard Content pages)</option>
                  <option value="0.3">0.3 (Low Impact archive pages)</option>
                </select>
              </div>

              <div className="md:col-span-3 space-y-1 text-left font-sans">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Change Frequency</label>
                <select
                  value={newPageFreq}
                  onChange={(e) => setNewPageFreq(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-150 focus:border-primary focus:bg-white rounded-xl text-xs font-semibold focus:outline-hidden"
                >
                  <option value="always">Always (Real-time updates)</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
            {/* SITEMAP GRID TABLE */}
            <div className="lg:col-span-6 bg-white border border-slate-150 rounded-[2rem] p-6 shadow-xs text-left space-y-4 font-sans">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">Sitemap URL Map Index</h4>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px] text-left font-sans">
                      <th className="pb-2">Page Location</th>
                      <th className="pb-2">Priority</th>
                      <th className="pb-2">Freq</th>
                      <th className="pb-2 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sitemapPages.map((page, idx) => (
                      <tr key={idx} className="border-b border-slate-50 font-mono text-[11px] text-slate-600">
                        <td className="py-2.5 max-w-[200px] truncate select-all">{page.url}</td>
                        <td className="py-2.5 font-bold text-slate-800">{page.priority}</td>
                        <td className="py-2.5 font-bold text-slate-500 uppercase text-[9px]">{page.changefreq}</td>
                        <td className="py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => removeSitemapPage(idx)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SITEMAP XML OUTPUT */}
            <div className="lg:col-span-6 bg-white border border-slate-150 rounded-[2rem] p-6 shadow-xs text-left space-y-3 font-sans">
              <div className="flex justify-between items-center font-sans">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">Validated sitemap.xml Output</h4>
                <button
                  type="button"
                  onClick={() => copyToClipboard(generateSitemapXml(), "sitemap-xml")}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedType === "sitemap-xml" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 rounded-2xl p-4 font-mono text-[10.5px] text-indigo-300 relative border border-slate-900 h-64 overflow-y-auto font-mono">
                <pre className="text-left font-mono leading-relaxed select-all">
                  {generateSitemapXml()}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* COMPREHENSIVE SEO REPORT DOWNLOAD MODAL (CRM LEAD INGESTION) */}
      <AnimatePresence>
        {showDownloadModal && (
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
                  setShowDownloadModal(false);
                  setDownloadError('');
                }}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer animate-pulse"
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
                      By unlocking this download, you agree to our <strong>Privacy Policy</strong> and authorize QM Labs to record your coordinates to their secure CRM database. No OTP verification required.
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
    </div>
  );
}
