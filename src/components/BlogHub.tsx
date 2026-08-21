import React, { useState, useMemo } from 'react';
import { 
  Search, BookOpen, Clock, Calendar, Eye, Heart, Bookmark, 
  ArrowRight, Sparkles, Filter, SlidersHorizontal, Tag, 
  Share2, Check, TrendingUp, Compass, Flame, Send
} from 'lucide-react';
import { Blog, SiteSettings } from '../types';

interface BlogHubProps {
  blogs: Blog[];
  settings: SiteSettings;
  onReadBlog: (blog: Blog) => void;
  likedBlogs: string[];
  bookmarkedBlogs: string[];
  onLikeToggle: (id: string) => void;
  onBookmarkToggle: (id: string) => void;
}

type SortOption = 'newest' | 'popular' | 'liked' | 'readtime';

export default function BlogHub({
  blogs,
  settings,
  onReadBlog,
  likedBlogs,
  bookmarkedBlogs,
  onLikeToggle,
  onBookmarkToggle,
}: BlogHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    blogs.forEach(b => {
      if (b.status === 'published' && b.categories) {
        b.categories.forEach(c => cats.add(c));
      }
    });
    return Array.from(cats);
  }, [blogs]);

  // Filter & Sort blogs
  const filteredAndSortedBlogs = useMemo(() => {
    let result = blogs.filter(b => b.status === 'published');

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
        (b.tags && b.tags.some(t => t.toLowerCase().includes(q))) ||
        (b.categories && b.categories.some(c => c.toLowerCase().includes(q)))
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(b => b.categories?.includes(selectedCategory));
    }

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.view_count || 0) - (a.view_count || 0);
      }
      if (sortBy === 'liked') {
        return (b.like_count || 0) - (a.like_count || 0);
      }
      if (sortBy === 'readtime') {
        return (a.read_time_mins || 5) - (b.read_time_mins || 5);
      }
      // Default: newest
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return dateB - dateA;
    });
  }, [blogs, searchQuery, selectedCategory, sortBy]);

  // Flagship / Featured Hero Article (e.g. top blog or first in list)
  const featuredArticle = useMemo(() => {
    if (selectedCategory || searchQuery) return null;
    return blogs.find(b => b.status === 'published') || null;
  }, [blogs, selectedCategory, searchQuery]);

  // Remaining articles for grid
  const gridArticles = useMemo(() => {
    if (featuredArticle && !selectedCategory && !searchQuery) {
      return filteredAndSortedBlogs.filter(b => b.id !== featuredArticle.id);
    }
    return filteredAndSortedBlogs;
  }, [filteredAndSortedBlogs, featuredArticle, selectedCategory, searchQuery]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribedEmail) return;
    setSubscribedSuccess(true);
    setTimeout(() => {
      setSubscribedSuccess(false);
      setSubscribedEmail('');
    }, 3500);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortBy('newest');
  };

  return (
    <div className="space-y-10 py-6" id="blog-hub-root">
      
      {/* 1. SECTION HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-[#0084ff] border border-blue-200/60">
          <BookOpen className="w-3.5 h-3.5" /> TECHNICAL ESSAYS &amp; ARCHITECTURAL GUIDES
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
          Technical Publication Hub
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          In-depth breakdowns covering Core Web Vitals optimization, Automated Selenium POM frameworks, Clinical ML pipelines, and Offensive Security auditing.
        </p>
      </div>

      {/* 2. FEATURED FLAGSHIP ARTICLE HERO BANNER (When not filtered) */}
      {featuredArticle && (
        <div 
          onClick={() => onReadBlog(featuredArticle)}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden group cursor-pointer"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            
            {/* Left Image Cover */}
            <div className="lg:col-span-6 relative aspect-16/10 lg:aspect-auto overflow-hidden bg-slate-900 min-h-[260px] lg:min-h-[360px]">
              {featuredArticle.cover_image_url && (
                <img
                  src={featuredArticle.cover_image_url}
                  alt={featuredArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#0084ff] text-white shadow-md">
                  <Flame className="w-3 h-3" /> FEATURED DISPATCH
                </span>
                {featuredArticle.categories?.[0] && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-white/90 backdrop-blur-sm text-slate-800 border border-white/40">
                    {featuredArticle.categories[0]}
                  </span>
                )}
              </div>
            </div>

            {/* Right Content Details */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-left space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-slate-600 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(featuredArticle.published_at || featuredArticle.created_at).toLocaleDateString('en-IN', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {featuredArticle.read_time_mins} min read
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {featuredArticle.view_count} reads
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight group-hover:text-[#0084ff] transition-colors leading-tight">
                  {featuredArticle.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {featuredArticle.excerpt}
                </p>

                {/* Tech Tags */}
                {featuredArticle.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {featuredArticle.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-extrabold text-[#0084ff] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    Read Full Technical Deep Dive <ArrowRight className="w-4 h-4" />
                  </span>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onLikeToggle(featuredArticle.id)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      likedBlogs.includes(featuredArticle.id)
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                    title="Like article"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedBlogs.includes(featuredArticle.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{featuredArticle.like_count + (likedBlogs.includes(featuredArticle.id) ? 1 : 0)}</span>
                  </button>

                  <button
                    onClick={() => onBookmarkToggle(featuredArticle.id)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center cursor-pointer ${
                      bookmarkedBlogs.includes(featuredArticle.id)
                        ? 'bg-blue-50 border-blue-200 text-[#0084ff]'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                    title="Bookmark article"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarkedBlogs.includes(featuredArticle.id) ? 'fill-[#0084ff]' : ''}`} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. FILTER & SEARCH CONTROL MATRIX */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 md:p-6 space-y-4 no-print text-left">
        
        {/* Top Controls Row: Search Input + Sorting Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides by title, keywords, or topics..."
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

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Sort By:
            </span>
            <div className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200">
              {[
                { id: 'newest', label: 'Latest' },
                { id: 'popular', label: 'Most Read' },
                { id: 'liked', label: 'Top Liked' },
                { id: 'readtime', label: 'Quickest' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id as SortOption)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sortBy === opt.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mr-1">
              Category:
            </span>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === null
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
              }`}
            >
              All Articles ({blogs.filter(b => b.status === 'published').length})
            </button>
            {categories.map((cat) => {
              const count = blogs.filter(b => b.categories?.includes(cat) && b.status === 'published').length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(isSelected ? null : cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0084ff] text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {cat} <span className="opacity-60 font-mono text-[11px]">({count})</span>
                </button>
              );
            })}
          </div>

          {(selectedCategory || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-mono font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* 4. ARTICLES GRID */}
      {gridArticles.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-slate-200/80 rounded-3xl space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-800">No matching technical guides found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any articles matching your search or active category filters.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {gridArticles.map((b) => {
            const isLiked = likedBlogs.includes(b.id);
            const isBookmarked = bookmarkedBlogs.includes(b.id);
            return (
              <article
                key={b.id}
                onClick={() => onReadBlog(b)}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Image Cover */}
                  {b.cover_image_url && (
                    <div className="aspect-16/10 bg-slate-100 overflow-hidden relative border-b border-slate-100">
                      <img
                        src={b.cover_image_url}
                        alt={b.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-mono font-extrabold uppercase bg-white/90 backdrop-blur-xs text-[#0084ff] border border-blue-100 px-2 py-0.5 rounded-lg shadow-2xs">
                          {b.categories?.[0] || 'Technical Guide'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Article Card Body */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(b.published_at || b.created_at).toLocaleDateString('en-IN', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {b.read_time_mins} min read
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#0084ff] transition-colors leading-snug line-clamp-2">
                      {b.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {b.excerpt}
                    </p>

                    {/* Tech Tags */}
                    {b.tags && b.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {b.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Interaction Bar */}
                <div className="px-5 sm:px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0084ff] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onLikeToggle(b.id)}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isLiked
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                      title="Like article"
                    >
                      <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span className="text-[10px]">{b.like_count + (isLiked ? 1 : 0)}</span>
                    </button>

                    <button
                      onClick={() => onBookmarkToggle(b.id)}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center cursor-pointer ${
                        isBookmarked
                          ? 'bg-blue-50 border-blue-200 text-[#0084ff]'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                      title="Bookmark article"
                    >
                      <Bookmark className={`w-3 h-3 ${isBookmarked ? 'fill-[#0084ff]' : ''}`} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 5. NEWSLETTER & TECH BRIEFS SUBSCRIPTION CALLOUT */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg text-left no-print">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles className="w-3 h-3" /> QUARTERLY TECH DISPATCH
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Stay Ahead of Search Algorithms &amp; Automation
            </h3>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              Curated engineering notes, Core Web Vitals optimization techniques, Python automation scripts, and vulnerability disclosures sent directly to your inbox. No spam.
            </p>
          </div>

          <div className="lg:col-span-5">
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={subscribedEmail}
                  onChange={(e) => setSubscribedEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#0084ff] focus:bg-white/15 transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#0084ff] hover:bg-blue-600 text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/30 cursor-pointer flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  Subscribe
                </button>
              </div>
              {subscribedSuccess && (
                <div className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1 animate-fadeIn">
                  <Check className="w-3.5 h-3.5" /> Subscription confirmed! Welcome aboard.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
