import React, { useState } from 'react';
import { ArrowLeft, Heart, Bookmark, Eye, Calendar, Clock, Share2, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { Blog, SiteSettings } from '../types';
import { formatDate } from '../lib/utils'; // we will write custom helper or define inline

interface BlogPostProps {
  blog: Blog;
  settings: SiteSettings;
  onBack: () => void;
  isLiked: boolean;
  isBookmarked: boolean;
  onLikeToggle: (id: string) => void;
  onBookmarkToggle: (id: string) => void;
}

export default function BlogPost({
  blog,
  settings,
  onBack,
  isLiked,
  isBookmarked,
  onLikeToggle,
  onBookmarkToggle,
}: BlogPostProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-10 animate-fade-in no-print">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-xs uppercase tracking-wider group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Return to Article Hub
      </button>

      {/* Hero Header Area */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {blog.categories?.map((cat) => (
            <span
              key={cat}
              className="text-[10px] font-extrabold uppercase tracking-widest text-[#0084ff] bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-md"
            >
              {cat}
            </span>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {blog.title}
        </h1>

        {/* Technical Metadata */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-slate-400 border-y border-slate-100 py-3 mt-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-300" />
            {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="hidden md:inline text-slate-250">•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            {blog.read_time_mins} min read
          </span>
          <span className="hidden md:inline text-slate-250">•</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-300" />
            {blog.view_count + 1} views tracked
          </span>
        </div>
      </div>

      {/* Featured Cover Image */}
      {blog.cover_image_url && (
        <div className="w-full h-64 sm:h-96 rounded-3xl overflow-hidden mb-10 border border-slate-100 relative shadow-sm">
          <img
            src={blog.cover_image_url}
            alt={blog.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none"
          />
        </div>
      )}

      {/* Writer Signature Circle with Special DAShed Ring Animation */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100/60 mb-10">
        {/* Animated Dashed Ring for Author Thumbnail */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-dashed border-primary animate-[spin_12s_linear_infinite]" />
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-extrabold text-sm select-none">
            R
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Written by Rajat Kumar Dash</div>
          <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            Computer science specialist, SEO Executive, and software architect.
          </div>
        </div>
      </div>

      {/* Article Inner Contents (HTML Prose) */}
      <div
        className="blog-prose mb-12"
        dangerouslySetInnerHTML={{ __html: blog.content_html || '' }}
      />

      {/* Category Tags Pill Stack */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-6 mb-8">
          {blog.tags.map((tag) => (
            <span key={tag} className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Interactive Actions Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 pt-6 gap-4">
        {/* Liking & Bookmarking */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onLikeToggle(blog.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              isLiked
                ? 'bg-rose-50 border-rose-100 text-rose-600 font-bold scale-[1.02]'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            {blog.like_count + (isLiked ? 1 : 0)} Likes
          </button>
          
          <button
            onClick={() => onBookmarkToggle(blog.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-blue-50 border-blue-100 text-[#0084ff] font-bold scale-[1.02]'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
            Saved
          </button>
        </div>

        {/* Simulated Social Shares */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" /> Share:
          </span>
          <button
            onClick={handleCopyLink}
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-550 rounded-xl transition-all cursor-pointer"
            title="Copy URL link to clipboard"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-550 rounded-xl transition-all block"
            title="Share on Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-550 rounded-xl transition-all block"
            title="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
