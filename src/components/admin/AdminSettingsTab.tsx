import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Check, Database, RefreshCw, DownloadCloud, UploadCloud, 
  Shield, Briefcase, GraduationCap, ChevronUp, ChevronDown, Calendar, MapPin, 
  Building, BookOpen, Award, Sparkles, Globe, ExternalLink, FileCode, Search, Cpu 
} from 'lucide-react';
import { SiteSettings, Experience, Education } from '../../types';
import RichTextEditor from '../RichTextEditor';
import { getClientBaseUrl } from '../../lib/seo';
import { AdminProfilesTab } from './AdminProfilesTab';

export type SettingsSubTab = 'hero' | 'profiles' | 'experience' | 'education' | 'skills' | 'socials' | 'seo' | 'database';

interface AdminSettingsTabProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
  activeSubTab?: SettingsSubTab;
  onSubTabChange?: (tab: SettingsSubTab) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  onUpdateSettings,
  activeSubTab,
  onSubTabChange,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<SettingsSubTab>(activeSubTab || 'hero');

  useEffect(() => {
    if (activeSubTab) {
      setInternalSubTab(activeSubTab);
    }
  }, [activeSubTab]);

  const currentSubTab = activeSubTab || internalSubTab;

  const handleSelectSubTab = (tab: SettingsSubTab) => {
    setInternalSubTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };
  
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [sysMessage, setSysMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleBackup = async () => {
    setIsBackingUp(true);
    setSysMessage(null);
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setSysMessage({ text: 'Backup completed successfully!', type: 'success' });
      } else {
        setSysMessage({ text: data.error || 'Backup failed.', type: 'error' });
      }
    } catch (err: any) {
      setSysMessage({ text: err.message, type: 'error' });
    }
    setIsBackingUp(false);
  };

  const handleRestore = async () => {
    if (!window.confirm("⚠️ WARNING: This will overwrite your live Redis data with the contents of latest.json. Are you sure you want to proceed?")) {
      return;
    }
    setIsRestoring(true);
    setSysMessage(null);
    try {
      const response = await fetch('/api/admin/restore', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setSysMessage({ text: 'Restore completed successfully! Refresh the page to see updated data.', type: 'success' });
      } else {
        setSysMessage({ text: data.error || 'Restore failed.', type: 'error' });
      }
    } catch (err: any) {
      setSysMessage({ text: err.message, type: 'error' });
    }
    setIsRestoring(false);
  };

  // --- EXPERIENCE CRUD HANDLERS ---
  const handleAddExperience = () => {
    const nextExp: Experience[] = [
      ...(settings.experience || []),
      {
        role: 'Full Stack Engineer',
        company: 'Company Name',
        location: 'Remote / Hybrid',
        start_date: '2023',
        end_date: 'Present',
        is_current: true,
        description: 'Engineered web applications, automated test suites, and optimized Core Web Vitals.'
      }
    ];
    onUpdateSettings({ ...settings, experience: nextExp });
  };

  const handleUpdateExperience = (idx: number, updated: Partial<Experience>) => {
    const nextExp = [...(settings.experience || [])];
    nextExp[idx] = { ...nextExp[idx], ...updated };
    onUpdateSettings({ ...settings, experience: nextExp });
  };

  const handleRemoveExperience = (idx: number) => {
    const nextExp = (settings.experience || []).filter((_, i) => i !== idx);
    onUpdateSettings({ ...settings, experience: nextExp });
  };

  const handleMoveExperience = (idx: number, direction: 'up' | 'down') => {
    const nextExp = [...(settings.experience || [])];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= nextExp.length) return;
    const temp = nextExp[idx];
    nextExp[idx] = nextExp[targetIdx];
    nextExp[targetIdx] = temp;
    onUpdateSettings({ ...settings, experience: nextExp });
  };

  // --- EDUCATION CRUD HANDLERS ---
  const handleAddEducation = () => {
    const nextEdu: Education[] = [
      ...(settings.education || []),
      {
        institution: 'University / College Name',
        degree: 'B.Tech',
        field: 'Computer Science & Engineering',
        start_year: 2018,
        end_year: 2022,
        grade: '8.5 CGPA'
      }
    ];
    onUpdateSettings({ ...settings, education: nextEdu });
  };

  const handleUpdateEducation = (idx: number, updated: Partial<Education>) => {
    const nextEdu = [...(settings.education || [])];
    nextEdu[idx] = { ...nextEdu[idx], ...updated };
    onUpdateSettings({ ...settings, education: nextEdu });
  };

  const handleRemoveEducation = (idx: number) => {
    const nextEdu = (settings.education || []).filter((_, i) => i !== idx);
    onUpdateSettings({ ...settings, education: nextEdu });
  };

  const handleMoveEducation = (idx: number, direction: 'up' | 'down') => {
    const nextEdu = [...(settings.education || [])];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= nextEdu.length) return;
    const temp = nextEdu[idx];
    nextEdu[idx] = nextEdu[targetIdx];
    nextEdu[targetIdx] = temp;
    onUpdateSettings({ ...settings, education: nextEdu });
  };

  // --- SKILLS CRUD HANDLERS ---
  const handleAddCategory = () => {
    const nextSkills = [...(settings.skills || [])];
    nextSkills.push({ category: 'New Category', items: [] });
    onUpdateSettings({ ...settings, skills: nextSkills });
  };

  const handleUpdateCategory = (catIdx: number, newCategoryName: string) => {
    const nextSkills = [...(settings.skills || [])];
    if (!nextSkills[catIdx]) return;
    nextSkills[catIdx].category = newCategoryName;
    onUpdateSettings({ ...settings, skills: nextSkills });
  };

  const handleRemoveCategory = (catIdx: number) => {
    const nextSkills = [...(settings.skills || [])];
    nextSkills.splice(catIdx, 1);
    onUpdateSettings({ ...settings, skills: nextSkills });
  };

  const handleMoveCategory = (idx: number, direction: 'up' | 'down') => {
    const nextSkills = [...(settings.skills || [])];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= nextSkills.length) return;
    const temp = nextSkills[idx];
    nextSkills[idx] = nextSkills[targetIdx];
    nextSkills[targetIdx] = temp;
    onUpdateSettings({ ...settings, skills: nextSkills });
  };

  const handleSkillUpdate = (catIdx: number, itemIdx: number, newName: string) => {
    const nextSkills = [...(settings.skills || [])];
    if (!nextSkills[catIdx]) return;
    const target = nextSkills[catIdx].items[itemIdx];
    if (typeof target === 'string') {
      nextSkills[catIdx].items[itemIdx] = { name: newName };
    } else {
      nextSkills[catIdx].items[itemIdx] = { ...target, name: newName };
    }
    onUpdateSettings({ ...settings, skills: nextSkills });
  };

  const handleAddSkill = (catIdx: number) => {
    const nextSkills = [...(settings.skills || [])];
    if (!nextSkills[catIdx]) return;
    nextSkills[catIdx].items.push({ name: 'New Skill' });
    onUpdateSettings({ ...settings, skills: nextSkills });
  };

  const handleRemoveSkill = (catIdx: number, itemIdx: number) => {
    const nextSkills = [...(settings.skills || [])];
    if (!nextSkills[catIdx]) return;
    nextSkills[catIdx].items.splice(itemIdx, 1);
    onUpdateSettings({ ...settings, skills: nextSkills });
  };

  const isStandaloneSection = ['profiles', 'experience', 'education', 'skills'].includes(currentSubTab);

  if (isStandaloneSection) {
    return (
      <div className="space-y-6 animate-fade-in text-left">
        {/* Settings Sub-Tab: Profiles & Domains Manager */}
        {currentSubTab === 'profiles' && (
          <AdminProfilesTab
            settings={settings}
            onUpdateSettings={onUpdateSettings}
          />
        )}

        {/* Settings Sub-Tab: Work Experience Timeline */}
        {currentSubTab === 'experience' && (
          <div className="space-y-5 animate-fade-in text-left font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-150">
              <div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest font-mono">Work Experience Timeline</h4>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {(settings.experience || []).length} Recorded
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Positions and roles configured here dynamically sync across the Overview timeline, Resume Hub document, and ATS exports.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddExperience}
                className="px-3.5 py-2 text-xs font-bold bg-primary hover:bg-primary-dark text-white rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>

            {(!settings.experience || settings.experience.length === 0) ? (
              <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-3">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No work experience entries configured yet.</p>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-4 py-2 text-xs font-bold text-primary bg-blue-50 hover:bg-blue-100 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add First Experience Entry
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {settings.experience.map((exp, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 transition-all hover:border-slate-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 truncate">
                          {exp.role || 'Untitled Role'} {exp.company ? `@ ${exp.company}` : ''}
                        </h5>
                        {exp.is_current && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveExperience(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveExperience(idx, 'down')}
                          disabled={idx === settings.experience.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(idx)}
                          className="p-1 text-rose-400 hover:text-rose-600 rounded ml-1 cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block">Role Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleUpdateExperience(idx, { role: e.target.value })}
                          placeholder="e.g. Technical Product Manager"
                          className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block">Company / Organization</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(idx, { company: e.target.value })}
                          placeholder="e.g. Quality Matrix Labs"
                          className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block">Location</label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => handleUpdateExperience(idx, { location: e.target.value })}
                          placeholder="e.g. New Delhi, India"
                          className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block">Start Date / Year</label>
                        <input
                          type="text"
                          value={exp.start_date || ''}
                          onChange={(e) => handleUpdateExperience(idx, { start_date: e.target.value })}
                          placeholder="e.g. 2024 or Jan 2024"
                          className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block">End Date</label>
                        <input
                          type="text"
                          disabled={exp.is_current}
                          value={exp.is_current ? 'Present' : (exp.end_date || '')}
                          onChange={(e) => handleUpdateExperience(idx, { end_date: e.target.value })}
                          placeholder={exp.is_current ? 'Present' : 'e.g. 2026'}
                          className="w-full px-3 py-2 text-xs bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 focus:bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden"
                        />
                      </div>

                      <div className="flex items-center pt-5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.is_current || false}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              handleUpdateExperience(idx, {
                                is_current: checked,
                                end_date: checked ? 'Present' : (exp.end_date === 'Present' ? '' : exp.end_date)
                              });
                            }}
                            className="rounded text-primary focus:ring-primary h-4 w-4"
                          />
                          Currently Working Here
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block">Description & Key Contributions</label>
                      <textarea
                        value={exp.description}
                        rows={3}
                        placeholder="Detail major architectural achievements, metrics, team scope, technologies used..."
                        onChange={(e) => handleUpdateExperience(idx, { description: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800 leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Sub-Tab: Academic History & Foundations */}
        {currentSubTab === 'education' && (
          <div className="space-y-5 animate-fade-in text-left font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-150">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest font-mono">Academic Background &amp; Education</h4>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {(settings.education || []).length} Degrees
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Degrees, fields of study, institutions, and grades displayed on the Overview Academic Timeline and Resume Hub.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddEducation}
                className="px-3.5 py-2 text-xs font-bold bg-primary hover:bg-primary-dark text-white rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Academic Record
              </button>
            </div>

            {(!settings.education || settings.education.length === 0) ? (
              <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-3">
                <GraduationCap className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No education records configured yet.</p>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-4 py-2 text-xs font-bold text-primary bg-blue-50 hover:bg-blue-100 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add First Degree
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {settings.education.map((edu, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 transition-all hover:border-slate-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 truncate">
                          {edu.degree} in {edu.field} <span className="text-slate-400 font-normal">({edu.start_year || '—'} – {edu.end_year || 'Present'})</span>
                        </h5>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveEducation(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveEducation(idx, 'down')}
                          disabled={idx === settings.education.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveEducation(idx)}
                          className="p-1 text-rose-400 hover:text-rose-600 rounded ml-1 cursor-pointer"
                          title="Delete degree"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block">Degree / Credential</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleUpdateEducation(idx, { degree: e.target.value })}
                          placeholder="e.g. MBA or B.Tech"
                          className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-1 lg:col-span-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block">Field of Study / Specialization</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => handleUpdateEducation(idx, { field: e.target.value })}
                          placeholder="e.g. Product Management or Computer Science & Engineering"
                          className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block">Institution / University / School</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleUpdateEducation(idx, { institution: e.target.value })}
                          placeholder="e.g. DY Patil University"
                          className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block">Start Year</label>
                        <input
                          type="number"
                          value={edu.start_year || ''}
                          onChange={(e) => handleUpdateEducation(idx, { start_year: parseInt(e.target.value, 10) || 0 })}
                          placeholder="e.g. 2024"
                          className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block">End Year (Optional / Blank if Ongoing)</label>
                        <input
                          type="number"
                          value={edu.end_year || ''}
                          onChange={(e) => handleUpdateEducation(idx, { end_year: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                          placeholder="e.g. 2026"
                          className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block">Grade / CGPA / Value</label>
                        <input
                          type="text"
                          value={edu.grade || ''}
                          onChange={(e) => handleUpdateEducation(idx, { grade: e.target.value })}
                          placeholder="e.g. 8.4 CGPA or First Class"
                          className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Sub-Tab: Skills configuration */}
        {currentSubTab === 'skills' && (
          <div className="space-y-6 animate-fade-in text-left font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-150">
              <div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest font-mono">Tech Competencies</h4>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {(settings.skills || []).length} Categories
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Live edit your tech competencies tags below. These updates refresh seamlessly on the landing page grids.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-3.5 py-2 text-xs font-bold bg-primary hover:bg-primary-dark text-white rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            {(!settings.skills || settings.skills.length === 0) ? (
              <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-3">
                <Cpu className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No skill categories configured yet.</p>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 text-xs font-bold text-primary bg-blue-50 hover:bg-blue-100 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add First Category
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {settings.skills.map((cat, catIdx) => (
                  <div key={catIdx} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 transition-all hover:border-slate-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 w-full max-w-sm">
                        <span className="w-6 h-6 shrink-0 rounded-lg bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center">
                          {catIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={cat.category}
                          onChange={(e) => handleUpdateCategory(catIdx, e.target.value)}
                          placeholder="Category Name (e.g. Frontend, Languages)"
                          className="flex-1 px-3 py-1.5 text-sm font-bold text-slate-800 bg-slate-50 focus:bg-white border border-transparent focus:border-slate-300 rounded-lg focus:outline-hidden transition-colors"
                        />
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveCategory(catIdx, 'up')}
                          disabled={catIdx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveCategory(catIdx, 'down')}
                          disabled={catIdx === settings.skills.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(catIdx)}
                          className="p-1 text-rose-400 hover:text-rose-600 rounded ml-1 cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {cat.items.map((skill, itemIdx) => {
                        const skillName = typeof skill === 'string' ? skill : skill.name;
                        
                        return (
                          <div key={itemIdx} className="bg-slate-50 rounded-xl border border-slate-200 p-2 space-y-2 flex flex-col justify-between group/skill relative transition-shadow hover:shadow-xs focus-within:bg-white focus-within:border-primary">
                            <div className="relative pr-6">
                              <input
                                type="text"
                                value={skillName}
                                onChange={(e) => handleSkillUpdate(catIdx, itemIdx, e.target.value)}
                                className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-hidden"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(catIdx, itemIdx)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-rose-500 rounded cursor-pointer transition-colors"
                                title="Delete skill"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => handleAddSkill(catIdx)}
                        className="min-h-[38px] px-3 py-1.5 border border-dashed border-slate-300 text-slate-500 hover:text-slate-800 hover:border-slate-400 hover:bg-slate-50 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add Skill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Live settings Control</h3>
        <p className="text-xs text-slate-400 mt-0.5">Instantly update bio descriptions, timelines and custom social coordinates.</p>
      </div>

      {/* Sub-tabs header - strictly settings-specific (no duplicates) */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 pb-1.5 font-sans">
        {[
          { label: 'Hero & Summary', value: 'hero' },
          { label: 'Social connections', value: 'socials' },
          { label: 'Domain & SEO', value: 'seo' },
          { label: 'Database & Security', value: 'database' }
        ].map((st) => (
          <button
            key={st.value}
            type="button"
            onClick={() => handleSelectSubTab(st.value as SettingsSubTab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              currentSubTab === st.value
                ? 'bg-primary-light text-primary font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Settings Sub-Tab: Hero Context */}
      {currentSubTab === 'hero' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="set-name" className="text-xs font-bold text-slate-505 block">Profile Name</label>
              <input
                id="set-name"
                type="text"
                value={settings.hero_name}
                onChange={(e) => onUpdateSettings({ ...settings, hero_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="set-tagline" className="text-xs font-bold text-slate-505 block">
                Display Tagline / Typewriter Roles
              </label>
              <input
                id="set-tagline"
                type="text"
                value={settings.hero_tagline || ''}
                placeholder="e.g. Technical Product Manager, Full-Stack Developer, Technical SEO, IT Support"
                onChange={(e) => onUpdateSettings({ ...settings, hero_tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
              />
              <p className="text-[11px] text-slate-400">
                Directly controls the hero animated typewriter. Enter a single tagline or comma-separated roles to rotate through.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="set-brand-name" className="text-xs font-bold text-slate-505 block">Brand / Studio Name</label>
              <input
                id="set-brand-name"
                type="text"
                value={settings.company_name || 'QM Labs'}
                onChange={(e) => onUpdateSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
                placeholder="e.g. QM Labs"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="set-brand-tagline" className="text-xs font-bold text-slate-505 block">Brand Tagline</label>
              <input
                id="set-brand-tagline"
                type="text"
                value={settings.company_tagline || 'Quality Builds Trust. Momentum Drives Growth.'}
                onChange={(e) => onUpdateSettings({ ...settings, company_tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
                placeholder="e.g. Quality Builds Trust."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="set-profile-img" className="text-xs font-bold text-slate-505 block">Profile Image URL</label>
              <input
                id="set-profile-img"
                type="text"
                value={settings.profile_image_url || ''}
                onChange={(e) => onUpdateSettings({ ...settings, profile_image_url: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="set-logo-img" className="text-xs font-bold text-slate-505 block">Logo Image URL</label>
              <input
                id="set-logo-img"
                type="text"
                value={settings.logo_url || ''}
                onChange={(e) => onUpdateSettings({ ...settings, logo_url: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="set-resume-pdf" className="text-xs font-bold text-slate-505 block">Resume PDF Link</label>
              <input
                id="set-resume-pdf"
                type="text"
                value={settings.resume_storage_path || ''}
                onChange={(e) => onUpdateSettings({ ...settings, resume_storage_path: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
                placeholder="https://.../resume.pdf"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="set-location" className="text-xs font-bold text-slate-505 block">Base Location</label>
              <input
                id="set-location"
                type="text"
                value={settings.contact_location || ''}
                placeholder="e.g. New Delhi, India"
                onChange={(e) => onUpdateSettings({ ...settings, contact_location: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="set-contact-email" className="text-xs font-bold text-slate-505 block">Contact Email</label>
              <input
                id="set-contact-email"
                type="email"
                value={settings.contact_email || ''}
                placeholder="e.g. rajat.pilgrimpackages@gmail.com"
                onChange={(e) => onUpdateSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="set-contact-phone" className="text-xs font-bold text-slate-505 block">Phone / WhatsApp</label>
              <input
                id="set-contact-phone"
                type="text"
                value={settings.contact_phone || ''}
                placeholder="e.g. +91 8984550754"
                onChange={(e) => onUpdateSettings({ ...settings, contact_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
              />
            </div>
          </div>

          {/* Dynamic Stats Configuration */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700">Hero Micro-Stats (Top Right)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(settings.hero_stats || []).map((stat, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>Stat #{idx + 1}</span>
                  </div>
                  <input
                    type="text"
                    value={stat.label}
                    placeholder="Label (e.g. Experience)"
                    onChange={(e) => {
                      const next = [...(settings.hero_stats || [])];
                      next[idx] = { ...stat, label: e.target.value };
                      onUpdateSettings({ ...settings, hero_stats: next });
                    }}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs"
                  />
                  <input
                    type="text"
                    value={stat.value}
                    placeholder="Value (e.g. 3+ Years)"
                    onChange={(e) => {
                      const next = [...(settings.hero_stats || [])];
                      next[idx] = { ...stat, value: e.target.value };
                      onUpdateSettings({ ...settings, hero_stats: next });
                    }}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-black"
                  />
                  <input
                    type="text"
                    value={stat.subtext}
                    placeholder="Subtext (e.g. Production Eng)"
                    onChange={(e) => {
                      const next = [...(settings.hero_stats || [])];
                      next[idx] = { ...stat, subtext: e.target.value };
                      onUpdateSettings({ ...settings, hero_stats: next });
                    }}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px]"
                  />
                </div>
              ))}
            </div>
            
            <h4 className="text-xs font-bold text-slate-700 mt-4">Overview Bottom Stat (Fourth slot)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl space-y-2">
                  <input
                    type="text"
                    value={settings.overview_fourth_stat?.label || ''}
                    placeholder="Label (e.g. TryHackMe Context Rank)"
                    onChange={(e) => {
                      onUpdateSettings({ 
                        ...settings, 
                        overview_fourth_stat: { ...settings.overview_fourth_stat, label: e.target.value }
                      });
                    }}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs"
                  />
                  <input
                    type="text"
                    value={settings.overview_fourth_stat?.value || ''}
                    placeholder="Value (e.g. Top 9%)"
                    onChange={(e) => {
                      onUpdateSettings({ 
                        ...settings, 
                        overview_fourth_stat: { ...settings.overview_fourth_stat, value: e.target.value }
                      });
                    }}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-black"
                  />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="set-bio" className="text-xs font-bold text-slate-505 block">Hero Synopsis bio</label>
            <textarea
              id="set-bio"
              value={settings.hero_bio}
              onChange={(e) => onUpdateSettings({ ...settings, hero_bio: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800 resize-none"
            />
          </div>

          <div className="space-y-1 px-1">
            <label className="text-xs font-bold text-slate-500 block mb-1 font-sans">Detailed About paragraph (Rich Text Editor)</label>
            <RichTextEditor
              value={settings.about_text}
              onChange={(val) => onUpdateSettings({ ...settings, about_text: val })}
              placeholder="Write rich formatted bios outlines..."
            />
          </div>
        </div>
      )}

      {/* Settings Sub-Tab: Social Coordinates */}
      {currentSubTab === 'socials' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="soc-git" className="text-xs font-bold text-slate-550 block">GitHub Profile</label>
              <input
                id="soc-git"
                type="text"
                value={settings.social_links.github || ''}
                onChange={(e) => onUpdateSettings({ ...settings, social_links: { ...settings.social_links, github: e.target.value } })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="soc-link" className="text-xs font-bold text-slate-550 block">LinkedIn Profile</label>
              <input
                id="soc-link"
                type="text"
                value={settings.social_links.linkedin || ''}
                onChange={(e) => onUpdateSettings({ ...settings, social_links: { ...settings.social_links, linkedin: e.target.value } })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="soc-twit" className="text-xs font-bold text-slate-550 block">Twitter Profile</label>
              <input
                id="soc-twit"
                type="text"
                value={settings.social_links.twitter || ''}
                onChange={(e) => onUpdateSettings({ ...settings, social_links: { ...settings.social_links, twitter: e.target.value } })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="soc-inst" className="text-xs font-bold text-slate-550 block">Instagram Profile</label>
              <input
                id="soc-inst"
                type="text"
                value={settings.social_links.instagram || ''}
                onChange={(e) => onUpdateSettings({ ...settings, social_links: { ...settings.social_links, instagram: e.target.value } })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* Settings Sub-Tab: Maps & Index */}
      {currentSubTab === 'seo' && (
        <div className="space-y-6 animate-fade-in text-left">
          {/* DYNAMIC DOMAIN & SEO INFRASTRUCTURE CARD */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 border border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">Dynamic Domain & SEO Engine</h4>
                  <p className="text-xs text-slate-400">Configure your upcoming custom domain. Robots, Sitemap, and Schema adapt automatically.</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${
                settings.custom_domain
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${settings.custom_domain ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`} />
                {settings.custom_domain ? 'Custom Domain Set' : 'Auto-Resolving Host'}
              </span>
            </div>

            <div className="space-y-1.5 pt-2">
              <label htmlFor="custom-domain-field" className="text-xs font-bold text-slate-300 block">
                Primary Custom Domain
              </label>
              <div className="relative">
                <input
                  id="custom-domain-field"
                  type="text"
                  placeholder="e.g. rajatkumar.dev or rajatdash.com"
                  value={settings.custom_domain || ''}
                  onChange={(e) => onUpdateSettings({ ...settings, custom_domain: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-800/80 border border-slate-600 focus:border-blue-400 rounded-xl focus:outline-hidden text-white font-mono placeholder:text-slate-500"
                />
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                When you purchase your domain, enter it here (e.g. <code>rajatkumar.dev</code>). The backend immediately serves all canonical links, <code>sitemap.xml</code>, <code>robots.txt</code>, and Schema.org JSON-LD under your new domain with zero downtime.
              </p>
            </div>

            {/* LIVE URL DIAGNOSTICS & VERIFICATION */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
                  <span>Resolved Base URL</span>
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xs font-mono text-white truncate" title={getClientBaseUrl(settings)}>
                  {getClientBaseUrl(settings)}
                </div>
              </div>

              <a
                href={`${getClientBaseUrl(settings)}/sitemap.xml`}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800/60 hover:bg-slate-700/60 transition border border-slate-700/80 rounded-xl p-3 space-y-1 group block"
              >
                <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
                  <span>Dynamic Sitemap</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="text-xs font-mono text-blue-400 truncate">
                  /sitemap.xml
                </div>
              </a>

              <a
                href={`${getClientBaseUrl(settings)}/robots.txt`}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800/60 hover:bg-slate-700/60 transition border border-slate-700/80 rounded-xl p-3 space-y-1 group block"
              >
                <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
                  <span>Dynamic Robots</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="text-xs font-mono text-blue-400 truncate">
                  /robots.txt
                </div>
              </a>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 flex items-start gap-2 text-[11px] text-slate-300">
              <FileCode className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong>Dynamic JSON-LD Schema:</strong> Auto-generates structured microdata for <code>Person</code> (including MBA in Product Management &amp; B.Tech Computer Science), <code>WebSite</code>, <code>ProfilePage</code>, and <code>BlogPosting</code> for Google Rich Snippets.
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="seo-title-field" className="text-xs font-bold text-slate-550 block">Canonical Home Title</label>
            <input
              id="seo-title-field"
              type="text"
              value={settings.seo_home_title || ''}
              onChange={(e) => onUpdateSettings({ ...settings, seo_home_title: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="seo-desc-field" className="text-xs font-bold text-slate-550 block">Home SEO Description</label>
            <textarea
              id="seo-desc-field"
              value={settings.seo_home_description || ''}
              onChange={(e) => onUpdateSettings({ ...settings, seo_home_description: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800 resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="seo-keys-field" className="text-xs font-bold text-slate-550 block">Home SEO Keywords (Comma Separated)</label>
            <input
              id="seo-keys-field"
              type="text"
              value={settings.seo_home_keywords || ''}
              onChange={(e) => onUpdateSettings({ ...settings, seo_home_keywords: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="seo-og-field" className="text-xs font-bold text-slate-550 block">Global OG Image URL (Social Share)</label>
            <input
              id="seo-og-field"
              type="text"
              value={settings.seo_og_image_url || ''}
              onChange={(e) => onUpdateSettings({ ...settings, seo_og_image_url: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="maps-field" className="text-xs font-bold text-slate-550 block">Google Maps Embed URL</label>
            <textarea
              id="maps-field"
              value={settings.google_maps_embed_url}
              onChange={(e) => onUpdateSettings({ ...settings, google_maps_embed_url: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800 font-mono resize-none"
            />
          </div>
        </div>
      )}
      
      {currentSubTab === 'database' && (
        <div className="space-y-6 animate-fade-in text-left">
          {sysMessage && (
            <div className={`p-4 rounded-2xl border flex items-start gap-2.5 text-xs ${
              sysMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
            }`}>
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{sysMessage.text}</span>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-slate-600" />
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Site Availability</h4>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">Under Maintenance Mode</p>
                <p className="text-xs text-slate-500">When enabled, visitors will see a maintenance page. You can still access the admin panel.</p>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, is_under_maintenance: !settings.is_under_maintenance })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${settings.is_under_maintenance ? 'bg-rose-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.is_under_maintenance ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-slate-600" />
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Database Tools & Security</h4>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={handleBackup} 
                    disabled={isBackingUp || isRestoring}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    {isBackingUp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                    Backup Data to JSON
                  </button>
                  
                  <button 
                    onClick={handleRestore} 
                    disabled={isBackingUp || isRestoring}
                    className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    {isRestoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    Restore from JSON
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-4 leading-relaxed max-w-2xl">
                  <strong>Backup</strong> queries Redis and saves local JSON files to <code className="bg-slate-200 px-1 py-0.5 rounded">.data/backups/</code>.<br/>
                  <strong>Restore</strong> reads <code className="bg-slate-200 px-1 py-0.5 rounded">latest.json</code> and forcefully overwrites your live Redis database. Use with caution.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom notifications */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2.5">
        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <span>Success! Site settings are dynamically tracked in standard localStorage and sync immediately across components.</span>
      </div>
    </div>
  );
};
