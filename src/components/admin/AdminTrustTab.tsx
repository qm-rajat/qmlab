import React, { useState } from 'react';
import { TrustGuarantee } from '../../types';
import { Plus, Trash2, Edit3, X, ArrowUp, ArrowDown, Lock, ShieldCheck, RefreshCw, MessageSquare, Zap, Award, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminTrustTabProps {
  trustGuarantees: TrustGuarantee[];
  onUpdateTrustGuarantees: (guarantees: TrustGuarantee[]) => void;
  onDeleteTrustRequest?: (id: string, title: string) => void;
}

const ICON_OPTIONS = [
  { value: 'Lock', label: 'Lock (IP & Code Ownership)', icon: Lock },
  { value: 'ShieldCheck', label: 'ShieldCheck (Strict NDA)', icon: ShieldCheck },
  { value: 'RefreshCw', label: 'RefreshCw (30-Day Warranty)', icon: RefreshCw },
  { value: 'MessageSquare', label: 'MessageSquare (Direct Channel)', icon: MessageSquare },
  { value: 'Zap', label: 'Zap (High Velocity / Fast Turnaround)', icon: Zap },
  { value: 'Award', label: 'Award (Quality Guarantee)', icon: Award },
  { value: 'Clock', label: 'Clock (On-Time Delivery)', icon: Clock },
  { value: 'CheckCircle', label: 'CheckCircle (Verified Milestones)', icon: CheckCircle },
];

export default function AdminTrustTab({ trustGuarantees, onUpdateTrustGuarantees, onDeleteTrustRequest }: AdminTrustTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TrustGuarantee>({
    id: '',
    title: '',
    description: '',
    icon: 'Lock',
    sort_order: trustGuarantees.length + 1
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleStartCreate = () => {
    setFormError(null);
    setFormData({
      id: `trust-${Date.now()}`,
      title: '',
      description: '',
      icon: 'Lock',
      sort_order: trustGuarantees.length + 1
    });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleStartEdit = (item: TrustGuarantee) => {
    setFormError(null);
    setFormData({ ...item });
    setEditingId(item.id);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      setFormError("Guarantee title is required.");
      return;
    }
    if (!formData.description.trim()) {
      setFormError("Guarantee description is required.");
      return;
    }
    setFormError(null);

    let updatedList: TrustGuarantee[];
    if (isCreating) {
      updatedList = [...trustGuarantees, formData];
    } else {
      updatedList = trustGuarantees.map(t => t.id === formData.id ? formData : t);
    }

    onUpdateTrustGuarantees(updatedList);
    setEditingId(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (onDeleteTrustRequest) {
      onDeleteTrustRequest(id, title);
    } else {
      const updatedList = trustGuarantees.filter(t => t.id !== id);
      onUpdateTrustGuarantees(updatedList);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= trustGuarantees.length) return;
    const list = [...trustGuarantees];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;
    const reordered = list.map((t, idx) => ({ ...t, sort_order: idx + 1 }));
    onUpdateTrustGuarantees(reordered);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Lock': return <Lock className="w-5 h-5 text-emerald-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'RefreshCw': return <RefreshCw className="w-5 h-5 text-emerald-600" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-emerald-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-emerald-600" />;
      case 'Award': return <Award className="w-5 h-5 text-emerald-600" />;
      case 'Clock': return <Clock className="w-5 h-5 text-emerald-600" />;
      case 'CheckCircle': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      default: return <Lock className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div id="admin-trust-tab" className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Trust, Security & Client Guarantees</h3>
          <p className="text-xs text-slate-500">Configure guarantees and security commitments displayed in the &quot;Enterprise-Grade Delivery Guarantees&quot; section.</p>
        </div>
        {!isCreating && !editingId && (
          <button
            id="admin-add-trust-btn"
            onClick={handleStartCreate}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Guarantee
          </button>
        )}
      </div>

      {/* CREATE / EDIT FORM */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-2xl border-2 border-blue-500 p-6 shadow-lg space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase">
              {isCreating ? 'Create New Guarantee' : 'Edit Guarantee'}
            </h4>
            <button
              onClick={() => { setIsCreating(false); setEditingId(null); setFormError(null); }}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Icon</label>
              <select
                value={formData.icon}
                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {ICON_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Guarantee Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. 100% IP & Code Ownership"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Description *</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Full repository, credentials, and copyright transferred upon delivery."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => { setIsCreating(false); setEditingId(null); }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow transition-all cursor-pointer"
            >
              {isCreating ? 'Create Guarantee' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* GUARANTEE LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {trustGuarantees.length === 0 ? (
          <div className="sm:col-span-2 bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs">
            No guarantees found. Click &quot;Add Guarantee&quot; to create one.
          </div>
        ) : (
          trustGuarantees.map((item, index) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-slate-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    {renderIcon(item.icon)}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      title="Move up"
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === trustGuarantees.length - 1}
                      title="Move down"
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleStartEdit(item)}
                      title="Edit item"
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      title="Delete item"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
