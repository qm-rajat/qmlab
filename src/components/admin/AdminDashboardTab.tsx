import React, { useState } from 'react';
import { 
  FileCode, BookOpen, Inbox, Award, LineChart, DollarSign, FileText, Database, DownloadCloud, UploadCloud, RefreshCw
} from 'lucide-react';
import { Project, Blog, Certificate, Contact } from '../../types';

interface AdminDashboardTabProps {
  projects: Project[];
  blogs: Blog[];
  certificates: Certificate[];
  contacts: Contact[];
  unreadContactCount: number;
  activePipelineValue: number;
  untaggedActiveLeadCount: number;
  mockResumeDownloadsCount: number;
  onNavigateToContacts: () => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  projects,
  blogs,
  certificates,
  contacts,
  unreadContactCount,
  activePipelineValue,
  untaggedActiveLeadCount,
  mockResumeDownloadsCount,
  onNavigateToContacts,
}) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [sysMessage, setSysMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleBackup = async () => {
    setIsBackingUp(true);
    setSysMessage(null);
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setSysMessage({ text: 'Backup completed successfully!', type: 'success' });
      } else {
        setSysMessage({ text: data.error || 'Backup failed.', type: 'error' });
      }
    } catch (err: any) {
      setSysMessage({ text: err.message, type: 'error' });
    }
    setIsBackingUp(false);
  };

  const handleRestore = async () => {
    if (!window.confirm("⚠️ WARNING: This will overwrite your live Redis data with the contents of latest.json. Are you sure you want to proceed?")) {
      return;
    }
    setIsRestoring(true);
    setSysMessage(null);
    try {
      const response = await fetch('/api/admin/restore', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setSysMessage({ text: 'Restore completed successfully! Refresh the page to see updated data.', type: 'success' });
      } else {
        setSysMessage({ text: data.error || 'Restore failed.', type: 'error' });
      }
    } catch (err: any) {
      setSysMessage({ text: err.message, type: 'error' });
    }
    setIsRestoring(false);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Admin Dashboard</h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time local statistics and performance trends.</p>
        </div>
        <span className="text-[11px] font-mono bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg">
          Updated: Today • Live Sync
        </span>
      </div>

      {sysMessage && (
        <div className={`p-4 rounded-xl border text-sm font-bold ${sysMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
          {sysMessage.text}
        </div>
      )}

      {/* Database Tools Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-slate-600" />
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Database Tools</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={handleBackup} 
            disabled={isBackingUp || isRestoring}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {isBackingUp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
            Backup Data to JSON
          </button>
          
          <button 
            onClick={handleRestore} 
            disabled={isBackingUp || isRestoring}
            className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {isRestoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            Restore from JSON
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-4 leading-relaxed max-w-2xl">
          <strong>Backup</strong> queries Redis and saves local JSON files to <code className="bg-slate-200 px-1 py-0.5 rounded">.data/backups/</code>.<br/>
          <strong>Restore</strong> reads <code className="bg-slate-200 px-1 py-0.5 rounded">latest.json</code> and forcefully overwrites your live Redis database. Use with caution.
        </p>
      </div>

      {/* Counts Widgets Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Projects Listed', count: projects.length, icon: FileCode, theme: 'text-blue-500' },
          { label: 'Blogs Logged', count: blogs.length, icon: BookOpen, theme: 'text-indigo-500' },
          { label: 'Unread Leads', count: unreadContactCount, icon: Inbox, theme: unreadContactCount > 0 ? 'text-rose-500 font-bold' : 'text-slate-500' },
          { label: 'Certifications', count: certificates.length, icon: Award, theme: 'text-amber-500' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.theme}`} />
              </div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">{stat.count}</div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Interactive SVG Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Real Engagement Data replacing SVG */}
        <div className="md:col-span-2 bg-slate-50/20 border border-slate-100 rounded-2xl p-5 flex flex-col text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Aggregated Engagement Data</h4>
              <p className="text-[11px] text-slate-400">Real statistics pulled from live modules.</p>
            </div>
            <LineChart className="w-4 h-4 text-primary" />
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Blog Views</span>
              <span className="text-2xl font-black text-blue-600 tracking-tight">
                {blogs.reduce((sum, b) => sum + (b.view_count || 0), 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Blog Likes</span>
              <span className="text-2xl font-black text-pink-600 tracking-tight">
                {blogs.reduce((sum, b) => sum + (b.like_count || 0), 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total CRM Inquiries</span>
              <span className="text-2xl font-black text-emerald-600 tracking-tight">
                {contacts.length.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Pipeline Analysis */}
        <div className="bg-slate-50/20 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between text-left">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Active Pipeline
            </h4>
            <p className="text-[11px] text-slate-400">Estimated value of active leads.</p>
          </div>

          <div className="py-4 space-y-1">
            <div className="text-2xl font-black text-emerald-600 tracking-tight">
              ${activePipelineValue.toLocaleString('en-US')}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{contacts.filter(c => c.priority === 'high' && c.status !== 'archived').length} High-Urgency Leads</span>
            </div>
            {untaggedActiveLeadCount > 0 && (
              <div className="text-[9px] text-slate-400 font-mono">
                +{untaggedActiveLeadCount} lead{untaggedActiveLeadCount === 1 ? '' : 's'} without a budget tag
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Pending CRM:</span>
            <span className="font-bold text-slate-800">{contacts.filter(c => c.status === 'unread').length} items</span>
          </div>
        </div>

        {/* Popular files downloads */}
        <div className="bg-slate-50/20 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between text-left">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Downloads & Stats</h4>
            <p className="text-[11px] text-slate-400">Resume download telemetry.</p>
          </div>

          <div className="py-4 flex flex-col items-center justify-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-blue-50/60 flex items-center justify-center text-primary border border-blue-100/50">
              <FileText className="w-5 h-5 animate-[bounce_3s_linear_infinite]" />
            </div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">{mockResumeDownloadsCount}</div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-semibold">Total Resume Handoffs</span>
          </div>

          <div className="text-[9px] bg-emerald-50 border border-emerald-100/50 p-2 rounded-xl text-emerald-800 text-center font-medium leading-relaxed">
            🌟 Direct resume print views generated are ATS-optimized.
          </div>
        </div>
      </div>

      {/* Section: Incoming Project Leads */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest block">Dashboard Recent Enquiries</h4>
        <div className="bg-white border border-slate-150/80 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-mono border-b border-slate-100 uppercase tracking-widest">
                  <th className="px-5 py-3">Inquirer</th>
                  <th className="px-5 py-3">Latest message Preview</th>
                  <th className="px-5 py-3">Date logged</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-650">
                {contacts.slice(0, 3).map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={onNavigateToContacts}
                    className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4 font-bold text-slate-800">{lead.name}</td>
                    <td className="px-5 py-4 max-w-xs truncate">{lead.message}</td>
                    <td className="px-5 py-4 text-slate-450">{new Date(lead.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                        lead.status === 'unread' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
