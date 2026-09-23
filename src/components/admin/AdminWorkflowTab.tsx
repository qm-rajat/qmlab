import React, { useState } from 'react';
import { WorkflowStep } from '../../types';
import { Plus, Trash2, Edit3, X, ArrowUp, ArrowDown, Compass, FileCheck, Terminal, ShieldCheck, Code2, Layers, Cpu, Server, AlertCircle } from 'lucide-react';

interface AdminWorkflowTabProps {
  workflowSteps: WorkflowStep[];
  onUpdateWorkflowSteps: (steps: WorkflowStep[]) => void;
  onDeleteWorkflowRequest?: (id: string, title: string) => void;
}

const ICON_OPTIONS = [
  { value: 'Compass', label: 'Compass (Discovery)', icon: Compass },
  { value: 'FileCheck', label: 'FileCheck (PRD / Blueprint)', icon: FileCheck },
  { value: 'Terminal', label: 'Terminal (Engineering Sprint)', icon: Terminal },
  { value: 'ShieldCheck', label: 'ShieldCheck (QA & Launch)', icon: ShieldCheck },
  { value: 'Code2', label: 'Code2 (Development)', icon: Code2 },
  { value: 'Layers', label: 'Layers (Architecture)', icon: Layers },
  { value: 'Cpu', label: 'Cpu (AI Integration)', icon: Cpu },
  { value: 'Server', label: 'Server (Cloud & DevOps)', icon: Server },
];

export default function AdminWorkflowTab({ workflowSteps, onUpdateWorkflowSteps, onDeleteWorkflowRequest }: AdminWorkflowTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<WorkflowStep>({
    id: '',
    step: `0${workflowSteps.length + 1}`,
    title: '',
    timeline: '',
    description: '',
    icon: 'Compass',
    deliverables: [],
    sort_order: workflowSteps.length + 1
  });
  const [deliverableInput, setDeliverableInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleStartCreate = () => {
    setFormError(null);
    const nextNum = workflowSteps.length + 1;
    setFormData({
      id: `wf-${Date.now()}`,
      step: nextNum < 10 ? `0${nextNum}` : `${nextNum}`,
      title: '',
      timeline: '1-2 Weeks',
      description: '',
      icon: 'Compass',
      deliverables: ['Deliverable 1', 'Deliverable 2'],
      sort_order: nextNum
    });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleStartEdit = (step: WorkflowStep) => {
    setFormError(null);
    setFormData({ ...step });
    setEditingId(step.id);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      setFormError("Step title is required.");
      return;
    }
    setFormError(null);

    let updatedList: WorkflowStep[];
    if (isCreating) {
      updatedList = [...workflowSteps, formData];
    } else {
      updatedList = workflowSteps.map(s => s.id === formData.id ? formData : s);
    }

    onUpdateWorkflowSteps(updatedList);
    setEditingId(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (onDeleteWorkflowRequest) {
      onDeleteWorkflowRequest(id, title);
    } else {
      const updatedList = workflowSteps.filter(s => s.id !== id);
      onUpdateWorkflowSteps(updatedList);
    }
  };

  const handleAddDeliverable = () => {
    if (!deliverableInput.trim()) return;
    setFormData({
      ...formData,
      deliverables: [...(formData.deliverables || []), deliverableInput.trim()]
    });
    setDeliverableInput('');
  };

  const handleRemoveDeliverable = (index: number) => {
    setFormData({
      ...formData,
      deliverables: formData.deliverables.filter((_, i) => i !== index)
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= workflowSteps.length) return;
    const list = [...workflowSteps];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;
    const reordered = list.map((s, idx) => ({ ...s, sort_order: idx + 1, step: idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}` }));
    onUpdateWorkflowSteps(reordered);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-5 h-5 text-blue-600" />;
      case 'FileCheck': return <FileCheck className="w-5 h-5 text-blue-600" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-blue-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'Code2': return <Code2 className="w-5 h-5 text-blue-600" />;
      case 'Layers': return <Layers className="w-5 h-5 text-blue-600" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-blue-600" />;
      case 'Server': return <Server className="w-5 h-5 text-blue-600" />;
      default: return <Compass className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div id="admin-workflow-tab" className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Engineering Workflow Steps Management</h3>
          <p className="text-xs text-slate-500">Configure client onboarding and sprint phases displayed in the &quot;Engineering Delivery Process&quot; section.</p>
        </div>
        {!isCreating && !editingId && (
          <button
            id="admin-add-step-btn"
            onClick={handleStartCreate}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Workflow Step
          </button>
        )}
      </div>

      {/* CREATE / EDIT FORM */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-2xl border-2 border-blue-500 p-6 shadow-lg space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase">
              {isCreating ? 'Create New Workflow Step' : 'Edit Workflow Step'}
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
              <label className="text-xs font-bold text-slate-700">Step Number (e.g. 01, 02)</label>
              <input
                type="text"
                value={formData.step}
                onChange={e => setFormData({ ...formData, step: e.target.value })}
                placeholder="01"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Step Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Discovery & Architecture Review"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Timeline / Duration</label>
              <input
                type="text"
                value={formData.timeline}
                onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                placeholder="e.g. 24–48 Hours or Week 1"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

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
              <label className="text-xs font-bold text-slate-700">Step Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of what happens during this phase..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* DELIVERABLES LIST */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700">Key Deliverables & Milestones</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={deliverableInput}
                onChange={e => setDeliverableInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddDeliverable(); }}}
                placeholder="Add milestone / deliverable (e.g. Tech Stack Evaluation)..."
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.deliverables?.map((del, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200">
                  {del}
                  <button type="button" onClick={() => handleRemoveDeliverable(idx)} className="text-slate-400 hover:text-rose-500 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
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
              {isCreating ? 'Create Step' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* WORKFLOW STEPS LIST */}
      <div className="space-y-3">
        {workflowSteps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs">
            No workflow steps found. Click &quot;Add Workflow Step&quot; to create one.
          </div>
        ) : (
          workflowSteps.map((step, index) => (
            <div key={step.id} className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-slate-300 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    {renderIcon(step.icon)}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-black text-[11px] font-mono tracking-wider">
                        {step.step || `0${index + 1}`}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                      {step.timeline && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200/60">
                          {step.timeline}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">{step.description}</p>
                    {step.deliverables && step.deliverables.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {step.deliverables.map((del, dIdx) => (
                          <span key={dIdx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                            • {del}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    title="Move up"
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === workflowSteps.length - 1}
                    title="Move down"
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStartEdit(step)}
                    title="Edit step"
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(step.id, step.title)}
                    title="Delete step"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
