import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { SiteSettings } from '../../types';
import RichTextEditor from '../RichTextEditor';

interface AdminSettingsTabProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [settingsSubTab, setSettingsSubTab] = useState<'hero' | 'company' | 'skills' | 'socials' | 'seo'>('hero');

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
          { label: 'Company Profile', value: 'company' },
          { label: 'Skills lists', value: 'skills' },
          { label: 'Social connections', value: 'socials' },
          { label: 'Map / Meta', value: 'seo' }
        ].map((st) => (
          <button
            key={st.value}
            type="button"
            onClick={() => setSettingsSubTab(st.value as any)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
              settingsSubTab === st.value
                ? 'bg-primary-light text-primary font-bold'
                : 'text-slate-500 hover:text-slate-800'
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
              value={settings.seo_home_title}
              onChange={(e) => onUpdateSettings({ ...settings, seo_home_title: e.target.value })}
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

      {/* Bottom notifications */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2.5">
        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <span>Success! Site settings are dynamically tracked in standard localStorage and sync immediately across components.</span>
      </div>
    </div>
  );
};
