import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Heart, Bookmark, Eye, Calendar, Clock, Share2, 
  Twitter, Linkedin, Copy, Check, Sparkles, BookOpen, 
  MessageSquare, User, Tag, ArrowRight, Lightbulb, FileCode,
  CheckCircle2, CornerDownRight, ExternalLink
} from 'lucide-react';
import { Blog, SiteSettings } from '../types';
import { sanitizeHtml } from '../lib/utils';

interface BlogPostProps {
  blog: Blog;
  settings: SiteSettings;
  onBack: () => void;
  isLiked: boolean;
  isBookmarked: boolean;
  onLikeToggle: (id: string) => void;
  onBookmarkToggle: (id: string) => void;
  allBlogs?: Blog[];
  onSelectBlog?: (blog: Blog) => void;
}

export default function BlogPost({
  blog,
  settings,
  onBack,
  isLiked,
  isBookmarked,
  onLikeToggle,
  onBookmarkToggle,
  allBlogs = [],
  onSelectBlog,
}: BlogPostProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [userNote, setUserNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [noteCopied, setNoteCopied] = useState(false);

  // Track scroll progress for reading bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentScroll = window.scrollY;
        const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNote.trim()) return;
    setSavedNotes([...savedNotes, userNote.trim()]);
    setUserNote('');
  };

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(savedNotes.join('\n- '));
    setNoteCopied(true);
    setTimeout(() => setNoteCopied(false), 2000);
  };

  // Find related articles (matching category or tags)
  const relatedBlogs = allBlogs
    .filter(b => b.id !== blog.id && b.status === 'published')
    .filter(b => 
      b.categories?.some(c => blog.categories?.includes(c)) ||
      b.tags?.some(t => blog.tags?.includes(t))
    )
    .slice(0, 2);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 animate-fade-in no-print" id="blog-post-root">
      
      {/* 1. PINNED READING PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-100 z-50">
        <div 
          className="h-full bg-gradient-to-r from-[#0084ff] to-indigo-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* 2. TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-wider group cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#0084ff]" />
          Return to Technical Articles
        </button>

        {/* Quick Share Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onLikeToggle(blog.id)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isLiked
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{blog.like_count + (isLiked ? 1 : 0)}</span>
          </button>

          <button
            onClick={() => onBookmarkToggle(blog.id)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isBookmarked
                ? 'bg-blue-50 border-blue-200 text-[#0084ff]'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#0084ff]' : ''}`} />
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
            title="Copy URL"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3. HERO ARTICLE HEADER */}
      <div className="space-y-4 mb-8 text-left">
        <div className="flex flex-wrap items-center gap-2">
          {blog.categories?.map((cat) => (
            <span
              key={cat}
              className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#0084ff] bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg shadow-2xs"
            >
              {cat}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {blog.title}
        </h1>

        {/* Technical Metadata Row */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-slate-500 border-y border-slate-100 py-3.5">
          <span className="flex items-center gap-1 text-slate-700 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {blog.read_time_mins} min read
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            {blog.view_count + 1} tracked impressions
          </span>
        </div>
      </div>

      {/* 4. FEATURED COVER IMAGE */}
      {blog.cover_image_url && (
        <div className="w-full h-64 sm:h-96 rounded-3xl overflow-hidden mb-8 border border-slate-200/80 relative shadow-xs">
          <img
            src={blog.cover_image_url}
            alt={blog.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none"
          />
        </div>
      )}

      {/* 5. KEY TAKEAWAYS CALLOUT BOX */}
      <div className="bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-slate-50 border border-blue-200/80 rounded-3xl p-6 mb-8 text-left space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#0084ff] text-white rounded-lg shadow-xs">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 font-mono">
            Key Engineering Takeaways &amp; Executive Summary
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {blog.excerpt || "A comprehensive breakdown of engineering principles, implementation mechanics, and measurable production outcomes."}
        </p>
      </div>

      {/* 6. AUTHOR SIGNATURE CARD */}
      <div className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs mb-8 text-left">
        <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
          <div className="absolute inset-0 rounded-full border border-dashed border-[#0084ff] animate-[spin_12s_linear_infinite]" />
          <div className="w-10 h-10 rounded-full bg-[#0084ff] flex items-center justify-center text-white font-extrabold text-sm select-none shadow-xs">
            R
          </div>
        </div>
        <div className="space-y-0.5 flex-1">
          <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span>Written by Rajat Kumar Dash</span>
            <span className="text-[10px] font-mono text-[#0084ff] bg-blue-50 px-2 py-0.5 rounded-full font-bold">Verified Author</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Full-Stack Developer, Technical SEO Specialist, and Software Engineer at QM Labs.
          </p>
        </div>
      </div>

      {/* 7. ARTICLE HTML CONTENT (PROSE) */}
      <div
        className="blog-prose mb-10 text-left"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content_html || '') }}
      />

      {/* 8. TAGS CLOUD */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-6 mb-8 text-left">
          <span className="text-xs font-mono font-bold text-slate-400 mr-2 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Tags:
          </span>
          {blog.tags.map((tag) => (
            <span key={tag} className="text-xs font-mono text-slate-600 bg-slate-100 border border-slate-200/60 rounded-lg px-2.5 py-1">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 9. INTERACTIVE DEVELOPER SCRATCHPAD / READING NOTES */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-10 text-left space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#0084ff]" />
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 font-mono">
              Interactive Reader Notes &amp; Thoughts Pad
            </h4>
          </div>
          {savedNotes.length > 0 && (
            <button
              onClick={handleCopyNotes}
              className="text-[11px] font-mono font-bold text-[#0084ff] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {noteCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {noteCopied ? 'Copied Notes' : 'Copy All Notes'}
            </button>
          )}
        </div>

        <form onSubmit={handleAddNote} className="flex gap-2">
          <input
            type="text"
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="Jot down a quick takeaway, idea, or reference note..."
            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-[#0084ff]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Save Note
          </button>
        </form>

        {savedNotes.length > 0 && (
          <div className="space-y-1.5 pt-2">
            {savedNotes.map((note, idx) => (
              <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start justify-between gap-2 shadow-2xs">
                <span className="flex items-start gap-1.5">
                  <CornerDownRight className="w-3.5 h-3.5 text-[#0084ff] flex-shrink-0 mt-0.5" />
                  {note}
                </span>
                <button
                  onClick={() => setSavedNotes(savedNotes.filter((_, i) => i !== idx))}
                  className="text-[10px] text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 10. FOOTER ENGAGEMENT & SOCIAL SHARE BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 pt-6 pb-6 gap-4">
        {/* Liking & Bookmarking */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onLikeToggle(blog.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
              isLiked
                ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold scale-105 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            {blog.like_count + (isLiked ? 1 : 0)} Likes
          </button>
          
          <button
            onClick={() => onBookmarkToggle(blog.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-blue-50 border-blue-200 text-[#0084ff] font-bold scale-105 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#0084ff]' : ''}`} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>

        {/* Social Share Links */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1 font-mono">
            <Share2 className="w-3.5 h-3.5" /> Share:
          </span>
          <button
            onClick={handleCopyLink}
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
            title="Copy URL link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${blog.title} by Rajat Kumar Dash`)}&url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl transition-all block"
            title="Share on Twitter / X"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl transition-all block"
            title="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 11. RECOMMENDED RELATED ARTICLES (If available) */}
      {relatedBlogs.length > 0 && onSelectBlog && (
        <div className="border-t border-slate-200 pt-8 mt-4 text-left space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0084ff]" /> Recommended Technical Guides
            </h3>
            <button
              onClick={onBack}
              className="text-xs font-bold text-[#0084ff] hover:underline cursor-pointer"
            >
              View All Articles →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedBlogs.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  onSelectBlog(rel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#0084ff] bg-blue-50 px-2 py-0.5 rounded">
                    {rel.categories?.[0] || 'Technical Guide'}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0084ff] transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {rel.excerpt}
                  </p>
                </div>
                <div className="pt-3 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{rel.read_time_mins} min read</span>
                  <span className="text-[#0084ff] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </article>
  );
}
