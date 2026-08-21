import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Map, Trash2, Check, Copy } from 'lucide-react';
import { SitemapPageItem } from './vitalsTypes';

interface VitalsSitemapBuilderTabProps {
  sitemapPages: SitemapPageItem[];
  addSitemapPage: (e: React.FormEvent) => void;
  removeSitemapPage: (idx: number) => void;
  newPageUrl: string;
  setNewPageUrl: (val: string) => void;
  newPagePriority: string;
  setNewPagePriority: (val: string) => void;
  newPageFreq: string;
  setNewPageFreq: (val: string) => void;
  generateSitemapXml: () => string;
}

export const VitalsSitemapBuilderTab: React.FC<VitalsSitemapBuilderTabProps> = ({
  sitemapPages,
  addSitemapPage,
  removeSitemapPage,
  newPageUrl,
  setNewPageUrl,
  newPagePriority,
  setNewPagePriority,
  newPageFreq,
  setNewPageFreq,
  generateSitemapXml,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
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
  );
};
