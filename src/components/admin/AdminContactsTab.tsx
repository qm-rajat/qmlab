import React, { useState, useMemo } from 'react';
import { 
  Search, Mail, Trash2, Sparkles, Briefcase, MessageCircle, Flame, DollarSign 
} from 'lucide-react';
import { Contact } from '../../types';

interface AdminContactsTabProps {
  contacts: Contact[];
  onUpdateContact: (id: string, updates: Partial<Contact>) => void;
  onDeleteContact: (id: string) => void;
}

export const AdminContactsTab: React.FC<AdminContactsTabProps> = ({
  contacts,
  onUpdateContact,
  onDeleteContact,
}) => {
  const [contactFilter, setContactFilter] = useState<'all' | 'unread' | 'read' | 'replied' | 'archived'>('all');
  const [crmSearchText, setCrmSearchText] = useState('');
  const [crmSortBy, setCrmSortBy] = useState<'date_desc' | 'date_asc' | 'priority_high'>('date_desc');
  const [crmCopiedTemplateId, setCrmCopiedTemplateId] = useState<string | null>(null);

  const processedContacts = useMemo(() => {
    let result = [...contacts];

    // Filter by tab
    if (contactFilter !== 'all') {
      result = result.filter(c => c.status === contactFilter);
    }

    // Filter by search text
    if (crmSearchText.trim()) {
      const q = crmSearchText.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q)) ||
        (c.estimated_value && c.estimated_value.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (crmSortBy === 'priority_high') {
        const pMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
        const pA = pMap[a.priority || 'low'] || 0;
        const pB = pMap[b.priority || 'low'] || 0;
        if (pA !== pB) return pB - pA;
      }
      if (crmSortBy === 'date_asc') {
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      }
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    return result;
  }, [contacts, contactFilter, crmSearchText, crmSortBy]);

  const handleCopyTemplate = (text: string, templateId: string, leadId: string) => {
    navigator.clipboard.writeText(text);
    setCrmCopiedTemplateId(`${leadId}-${templateId}`);
    setTimeout(() => setCrmCopiedTemplateId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Inbound Leads Hub</h3>
          <p className="text-xs text-slate-400 mt-0.5">Track, categorize, prioritize, and manage recruiter communications.</p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-50 border border-slate-100 p-1 rounded-xl">
          {(['all', 'unread', 'read', 'replied', 'archived'] as const).map((f) => {
            const count = f === 'all' ? contacts.length : contacts.filter(c => c.status === f).length;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setContactFilter(f)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg cursor-pointer transition-all ${
                  contactFilter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {f} <span className="text-[9px] opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Search & Sorting Options Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, query, budget, notes..."
            value={crmSearchText}
            onChange={(e) => setCrmSearchText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 focus:border-primary rounded-xl text-xs text-slate-800 focus:outline-hidden"
          />
          {crmSearchText && (
            <button
              onClick={() => setCrmSearchText('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 justify-end">
          <span className="text-[10px] uppercase font-bold text-slate-400">Sort By:</span>
          <select
            value={crmSortBy}
            onChange={(e) => setCrmSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-slate-200 focus:border-primary rounded-xl text-xs text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="date_desc">Date (Newest First)</option>
            <option value="date_asc">Date (Oldest First)</option>
            <option value="priority_high">Priority (🔥 High First)</option>
          </select>
        </div>
      </div>

      {processedContacts.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-slate-50/20 border border-slate-100 rounded-3xl">
          <Mail className="w-12 h-12 stroke-[1] mx-auto mb-3 text-slate-300 pointer-events-none" />
          {crmSearchText ? 'No matching contacts found for your search term.' : 'Your matched mailbox folder is empty.'}
        </div>
      ) : (
        <div className="space-y-4">
          {processedContacts.map((lead) => {
            let borderClass = 'border-l-4 border-l-slate-300';
            let bgOverlay = 'bg-white';
            if (lead.priority === 'high') {
              borderClass = 'border-l-4 border-l-rose-500';
              bgOverlay = 'bg-rose-50/5';
            } else if (lead.priority === 'medium') {
              borderClass = 'border-l-4 border-l-amber-500';
              bgOverlay = 'bg-amber-50/5';
            } else if (lead.priority === 'low') {
              borderClass = 'border-l-4 border-l-blue-400';
              bgOverlay = 'bg-blue-50/5';
            }

            return (
              <div
                key={lead.id}
                className={`border border-slate-150/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4 transition-all hover:shadow-sm ${borderClass} ${bgOverlay}`}
              >
                <div className="space-y-3">
                  {/* Top Metadata row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100/65 pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{lead.name}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-medium select-all">{lead.email}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(lead.created_at || Date.now()).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Status tags */}
                    <div className="flex items-center gap-1.5">
                      {lead.inquiry_type && (
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          lead.inquiry_type === 'freelance_project'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/50'
                            : 'bg-slate-50 text-slate-550 border border-slate-100/50'
                        }`}>
                          {lead.inquiry_type === 'freelance_project' ? <Briefcase className="w-2.5 h-2.5" /> : <MessageCircle className="w-2.5 h-2.5" />}
                          {lead.inquiry_type === 'freelance_project' ? 'Freelance / Project' : 'General'}
                        </span>
                      )}
                      {lead.priority && (
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          lead.priority === 'high' ? 'bg-rose-50 text-rose-600 border border-rose-100/50' :
                          lead.priority === 'medium' ? 'bg-amber-50 text-amber-750 border border-amber-100/50' :
                          'bg-slate-50 text-slate-550'
                        }`}>
                          {lead.priority === 'high' && <Flame className="w-2.5 h-2.5 text-rose-500 animate-pulse" />}
                          {lead.priority.toUpperCase()} PRIORITY
                        </span>
                      )}
                      {lead.estimated_value && (
                        <span className="text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100/50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          <DollarSign className="w-2.5 h-2.5" />
                          Value: {lead.estimated_value}
                        </span>
                      )}
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        lead.status === 'unread' ? 'bg-rose-500 text-white animate-pulse' :
                        lead.status === 'replied' ? 'bg-emerald-500 text-white' :
                        'bg-slate-800 text-white'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>

                  {/* Original message details */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Inquiry Message</label>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 whitespace-pre-wrap select-text selection:bg-blue-100">
                      {lead.message}
                    </p>
                  </div>

                  {/* Private CRM notes block */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                      Private Follow-up CRM Notes (Auto-saved)
                    </label>
                    <textarea
                      value={lead.notes || ''}
                      placeholder="Type private admin follow-up notes here (e.g. 'Awaiting scheduling callback', 'Sent interview link' ...)"
                      onChange={(e) => onUpdateContact(lead.id, { notes: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 text-xs bg-slate-50/40 hover:bg-slate-50/80 focus:bg-white border border-slate-205 focus:border-primary rounded-xl focus:outline-hidden text-slate-750 resize-none transition-all placeholder:text-slate-350"
                    />
                  </div>

                  {/* Quick answers templates pill row */}
                  <div className="bg-blue-50/25 border border-blue-100/35 rounded-xl p-3 space-y-2">
                    <span className="text-[9.5px] font-extrabold text-blue-600 uppercase tracking-widest block flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#0084ff]" />
                      Canned Response Engine (Click to instant copy response)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        {
                          id: 'ack',
                          label: '📬 Acknowledge Receipt',
                          text: `Hi ${lead.name},\n\nThank you for reaching out to Rajat / QM Labs!\n\nThis is a quick acknowledgment to confirm I have successfully received your inquiry regarding potential collaboration. I am currently evaluating the scope of work and will revert with a detailed response within 24 hours.\n\nTalk soon,\nRajat\nTechnical Expert • QM Labs\nhttps://qmlabs.tech`
                        },
                        {
                          id: 'call',
                          label: '📅 Request Discovery Call',
                          text: `Hi ${lead.name},\n\nThank you for getting in touch!\n\nI have reviewed your message and would love to learn more. To establish technical compatibility and explore how we could work together, let's schedule a brief 10-minute discovery video call. Please feel free to reply with your preferred days/times, or use my calendar scheduler.\n\nLooking forward to speaking with you!\n\nBest regards,\nRajat`
                        },
                        {
                          id: 'spec',
                          label: '💼 Request Spec/Requirements',
                          text: `Hi ${lead.name},\n\nThank you for getting in touch regarding your product goals!\n\nTo ensure I generate a precise technical feasibility assessment and a tailored quotation or fixed budget estimate, could you share any additional project specification documentation, UI/UX mockups, or an existing repository you want optimized?\n\nBest regards,\nRajat\nQM Labs`
                        }
                      ].map((tpl) => {
                        const isCopied = crmCopiedTemplateId === `${lead.id}-${tpl.id}`;
                        return (
                          <button
                            key={tpl.id}
                            type="button"
                            onClick={() => handleCopyTemplate(tpl.text, tpl.id, lead.id)}
                            className={`px-3 py-1.5 text-[9px] font-bold rounded-lg cursor-pointer transition-all border outline-hidden ${
                              isCopied
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-150 shadow-2xs hover:shadow-xs'
                            }`}
                          >
                            {isCopied ? '✓ Copied to Clipboard!' : tpl.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Dropdown control panel */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
                    <div className="min-w-[120px]">
                      <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Priority Level</span>
                      <select
                        value={lead.priority || ''}
                        onChange={(e) => onUpdateContact(lead.id, { priority: (e.target.value || undefined) as any })}
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-150 rounded-lg text-xs text-slate-650 cursor-pointer focus:outline-hidden font-medium"
                      >
                        <option value="">-- None --</option>
                        <option value="high">🔴 High Urgency</option>
                        <option value="medium">🟡 Medium Urgency</option>
                        <option value="low">🔵 Low Urgency</option>
                      </select>
                    </div>

                    <div className="min-w-[130px]">
                      <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Est. Deal Value</span>
                      <select
                        value={lead.estimated_value || ''}
                        onChange={(e) => onUpdateContact(lead.id, { estimated_value: e.target.value })}
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-150 rounded-lg text-xs text-slate-650 cursor-pointer focus:outline-hidden font-medium"
                      >
                        <option value="">-- Unassigned --</option>
                        <option value="Under $2k">Under $2k</option>
                        <option value="$2k - $10k">$2k - $10k (Core)</option>
                        <option value="$10k+">$10k+ Enterprise</option>
                        <option value="Candidate Job">F-T / Contract Job</option>
                      </select>
                    </div>

                    <div className="min-w-[120px]">
                      <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Pipeline Status</span>
                      <select
                        value={lead.status}
                        onChange={(e) => onUpdateContact(lead.id, { status: e.target.value as any })}
                        className="w-full px-2 py-1 bg-slate-100 border border-slate-205 rounded-lg text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden"
                      >
                        <option value="unread">📬 Unread</option>
                        <option value="read">📖 Read</option>
                        <option value="replied">✅ Replied</option>
                        <option value="archived">📦 Archived</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteContact(lead.id)}
                    className="w-full md:w-auto px-4 py-2 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer hover:bg-rose-100 transition-colors"
                    title="Format delete lead enquiry record"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Permanent Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
