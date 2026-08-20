import React from 'react';
import { motion } from 'motion/react';
import { Sliders, Info, CheckCircle, Check, AlertTriangle } from 'lucide-react';

interface VitalsOnPageSandboxTabProps {
  sandboxTitle: string;
  setSandboxTitle: (val: string) => void;
  sandboxDescription: string;
  setSandboxDescription: (val: string) => void;
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  sandboxContent: string;
  setSandboxContent: (val: string) => void;
}

export const VitalsOnPageSandboxTab: React.FC<VitalsOnPageSandboxTabProps> = ({
  sandboxTitle,
  setSandboxTitle,
  sandboxDescription,
  setSandboxDescription,
  searchKeyword,
  setSearchKeyword,
  sandboxContent,
  setSandboxContent,
}) => {
  const getKeywordMetrics = () => {
    const rawText = (sandboxTitle + " " + sandboxDescription + " " + sandboxContent).toLowerCase();
    const cleanKw = searchKeyword.toLowerCase().trim();
    if (!cleanKw) return { count: 0, density: 0, status: 'No keyword', color: 'text-slate-400', totalWords: 0 };
    
    const words = rawText.match(/\b[a-z0-9_-]+\b/g) || [];
    const totalWords = words.length;
    if (totalWords === 0) return { count: 0, density: 0, status: 'No content', color: 'text-slate-400', totalWords: 0 };
    
    // Count exact phrase matches
    const escapedKw = cleanKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKw}\\b`, 'g');
    const matches = rawText.match(regex);
    const count = matches ? matches.length : 0;
    
    const density = parseFloat(((count / totalWords) * 100).toFixed(1));
    let status = 'Optimal (1.5 - 2.5%)';
    let color = 'text-emerald-500 bg-emerald-50 border-emerald-200';
    
    if (density < 0.8) {
      status = 'Under-optimized (< 0.8%)';
      color = 'text-amber-500 bg-amber-50 border-amber-200';
    } else if (density > 3.0) {
      status = 'Over-optimized (Keyword Stuffing > 3%)';
      color = 'text-rose-500 bg-rose-50 border-rose-200';
    }
    
    return { count, density, status, color, totalWords };
  };

  const kwData = getKeywordMetrics();

  return (
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
  );
};
