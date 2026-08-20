import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, FileText, Layers, Code, Check, Copy, ChevronRight } from 'lucide-react';
import { AiSeoReport } from './vitalsTypes';

interface VitalsAiOptimizerTabProps {
  url: string;
  setUrl: (val: string) => void;
  targetKeyword: string;
  setTargetKeyword: (val: string) => void;
  targetAudience: string;
  setTargetAudience: (val: string) => void;
  existingTitle: string;
  setExistingTitle: (val: string) => void;
  existingDescription: string;
  setExistingDescription: (val: string) => void;
  isAiAnalyzing: boolean;
  runAiAnalysis: () => void;
  aiReport: AiSeoReport | null;
}

export const VitalsAiOptimizerTab: React.FC<VitalsAiOptimizerTabProps> = ({
  url,
  setUrl,
  targetKeyword,
  setTargetKeyword,
  targetAudience,
  setTargetAudience,
  existingTitle,
  setExistingTitle,
  existingDescription,
  setExistingDescription,
  isAiAnalyzing,
  runAiAnalysis,
  aiReport,
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
                  onClick={() => copyToClipboard(aiReport.schema || '', "ai-schema")}
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
  );
};
