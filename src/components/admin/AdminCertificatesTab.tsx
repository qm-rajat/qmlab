import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Check, Sparkles, Search } from 'lucide-react';
import { Certificate, SiteSettings } from '../../types';
import { DEFAULT_PROFILES } from './AdminProfilesTab';

interface AdminCertificatesTabProps {
  certificates: Certificate[];
  onUpdateCertificates: (certs: Certificate[]) => void;
  onDeleteCertificateRequest: (id: string, title: string) => void;
  settings?: SiteSettings;
}

export const AdminCertificatesTab: React.FC<AdminCertificatesTabProps> = ({
  certificates,
  onUpdateCertificates,
  onDeleteCertificateRequest,
  settings,
}) => {
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certForm, setCertForm] = useState<Partial<Certificate>>({});
  const [skillsInput, setSkillsInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Available domain profiles configured in the system (Profiles & Domains tab)
  const availableProfiles = settings?.profiles && settings.profiles.length > 0 
    ? settings.profiles 
    : DEFAULT_PROFILES;

  // Clean domain profiles list for direct one-click assignment
  const profileDomainNames = availableProfiles
    .map(p => (typeof p?.name === 'string' ? p.name.trim() : ''))
    .filter(Boolean);

  // Collect all existing skills from settings, certificates, and profiles
  const availableSkillsList = Array.from(
    new Set([
      ...(settings?.skills?.flatMap(s => 
        (Array.isArray(s?.items) ? s.items : []).map(item => {
          if (typeof item === 'string') return item;
          if (typeof item === 'object' && item !== null && 'name' in item) return String((item as any).name || '');
          return String(item || '');
        }).filter(Boolean)
      ) || []),
      ...certificates.flatMap(c => 
        (Array.isArray(c?.skills) ? c.skills : []).map(s => (typeof s === 'string' ? s : String(s || ''))).filter(Boolean)
      ),
      'Python', 'Pandas', 'NumPy', 'TypeScript', 'React', 'Node.js',
      'Docker', 'Kubernetes', 'CI/CD', 'Jest', 'Playwright', 'Selenium',
      'Penetration Testing', 'Burp Suite', 'Wireshark', 'Metasploit',
      'Product Strategy', 'Roadmapping', 'Agile / Scrum', 'Jira',
      'Technical SEO', 'Google Search Console', 'Lighthouse',
      'SQL', 'PostgreSQL', 'Redis', 'GraphQL', 'AWS', 'GCP'
    ])
  )
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .sort((a, b) => String(a).localeCompare(String(b)));

  const handleCertEditStart = (cert?: Certificate) => {
    if (cert) {
      setEditingCertId(cert.id);
      setCertForm(cert);
      setSkillsInput(cert.skills?.join(', ') || '');
    } else {
      setEditingCertId('new');
      setCertForm({
        title: '',
        issuer: '',
        category: 'cybersecurity',
        credential_id: '',
        verify_url: '',
        issue_date: new Date().toISOString().split('T')[0]
      });
      setSkillsInput('');
    }
  };

  const handleCertSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title?.trim() || !certForm.issuer?.trim()) return;

    const parsedSkills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload: Certificate = {
      ...(certForm as Certificate),
      skills: parsedSkills
    };

    if (editingCertId === 'new') {
      const newCert: Certificate = {
        ...payload,
        id: `cert_${Date.now()}`
      };
      onUpdateCertificates([newCert, ...certificates]);
    } else {
      const updated = certificates.map(c => c.id === editingCertId ? { ...payload } : c);
      onUpdateCertificates(updated);
    }
    setEditingCertId(null);
    setCertForm({});
    setSkillsInput('');
  };

  const filteredCertificates = certificates.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const titleMatch = c.title?.toLowerCase().includes(q);
    const issuerMatch = c.issuer?.toLowerCase().includes(q);
    const catMatch = c.category?.toLowerCase().includes(q);
    const credMatch = c.credential_id?.toLowerCase().includes(q);
    const skillMatch = (c.skills || []).some(s => s.toLowerCase().includes(q));
    return titleMatch || issuerMatch || catMatch || credMatch || skillMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {editingCertId === null ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Managed Certifications ({filteredCertificates.length}{filteredCertificates.length !== certificates.length ? ` / ${certificates.length}` : ''})</h3>
              <p className="text-xs text-slate-400 mt-0.5">Control dynamic credentials validation pathways and issuer authorities.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search certifications, issuer, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-7 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary transition-all w-48 sm:w-64"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => handleCertEditStart()}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" /> Log Credential
              </button>
            </div>
          </div>

          {/* List Certs */}
          <div className="bg-white border border-slate-150/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-mono border-b border-slate-100 uppercase tracking-widest">
                    <th className="px-5 py-3">Certification Title</th>
                    <th className="px-5 py-3">Issuer Platform</th>
                    <th className="px-5 py-3">Category tag</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-650">
                  {filteredCertificates.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-400 font-medium">
                        No certifications found matching &ldquo;{searchQuery}&rdquo;.
                      </td>
                    </tr>
                  ) : (
                    filteredCertificates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/40">
                      <td className="px-5 py-4 font-bold text-slate-900 text-sm max-w-xs truncate">{c.title}</td>
                      <td className="px-5 py-4 text-slate-600">{c.issuer}</td>
                      <td className="px-5 py-4 text-slate-450 uppercase">{c.category}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCertEditStart(c)}
                            className="p-1.5 text-slate-450 hover:text-primary hover:bg-slate-150/45 rounded-lg cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteCertificateRequest(c.id, `certification "${c.title}"`)}
                            className="p-1.5 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Certs CRUD form view */
        <form onSubmit={handleCertSave} className="space-y-6 animate-fade-in text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-800">
              {editingCertId === 'new' ? 'Log New Certification' : `Refine Credential: ${certForm.title}`}
            </h3>
            <button
              type="button"
              onClick={() => setEditingCertId(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="space-y-1">
              <label htmlFor="cform-title" className="text-xs font-bold text-slate-505 block">Certification Title</label>
              <input
                id="cform-title"
                type="text"
                value={certForm.title || ''}
                onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Issuer */}
            <div className="space-y-1">
              <label htmlFor="cform-issuer" className="text-xs font-bold text-slate-505 block">Issuer Authority</label>
              <input
                id="cform-issuer"
                type="text"
                value={certForm.issuer || ''}
                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Category / Domain Tag */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label htmlFor="cform-category" className="text-xs font-bold text-slate-505 block">
                  Category &amp; Domain Tag
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  Synced with configured Profiles &amp; Domains
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    id="cform-category"
                    type="text"
                    value={certForm.category || ''}
                    onChange={(e) => setCertForm({ ...certForm, category: e.target.value })}
                    placeholder="Select below or type custom domain (e.g. Cybersecurity, Web Dev, Product Management)..."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                  />
                  {certForm.category && (
                    <button
                      type="button"
                      onClick={() => setCertForm({ ...certForm, category: '' })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                      title="Clear category tag"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  aria-label="Quick Select Certificate Category Tag"
                  value={profileDomainNames.includes(certForm.category || '') ? (certForm.category || '') : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setCertForm({ ...certForm, category: e.target.value });
                    }
                  }}
                  className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden cursor-pointer shrink-0"
                >
                  <option value="">⚡ Quick Select Profile Domain...</option>
                  {profileDomainNames.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Select Category Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono mr-1">Configured Domains:</span>
                {profileDomainNames.map((domain) => {
                  const isSelected = (certForm.category || '').toLowerCase() === domain.toLowerCase();
                  return (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => {
                        setCertForm({ 
                          ...certForm, 
                          category: isSelected ? '' : domain 
                        });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{domain}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Credential ID */}
            <div className="space-y-1">
              <label htmlFor="cform-id" className="text-xs font-bold text-slate-505 block">Credential ID</label>
              <input
                id="cform-id"
                type="text"
                value={certForm.credential_id || ''}
                onChange={(e) => setCertForm({ ...certForm, credential_id: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Issue Date */}
            <div className="space-y-1">
              <label htmlFor="cform-issue-date" className="text-xs font-bold text-slate-505 block">Issue Date</label>
              <input
                id="cform-issue-date"
                type="text"
                value={certForm.issue_date || ''}
                onChange={(e) => setCertForm({ ...certForm, issue_date: e.target.value })}
                placeholder="e.g., November 2024"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Validated Competencies (Skills) */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="cform-skills" className="text-xs font-bold text-slate-505 block">
                  Validated Competencies &amp; Skills (Comma separated)
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  Synced with Skills &amp; Profiles catalog
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    id="cform-skills"
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="e.g. Python, Pandas, NumPy, Penetration Testing"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                  />
                  {skillsInput && (
                    <button
                      type="button"
                      onClick={() => setSkillsInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                      title="Clear skills"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  aria-label="Add Skill from Catalog"
                  value=""
                  onChange={(e) => {
                    const skillToAdd = e.target.value;
                    if (!skillToAdd) return;
                    const current = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
                    if (!current.some(s => s.toLowerCase() === skillToAdd.toLowerCase())) {
                      setSkillsInput([...current, skillToAdd].join(', '));
                    }
                  }}
                  className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden cursor-pointer shrink-0"
                >
                  <option value="">⚡ Add Skill from Catalog...</option>
                  {availableSkillsList.map((skill) => (
                    <option key={skill} value={skill}>
                      + {skill}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Add / Remove Skill Chips from Catalog */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                    Catalog Quick Toggle:
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Click to add / remove from certificate
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-slate-50/70 rounded-xl border border-slate-150">
                  {availableSkillsList.map((skill) => {
                    const currentSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
                    const isSelected = currentSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            const filtered = currentSkills.filter(s => s.toLowerCase() !== skill.toLowerCase());
                            setSkillsInput(filtered.join(', '));
                          } else {
                            setSkillsInput([...currentSkills, skill].join(', '));
                          }
                        }}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-semibold'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {isSelected ? <Check className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5 text-slate-400" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="cform-desc" className="text-xs font-bold text-slate-505 block">Description</label>
              <textarea
                id="cform-desc"
                value={certForm.description || ''}
                onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                placeholder="Comprehensive data extraction, statistical aggregation..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden min-h-[80px]"
              />
            </div>

            {/* Verify URL */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="cform-verify" className="text-xs font-bold text-slate-505 block">Verify URL Link</label>
              <input
                id="cform-verify"
                type="text"
                value={certForm.verify_url || ''}
                onChange={(e) => setCertForm({ ...certForm, verify_url: e.target.value })}
                placeholder="https://credly.com/verify/..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>
            
            {/* Image URL */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="cform-image" className="text-xs font-bold text-slate-505 block">Image URL</label>
              <input
                id="cform-image"
                type="text"
                value={certForm.image_url || ''}
                onChange={(e) => setCertForm({ ...certForm, image_url: e.target.value })}
                placeholder="https://example.com/certificate-image.png"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>
            
            {/* Expiry Date */}
            <div className="space-y-1">
              <label htmlFor="cform-expiry-date" className="text-xs font-bold text-slate-505 block">Expiry Date</label>
              <input
                id="cform-expiry-date"
                type="text"
                value={certForm.expiry_date || ''}
                onChange={(e) => setCertForm({ ...certForm, expiry_date: e.target.value })}
                placeholder="e.g., November 2027 (Optional)"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>
            
            {/* Score or Grade */}
            <div className="space-y-1">
              <label htmlFor="cform-score" className="text-xs font-bold text-slate-505 block">Score / Grade</label>
              <input
                id="cform-score"
                type="text"
                value={certForm.score_or_grade || ''}
                onChange={(e) => setCertForm({ ...certForm, score_or_grade: e.target.value })}
                placeholder="e.g., 95% or Pass"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>
            
            {/* Display Order & Featured */}
            <div className="md:col-span-2 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2">
              <div className="flex items-center gap-3">
                <input
                  id="cform-featured"
                  type="checkbox"
                  checked={certForm.is_featured || false}
                  onChange={(e) => setCertForm({ ...certForm, is_featured: e.target.checked })}
                  className="w-4 h-4 text-primary bg-white border-slate-300 rounded focus:ring-primary"
                />
                <div>
                  <label htmlFor="cform-featured" className="text-sm font-bold text-slate-700 block cursor-pointer">Feature on Dashboard</label>
                  <span className="text-xs text-slate-500">Pin this certificate to the top of your profile</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="cform-order" className="text-sm font-bold text-slate-700">Display Order</label>
                <input
                  id="cform-order"
                  type="number"
                  min="0"
                  value={certForm.display_order || 0}
                  onChange={(e) => setCertForm({ ...certForm, display_order: parseInt(e.target.value) || 0 })}
                  className="w-20 px-3 py-1.5 text-sm text-center bg-white border border-slate-200 focus:border-primary rounded-lg focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-98 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" /> Save credential
          </button>
        </form>
      )}
    </div>
  );
};
