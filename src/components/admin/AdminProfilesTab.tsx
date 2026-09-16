import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Check, X, Sparkles, Layers, Target, 
  Code2, Search, Database, Briefcase, ShieldAlert, Cpu, Globe, 
  Zap, ArrowRight, Award, Sliders
} from 'lucide-react';
import { SiteSettings, DomainProfile, Skill } from '../../types';

interface AdminProfilesTabProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

export const ICON_OPTIONS: { name: string; label: string; icon: any }[] = [
  { name: 'Target', label: 'Product / Target', icon: Target },
  { name: 'Code2', label: 'Full-Stack / Code', icon: Code2 },
  { name: 'Search', label: 'SEO / Analytics', icon: Search },
  { name: 'Database', label: 'Data Science / DB', icon: Database },
  { name: 'Briefcase', label: 'QA / Business', icon: Briefcase },
  { name: 'ShieldAlert', label: 'Cybersecurity', icon: ShieldAlert },
  { name: 'Cpu', label: 'Systems / AI', icon: Cpu },
  { name: 'Globe', label: 'Web / Platform', icon: Globe },
  { name: 'Zap', label: 'High Performance', icon: Zap },
];

export const ACCENT_OPTIONS = [
  { value: 'blue', label: 'Blue', color: 'bg-blue-500 text-white', border: 'border-blue-500' },
  { value: 'amber', label: 'Amber / Gold', color: 'bg-amber-500 text-white', border: 'border-amber-500' },
  { value: 'indigo', label: 'Indigo', color: 'bg-indigo-500 text-white', border: 'border-indigo-500' },
  { value: 'emerald', label: 'Emerald Green', color: 'bg-emerald-500 text-white', border: 'border-emerald-500' },
  { value: 'rose', label: 'Rose / Crimson', color: 'bg-rose-500 text-white', border: 'border-rose-500' },
  { value: 'purple', label: 'Purple / Violet', color: 'bg-purple-500 text-white', border: 'border-purple-500' },
];

export const DEFAULT_PROFILES: DomainProfile[] = [
  {
    id: 'product',
    name: 'Product Manager (TPM)',
    title: 'Technical Product Manager & Product Strategist',
    summary: 'Strategic and technically grounded Product Manager (MBA candidate in Product Management) with a solid Computer Science and engineering foundation. Adept at bridging technical feasibility, customer research, and commercial value. Proven expertise in authoring comprehensive PRDs, mapping user journeys, running Agile sprints, and prioritizing features through RICE and OKR frameworks to accelerate product delivery.',
    icon_name: 'Target',
    accent_color: 'amber',
    skills_categories: ['Product Strategy & Management', 'Agile & Execution'],
    is_default: true,
  },
  {
    id: 'general',
    name: 'Full-Stack Developer',
    title: 'Full-Stack Developer & Multi-Disciplinary Engineer',
    summary: 'High-performing Software Engineer and Computer Science graduate specializing in modern React/Next.js architectures, TypeScript, Node.js API services, and Technical SEO infrastructure. Proven background in architecting end-to-end applications, real-time analytics pipelines, and automated test environments that drive quantifiable business growth and optimal Core Web Vitals.',
    icon_name: 'Code2',
    accent_color: 'blue',
    skills_categories: ['Full-Stack & Web Systems', 'APIs & Backend'],
    is_default: false,
  },
  {
    id: 'seo',
    name: 'Technical SEO & Analytics',
    title: 'Technical SEO Specialist & Web Analytics Engineer',
    summary: 'Results-driven Technical SEO Auditor and Web Analyst with a proven record of driving 8–9% organic web traffic hikes across fintech, relocation, and travel niches. Expert in crawl error debugging, Core Web Vitals optimization (LCP, INP, CLS), JSON-LD Schema markups, GA4 telemetry, sitemap architecture, and high-performance WordPress CMS infrastructure.',
    icon_name: 'Search',
    accent_color: 'indigo',
    skills_categories: ['Technical SEO & Performance', 'Analytics & Telemetry'],
    is_default: false,
  },
  {
    id: 'data',
    name: 'Data Science & ML',
    title: 'Data Science & Machine Learning Analyst',
    summary: 'Analytical Data Scientist with hands-on experience designing machine learning classification pipelines and interactive business intelligence dashboards. Skilled in exploratory data analysis (EDA), statistical feature engineering, and deploying Random Forest, SVM, and KNN classifiers delivering up to 92.57% prediction accuracy on multi-variable diagnostic datasets.',
    icon_name: 'Database',
    accent_color: 'emerald',
    skills_categories: ['Data Science & Machine Learning', 'BI & Analytics'],
    is_default: false,
  },
  {
    id: 'qa',
    name: 'QA & Automation',
    title: 'QA Automation Engineer & SDET Specialist',
    summary: 'Software Development Engineer in Test (SDET) proficient in building scalable automated testing frameworks. Expert in Selenium WebDriver and PyTest architectures implementing Page Object Model (POM) standards, automated web scrapers, REST API validation, and continuous quality assurance pipelines.',
    icon_name: 'Briefcase',
    accent_color: 'amber',
    skills_categories: ['QA Automation & Testing', 'Software Testing'],
    is_default: false,
  },
  {
    id: 'security',
    name: 'Cybersecurity',
    title: 'Cybersecurity Analyst & Systems Auditor',
    summary: 'Hands-on Security Specialist proficient in Linux and Parrot OS security distributions. Experienced in vulnerability assessments, Wireshark network packet inspection, Nmap network mapping, Burp Suite proxy interceptors, OWASP Top 10 mitigation, and active system hardening across cloud environments.',
    icon_name: 'ShieldAlert',
    accent_color: 'rose',
    skills_categories: ['Cybersecurity & Network Defense', 'System Hardening'],
    is_default: false,
  }
];

export const AdminProfilesTab: React.FC<AdminProfilesTabProps> = ({
  settings,
  onUpdateSettings
}) => {
  const profiles = (settings.profiles && settings.profiles.length > 0)
    ? settings.profiles
    : DEFAULT_PROFILES;

  const [editingProfile, setEditingProfile] = useState<DomainProfile | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Available skill categories from current skills matrix
  const availableSkillCategories = Array.from(
    new Set((settings.skills || []).map(s => s.category).filter(Boolean))
  );

  const handleSaveProfile = (profileToSave: DomainProfile) => {
    let updated: DomainProfile[];
    const exists = profiles.some(p => p.id === profileToSave.id);

    if (exists) {
      updated = profiles.map(p => p.id === profileToSave.id ? profileToSave : p);
    } else {
      updated = [...profiles, profileToSave];
    }

    onUpdateSettings({
      ...settings,
      profiles: updated
    });

    setEditingProfile(null);
    setIsCreatingNew(false);
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) {
      alert("At least one profile must be retained.");
      return;
    }
    const updated = profiles.filter(p => p.id !== id);
    onUpdateSettings({
      ...settings,
      profiles: updated
    });
    if (editingProfile?.id === id) {
      setEditingProfile(null);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm("Reset all domain profiles to default templates? Any custom profiles added will be reverted.")) {
      onUpdateSettings({
        ...settings,
        profiles: DEFAULT_PROFILES
      });
      setEditingProfile(null);
      setIsCreatingNew(false);
    }
  };

  const startCreateNew = () => {
    const newId = `profile_${Date.now()}`;
    setEditingProfile({
      id: newId,
      name: 'New Domain Profile',
      title: 'Domain Specialist & Engineer',
      summary: 'Overview of expertise, track record, and core competencies in this specialized technical domain...',
      icon_name: 'Target',
      accent_color: 'blue',
      skills_categories: [],
      is_default: false,
    });
    setIsCreatingNew(true);
  };

  const getIconComponent = (iconName?: string) => {
    const found = ICON_OPTIONS.find(o => o.name === iconName);
    return found ? found.icon : Target;
  };

  return (
    <div className="space-y-6 animate-fade-in text-left font-sans">
      
      {/* Header with Explanatory Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0084ff] uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5" />
            CENTRALIZED PROFILES &amp; DOMAINS MANAGER
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Specialized Career Personas
          </h3>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Manage, customize, and add career profiles (e.g. <strong>Product Management</strong>, <strong>Technical SEO</strong>, <strong>Full-Stack</strong>, <strong>QA</strong>, <strong>Data Science</strong>). Changes dynamically update the interactive <strong>Resume Center</strong>, live persona tabs, and download exports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={startCreateNew}
            className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Profile
          </button>
        </div>
      </div>

      {/* Editing / Creation Modal or Drawer */}
      {editingProfile && (
        <div className="bg-slate-50 border-2 border-blue-500/20 rounded-2xl p-5 space-y-4 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <Edit2 className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                {isCreatingNew ? 'Create New Domain Profile' : `Edit Profile: ${editingProfile.name}`}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingProfile(null);
                setIsCreatingNew(false);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">Short Tab Label</label>
              <input
                type="text"
                value={editingProfile.name}
                onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                placeholder="e.g. Product Manager (TPM)"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden"
              />
            </div>

            <div className="space-y-1 sm:col-span-1 lg:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">Full Resume Title / Headline</label>
              <input
                type="text"
                value={editingProfile.title}
                onChange={(e) => setEditingProfile({ ...editingProfile, title: e.target.value })}
                placeholder="e.g. Technical Product Manager & Strategist"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">Visual Icon</label>
              <select
                value={editingProfile.icon_name || 'Target'}
                onChange={(e) => setEditingProfile({ ...editingProfile, icon_name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden cursor-pointer"
              >
                {ICON_OPTIONS.map(opt => (
                  <option key={opt.name} value={opt.name}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">Accent Theme Color</label>
              <select
                value={editingProfile.accent_color || 'blue'}
                onChange={(e) => setEditingProfile({ ...editingProfile, accent_color: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-primary focus:outline-hidden cursor-pointer"
              >
                {ACCENT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">Unique Identifier Key</label>
              <input
                type="text"
                disabled={!isCreatingNew}
                value={editingProfile.id}
                onChange={(e) => setEditingProfile({ ...editingProfile, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                className="w-full px-3 py-2 text-xs bg-white disabled:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-mono focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* Persona Professional Summary */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase block">
              Professional Summary / Bio (Directly feeds into this Persona's Resume)
            </label>
            <textarea
              rows={4}
              value={editingProfile.summary}
              onChange={(e) => setEditingProfile({ ...editingProfile, summary: e.target.value })}
              placeholder="Write the tailored summary for this specific technical domain..."
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 leading-relaxed focus:border-primary focus:outline-hidden resize-none"
            />
          </div>

          {/* Linked Skill Categories */}
          {availableSkillCategories.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">
                Associated Skill Categories (Auto-filtered on Resume when selected)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSkillCategories.map(cat => {
                  const isChecked = editingProfile.skills_categories?.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        const current = editingProfile.skills_categories || [];
                        const next = isChecked
                          ? current.filter(c => c !== cat)
                          : [...current, cat];
                        setEditingProfile({ ...editingProfile, skills_categories: next });
                      }}
                      className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setEditingProfile(null);
                setIsCreatingNew(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSaveProfile(editingProfile)}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0084ff] hover:bg-blue-600 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </div>
      )}

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((prof) => {
          const IconComponent = getIconComponent(prof.icon_name);
          const isSelectedForEdit = editingProfile?.id === prof.id;

          return (
            <div
              key={prof.id}
              className={`bg-white rounded-2xl border ${
                isSelectedForEdit ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200/80 hover:border-slate-300'
              } p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-left`}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-tight">
                        {prof.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">id: {prof.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProfile(prof);
                        setIsCreatingNew(false);
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProfile(prof.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Persona Title */}
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Title Headline</span>
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    {prof.title}
                  </p>
                </div>

                {/* Summary preview */}
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Resume Summary</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                    {prof.summary}
                  </p>
                </div>

                {/* Associated categories */}
                {prof.skills_categories && prof.skills_categories.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                    {prof.skills_categories.map(cat => (
                      <span key={cat} className="text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-slate-400">
                  <span className={`w-2 h-2 rounded-full ${
                    prof.accent_color === 'amber' ? 'bg-amber-500' :
                    prof.accent_color === 'indigo' ? 'bg-indigo-500' :
                    prof.accent_color === 'emerald' ? 'bg-emerald-500' :
                    prof.accent_color === 'rose' ? 'bg-rose-500' :
                    prof.accent_color === 'purple' ? 'bg-purple-500' : 'bg-blue-500'
                  }`} />
                  Theme: {prof.accent_color || 'blue'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(prof);
                    setIsCreatingNew(false);
                  }}
                  className="text-primary hover:text-primary-dark font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  Configure
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
