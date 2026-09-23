import React, { useState } from 'react';
import { FAQItem } from '../../types';
import { Plus, Trash2, Edit3, X, HelpCircle, ArrowUp, ArrowDown, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface AdminFaqTabProps {
  faqs: FAQItem[];
  onUpdateFaqs: (faqs: FAQItem[]) => void;
  onDeleteFaqRequest?: (id: string, title: string) => void;
}

const CATEGORY_OPTIONS = [
  'General & Engagement',
  'Legal & Ownership',
  'Billing & Contracts',
  'Technical & AI',
  'Delivery & Warranty',
  'Workflow & Communication'
];

export default function AdminFaqTab({ faqs, onUpdateFaqs, onDeleteFaqRequest }: AdminFaqTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FAQItem>({
    id: '',
    question: '',
    answer: '',
    category: 'General & Engagement',
    is_active: true,
    sort_order: faqs.length + 1
  });
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleStartCreate = () => {
    setFormError(null);
    setFormData({
      id: `faq-${Date.now()}`,
      question: '',
      answer: '',
      category: 'General & Engagement',
      is_active: true,
      sort_order: faqs.length + 1
    });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleStartEdit = (faq: FAQItem) => {
    setFormError(null);
    setFormData({ ...faq });
    setEditingId(faq.id);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!formData.question.trim()) {
      setFormError("Question is required.");
      return;
    }
    if (!formData.answer.trim()) {
      setFormError("Answer is required.");
      return;
    }
    setFormError(null);

    let updatedList: FAQItem[];
    if (isCreating) {
      updatedList = [...faqs, formData];
    } else {
      updatedList = faqs.map(f => f.id === formData.id ? formData : f);
    }

    onUpdateFaqs(updatedList);
    setEditingId(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (onDeleteFaqRequest) {
      onDeleteFaqRequest(id, title);
    } else {
      const updatedList = faqs.filter(f => f.id !== id);
      onUpdateFaqs(updatedList);
    }
  };

  const handleToggleActive = (id: string) => {
    const updatedList = faqs.map(f => f.id === id ? { ...f, is_active: !f.is_active } : f);
    onUpdateFaqs(updatedList);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= faqs.length) return;
    const list = [...faqs];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;
    const reordered = list.map((f, idx) => ({ ...f, sort_order: idx + 1 }));
    onUpdateFaqs(reordered);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = categoryFilter === 'all' || faq.category === categoryFilter;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div id="admin-faq-tab" className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">FAQ & Answer Engine (AEO) Management</h3>
          <p className="text-xs text-slate-500">Manage client questions and AI citation knowledge base displayed on qmlab.in.</p>
        </div>
        {!isCreating && !editingId && (
          <button
            id="admin-add-faq-btn"
            onClick={handleStartCreate}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add FAQ Item
          </button>
        )}
      </div>

      {/* CREATE / EDIT FORM */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-2xl border-2 border-blue-500 p-6 shadow-lg space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase">
              {isCreating ? 'Create New FAQ Item' : 'Edit FAQ Item'}
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
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Question *</label>
              <input
                type="text"
                value={formData.question}
                onChange={e => setFormData({ ...formData, question: e.target.value })}
                placeholder="e.g. Who owns the intellectual property and code?"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Category</label>
              <select
                value={formData.category || 'General & Engagement'}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Detailed Answer *</label>
            <textarea
              rows={4}
              value={formData.answer}
              onChange={e => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Provide a transparent, thorough answer..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active !== false}
                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-slate-700">Visible on Live Services Page & FAQ Schema</span>
            </label>
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
              {isCreating ? 'Create FAQ' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories ({faqs.length})</option>
            {CATEGORY_OPTIONS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQ LIST */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs">
            No FAQs found. Click &quot;Add FAQ Item&quot; to create one.
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const originalIndex = faqs.findIndex(f => f.id === faq.id);
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border p-4 transition-all duration-200 ${
                  faq.is_active !== false ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200 bg-slate-50/70 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px] uppercase tracking-wider">
                          {faq.category || 'General'}
                        </span>
                        {faq.is_active !== false ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-bold text-[10px]">
                            <XCircle className="w-3 h-3" /> Hidden
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{faq.question}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMove(originalIndex, 'up')}
                      disabled={originalIndex === 0}
                      title="Move up"
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(originalIndex, 'down')}
                      disabled={originalIndex === faqs.length - 1}
                      title="Move down"
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(faq.id)}
                      title={faq.is_active !== false ? 'Hide from public' : 'Publish live'}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer"
                    >
                      {faq.is_active !== false ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleStartEdit(faq)}
                      title="Edit FAQ"
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id, faq.question)}
                      title="Delete FAQ"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
