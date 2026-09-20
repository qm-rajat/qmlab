import React, { useState } from 'react';
import { SiteSettings, Project, Blog, Certificate, FreelanceService } from '../types';
import { Code2, Cpu, Search, Server, CheckCircle2, ArrowRight, Sparkles, Send, ShieldCheck, Zap, Clock, DollarSign, Calendar, MessageSquare, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesHomePageProps {
  settings: SiteSettings;
  projects: Project[];
  blogs: Blog[];
  services: FreelanceService[];
}

export default function ServicesHomePage({ settings, projects, blogs, services }: ServicesHomePageProps) {
  const [selectedService, setSelectedService] = useState<FreelanceService | null>(null);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    service_id: services[0]?.id || '',
    budget: '$2,500 - $5,000',
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
        setInquiryForm({ name: '', email: '', service_id: services[0]?.id || '', budget: '$2,500 - $5,000', message: '' });
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
      default: return <Code2 className="w-6 h-6 text-indigo-600" />;
    }
  };

  const featuredProjects = projects.filter(p => p.is_featured).slice(0, 3);
  const publishedBlogs = blogs.filter(b => b.status === 'published').slice(0, 2);

  return (
    <div className="space-y-16 lg:space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-8 sm:py-10 lg:py-11 xl:py-12 px-5 sm:px-8 lg:px-11 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl shadow-2xl border border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,132,255,0.2),transparent_60%)]"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 items-center relative z-10">
          <div className="w-full space-y-5 lg:space-y-5.5 text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.65rem] xl:text-[3.1rem] font-black tracking-tight text-white leading-[1.1] max-w-[540px]">
              High-Performance Software, AI & Technical SEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">Consulting</span>
            </h1>

            <p className="text-sm sm:text-base md:text-[1.05rem] text-slate-300 max-w-[500px] leading-relaxed font-normal">
              {settings.hero_bio || "Senior Full-Stack Engineer & Technical Product Manager helping high-growth startups and enterprises build scalable web apps, custom Gemini AI agents, and dominate search/AEO rankings."}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <a
                href="#services"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:-translate-y-0.5"
              >
                Explore Services <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 backdrop-blur-sm hover:-translate-y-0.5"
              >
                Book Consultation <Calendar className="w-4 h-4 text-blue-400" />
              </a>
            </div>

            {/* Relocated Freelance Advisory Badge */}
            <div className="pt-1">
              <div className="inline-flex max-w-full items-start sm:items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold tracking-wide shadow-lg">
                <span className="mt-0.5 sm:mt-0 w-2 h-2 shrink-0 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.9)]"></span>
                <span className="leading-relaxed">Status: <strong className="text-white">Available for Q3 Freelance Contracts & Advisory</strong></span>
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-center relative lg:min-h-[22rem] xl:min-h-[25rem]">
            {/* Ambient background glow for unbounded graphic */}
            <div className="absolute w-72 h-72 sm:w-88 sm:h-88 bg-blue-500/15 blur-3xl pointer-events-none rounded-full"></div>
            
            {/* Freely Floating Holographic Isometric Animated SVG */}
            <div className="relative w-full flex items-center justify-center p-0 group z-10">
              <img 
                src="/bounce.svg" 
                alt="Holographic System Architecture" 
                className="w-full max-w-[30rem] sm:max-w-[34rem] lg:max-w-none h-auto max-h-[290px] sm:max-h-[350px] lg:max-h-[390px] xl:max-h-[430px] object-contain transition-transform duration-700 group-hover:scale-[1.02] filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 sm:mt-8 sm:pt-7 border-t border-slate-800/80 text-center relative z-10">
          <div className="p-3 sm:p-3.5 bg-slate-900/40 rounded-xl sm:rounded-2xl border border-slate-800/50 backdrop-blur-xs">
            <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">On-Time Delivery</div>
          </div>
          <div className="p-3 sm:p-3.5 bg-slate-900/40 rounded-xl sm:rounded-2xl border border-slate-800/50 backdrop-blur-xs">
            <div className="text-2xl sm:text-3xl font-black text-white">5+ Years</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Engineering Mastery</div>
          </div>
          <div className="p-3 sm:p-3.5 bg-slate-900/40 rounded-xl sm:rounded-2xl border border-slate-800/50 backdrop-blur-xs">
            <div className="text-2xl sm:text-3xl font-black text-white">Top 1%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Full-Stack & AI Skills</div>
          </div>
          <div className="p-3 sm:p-3.5 bg-slate-900/40 rounded-xl sm:rounded-2xl border border-slate-800/50 backdrop-blur-xs">
            <div className="text-2xl sm:text-3xl font-black text-white">Global</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Client Satisfaction</div>
          </div>
        </div>
      </section>

      {/* SERVICES OFFERINGS MATRIX */}
      <section id="services" className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-xs uppercase tracking-widest text-blue-600 font-bold">Specialized Solutions</h2>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Freelance Services & Packages</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Tailored engineering and advisory engagements designed to accelerate your product roadmap and maximize ROI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.filter(s => s.is_active).sort((a, b) => a.sort_order - b.sort_order).map(service => (
            <motion.div
              key={service.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    {getServiceIcon(service.icon)}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wide">
                    {service.pricing_type === 'hourly' ? 'Hourly Rate' : 'Fixed Scope'}
                  </span>
                </div>

                <h4 className="text-xl font-bold text-slate-900">{service.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{service.short_description}</p>

                <div className="pt-2 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Deliverables:</div>
                  <ul className="space-y-1.5">
                    {service.deliverables.map((item, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Starting At / Rate</div>
                  <div className="text-lg font-black text-slate-900">{service.starting_price || 'Custom'}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {service.turnaround_time}
                  </div>
                </div>
                <a
                  href="#contact"
                  onClick={() => setInquiryForm(prev => ({ ...prev, service_id: service.id }))}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
                >
                  Book Service <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED CASE STUDIES / PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="space-y-10 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-widest text-blue-400 font-bold">Proven Track Record</h2>
              <h3 className="text-3xl font-black text-white tracking-tight">Featured Engineering Case Studies</h3>
            </div>
            <a
              href="https://rajat.qmlab.in"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
            >
              View Full Portfolio <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map(project => (
              <div key={project.id} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {project.image_url && (
                    <img src={project.image_url} alt={project.title} className="w-full h-40 object-cover rounded-xl border border-slate-700" />
                  )}
                  <h4 className="text-lg font-bold text-white">{project.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-3">{project.description}</p>
                </div>
                <div className="pt-4 border-t border-slate-700/60 flex flex-wrap gap-1.5">
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
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h2 className="text-xs uppercase tracking-widest text-blue-600 font-bold">Core Competencies</h2>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Technical & Domain Expertise</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { cat: "Frontend Engineering", skills: ["React 19", "TypeScript", "Next.js", "Tailwind CSS", "Vite"] },
            { cat: "Backend & Systems", skills: ["Node.js / Express", "REST APIs", "Redis", "PostgreSQL", "Docker"] },
            { cat: "AI & LLM Architecture", skills: ["Google Gemini API", "Model Context Protocol", "RAG Pipelines", "Prompt Engineering"] },
            { cat: "Product & SEO", skills: ["Technical SEO", "AEO / GEO Optimization", "PRD Strategy", "Analytics & Telemetry"] }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-900">{item.cat}</h4>
              <ul className="space-y-1.5">
                {item.skills.map((skill, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING & CONSULTATION FORM */}
      <section id="contact" className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xs uppercase tracking-widest text-blue-600 font-bold">Start Your Project</h2>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Book a Technical Consultation</h3>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            Fill out the form below to discuss your project scope, timeline, and deliverables. I respond within 24 hours.
          </p>
        </div>

        {submitSuccess ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-lg font-bold text-emerald-900">Inquiry Received Successfully!</h4>
            <p className="text-xs text-emerald-700">Thank you for reaching out. Your project brief has been recorded in the CRM and I will get back to you shortly.</p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-500 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleInquirySubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {errorMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={inquiryForm.name}
                  onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Business Email *</label>
                <input
                  type="email"
                  required
                  value={inquiryForm.email}
                  onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  placeholder="e.g. sarah@company.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Select Service Package</label>
                <select
                  value={inquiryForm.service_id}
                  onChange={e => setInquiryForm({ ...inquiryForm, service_id: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.title} ({s.starting_price || 'Custom'})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Estimated Budget Range</label>
                <select
                  value={inquiryForm.budget}
                  onChange={e => setInquiryForm({ ...inquiryForm, budget: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000+">$10,000+ (Enterprise)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Project Details & Requirements *</label>
              <textarea
                required
                rows={4}
                value={inquiryForm.message}
                onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                placeholder="Describe your project goals, tech stack preferences, and desired timeline..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
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
