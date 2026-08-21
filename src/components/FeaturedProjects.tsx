import React from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { ArrowUpRight, ExternalLink, Github, Sparkles, Layers, ShieldCheck, TrendingUp, Cpu } from 'lucide-react';

interface FeaturedProjectsProps {
  projects: Project[];
  onViewAll: () => void;
  onSelectProject?: (project: Project) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects,
  onViewAll
}) => {
  // Flagship selected projects
  const featured = projects.slice(0, 3);

  return (
    <section className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold text-[#0084ff] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            FLAGSHIP CASE STUDIES
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
            Featured Engineering Work
          </h3>
        </div>

        <button
          onClick={onViewAll}
          className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#0084ff] hover:text-blue-700 uppercase tracking-wider font-mono cursor-pointer transition-colors"
        >
          View All {projects.length} Projects
          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((proj, idx) => (
          <motion.div
            key={proj.id || idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            className="group bg-white rounded-3xl border border-slate-200/80 hover:border-blue-500/40 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Project Image Header */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-150">
                {proj.image_url ? (
                  <img
                    src={proj.image_url}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-[#0084ff]">
                    <Layers className="w-10 h-10 opacity-40" />
                  </div>
                )}
                
                {proj.category && (
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-xs">
                    {proj.category}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="text-base font-extrabold text-slate-900 group-hover:text-[#0084ff] transition-colors leading-snug font-sans mb-1.5">
                  {proj.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Technologies Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.technologies.slice(0, 4).map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
                  >
                    {tech}
                  </span>
                ))}
                {proj.technologies.length > 4 && (
                  <span className="text-[10px] font-mono text-slate-400 self-center">
                    +{proj.technologies.length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Action Links */}
            <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {proj.github_url && (
                  <a
                    href={proj.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="View Source Code"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {proj.live_url && (
                  <a
                    href={proj.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Open Live Preview"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {proj.live_url ? (
                <a
                  href={proj.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0084ff] hover:text-blue-700 font-sans"
                >
                  Live Demo
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-[11px] font-mono text-slate-400">Production Repo</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects;
