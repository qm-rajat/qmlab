import React from 'react';
import { 
  Sparkles, FileText, Mail, ArrowUpRight, Briefcase, 
  Layers, Zap, TrendingUp, Cpu, CheckCircle, BookOpen, 
  GraduationCap, Code, Globe, Database, ShieldCheck, Terminal
} from 'lucide-react';
import { motion } from 'motion/react';
import { SiteSettings, Project } from '../../types';
import QMLogo from '../QMLogo';
import TechnicalSkillsMatrix from '../TechnicalSkillsMatrix';
import TypewriterRoles from '../TypewriterRoles';
import FeaturedProjects from '../FeaturedProjects';
// @ts-expect-error - PNG files are handled natively by Vite
import rajatAvatar from '../../assets/images/rajat_avatar_1781089080303.png';

const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 90, damping: 14 }
  }
};

export const getCategoryDetails = (category: string) => {
  const norm = category.toLowerCase();
  if (norm.includes('web') || norm.includes('dev') || norm.includes('front') || norm.includes('back') || norm.includes('react') || norm.includes('full')) {
    return {
      icon: Code,
      bgColor: 'bg-[#EEEDFE]',
      barColor: 'bg-[#534AB7]',
      textColor: 'text-[#3C3489]',
      accentColor: '#3C3489',
      desc: 'Full-stack infrastructure, interactive web applications, and modern responsive user interfaces.'
    };
  }
  if (norm.includes('seo') || norm.includes('analytics') || norm.includes('search') || norm.includes('marketing') || norm.includes('crawl')) {
    return {
      icon: Globe,
      bgColor: 'bg-[#E1F5EE]',
      barColor: 'bg-[#1D9E75]',
      textColor: 'text-[#085041]',
      accentColor: '#085041',
      desc: 'Core Web Vitals tuning, structured schema integrations, crawl efficiency, and analytical funnels.'
    };
  }
  if (norm.includes('qa') || norm.includes('test') || norm.includes('automation') || norm.includes('scripting')) {
    return {
      icon: Cpu,
      bgColor: 'bg-[#FAECE7]',
      barColor: 'bg-[#D85A30]',
      textColor: 'text-[#712B13]',
      accentColor: '#712B13',
      desc: 'Selenium automation architectures, robust regression suites, Python diagnostics, and API verification.'
    };
  }
  if (norm.includes('data') || norm.includes('science') || norm.includes('bi') || norm.includes('ml') || norm.includes('machine') || norm.includes('analytics')) {
    return {
      icon: Database,
      bgColor: 'bg-[#E6F1FB]',
      barColor: 'bg-[#378ADD]',
      textColor: 'text-[#0C447C]',
      accentColor: '#0C447C',
      desc: 'Exploratory data pipelines (Pandas/NumPy), custom visualizations, machine learning, and BI reports.'
    };
  }
  if (norm.includes('cyber') || norm.includes('security') || norm.includes('infra') || norm.includes('network') || norm.includes('vulnerability')) {
    return {
      icon: ShieldCheck,
      bgColor: 'bg-[#FAEEDA]',
      barColor: 'bg-[#BA7517]',
      textColor: 'text-[#633806]',
      accentColor: '#633806',
      desc: 'Packet diagnostics, active threat mitigation, secure local environments, and Nmap audits.'
    };
  }
  return {
    icon: Terminal,
    bgColor: 'bg-[#F1F5F9]',
    barColor: 'bg-[#475569]',
    textColor: 'text-[#1E293B]',
    accentColor: '#1E293B',
    desc: 'General software tools, scripting routines, operating systems, and secondary environments.'
  };
};

interface OverviewViewProps {
  settings: SiteSettings;
  projects: Project[];
  certificatesCount: number;
  uniqueBlogCatsCount: number;
  skillSearch: string;
  selectedSkillCat: string | null;
  onSelectSkillCat: (cat: string | null) => void;
  onNavigate: (view: string) => void;
}

export default function OverviewView({
  settings,
  projects,
  certificatesCount,
  uniqueBlogCatsCount,
  skillSearch,
  selectedSkillCat,
  onSelectSkillCat,
  onNavigate
}: OverviewViewProps) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-16 pb-16"
    >
      {/* SECTION: PORTFOLIO HERO */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={heroContainerVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-2 pb-6 relative text-left"
      >
        {/* Decorative Background Glowing Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none -z-10" />

        {/* Left Column: Brand Greeting Card & Technical Specialization */}
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* Floating Action Availability Tag */}
          <motion.div 
            variants={heroItemVariants}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white border border-blue-500/15 text-[#0084ff] rounded-full text-xs font-bold shadow-xs hover:border-blue-500/30 transition-colors select-none font-sans"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wide text-[11px] font-mono uppercase text-emerald-600">Status: Freelancer Available</span>
          </motion.div>
          
          {/* Majestic Heading & Signature Presentation */}
          <div className="space-y-3">
            <motion.div variants={heroItemVariants}>
              <span className="text-xs font-black uppercase tracking-[0.3em] font-mono text-slate-450 block mb-1">WELCOME TO THE PORTFOLIO</span>
            </motion.div>
            
            <motion.h1 
              variants={heroItemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-[1.08] font-sans"
            >
              Hi, I'm <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-[#0084ff] to-cyan-500 animate-gradient-xy font-extrabold">{settings.hero_name}</span>
            </motion.h1>
            
            {/* Dynamic Animated Typewriter: Types out roles */}
            <motion.div variants={heroItemVariants}>
              <TypewriterRoles />
            </motion.div>
          </div>

          {/* Portfolio bio text sentence */}
          <motion.p 
            variants={heroItemVariants}
            className="text-sm md:text-base text-slate-500 leading-relaxed max-w-2xl font-normal border-l-2 border-blue-500/30 pl-4 py-1"
          >
            {settings.hero_bio}
          </motion.p>

          {/* HIGH-CREDIBILITY MICRO-STATS STRIP */}
          <motion.div 
            variants={heroItemVariants}
            className="grid grid-cols-3 gap-3 pt-1 max-w-xl"
          >
            <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-3 shadow-2xs hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">{settings.hero_stats?.[0]?.label || "Experience"}</span>
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 font-sans tracking-tight">{settings.hero_stats?.[0]?.value || "3+ Years"}</div>
              <div className="text-[10px] text-slate-500 font-medium">{settings.hero_stats?.[0]?.subtext || "Production Eng"}</div>
            </div>

            <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-3 shadow-2xs hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">{settings.hero_stats?.[1]?.label || "Delivered"}</span>
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 font-sans tracking-tight">{settings.hero_stats?.[1]?.value || "15+ Systems"}</div>
              <div className="text-[10px] text-slate-500 font-medium">{settings.hero_stats?.[1]?.subtext || "Full-Stack & SEO"}</div>
            </div>

            <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-3 shadow-2xs hover:border-purple-500/30 transition-all">
              <div className="flex items-center gap-1.5 text-purple-600 mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">{settings.hero_stats?.[2]?.label || "Lighthouse"}</span>
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 font-sans tracking-tight">{settings.hero_stats?.[2]?.value || "100/100"}</div>
              <div className="text-[10px] text-slate-500 font-medium">{settings.hero_stats?.[2]?.subtext || "Core Web Vitals"}</div>
            </div>
          </motion.div>

          {/* Staggered Quick Actions buttons */}
          <motion.div 
            variants={heroItemVariants}
            className="flex flex-wrap items-center gap-3.5 pt-2"
          >
            <button
              onClick={() => {
                onNavigate('projects');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group px-6 py-3.5 bg-gradient-to-r from-blue-600 via-[#0084ff] to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              Explore Projects
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 bg-white border border-slate-200 hover:border-blue-500/40 text-slate-700 hover:text-[#0084ff] rounded-2xl text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-blue-50/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              Get In Touch
              <Mail className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => {
                onNavigate('resume');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Resume
            </button>
          </motion.div>
        </div>

        {/* Right Column: Glassmorphic Floating Picture Visualizer & Dynamic Live Badges */}
        <motion.div 
          variants={heroItemVariants}
          className="lg:col-span-5 flex items-center justify-center relative p-8 select-none"
        >
          {/* Concentric rotating glowing rings */}
          <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-blue-500/15 animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-[300px] h-[300px] rounded-full border border-dotted border-indigo-500/20 animate-[spin_35s_linear_infinite_reverse]" />
          <div className="absolute w-64 h-64 rounded-full bg-[#0084ff]/5 blur-3xl" />

          {/* Interactive Depth Card hosting the avatar illustration */}
          <motion.div 
            whileHover={{ scale: 1.02, rotateY: 3, rotateX: -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative bg-white/80 p-5 rounded-[2.5rem] border border-blue-500/10 shadow-xl h-[280px] w-[280px] flex items-center justify-center cursor-pointer overflow-visible z-10 hover:border-blue-500/20"
          >
            <div className="w-full h-full rounded-[2rem] overflow-hidden bg-slate-55 border border-slate-100 flex items-center justify-center shadow-inner">
              <img
                src={rajatAvatar}
                alt="Rajat Kumar Dash Avatar Illustration"
                referrerPolicy="no-referrer"
                className="w-[200px] h-[200px] object-cover select-none pointer-events-none"
              />
            </div>

            {/* DYNAMIC TELEMETRY WIDGET 1: SEO HEALTH TRACKER */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.2 }}
              className="absolute -top-4 -right-8 bg-white/95 border border-slate-150 p-2.5 rounded-2xl shadow-lg flex items-center gap-2 max-w-[160px] z-20 backdrop-blur-xs hover:border-blue-500 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-650 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                <TrendingUp className="w-4 h-4 animate-pulse" />
              </div>
              <div className="text-left font-sans">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block font-mono">SEO Score</span>
                <span className="text-[10px] font-extrabold text-slate-800 font-mono">99% LCP PASS</span>
              </div>
            </motion.div>

            {/* DYNAMIC TELEMETRY WIDGET 2: CODE STACK FLAG */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-2 -left-8 bg-white/95 border border-slate-150 p-2.5 rounded-2xl shadow-lg flex items-center gap-2 max-w-[160px] z-20 backdrop-blur-xs hover:border-indigo-500 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-100">
                <Cpu className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
              </div>
              <div className="text-left font-sans">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Dev Stack</span>
                <span className="text-[10px] font-extrabold text-slate-805 font-mono">REACT & PYTHON</span>
              </div>
            </motion.div>

            {/* DYNAMIC TELEMETRY WIDGET 3: AUTOMATION STATS */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-white/95 border border-slate-150 p-2.5 rounded-2xl shadow-lg flex items-center gap-2 max-w-[165px] z-20 backdrop-blur-xs hover:border-emerald-500 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-605 flex items-center justify-center flex-shrink-0 border border-sky-100">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="text-left font-sans">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block font-mono">QA Suites</span>
                <span className="text-[10px] font-extrabold text-slate-850 font-mono">100% SUCCESS</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* SECTION: QM LABS BRAND STRIP */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 bg-white border border-slate-150 rounded-3xl px-6 py-5 shadow-xs">
          <div className="flex-shrink-0">
            <QMLogo size="xs" showTagline={false} interactive={false} />
          </div>
          <div className="hidden sm:block w-px h-10 bg-slate-150" />
          <div className="text-center sm:text-left space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono text-slate-400 block">
              {settings.company_name || "QM Labs"}
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-snug font-sans">
              Engineering Next-Gen Uptime &amp; Crawl Strategy.
            </h3>
            <p className="text-xs text-slate-500 italic font-medium">
              "{settings.company_tagline || "Quality Builds Trust. Momentum Drives Growth."}"
            </p>
          </div>
        </div>
      </motion.section>

      {/* SECTION: PORTFOLIO STATISTICS */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="bg-white rounded-[2rem] border border-slate-150 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-xs select-none max-w-7xl mx-auto"
      >
        {[
          { count: projects.filter(p => !p.project_type || p.project_type === 'portfolio' || p.project_type === 'both').length, label: 'Projects Engineered', icon: Layers, color: "text-blue-500 bg-blue-50/50" },
          { count: uniqueBlogCatsCount, label: 'Tech Domains Audit', icon: TrendingUp, color: "text-emerald-500 bg-emerald-50/50" },
          { count: certificatesCount, label: 'Certifications Logged', icon: BookOpen, color: "text-indigo-500 bg-indigo-50/50" },
          { count: settings.overview_fourth_stat?.value || 'Top 9%', label: settings.overview_fourth_stat?.label || 'TryHackMe Context Rank', icon: Cpu, color: "text-amber-500 bg-amber-50/50" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx} 
              whileHover={{ y: -4 }}
              className="space-y-2 p-3 rounded-2xl hover:bg-slate-50/50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-1`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight font-sans">{stat.count}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{stat.label}</div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* SECTION: DETAILED TECHNICAL SKILLS LISTS */}
      <TechnicalSkillsMatrix
        skills={settings.skills}
        skillSearch={skillSearch}
        selectedSkillCat={selectedSkillCat}
        onSelectSkillCat={onSelectSkillCat}
        getCategoryDetails={getCategoryDetails}
      />

      {/* SECTION: FEATURED CASE STUDIES & PROJECTS */}
      <FeaturedProjects
        projects={projects}
        onViewAll={() => {
          onNavigate('projects');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* SECTION: ACADEMIC TIMELINE AND MILIEU */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Academic Timeline */}
        <div className="space-y-6 text-left">
          <h4 className="text-xs font-extrabold text-[#0084ff] uppercase tracking-widest border-l-2 border-[#0084ff] pl-2 flex items-center gap-1.5 font-mono">
            <GraduationCap className="w-4 h-4 text-[#0084ff]" /> ACADEMIC TIMELINE
          </h4>
          <div className="relative pl-6 border-l border-slate-200 space-y-6 py-2">
            {settings.education.map((edu, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0084ff] border-2 border-white shadow-xs" />
                <h5 className="font-extrabold text-slate-800 text-xs sm:text-sm">
                  {edu.degree} — {edu.field}
                </h5>
                <p className="text-xs text-slate-500">{edu.institution}</p>
                {edu.grade && (
                  <span className="text-[10px] font-mono font-bold bg-blue-50 text-[#0084ff] border border-blue-100 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                    Value: {edu.grade}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Professional Timeline */}
        <div className="space-y-6 text-left">
          <h4 className="text-xs font-extrabold text-[#0084ff] uppercase tracking-widest border-l-2 border-[#0084ff] pl-2 flex items-center gap-1.5 font-mono">
            <Briefcase className="w-4 h-4 text-[#0084ff]" /> WORK EXPERIENCE TIMELINE
          </h4>
          <div className="relative pl-6 border-l border-slate-200 space-y-6 py-2">
            {settings.experience.slice(0, 3).map((exp, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white shadow-xs" />
                <h5 className="font-extrabold text-slate-800 text-xs sm:text-sm">
                  {exp.role}
                </h5>
                <div className="text-[11px] text-[#0084ff] font-semibold mt-0.5">
                  {exp.company} <span className="text-slate-400">• {exp.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: EXTRACTED CHANNELS CTA BAR */}
      <section className="bg-slate-900 rounded-3xl p-8 text-center text-white space-y-4 shadow-xl">
        <Sparkles className="w-8 h-8 text-[#0084ff] mx-auto animate-pulse" />
        <h4 className="text-xl md:text-2xl font-black tracking-tight leading-tight uppercase font-sans">Interested in Collaboration?</h4>
        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          Forward an enquiry, invite me to technical channels, or check live credentials inside the CRM console.
        </p>
        <button
          onClick={() => {
            onNavigate('contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-2.5 bg-[#0084ff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:scale-102 cursor-pointer transition-all inline-block select-none"
        >
          Send Proposal
        </button>
      </section>
    </motion.div>
  );
}
