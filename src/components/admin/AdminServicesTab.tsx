import React, { useState } from 'react';
import { FreelanceService } from '../../types';
import { Plus, Trash2, Edit3, Check, X, Shield, Code2, Cpu, Search, Server, ArrowUp, ArrowDown, AlertCircle, RefreshCw } from 'lucide-react';

interface AdminServicesTabProps {
  services: FreelanceService[];
  onUpdateServices: (services: FreelanceService[]) => void;
  onDeleteServiceRequest?: (id: string, title: string) => void;
}

const DEFAULT_INR_SERVICES: FreelanceService[] = [
  {
    id: "srv-1",
    title: "Full-Stack Web Engineering & SaaS",
    slug: "fullstack-web-engineering",
    short_description: "High-performance React, TypeScript, and Node.js applications built for speed, scalability, and conversion.",
    full_description: "End-to-end development of modern web apps, dashboards, and SaaS platforms. Built with robust REST APIs, secure authentication, and responsive Tailwind layouts.",
    icon: "Code2",
    deliverables: ["Production-ready Web App", "Responsive Tailwind UI", "REST/GraphQL API", "Secure Auth & Database"],
    pricing_type: "fixed",
    starting_price: "₹15,000",
    turnaround_time: "2-4 Weeks",
    is_active: true,
    sort_order: 1
  },
  {
    id: "srv-2",
    title: "AI & LLM / MCP Integration",
    slug: "ai-llm-mcp-integration",
    short_description: "Custom AI agents, Gemini API integration, Model Context Protocol (MCP) servers, and smart automation.",
    full_description: "Supercharge your software with generative AI. Implement custom embeddings, RAG pipelines, automated workflows, and intelligent assistant features securely.",
    icon: "Cpu",
    deliverables: ["Custom Gemini/OpenAI Integration", "Model Context Protocol (MCP) Server", "RAG & Document Search", "Secure Server-Side Proxy"],
    pricing_type: "fixed",
    starting_price: "₹18,000",
    turnaround_time: "2-3 Weeks",
    is_active: true,
    sort_order: 2
  },
  {
    id: "srv-3",
    title: "Technical SEO, AEO & GEO Optimization",
    slug: "technical-seo-aeo-geo",
    short_description: "Dominate search engines and AI answer engines (ChatGPT, Perplexity) with advanced technical auditing.",
    full_description: "Optimize your web presence for both traditional search and AI answer engines. Structured JSON-LD schemas, lightning-fast Core Web Vitals, and regional GEO targeting.",
    icon: "Search",
    deliverables: ["Complete Technical SEO Audit", "Schema.org JSON-LD Implementation", "AEO / AI Citation Optimization", "Core Web Vitals Tuning"],
    pricing_type: "fixed",
    starting_price: "₹8,000",
    turnaround_time: "1-2 Weeks",
    is_active: true,
    sort_order: 3
  },
  {
    id: "srv-4",
    title: "Cloud Architecture & DevOps Advisory",
    slug: "cloud-architecture-devops",
    short_description: "Scalable cloud deployment, Dockerization, CI/CD pipelines, and high-availability server setups.",
    full_description: "Expert guidance and setup for Cloud Run, Vercel, AWS, Redis, and PostgreSQL with enterprise-grade security and automated deployment pipelines.",
    icon: "Server",
    deliverables: ["Cloud Architecture Blueprint", "Docker & CI/CD Pipelines", "Database Security Hardening", "Monitoring & Telemetry"],
    pricing_type: "hourly",
    starting_price: "₹1,500/hr",
    turnaround_time: "Flexible",
    is_active: true,
    sort_order: 4
  },
  {
    id: "srv-5",
    title: "Product Strategy & Technical PRD Sprint",
    slug: "product-strategy-prd-sprint",
    short_description: "Bridge business vision and engineering with detailed PRDs, system schemas, user journeys, and sprint backlogs.",
    full_description: "Leveraging a dual Computer Science and Product Management background, turn ambiguous ideas into an actionable, engineer-ready Product Requirements Document (PRD) with interactive wireframes and database schemas.",
    icon: "Layers",
    deliverables: ["Comprehensive Technical PRD", "System Architecture & ERD Schemas", "Prioritized Sprint Roadmap (Jira/Linear)", "Wireframes & User Flow Specs"],
    pricing_type: "fixed",
    starting_price: "₹10,000",
    turnaround_time: "1-2 Weeks",
    is_active: true,
    sort_order: 5
  },
  {
    id: "srv-6",
    title: "Codebase Health, Speed & Security Audit",
    slug: "codebase-health-security-audit",
    short_description: "Rapid 3-day deep-dive audit uncovering security vulnerabilities, performance bottlenecks, and scale limits.",
    full_description: "An intensive code and architecture review analyzing frontend bundle metrics, database query latency, API security risks, and technical debt with an actionable remediation playbook.",
    icon: "ShieldCheck",
    deliverables: ["Comprehensive Audit Report PDF", "Core Web Vitals Remediation Plan", "API Security & Vulnerability Scan", "1-on-1 Executive Walkthrough Call"],
    pricing_type: "fixed",
    starting_price: "₹5,000",
    turnaround_time: "3-5 Days",
    is_active: true,
    sort_order: 6
  }
];

export default function AdminServicesTab({ services, onUpdateServices, onDeleteServiceRequest }: AdminServicesTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FreelanceService>({
    id: '',
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    icon: 'Code2',
    deliverables: [],
    pricing_type: 'fixed',
    starting_price: '',
    turnaround_time: '2-4 Weeks',
    is_active: true,
    sort_order: services.length + 1
  });
  const [deliverableInput, setDeliverableInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleStartCreate = () => {
    setFormError(null);
    setFormData({
      id: `srv-${Date.now()}`,
      title: '',
      slug: '',
      short_description: '',
      full_description: '',
      icon: 'Code2',
      deliverables: ['Production-ready Code', 'Responsive UI', 'Secure API'],
      pricing_type: 'fixed',
      starting_price: '₹5,000',
      turnaround_time: '2-4 Weeks',
      is_active: true,
      sort_order: services.length + 1
    });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleStartEdit = (service: FreelanceService) => {
    setFormError(null);
    setFormData({ ...service });
    setEditingId(service.id);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      setFormError("Service title is required.");
      return;
    }
    setFormError(null);
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const updatedService = { ...formData, slug };

    let updatedList: FreelanceService[];
    if (isCreating) {
      updatedList = [...services, updatedService];
    } else {
      updatedList = services.map(s => s.id === formData.id ? updatedService : s);
    }

    onUpdateServices(updatedList);
    setEditingId(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (onDeleteServiceRequest) {
      onDeleteServiceRequest(id, title);
    } else {
      const updatedList = services.filter(s => s.id !== id);
      onUpdateServices(updatedList);
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
    if (newIndex < 0 || newIndex >= services.length) return;
    const list = [...services];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;
    // Update sort_order
    const reordered = list.map((s, idx) => ({ ...s, sort_order: idx + 1 }));
    onUpdateServices(reordered);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Freelance Services Management</h3>
          <p className="text-xs text-slate-500">Configure service offerings, packages, pricing, and deliverables displayed on qmlab.in.</p>
        </div>
        {!isCreating && !editingId && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm("Convert all current service prices to INR (₹) rates?")) {
                  const converted = services.map(s => {
                    let newPrice = s.starting_price || '';
                    if (newPrice.includes('$2,500')) newPrice = '₹15,000';
                    else if (newPrice.includes('$3,000')) newPrice = '₹18,000';
                    else if (newPrice.includes('$1,500')) newPrice = '₹8,000';
                    else if (newPrice.includes('$150/hr')) newPrice = '₹1,500/hr';
                    else if (newPrice.includes('$1,800')) newPrice = '₹10,000';
                    else if (newPrice.includes('$1,200')) newPrice = '₹5,000';
                    else newPrice = newPrice.replace(/\$/g, '₹');
                    return { ...s, starting_price: newPrice };
                  });
                  onUpdateServices(converted);
                }
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Convert existing dollar prices to INR"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Convert All to INR (₹)
            </button>
            <button
              onClick={() => {
                if (window.confirm("Reset services list to default curated Indian Rupee (₹) service packages?")) {
                  onUpdateServices(DEFAULT_INR_SERVICES);
                }
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset to default INR packages"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Reset to INR Defaults
            </button>
            <button
              onClick={handleStartCreate}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Service
            </button>
          </div>
        )}
      </div>

      {/* CREATE / EDIT FORM MODAL OR CARD */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-2xl border-2 border-blue-500 p-6 shadow-lg space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase">
              {isCreating ? 'Create New Freelance Service' : 'Edit Service Package'}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Service Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Full-Stack SaaS Engineering"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">URL Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. full-stack-saas"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Icon Type</label>
              <select
                value={formData.icon}
                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Code2">Code2 (Development)</option>
                <option value="Cpu">Cpu (AI / LLM)</option>
                <option value="Search">Search (SEO)</option>
                <option value="Server">Server (Cloud / DevOps)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Pricing Type</label>
              <select
                value={formData.pricing_type}
                onChange={e => setFormData({ ...formData, pricing_type: e.target.value as any })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="fixed">Fixed Scope Package</option>
                <option value="hourly">Hourly Rate</option>
                <option value="retainer">Monthly Retainer</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Starting Price / Rate</label>
              <input
                type="text"
                value={formData.starting_price}
                onChange={e => setFormData({ ...formData, starting_price: e.target.value })}
                placeholder="e.g. ₹5,000 or ₹1,500/hr"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Turnaround Time</label>
              <input
                type="text"
                value={formData.turnaround_time}
                onChange={e => setFormData({ ...formData, turnaround_time: e.target.value })}
                placeholder="e.g. 2-4 Weeks"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center pt-6 gap-3">
              <input
                type="checkbox"
                id="is_active_toggle"
                checked={formData.is_active}
                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="is_active_toggle" className="text-xs font-bold text-slate-700 cursor-pointer">
                Active & Visible on qmlab.in Service Landing Page
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Short Description (Card Subtitle)</label>
            <input
              type="text"
              value={formData.short_description}
              onChange={e => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Brief summary for service cards..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Full Description</label>
            <textarea
              rows={3}
              value={formData.full_description}
              onChange={e => setFormData({ ...formData, full_description: e.target.value })}
              placeholder="Detailed description of what is included..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            ></textarea>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700">Key Deliverables</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={deliverableInput}
                onChange={e => setDeliverableInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddDeliverable(); } }}
                placeholder="Add a deliverable item and press enter..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {(formData.deliverables || []).map((item, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                  {item}
                  <button type="button" onClick={() => handleRemoveDeliverable(idx)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => { setIsCreating(false); setEditingId(null); }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md"
            >
              Save Service Package
            </button>
          </div>
        </div>
      )}

      {/* SERVICES LIST TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {services.map((service, index) => (
            <div key={service.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {service.icon === 'Cpu' ? <Cpu className="w-5 h-5 text-blue-600" /> :
                   service.icon === 'Search' ? <Search className="w-5 h-5 text-emerald-600" /> :
                   service.icon === 'Server' ? <Server className="w-5 h-5 text-violet-600" /> :
                   <Code2 className="w-5 h-5 text-indigo-600" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{service.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${service.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                      {service.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 max-w-xl">{service.short_description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>Pricing: <strong className="text-slate-700">{service.starting_price || 'Custom'}</strong></span>
                    <span>•</span>
                    <span>Turnaround: <strong className="text-slate-700">{service.turnaround_time}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === services.length - 1}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={() => handleStartEdit(service)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-white hover:border-slate-300 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id, service.title)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}

          {services.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-xs">
              No freelance services configured yet. Click "Add New Service" above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
