import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, Check } from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  label,
  placeholder = "https://example.com/image.png or upload file"
}) => {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WebP, GIF)');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            data: base64Data
          })
        });
        const data = await res.json();
        if (data.success && data.url) {
          onChange(data.url);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError(data.error || 'Upload failed');
        }
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</label>}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-800"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 shrink-0 shadow-sm"
          title="Upload image directly to repository /public/uploads"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : success ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>{uploading ? 'Uploading...' : success ? 'Uploaded!' : 'Upload File'}</span>
        </button>
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
      <p className="text-[11px] text-slate-500">
        You can paste an image URL or click <strong>Upload File</strong> to save the image locally into <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">/public/uploads/</code> for git sync.
      </p>
    </div>
  );
};
