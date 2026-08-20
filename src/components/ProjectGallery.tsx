import React, { useState, useEffect, useMemo } from 'react';
import { 
  Github, ExternalLink, X, ChevronLeft, ChevronRight, 
  Code, Tag, Layers, Search, Star, Globe, Cpu, 
  ShieldCheck, CheckCircle2, Sparkles, Copy, Check,
  Terminal, BarChart3, Bot, Network, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';

interface ProjectGalleryProps {
  projects: Project[];
}

type CategoryFilter = 'all' | 'automation' | 'machine-learning' | 'cybersecurity' | 'data-bi' | 'web-systems';
type SortOption = 'featured' | 'newest' | 'alphabetical';

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [openSourceOnly, setOpenSourceOnly] = useState(false);
  const [liveOnly, setLiveOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [copiedCloneUrl, setCopiedCloneUrl] = useState<string | null>(null);

  // Category naming map
  const categoryLabels: Record<CategoryFilter, string> = {
    all: 'All Systems',
    automation: 'QA Automation & Testing',
    'machine-learning': 'AI & Machine Learning',
    cybersecurity: 'Cybersecurity & Pentesting',
    'data-bi': 'BI & Data Analytics',
    'web-systems': 'Full-Stack & Web Systems'
  };

  const getCategoryTheme = (cat?: string) => {
    switch (cat) {
      case 'automation': return 'bg-blue-50 border-blue-200 text-[#0084ff]';
      case 'machine-learning': return 'bg-purple-50 border-purple-200 text-purple-600';
      case 'cybersecurity': return 'bg-rose-50 border-rose-200 text-rose-600';
      case 'data-bi': return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'web-systems': return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      default: return 'bg-slate-50 border-slate-200 text-slate-600';
    }
  };

  const getCategoryIcon = (cat?: string) => {
    switch (cat) {
      case 'automation': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'machine-learning': return <Bot className="w-3.5 h-3.5" />;
      case 'cybersecurity': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'data-bi': return <BarChart3 className="w-3.5 h-3.5" />;
      case 'web-systems': return <Globe className="w-3.5 h-3.5" />;
      default: return <Cpu className="w-3.5 h-3.5" />;
    }
  };

  // Filter & sort logic
  const filteredAndSortedProjects = useMemo(() => {
    let result = projects.filter((p) => {
      // Category filter
      if (categoryFilter !== 'all' && p.category !== categoryFilter) {
        // Fallback matching if legacy data doesn't have explicit category
        const searchString = [p.title, p.description, ...p.technologies].join(' ').toLowerCase();
        if (categoryFilter === 'automation' && !searchString.includes('pytest') && !searchString.includes('selenium') && !searchString.includes('automation')) return false;
        if (categoryFilter === 'machine-learning' && !searchString.includes('learning') && !searchString.includes('scikit') && !searchString.includes('vision')) return false;
        if (categoryFilter === 'cybersecurity' && !searchString.includes('security') && !searchString.includes('pentest') && !searchString.includes('nmap')) return false;
        if (categoryFilter === 'data-bi' && !searchString.includes('power bi') && !searchString.includes('bi') && !searchString.includes('excel')) return false;
        if (categoryFilter === 'web-systems' && !searchString.includes('react') && !searchString.includes('typescript') && !searchString.includes('web')) return false;
      }

      // Feature filter
      if (featuredOnly && !p.is_featured) return false;

      // Open source code only
      if (openSourceOnly && !p.github_url) return false;

      // Live demo only
      if (liveOnly && !p.live_url) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTech = p.technologies.some(t => t.toLowerCase().includes(q));
        const matchesHighlights = p.architecture_highlights?.some(h => h.toLowerCase().includes(q)) ?? false;
        if (!matchesTitle && !matchesDesc && !matchesTech && !matchesHighlights) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return a.display_order - b.display_order;
      }
      if (sortBy === 'newest') {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [projects, categoryFilter, featuredOnly, openSourceOnly, liveOnly, searchQuery, sortBy]);

  // Overall metric counts
  const metrics = useMemo(() => {
    const total = projects.length;
    const openSourceCount = projects.filter(p => !!p.github_url).length;
    const liveCount = projects.filter(p => !!p.live_url).length;
    const featuredCount = projects.filter(p => p.is_featured).length;
    return { total, openSourceCount, liveCount, featuredCount };
  }, [projects]);

  const handleProjectClick = (proj: Project) => {
    setSelectedProject(proj);
    setActiveImgIdx(0);
  };

  const handleCopyClone = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    const command = `git clone ${url}.git`;
    navigator.clipboard.writeText(command);
    setCopiedCloneUrl(url);
    setTimeout(() => setCopiedCloneUrl(null), 2500);
  };

  const handleResetFilters = () => {
    setCategoryFilter('all');
    setSearchQuery('');
    setFeaturedOnly(false);
    setOpenSourceOnly(false);
    setLiveOnly(false);
    setSortBy('featured');
  };

  // Keyboard navigation for Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === 'Escape') setSelectedProject(null);
      if (e.key === 'ArrowRight' && selectedProject.images.length > 1) {
        setActiveImgIdx(prev => (prev < selectedProject.images.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowLeft' && selectedProject.images.length > 1) {
        setActiveImgIdx(prev => (prev > 0 ? prev - 1 : selectedProject.images.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  return (
    <div className="space-y-8 no-print" id="project-gallery-root">

      {/* 1. ENGINEERING SHOWCASE METRICS HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-left border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Terminal className="w-4 h-4 text-blue-400" /> ENGINEERING REPOSITORIES &amp; ARCHITECTURES
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
              Production Systems &amp; Technical Builds
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              Open-source automation frameworks, machine learning predictive models, vulnerability analysis scanners, and high-frequency streaming dashboards engineered for speed and reliability.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="md:col-span-5 grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-white font-mono">{metrics.total}</div>
              <div className="text-[10px] font-mono text-slate-300 uppercase tracking-wider mt-0.5">Systems</div>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-blue-400 font-mono">{metrics.openSourceCount}</div>
              <div className="text-[10px] font-mono text-slate-300 uppercase tracking-wider mt-0.5">Open Source</div>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-emerald-400 font-mono">{metrics.liveCount}</div>
              <div className="text-[10px] font-mono text-slate-300 uppercase tracking-wider mt-0.5">Live Demos</div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROL MATRIX */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 md:p-6 space-y-4 text-left">
        
        {/* Top Row: Search input + Toggles + Sorting */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by system title, tech (Selenium, PyTest, React), or keyword..."
              className="w-full pl-9.5 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:border-[#0084ff] focus:outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold font-mono cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Toggles & Sorting */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Featured Pill */}
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                featuredOnly
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${featuredOnly ? 'fill-white' : 'text-amber-500'}`} />
              Featured
            </button>

            {/* Open Source Pill */}
            <button
              onClick={() => setOpenSourceOnly(!openSourceOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                openSourceOnly
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              Source Code
            </button>

            {/* Live Demos Pill */}
            <button
              onClick={() => setLiveOnly(!liveOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                liveOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Live Demos
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-block">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:border-[#0084ff] focus:outline-hidden cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Latest Added</option>
                <option value="alphabetical">Title (A-Z)</option>
              </select>
            </div>

          </div>

        </div>

        {/* Categories Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mr-1">
              Discipline:
            </span>
            {(Object.keys(categoryLabels) as CategoryFilter[]).map((key) => {
              const isActive = categoryFilter === key;
              const count = key === 'all'
                ? projects.length
                : projects.filter(p => p.category === key).length;

              return (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {getCategoryIcon(key)}
                  {categoryLabels[key]}
                  <span className="opacity-60 font-mono text-[11px]">({count})</span>
                </button>
              );
            })}
          </div>

          {(categoryFilter !== 'all' || searchQuery || featuredOnly || openSourceOnly || liveOnly || sortBy !== 'featured') && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-mono font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

      </div>

      {/* 3. BENTO PROJECT GRID */}
      {filteredAndSortedProjects.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-slate-200/80 rounded-3xl space-y-4">
          <Code className="w-12 h-12 text-slate-300 mx-auto stroke-[1.2]" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-800">No project architectures matched your query</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query, toggling open-source / live filters, or selecting All Systems.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Media banner */}
                  <div 
                    onClick={() => handleProjectClick(project)}
                    className="relative aspect-16/10 bg-slate-900 overflow-hidden border-b border-slate-100 cursor-pointer"
                  >
                    <img
                      src={project.images[0] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-lg shadow-xs backdrop-blur-xs border ${getCategoryTheme(project.category)}`}>
                        {project.category ? project.category.replace('-', ' ') : 'Engineering'}
                      </span>
                      {project.is_featured && (
                        <span className="p-1 rounded-lg bg-amber-400 text-slate-900 shadow-xs" title="Featured Architecture">
                          <Star className="w-3 h-3 fill-slate-900" />
                        </span>
                      )}
                    </div>

                    {/* Top Right: Key Metric Badge if defined */}
                    {project.key_metric && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900/90 text-emerald-400 border border-slate-700 shadow-xs backdrop-blur-xs">
                          {project.key_metric.label}: <strong className="text-white">{project.key_metric.value}</strong>
                        </span>
                      </div>
                    )}

                    {/* Multi-Image Indicator */}
                    {project.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                        +{project.images.length} visuals
                      </div>
                    )}

                    {/* Hover Inspect Overlay */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <div className="text-center space-y-1 transform group-hover:scale-100 scale-95 transition-transform">
                        <span className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 mx-auto">
                          <Terminal className="w-3.5 h-3.5 text-[#0084ff]" /> Inspect Architecture
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Information body */}
                  <div className="p-5 sm:p-6 space-y-3">
                    
                    {/* Title */}
                    <h4 
                      onClick={() => handleProjectClick(project)}
                      className="text-base font-black text-slate-900 group-hover:text-[#0084ff] transition-colors leading-snug line-clamp-2 cursor-pointer"
                    >
                      {project.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Applied Technology Badges */}
                    <div className="flex flex-wrap gap-1 pt-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/50"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-150">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                  </div>
                </div>

                {/* Footer Action Links */}
                <div className="px-5 sm:px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  
                  {/* Left: View Specs trigger */}
                  <button
                    onClick={() => handleProjectClick(project)}
                    className="text-xs font-bold text-slate-600 hover:text-[#0084ff] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Architecture <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Right: Code & Demo Launchers */}
                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-[#0084ff] hover:bg-blue-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs"
                        title="Launch Live Application"
                      >
                        Demo <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 4. TECHNICAL ARCHITECTURE DEEP-DIVE LIGHTBOX MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in no-print">
          
          {/* Backdrop Dismiss */}
          <div className="absolute inset-0" onClick={() => setSelectedProject(null)} />

          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col items-stretch border border-slate-200 text-left max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-150 shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getCategoryTheme(selectedProject.category)}`}>
                    {selectedProject.category ? selectedProject.category.replace('-', ' ') : 'Engineering Architecture'}
                  </span>
                  {selectedProject.is_featured && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Flagship Build
                    </span>
                  )}
                </div>
                <h3 className="font-black text-slate-900 text-base sm:text-lg line-clamp-1">
                  {selectedProject.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                title="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto scrollbar-none flex-1 space-y-6">
              
              {/* Image Preview Carousel Frame with Adaptive Backdrop */}
              <div className="relative w-full h-64 sm:h-80 md:h-96 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-200/60 group/img">
                
                {/* Ambient Blurred Backdrop for Aspect Ratio Harmony */}
                <img
                  src={selectedProject.images[activeImgIdx] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'}
                  alt=""
                  aria-hidden="true"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 select-none pointer-events-none"
                />

                {/* Main Foreground High-Res Image */}
                <div className="relative z-10 max-w-full max-h-full p-3 sm:p-4 flex items-center justify-center">
                  <img
                    src={selectedProject.images[activeImgIdx] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'}
                    alt={selectedProject.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800';
                    }}
                    className="max-w-full max-h-[220px] sm:max-h-[280px] md:max-h-[340px] w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/10"
                  />
                </div>

                {selectedProject.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImgIdx(prev => prev > 0 ? prev - 1 : selectedProject.images.length - 1)}
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/95 hover:bg-white text-slate-900 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl z-20 cursor-pointer border border-slate-200 flex items-center justify-center"
                      title="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#0084ff]" />
                    </button>
                    <button
                      onClick={() => setActiveImgIdx(prev => prev < selectedProject.images.length - 1 ? prev + 1 : 0)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/95 hover:bg-white text-slate-900 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl z-20 cursor-pointer border border-slate-200 flex items-center justify-center"
                      title="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-[#0084ff]" />
                    </button>

                    {/* Thumbnail Switcher */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full z-20 border border-white/10">
                      {selectedProject.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImgIdx(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                            i === activeImgIdx ? 'bg-[#0084ff] scale-125 ring-2 ring-white/50' : 'bg-white/40 hover:bg-white/70'
                          }`}
                          title={`View image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Detailed Specs Container */}
              <div className="px-6 md:px-8 pb-6 space-y-6">
                
                {/* Metric Strip if defined */}
                {selectedProject.key_metric && (
                  <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Benchmark Outcome</span>
                        <span className="text-sm font-bold text-white">{selectedProject.key_metric.label}</span>
                      </div>
                    </div>
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      {selectedProject.key_metric.value}
                    </span>
                  </div>
                )}

                {/* Problem Statement & Solution */}
                {(selectedProject.problem_statement || selectedProject.solution_details) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.problem_statement && (
                      <div className="p-4 bg-rose-50/70 border border-rose-100 rounded-2xl space-y-1">
                        <span className="text-[10px] font-mono font-bold text-rose-700 uppercase tracking-widest block">
                          Engineering Problem
                        </span>
                        <p className="text-xs text-rose-900 leading-relaxed">
                          {selectedProject.problem_statement}
                        </p>
                      </div>
                    )}
                    {selectedProject.solution_details && (
                      <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-1">
                        <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest block">
                          Architectural Solution
                        </span>
                        <p className="text-xs text-emerald-900 leading-relaxed">
                          {selectedProject.solution_details}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Architecture Highlights */}
                {selectedProject.architecture_highlights && selectedProject.architecture_highlights.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#0084ff]" /> Technical Architecture Highlights
                    </h5>
                    <div className="space-y-1.5">
                      {selectedProject.architecture_highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overview Description */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    System Specification
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-650 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Applied Technologies */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400" /> Applied Technologies &amp; Tooling
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono font-bold bg-blue-50 text-[#0084ff] border border-blue-200/60 px-3 py-1 rounded-xl"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Git Clone Command Box if repo available */}
                {selectedProject.github_url && (
                  <div className="p-3.5 bg-slate-900 text-slate-300 rounded-2xl font-mono text-xs flex items-center justify-between gap-3 border border-slate-800">
                    <div className="flex items-center gap-2 truncate">
                      <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate text-slate-200">
                        git clone {selectedProject.github_url}.git
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleCopyClone(e, selectedProject.github_url!)}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                      title="Copy clone command"
                    >
                      {copiedCloneUrl === selectedProject.github_url ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Modal Bottom Action Footer */}
            <div className="w-full bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-150 text-xs font-mono shrink-0">
              <span className="text-slate-400">
                Logged • {new Date(selectedProject.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </span>

              <div className="flex items-center gap-2.5">
                {selectedProject.github_url && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Github className="w-4 h-4" /> GitHub Repository
                  </a>
                )}
                {selectedProject.live_url && (
                  <a
                    href={selectedProject.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-[#0084ff] hover:bg-blue-600 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
                  >
                    <ExternalLink className="w-4 h-4" /> Launch Demo
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
