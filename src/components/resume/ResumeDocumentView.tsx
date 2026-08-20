import React from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { 
  ResumePersona, ResumeTheme, ResumeAccent, VisibleSections, 
  EditableContactDetails 
} from './resumeTypes';
import { Skill, Experience, Education, Project, Certificate } from '../../types';

interface ResumeDocumentViewProps {
  isEditable: boolean;
  onExitEdit: () => void;
  activeTheme: ResumeTheme;
  activeAccent: ResumeAccent;
  selectedPersona: ResumePersona;
  contactDetails: EditableContactDetails;
  onUpdateContactDetails: (details: Partial<EditableContactDetails>) => void;
  customTitles: Record<ResumePersona, string>;
  onUpdateCustomTitle: (persona: ResumePersona, title: string) => void;
  customSummaries: Record<ResumePersona, string>;
  onUpdateCustomSummary: (persona: ResumePersona, summary: string) => void;
  visibleSections: VisibleSections;
  activeSkills: Skill[];
  activeExperience: Experience[];
  activeProjects: Project[];
  education: Education[];
  activeCertificates: Certificate[];
  onToggleSkill: (skill: string) => void;
}

export const ResumeDocumentView: React.FC<ResumeDocumentViewProps> = ({
  isEditable,
  onExitEdit,
  activeTheme,
  activeAccent,
  selectedPersona,
  contactDetails,
  onUpdateContactDetails,
  customTitles,
  onUpdateCustomTitle,
  customSummaries,
  onUpdateCustomSummary,
  visibleSections,
  activeSkills,
  activeExperience,
  activeProjects,
  education,
  activeCertificates,
  onToggleSkill,
}) => {
  const getThemeFontClass = () => {
    switch (activeTheme) {
      case 'serif':
        return 'font-serif tracking-normal text-slate-900 leading-relaxed';
      case 'mono':
        return 'font-mono tracking-tight text-slate-900 text-xs leading-relaxed';
      default:
        return 'font-sans tracking-tight text-slate-900 leading-normal';
    }
  };

  const getAccentBorderClass = () => {
    switch (activeAccent) {
      case 'indigo': return 'border-indigo-600';
      case 'emerald': return 'border-emerald-600';
      case 'slate': return 'border-slate-800';
      default: return 'border-[#0084ff]';
    }
  };

  const getAccentTextClass = () => {
    switch (activeAccent) {
      case 'indigo': return 'text-indigo-600';
      case 'emerald': return 'text-emerald-600';
      case 'slate': return 'text-slate-800';
      default: return 'text-[#0084ff]';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* EDIT MODE BANNER */}
      {isEditable && (
        <div className="bg-indigo-50 border-b border-indigo-200 px-6 py-2 flex items-center justify-between text-indigo-900 text-xs font-semibold no-print">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
            Live Edit Mode: Click on any text, title, or field below to make live edits before exporting.
          </span>
          <button
            onClick={onExitEdit}
            className="text-[11px] font-bold text-indigo-700 hover:text-indigo-950 underline cursor-pointer"
          >
            Done Editing
          </button>
        </div>
      )}

      {/* RESUME DOCUMENT CONTAINER */}
      <div className={`p-8 sm:p-12 md:p-14 print:p-0 ${getThemeFontClass()} print-page`}>
        
        {/* HEADER / CONTACT INFO */}
        <div className={`border-b-2 ${getAccentBorderClass()} pb-6 mb-6`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            
            {/* Name & Title */}
            <div className="space-y-1">
              {isEditable ? (
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-indigo-600 uppercase block">Candidate Name</label>
                  <input
                    type="text"
                    value={contactDetails.name}
                    onChange={(e) => onUpdateContactDetails({ name: e.target.value })}
                    className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight border border-indigo-300 rounded-lg px-2 py-1 w-full bg-indigo-50/40"
                  />
                </div>
              ) : (
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                  {contactDetails.name}
                </h1>
              )}

              {isEditable ? (
                <div className="space-y-1 pt-1">
                  <label className="text-[9px] font-mono font-bold text-indigo-600 uppercase block">Target Designation</label>
                  <input
                    type="text"
                    value={customTitles[selectedPersona]}
                    onChange={(e) => onUpdateCustomTitle(selectedPersona, e.target.value)}
                    className="text-xs font-bold text-slate-700 uppercase tracking-wider border border-indigo-300 rounded-lg px-2 py-1 w-full bg-indigo-50/40"
                  />
                </div>
              ) : (
                <p className={`text-xs font-extrabold uppercase tracking-widest ${getAccentTextClass()}`}>
                  {customTitles[selectedPersona]}
                </p>
              )}
            </div>

            {/* Contact Coordinates */}
            <div className="text-xs text-slate-600 space-y-1 sm:text-right flex-shrink-0">
              {isEditable ? (
                <div className="space-y-1 bg-slate-50 border border-indigo-200 rounded-xl p-2.5 text-left sm:text-right">
                  <input
                    type="text"
                    value={contactDetails.location}
                    onChange={(e) => onUpdateContactDetails({ location: e.target.value })}
                    placeholder="Location"
                    className="w-full text-[10px] px-2 py-0.5 border rounded bg-white"
                  />
                  <input
                    type="text"
                    value={contactDetails.phone}
                    onChange={(e) => onUpdateContactDetails({ phone: e.target.value })}
                    placeholder="Phone"
                    className="w-full text-[10px] px-2 py-0.5 border rounded bg-white"
                  />
                  <input
                    type="text"
                    value={contactDetails.email}
                    onChange={(e) => onUpdateContactDetails({ email: e.target.value })}
                    placeholder="Email"
                    className="w-full text-[10px] px-2 py-0.5 border rounded bg-white"
                  />
                  <input
                    type="text"
                    value={contactDetails.github}
                    onChange={(e) => onUpdateContactDetails({ github: e.target.value })}
                    placeholder="GitHub"
                    className="w-full text-[10px] px-2 py-0.5 border rounded bg-white"
                  />
                  <input
                    type="text"
                    value={contactDetails.linkedin}
                    onChange={(e) => onUpdateContactDetails({ linkedin: e.target.value })}
                    placeholder="LinkedIn"
                    className="w-full text-[10px] px-2 py-0.5 border rounded bg-white"
                  />
                </div>
              ) : (
                <div className="space-y-0.5 text-[11px] font-sans">
                  <div className="flex items-center gap-1.5 sm:justify-end text-slate-600">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span>{contactDetails.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:justify-end text-slate-600">
                    <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span>{contactDetails.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:justify-end text-slate-600">
                    <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <a href={`mailto:${contactDetails.email}`} className="text-slate-800 hover:text-[#0084ff] font-medium">{contactDetails.email}</a>
                  </div>
                  <div className="flex items-center gap-2 pt-1 sm:justify-end text-[10px] font-mono text-slate-500 no-print">
                    <a href={`https://${contactDetails.github}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-0.5">
                      GitHub <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <span>•</span>
                    <a href={`https://${contactDetails.linkedin}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-0.5">
                      LinkedIn <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <span>•</span>
                    <a href={`https://${contactDetails.portfolio}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-0.5">
                      Portfolio <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 1: EXECUTIVE PROFILE SUMMARY */}
        {visibleSections.summary && (
          <div className="mb-6">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2 font-mono flex items-center justify-between">
              <span>Professional Executive Summary</span>
              {isEditable && <span className="text-[9px] text-indigo-600">EDITABLE</span>}
            </h2>
            {isEditable ? (
              <textarea
                value={customSummaries[selectedPersona]}
                onChange={(e) => onUpdateCustomSummary(selectedPersona, e.target.value)}
                className="w-full text-xs text-slate-700 p-2.5 bg-indigo-50/40 border border-indigo-300 rounded-xl leading-relaxed min-h-[90px]"
              />
            ) : (
              <p className="text-xs text-slate-700 leading-relaxed text-justify">
                {customSummaries[selectedPersona]}
              </p>
            )}
          </div>
        )}

        {/* SECTION 2: TECHNICAL COMPETENCIES */}
        {visibleSections.skills && activeSkills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2.5 font-mono">
              Core Technical Competencies &amp; Toolkit
            </h2>
            <div className="space-y-2">
              {activeSkills.map((categoryObj, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-3 text-xs">
                  <span className="font-bold text-slate-800 font-mono text-[11px] md:text-right">
                    {categoryObj.category}:
                  </span>
                  <div className="md:col-span-3 flex flex-wrap gap-1">
                    {categoryObj.items.map((skill, sIdx) => {
                      const skillName = typeof skill === 'string' ? skill : skill.name;
                      return (
                        <span
                          key={sIdx}
                          onClick={() => isEditable && onToggleSkill(skillName)}
                          className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                            isEditable
                              ? 'bg-indigo-50 border border-indigo-200 text-indigo-800 cursor-pointer hover:bg-indigo-100'
                              : 'bg-slate-100/80 text-slate-800 print:bg-transparent print:p-0'
                          }`}
                          title={isEditable ? 'Click to toggle hide' : ''}
                        >
                          {skillName}{sIdx < categoryObj.items.length - 1 ? ',' : ''}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: WORK HISTORY & EXPERIENCE */}
        {visibleSections.experience && activeExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3 font-mono">
              Professional Experience &amp; Impact
            </h2>
            <div className="space-y-4">
              {activeExperience.map((exp, idx) => (
                <div key={idx} className="relative pl-3.5 border-l-2 border-slate-200 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                    <div className="text-xs font-extrabold text-slate-900">
                      {exp.role} · <span className={getAccentTextClass()}>{exp.company}</span>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-500">
                      {exp.start_date} – {exp.end_date || 'Present'} | {exp.location}
                    </div>
                  </div>
                  <p className="text-xs text-slate-650 leading-relaxed text-justify">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: NOTABLE PROJECTS */}
        {visibleSections.projects && activeProjects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3 font-mono">
              Flagship Projects &amp; Software Deliverables
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeProjects.map((proj) => (
                <div key={proj.id} className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl space-y-1.5 print:bg-transparent print:border-none print:p-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 truncate">{proj.title}</h3>
                    {proj.technologies && proj.technologies[0] && (
                      <span className="text-[9px] font-mono uppercase bg-blue-50 text-[#0084ff] px-1.5 py-0.5 rounded font-bold">
                        {proj.technologies[0]}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[9px] font-mono text-slate-500 truncate">
                      Stack: {proj.technologies.slice(0, 3).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: ACADEMIC BACKGROUND */}
        {visibleSections.education && education && (
          <div className="mb-6">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3 font-mono">
              Academic Accreditations &amp; Foundations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {education.map((edu, idx) => (
                <div key={idx} className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl space-y-0.5 print:bg-transparent print:border-none print:p-0">
                  <div className="text-xs font-bold text-slate-900">{edu.degree} in {edu.field}</div>
                  <div className="text-[11px] text-slate-600">{edu.institution}</div>
                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                    <span className="font-bold text-[#0084ff]">Status: {edu.grade || 'Validated'}</span>
                    <span>{edu.start_year} – {edu.end_year || 'Ongoing'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: VERIFIED CERTIFICATIONS */}
        {visibleSections.certificates && activeCertificates.length > 0 && (
          <div>
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2 font-mono">
              Verified Credentials &amp; Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {activeCertificates.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-150 print:bg-transparent print:border-none print:p-0">
                  <span className="font-semibold text-slate-800 text-[11px] truncate">{cert.title}</span>
                  <span className="text-[10px] font-mono text-slate-500 flex-shrink-0 ml-2">{cert.issuer} ({cert.issue_date})</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
