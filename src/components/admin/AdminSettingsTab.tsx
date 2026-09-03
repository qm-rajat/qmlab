import React, { useState } from 'react';
import { 
  Plus, Trash2, Check, Database, RefreshCw, DownloadCloud, UploadCloud, 
  Shield, Briefcase, GraduationCap, ChevronUp, ChevronDown, Calendar, MapPin, 
  Building, BookOpen, Award, Sparkles 
} from 'lucide-react';
import { SiteSettings, Experience, Education } from '../../types';
import RichTextEditor from '../RichTextEditor';

interface AdminSettingsTabProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [settingsSubTab, setSettingsSubTab] = useState<'hero' | 'experience' | 'education' | 'company' | 'skills' | 'socials' | 'seo' | 'database'>('hero');
  
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

  const handleSkillUpdate = (catIdx: number, itemIdx: number, newName: string) => {
    const nextSkills = [...settings.skills];
    const target = nextSkills[catIdx].items[itemIdx];
    if (typeof target === 'string') {
      nextSkills[catIdx].items[itemIdx] = { name: newName };
    } else {
      nextSkills[catIdx].items[itemIdx] = { ...target, name: newName };
    }
    onUpdateSettings({ ...settings, skills: nextSkills });
  };

  const handleAddSkill = (catIdx: number) => {
    const nextSkills = [...settings.skills];
    nextSkills[catIdx].items.push({ name: 'New Skill' });
    onUpdateSettings({ ...settings, skills: nextSkills });
  };

  const handleRemoveSkill = (catIdx: number, itemIdx: number) => {
    const nextSkills = [...settings.skills];
    nextSkills[catIdx].items.splice(itemIdx, 1);
    onUpdateSettings({ ...settings, skills: nextSkills });
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Live settings Control</h3>
        <p className="text-xs text-slate-400 mt-0.5">Instantly update bio descriptions, timelines and custom social coordinates.</p>
      </div>

      {/* Sub-tabs header */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 pb-1.5 font-sans">
        {[
          { label: 'Hero & Summary', value: 'hero' },
          { label: 'Work Experience', value: 'experience' },
          { label: 'Academic History', value: 'education' },
          { label: 'Company Profile', value: 'company' },
          { label: 'Skills lists', value: 'skills' },
          { label: 'Social connections', value: 'socials' },
          { label: 'Map / Meta', value: 'seo' },
          { label: 'Database & Security', value: 'database' }
        ].map((st) => (
          <button
            key={st.value}
            type="button"
            onClick={() => setSettingsSubTab(st.value as any)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              settingsSubTab === st.value
                ? 'bg-primary-light text-primary font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Settings Sub-Tab: Hero Context */}
      {settingsSubTab === 'hero' && (
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
              <label htmlFor="set-tagline" className="text-xs font-bold text-slate-505 block">Display Tagline</label>
              <input
                id="set-tagline"
                type="text"
                value={settings.hero_tagline}
                onChange={(e) => onUpdateSettings({ ...settings, hero_tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="set-location" className="text-xs font-bold text-slate-505 block">Base Location</label>
              <input
                id="set-location"
                type="text"
                value={settings.contact_location || ''}
                placeholder="e.g. Delhi, India"
                onChange={(e) => onUpdateSettings({ ...settings, contact_location: e.target.value })}
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

      {/* Settings Sub-Tab: Work Experience Timeline */}
      {settingsSubTab === 'experience' && (
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
                className="px-3 py-1.5 text-xs font-bold text-primary bg-primary-light rounded-lg hover:bg-blue-100 cursor-pointer inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add First Experience Record
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {settings.experience.map((exp, idx) => (
                <div key={idx} className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 relative group/exp hover:border-slate-300 transition-all">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h5 className="text-xs font-black text-slate-900 truncate">
                        {exp.role || 'Untitled Role'} <span className="text-slate-400 font-normal">at</span> {exp.company || 'Untitled Company'}
                      </h5>
                      {exp.is_current && (
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                          Current Role
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveExperience(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveExperience(idx, 'down')}
                        disabled={idx === settings.experience.length - 1}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete Experience"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Input Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">
                        Role / Designation
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        placeholder="e.g. Full Stack Developer"
                        onChange={(e) => handleUpdateExperience(idx, { role: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        placeholder="e.g. QM Labs"
                        onChange={(e) => handleUpdateExperience(idx, { company: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">
                        Location
                      </label>
                      <input
                        type="text"
                        value={exp.location}
                        placeholder="e.g. Bhubaneswar, India / Remote"
                        onChange={(e) => handleUpdateExperience(idx, { location: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={exp.start_date}
                        placeholder="e.g. Jan 2023 or 2022"
                        onChange={(e) => handleUpdateExperience(idx, { start_date: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">
                        End Date
                      </label>
                      <input
                        type="text"
                        value={exp.is_current ? 'Present' : (exp.end_date || '')}
                        disabled={exp.is_current}
                        placeholder="e.g. Dec 2024"
                        onChange={(e) => handleUpdateExperience(idx, { end_date: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800 font-mono disabled:opacity-60 disabled:bg-slate-100"
                      />
                    </div>

                    <div className="pb-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!!exp.is_current}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            handleUpdateExperience(idx, {
                              is_current: checked,
                              end_date: checked ? 'Present' : (exp.end_date === 'Present' ? '' : exp.end_date)
                            });
                          }}
                          className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-700">Currently Working Here</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">
                      Description & Key Contributions
                    </label>
                    <textarea
                      value={exp.description}
                      rows={2}
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
      {settingsSubTab === 'education' && (
        <div className="space-y-5 animate-fade-in text-left font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-150">
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest font-mono">Academic Background & Education</h4>
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
                className="px-3 py-1.5 text-xs font-bold text-primary bg-primary-light rounded-lg hover:bg-blue-100 cursor-pointer inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add First Academic Record
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {settings.education.map((edu, idx) => (
                <div key={idx} className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 relative group/edu hover:border-slate-300 transition-all">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h5 className="text-xs font-black text-slate-900 truncate">
                        {edu.degree || 'Degree'} in {edu.field || 'Field of Study'}
                      </h5>
                      <span className="text-[10px] font-mono text-slate-500">
                        ({edu.start_year}{edu.end_year ? ` – ${edu.end_year}` : ' – Present'})
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveEducation(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveEducation(idx, 'down')}
                        disabled={idx === settings.education.length - 1}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete Academic Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Input Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">
                        Degree / Credential
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        placeholder="e.g. B.Tech, M.S., B.Sc"
                        onChange={(e) => handleUpdateEducation(idx, { degree: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800 font-semibold"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">
                        Field of Study / Specialization
                      </label>
                      <input
                        type="text"
                        value={edu.field}
                        placeholder="e.g. Computer Science & Engineering"
                        onChange={(e) => handleUpdateEducation(idx, { field: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">
                      Institution / University / School
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      placeholder="e.g. Silicon Institute of Technology, Bhubaneswar"
                      onChange={(e) => handleUpdateEducation(idx, { institution: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">
                        Start Year
                      </label>
                      <input
                        type="number"
                        value={edu.start_year || ''}
                        placeholder="e.g. 2018"
                        onChange={(e) => handleUpdateEducation(idx, { start_year: parseInt(e.target.value, 10) || 0 })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">
                        End Year (Optional / Blank if Ongoing)
                      </label>
                      <input
                        type="number"
                        value={edu.end_year || ''}
                        placeholder="e.g. 2022"
                        onChange={(e) => handleUpdateEducation(idx, { end_year: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">
                        Grade / CGPA / Value
                      </label>
                      <input
                        type="text"
                        value={edu.grade || ''}
                        placeholder="e.g. 8.4 CGPA or First Class"
                        onChange={(e) => handleUpdateEducation(idx, { grade: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings Sub-Tab: Company Profile */}
      {settingsSubTab === 'company' && (
        <div className="space-y-5 animate-fade-in text-left font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-500 block">Company Name</label>
              <input
                type="text"
                value={settings.company_name || 'QM Labs'}
                onChange={(e) => onUpdateSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-500 block">Company Tagline</label>
              <input
                type="text"
                value={settings.company_tagline || 'Quality Builds Trust. Momentum Drives Growth.'}
                onChange={(e) => onUpdateSettings({ ...settings, company_tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-slate-500 block">Company Bio / Short Intro</label>
            <textarea
              value={settings.company_bio || ''}
              onChange={(e) => onUpdateSettings({ ...settings, company_bio: e.target.value })}
              rows={2}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800 resize-none"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-slate-500 block">Public Contact Email</label>
            <input
              type="text"
              value={settings.contact_email || ''}
              onChange={(e) => onUpdateSettings({ ...settings, contact_email: e.target.value })}
              placeholder="e.g. hello@qmlabs.com"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
            />
          </div>

          <div className="space-y-1 px-1 text-left">
            <label className="text-xs font-bold text-slate-500 block mb-1">Detailed Company Profile / Pitch (Rich Text Editor)</label>
            <RichTextEditor
              value={settings.company_about_html || ''}
              onChange={(val) => onUpdateSettings({ ...settings, company_about_html: val })}
              placeholder="Explain what your company does in detail..."
            />
          </div>

          {/* Company Services list editor */}
          <div className="space-y-3 pt-3 border-t border-slate-100 text-left">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest">Company Services & Capabilities</h4>
              <button
                type="button"
                onClick={() => {
                  const services = settings.company_services || [];
                  onUpdateSettings({
                    ...settings,
                    company_services: [...services, { title: 'New Service', description: 'Service description...', icon_name: 'Cpu' }]
                  });
                }}
                className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(settings.company_services || []).map((srv, sIdx) => {
                const iconSelectVal = srv.icon_name || 'Cpu';
                return (
                  <div key={sIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3 relative group/srv">
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = (settings.company_services || []).filter((_, i) => i !== sIdx);
                        onUpdateSettings({ ...settings, company_services: filtered });
                      }}
                      className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover/srv:opacity-100 cursor-pointer"
                      title="Remove Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 text-left">
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Title</label>
                          <input
                            type="text"
                            value={srv.title}
                            onChange={(e) => {
                              const next = [...(settings.company_services || [])];
                              next[sIdx] = { ...srv, title: e.target.value };
                              onUpdateSettings({ ...settings, company_services: next });
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-800"
                          />
                        </div>
                        <div className="text-left">
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Icon (Lucide)</label>
                          <select
                            value={iconSelectVal}
                            onChange={(e) => {
                              const next = [...(settings.company_services || [])];
                              next[sIdx] = { ...srv, icon_name: e.target.value };
                              onUpdateSettings({ ...settings, company_services: next });
                            }}
                            className="w-full px-1 py-1 bg-white border border-slate-200 rounded-md text-xs cursor-pointer text-slate-800"
                          >
                            <option value="Cpu">Cpu</option>
                            <option value="TrendingUp">TrendingUp</option>
                            <option value="CheckCircle">CheckCircle</option>
                            <option value="Activity">Activity</option>
                            <option value="Mail">Mail</option>
                            <option value="FileText">FileText</option>
                            <option value="Search">Search</option>
                            <option value="Award">Award</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Description</label>
                        <textarea
                          value={srv.description}
                          onChange={(e) => {
                            const next = [...(settings.company_services || [])];
                            next[sIdx] = { ...srv, description: e.target.value };
                            onUpdateSettings({ ...settings, company_services: next });
                          }}
                          rows={2}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs resize-none text-slate-805"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Settings Sub-Tab: Skills configuration */}
      {settingsSubTab === 'skills' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
            🌟 Live edit your tech competencies tags below. These updates refresh seamlessly on the landing page grids.
          </div>

          <div className="space-y-6">
            {settings.skills.map((cat, catIdx) => (
              <div key={catIdx} className="bg-slate-50/30 p-4 rounded-2xl border border-slate-150/60 text-left space-y-3">
                <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-1 flex items-center justify-between">
                  {cat.category}
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {cat.items.map((skill, itemIdx) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    
                    
                    return (
                      <div key={itemIdx} className="bg-white rounded-xl border border-slate-200 p-2.5 space-y-2 flex flex-col justify-between group/skill relative transition-shadow hover:shadow-xs">
                        <div className="relative pr-5">
                          <input
                            type="text"
                            value={skillName}
                            onChange={(e) => handleSkillUpdate(catIdx, itemIdx, e.target.value)}
                            className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-hidden border-b border-transparent focus:border-slate-300 pb-0.5"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(catIdx, itemIdx)}
                            className="absolute -right-1 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover/skill:opacity-100 transition-opacity cursor-pointer text-xs font-bold"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => handleAddSkill(catIdx)}
                    className="px-3 py-1.5 border border-dashed border-slate-200 text-slate-400 hover:text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Sub-Tab: Social Coordinates */}
      {settingsSubTab === 'socials' && (
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
      {settingsSubTab === 'seo' && (
        <div className="space-y-4 animate-fade-in">
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
      
      {settingsSubTab === 'database' && (
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
