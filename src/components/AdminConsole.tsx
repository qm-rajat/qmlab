import React, { useState, useEffect } from 'react';
import {
  Shield, LayoutDashboard, FileCode, Award, Inbox, Settings, LogOut, Mail, BookOpen
} from 'lucide-react';
import { Project, Blog, Certificate, Contact, SiteSettings } from '../types';
import { AdminLoginView } from './admin/AdminLoginView';
import { AdminDashboardTab } from './admin/AdminDashboardTab';
import { AdminProjectsTab } from './admin/AdminProjectsTab';
import { AdminBlogsTab } from './admin/AdminBlogsTab';
import { AdminCertificatesTab } from './admin/AdminCertificatesTab';
import { AdminContactsTab } from './admin/AdminContactsTab';
import { AdminSmtpTab } from './admin/AdminSmtpTab';
import { AdminSettingsTab } from './admin/AdminSettingsTab';
import { AdminDeleteModal } from './admin/AdminDeleteModal';

interface AdminConsoleProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
  projects: Project[];
  onUpdateProjects: (proj: Project[]) => void;
  blogs: Blog[];
  onUpdateBlogs: (blogs: Blog[]) => void;
  certificates: Certificate[];
  onUpdateCertificates: (certs: Certificate[]) => void;
  isAdminLoggedIn: boolean;
  onAdminLoginToggle: (loggedIn: boolean) => void;
}

type AdminTab = 'dashboard' | 'projects' | 'blogs' | 'certs' | 'contacts' | 'settings' | 'smtp';

export default function AdminConsole({
  settings,
  onUpdateSettings,
  projects,
  onUpdateProjects,
  blogs,
  onUpdateBlogs,
  certificates,
  onUpdateCertificates,
  isAdminLoggedIn,
  onAdminLoginToggle
}: AdminConsoleProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [smtpStatus, setSmtpStatus] = useState<{ configured: boolean; host: string | null; user: string | null; toEmail: string | null } | null>(null);

  // Custom Deletion Confirmation Modal State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    type: 'contact' | 'project' | 'blog' | 'certificate';
    title: string;
  } | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn) return;
    fetch('/api/admin/contacts', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) setContacts(data.contacts);
      })
      .catch(err => console.error('Failed to load contacts:', err));
  }, [isAdminLoggedIn]);

  // Load SMTP Status when SMTP Tab is opened
  useEffect(() => {
    if (activeTab === 'smtp') {
      fetch('/api/smtp-status')
        .then(res => res.json())
        .then(data => setSmtpStatus(data))
        .catch(err => console.error('SMTP Status Fetch Failure:', err));
    }
  }, [activeTab]);

  const persistContacts = (updated: Contact[]) => {
    setContacts(updated);
    fetch('/api/admin/contacts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated)
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Save failed (${res.status})`);
        }
      })
      .catch(err => {
        console.error('Failed to save contacts:', err);
      });
  };

  const handleLogout = () => {
    fetch('/api/admin/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    onAdminLoginToggle(false);
  };

  // Contacts CRM updates
  const handleUpdateContact = (id: string, updatedFields: Partial<Contact>) => {
    const updated = contacts.map(c => c.id === id ? { ...c, ...updatedFields } : c);
    persistContacts(updated);
  };

  const handleDeleteContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    setDeleteConfirm({
      id,
      type: 'contact',
      title: contact ? `lead inquiry from "${contact.name}"` : 'this lead inquiry'
    });
  };

  const executeDelete = () => {
    if (!deleteConfirm) return;
    const { id, type } = deleteConfirm;
    if (type === 'contact') {
      const updated = contacts.filter(c => c.id !== id);
      persistContacts(updated);
    } else if (type === 'project') {
      const updated = projects.filter(p => p.id !== id);
      onUpdateProjects(updated);
    } else if (type === 'blog') {
      const updated = blogs.filter(b => b.id !== id);
      onUpdateBlogs(updated);
    } else if (type === 'certificate') {
      const updated = certificates.filter(c => c.id !== id);
      onUpdateCertificates(updated);
    }
    setDeleteConfirm(null);
  };

  // Metrics aggregations
  const unreadContactCount = contacts.filter(c => c.status === 'unread').length;
  const ESTIMATED_VALUE_MIDPOINTS: { [key: string]: number } = {
    '< $1,000': 500,
    '$1,000 - $5,000': 3000,
    '$5,000 - $10,000': 7500,
    '$10,000+': 15000,
  };
  const activeLeads = contacts.filter(c => c.status !== 'archived');
  const taggedActiveLeads = activeLeads.filter(c => c.estimated_value && ESTIMATED_VALUE_MIDPOINTS[c.estimated_value] !== undefined);
  const activePipelineValue = taggedActiveLeads.reduce((sum, c) => sum + ESTIMATED_VALUE_MIDPOINTS[c.estimated_value!], 0);
  const untaggedActiveLeadCount = activeLeads.length - taggedActiveLeads.length;
  const mockResumeDownloadsCount = 67;

  if (!isAdminLoggedIn) {
    return (
      <AdminLoginView 
        onLoginSuccess={() => {
          onAdminLoginToggle(true);
          setActiveTab('dashboard');
        }} 
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white border border-slate-100 rounded-3xl shadow-xs no-print">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Side Navigation Panel */}
        <div className="lg:col-span-1 space-y-2 border-r border-slate-150/40 pr-0 lg:pr-6 flex flex-row lg:flex-col overflow-x-auto gap-2 lg:gap-0 select-none pb-4 lg:pb-0 scrollbar-none">
          <div className="hidden lg:flex items-center gap-2 px-3 py-4 mb-2">
            <div className="p-1.5 bg-primary-light text-primary rounded-lg">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-primary leading-tight">CRM CONSOLE</div>
              <span className="text-[10px] font-mono font-bold text-emerald-500">• SEED ACTIVE</span>
            </div>
          </div>

          {[
            { label: 'Admin Metrics', value: 'dashboard', icon: LayoutDashboard, alert: unreadContactCount > 0 ? `${unreadContactCount}` : null },
            { label: 'Project Portfolio', value: 'projects', icon: FileCode },
            { label: 'Technical Blogs', value: 'blogs', icon: BookOpen },
            { label: 'Certifications', value: 'certs', icon: Award },
            { label: 'Contacts Enquiries', value: 'contacts', icon: Inbox, alert: unreadContactCount > 0 ? `${unreadContactCount}` : null },
            { label: 'SMTP Connection', value: 'smtp', icon: Mail },
            { label: 'Site settings', value: 'settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as AdminTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.alert && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${isSelected ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600'}`}>
                    {tab.alert}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50/50 rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Dynamic Viewport */}
        <div className="lg:col-span-4 min-h-[500px]">
          {activeTab === 'dashboard' && (
            <AdminDashboardTab
              projects={projects}
              blogs={blogs}
              certificates={certificates}
              contacts={contacts}
              unreadContactCount={unreadContactCount}
              activePipelineValue={activePipelineValue}
              untaggedActiveLeadCount={untaggedActiveLeadCount}
              mockResumeDownloadsCount={mockResumeDownloadsCount}
              onNavigateToContacts={() => setActiveTab('contacts')}
            />
          )}

          {activeTab === 'projects' && (
            <AdminProjectsTab
              projects={projects}
              onUpdateProjects={onUpdateProjects}
              onDeleteProjectRequest={(id, title) => setDeleteConfirm({ id, type: 'project', title })}
            />
          )}

          {activeTab === 'blogs' && (
            <AdminBlogsTab
              blogs={blogs}
              onUpdateBlogs={onUpdateBlogs}
              onDeleteBlogRequest={(id, title) => setDeleteConfirm({ id, type: 'blog', title })}
            />
          )}

          {activeTab === 'certs' && (
            <AdminCertificatesTab
              certificates={certificates}
              onUpdateCertificates={onUpdateCertificates}
              onDeleteCertificateRequest={(id, title) => setDeleteConfirm({ id, type: 'certificate', title })}
            />
          )}

          {activeTab === 'contacts' && (
            <AdminContactsTab
              contacts={contacts}
              onUpdateContact={handleUpdateContact}
              onDeleteContact={handleDeleteContact}
            />
          )}

          {activeTab === 'smtp' && (
            <AdminSmtpTab
              smtpStatus={smtpStatus}
              setSmtpStatus={setSmtpStatus}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsTab
              settings={settings}
              onUpdateSettings={onUpdateSettings}
            />
          )}
        </div>
      </div>

      <AdminDeleteModal
        isOpen={Boolean(deleteConfirm)}
        title={deleteConfirm?.title || ''}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={executeDelete}
      />
    </div>
  );
}
