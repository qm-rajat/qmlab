import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, Check } from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  onUploadMultiple?: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
  placeholder?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  onUploadMultiple,
  multiple = false,
  label,
  placeholder = "https://example.com/image.png or upload file"
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFileAsDataUrl = (file: File): Promise<{ filename: string; data: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ filename: file.name, data: reader.result as string });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const nonImages = files.filter(f => !f.type.startsWith('image/'));
    if (nonImages.length > 0) {
      setError('Please select valid image files (PNG, JPG, WebP, GIF)');
      return;
    }

    setUploading(true);
    setUploadProgress(files.length > 1 ? `Uploading ${files.length} images...` : 'Uploading...');
    setError(null);

    try {
      if (files.length === 1 && !onUploadMultiple) {
        const file = files[0];
        const { data } = await readFileAsDataUrl(file);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            data
          })
        });
        const resData = await res.json();
        if (resData.success && resData.url) {
          onChange(resData.url);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError(resData.error || 'Upload failed');
        }
      } else {
        // Multi-file batch upload
        const payloadFiles = await Promise.all(files.map(f => readFileAsDataUrl(f)));
        const res = await fetch('/api/admin/upload-multiple', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: payloadFiles })
        });
        const resData = await res.json();
        if (resData.success && Array.isArray(resData.urls)) {
          if (onUploadMultiple) {
            onUploadMultiple(resData.urls);
          } else if (resData.urls[0]) {
            onChange(resData.urls[0]);
          }
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError(resData.error || 'Batch upload failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
          multiple={multiple}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 shrink-0 shadow-sm cursor-pointer"
          title={multiple ? "Select 1 or multiple images (3-4 images at once)" : "Upload image directly to repository /public/uploads"}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : success ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>
            {uploading
              ? (uploadProgress || 'Uploading...')
              : success
              ? 'Uploaded!'
              : multiple
              ? 'Upload Images (Multi)'
              : 'Upload File'}
          </span>
        </button>
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
      <p className="text-[11px] text-slate-500">
        You can paste image URLs or click <strong>{multiple ? 'Upload Images (Multi)' : 'Upload File'}</strong> to save directly into <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">/public/uploads/</code>.
      </p>
    </div>
  );
};
