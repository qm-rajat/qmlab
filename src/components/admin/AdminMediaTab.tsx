import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, CheckCircle2, AlertCircle, RefreshCw, HardDrive, Filter } from 'lucide-react';
import { Project, Blog, Certificate, SiteSettings } from '../../types';

interface AdminMediaTabProps {
  settings: SiteSettings;
  projects: Project[];
  blogs: Blog[];
  certificates: Certificate[];
}

interface MediaFile {
  filename: string;
  url: string;
  sizeBytes: number;
  createdAt: string;
}

export const AdminMediaTab: React.FC<AdminMediaTabProps> = ({
  settings,
  projects,
  blogs,
  certificates,
}) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'used' | 'unused'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/media', { credentials: 'include' });
      const data = await res.json();
      if (data.success && Array.isArray(data.files)) {
        setFiles(data.files);
      } else {
        setError(data.error || 'Failed to load media');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Gather all in-use image URLs from settings, projects, blogs, certificates
  const usedUrls = new Set<string>();
  if (settings.profile_image_url) usedUrls.add(settings.profile_image_url);
  if (settings.logo_url) usedUrls.add(settings.logo_url);
  if (settings.seo_og_image_url) usedUrls.add(settings.seo_og_image_url);

  projects.forEach(p => {
    if (p.image_url) usedUrls.add(p.image_url);
    if (Array.isArray(p.images)) {
      p.images.forEach(img => img && usedUrls.add(img));
    }
  });

  blogs.forEach(b => {
    if (b.cover_image_url) usedUrls.add(b.cover_image_url);
    if (b.og_image_url) usedUrls.add(b.og_image_url);
  });

  certificates.forEach(c => {
    if (c.image_url) usedUrls.add(c.image_url);
  });

  const handleDelete = async (filename: string) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}? This will remove the file from your local disk and repository.`)) {
      return;
    }
    setDeleting(filename);
    try {
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ filename })
      });
      const data = await res.json();
      if (data.success) {
        setFiles(files.filter(f => f.filename !== filename));
      } else {
        alert(data.error || 'Failed to delete file');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete file');
    } finally {
      setDeleting(null);
    }
  };

  const handleCleanUnused = async () => {
    const unusedFiles = files.filter(f => !usedUrls.has(f.url));
    if (unusedFiles.length === 0) {
      alert('No unused files found!');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete all ${unusedFiles.length} unused image(s)?`)) {
      return;
    }

    setLoading(true);
    for (const file of unusedFiles) {
      try {
        await fetch('/api/admin/media', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ filename: file.filename })
        });
      } catch (e) {
        console.error('Failed to delete', file.filename);
      }
    }
    await fetchMedia();
  };

  const filteredFiles = files.filter(f => {
    const isUsed = usedUrls.has(f.url);
    if (filter === 'used') return isUsed;
    if (filter === 'unused') return !isUsed;
    return true;
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalSize = files.reduce((acc, f) => acc + f.sizeBytes, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <HardDrive className="w-6 h-6 text-blue-600" />
            Local Media Library & Storage Manager
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage all uploaded images in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono">/public/uploads/</code>. Track which images are currently active in your projects, blogs, or settings and clean up unused files.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          {files.some(f => !usedUrls.has(f.url)) && (
            <button
              onClick={handleCleanUnused}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-rose-50 text-rose-700 rounded-xl hover:bg-rose-100 transition-colors border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clean Unused ({files.filter(f => !usedUrls.has(f.url)).length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats and filter bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Files</p>
            <p className="text-lg font-black text-slate-900">{files.length} ({formatSize(totalSize)})</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">In Use</p>
            <p className="text-lg font-black text-slate-900">
              {files.filter(f => usedUrls.has(f.url)).length} files
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Unused (Safe to Clean)</p>
            <p className="text-lg font-black text-slate-900">
              {files.filter(f => !usedUrls.has(f.url)).length} files
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <Filter className="w-4 h-4 text-slate-400 mr-1" />
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Files ({files.length})
        </button>
        <button
          onClick={() => setFilter('used')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'used' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          In Use ({files.filter(f => usedUrls.has(f.url)).length})
        </button>
        <button
          onClick={() => setFilter('unused')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'unused' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Unused ({files.filter(f => !usedUrls.has(f.url)).length})
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 rounded-xl text-sm border border-rose-200">
          {error}
        </div>
      )}

      {/* Files Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading media library...</div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">No media files found</p>
          <p className="text-xs text-slate-400 mt-1">Upload images via the admin console projects, blogs, or settings tabs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map(file => {
            const isUsed = usedUrls.has(file.url);
            return (
              <div key={file.filename} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col group hover:border-slate-300 transition-all">
                <div className="relative h-40 bg-slate-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2">
                    {isUsed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> In Use
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm">
                        <AlertCircle className="w-3 h-3" /> Unused
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <p className="text-xs font-mono font-bold text-slate-800 truncate" title={file.filename}>
                      {file.filename}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>{formatSize(file.sizeBytes)}</span>
                      <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <input
                      type="text"
                      readOnly
                      value={file.url}
                      className="text-[10px] bg-slate-50 px-2 py-1 rounded border border-slate-200 text-slate-600 font-mono w-full truncate"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      onClick={() => handleDelete(file.filename)}
                      disabled={deleting === file.filename}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                      title="Delete from disk and repository"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
