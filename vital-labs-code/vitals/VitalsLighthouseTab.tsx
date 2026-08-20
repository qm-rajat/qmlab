import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, RefreshCw, Download, Bot, Code, Info, 
  Check, Copy, Zap, ChevronRight 
} from 'lucide-react';
import { VitalsScores, VitalsMetrics } from './vitalsTypes';

interface VitalsLighthouseTabProps {
  url: string;
  setUrl: (val: string) => void;
  device: 'mobile' | 'desktop';
  setDevice: (val: 'mobile' | 'desktop') => void;
  isAuditing: boolean;
  startAudit: () => void;
  auditProgress: string[];
  auditDone: boolean;
  auditedUrl: string;
  scores: VitalsScores;
  metrics: VitalsMetrics;
  siteHost: string;
  siteOrigin: string;
  siteCleanName: string;
  jsonLdType: 'person' | 'business' | 'blog';
  setJsonLdType: (val: 'person' | 'business' | 'blog') => void;
  personJsonLd: string;
  businessJsonLd: string;
  blogJsonLd: string;
  onOpenDownloadModal: () => void;
}

export const VitalsLighthouseTab: React.FC<VitalsLighthouseTabProps> = ({
  url,
  setUrl,
  device,
  setDevice,
  isAuditing,
  startAudit,
  auditProgress,
  auditDone,
  auditedUrl,
  scores,
  metrics,
  siteHost,
  siteOrigin,
  jsonLdType,
  setJsonLdType,
  personJsonLd,
  businessJsonLd,
  blogJsonLd,
  onOpenDownloadModal,
}) => {
  const [activeTab, setActiveTab] = useState<'lcp' | 'inp' | 'cls' | 'fcp' | 'ttfb'>('lcp');
  const [selectedAgent, setSelectedAgent] = useState<'google' | 'gpt' | 'claude' | 'all'>('google');
  const [speedInsightsFramework, setSpeedInsightsFramework] = useState<'nextjs' | 'react' | 'remix' | 'sveltekit'>('nextjs');
  const [speedInsightsPkgManager, setSpeedInsightsPkgManager] = useState<'npm' | 'yarn' | 'pnpm'>('npm');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getJsonLdText = () => {
    if (jsonLdType === 'person') return personJsonLd;
    if (jsonLdType === 'business') return businessJsonLd;
    return blogJsonLd;
  };

  const renderGauge = (score: number, label: string, colorClass: string, trackColor: string) => {
    const strokeDashoffset = 251.2 - (251.2 * score) / 100;
    return (
      <div className="flex flex-col items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={trackColor}
              strokeWidth="8"
            />
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
    <>
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
                    onClick={onOpenDownloadModal}
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

      {/* SPEED INSIGHTS PERFORMANCE GET STARTED GUIDE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-slate-150 p-6 sm:p-8 rounded-[2rem] shadow-xs space-y-6 text-left mt-8 max-w-7xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-[#0084ff] rounded-md text-[10px] font-extrabold uppercase tracking-widest font-mono">
              <Zap className="w-3.5 h-3.5" /> Performance Analytics
            </span>
            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Get Started with Speed Insights</h3>
            <p className="text-xs text-slate-500">To start collecting real-user performance metrics, follow these simple integration steps.</p>
          </div>
          
          {/* Framework Switcher tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-100">
            {[
              { id: 'nextjs', label: 'Next.js' },
              { id: 'react', label: 'React (Vite)' },
              { id: 'remix', label: 'Remix' },
              { id: 'sveltekit', label: 'SvelteKit' }
            ].map((fw) => (
              <button
                key={fw.id}
                onClick={() => setSpeedInsightsFramework(fw.id as any)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer relative"
              >
                {speedInsightsFramework === fw.id && (
                  <motion.span
                    layoutId="activeFrameworkTab"
                    className="absolute inset-0 bg-white border border-slate-200/80 rounded-xl shadow-xs -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={speedInsightsFramework === fw.id ? 'text-slate-900 font-extrabold' : 'text-slate-500 hover:text-slate-850 font-semibold'}>
                  {fw.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* STEP 1: INSTALLATION */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-mono font-black flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">Install our package</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Start by installing <code>@vercel/speed-insights</code> in your existing project using your preferred package manager.
                  </p>
                </div>
              </div>

              {/* Package Manager selector */}
              <div className="flex gap-1 bg-slate-50/50 p-0.5 rounded-lg border border-slate-100/80 w-fit">
                {['npm', 'yarn', 'pnpm'].map((pkg) => (
                  <button
                    key={pkg}
                    onClick={() => setSpeedInsightsPkgManager(pkg as any)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md uppercase transition-all cursor-pointer ${
                      speedInsightsPkgManager === pkg
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {pkg}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Block for installation */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-900 relative font-mono text-[11px] leading-relaxed text-indigo-300 mt-2 flex items-center justify-between group">
              <code className="font-mono text-slate-100 selection:bg-indigo-500/30">
                {speedInsightsPkgManager === 'npm' && 'npm i @vercel/speed-insights'}
                {speedInsightsPkgManager === 'yarn' && 'yarn add @vercel/speed-insights'}
                {speedInsightsPkgManager === 'pnpm' && 'pnpm add @vercel/speed-insights'}
              </code>
              <button
                type="button"
                onClick={() => {
                  const cmd = speedInsightsPkgManager === 'npm' ? 'npm i @vercel/speed-insights' : (speedInsightsPkgManager === 'yarn' ? 'yarn add @vercel/speed-insights' : 'pnpm add @vercel/speed-insights');
                  copyToClipboard(cmd, 'speed-insights-install');
                }}
                className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Copy command"
              >
                {copiedType === 'speed-insights-install' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* STEP 2: MOUNT COMPONENT OR FUNCTION */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-mono font-black flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    {speedInsightsFramework === 'nextjs' && 'Add the Next.js component'}
                    {speedInsightsFramework === 'react' && 'Inject telemetry function'}
                    {speedInsightsFramework === 'remix' && 'Add the Remix component'}
                    {speedInsightsFramework === 'sveltekit' && 'Inject layout hook'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {speedInsightsFramework === 'nextjs' && 'Import and use the <SpeedInsights /> Next.js component into your app\'s layout or your main file.'}
                    {speedInsightsFramework === 'react' && 'Import and execute injectSpeedInsights() in your main React entry file.'}
                    {speedInsightsFramework === 'remix' && 'Import and use the <SpeedInsights /> component inside your root layout route.'}
                    {speedInsightsFramework === 'sveltekit' && 'Call injectSpeedInsights() within script tags of your root +layout.svelte file.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Code Block for step 2 */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-900 relative font-mono text-[11px] leading-relaxed text-indigo-300 mt-2">
              <button
                type="button"
                onClick={() => {
                  let snippet = '';
                  if (speedInsightsFramework === 'nextjs') {
                    snippet = `import { SpeedInsights } from "@vercel/speed-insights/next"`;
                  } else if (speedInsightsFramework === 'react') {
                    snippet = `import { injectSpeedInsights } from '@vercel/speed-insights';\n\ninjectSpeedInsights();`;
                  } else if (speedInsightsFramework === 'remix') {
                    snippet = `import { SpeedInsights } from "@vercel/speed-insights/remix"`;
                  } else if (speedInsightsFramework === 'sveltekit') {
                    snippet = `<script>\n  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';\n  injectSpeedInsights();\n</script>`;
                  }
                  copyToClipboard(snippet, 'speed-insights-code');
                }}
                className="absolute top-3 right-3 p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy code"
              >
                {copiedType === 'speed-insights-code' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              
              <pre className="text-left font-mono leading-relaxed select-all overflow-x-auto text-indigo-300 max-h-44">
                {speedInsightsFramework === 'nextjs' && (
                  <code className="text-slate-300 font-mono">
                    <span className="text-indigo-400">import</span> {'{'} <span className="text-emerald-400">SpeedInsights</span> {'}'} <span className="text-indigo-400">from</span> <span className="text-amber-400">"@vercel/speed-insights/next"</span>
                  </code>
                )}
                {speedInsightsFramework === 'react' && (
                  <code className="text-slate-300 font-mono">
                    <span className="text-indigo-400">import</span> {'{'} <span className="text-emerald-400">injectSpeedInsights</span> {'}'} <span className="text-indigo-400">from</span> <span className="text-amber-400">'@vercel/speed-insights'</span>;{"\n\n"}
                    <span className="text-slate-400">// Initialize Core Web Vitals telemetry</span>{"\n"}
                    <span className="text-indigo-400">injectSpeedInsights</span>();
                  </code>
                )}
                {speedInsightsFramework === 'remix' && (
                  <code className="text-slate-300 font-mono">
                    <span className="text-indigo-400">import</span> {'{'} <span className="text-emerald-400">SpeedInsights</span> {'}'} <span className="text-indigo-400">from</span> <span className="text-amber-400">"@vercel/speed-insights/remix"</span>
                  </code>
                )}
                {speedInsightsFramework === 'sveltekit' && (
                  <code className="text-slate-300 font-mono">
                    &lt;<span className="text-[#0084ff]">script</span>&gt;{"\n"}
                    {"  "}<span className="text-indigo-400">import</span> {'{'} <span className="text-emerald-400">injectSpeedInsights</span> {'}'} <span className="text-indigo-400">from</span> <span className="text-amber-400">'@vercel/speed-insights/sveltekit'</span>;{"\n\n"}
                    {"  "}<span className="text-[#0084ff]">injectSpeedInsights</span>();{"\n"}
                    &lt;/<span className="text-[#0084ff]">script</span>&gt;
                  </code>
                )}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer info link */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready for production Core Web Vitals data reporting.</span>
          </div>
          <a
            href="https://vercel.com/docs/speed-insights"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#0084ff] hover:text-blue-600 transition-colors cursor-pointer group"
          >
            <span>For full examples and further reference, please refer to our documentation</span>
            <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </motion.div>
    </>
  );
};
