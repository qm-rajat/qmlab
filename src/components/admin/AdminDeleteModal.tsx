import React from 'react';
import { Trash2 } from 'lucide-react';

interface AdminDeleteModalProps {
  isOpen: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const AdminDeleteModal: React.FC<AdminDeleteModalProps> = ({
  isOpen,
  title,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 max-w-md w-full shadow-2xl space-y-6 text-left">
        <div className="flex items-center gap-3 text-rose-600">
          <div className="p-2.5 bg-rose-50 rounded-2xl">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">
            Confirm Deletion
          </h3>
        </div>
        
        <p className="text-sm text-slate-600 leading-relaxed">
          Are you absolutely sure you want to permanently delete <strong className="text-slate-900">{title}</strong>? This action is irreversible and will immediately erase this record.
        </p>

        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-150 text-slate-700 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow-md shadow-rose-600/10 transition-all cursor-pointer"
          >
            Permanently Delete
          </button>
        </div>
      </div>
    </div>
  );
};
