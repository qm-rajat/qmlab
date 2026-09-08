import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import { Project } from '../../types';

interface AdminProjectsTabProps {
  projects: Project[];
  onUpdateProjects: (proj: Project[]) => void;
  onDeleteProjectRequest: (id: string, title: string) => void;
}

export const AdminProjectsTab: React.FC<AdminProjectsTabProps> = ({
  projects,
  onUpdateProjects,
  onDeleteProjectRequest,
}) => {
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});
  const [techInput, setTechInput] = useState<string>('');
  const [featuresInput, setFeaturesInput] = useState<string>('');
  const [archInput, setArchInput] = useState<string>('');
  const [secondaryImagesInput, setSecondaryImagesInput] = useState<string>('');

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
        project_type: 'both'
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
                            <div className="flex flex-wrap items-center gap-1.5">
                              <div className="font-bold text-slate-900 text-sm leading-tight">{proj.title}</div>
                              {proj.project_type === 'company' && (
                                <span className="text-[8px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded-md">🏢 Company</span>
                              )}
                              {proj.project_type === 'portfolio' && (
                                <span className="text-[8px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-105/10 px-1.5 py-0.5 rounded-md">👨‍💻 Portfolio</span>
                              )}
                              {(proj.project_type === 'both' || !proj.project_type) && (
                                <span className="text-[8px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded-md">🌟 Both</span>
                              )}
                            </div>
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

            {/* Category */}
            <div className="space-y-1">
              <label htmlFor="pform-category" className="text-xs font-bold text-slate-505 block">Category</label>
              <input
                id="pform-category"
                type="text"
                value={projectForm.category || ''}
                onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                placeholder="e.g., Automation, ML, Cybersecurity"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
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

            {/* Display Order & Section Designation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

              <div className="space-y-1">
                <label htmlFor="pform-type" className="text-xs font-bold text-slate-505 block">Designation Section</label>
                <select
                  id="pform-type"
                  value={projectForm.project_type || 'both'}
                  onChange={(e) => setProjectForm({ ...projectForm, project_type: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden cursor-pointer"
                >
                  <option value="company">🏢 Company Project</option>
                  <option value="portfolio">👨‍💻 Portfolio Project</option>
                  <option value="both">🌟 Both Sections</option>
                </select>
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center gap-2 pt-6 pl-2">
                <input
                  id="pform-featured"
                  type="checkbox"
                  checked={projectForm.is_featured || false}
                  onChange={(e) => setProjectForm({ ...projectForm, is_featured: e.target.checked })}
                  className="w-4 h-4 text-primary rounded-md border-slate-200"
                />
                <label htmlFor="pform-featured" className="text-xs font-bold text-slate-700 block">Is Featured card</label>
              </div>
            </div>
          </div>

          {/* Tech stack tags */}
          <div className="space-y-1">
            <label htmlFor="pform-tech" className="text-xs font-bold text-slate-505 block">Technologies Applied (Comma Separated)</label>
            <input
              id="pform-tech"
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Python, OpenCV, TensorFlow, Deep Learning"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
            />
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
