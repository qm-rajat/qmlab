import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { Certificate } from '../../types';

interface AdminCertificatesTabProps {
  certificates: Certificate[];
  onUpdateCertificates: (certs: Certificate[]) => void;
  onDeleteCertificateRequest: (id: string, title: string) => void;
}

export const AdminCertificatesTab: React.FC<AdminCertificatesTabProps> = ({
  certificates,
  onUpdateCertificates,
  onDeleteCertificateRequest,
}) => {
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certForm, setCertForm] = useState<Partial<Certificate>>({});

  const handleCertEditStart = (cert?: Certificate) => {
    if (cert) {
      setEditingCertId(cert.id);
      setCertForm(cert);
    } else {
      setEditingCertId('new');
      setCertForm({
        title: '',
        issuer: '',
        category: 'cybersecurity',
        credential_id: '',
        verify_url: '',
        issue_date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleCertSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title?.trim() || !certForm.issuer?.trim()) return;

    if (editingCertId === 'new') {
      const newCert: Certificate = {
        ...(certForm as Certificate),
        id: `cert_${Date.now()}`
      };
      onUpdateCertificates([newCert, ...certificates]);
    } else {
      const updated = certificates.map(c => c.id === editingCertId ? { ...(certForm as Certificate) } : c);
      onUpdateCertificates(updated);
    }
    setEditingCertId(null);
    setCertForm({});
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {editingCertId === null ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Managed Certifications</h3>
              <p className="text-xs text-slate-400 mt-0.5">Control dynamic credentials validation pathways and issuer authorities.</p>
            </div>
            <button
              onClick={() => handleCertEditStart()}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Log Credential
            </button>
          </div>

          {/* List Certs */}
          <div className="bg-white border border-slate-150/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-mono border-b border-slate-100 uppercase tracking-widest">
                    <th className="px-5 py-3">Certification Title</th>
                    <th className="px-5 py-3">Issuer Platform</th>
                    <th className="px-5 py-3">Category tag</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-650">
                  {certificates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/40">
                      <td className="px-5 py-4 font-bold text-slate-900 text-sm max-w-xs truncate">{c.title}</td>
                      <td className="px-5 py-4 text-slate-600">{c.issuer}</td>
                      <td className="px-5 py-4 text-slate-450 uppercase">{c.category}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCertEditStart(c)}
                            className="p-1.5 text-slate-450 hover:text-primary hover:bg-slate-150/45 rounded-lg cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteCertificateRequest(c.id, `certification "${c.title}"`)}
                            className="p-1.5 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
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
        /* Certs CRUD form view */
        <form onSubmit={handleCertSave} className="space-y-6 animate-fade-in text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-800">
              {editingCertId === 'new' ? 'Log New Certification' : `Refine Credential: ${certForm.title}`}
            </h3>
            <button
              type="button"
              onClick={() => setEditingCertId(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="space-y-1">
              <label htmlFor="cform-title" className="text-xs font-bold text-slate-505 block">Certification Title</label>
              <input
                id="cform-title"
                type="text"
                value={certForm.title || ''}
                onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Issuer */}
            <div className="space-y-1">
              <label htmlFor="cform-issuer" className="text-xs font-bold text-slate-505 block">Issuer Authority</label>
              <input
                id="cform-issuer"
                type="text"
                value={certForm.issuer || ''}
                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label htmlFor="cform-category" className="text-xs font-bold text-slate-505 block">Category Tag</label>
              <select
                id="cform-category"
                value={certForm.category || 'other'}
                onChange={(e) => setCertForm({ ...certForm, category: e.target.value as any })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden cursor-pointer"
              >
                <option value="cybersecurity">Cybersecurity & Defenses</option>
                <option value="data-science">Data Science & Analytics</option>
                <option value="web-development">Web Development</option>
                <option value="seo-digital-marketing">SEO & Strategy</option>
                <option value="other">Other simulations</option>
              </select>
            </div>

            {/* Credential ID */}
            <div className="space-y-1">
              <label htmlFor="cform-id" className="text-xs font-bold text-slate-505 block">Credential ID</label>
              <input
                id="cform-id"
                type="text"
                value={certForm.credential_id || ''}
                onChange={(e) => setCertForm({ ...certForm, credential_id: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>

            {/* Verify URL */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="cform-verify" className="text-xs font-bold text-slate-505 block">Verify URL Link</label>
              <input
                id="cform-verify"
                type="text"
                value={certForm.verify_url || ''}
                onChange={(e) => setCertForm({ ...certForm, verify_url: e.target.value })}
                placeholder="https://credly.com/verify/..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-98 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" /> Save credential
          </button>
        </form>
      )}
    </div>
  );
};
