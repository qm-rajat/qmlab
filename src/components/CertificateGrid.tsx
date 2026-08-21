import React, { useState, useEffect, useMemo } from 'react';
import { 
  Award, ExternalLink, Eye, X, ChevronLeft, ChevronRight, 
  ShieldCheck, Check, Copy, Search, Filter, Sparkles, 
  Calendar, CheckCircle2, SlidersHorizontal, Building2,
  FileCheck, Shield, Bookmark, Star, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Certificate } from '../types';

interface CertificateGridProps {
  certificates: Certificate[];
}

type CategoryFilter = 'all' | 'cybersecurity' | 'data-science' | 'web-development' | 'seo-digital-marketing';

export default function CertificateGrid({ certificates }: CertificateGridProps) {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [issuerFilter, setIssuerFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Category labels mapping
  const categoryNames: Record<CategoryFilter, string> = {
    all: 'All Credentials',
    cybersecurity: 'Cybersecurity & Audits',
    'data-science': 'Data Science & ML',
    'web-development': 'Web Development',
    'seo-digital-marketing': 'SEO & Digital Strategy'
  };

  const getShorthandCategory = (cat: string) => {
    switch (cat) {
      case 'cybersecurity': return 'Security & Audits';
      case 'data-science': return 'Data & ML';
      case 'web-development': return 'Web Engineering';
      case 'seo-digital-marketing': return 'SEO & Growth';
      default: return 'Accreditation';
    }
  };

  // Color configurations for categories matching portfolio identity
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'cybersecurity': return 'bg-rose-50 border-rose-200 text-rose-600';
      case 'data-science': return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      case 'web-development': return 'bg-blue-50 border-blue-200 text-[#0084ff]';
      case 'seo-digital-marketing': return 'bg-amber-50 border-amber-200 text-amber-600';
      default: return 'bg-slate-50 border-slate-200 text-slate-600';
    }
  };

  // Unique issuers list
  const issuers = useMemo(() => {
    const set = new Set<string>();
    certificates.forEach(c => {
      if (c.issuer) set.add(c.issuer);
    });
    return Array.from(set);
  }, [certificates]);

  // Filter list
  const filteredCerts = useMemo(() => {
    return certificates.filter((c) => {
      // Category filter
      if (filter !== 'all' && c.category !== filter) return false;
      
      // Issuer filter
      if (issuerFilter !== 'all' && c.issuer !== issuerFilter) return false;

      // Featured filter
      if (featuredOnly && !c.is_featured) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesIssuer = c.issuer.toLowerCase().includes(q);
        const matchesId = c.credential_id ? c.credential_id.toLowerCase().includes(q) : false;
        const matchesSkills = c.skills ? c.skills.some(s => s.toLowerCase().includes(q)) : false;
        const matchesDesc = c.description ? c.description.toLowerCase().includes(q) : false;
        if (!matchesTitle && !matchesIssuer && !matchesId && !matchesSkills && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [certificates, filter, issuerFilter, featuredOnly, searchQuery]);

  // Handle clipboard copy of Credential ID
  const handleCopyCredentialId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

  const handleResetFilters = () => {
    setFilter('all');
    setIssuerFilter('all');
    setSearchQuery('');
    setFeaturedOnly(false);
    setSelectedIdx(null);
  };

  return (
    <div className="space-y-8 no-print" id="certificate-hub-root">

      {/* 1. CREDENTIAL VERIFICATION METRICS OVERVIEW */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-left border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> VERIFIED ACADEMIC &amp; INDUSTRY LICENSES
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
              Authenticated Accreditation Registry
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              Every certificate has been authenticated by leading industry authorities including <strong>IBM</strong>, <strong>J.P. Morgan &amp; Forage</strong>, <strong>Google</strong>, and <strong>CyberYaan</strong>. Direct cryptographic or portal verification links are provided.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="md:col-span-5 grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-white font-mono">{certificates.length}</div>
              <div className="text-[10px] font-mono text-slate-300 uppercase tracking-wider mt-0.5">Accreditations</div>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-emerald-400 font-mono">100%</div>
              <div className="text-[10px] font-mono text-slate-300 uppercase tracking-wider mt-0.5">Verifiable</div>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-blue-400 font-mono">{issuers.length}</div>
              <div className="text-[10px] font-mono text-slate-300 uppercase tracking-wider mt-0.5">Authorities</div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROL MATRIX */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 md:p-6 space-y-4 text-left">
        
        {/* Top Row: Search input + Featured Toggle + Issuers selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, authority (IBM, Google), ID, or skill..."
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

          {/* Right Controls: Featured Toggle & Issuer Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                featuredOnly
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${featuredOnly ? 'fill-white' : 'text-amber-500'}`} />
              Featured Only
            </button>

            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-block">
                Issuer:
              </span>
              <select
                value={issuerFilter}
                onChange={(e) => setIssuerFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:border-[#0084ff] focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Authorities</option>
                {issuers.map((iss) => (
                  <option key={iss} value={iss}>{iss}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Categories Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mr-1">
              Domain:
            </span>
            {(Object.keys(categoryNames) as CategoryFilter[]).map((key) => {
              const isActive = filter === key;
              const count = key === 'all' 
                ? certificates.length 
                : certificates.filter(c => c.category === key).length;

              return (
                <button
                  key={key}
                  onClick={() => {
                    setFilter(key);
                    setSelectedIdx(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {categoryNames[key]} <span className="opacity-60 font-mono text-[11px]">({count})</span>
                </button>
              );
            })}
          </div>

          {(filter !== 'all' || issuerFilter !== 'all' || searchQuery || featuredOnly) && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-mono font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

      </div>

      {/* 3. CERTIFICATES CARDS GRID */}
      {filteredCerts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-slate-200/80 rounded-3xl space-y-4">
          <Award className="w-12 h-12 text-slate-300 mx-auto stroke-[1.2]" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-800">No certifications matched your criteria</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query, clearing issuer filters, or resetting category tabs.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
        >
          <AnimatePresence mode="popLayout">
            {filteredCerts.map((cert, idx) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Image Preview with Hover Inspection Overlay */}
                  <div className="relative aspect-16/10 bg-slate-900 overflow-hidden border-b border-slate-100">
                    <img
                      src={cert.image_url}
                      alt={cert.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-lg shadow-xs backdrop-blur-xs border ${getCategoryTheme(cert.category)}`}>
                        {getShorthandCategory(cert.category)}
                      </span>
                      {cert.is_featured && (
                        <span className="p-1 rounded-lg bg-amber-400 text-slate-900 shadow-xs" title="Featured Credential">
                          <Star className="w-3 h-3 fill-slate-900" />
                        </span>
                      )}
                    </div>

                    {/* Verified Status Tag Top-Right */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/90 text-white shadow-xs backdrop-blur-xs">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    </div>

                    {/* Overlay Action Triggers */}
                    <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
                      <button
                        onClick={() => setSelectedIdx(idx)}
                        className="px-3.5 py-2 bg-white rounded-xl text-slate-900 font-bold text-xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer flex items-center gap-1.5"
                        title="Examine Certificate"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#0084ff]" /> Inspect Zoom
                      </button>
                      {cert.verify_url && (
                        <a
                          href={cert.verify_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-1.5"
                          title="Direct Verification Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Verify
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Certificate Information Body */}
                  <div className="p-5 sm:p-6 space-y-3">
                    
                    {/* Issuer & Date Row */}
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      <span className="flex items-center gap-1 font-bold text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-[#0084ff]" />
                        {cert.issuer}
                      </span>
                      {cert.issue_date && (
                        <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3" />
                          {new Date(cert.issue_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 
                      onClick={() => setSelectedIdx(idx)}
                      className="text-base font-black text-slate-900 group-hover:text-[#0084ff] transition-colors leading-snug line-clamp-2 cursor-pointer"
                    >
                      {cert.title}
                    </h4>

                    {/* Description if provided */}
                    {cert.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {cert.description}
                      </p>
                    )}

                    {/* Skill Tags */}
                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {cert.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
                            {skill}
                          </span>
                        ))}
                        {cert.skills.length > 3 && (
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md">
                            +{cert.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Bar: Credential ID & Actions */}
                <div className="px-5 sm:px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  
                  {/* Credential ID chip with copy button */}
                  {cert.credential_id ? (
                    <button
                      onClick={(e) => handleCopyCredentialId(e, cert.credential_id!)}
                      className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-all cursor-pointer max-w-[170px] truncate"
                      title="Click to copy Credential ID"
                    >
                      {copiedId === cert.credential_id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{cert.credential_id}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">Institutional ID</span>
                  )}

                  {/* Verification Launch Button */}
                  {cert.verify_url && (
                    <a
                      href={cert.verify_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-[#0084ff] hover:text-blue-700 flex items-center gap-1 transition-colors"
                      title="Verify authentic credential"
                    >
                      Verify <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 4. HIGH-FIDELITY LIGHTBOX MODAL WITH KEYBOARD NAVIGATION */}
      {selectedIdx !== null && filteredCerts[selectedIdx] && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in no-print">
          
          {/* Backdrop Dismiss */}
          <div className="absolute inset-0" onClick={() => setSelectedIdx(null)} />

          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col items-stretch border border-slate-200 text-left">
            
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-150">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getCategoryTheme(filteredCerts[selectedIdx].category)}`}>
                    {getShorthandCategory(filteredCerts[selectedIdx].category)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" /> Verified Credential
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-base sm:text-lg line-clamp-1">
                  {filteredCerts[selectedIdx].title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedIdx(null)}
                className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                title="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Frame with Prev/Next Triggers */}
            <div className="relative w-full aspect-16/9 max-h-[55vh] bg-slate-950 flex items-center justify-center p-4">
              <img
                src={filteredCerts[selectedIdx].image_url}
                alt={filteredCerts[selectedIdx].title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
              />

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/95 hover:bg-white text-slate-900 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl z-20 cursor-pointer border border-slate-200 flex items-center justify-center"
                title="Previous credential (Left arrow)"
              >
                <ChevronLeft className="w-5 h-5 text-[#0084ff]" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/95 hover:bg-white text-slate-900 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl z-20 cursor-pointer border border-slate-200 flex items-center justify-center"
                title="Next credential (Right arrow)"
              >
                <ChevronRight className="w-5 h-5 text-[#0084ff]" />
              </button>
            </div>

            {/* Modal Detailed Metadata Area */}
            <div className="p-6 bg-white space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 pb-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Authority</span>
                  <span className="text-slate-800 font-bold">{filteredCerts[selectedIdx].issuer}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Issue Date</span>
                  <span className="text-slate-800">
                    {filteredCerts[selectedIdx].issue_date ? new Date(filteredCerts[selectedIdx].issue_date!).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Verified'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Credential Reference</span>
                  {filteredCerts[selectedIdx].credential_id ? (
                    <button
                      onClick={(e) => handleCopyCredentialId(e, filteredCerts[selectedIdx].credential_id!)}
                      className="text-[#0084ff] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {filteredCerts[selectedIdx].credential_id}
                      <Copy className="w-3 h-3 text-slate-400" />
                    </button>
                  ) : (
                    <span className="text-slate-500">Verified by Issuer</span>
                  )}
                </div>
              </div>

              {/* Description & Skill Tags in Modal */}
              {filteredCerts[selectedIdx].description && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {filteredCerts[selectedIdx].description}
                </p>
              )}

              {filteredCerts[selectedIdx].skills && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-mono text-slate-400 font-bold mr-1">Validated Competencies:</span>
                  {filteredCerts[selectedIdx].skills!.map((s) => (
                    <span key={s} className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Bottom Action Footer */}
            <div className="w-full bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-150 text-xs font-mono text-slate-500">
              <span>{selectedIdx + 1} of {filteredCerts.length} Credentials</span>
              <div className="flex items-center gap-3">
                {filteredCerts[selectedIdx].verify_url && (
                  <a
                    href={filteredCerts[selectedIdx].verify_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-[#0084ff] hover:bg-blue-600 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
                  >
                    Authenticate with {filteredCerts[selectedIdx].issuer} <ExternalLink className="w-3.5 h-3.5" />
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
