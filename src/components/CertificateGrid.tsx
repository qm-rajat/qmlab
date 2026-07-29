import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Eye, X, ChevronLeft, ChevronRight, BookOpen, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Certificate } from '../types';

interface CertificateGridProps {
  certificates: Certificate[];
}

type CategoryFilter = 'all' | 'cybersecurity' | 'data-science' | 'web-development' | 'seo-digital-marketing';

export default function CertificateGrid({ certificates }: CertificateGridProps) {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Group translations for clean category tagging
  const categoryNames = {
    all: 'All Credentials',
    cybersecurity: 'Cybersecurity & Audits',
    'data-science': 'Data Science & ML',
    'web-development': 'Web Development',
    'seo-digital-marketing': 'SEO & Digital Strategy'
  };

  const getShorthandCategory = (cat: string) => {
    switch (cat) {
      case 'cybersecurity': return 'Security';
      case 'data-science': return 'Data & ML';
      case 'web-development': return 'Web Dev';
      case 'seo-digital-marketing': return 'SEO & Marketing';
      default: return 'Other';
    }
  };

  // Get color configurations for each certificate category matching his logo style
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'cybersecurity': return 'bg-rose-50 border-rose-100/50 text-rose-600';
      case 'data-science': return 'bg-emerald-50 border-emerald-100/50 text-emerald-600';
      case 'web-development': return 'bg-blue-50 border-blue-100/50 text-primary';
      case 'seo-digital-marketing': return 'bg-amber-50 border-amber-100/50 text-amber-600';
      default: return 'bg-slate-50 border-slate-100/50 text-slate-500';
    }
  };

  // Filter list
  const filteredCerts = filter === 'all'
    ? certificates
    : certificates.filter(c => c.category === filter);

  // Keyboard navigation inside lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') setSelectedIdx(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx, filteredCerts]);

  const handleNext = () => {
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev !== null && prev < filteredCerts.length - 1) ? prev + 1 : 0);
  };

  const handlePrev = () => {
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev !== null && prev > 0) ? prev - 1 : filteredCerts.length - 1);
  };

  return (
    <div className="space-y-8 no-print">
      {/* Tab Filter Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-slate-100 pb-2">
        {(Object.keys(categoryNames) as CategoryFilter[]).map((key) => {
          const isActive = filter === key;
          return (
            <button
              key={key}
              onClick={() => {
                setFilter(key);
                setSelectedIdx(null);
              }}
              className={`relative px-4 py-2 text-xs font-semibold rounded-xl tracking-wide transition-all cursor-pointer ${
                isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeCertFilter"
                  className="absolute inset-0 bg-blue-50/70 border border-blue-100/40 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {categoryNames[key]}
            </button>
          );
        })}
      </div>

      {/* Grid Layout (supports masonry) */}
      {filteredCerts.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Award className="w-12 h-12 stroke-[1] mx-auto mb-3 text-slate-300" />
          No certifications logged under this folder.
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCerts.map((cert, idx) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-slate-150/70 overflow-hidden shadow-xs hover:shadow-lg transition-shadow group flex flex-col"
              >
                {/* Image Preview with overlay */}
                <div className="relative aspect-4/3 bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100 p-4">
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-[1.02] transition-transform duration-500 shadow-xs"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedIdx(idx)}
                      className="p-2.5 bg-white rounded-full text-slate-800 hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center"
                      title="Examine certificate zoom"
                    >
                      <Eye className="w-4.5 h-4.5 text-primary" />
                    </button>
                    {cert.verify_url && (
                      <a
                        href={cert.verify_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-white rounded-full text-slate-800 hover:scale-110 active:scale-95 transition-all shadow-md flex items-center justify-center"
                        title="Direct verify verification URL link"
                      >
                        <ExternalLink className="w-4.5 h-4.5 text-indigo-500" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Text Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryTheme(cert.category)}`}>
                        {getShorthandCategory(cert.category)}
                      </span>
                      {cert.issue_date && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(cert.issue_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {cert.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Issued by <strong className="font-semibold text-slate-700">{cert.issuer}</strong>
                    </p>
                  </div>

                  {cert.credential_id && (
                    <div className="border-t border-slate-100 pt-3 mt-4 text-[10px] font-mono text-slate-450 truncate">
                      ID: {cert.credential_id}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Zoomable Lightbox Modal with Key Event Navs */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in no-print">
          {/* Backdrop Dismiss */}
          <div className="absolute inset-0" onClick={() => setSelectedIdx(null)} />

          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col items-center border border-slate-100/10">
            {/* Header controls */}
            <div className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm md:text-base line-clamp-1">
                  {filteredCerts[selectedIdx].title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Authority: {filteredCerts[selectedIdx].issuer} 
                  {filteredCerts[selectedIdx].credential_id && ` • CredID: ${filteredCerts[selectedIdx].credential_id}`}
                </p>
              </div>
              <button
                onClick={() => setSelectedIdx(null)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main view frame with Left/Right triggers */}
            <div className="relative w-full aspect-16/10 max-h-[60vh] bg-slate-50 flex items-center justify-center p-4 md:p-6">
              {/* Image Frame */}
              <img
                src={filteredCerts[selectedIdx].image_url}
                alt={filteredCerts[selectedIdx].title}
                className="max-w-full max-h-full object-contain rounded-lg border border-slate-200/50 shadow-md animate-[scale_0.25s_ease-out]"
              />

              {/* Prev button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/95 hover:bg-white text-slate-800 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md z-20 cursor-pointer border border-slate-100 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-primary" />
              </button>

              {/* Next button */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/95 hover:bg-white text-slate-800 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md z-20 cursor-pointer border border-slate-100 flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* Footer triggers */}
            <div className="w-full bg-slate-50/50 px-6 py-4 flex items-center justify-between border-t border-slate-150/60 text-xs text-slate-500 font-mono">
              <span>{selectedIdx + 1} of {filteredCerts.length} credentials</span>
              {filteredCerts[selectedIdx].verify_url && (
                <a
                  href={filteredCerts[selectedIdx].verify_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold flex items-center gap-1 transition-all shadow-xs"
                >
                  Verify Online <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
