import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { Blog } from '../../types';
import MarkdownEditor from './MarkdownEditor';
import { ImageUploadInput } from './ImageUploadInput';

interface AdminBlogsTabProps {
  blogs: Blog[];
  onUpdateBlogs: (blogs: Blog[]) => void;
  onDeleteBlogRequest: (id: string, title: string) => void;
}

export const AdminBlogsTab: React.FC<AdminBlogsTabProps> = ({
  blogs,
  onUpdateBlogs,
  onDeleteBlogRequest,
}) => {
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<Blog>>({});
  const [tagsInput, setTagsInput] = useState<string>('');
  const [categoriesInput, setCategoriesInput] = useState<string>('');

  const handleBlogEditStart = (blog?: Blog) => {
    if (blog) {
      setEditingBlogId(blog.id);
      setBlogForm(blog);
      setTagsInput(blog.tags?.join(', ') || '');
      setCategoriesInput(blog.categories?.join(', ') || '');
    } else {
      setEditingBlogId('new');
      setBlogForm({
        title: '',
        slug: '',
        excerpt: '',
        content_html: '',
        cover_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
        status: 'draft',
        read_time_mins: 5,
        like_count: 0,
        bookmark_count: 0,
        view_count: 0,
        tags: [],
        categories: ['General Web']
      });
      setTagsInput('');
      setCategoriesInput('General Web');
    }
  };

  const handleBlogSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title?.trim() || !blogForm.content_html?.trim()) return;

    const finalSlug = blogForm.slug?.trim() || blogForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const parsedTags = tagsInput.split(',').map(s => s.trim()).filter(Boolean);
    const parsedCategories = categoriesInput.split(',').map(s => s.trim()).filter(Boolean);

    const payload: Blog = {
      ...(blogForm as Blog),
      tags: parsedTags,
      categories: parsedCategories.length > 0 ? parsedCategories : ['General Web'],
      slug: finalSlug,
    };

    if (editingBlogId === 'new') {
      const newBlog: Blog = {
        ...payload,
        id: `blog_${Date.now()}`,
        published_at: blogForm.status === 'published' ? new Date().toISOString() : undefined,
        created_at: new Date().toISOString()
      };
      onUpdateBlogs([newBlog, ...blogs]);
    } else {
      const updated = blogs.map(b => b.id === editingBlogId ? {
        ...payload,
        published_at: b.published_at || (blogForm.status === 'published' ? new Date().toISOString() : undefined)
      } : b);
      onUpdateBlogs(updated);
    }
    setEditingBlogId(null);
    setBlogForm({});
    setTagsInput('');
    setCategoriesInput('');
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {editingBlogId === null ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Technical Articles</h3>
              <p className="text-xs text-slate-400 mt-0.5">Control published drafts, tags, and descriptive paragraphs.</p>
            </div>
            <button
              onClick={() => handleBlogEditStart()}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Draft Article
            </button>
          </div>

          {/* List Articles */}
          <div className="bg-white border border-slate-150/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-mono border-b border-slate-100 uppercase tracking-widest">
                    <th className="px-5 py-3">Technical Title</th>
                    <th className="px-5 py-3">Audit Categories</th>
                    <th className="px-5 py-3">State Status</th>
                    <th className="px-5 py-3">Telemetry KPIs</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-650">
                  {blogs.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/40">
                      <td className="px-5 py-4 font-bold text-slate-900 text-sm max-w-xs truncate">{b.title}</td>
                      <td className="px-5 py-4 text-slate-500">{b.categories?.join(', ') || 'General'}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                          b.status === 'published' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 space-x-2.5 font-mono">
                        <span>Likes: {b.like_count}</span>
                        <span>Views: {b.view_count}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleBlogEditStart(b)}
                            className="p-1.5 text-slate-450 hover:text-primary hover:bg-slate-150/45 rounded-lg cursor-pointer"
                            title="Edit textual content"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteBlogRequest(b.id, `blog post "${b.title}"`)}
                            className="p-1.5 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Delete article"
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
        /* Blogs CRUD Edit view */
        <form onSubmit={handleBlogSave} className="space-y-6 animate-fade-in text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-800">
              {editingBlogId === 'new' ? 'Compose Technical Post' : `Refine Post: ${blogForm.title}`}
            </h3>
            <button
              type="button"
              onClick={() => setEditingBlogId(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Title */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="bform-title" className="text-xs font-bold text-slate-505 block">Article Title</label>
              <input
                id="bform-title"
                type="text"
                value={blogForm.title || ''}
                onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                required
                placeholder="E.g., Core Web Vitals Refactoring Tips"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label htmlFor="bform-status" className="text-xs font-bold text-slate-505 block">State Status</label>
              <select
                id="bform-status"
                value={blogForm.status || 'draft'}
                onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden cursor-pointer"
              >
                <option value="draft">Draft - Private</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Excerpt */}
            <div className="md:col-span-3 space-y-1">
              <label htmlFor="bform-excerpt" className="text-xs font-bold text-slate-505 block">Technical Summary snippet (Excerpt)</label>
              <input
                id="bform-excerpt"
                type="text"
                value={blogForm.excerpt || ''}
                onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                placeholder="Provide brief hook..."
                className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>
            
            {/* Cover Image URL */}
            <div className="md:col-span-3 space-y-1">
              <ImageUploadInput
                label="Cover Image URL or Upload Local File"
                value={blogForm.cover_image_url || ''}
                onChange={(val) => setBlogForm({ ...blogForm, cover_image_url: val })}
                placeholder="https://images.unsplash.com/... or upload file"
              />
            </div>

            {/* Tags */}
            <div className="md:col-span-3 space-y-1">
              <label htmlFor="bform-tags" className="text-xs font-bold text-slate-505 block">Tags (Comma separated)</label>
              <input
                id="bform-tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="SEO, React, Node.js"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>
            
            {/* Categories */}
            <div className="md:col-span-3 space-y-1">
              <label htmlFor="bform-categories" className="text-xs font-bold text-slate-505 block">Categories (Comma separated)</label>
              <input
                id="bform-categories"
                type="text"
                value={categoriesInput}
                onChange={(e) => setCategoriesInput(e.target.value)}
                placeholder="General Web, DevOps"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>
            
            {/* SEO Section */}
            <div className="md:col-span-3 mt-4">
              <h4 className="text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">SEO & Social Meta</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="bform-seo-title" className="text-xs font-bold text-slate-505 block">SEO Title</label>
                  <input
                    id="bform-seo-title"
                    type="text"
                    value={blogForm.seo_title || ''}
                    onChange={(e) => setBlogForm({ ...blogForm, seo_title: e.target.value })}
                    placeholder="Title for search engines"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="bform-seo-desc" className="text-xs font-bold text-slate-505 block">SEO Description</label>
                  <input
                    id="bform-seo-desc"
                    type="text"
                    value={blogForm.seo_description || ''}
                    onChange={(e) => setBlogForm({ ...blogForm, seo_description: e.target.value })}
                    placeholder="Meta description"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="bform-seo-keys" className="text-xs font-bold text-slate-505 block">SEO Keywords</label>
                  <input
                    id="bform-seo-keys"
                    type="text"
                    value={blogForm.seo_keywords || ''}
                    onChange={(e) => setBlogForm({ ...blogForm, seo_keywords: e.target.value })}
                    placeholder="keyword1, keyword2"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="bform-og-image" className="text-xs font-bold text-slate-505 block">Social Image (OG)</label>
                  <input
                    id="bform-og-image"
                    type="text"
                    value={blogForm.og_image_url || ''}
                    onChange={(e) => setBlogForm({ ...blogForm, og_image_url: e.target.value })}
                    placeholder="https://... (defaults to cover image)"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label htmlFor="bform-canonical" className="text-xs font-bold text-slate-505 block">Canonical URL</label>
                  <input
                    id="bform-canonical"
                    type="text"
                    value={blogForm.canonical_url || ''}
                    onChange={(e) => setBlogForm({ ...blogForm, canonical_url: e.target.value })}
                    placeholder="https://medium.com/@you/original-post"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Markdown Content Editor */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-bold text-slate-700 block">
              Article Content (Full Markdown &amp; HTML Support)
            </label>
            <MarkdownEditor
              value={blogForm.content_html || ''}
              onChange={(val) => setBlogForm({ ...blogForm, content_html: val })}
              placeholder="# Write your article in Markdown..."
              minHeight="360px"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-98 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" /> Save article
          </button>
        </form>
      )}
    </div>
  );
};
