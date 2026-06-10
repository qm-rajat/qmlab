import React, { useState } from 'react';
import {
  Shield, Key, LayoutDashboard, FileCode, Search, Award, Inbox, Settings, LogOut,
  Plus, Edit2, Trash2, Check, ArrowRight, ToggleLeft, ToggleRight, Save, Info,
  LineChart, Mail, FileText, CheckCircle, Clock, Eye, Sparkles, Filter, Archive, BookOpen
} from 'lucide-react';
import { Project, Blog, Certificate, Contact, SiteSettings, Skill, Experience, Education } from '../types';
import RichTextEditor from './RichTextEditor';

interface AdminConsoleProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
  projects: Project[];
  onUpdateProjects: (proj: Project[]) => void;
  blogs: Blog[];
  onUpdateBlogs: (blogs: Blog[]) => void;
  certificates: Certificate[];
  onUpdateCertificates: (certs: Certificate[]) => void;
  contacts: Contact[];
  onUpdateContacts: (contacts: Contact[]) => void;
  isAdminLoggedIn: boolean;
  onAdminLoginToggle: (loggedIn: boolean) => void;
}

type AdminTab = 'dashboard' | 'projects' | 'blogs' | 'certs' | 'contacts' | 'settings';

export default function AdminConsole({
  settings,
  onUpdateSettings,
  projects,
  onUpdateProjects,
  blogs,
  onUpdateBlogs,
  certificates,
  onUpdateCertificates,
  contacts,
  onUpdateContacts,
  isAdminLoggedIn,
  onAdminLoginToggle
}: AdminConsoleProps) {
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin View State
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // CRUD Forms State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});
  
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<Blog>>({});
  const [blogMode, setBlogMode] = useState<'text' | 'preview'>('text');

  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certForm, setCertForm] = useState<Partial<Certificate>>({});

  // Site Settings Sub-Tabs
  const [settingsSubTab, setSettingsSubTab] = useState<'hero' | 'skills' | 'experience' | 'education' | 'socials' | 'seo' | 'assets'>('hero');

  // Contact filtering state
  const [contactFilter, setContactFilter] = useState<'all' | 'unread' | 'read' | 'replied' | 'archived'>('all');

  // Analytics Metrics Simulation
  const views7Days = [142, 185, 230, 247, 198, 265, 312]; // Last element is today views
  const topVisitedPages = [
    { path: '/home', count: 489 },
    { path: '/blog/technical-seo-audit-checklist', count: 312 },
    { path: '/projects/pentest-seo-framework', count: 245 },
    { path: '/certificates', count: 184 },
    { path: '/blog/scikit-learn-healthcare-models', count: 145 }
  ];
  const mockResumeDownloadsCount = 67;

  // Handle Admin Authorization
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (email.trim() === 'admin@qmlabs.com' && password === 'admin123') {
      onAdminLoginToggle(true);
      setActiveTab('dashboard');
    } else {
      setLoginError('Invalid Administrator credentials. Try with email: admin@qmlabs.com / pwd: admin123');
    }
  };

  const handleLogout = () => {
    onAdminLoginToggle(false);
  };

  // Contacts CRM updates
  const handleContactStatusChange = (id: string, s: 'unread' | 'read' | 'replied' | 'archived') => {
    const updated = contacts.map(c => c.id === id ? { ...c, status: s } : c);
    onUpdateContacts(updated);
  };

  const handleDeleteContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    onUpdateContacts(updated);
  };

  // Projects CRUD Actions
  const handleProjectEditStart = (proj?: Project) => {
    if (proj) {
      setEditingProjectId(proj.id);
      setProjectForm(proj);
    } else {
      setEditingProjectId('new');
      setProjectForm({
        title: '',
        slug: '',
        description: '',
        images: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600'],
        technologies: [],
        github_url: '',
        live_url: '',
        is_featured: false,
        display_order: projects.length + 1
      });
    }
  };

  const handleProjectSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title?.trim() || !projectForm.description?.trim()) return;

    const finalSlug = projectForm.slug?.trim() || projectForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    if (editingProjectId === 'new') {
      const newProj: Project = {
        ...(projectForm as Project),
        id: `proj_${Date.now()}`,
        slug: finalSlug,
        created_at: new Date().toISOString()
      };
      onUpdateProjects([newProj, ...projects]);
    } else {
      const updated = projects.map(p => p.id === editingProjectId ? { ...(projectForm as Project), slug: finalSlug } : p);
      onUpdateProjects(updated);
    }
    setEditingProjectId(null);
    setProjectForm({});
  };

  const handleProjectDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updated = projects.filter(p => p.id !== id);
      onUpdateProjects(updated);
    }
  };

  // Blogs CRUD Actions
  const handleBlogEditStart = (blog?: Blog) => {
    if (blog) {
      setEditingBlogId(blog.id);
      setBlogForm(blog);
    } else {
      setEditingBlogId('new');
      setBlogForm({
        title: '',
        slug: '',
        excerpt: '',
        content_html: '',
        cover_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
        status: 'draft',
        read_time_mins: 5,
        like_count: 0,
        bookmark_count: 0,
        view_count: 0,
        tags: [],
        categories: ['General Web']
      });
    }
  };

  const handleBlogSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title?.trim() || !blogForm.content_html?.trim()) return;

    const finalSlug = blogForm.slug?.trim() || blogForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    if (editingBlogId === 'new') {
      const newBlog: Blog = {
        ...(blogForm as Blog),
        id: `blog_${Date.now()}`,
        slug: finalSlug,
        published_at: blogForm.status === 'published' ? new Date().toISOString() : undefined,
        created_at: new Date().toISOString()
      };
      onUpdateBlogs([newBlog, ...blogs]);
    } else {
      const updated = blogs.map(b => b.id === editingBlogId ? {
        ...(blogForm as Blog),
        slug: finalSlug,
        published_at: b.published_at || (blogForm.status === 'published' ? new Date().toISOString() : undefined)
      } : b);
      onUpdateBlogs(updated);
    }
    setEditingBlogId(null);
    setBlogForm({});
  };

  const handleBlogDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const updated = blogs.filter(b => b.id !== id);
      onUpdateBlogs(updated);
    }
  };

  // Certificates CRUD Actions
  const handleCertEditStart = (cert?: Certificate) => {
    if (cert) {
      setEditingCertId(cert.id);
      setCertForm(cert);
    } else {
      setEditingCertId('new');
      setCertForm({
        title: '',
        issuer: '',
        issue_date: new Date().toISOString().split('T')[0],
        credential_id: '',
        verify_url: '',
        image_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400',
        category: 'other',
        is_featured: false,
        display_order: certificates.length + 1
      });
    }
  };

  const handleCertSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title?.trim() || !certForm.issuer?.trim()) return;

    if (editingCertId === 'new') {
      const newCert: Certificate = {
        ...(certForm as Certificate),
        id: `cert_${Date.now()}`,
        created_at: new Date().toISOString()
      };
      onUpdateCertificates([newCert, ...certificates]);
    } else {
      const updated = certificates.map(c => c.id === editingCertId ? (certForm as Certificate) : c);
      onUpdateCertificates(updated);
    }
    setEditingCertId(null);
    setCertForm({});
  };

  const handleCertDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      const updated = certificates.filter(c => c.id !== id);
      onUpdateCertificates(updated);
    }
  };

  // Settings Dynamic Array Handlers
  const handleSkillUpdate = (catIdx: number, itemIdx: number, val: string) => {
    const updatedSkills = [...settings.skills];
    updatedSkills[catIdx].items[itemIdx] = val;
    onUpdateSettings({ ...settings, skills: updatedSkills });
  };

  const handleAddSkill = (catIdx: number) => {
    const updatedSkills = [...settings.skills];
    updatedSkills[catIdx].items.push('New Skill');
    onUpdateSettings({ ...settings, skills: updatedSkills });
  };

  const handleRemoveSkill = (catIdx: number, itemIdx: number) => {
    const updatedSkills = [...settings.skills];
    updatedSkills[catIdx].items.splice(itemIdx, 1);
    onUpdateSettings({ ...settings, skills: updatedSkills });
  };

  // Contacts aggregation
  const unreadContactCount = contacts.filter(c => c.status === 'unread').length;
  const filteredContacts = contactFilter === 'all'
    ? contacts
    : contacts.filter(c => c.status === contactFilter);

  // SECURE AUTH CHECK
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 no-print">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary mx-auto flex items-center justify-center">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Admin CRM Console</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Please authorize with developer key credentials to manage your portfolio content and read enquiries.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="admin-email-input" className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                Console Email
              </label>
              <input
                id="admin-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@qmlabs.com"
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/30 focus:bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-blue-500/5 rounded-xl text-sm transition-all focus:outline-hidden text-slate-800"
                required
              />
            </div>

            <div className="space-y-1.5 font-sans">
              <label htmlFor="admin-password-input" className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                Access Password
              </label>
              <input
                id="admin-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/30 focus:bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-blue-500/5 rounded-xl text-sm transition-all focus:outline-hidden text-slate-800"
                required
              />
            </div>

            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/40 text-[10px] text-primary font-medium tracking-wide flex flex-col space-y-1">
              <p>📍 Admin Access Coordinates:</p>
              <p>• Username: <strong>admin@qmlabs.com</strong></p>
              <p>• Password: <strong>admin123</strong></p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              Authorize Credentials
            </button>
          </form>
        </div>
      </div>
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
            { label: 'Site settings', value: 'settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value as AdminTab);
                  setEditingProjectId(null);
                  setEditingBlogId(null);
                  setEditingCertId(null);
                }}
                className={`flex-shrink-0 lg:w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">{tab.label === 'Site settings' ? 'Settings' : tab.label}</span>
                </div>
                {tab.alert && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isSelected ? 'bg-primary text-white' : 'bg-rose-500 text-white animate-pulse'}`}>
                    {tab.alert}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex-shrink-0 mt-0 lg:mt-6 px-3.5 py-2.5 rounded-xl border border-rose-100 hover:bg-rose-50 text-rose-600 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Right CRM Module Display */}
        <div className="lg:col-span-4 min-h-[550px] flex flex-col">
          {/* TAB 1: METRICS DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Admin Dashboard</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time local statistics and performance trends.</p>
                </div>
                <span className="text-[11px] font-mono bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg">
                  Updated: Today • Live Sync
                </span>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 7 Days View Timeline chart */}
                <div className="md:col-span-2 bg-slate-50/20 border border-slate-100 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Pageviews (Last 7 Days)</h4>
                      <p className="text-[11px] text-slate-400">Timeline tracking visitor volumes.</p>
                    </div>
                    <LineChart className="w-4 h-4 text-primary" />
                  </div>

                  {/* SVG Chart */}
                  <div className="relative w-full h-44">
                    <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="130" x2="500" y2="130" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Spark Gradient */}
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0084ff" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#0084ff" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area fill */}
                      <path
                        d="M 0 130 
                           L 0 100 
                           L 83 90 
                           L 166 70 
                           L 249 55 
                           L 332 80 
                           L 415 45 
                           L 500 25 
                           L 500 130 Z"
                        fill="url(#chartGlow)"
                      />

                      {/* Line graph */}
                      <path
                        d="M 0 100 
                           L 83 90 
                           L 166 70 
                           L 249 55 
                           L 332 80 
                           L 415 45 
                           L 500 25"
                        fill="none"
                        stroke="#0084ff"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Nodes */}
                      {[
                        { x: 0, y: 100, val: views7Days[0] },
                        { x: 83, y: 90, val: views7Days[1] },
                        { x: 166, y: 70, val: views7Days[2] },
                        { x: 249, y: 55, val: views7Days[3] },
                        { x: 332, y: 80, val: views7Days[4] },
                        { x: 415, y: 45, val: views7Days[5] },
                        { x: 500, y: 25, val: views7Days[6] },
                      ].map((pt, idx) => (
                        <g key={idx} className="group/node cursor-pointer">
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="5"
                            fill="#ffffff"
                            stroke="#0084ff"
                            strokeWidth="2.5"
                            className="hover:r-7 transition-all duration-200"
                          />
                          {/* Mini Tooltip */}
                          <foreignObject x={pt.x - 20} y={pt.y - 28} width="40" height="20" className="opacity-0 group-hover/node:opacity-100 transition-opacity">
                            <div className="bg-slate-900 text-white text-[9px] text-center font-mono rounded-md py-0.5 font-bold shadow-md">
                              {pt.val}
                            </div>
                          </foreignObject>
                        </g>
                      ))}
                    </svg>
                  </div>
                  {/* Axis labels */}
                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-1">
                    <span>6 Days Ago</span>
                    <span>4 Days Ago</span>
                    <span>2 Days Ago</span>
                    <span className="font-extrabold text-[#0084ff]">TODAY</span>
                  </div>
                </div>

                {/* Popular files downloads */}
                <div className="bg-slate-50/20 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Downloads & Stats</h4>
                    <p className="text-[11px] text-slate-400">Resume download telemetry.</p>
                  </div>

                  <div className="py-6 flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-50/60 flex items-center justify-center text-primary border border-blue-100/50">
                      <FileText className="w-6 h-6 animate-[bounce_3s_linear_infinite]" />
                    </div>
                    <div className="text-3xl font-black text-slate-800 tracking-tight">{mockResumeDownloadsCount}</div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">Total Resume Handoffs</span>
                  </div>

                  <div className="text-[10px] bg-emerald-50 border border-emerald-100/50 p-2 rounded-xl text-emerald-800 text-center font-medium leading-relaxed">
                    🌟 Direct resume print views generated are optimized for applicant tracking systems (ATS).
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
                            onClick={() => setActiveTab('contacts')}
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
          )}

          {/* TAB 2: PROJECTS PORTFOLIO CRUD */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-fade-in">
              {editingProjectId === null ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Featured Projects</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Control shown cards, image references and repository connections.</p>
                    </div>
                    <button
                      onClick={() => handleProjectEditStart()}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Project
                    </button>
                  </div>

                  {/* List Projects */}
                  <div className="bg-white border border-slate-150/80 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-mono border-b border-slate-100 uppercase tracking-widest">
                            <th className="px-5 py-3">Project specifications</th>
                            <th className="px-5 py-3">Core Tech stack</th>
                            <th className="px-5 py-3">Featured</th>
                            <th className="px-5 py-3">Display Order</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-650">
                          {projects.map((proj) => (
                            <tr key={proj.id} className="hover:bg-slate-50/40">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={proj.images[0]}
                                    alt={proj.title}
                                    referrerPolicy="no-referrer"
                                    className="w-10 h-8 object-cover rounded-md border border-slate-100"
                                  />
                                  <div>
                                    <div className="font-bold text-slate-900 text-sm leading-tight">{proj.title}</div>
                                    <span className="text-[10px] text-slate-400 mt-0.5 block truncate">/{proj.slug}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {proj.technologies.slice(0, 3).map(tech => (
                                    <span key={tech} className="text-[9px] font-extrabold uppercase bg-slate-50 text-slate-450 border border-slate-100 px-1.5 py-0.5 rounded-md">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <button
                                  onClick={() => {
                                    const updated = projects.map(p => p.id === proj.id ? { ...p, is_featured: !p.is_featured } : p);
                                    onUpdateProjects(updated);
                                  }}
                                  className="text-slate-500 hover:text-primary transition-colors focus:outline-hidden"
                                >
                                  {proj.is_featured ? (
                                    <ToggleRight className="w-6 h-6 text-[#0084ff]" />
                                  ) : (
                                    <ToggleLeft className="w-6 h-6 text-slate-300" />
                                  )}
                                </button>
                              </td>
                              <td className="px-5 py-4 font-mono text-slate-550">{proj.display_order}</td>
                              <td className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleProjectEditStart(proj)}
                                    className="p-1.5 text-slate-450 hover:text-primary hover:bg-slate-150/45 rounded-lg cursor-pointer"
                                    title="Edit structural details"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleProjectDelete(proj.id)}
                                    className="p-1.5 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                    title="Erase card"
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
                /* Projects Edit Form View */
                <form onSubmit={handleProjectSave} className="space-y-6 animate-fade-in text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-bold text-slate-800">
                      {editingProjectId === 'new' ? 'Instatialize Project Card' : `Refine Project: ${projectForm.title}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProjectId(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Cancel changes
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Project Title */}
                    <div className="space-y-1">
                      <label htmlFor="pform-title" className="text-xs font-bold text-slate-505 block">Title</label>
                      <input
                        id="pform-title"
                        type="text"
                        value={projectForm.title || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        required
                        placeholder="E.g., Crop Disease Deep Classifier"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-1">
                      <label htmlFor="pform-slug" className="text-xs font-bold text-slate-505 block">Slug</label>
                      <input
                        id="pform-slug"
                        type="text"
                        value={projectForm.slug || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                        placeholder="crop-disease-detection"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                      />
                    </div>

                    {/* Github URL */}
                    <div className="space-y-1">
                      <label htmlFor="pform-github" className="text-xs font-bold text-slate-505 block">GitHub Context Link</label>
                      <input
                        id="pform-github"
                        type="text"
                        value={projectForm.github_url || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                        placeholder="https://github.com/qm-rajat/repo"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                      />
                    </div>

                    {/* Live demo deployment link */}
                    <div className="space-y-1">
                      <label htmlFor="pform-live" className="text-xs font-bold text-slate-505 block">Live Demo Link</label>
                      <input
                        id="pform-live"
                        type="text"
                        value={projectForm.live_url || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                        placeholder="https://crop-disease.example.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                      />
                    </div>

                    {/* Primary Picture Link */}
                    <div className="space-y-1">
                      <label htmlFor="pform-image" className="text-xs font-bold text-slate-505 block">Primary Picture URL</label>
                      <input
                        id="pform-image"
                        type="text"
                        value={projectForm.images?.[0] || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, images: [e.target.value] })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                      />
                    </div>

                    {/* Display Order */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="pform-order" className="text-xs font-bold text-slate-505 block">Display Order</label>
                        <input
                          id="pform-order"
                          type="number"
                          value={projectForm.display_order ?? 1}
                          onChange={(e) => setProjectForm({ ...projectForm, display_order: parseInt(e.target.value) || 1 })}
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                        />
                      </div>
                      {/* Featured checkbox */}
                      <div className="flex items-center gap-2 pt-6 pl-2">
                        <input
                          id="pform-featured"
                          type="checkbox"
                          checked={projectForm.is_featured || false}
                          onChange={(e) => setProjectForm({ ...projectForm, is_featured: e.target.checked })}
                          className="w-4 h-4 text-primary rounded-md border-slate-200"
                        />
                        <label htmlFor="pform-featured" className="text-xs font-bold text-slate-700 block">Is Featured card</label>
                      </div>
                    </div>
                  </div>

                  {/* Tech stack tags */}
                  <div className="space-y-1">
                    <label htmlFor="pform-tech" className="text-xs font-bold text-slate-505 block">Technologies Applied (Comma Separated)</label>
                    <input
                      id="pform-tech"
                      type="text"
                      value={projectForm.technologies?.join(', ') || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      placeholder="Python, OpenCV, TensorFlow, Deep Learning"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                    />
                  </div>

                  {/* Long description */}
                  <div className="space-y-1">
                    <label htmlFor="pform-desc" className="text-xs font-bold text-slate-505 block">Technical Description</label>
                    <textarea
                      id="pform-desc"
                      value={projectForm.description || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      rows={4}
                      required
                      placeholder="Provide full description..."
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:scale-101 active:scale-98 cursor-pointer transition-all"
                  >
                    <Save className="w-4 h-4" /> Save project
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: TECHNICAL BLOGS CRUD */}
          {activeTab === 'blogs' && (
            <div className="space-y-6 animate-fade-in">
              {editingBlogId === null ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Technical Articles</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Control published drafts, tags, and descriptive paragraphs.</p>
                    </div>
                    <button
                      onClick={() => handleBlogEditStart()}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Draft Article
                    </button>
                  </div>

                  {/* List Articles */}
                  <div className="bg-white border border-slate-150/80 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-mono border-b border-slate-100 uppercase tracking-widest">
                            <th className="px-5 py-3">Technical Title</th>
                            <th className="px-5 py-3">Audit Categories</th>
                            <th className="px-5 py-3">State Status</th>
                            <th className="px-5 py-3">Telemetry KPIs</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-650">
                          {blogs.map((b) => (
                            <tr key={b.id} className="hover:bg-slate-50/40">
                              <td className="px-5 py-4 font-bold text-slate-900 text-sm max-w-xs truncate">{b.title}</td>
                              <td className="px-5 py-4 text-slate-500">{b.categories?.join(', ') || 'General'}</td>
                              <td className="px-5 py-4">
                                <span className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                                  b.status === 'published' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-slate-400 space-x-2.5 font-mono">
                                <span>Likes: {b.like_count}</span>
                                <span>Views: {b.view_count}</span>
                              </td>
                              <td className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleBlogEditStart(b)}
                                    className="p-1.5 text-slate-450 hover:text-primary hover:bg-slate-150/45 rounded-lg cursor-pointer"
                                    title="Edit textual content"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleBlogDelete(b.id)}
                                    className="p-1.5 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                    title="Delete article"
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
                /* Blogs CRUD Edit view */
                <form onSubmit={handleBlogSave} className="space-y-6 animate-fade-in text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-bold text-slate-800">
                      {editingBlogId === 'new' ? 'Compose Technical Post' : `Refine Post: ${blogForm.title}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingBlogId(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Title */}
                    <div className="md:col-span-2 space-y-1">
                      <label htmlFor="bform-title" className="text-xs font-bold text-slate-505 block">Article Title</label>
                      <input
                        id="bform-title"
                        type="text"
                        value={blogForm.title || ''}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        required
                        placeholder="E.g., Core Web Vitals Refactoring Tips"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-1">
                      <label htmlFor="bform-status" className="text-xs font-bold text-slate-505 block">State Status</label>
                      <select
                        id="bform-status"
                        value={blogForm.status || 'draft'}
                        onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                      >
                        <option value="draft">Draft - Private</option>
                        <option value="published">Published</option>
                      </select>
                    </div>

                    {/* Excerpt */}
                    <div className="md:col-span-3 space-y-1">
                      <label htmlFor="bform-excerpt" className="text-xs font-bold text-slate-505 block">Technical Summary snippet (Excerpt)</label>
                      <input
                        id="bform-excerpt"
                        type="text"
                        value={blogForm.excerpt || ''}
                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                        placeholder="Provide brief hook..."
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Rich Text Editor Simulation */}
                  <div className="space-y-1 flex flex-col">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-505 block">Main Content (supports Markdown rendering)</label>
                      <div className="flex gap-1 bg-slate-50 border border-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setBlogMode('text')}
                          className={`px-3 py-1 rounded-md cursor-pointer ${blogMode === 'text' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                        >
                          Markdown text
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!blogForm.content_html?.trim()) return;
                            setBlogMode('preview');
                          }}
                          className={`px-3 py-1 rounded-md cursor-pointer ${blogMode === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                        >
                          Prose Previews
                        </button>
                      </div>
                    </div>

                    {blogMode === 'text' ? (
                      <textarea
                        value={blogForm.content_html || ''}
                        onChange={(e) => setBlogForm({ ...blogForm, content_html: e.target.value })}
                        rows={10}
                        required
                        placeholder="Write standard HTML template or tags: <h3>Subhead</h3> <p>Paragraph text</p> <blockquote>Quote</blockquote> ..."
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden font-mono text-slate-700"
                      />
                    ) : (
                      <div
                        className="p-5 border border-slate-150 rounded-xl bg-slate-50/50 blog-prose min-h-[250px]"
                        dangerouslySetInnerHTML={{ __html: blogForm.content_html || '' }}
                      />
                    )}
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-98 cursor-pointer transition-all"
                  >
                    <Save className="w-4 h-4" /> Save article
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: CERTIFICATIONS CRUD */}
          {activeTab === 'certs' && (
            <div className="space-y-6 animate-fade-in">
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
                                    onClick={() => handleCertDelete(c.id)}
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
                        onChange={(e) => setFormState(e.target.value)}
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
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
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
          )}

          {/* TAB 5: CONTACTS LEADS INBOX */}
          {activeTab === 'contacts' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Inbound Leads Hub</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Track, categorize, and archive recruiter communications.</p>
                </div>

                {/* Filter bar */}
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 p-1 rounded-xl">
                  {['all', 'unread', 'read', 'replied', 'archived'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setContactFilter(f as any)}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg cursor-pointer ${
                        contactFilter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredContacts.length === 0 ? (
                <div className="text-center py-16 text-slate-400 bg-slate-50/20 border border-slate-100 rounded-3xl">
                  <Mail className="w-12 h-12 stroke-[1] mx-auto mb-3 text-slate-300 pointer-events-none" />
                  Your mailbox folder is empty.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContacts.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white border border-slate-150/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4 border-l-4 border-l-primary"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-500 font-medium">{lead.email}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-450 font-mono">
                            {new Date(lead.created_at || Date.now()).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                          {lead.message}
                        </p>
                      </div>

                      {/* CRM State dropdown controls */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 pt-2 md:pt-0">
                        <select
                          value={lead.status}
                          onChange={(e) => handleContactStatusChange(lead.id, e.target.value as any)}
                          className="px-2.5 py-1 text-[10px] font-bold uppercase bg-slate-50 border border-slate-150 rounded-lg text-slate-600 focus:outline-hidden"
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>

                        <button
                          onClick={() => handleDeleteContact(lead.id)}
                          className="px-2.5 py-1 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] rounded-lg font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-100 transition-colors"
                          title="Purge message record"
                        >
                          <Archive className="w-3 h-3" /> Archive/Erase
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SITE SETTINGS TAB EDITOR */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Live settings Control</h3>
                <p className="text-xs text-slate-400 mt-0.5">Instantly update bio descriptions, timelines and custom social coordinates.</p>
              </div>

              {/* Sub-tabs header */}
              <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 pb-1.5">
                {[
                  { label: 'Hero & Summary', value: 'hero' },
                  { label: 'Skills lists', value: 'skills' },
                  { label: 'Social connections', value: 'socials' },
                  { label: 'Map / Meta', value: 'seo' }
                ].map((st) => (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => setSettingsSubTab(st.value as any)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                      settingsSubTab === st.value
                        ? 'bg-primary-light text-primary font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Settings Sub-Tab: Hero Context */}
              {settingsSubTab === 'hero' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="set-name" className="text-xs font-bold text-slate-505 block">Profile Name</label>
                      <input
                        id="set-name"
                        type="text"
                        value={settings.hero_name}
                        onChange={(e) => onUpdateSettings({ ...settings, hero_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="set-tagline" className="text-xs font-bold text-slate-505 block">Display Tagline</label>
                      <input
                        id="set-tagline"
                        type="text"
                        value={settings.hero_tagline}
                        onChange={(e) => onUpdateSettings({ ...settings, hero_tagline: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="set-bio" className="text-xs font-bold text-slate-505 block">Hero Synopsis bio</label>
                    <textarea
                      id="set-bio"
                      value={settings.hero_bio}
                      onChange={(e) => onUpdateSettings({ ...settings, hero_bio: e.target.value })}
                      rows={3}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800 resize-none"
                    />
                  </div>

                  <div className="space-y-1 px-1">
                    <label className="text-xs font-bold text-slate-500 block mb-1">Detailed About paragraph (Rich Text Editor)</label>
                    <RichTextEditor
                      value={settings.about_text}
                      onChange={(val) => onUpdateSettings({ ...settings, about_text: val })}
                      placeholder="Write rich formatted bios outlines..."
                    />
                  </div>
                </div>
              )}

              {/* Settings Sub-Tab: Skills configuration */}
              {settingsSubTab === 'skills' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
                    🌟 Live edit your tech competencies tags below. These updates refresh seamlessly on the landing page grids.
                  </div>

                  <div className="space-y-6">
                    {settings.skills.map((cat, catIdx) => (
                      <div key={catIdx} className="bg-slate-50/30 p-4 rounded-2xl border border-slate-150/60 text-left space-y-3">
                        <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-1 flex items-center justify-between">
                          {cat.category}
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {cat.items.map((skill, itemIdx) => (
                            <div key={itemIdx} className="relative group/skill">
                              <input
                                type="text"
                                value={skill}
                                onChange={(e) => handleSkillUpdate(catIdx, itemIdx, e.target.value)}
                                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-primary pr-6 font-medium text-slate-700"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(catIdx, itemIdx)}
                                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover/skill:opacity-100 transition-opacity cursor-pointer text-[9px] font-bold"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddSkill(catIdx)}
                            className="px-3 py-1.5 border border-dashed border-slate-200 text-slate-400 hover:text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            + Add Tag
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Sub-Tab: Social Coordinates */}
              {settingsSubTab === 'socials' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="soc-git" className="text-xs font-bold text-slate-550 block">GitHub Profile</label>
                      <input
                        id="soc-git"
                        type="text"
                        value={settings.social_links.github || ''}
                        onChange={(e) => onUpdateSettings({ ...settings, social_links: { ...settings.social_links, github: e.target.value } })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="soc-link" className="text-xs font-bold text-slate-550 block">LinkedIn Profile</label>
                      <input
                        id="soc-link"
                        type="text"
                        value={settings.social_links.linkedin || ''}
                        onChange={(e) => onUpdateSettings({ ...settings, social_links: { ...settings.social_links, linkedin: e.target.value } })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="soc-twit" className="text-xs font-bold text-slate-550 block">Twitter Profile</label>
                      <input
                        id="soc-twit"
                        type="text"
                        value={settings.social_links.twitter || ''}
                        onChange={(e) => onUpdateSettings({ ...settings, social_links: { ...settings.social_links, twitter: e.target.value } })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="soc-inst" className="text-xs font-bold text-slate-550 block">Instagram Profile</label>
                      <input
                        id="soc-inst"
                        type="text"
                        value={settings.social_links.instagram || ''}
                        onChange={(e) => onUpdateSettings({ ...settings, social_links: { ...settings.social_links, instagram: e.target.value } })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Sub-Tab: Maps & Index */}
              {settingsSubTab === 'seo' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <label htmlFor="seo-title-field" className="text-xs font-bold text-slate-550 block">Canonical Home Title</label>
                    <input
                      id="seo-title-field"
                      type="text"
                      value={settings.seo_home_title}
                      onChange={(e) => onUpdateSettings({ ...settings, seo_home_title: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="maps-field" className="text-xs font-bold text-slate-550 block">Google Maps Embed URL</label>
                    <textarea
                      id="maps-field"
                      value={settings.google_maps_embed_url}
                      onChange={(e) => onUpdateSettings({ ...settings, google_maps_embed_url: e.target.value })}
                      rows={3}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl focus:outline-hidden text-slate-800 font-mono resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Bottom notifications */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Success! Site settings are dynamically tracked in standard localStorage and sync immediately across components.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Helper setter for localized credentials binding
  function setFormState(val: string) {
    setCertForm({ ...certForm, title: val });
  }
}
