import React from 'react';
import { SlidersHorizontal, RefreshCcw, CheckCircle2, Eye } from 'lucide-react';
import { ResumeTheme, ResumeAccent, VisibleSections } from './resumeTypes';
import { SiteSettings } from '../../types';

interface ResumeConfigPanelProps {
  settings: SiteSettings;
  activeTheme: ResumeTheme;
  onSelectTheme: (theme: ResumeTheme) => void;
  activeAccent: ResumeAccent;
  onSelectAccent: (accent: ResumeAccent) => void;
  visibleSections: VisibleSections;
  onToggleSection: (key: keyof VisibleSections) => void;
  disabledSkills: string[];
  onToggleSkill: (skill: string) => void;
  onRestoreAllSkills: () => void;
  onResetToDefault: () => void;
}

export const ResumeConfigPanel: React.FC<ResumeConfigPanelProps> = ({
  settings,
  activeTheme,
  onSelectTheme,
  activeAccent,
  onSelectAccent,
  visibleSections,
  onToggleSection,
  disabledSkills,
  onToggleSkill,
  onRestoreAllSkills,
  onResetToDefault,
}) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 md:p-6 space-y-5 no-print animate-fadeIn">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 flex items-center gap-2 font-mono">
          <SlidersHorizontal className="w-4 h-4 text-[#0084ff]" /> Resume Customizer &amp; ATS Tuner
        </h4>
        <button
          onClick={onResetToDefault}
          className="text-[11px] font-mono font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          <RefreshCcw className="w-3 h-3" /> Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* COLUMN 1: TYPOGRAPHY & ACCENT */}
        <div className="space-y-3">
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
            1. Typography &amp; Accent
          </label>
          
          {/* Fonts */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'sans', label: 'Neo Sans', sub: 'Inter UI' },
              { id: 'serif', label: 'Editorial', sub: 'Classic Serif' },
              { id: 'mono', label: 'Terminal', sub: 'Mono Tech' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTheme(t.id as ResumeTheme)}
                className={`p-2 rounded-xl text-center border text-xs font-semibold cursor-pointer transition-all ${
                  activeTheme === t.id
                    ? 'bg-white border-slate-900 text-slate-900 shadow-xs'
                    : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <div>{t.label}</div>
                <div className="text-[9px] text-slate-400 font-normal">{t.sub}</div>
              </button>
            ))}
          </div>

          {/* Accents */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Accent:</span>
            {[
              { id: 'blue', color: 'bg-[#0084ff]' },
              { id: 'indigo', color: 'bg-indigo-600' },
              { id: 'emerald', color: 'bg-emerald-600' },
              { id: 'slate', color: 'bg-slate-800' }
            ].map(acc => (
              <button
                key={acc.id}
                onClick={() => onSelectAccent(acc.id as ResumeAccent)}
                className={`w-6 h-6 rounded-full ${acc.color} transition-all cursor-pointer ${
                  activeAccent === acc.id ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                }`}
                title={`Select ${acc.id} accent`}
              />
            ))}
          </div>
        </div>

        {/* COLUMN 2: SECTION VISIBILITY */}
        <div className="space-y-3">
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
            2. Visible Sections
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { key: 'summary', label: 'Summary' },
              { key: 'skills', label: 'Skills Matrix' },
              { key: 'experience', label: 'Experience' },
              { key: 'projects', label: 'Projects' },
              { key: 'education', label: 'Education' },
              { key: 'certificates', label: 'Certifications' }
            ].map((s) => {
              const isVisible = visibleSections[s.key as keyof VisibleSections];
              return (
                <button
                  key={s.key}
                  onClick={() => onToggleSection(s.key as keyof VisibleSections)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    isVisible
                      ? 'bg-white border-blue-200 text-blue-900 shadow-2xs'
                      : 'bg-slate-100/70 border-slate-200 text-slate-400 line-through'
                  }`}
                >
                  <span>{s.label}</span>
                  {isVisible ? <CheckCircle2 className="w-3 h-3 text-[#0084ff]" /> : <Eye className="w-3 h-3 text-slate-300" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUMN 3: DESELECT SKILLS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
              3. Toggle Skills Visibility
            </label>
            {disabledSkills.length > 0 && (
              <button
                onClick={onRestoreAllSkills}
                className="text-[10px] font-mono text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Restore All ({disabledSkills.length} hidden)
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-white rounded-xl border border-slate-200 scrollbar-none">
            {settings.skills.flatMap(s => s.items).map((item, idx) => {
              const name = typeof item === 'string' ? item : item.name;
              const isHidden = disabledSkills.includes(name);
              return (
                <button
                  key={idx}
                  onClick={() => onToggleSkill(name)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    isHidden
                      ? 'bg-slate-100 text-slate-400 line-through'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
