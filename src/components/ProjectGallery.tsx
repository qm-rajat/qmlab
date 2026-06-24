import React, { useState } from 'react';
import { Github, ExternalLink, X, ChevronLeft, ChevronRight, Code, Tag, Layers } from 'lucide-react';
import { Project } from '../types';

interface ProjectGalleryProps {
  projects: Project[];
}

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const curatedFilters = [
    { label: 'Python & Scripting', key: 'Python' },
    { label: 'QA Automation', key: 'QA Automation' },
    { label: 'Machine Learning & AI', key: 'Machine Learning' },
    { label: 'Technical SEO & Security', key: 'SEO' },
    { label: 'Analytics & BI', key: 'BI' }
  ];

  const matchesFilter = (project: Project, filterKey: string) => {
    const query = filterKey.toLowerCase();
    const searchString = [
      project.title,
      project.description,
      ...project.technologies
    ].join(' ').toLowerCase();

    if (query === 'python') {
      return searchString.includes('python') || searchString.includes('bash') || searchString.includes('shell') || searchString.includes('parrot os');
    }
    if (query === 'qa automation') {
      return searchString.includes('pytest') || searchString.includes('selenium') || searchString.includes('automation') || searchString.includes('testing');
    }
    if (query === 'machine learning') {
      return searchString.includes('scikit') || searchString.includes('learning') || searchString.includes('tensorflow') || searchString.includes('keras') || searchString.includes('opencv') || searchString.includes('classification');
    }
    if (query === 'seo') {
      return searchString.includes('seo') || searchString.includes('security') || searchString.includes('nmap') || searchString.includes('pentest');
    }
    if (query === 'bi') {
      return searchString.includes('bi') || searchString.includes('power bi') || searchString.includes('excel') || searchString.includes('business intelligence');
    }
    
    return project.technologies.some(t => t.toLowerCase().includes(query));
  };

  const filteredProjects = selectedTag
    ? projects.filter(p => matchesFilter(p, selectedTag))
    : projects;

  const handleProjectClick = (proj: Project) => {
    setSelectedProject(proj);
    setActiveImgIdx(0);
  };

  return (
    <div className="space-y-8 no-print">
      {/* Horizontal horizontal-scrolling tags categorizer bar */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold select-none cursor-pointer transition-all ${
            selectedTag === null
              ? 'bg-primary-light text-primary border border-primary-light font-bold shadow-xs'
              : 'text-slate-500 bg-slate-50 hover:bg-slate-100 border border-transparent'
          }`}
        >
          All Areas ({projects.length})
        </button>
        {curatedFilters.map((filter) => {
          const isActive = selectedTag === filter.key;
          const count = projects.filter(p => matchesFilter(p, filter.key)).length;
          if (count === 0) return null; // Only show filters that have matching projects
          return (
            <button
              key={filter.key}
              onClick={() => setSelectedTag(filter.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold select-none cursor-pointer transition-all ${
                isActive
                  ? 'bg-primary-light text-primary border border-primary-light font-bold shadow-xs'
                  : 'text-slate-500 bg-slate-50 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {filter.label} <span className="opacity-50 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Bento-style CSS grid for gallery */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Code className="w-12 h-12 stroke-[1] mx-auto mb-3 text-slate-300" />
          No projects matching this technical query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className="bg-white rounded-2xl border border-slate-150/70 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col cursor-pointer h-full"
            >
              {/* Media banner */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden border-b border-slate-100">
                <img
                  src={project.images[0] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center p-4">
                    <p className="text-white text-xs font-bold uppercase tracking-widest mb-1.5">View Architecture</p>
                    <div className="w-10 h-0.5 bg-[#0084ff] mx-auto" />
                  </div>
                </div>
              </div>

              {/* Information body with customized electric borders */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2.5">
                    {project.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1 border-t border-slate-10 border-dashed pt-4 mt-5">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-[9px] font-extrabold uppercase bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-lg">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project detail lightbox details modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in no-print">
          {/* Backdrop dismiss */}
          <div className="absolute inset-0" onClick={() => setSelectedProject(null)} />

          <div className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col border border-slate-100 max-h-[90vh]">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-4 top-4 p-2 bg-white/95 hover:bg-slate-100 rounded-full text-slate-550 border border-slate-200/50 shadow-xs z-20 cursor-pointer flex items-center justify-center transition-colors hover:text-slate-900"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="overflow-y-auto scrollbar-none flex-1">
              {/* Image Carousel (handles multi-image scenarios) */}
              <div className="relative aspect-16/10 bg-slate-50 overflow-hidden border-b border-slate-100">
                <img
                  src={selectedProject.images[activeImgIdx] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'}
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {selectedProject.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImgIdx(prev => prev > 0 ? prev - 1 : selectedProject.images.length - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-full border border-slate-100 shadow-md cursor-pointer flex items-center justify-center active:scale-90"
                    >
                      <ChevronLeft className="w-4 h-4 text-primary" />
                    </button>
                    <button
                      onClick={() => setActiveImgIdx(prev => prev < selectedProject.images.length - 1 ? prev + 1 : 0)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-full border border-slate-100 shadow-md cursor-pointer flex items-center justify-center active:scale-90"
                    >
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </button>
                    {/* Dots indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 bg-black/30 p-1.5 rounded-full">
                      {selectedProject.images.map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeImgIdx ? 'bg-white' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Contents Area with customized layouts */}
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {selectedProject.title}
                  </h3>
                  {selectedProject.created_at && (
                    <span className="text-[10px] font-mono font-medium text-slate-400 block mt-1.5 uppercase tracking-wider">
                      Published • {new Date(selectedProject.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-primary pl-200 block sm:inline-block">
                    Project Architecture
                  </h4>
                  <p className="text-sm text-slate-650 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Technology specs pillstack */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400" /> Applied Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-bold uppercase tracking-wide bg-blue-50/60 hover:bg-blue-100/30 text-primary border border-blue-100/50 px-2.5 py-1 rounded-xl transition-all"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct code and demo action headers */}
            {(selectedProject.github_url || selectedProject.live_url) && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 no-print">
                {selectedProject.github_url && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-350 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                    title="Inspect code repositories on GitHub"
                  >
                    <Github className="w-3.5 h-3.5 text-slate-600" />
                    GitHub Source
                  </a>
                )}
                {selectedProject.live_url && (
                  <a
                    href={selectedProject.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 active:scale-95 transition-all"
                    title="Launch live interactive demo application"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Launch App
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
