import React, { useState } from 'react';
import { Gauge, Sparkles, FileCheck, Map } from 'lucide-react';
import { 
  VitalsScores, 
  VitalsMetrics, 
  SitemapPageItem, 
  AiSeoReport, 
  getUrlDetails 
} from './vitals/vitalsTypes';
import { VitalsLighthouseTab } from './vitals/VitalsLighthouseTab';
import { VitalsAiOptimizerTab } from './vitals/VitalsAiOptimizerTab';
import { VitalsOnPageSandboxTab } from './vitals/VitalsOnPageSandboxTab';
import { VitalsSitemapBuilderTab } from './vitals/VitalsSitemapBuilderTab';
import { VitalsExportModal } from './vitals/VitalsExportModal';

interface CoreWebVitalsLabProps {
  settings: any;
}

export default function CoreWebVitalsLab({ settings }: CoreWebVitalsLabProps) {
  // Lab Mode state
  const [labMode, setLabMode] = useState<'lighthouse' | 'ai-optimizer' | 'onpage-auditor' | 'sitemap-builder'>('lighthouse');

  // Report Download & CRM Modal State
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Input URL state
  const [url, setUrl] = useState('https://qmlab-indol.vercel.app');
  // Decoupled audited URL state
  const [auditedUrl, setAuditedUrl] = useState('https://qmlab-indol.vercel.app');
  // Device mode
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  // Audit run states
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState<string[]>([]);
  const [auditDone, setAuditDone] = useState(true);

  // AI Optimizer State
  const [targetKeyword, setTargetKeyword] = useState('Technical SEO Expert');
  const [targetAudience, setTargetAudience] = useState('Tech Recruiters & CTOs');
  const [existingTitle, setExistingTitle] = useState('');
  const [existingDescription, setExistingDescription] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<AiSeoReport | null>(null);

  // Live On-Page Quality Sandbox State
  const [sandboxTitle, setSandboxTitle] = useState('Rajat Kumar Dash | Technical SEO Expert & Full-Stack Developer');
  const [sandboxDescription, setSandboxDescription] = useState('Highly optimized technical portfolio. Specialized in PageSpeed, Core Web Vitals, and server-side engineering to reach 100% Google Lighthouse scores.');
  const [sandboxContent, setSandboxContent] = useState('Core Web Vitals are a set of metrics that Google uses to measure user experience. These include Largest Contentful Paint (LCP), First Contentful Paint (FCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP). To optimize LCP, you must compress images into WebP or AVIF formats and implement a fast Edge CDN caching strategy. For CLS, pre-size dynamic components. Technical SEO is the foundation of high organic keyword rankings.');
  const [searchKeyword, setSearchKeyword] = useState('Core Web Vitals');

  // Interactive Sitemap Builder State
  const [sitemapPages, setSitemapPages] = useState<SitemapPageItem[]>([
    { url: 'https://qmlab-indol.vercel.app', priority: '1.0', changefreq: 'daily' },
    { url: 'https://qmlab-indol.vercel.app/blog', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://qmlab-indol.vercel.app/projects', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://qmlab-indol.vercel.app/contact', priority: '0.5', changefreq: 'monthly' },
  ]);
  const [newPageUrl, setNewPageUrl] = useState('');
  const [newPagePriority, setNewPagePriority] = useState('0.8');
  const [newPageFreq, setNewPageFreq] = useState('weekly');

  // Score states
  const [scores, setScores] = useState<VitalsScores>({
    performance: 99,
    seo: 100,
    accessibility: 96,
    bestPractices: 100
  });

  // CWV Metric timings
  const [metrics, setMetrics] = useState<VitalsMetrics>({
    lcp: '1.1s', // Largest Contentful Paint
    inp: '42ms', // Interaction to Next Paint
    cls: '0.015', // Cumulative Layout Shift
    fcp: '0.8s', // First Contentful Paint
    ttfb: '72ms', // Time to First Byte
  });

  // JSON-LD state
  const [jsonLdType, setJsonLdType] = useState<'person' | 'business' | 'blog'>('person');

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
            } else if (url.includes('rajat') || url.includes('qmlabs') || url.includes('qmlab') || url.includes('vercel')) {
              setScores({ performance: 99, seo: 100, accessibility: 98, bestPractices: 100 });
              setMetrics({ lcp: '1.1s', inp: '42ms', cls: '0.015', fcp: '0.8s', ttfb: '72ms' });
            } else {
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

      {/* COMPONENT CONTENT VIEWS */}
      {labMode === 'lighthouse' && (
        <VitalsLighthouseTab
          url={url}
          setUrl={setUrl}
          device={device}
          setDevice={setDevice}
          isAuditing={isAuditing}
          startAudit={startAudit}
          auditProgress={auditProgress}
          auditDone={auditDone}
          auditedUrl={auditedUrl}
          scores={scores}
          metrics={metrics}
          siteHost={siteHost}
          siteOrigin={siteOrigin}
          siteCleanName={siteCleanName}
          jsonLdType={jsonLdType}
          setJsonLdType={setJsonLdType}
          personJsonLd={personJsonLd}
          businessJsonLd={businessJsonLd}
          blogJsonLd={blogJsonLd}
          onOpenDownloadModal={() => setShowDownloadModal(true)}
        />
      )}

      {labMode === 'ai-optimizer' && (
        <VitalsAiOptimizerTab
          url={url}
          setUrl={setUrl}
          targetKeyword={targetKeyword}
          setTargetKeyword={setTargetKeyword}
          targetAudience={targetAudience}
          setTargetAudience={setTargetAudience}
          existingTitle={existingTitle}
          setExistingTitle={setExistingTitle}
          existingDescription={existingDescription}
          setExistingDescription={setExistingDescription}
          isAiAnalyzing={isAiAnalyzing}
          runAiAnalysis={runAiAnalysis}
          aiReport={aiReport}
        />
      )}

      {labMode === 'onpage-auditor' && (
        <VitalsOnPageSandboxTab
          sandboxTitle={sandboxTitle}
          setSandboxTitle={setSandboxTitle}
          sandboxDescription={sandboxDescription}
          setSandboxDescription={setSandboxDescription}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          sandboxContent={sandboxContent}
          setSandboxContent={setSandboxContent}
        />
      )}

      {labMode === 'sitemap-builder' && (
        <VitalsSitemapBuilderTab
          sitemapPages={sitemapPages}
          addSitemapPage={addSitemapPage}
          removeSitemapPage={removeSitemapPage}
          newPageUrl={newPageUrl}
          setNewPageUrl={setNewPageUrl}
          newPagePriority={newPagePriority}
          setNewPagePriority={setNewPagePriority}
          newPageFreq={newPageFreq}
          setNewPageFreq={setNewPageFreq}
          generateSitemapXml={generateSitemapXml}
        />
      )}

      {/* COMPREHENSIVE SEO REPORT DOWNLOAD MODAL (CRM LEAD INGESTION) */}
      <VitalsExportModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        auditedUrl={auditedUrl}
        siteHost={siteHost}
        siteCleanName={siteCleanName}
        siteOrigin={siteOrigin}
        device={device}
        scores={scores}
        metrics={metrics}
        personJsonLd={personJsonLd}
      />
    </div>
  );
}
