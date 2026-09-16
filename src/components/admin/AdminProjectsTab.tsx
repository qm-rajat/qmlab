import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Save, Sparkles, X, Check } from 'lucide-react';
import { Project, SiteSettings } from '../../types';
import { DEFAULT_PROFILES } from './AdminProfilesTab';

interface AdminProjectsTabProps {
  projects: Project[];
  onUpdateProjects: (proj: Project[]) => void;
  onDeleteProjectRequest: (id: string, title: string) => void;
  settings?: SiteSettings;
}

export const AdminProjectsTab: React.FC<AdminProjectsTabProps> = ({
  projects,
  onUpdateProjects,
  onDeleteProjectRequest,
  settings,
}) => {
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});
  const [techInput, setTechInput] = useState<string>('');
  const [featuresInput, setFeaturesInput] = useState<string>('');
  const [archInput, setArchInput] = useState<string>('');
  const [secondaryImagesInput, setSecondaryImagesInput] = useState<string>('');

  // Available domain profiles and existing categories list
  const availableProfiles = settings?.profiles && settings.profiles.length > 0 
    ? settings.profiles 
    : DEFAULT_PROFILES;

  // Collect unique categories across existing projects + profiles
  const existingCategories = Array.from(
    new Set([
      ...availableProfiles.map(p => (typeof p?.name === 'string' ? p.name : '')).filter(Boolean),
      ...projects.map(p => (typeof p?.category === 'string' ? p.category : '')).filter(Boolean),
      'Product Strategy & Case Studies',
      'QA Automation & Testing',
      'AI & Machine Learning',
      'Cybersecurity & Pentesting',
      'BI & Data Analytics',
      'Full-Stack & Web Systems'
    ])
  ).filter(Boolean);

  // Collect all existing skills / technologies from settings, projects, and profiles
  const availableSkillsList = Array.from(
    new Set([
      ...(settings?.skills?.flatMap(s => 
        (Array.isArray(s?.items) ? s.items : []).map(item => {
          if (typeof item === 'string') return item;
          if (typeof item === 'object' && item !== null && 'name' in item) return String((item as any).name || '');
          return String(item || '');
        }).filter(Boolean)
      ) || []),
      ...projects.flatMap(p => 
        (Array.isArray(p?.technologies) ? p.technologies : []).map(t => (typeof t === 'string' ? t : String(t || ''))).filter(Boolean)
      ),
      'React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'Next.js',
      'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'Express', 'GraphQL',
      'TensorFlow', 'PyTorch', 'FastAPI', 'Pandas', 'NumPy', 'OpenCV',
      'Playwright', 'Selenium', 'Jest', 'Cypress', 'Burp Suite', 'Wireshark',
      'AWS', 'GCP', 'Firebase', 'Supabase', 'Jira', 'Figma'
    ])
  )
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .sort((a, b) => String(a).localeCompare(String(b)));

  const handleProjectEditStart = (proj?: Project) => {
    if (proj) {
      setEditingProjectId(proj.id);
      setProjectForm(proj);
      setTechInput(proj.technologies?.join(', ') || '');
      setFeaturesInput(proj.features?.join(', ') || '');
      setArchInput(proj.architecture_highlights?.join(', ') || '');
      setSecondaryImagesInput(proj.images?.slice(1).join(', ') || '');
    } else {
      setEditingProjectId('new');
      setProjectForm({
        title: '',
        slug: '',
        description: '',
        images: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600'],
        technologies: [],
        github_url: '',
        live_url: '',
        is_featured: false,
        display_order: projects.length + 1,
      });
      setTechInput('');
      setFeaturesInput('');
      setArchInput('');
      setSecondaryImagesInput('');
    }
  };

  const handleProjectSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title?.trim() || !projectForm.description?.trim()) return;

    const finalSlug = projectForm.slug?.trim() || projectForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const primaryImg = projectForm.images?.[0] || '';
    const extraImgs = secondaryImagesInput.split(',').map(s => s.trim()).filter(Boolean);
    const finalImages = [primaryImg, ...extraImgs].filter(Boolean);

    const parsedTech = techInput.split(',').map(s => s.trim()).filter(Boolean);
    const parsedFeatures = featuresInput.split(',').map(s => s.trim()).filter(Boolean);
    const parsedArch = archInput.split(',').map(s => s.trim()).filter(Boolean);

    const payload: Project = {
      ...(projectForm as Project),
      images: finalImages,
      technologies: parsedTech,
      features: parsedFeatures,
      architecture_highlights: parsedArch,
      slug: finalSlug,
    };

    if (editingProjectId === 'new') {
      const newProj: Project = {
        ...payload,
        id: `proj_${Date.now()}`,
        created_at: new Date().toISOString()
      };
      onUpdateProjects([newProj, ...projects]);
    } else {
      const updated = projects.map(p => p.id === editingProjectId ? { ...payload } : p);
      onUpdateProjects(updated);
    }
    setEditingProjectId(null);
    setProjectForm({});
    setTechInput('');
    setFeaturesInput('');
    setArchInput('');
    setSecondaryImagesInput('');
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {editingProjectId === null ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Featured Projects</h3>
              <p className="text-xs text-slate-400 mt-0.5">Control shown cards, image references and repository connections.</p>
            </div>
            <button
              onClick={() => handleProjectEditStart()}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>

          {/* List Projects */}
          <div className="bg-white border border-slate-150/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-mono border-b border-slate-100 uppercase tracking-widest">
                    <th className="px-5 py-3">Project specifications</th>
                    <th className="px-5 py-3">Core Tech stack</th>
                    <th className="px-5 py-3">Featured</th>
                    <th className="px-5 py-3">Display Order</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-650">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50/40">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={proj.images[0]}
                            alt={proj.title}
                            referrerPolicy="no-referrer"
                            className="w-10 h-8 object-cover rounded-md border border-slate-100"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm leading-tight">{proj.title}</div>
                            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">/{proj.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {proj.technologies.slice(0, 3).map(tech => (
                            <span key={tech} className="text-[9px] font-extrabold uppercase bg-slate-50 text-slate-450 border border-slate-100 px-1.5 py-0.5 rounded-md">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => {
                            const updated = projects.map(p => p.id === proj.id ? { ...p, is_featured: !p.is_featured } : p);
                            onUpdateProjects(updated);
                          }}
                          className="text-slate-500 hover:text-primary transition-colors focus:outline-hidden cursor-pointer"
                        >
                          {proj.is_featured ? (
                            <ToggleRight className="w-6 h-6 text-[#0084ff]" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-slate-300" />
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-550">{proj.display_order}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleProjectEditStart(proj)}
                            className="p-1.5 text-slate-450 hover:text-primary hover:bg-slate-150/45 rounded-lg cursor-pointer"
                            title="Edit structural details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProjectRequest(proj.id, `project "${proj.title}"`)}
                            className="p-1.5 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Erase card"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Projects Edit Form View */
        <form onSubmit={handleProjectSave} className="space-y-6 animate-fade-in text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-800">
              {editingProjectId === 'new' ? 'Instatialize Project Card' : `Refine Project: ${projectForm.title}`}
            </h3>
            <button
              type="button"
              onClick={() => setEditingProjectId(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Cancel changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Project Title */}
            <div className="space-y-1">
              <label htmlFor="pform-title" className="text-xs font-bold text-slate-505 block">Title</label>
              <input
                id="pform-title"
                type="text"
                value={projectForm.title || ''}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                required
                placeholder="E.g., Crop Disease Deep Classifier"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label htmlFor="pform-slug" className="text-xs font-bold text-slate-505 block">Slug</label>
              <input
                id="pform-slug"
                type="text"
                value={projectForm.slug || ''}
                onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                placeholder="crop-disease-detection"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Github URL */}
            <div className="space-y-1">
              <label htmlFor="pform-github" className="text-xs font-bold text-slate-505 block">GitHub Context Link</label>
              <input
                id="pform-github"
                type="text"
                value={projectForm.github_url || ''}
                onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                placeholder="https://github.com/qm-rajat/repo"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Live demo deployment link */}
            <div className="space-y-1">
              <label htmlFor="pform-live" className="text-xs font-bold text-slate-505 block">Live Demo Link</label>
              <input
                id="pform-live"
                type="text"
                value={projectForm.live_url || ''}
                onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                placeholder="https://crop-disease.example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Primary Picture Link */}
            <div className="space-y-1">
              <label htmlFor="pform-image" className="text-xs font-bold text-slate-505 block">Primary Picture URL</label>
              <input
                id="pform-image"
                type="text"
                value={projectForm.images?.[0] || ''}
                onChange={(e) => {
                  const currentImages = projectForm.images || [];
                  const newImages = [e.target.value, ...currentImages.slice(1)];
                  setProjectForm({ ...projectForm, images: newImages.filter(Boolean) });
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Secondary Images Link */}
            <div className="space-y-1">
              <label htmlFor="pform-secondary-images" className="text-xs font-bold text-slate-505 block">Secondary Images URLs (Comma Separated)</label>
              <input
                id="pform-secondary-images"
                type="text"
                value={secondaryImagesInput}
                onChange={(e) => setSecondaryImagesInput(e.target.value)}
                placeholder="https://images.unsplash.com/..., https://..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Category / Profile Domain */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label htmlFor="pform-category" className="text-xs font-bold text-slate-505 block">
                  Category & Profile Domain
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  Synced with configured Profiles &amp; Domains
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    id="pform-category"
                    type="text"
                    value={projectForm.category || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    placeholder="Select below or type custom domain (e.g., Product Management, Cybersecurity)..."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                  />
                  {projectForm.category && (
                    <button
                      type="button"
                      onClick={() => setProjectForm({ ...projectForm, category: '' })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                      title="Clear category"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  aria-label="Quick Select Domain Category"
                  value={existingCategories.includes(projectForm.category || '') ? (projectForm.category || '') : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setProjectForm({ ...projectForm, category: e.target.value });
                    }
                  }}
                  className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden cursor-pointer shrink-0"
                >
                  <option value="">⚡ Quick Select Domain...</option>
                  {existingCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Select Domain Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono mr-1">Available Domains:</span>
                {existingCategories.map((cat) => {
                  const isSelected = (projectForm.category || '').toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setProjectForm({ 
                          ...projectForm, 
                          category: isSelected ? '' : cat 
                        });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Key Metric */}
            <div className="space-y-1">
              <label htmlFor="pform-key-metric" className="text-xs font-bold text-slate-505 block">Key Metric</label>
              <input
                id="pform-key-metric"
                type="text"
                value={typeof projectForm.key_metric === 'string' ? projectForm.key_metric : (projectForm.key_metric?.value || '')}
                onChange={(e) => setProjectForm({ ...projectForm, key_metric: e.target.value })}
                placeholder="e.g., +40% efficiency"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Display Order & Featured Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="pform-order" className="text-xs font-bold text-slate-505 block">Display Order</label>
                <input
                  id="pform-order"
                  type="number"
                  value={projectForm.display_order ?? 1}
                  onChange={(e) => setProjectForm({ ...projectForm, display_order: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                />
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center gap-2 pt-6 pl-2">
                <input
                  id="pform-featured"
                  type="checkbox"
                  checked={projectForm.is_featured || false}
                  onChange={(e) => setProjectForm({ ...projectForm, is_featured: e.target.checked })}
                  className="w-4 h-4 text-primary rounded-md border-slate-200 cursor-pointer"
                />
                <label htmlFor="pform-featured" className="text-xs font-bold text-slate-700 block cursor-pointer">Is Featured card</label>
              </div>
            </div>
          </div>

          {/* Tech stack tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="pform-tech" className="text-xs font-bold text-slate-505 block">
                Technologies Applied (Comma Separated)
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                Synced with Skills &amp; Profiles catalog
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  id="pform-tech"
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="e.g. Python, OpenCV, TensorFlow, Deep Learning"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                />
                {techInput && (
                  <button
                    type="button"
                    onClick={() => setTechInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                    title="Clear technologies"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                aria-label="Add Technology from Catalog"
                value=""
                onChange={(e) => {
                  const techToAdd = e.target.value;
                  if (!techToAdd) return;
                  const current = techInput.split(',').map(t => t.trim()).filter(Boolean);
                  if (!current.some(t => t.toLowerCase() === techToAdd.toLowerCase())) {
                    setTechInput([...current, techToAdd].join(', '));
                  }
                }}
                className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden cursor-pointer shrink-0"
              >
                <option value="">⚡ Add Tech from Catalog...</option>
                {availableSkillsList.map((skill) => (
                  <option key={skill} value={skill}>
                    + {skill}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Add / Remove Tech Chips from Catalog */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                  Catalog Quick Toggle:
                </span>
                <span className="text-[10px] text-slate-400">
                  Click to add / remove from project
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-slate-50/70 rounded-xl border border-slate-150">
                {availableSkillsList.map((skill) => {
                  const currentTechs = techInput.split(',').map(t => t.trim()).filter(Boolean);
                  const isSelected = currentTechs.some(t => t.toLowerCase() === skill.toLowerCase());
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          const filtered = currentTechs.filter(t => t.toLowerCase() !== skill.toLowerCase());
                          setTechInput(filtered.join(', '));
                        } else {
                          setTechInput([...currentTechs, skill].join(', '));
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

          {/* Long description */}
          <div className="space-y-1">
            <label htmlFor="pform-desc" className="text-xs font-bold text-slate-505 block">Technical Description</label>
            <textarea
              id="pform-desc"
              value={projectForm.description || ''}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              rows={4}
              required
              placeholder="Provide full description..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Problem Statement */}
            <div className="space-y-1">
              <label htmlFor="pform-problem" className="text-xs font-bold text-slate-505 block">Problem Statement</label>
              <textarea
                id="pform-problem"
                value={projectForm.problem_statement || ''}
                onChange={(e) => setProjectForm({ ...projectForm, problem_statement: e.target.value })}
                rows={3}
                placeholder="What was the core problem..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden resize-none"
              />
            </div>

            {/* Solution Details */}
            <div className="space-y-1">
              <label htmlFor="pform-solution" className="text-xs font-bold text-slate-505 block">Solution Details</label>
              <textarea
                id="pform-solution"
                value={projectForm.solution_details || ''}
                onChange={(e) => setProjectForm({ ...projectForm, solution_details: e.target.value })}
                rows={3}
                placeholder="How was it solved..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden resize-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="pform-features" className="text-xs font-bold text-slate-505 block">Core Features (Comma Separated)</label>
            <input
              id="pform-features"
              type="text"
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              placeholder="Real-time syncing, OAuth, Analytics Dashboard"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="pform-architecture" className="text-xs font-bold text-slate-505 block">Architecture Highlights (Comma Separated)</label>
            <input
              id="pform-architecture"
              type="text"
              value={archInput}
              onChange={(e) => setArchInput(e.target.value)}
              placeholder="Microservices, Serverless, Event-Driven"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
            />
          </div>

          {/* SEO Section */}
          <div className="mt-4">
            <h4 className="text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">SEO Meta</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="pform-seo-title" className="text-xs font-bold text-slate-505 block">SEO Title</label>
                <input
                  id="pform-seo-title"
                  type="text"
                  value={projectForm.seo_title || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, seo_title: e.target.value })}
                  placeholder="Title for search engines"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="pform-seo-desc" className="text-xs font-bold text-slate-505 block">SEO Description</label>
                <input
                  id="pform-seo-desc"
                  type="text"
                  value={projectForm.seo_description || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, seo_description: e.target.value })}
                  placeholder="Meta description"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label htmlFor="pform-seo-keys" className="text-xs font-bold text-slate-505 block">SEO Keywords</label>
                <input
                  id="pform-seo-keys"
                  type="text"
                  value={projectForm.seo_keywords || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, seo_keywords: e.target.value })}
                  placeholder="keyword1, keyword2"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:scale-101 active:scale-98 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" /> Save project
          </button>
        </form>
      )}
    </div>
  );
};
