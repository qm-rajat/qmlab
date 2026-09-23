import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteSettings, Project, Blog, Certificate, FreelanceService, FAQItem, WorkflowStep, TrustGuarantee } from '../types';
import { 
  Code2, Cpu, Search, Server, Layers, ShieldCheck, CheckCircle2, 
  ArrowRight, Sparkles, Send, Zap, Clock, DollarSign, Calendar, 
  MessageSquare, Briefcase, User, HelpCircle, ChevronDown, ChevronUp, 
  Lock, RefreshCw, FileCheck, Terminal, Compass, Award, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesHomePageProps {
  settings: SiteSettings;
  projects: Project[];
  blogs: Blog[];
  services: FreelanceService[];
  faqs?: FAQItem[];
  workflowSteps?: WorkflowStep[];
  trustGuarantees?: TrustGuarantee[];
}

const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Who owns the intellectual property (IP) and source code?',
    answer: 'You retain 100% full intellectual property and commercial ownership. Upon project delivery and final milestone sign-off, all Git repositories, infrastructure configs, deployment keys, and documentation are transferred completely to your team with no vendor lock-in or recurring licensing fees.',
    category: 'Legal & IP',
    sort_order: 1,
    is_active: true
  },
  {
    id: 'faq-2',
    question: 'How do contract milestones and payments work?',
    answer: 'Engagements are structured into transparent, deliverables-based milestones (typically 30% upfront upon PRD sign-off, 40% mid-sprint MVP demo, and 30% upon production deployment and QA verification). Invoicing is conducted with strict milestone agreements.',
    category: 'Billing & Pricing',
    sort_order: 2,
    is_active: true
  },
  {
    id: 'faq-3',
    question: 'Can you integrate AI / Gemini agents and MCP into our existing codebase?',
    answer: 'Yes. Whether you are building from scratch or extending an existing React, Node.js, Python, or Next.js application, I integrate secure Model Context Protocol (MCP) servers, Google Gemini 2.5/3.0 APIs, and custom RAG pipelines directly with your existing database and authentication systems.',
    category: 'Engineering & Tech',
    sort_order: 3,
    is_active: true
  },
  {
    id: 'faq-4',
    question: 'Do you sign Non-Disclosure Agreements (NDAs)?',
    answer: 'Absolutely. Client confidentiality and proprietary data security are fundamental. I am happy to sign your standard company NDA or provide a mutual NDA prior to our initial technical discovery call.',
    category: 'Legal & IP',
    sort_order: 4,
    is_active: true
  },
  {
    id: 'faq-5',
    question: 'What is included in the 30-day post-launch warranty?',
    answer: 'Every engineering package includes 30 days of comprehensive post-launch warranty support. If any bug, edge-case defect, or configuration discrepancy arises within the agreed scope, it is diagnosed and resolved promptly at zero additional cost.',
    category: 'Delivery & Warranty',
    sort_order: 5,
    is_active: true
  },
  {
    id: 'faq-6',
    question: 'How do you handle collaboration and international timezones?',
    answer: 'I collaborate seamlessly with founders and engineering teams across US (PST/EST), Europe (GMT/CET), and APAC timezones using structured asynchronous updates via Slack/Discord, clear Linear/Jira sprint boards, and scheduled weekly video syncs.',
    category: 'Collaboration',
    sort_order: 6,
    is_active: true
  }
];

const DEFAULT_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'wf-1',
    step: '01',
    title: 'Discovery & Architecture Review',
    timeline: '24–48 Hours',
    description: 'We align on business goals, technical constraints, data schemas, and target timelines to draft a precise scope of work.',
    icon: 'Compass',
    deliverables: ['Scope & Timeline Document', 'Tech Stack Evaluation', 'Milestone Agreement'],
    sort_order: 1
  },
  {
    id: 'wf-2',
    step: '02',
    title: 'PRD & Technical Blueprint',
    timeline: 'Week 1',
    description: 'Translating concepts into a comprehensive Product Requirements Document (PRD), database ERD models, and API interfaces.',
    icon: 'FileCheck',
    deliverables: ['Detailed Technical PRD', 'Database & API Architecture', 'Figma/Component Wireframes'],
    sort_order: 2
  },
  {
    id: 'wf-3',
    step: '03',
    title: 'High-Velocity Sprint Execution',
    timeline: 'Weeks 2–3',
    description: 'Iterative sprint development with modern React 19, TypeScript, secure Node.js APIs, and AI integrations with live demo staging.',
    icon: 'Terminal',
    deliverables: ['Modular TypeScript Codebase', 'Interactive Staging Previews', 'Continuous Async Demos'],
    sort_order: 3
  },
  {
    id: 'wf-4',
    step: '04',
    title: 'QA, Deployment & 30-Day Warranty',
    timeline: 'Week 4',
    description: 'Automated test suite validation, zero-downtime cloud deployment (Cloud Run/AWS), full repository handoff, and 30-day warranty.',
    icon: 'ShieldCheck',
    deliverables: ['Production Cloud Launch', 'Full Git & Secret Transfer', '30-Day Bug-Fix Guarantee'],
    sort_order: 4
  }
];

const DEFAULT_TRUST_GUARANTEES: TrustGuarantee[] = [
  {
    id: 'trust-1',
    title: '100% IP & Code Ownership',
    description: 'Full repository, credentials, and copyright transferred upon delivery.',
    icon: 'Lock',
    sort_order: 1
  },
  {
    id: 'trust-2',
    title: 'Strict NDA Adherence',
    description: 'Your business model, data schemas, and ideas remain 100% confidential.',
    icon: 'ShieldCheck',
    sort_order: 2
  },
  {
    id: 'trust-3',
    title: '30-Day Bug Warranty',
    description: 'Guaranteed post-launch fix coverage for all production deliverables.',
    icon: 'RefreshCw',
    sort_order: 3
  },
  {
    id: 'trust-4',
    title: 'Direct Founder Channel',
    description: 'Real-time sync on Slack, Discord, or email with fast turnaround.',
    icon: 'MessageSquare',
    sort_order: 4
  }
];

const renderWorkflowIcon = (iconName: string) => {
  switch (iconName) {
    case 'Compass': return <Compass className="w-5 h-5" />;
    case 'FileCheck': return <FileCheck className="w-5 h-5" />;
    case 'Terminal': return <Terminal className="w-5 h-5" />;
    case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
    case 'Code2': return <Code2 className="w-5 h-5" />;
    case 'Layers': return <Layers className="w-5 h-5" />;
    case 'Cpu': return <Cpu className="w-5 h-5" />;
    case 'Server': return <Server className="w-5 h-5" />;
    default: return <Compass className="w-5 h-5" />;
  }
};

const renderTrustIcon = (iconName: string) => {
  switch (iconName) {
    case 'Lock': return <Lock className="w-5 h-5" />;
    case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
    case 'RefreshCw': return <RefreshCw className="w-5 h-5" />;
    case 'MessageSquare': return <MessageSquare className="w-5 h-5" />;
    case 'Zap': return <Zap className="w-5 h-5" />;
    case 'Award': return <Award className="w-5 h-5" />;
    case 'Clock': return <Clock className="w-5 h-5" />;
    case 'CheckCircle': return <CheckCircle className="w-5 h-5" />;
    default: return <Lock className="w-5 h-5" />;
  }
};

export default function ServicesHomePage({
  settings,
  projects,
  blogs,
  services,
  faqs = [],
  workflowSteps = [],
  trustGuarantees = []
}: ServicesHomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const displayFaqs = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQ_ITEMS;
  const displayWorkflow = workflowSteps && workflowSteps.length > 0 ? workflowSteps : DEFAULT_WORKFLOW_STEPS;
  const displayTrust = trustGuarantees && trustGuarantees.length > 0 ? trustGuarantees : DEFAULT_TRUST_GUARANTEES;

  const [openFaqId, setOpenFaqId] = useState<string | null>(displayFaqs[0]?.id || 'faq-1');
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    service_id: services[0]?.id || 'srv-1',
    budget: '₹2,000 - ₹5,000',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inquiryForm.name,
          email: inquiryForm.email,
          message: `[Freelance Inquiry - Service ID: ${inquiryForm.service_id} | Budget: ${inquiryForm.budget}]\n\n${inquiryForm.message}`,
          inquiry_type: 'freelance_project'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setInquiryForm({ name: '', email: '', service_id: services[0]?.id || '', budget: '₹2,000 - ₹5,000', message: '' });
      } else {
        setErrorMessage(data.error || 'Failed to submit inquiry.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error.');
    }
    setIsSubmitting(false);
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-6 h-6 text-blue-600" />;
      case 'Search': return <Search className="w-6 h-6 text-emerald-600" />;
      case 'Server': return <Server className="w-6 h-6 text-violet-600" />;
      case 'Layers': return <Layers className="w-6 h-6 text-amber-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-teal-600" />;
      default: return <Code2 className="w-6 h-6 text-indigo-600" />;
    }
  };

  const featuredProjects = projects.filter(p => p.is_featured).slice(0, 3);

  const filteredServices = services
    .filter(s => s.is_active)
    .filter(s => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'engineering') return s.slug.includes('fullstack') || s.slug.includes('ai') || s.slug.includes('cloud');
      if (selectedCategory === 'product') return s.slug.includes('product') || s.slug.includes('strategy');
      if (selectedCategory === 'audits') return s.slug.includes('seo') || s.slug.includes('audit') || s.slug.includes('security');
      return true;
    })
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-12 pb-10">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-6 sm:py-7 lg:py-8 px-5 sm:px-7 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,132,255,0.2),transparent_60%)]"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 items-center relative z-10">
          <div className="w-full space-y-4 lg:space-y-5 text-left">
            {/* Top Brand Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide w-fit">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>QM LABS - ENGINEERING &amp; ADVISORY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.65rem] xl:text-[3.1rem] font-black tracking-tight text-white leading-[1.1] max-w-[560px]">
              High-Performance Software, AI &amp; Technical SEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">Consulting</span>
            </h1>

            <p className="text-sm sm:text-base md:text-[1.05rem] text-slate-300 max-w-[500px] leading-relaxed font-normal">
              {settings.hero_bio || "High-performance software engineering, AI agent & MCP integrations, and technical SEO consulting by Rajat Kumar Dash. Helping startups and enterprises scale with precision."}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <a
                href="#services"
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
              >
                Explore Services <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 backdrop-blur-sm hover:-translate-y-0.5 cursor-pointer"
              >
                Book Consultation <Calendar className="w-4 h-4 text-blue-400" />
              </a>
            </div>

            {/* Relocated Freelance Advisory Badge */}
            <div className="pt-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800/90 text-[11px] sm:text-xs text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Status: <strong className="text-white font-semibold">Available for Q3 Freelance Contracts &amp; Advisory</strong></span>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-center relative select-none">
            {/* Ambient Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-cyan-400/15 to-transparent blur-3xl rounded-full scale-110 pointer-events-none"></div>

            {/* Floating Isometric Illustration Container with subtle float animation */}
            <div className="relative z-10 w-full flex items-center justify-center group transform transition-transform duration-700 hover:scale-[1.02]">
              <img 
                src="/bounce.svg" 
                alt="Holographic System Architecture" 
                width="420"
                height="330"
                fetchPriority="high"
                className="w-full max-w-[28rem] sm:max-w-[32rem] lg:max-w-none h-auto max-h-[260px] sm:max-h-[320px] lg:max-h-[360px] xl:max-h-[400px] object-contain transition-transform duration-700 group-hover:scale-[1.02] filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.55)]"
              />
            </div>

            {/* Quality & Momentum Philosophy Badge Below SVG */}
            <div className="mt-2.5 sm:mt-3 z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-xs font-medium tracking-wide text-slate-300">
                <strong className="text-cyan-300 font-bold">Quality</strong> Builds Trust.{" "}
                <strong className="text-cyan-300 font-bold">Momentum</strong> Drives Growth.
              </span>
            </div>
          </div>
        </div>

        {/* KEY HIGHLIGHT METRICS */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mt-6 pt-5 border-t border-slate-800/80 text-center relative z-10">
          <div className="p-2.5 sm:p-3 bg-slate-900/40 rounded-xl sm:rounded-2xl border border-slate-800/50 backdrop-blur-xs">
            <div className="text-xl sm:text-2xl font-black text-white">100%</div>
            <div className="text-[11px] sm:text-xs text-slate-300 mt-0.5 font-medium">On-Time Delivery</div>
          </div>
          <div className="p-2.5 sm:p-3 bg-slate-900/40 rounded-xl sm:rounded-2xl border border-slate-800/50 backdrop-blur-xs">
            <div className="text-xl sm:text-2xl font-black text-white">5+ Years</div>
            <div className="text-[11px] sm:text-xs text-slate-300 mt-0.5 font-medium">Engineering Mastery</div>
          </div>
          <div className="p-2.5 sm:p-3 bg-slate-900/40 rounded-xl sm:rounded-2xl border border-slate-800/50 backdrop-blur-xs">
            <div className="text-xl sm:text-2xl font-black text-white">Top 1%</div>
            <div className="text-[11px] sm:text-xs text-slate-300 mt-0.5 font-medium">Full-Stack &amp; AI Skills</div>
          </div>
          <div className="p-2.5 sm:p-3 bg-slate-900/40 rounded-xl sm:rounded-2xl border border-slate-800/50 backdrop-blur-xs">
            <div className="text-xl sm:text-2xl font-black text-white">Global</div>
            <div className="text-[11px] sm:text-xs text-slate-300 mt-0.5 font-medium">Client Satisfaction</div>
          </div>
        </div>
      </section>

      {/* CLIENT TRUST & GUARANTEES BAR */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {displayTrust.map((item, idx) => {
            const bgColors = [
              'bg-blue-100/80 text-blue-700',
              'bg-emerald-100/80 text-emerald-700',
              'bg-violet-100/80 text-violet-700',
              'bg-amber-100/80 text-amber-700'
            ];
            const colorClass = bgColors[idx % bgColors.length];
            return (
              <div key={item.id || idx} className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${colorClass}`}>
                  {renderTrustIcon(item.icon)}
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">{item.title}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SERVICES OFFERINGS MATRIX */}
      <section id="services" className="space-y-5 sm:space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-xs uppercase tracking-widest text-blue-600 font-bold">Specialized Solutions</h2>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Freelance Services &amp; Packages</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Tailored engineering and advisory engagements designed to accelerate your product roadmap and maximize ROI.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'all', label: 'All Packages' },
              { id: 'engineering', label: 'Engineering & AI' },
              { id: 'product', label: 'Product & PRD' },
              { id: 'audits', label: 'Audits & SEO' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredServices.map(service => (
            <motion.div
              key={service.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    {getServiceIcon(service.icon)}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wide">
                    {service.pricing_type === 'hourly' ? 'Hourly Rate' : 'Fixed Scope'}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{service.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed min-h-[40px]">{service.short_description}</p>

                <div className="pt-1.5 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Key Deliverables:</div>
                  <ul className="space-y-1">
                    {service.deliverables.map((item, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Starting At / Rate</div>
                  <div className="text-sm sm:text-base font-black text-slate-900">{service.starting_price || 'Custom'}</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" /> {service.turnaround_time}
                  </div>
                </div>
                <a
                  href="#contact"
                  onClick={() => setInquiryForm(prev => ({ ...prev, service_id: service.id }))}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  Book <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW WE WORK - STEP PROCESS */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xl border border-slate-800 space-y-6 sm:space-y-7">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agile Delivery System</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">How We Execute Your Project</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A structured delivery pipeline engineered to eliminate ambiguity, ship high-velocity code, and guarantee on-time launches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          {displayWorkflow.map((wf, idx) => {
            return (
              <div key={wf.id || idx} className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 hover:border-blue-500/50 transition-colors">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl sm:text-2xl font-black font-mono text-blue-400/80">{wf.step || `0${idx + 1}`}</span>
                    {wf.timeline && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-700/50">
                        {wf.timeline}
                      </span>
                    )}
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400">
                    {renderWorkflowIcon(wf.icon)}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white">{wf.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{wf.description}</p>
                </div>

                {wf.deliverables && wf.deliverables.length > 0 && (
                  <div className="pt-2.5 border-t border-slate-700/60 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400 font-mono">Deliverables:</div>
                    <ul className="space-y-1">
                      {wf.deliverables.map((d, dIdx) => (
                        <li key={dIdx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED CASE STUDIES / PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="space-y-5 sm:space-y-6 bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            <div className="space-y-1.5">
              <h2 className="text-xs uppercase tracking-widest text-blue-400 font-bold">Proven Track Record</h2>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Featured Engineering Case Studies</h3>
            </div>
            <Link
              to="/projects"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              View Full Portfolio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {featuredProjects.map(project => (
              <div key={project.id} className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
                <div className="space-y-2.5">
                  {project.image_url && (
                    <img src={project.image_url} alt={project.title} className="w-full h-36 object-cover rounded-lg border border-slate-700" />
                  )}
                  <h4 className="text-base font-bold text-white leading-snug">{project.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-3">{project.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                  {(project.technologies || []).slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-blue-400 text-[10px] font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS & EXPERTISE MATRIX */}
      <section className="space-y-5">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-xs uppercase tracking-widest text-blue-600 font-bold">Core Competencies</h2>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Technical &amp; Domain Expertise</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {[
            { cat: "Frontend Engineering", skills: ["React 19", "TypeScript", "Next.js", "Tailwind CSS", "Vite"] },
            { cat: "Backend & Systems", skills: ["Node.js / Express", "REST & GraphQL", "Redis", "PostgreSQL", "Docker"] },
            { cat: "AI & LLM Architecture", skills: ["Google Gemini API", "Model Context Protocol", "RAG Pipelines", "Agent Tooling"] },
            { cat: "Product & SEO", skills: ["Technical PRD Strategy", "AEO / GEO Optimization", "Core Web Vitals", "Telemetry Analytics"] }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <h4 className="text-sm font-bold text-slate-900">{item.cat}</h4>
              <ul className="space-y-1.5">
                {item.skills.map((skill, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <section className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xs space-y-5 sm:space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-600 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Got Questions?</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Everything you need to know about engagements, code ownership, milestone contracts, and warranty coverage.
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          {displayFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div 
                key={faq.id} 
                className={`border rounded-xl transition-all ${
                  isOpen ? 'border-blue-300 bg-blue-50/20 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full text-left px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2">
                    {faq.category && (
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        {faq.category}
                      </span>
                    )}
                    <span>{faq.question}</span>
                  </div>
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                    isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-3.5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-blue-100/60">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* BOOKING & CONSULTATION FORM */}
      <section id="contact" className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xs max-w-3xl mx-auto space-y-5 sm:space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-xs uppercase tracking-widest text-blue-600 font-bold">Start Your Project</h2>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Book a Technical Consultation</h3>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            Fill out the brief below to discuss your project scope, deliverables, and timeline. I review inquiries and respond within 24 hours.
          </p>
        </div>

        {submitSuccess ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-emerald-900">Inquiry Received Successfully!</h4>
            <p className="text-xs text-emerald-700">Thank you for reaching out. Your project brief has been recorded in the CRM and I will get back to you shortly.</p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="mt-3 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleInquirySubmit} className="space-y-4 sm:space-y-5">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {errorMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="space-y-1">
                <label htmlFor="inquiry-name" className="text-xs font-bold text-slate-700">Your Full Name *</label>
                <input
                  id="inquiry-name"
                  type="text"
                  required
                  value={inquiryForm.name}
                  onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="inquiry-email" className="text-xs font-bold text-slate-700">Business Email *</label>
                <input
                  id="inquiry-email"
                  type="email"
                  required
                  value={inquiryForm.email}
                  onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  placeholder="e.g. sarah@company.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="space-y-1">
                <label htmlFor="inquiry-service-select" className="text-xs font-bold text-slate-700">Select Service Package</label>
                <select
                  id="inquiry-service-select"
                  aria-label="Select Service Package"
                  value={inquiryForm.service_id}
                  onChange={e => setInquiryForm({ ...inquiryForm, service_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.title} ({s.starting_price || 'Custom'})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor="inquiry-budget-select" className="text-xs font-bold text-slate-700">Estimated Budget Range</label>
                <select
                  id="inquiry-budget-select"
                  aria-label="Estimated Budget Range"
                  value={inquiryForm.budget}
                  onChange={e => setInquiryForm({ ...inquiryForm, budget: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="₹2,000 - ₹5,000">₹2,000 - ₹5,000</option>
                  <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
                  <option value="₹10,000 - ₹15,000">₹10,000 - ₹15,000</option>
                  <option value="₹15,000 - ₹25,000">₹15,000 - ₹25,000</option>
                  <option value="₹25,000+">₹25,000+ (Comprehensive / Custom)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="inquiry-message" className="text-xs font-bold text-slate-700">Project Details &amp; Requirements *</label>
              <textarea
                id="inquiry-message"
                required
                rows={3}
                value={inquiryForm.message}
                onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                placeholder="Describe your project goals, tech stack preferences, and desired timeline..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? <span className="animate-spin">⏳</span> : <Send className="w-4 h-4" />}
              {isSubmitting ? 'Sending Brief...' : 'Submit Project Brief'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
