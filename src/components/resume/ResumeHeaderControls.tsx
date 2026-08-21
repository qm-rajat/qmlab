import React from 'react';
import { 
  Zap, FileCheck, SlidersHorizontal, Edit3, Check, Copy, 
  FileText, Download, Printer 
} from 'lucide-react';
import { ResumePersona, PERSONA_META } from './resumeTypes';

interface ResumeHeaderControlsProps {
  atsScore: number;
  selectedPersona: ResumePersona;
  onSelectPersona: (persona: ResumePersona) => void;
  showConfigPanel: boolean;
  onToggleConfigPanel: () => void;
  isEditable: boolean;
  onToggleEditable: () => void;
  copied: boolean;
  copiedText: boolean;
  onCopyMarkdown: () => void;
  onDownloadTxt: () => void;
  onDownloadJSON: () => void;
  onPrint: () => void;
}

export const ResumeHeaderControls: React.FC<ResumeHeaderControlsProps> = ({
  atsScore,
  selectedPersona,
  onSelectPersona,
  showConfigPanel,
  onToggleConfigPanel,
  isEditable,
  onToggleEditable,
  copied,
  copiedText,
  onCopyMarkdown,
  onDownloadTxt,
  onDownloadJSON,
  onPrint,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 md:p-6 no-print">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Title & Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-50 text-[#0084ff] border border-blue-200/60">
              <Zap className="w-3 h-3" /> ATS OPTIMIZED ENGINE
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <FileCheck className="w-3 h-3" /> ATS Rating: {atsScore}/100
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Adaptive Resume &amp; Dossier Hub
          </h3>
          <p className="text-xs text-slate-500 max-w-xl">
            Target tailored personas, customize active sections and competencies, toggle live draft edits, and export directly as PDF, ATS Text, Markdown, or JSON.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Customizer Settings Toggle */}
          <button
            id="resume-toggle-settings-btn"
            onClick={onToggleConfigPanel}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border cursor-pointer ${
              showConfigPanel 
                ? 'bg-slate-900 text-white border-slate-950 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle Customizer & ATS Options"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {showConfigPanel ? 'Close Customizer' : 'Customize Layout'}
          </button>

          {/* Live Inline Draft Switcher */}
          <button
            id="resume-live-edit-btn"
            onClick={onToggleEditable}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border cursor-pointer ${
              isEditable 
                ? 'bg-indigo-600 text-white border-indigo-700 ring-3 ring-indigo-500/20 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Enable inline content editing directly inside resume preview"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditable ? 'Exit Edit Mode' : 'Live Draft Edit'}
          </button>

          {/* Copy Markdown */}
          <button
            id="resume-copy-md-btn"
            onClick={onCopyMarkdown}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copy ATS-friendly Markdown to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            {copied ? 'Copied Markdown' : 'Copy MD'}
          </button>

          {/* Download Text (.txt) */}
          <button
            id="resume-download-txt-btn"
            onClick={onDownloadTxt}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download clean plain text format for fast job portal pasting"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            {copiedText ? 'Saved .TXT' : '.TXT'}
          </button>

          {/* Export JSON */}
          <button
            id="resume-export-json-btn"
            onClick={onDownloadJSON}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download structured JSON schema"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            JSON
          </button>

          {/* Print / Save PDF Button */}
          <button
            id="resume-print-pdf-btn"
            onClick={onPrint}
            className="px-4 py-2 text-xs font-extrabold text-white bg-[#0084ff] hover:bg-blue-600 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
            title="Print or Save as High-Resolution ATS PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Persona Selector Tabs */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mr-1">
          TARGET PERSONA:
        </span>
        {(Object.keys(PERSONA_META) as ResumePersona[]).map((key) => {
          const meta = PERSONA_META[key];
          const Icon = meta.icon;
          const isSelected = selectedPersona === key;
          return (
            <button
              key={key}
              id={`resume-persona-tab-${key}`}
              onClick={() => onSelectPersona(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#0084ff]' : 'text-slate-400'}`} />
              <span>
                {key === 'general' ? 'Full-Stack Developer' : key === 'seo' ? 'Technical SEO & Analytics' : key === 'data' ? 'Data Science & ML' : key === 'qa' ? 'QA & Automation' : 'Cybersecurity'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
