import React, { useState, useEffect } from 'react';
import {
  Sparkles, FileText, Download, Mail, ArrowUpRight, Github, Linkedin, Twitter,
  Instagram, MapPin, Briefcase, GraduationCap, Compass, BookOpen, AlertCircle, Quote,
  Terminal, CheckCircle, TrendingUp, Cpu, Layers, Activity, ShieldCheck,
  Code, Globe, Database, Search, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import ResumeCenter from './components/ResumeCenter';
import ProjectGallery from './components/ProjectGallery';
import CertificateGrid from './components/CertificateGrid';
import BlogPost from './components/BlogPost';
import ContactForm from './components/ContactForm';
import AdminConsole from './components/AdminConsole';
import QMLogo from './components/QMLogo';
import CoreWebVitalsLab from './components/CoreWebVitalsLab';
const rajatAvatar = './src/assets/images/rajat_avatar_1781089080303.png';

import {
  DEFAULT_SETTINGS,
  DEFAULT_PROJECTS,
  DEFAULT_CERTIFICATES,
  DEFAULT_BLOGS,
  DEFAULT_CONTACTS
} from './data';
import { SiteSettings, Project, Blog, Certificate, Contact } from './types';

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

const getCategoryDetails = (category: string) => {
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

export default function App() {
  // --- LOCAL PERSISTENT STORAGE SYNC ENGINE ---
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_projects');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });

  const [blogs, setBlogs] = useState<Blog[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_blogs');
    return saved ? JSON.parse(saved) : DEFAULT_BLOGS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_certificates');
    return saved ? JSON.parse(saved) : DEFAULT_CERTIFICATES;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_contacts');
    return saved ? JSON.parse(saved) : DEFAULT_CONTACTS;
  });

  // Client Reactions State Tracking (Bookmarked and Liked Blogs)
  const [likedBlogs, setLikedBlogs] = useState<string[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_liked_blogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<string[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_bookmarked_blogs');
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation State
  const [currentView, setCurrentView] = useState('home'); // home, projects, blog, certificates, contact, admin
  const [homeMode, setHomeMode] = useState<'company' | 'portfolio'>(() => {
    const saved = localStorage.getItem('qmlabs_home_mode');
    return (saved === 'company' || saved === 'portfolio') ? saved : 'company';
  });
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Sync to Storage on modifications
  useEffect(() => {
    localStorage.setItem('qmlabs_home_mode', homeMode);
  }, [homeMode]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_blogs', JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_liked_blogs', JSON.stringify(likedBlogs));
  }, [likedBlogs]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_bookmarked_blogs', JSON.stringify(bookmarkedBlogs));
  }, [bookmarkedBlogs]);

  // Handle Contact Formulation Submit
  const handleAddNewContact = (newContact: Omit<Contact, 'id' | 'created_at'>) => {
    const logged: Contact = {
      ...newContact,
      id: `cont_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setContacts([logged, ...contacts]);
  };

  // Liking Toggle
  const handleLikeToggle = (id: string) => {
    if (likedBlogs.includes(id)) {
      setLikedBlogs(likedBlogs.filter(bId => bId !== id));
      setBlogs(blogs.map(b => b.id === id ? { ...b, like_count: Math.max(0, b.like_count - 1) } : b));
    } else {
      setLikedBlogs([...likedBlogs, id]);
      setBlogs(blogs.map(b => b.id === id ? { ...b, like_count: b.like_count + 1 } : b));
    }
  };

  // Bookmarking Toggle
  const handleBookmarkToggle = (id: string) => {
    if (bookmarkedBlogs.includes(id)) {
      setBookmarkedBlogs(bookmarkedBlogs.filter(bId => bId !== id));
    } else {
      setBookmarkedBlogs([...bookmarkedBlogs, id]);
    }
  };

  // Trigger telemetry views on reading a blog post
  const handleReadBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setCurrentView('blog_post');
    // Increment telemetry count
    setBlogs(blogs.map(b => b.id === blog.id ? { ...b, view_count: b.view_count + 1 } : b));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Filtering blogs
  const [blogCatFilter, setBlogCatFilter] = useState<string | null>(null);
  const [blogSearch, setBlogSearch] = useState('');

  // Filtering skills
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedSkillCat, setSelectedSkillCat] = useState<string | null>(null);

  const uniqueBlogCats = Array.from(new Set(blogs.flatMap(b => b.categories || [])));
  const filteredBlogs = blogs.filter(b => {
    const matchesCat = blogCatFilter ? b.categories?.includes(blogCatFilter) : true;
    const matchesSearch = b.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
                          b.excerpt?.toLowerCase().includes(blogSearch.toLowerCase());
    return matchesCat && matchesSearch && b.status === "published";
  });

  return (
    <div className="min-h-screen bg-slate-50/40 text-slate-800 font-sans flex flex-col pt-24 tech-grid-pattern selection:bg-[#0084ff]/10">
      
      {/* GLOBAL SCROLLING HEADER NAVIGATION */}
      <Header
        currentView={currentView.startsWith('blog') ? 'blog' : currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          setSelectedBlog(null);
        }}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          
          {/* VIEW: HOME PAGE DEVELOPMENT */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-16 pb-16"
            >
              
              {/* BRAND DIRECTORY SEGMENT CONTROLLER */}
              <div className="flex justify-center select-none pt-2 pb-1 no-print">
                <div className="inline-flex items-center gap-1.5 bg-slate-100/80 backdrop-blur-md border border-slate-200/50 p-1.5 rounded-2xl shadow-inner">
                  <button
                    onClick={() => setHomeMode('company')}
                    className={`relative px-6 py-3 text-xs font-extrabold rounded-xl uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all duration-300 ${
                      homeMode === 'company'
                        ? 'text-white bg-gradient-to-r from-blue-600 via-[#0084ff] to-blue-500 shadow-md shadow-blue-500/20 scale-102 font-black'
                        : 'text-slate-500 hover:text-slate-850 hover:bg-white/40'
                    }`}
                  >
                    🏢 Corporate (QM Labs)
                  </button>
                  <button
                    onClick={() => setHomeMode('portfolio')}
                    className={`relative px-6 py-3 text-xs font-extrabold rounded-xl uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all duration-300 ${
                      homeMode === 'portfolio'
                        ? 'text-white bg-gradient-to-r from-[#0084ff] to-cyan-500 shadow-md shadow-blue-500/20 scale-102 font-black'
                        : 'text-slate-500 hover:text-slate-850 hover:bg-white/40'
                    }`}
                  >
                    👨‍💻 Portfolio (Rajat Dash)
                  </button>
                </div>
              </div>
                  {/* === DUAL STATE HERO & STATISTICS CONTROLLERS === */}
              {homeMode === 'company' ? (
                <>
                  {/* SECTION: COMPANY HERO */}
                  <motion.section 
                    initial="hidden"
                    animate="visible"
                    variants={heroContainerVariants}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6 relative text-left"
                  >
                    {/* Decorative Background Glowing Blobs */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none -z-10 animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none -z-10" />

                    {/* Left Column: Brand Statement */}
                    <div className="lg:col-span-7 space-y-8 text-left">
                      <motion.div 
                        variants={heroItemVariants}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/60 border border-blue-500/15 text-[#0084ff] rounded-full text-xs font-bold shadow-xs select-none"
                      >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="tracking-widest text-[10px] font-mono uppercase">🏢 DIGITAL CONSULTING & ENG LAB</span>
                      </motion.div>

                      <div className="space-y-4">
                        <motion.div variants={heroItemVariants}>
                          <span className="text-xs font-black uppercase tracking-[0.3em] font-mono text-slate-400 block mb-1">
                            {settings.company_name || "QM Labs"}
                          </span>
                        </motion.div>
                        
                        <motion.h1 
                          variants={heroItemVariants}
                          className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-[1.08] font-sans"
                        >
                          Engineering <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-[#0084ff] to-cyan-500 animate-gradient-xy font-extrabold pb-1">Next-Gen Uptime</span> & Crawl Strategy.
                        </motion.h1>

                        <motion.p
                          variants={heroItemVariants}
                          className="text-lg font-extrabold text-slate-800 leading-snug tracking-tight font-sans italic border-l-2 border-blue-500/30 pl-4 py-1"
                        >
                          "{settings.company_tagline || "Quality Builds Trust. Momentum Drives Growth."}"
                        </motion.p>
                      </div>

                      <motion.p 
                        variants={heroItemVariants}
                        className="text-sm md:text-base text-slate-500 leading-relaxed max-w-2xl font-normal"
                      >
                        {settings.company_bio || "A premium software consulting and engineering lab specializing in secure web architecture, automated test infrastructures, and technical search engine optimization."}
                      </motion.p>

                      <motion.div 
                        variants={heroItemVariants}
                        className="flex flex-wrap items-center gap-4 pt-2"
                      >
                        <button
                          onClick={() => {
                            setCurrentView('projects');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="group px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                        >
                          Examine Case Studies
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentView('contact');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-slate-50/55 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                        >
                          Consultation Brief
                          <Mail className="w-4 h-4 text-slate-400" />
                        </button>
                      </motion.div>
                    </div>

                    {/* Right Column: Rotating Interactive Emblem SVG */}
                    <motion.div 
                      variants={heroItemVariants}
                      className="lg:col-span-5 flex items-center justify-center relative p-8 select-none"
                    >
                      <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-blue-500/10 animate-[spin_50s_linear_infinite]" />
                      <div className="absolute w-72 h-72 rounded-full bg-blue-500/5 blur-3xl" />
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="relative bg-white/80 p-6 rounded-[2.5rem] border border-blue-500/10 shadow-xl min-h-[300px] w-full flex items-center justify-center z-10 cursor-pointer overflow-visible hover:border-blue-500/30 transition-all duration-300"
                      >
                        <QMLogo size="sm" showTagline={true} interactive={true} />
                      </motion.div>
                    </motion.div>
                  </motion.section>

                  {/* SECTION: COMPANY STATISTICS */}
                  <motion.section 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="bg-white rounded-[2rem] border border-slate-150 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-xs select-none max-w-7xl mx-auto"
                  >
                    {[
                      { count: projects.filter(p => p.project_type === 'company' || p.project_type === 'both').length, label: 'Active Deployments', icon: Layers, color: "text-blue-500 bg-blue-50/50" },
                      { count: '99%', label: 'Crawl Pass Average', icon: TrendingUp, color: "text-emerald-500 bg-emerald-50/50" },
                      { count: '100%', label: 'Test Suite Coverage', icon: CheckCircle, color: "text-indigo-500 bg-indigo-50/50" },
                      { count: '14ms', label: 'API Uptime latency', icon: Cpu, color: "text-amber-500 bg-amber-50/50" }
                    ].map((stat, idx) => {
                      const Icon = stat.icon;
                      return (
                        <div key={idx} className="space-y-2 p-3 rounded-2xl hover:bg-slate-50/40 transition-colors">
                          <div className={`w-8 h-8 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-1`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="text-3xl font-black text-slate-900 tracking-tight font-sans">{stat.count}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{stat.label}</div>
                        </div>
                      );
                    })}
                  </motion.section>
                </>
              ) : (
                <>
                  {/* SECTION: PORTFOLIO HERO */}
                  <motion.section 
                    initial="hidden"
                    animate="visible"
                    variants={heroContainerVariants}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6 relative text-left"
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
                          <span className="text-xs font-black uppercase tracking-[0.3em] font-mono text-slate-450 block mb-1">WELCOME TO THE PORTFOLIO LAB</span>
                        </motion.div>
                        
                        <motion.h1 
                          variants={heroItemVariants}
                          className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-[1.08] font-sans"
                        >
                          Hi, I'm <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-[#0084ff] to-cyan-500 animate-gradient-xy font-extrabold">{settings.hero_name}</span>
                        </motion.h1>
                        
                        <motion.div 
                          variants={heroItemVariants}
                          className="flex flex-wrap gap-2 pt-2"
                        >
                          {[
                            { label: "Full-Stack Dev", icon: Cpu, color: "bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100" },
                            { label: "Technical SEO Expert", icon: TrendingUp, color: "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100" },
                            { label: "QA Automation Eng", icon: Activity, color: "bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100" }
                          ].map((pill, pidx) => {
                            const Icon = pill.icon;
                            return (
                              <span 
                                key={pidx} 
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[10px] font-extrabold tracking-wide uppercase select-none transition-all duration-300 hover:scale-[1.03] cursor-help ${pill.color}`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                {pill.label}
                              </span>
                            );
                          })}
                        </motion.div>
                      </div>

                      {/* Portfolio bio text sentence */}
                      <motion.p 
                        variants={heroItemVariants}
                        className="text-sm md:text-base text-slate-500 leading-relaxed max-w-2xl font-normal border-l-2 border-blue-500/30 pl-4 py-1"
                      >
                        {settings.hero_bio}
                      </motion.p>

                      {/* Staggered Quick Actions buttons */}
                      <motion.div 
                        variants={heroItemVariants}
                        className="flex flex-wrap items-center gap-4 pt-2"
                      >
                        <button
                          onClick={() => {
                            setCurrentView('projects');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="group px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                        >
                          Examine Portfolio
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentView('resume');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-slate-50/55 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                        >
                          Export Resume
                          <FileText className="w-4 h-4 text-slate-400" />
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

                      {/* Interactive Depth Card hosting the PNG illustration */}
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
                            className="w-full h-full object-cover select-none pointer-events-none"
                          />
                        </div>

                        {/* DYNAMIC TELEMETRY WIDGET 1: SEO HEALTH TRACKER (Floats top-right) */}
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

                        {/* DYNAMIC TELEMETRY WIDGET 2: CODE STACK FLAG (Floats bottom-left) */}
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

                        {/* DYNAMIC TELEMETRY WIDGET 3: AUTOMATION STATS (Floats bottom-right) */}
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

                  {/* SECTION: PORTFOLIO STATISTICS */}
                  <motion.section 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="bg-white rounded-[2rem] border border-slate-150 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-xs select-none max-w-7xl mx-auto"
                  >
                    {[
                      { count: projects.filter(p => !p.project_type || p.project_type === 'portfolio' || p.project_type === 'both').length, label: 'Projects Engineered', icon: Layers, color: "text-blue-500 bg-blue-50/50" },
                      { count: uniqueBlogCats.length, label: 'Tech Domains Audit', icon: TrendingUp, color: "text-emerald-500 bg-emerald-50/50" },
                      { count: certificates.length, label: 'Certifications Logged', icon: BookOpen, color: "text-indigo-500 bg-indigo-50/50" },
                      { count: 'Top 9%', label: 'TryHackMe Context Rank', icon: Cpu, color: "text-amber-500 bg-amber-50/50" }
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
                </>
              )}

              {homeMode === 'company' ? (
                <>
                  {/* SECTION: COMPANY PROFILE ABOUT */}
                  <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                    <div className="lg:col-span-4 bg-slate-50 border border-slate-150 p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden group select-none hover:border-blue-500/30 transition-colors">
                      <div className="space-y-6">
                        <span className="text-[10px] font-bold text-[#0084ff] uppercase tracking-widest block font-mono">ABOUT THE FIRM</span>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight font-sans">
                          A high-fidelity software engineering laboratory built on automation pipelines.
                        </h4>
                        <div className="w-12 h-1 bg-[#0084ff] rounded-full" />
                      </div>
                      <div className="pt-6">
                        <QMLogo size="xs" showTagline={false} interactive={false} />
                      </div>
                    </div>

                    <div className="lg:col-span-8 text-left flex flex-col justify-center space-y-6">
                      <h4 className="text-xs font-extrabold text-[#0084ff] uppercase tracking-widest border-l-2 border-[#0084ff] pl-2 block font-mono">
                        CORPORATE PROFILE
                      </h4>
                      <div 
                        className="text-sm md:text-base text-slate-600 leading-relaxed font-normal space-y-3 prose max-w-none 
                                   [&_strong]:font-bold [&_strong]:text-slate-800 
                                   [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-2 
                                   [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:text-slate-600
                                   [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:text-slate-600
                                   [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:bg-slate-50 [&_blockquote]:py-1 [&_blockquote]:my-2 [&_blockquote]:rounded-r-md 
                                   [&_pre]:bg-slate-950 [&_pre]:text-slate-200 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-xs [&_pre]:my-2 overflow-x-auto"
                        dangerouslySetInnerHTML={{ __html: settings.company_about_html || "<p>At QM Labs, we design and implement enterprise-grade web applications, dynamic automation frameworks, and sophisticated uptime diagnostics.</p>" }}
                      />
                    </div>
                  </section>

                  {/* SECTION: COMPANY STRATEGIC SERVICES */}
                  <section className="space-y-6 text-left">
                    <h4 className="text-xs font-extrabold text-[#0084ff] uppercase tracking-widest border-l-2 border-[#0084ff] pl-2 font-mono">
                      STRATEGIC CORE SERVICES
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          title: "Automated Software Verification",
                          desc: "Industrial-grade end-to-end automation test suites utilizing Selenium, PyTest, and Cypress designed to secure high-volume production deployments.",
                          icon: ShieldCheck,
                          accent: "from-blue-500 to-indigo-500"
                        },
                        {
                          title: "Secure Web Architectures",
                          desc: "Polished full-stack single page applications, React-tailored portals, and robust server frameworks crafted for safety, performance, and maximum code elegance.",
                          icon: Cpu,
                          accent: "from-[#0084ff] to-cyan-500"
                        },
                        {
                          title: "Enterprise Crawl & SEO Auditing",
                          desc: "Advanced search engine crawl engineering, site optimization diagnostics, technical indexation strategies, and core web vitals optimization.",
                          icon: TrendingUp,
                          accent: "from-emerald-500 to-teal-500"
                        }
                      ].map((service, idx) => {
                        const Icon = service.icon;
                        return (
                          <div
                            key={idx}
                            className="bg-white rounded-3xl border border-slate-150 p-6 flex flex-col justify-between shadow-xs hover:border-blue-500/40 hover:shadow-md transition-all duration-300"
                          >
                            <div className="space-y-4">
                              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-700">
                                <Icon className="w-5 h-5 text-primary" />
                              </div>
                              <h5 className="font-extrabold text-slate-950 text-sm tracking-wide">
                                {service.title}
                              </h5>
                              <p className="text-xs text-slate-500 leading-relaxed">
                                {service.desc}
                              </p>
                            </div>
                            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Tier 1 Strategy</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* SECTION: COMPANY B2B CTA BAR */}
                  <section className="bg-slate-900 rounded-3xl p-8 text-center text-white space-y-4 shadow-xl">
                    <Sparkles className="w-8 h-8 text-[#0084ff] mx-auto animate-pulse" />
                    <h4 className="text-xl md:text-2xl font-black tracking-tight leading-tight uppercase font-sans">Empower Your System Performance</h4>
                    <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                      Consult with our tech specialists regarding custom engineering labs, automated test suits, or technical search campaigns.
                    </p>
                    <button
                      onClick={() => {
                        setCurrentView('contact');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-2.5 bg-[#000d1a] border border-blue-500/40 hover:bg-[#001733] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:scale-102 cursor-pointer transition-all inline-block select-none"
                    >
                      Initialize Partner Proposal
                    </button>
                  </section>
                </>
              ) : (
                <>
                  {/* SECTION: ABOUT PROFILE */}
                  <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                    {/* INTERESTING INTERACTIVE COMPILATION TERMINAL */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="lg:col-span-5 bg-slate-950 font-mono text-[11px] rounded-3xl text-slate-300 p-6 shadow-xl relative border border-slate-800 flex flex-col justify-between overflow-hidden group select-none hover:border-slate-700 transition-colors no-print min-h-[290px]"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                        <Terminal className="w-32 h-32 text-slate-400" />
                      </div>

                      {/* Terminal Header dots */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-rose-500" />
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                          </div>
                          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest font-mono">qmlabs-core v1.42.0</span>
                        </div>

                        {/* Mock interactive active diagnostics */}
                        <div className="space-y-2 text-left leading-relaxed font-mono">
                          <p className="text-slate-500"># Initializing core web verification suite...</p>
                          <p className="flex items-center gap-1.5">
                            <span className="text-blue-400 font-extrabold">$</span> npx qmlabs audit --site rajat.dev
                          </p>
                          <p className="text-indigo-400">⚡ Fetching sitemaps and robots.txt protocols...</p>
                          <p className="text-emerald-400">✔ Core Web Vitals optimized (LCP: 1.2s, CLS: 0.01)</p>
                          <p className="text-emerald-400">✔ PyTest & Selenium automation ready on dev server</p>
                          <p className="text-emerald-400">✔ Cybersecurity verification: Wireshark audit clear</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between font-mono">
                        <span className="text-emerald-500 font-bold flex items-center gap-1 animate-pulse">
                          ● STACK_ONLINE
                        </span>
                        <span className="text-[10px] text-slate-500">ping: 14ms</span>
                      </div>
                    </motion.div>

                    <div className="lg:col-span-7 text-left flex flex-col justify-center space-y-6">
                      <h4 className="text-xs font-extrabold text-[#0084ff] uppercase tracking-widest border-l-2 border-[#0084ff] pl-2 block font-mono">
                        BIOGRAPHY OUTLINE
                      </h4>
                      <div 
                        className="text-sm md:text-base text-slate-600 leading-relaxed font-normal space-y-3 prose max-w-none 
                                   [&_strong]:font-bold [&_strong]:text-slate-800 
                                   [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-2 
                                   [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:text-slate-600
                                   [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:text-slate-650
                                   [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:bg-slate-50 [&_blockquote]:py-1 [&_blockquote]:my-2 [&_blockquote]:rounded-r-md 
                                   [&_pre]:bg-slate-950 [&_pre]:text-slate-200 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-xs [&_pre]:my-2 overflow-x-auto"
                        dangerouslySetInnerHTML={{ __html: settings.about_text }}
                      />
                    </div>
                  </section>



                  {/* SECTION: DETAILED TECHNICAL SKILLS LISTS */}
                  <section className="space-y-6 text-left">
                    {/* Header bar of the Skills Grid */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-[#0084ff] uppercase tracking-widest border-l-2 border-[#0084ff] pl-2 font-mono">
                          SKILLS MATRIX
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Dynamically search and filter my specialized core technical proficiencies.
                        </p>
                      </div>

                      {/* Search Bar */}
                      <div className="relative max-w-xs w-full">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-3.5 w-3.5 text-slate-400" />
                        </span>
                        <input
                          type="text"
                          value={skillSearch}
                          onChange={(e) => setSkillSearch(e.target.value)}
                          placeholder="Search skills (e.g. React, Python)..."
                          className="w-full pl-8 pr-8 py-2 text-xs bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]/20 rounded-xl transition-all font-medium text-slate-800 placeholder-slate-400 outline-hidden"
                        />
                        {skillSearch && (
                          <button
                            onClick={() => setSkillSearch('')}
                            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-1.5 py-1">
                      <button
                        onClick={() => setSelectedSkillCat(null)}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                          selectedSkillCat === null
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        All Tracks ({settings.skills.length})
                      </button>
                      {settings.skills.map((cat, sIdx) => {
                        const style = getCategoryDetails(cat.category);
                        const isSelected = selectedSkillCat === cat.category;
                        return (
                          <button
                            key={sIdx}
                            onClick={() => setSelectedSkillCat(isSelected ? null : cat.category)}
                            className={`px-3 py-1.5 rounded-xl text-[9px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            <style.icon className="w-3 h-3" />
                            {cat.category}
                          </button>
                        );
                      })}
                    </div>

                    {/* Grid of categories (Bento Card Grid layout) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      {settings.skills
                        .filter(cat => selectedSkillCat ? cat.category === selectedSkillCat : true)
                        .map((cat, idx) => {
                          const details = getCategoryDetails(cat.category);
                          const IconComponent = details.icon;
                          const isFullWidth = cat.category.toLowerCase().includes("cybersecurity") || cat.category.toLowerCase().includes("infrastructure");
                          const cardSpanClass = isFullWidth && !selectedSkillCat ? "md:col-span-2" : "col-span-1";
                          
                          return (
                            <motion.div
                              layout
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                              key={cat.category}
                              className={`p-4 rounded-[12px] ${details.bgColor} transition-all duration-300 flex flex-col justify-between border-none shadow-none ${cardSpanClass}`}
                            >
                              <div>
                                {/* Header with Custom Icon Accent */}
                                <div className="flex items-center gap-2 mb-4">
                                  <IconComponent className="w-[22px] h-[22px]" style={{ color: details.accentColor }} aria-hidden="true" />
                                  <h5 className="text-[13px] font-medium" style={{ color: details.accentColor }}>
                                    {cat.category}
                                  </h5>
                                </div>
                                
                                {/* Skills list inside */}
                                <div className={isFullWidth && !selectedSkillCat ? "grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3" : "flex flex-col gap-3"}>
                                  {cat.items.map((skill, sIdx) => {
                                    const skillName = typeof skill === 'string' ? skill : skill.name;
                                    const skillProficiency = typeof skill === 'string' ? 80 : (skill.proficiency || 80);
                                    
                                    // Treat proficiency as a percentage (support both 1-5 and 1-100 scales)
                                    const percentage = skillProficiency <= 5 ? skillProficiency * 20 : skillProficiency;
                                    
                                    const isMatch = skillName.toLowerCase().includes(skillSearch.toLowerCase());
                                    const isDimmed = skillSearch.trim() !== '' && !isMatch;

                                    return (
                                      <div key={sIdx} className={`flex flex-col gap-1 transition-all duration-200 ${isDimmed ? 'opacity-20' : 'opacity-100'}`}>
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-slate-755/90 font-sans font-medium">
                                            {skillName}
                                          </span>
                                          <span className="text-[11px] font-medium" style={{ color: details.accentColor }}>
                                            {percentage}%
                                          </span>
                                        </div>
                                        
                                        {/* Slim 3px progress bar with background opacity */}
                                        <div className="h-[3px] w-full bg-[rgba(0,0,0,0.08)] rounded-[2px] overflow-hidden relative">
                                          <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className={`h-full ${details.barColor} rounded-[2px]`}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                    </div>
                  </section>

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
                            {/* Dot indicator */}
                            <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0084ff] border-2 border-white shadow-xs" />
                            <span className="text-[10px] font-mono text-slate-400 font-bold block mb-1">
                              {edu.start_year} – {edu.end_year || 'Ongoing'}
                            </span>
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

                    {/* ProfessionalTimeline */}
                    <div className="space-y-6 text-left">
                      <h4 className="text-xs font-extrabold text-[#0084ff] uppercase tracking-widest border-l-2 border-[#0084ff] pl-2 flex items-center gap-1.5 font-mono">
                        <Briefcase className="w-4 h-4 text-[#0084ff]" /> WORK EXPERIENCE TIMELINE
                      </h4>
                      <div className="relative pl-6 border-l border-slate-200 space-y-6 py-2">
                        {settings.experience.slice(0, 3).map((exp, idx) => (
                          <div key={idx} className="relative">
                            {/* Dot indicator */}
                            <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white shadow-xs" />
                            <span className="text-[10px] font-mono text-slate-400 font-bold block mb-1 font-mono">
                              {exp.start_date} – {exp.end_date || 'Present'}
                            </span>
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
                        setCurrentView('contact');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-2.5 bg-[#0084ff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:scale-102 cursor-pointer transition-all inline-block select-none"
                    >
                      Send Proposal
                    </button>
                  </section>
                </>
              )}
            </motion.div>
          )}

          {/* VIEW: PROJECTS GALLERY */}
          {currentView === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10 py-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">Applied Portfolios</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  A high-end catalog of data classification dashboards, technical SEO audits, network analyzers, and automated test frameworks.
                </p>
              </div>

              <ProjectGallery projects={projects} />
            </motion.div>
          )}

          {/* VIEW: BLOG LISTING */}
          {currentView === 'blog' && (
            <motion.div
              key="blog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10 py-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">Technical Articles</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Detailed guides covering deep diagnostic classifiers, Technical SEO crawling logs, and Selenium webdriver optimizations.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Search sidebar filters */}
                <div className="lg:col-span-1 space-y-5 text-left no-print">
                  {/* Search box */}
                  <div className="space-y-1.5">
                    <label htmlFor="bsearch" className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Search Articles</label>
                    <input
                      id="bsearch"
                      type="text"
                      value={blogSearch}
                      onChange={(e) => setBlogSearch(e.target.value)}
                      placeholder="E.g., Core Web Vitals"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-primary rounded-xl text-xs focus:outline-hidden"
                    />
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Article Categories</h5>
                    <div className="flex flex-wrap lg:flex-col gap-1.5">
                      <button
                        onClick={() => setBlogCatFilter(null)}
                        className={`text-left px-3 py-2 rounded-xl text-xs tracking-wide cursor-pointer flex items-center justify-between font-semibold ${
                          blogCatFilter === null ? 'bg-primary-light text-primary font-bold shadow-xs' : 'text-slate-500 bg-white border border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        All Categories
                        <span className="opacity-40 font-mono">({blogs.filter(b=>b.status==='published').length})</span>
                      </button>
                      {uniqueBlogCats.map(cat => {
                        const count = blogs.filter(b => b.categories?.includes(cat) && b.status === "published").length;
                        return (
                          <button
                            key={cat}
                            onClick={() => setBlogCatFilter(cat)}
                            className={`text-left px-3 py-2 rounded-xl text-xs tracking-wide cursor-pointer flex items-center justify-between font-semibold ${
                              blogCatFilter === cat ? 'bg-primary-light text-primary font-bold shadow-xs' : 'text-slate-500 bg-white border border-slate-100 hover:bg-slate-50'
                            }`}
                          >
                            {cat}
                            <span className="opacity-45 font-mono">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Articles Cards Grid */}
                <div className="lg:col-span-3">
                  {filteredBlogs.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 bg-white border border-slate-100 rounded-3xl">
                      <BookOpen className="w-12 h-12 stroke-[1] mx-auto mb-3 text-slate-300 pointer-events-none" />
                      No matching posts logged.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredBlogs.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => handleReadBlog(b)}
                          className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between cursor-pointer"
                        >
                          <div>
                            {b.cover_image_url && (
                              <div className="aspect-16/10 bg-slate-50 overflow-hidden border-b border-slate-100">
                                <img
                                  src={b.cover_image_url}
                                  alt={b.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                                />
                              </div>
                            )}

                            <div className="p-5 space-y-3 text-left">
                              <span className="text-[9px] font-extrabold uppercase bg-indigo-50 border border-indigo-100/50 text-[#0084ff] px-2 py-0.5 rounded-md">
                                {b.categories?.[0] || 'Web'}
                              </span>
                              <h4 className="text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                {b.title}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                                {b.excerpt}
                              </p>
                            </div>
                          </div>

                          <div className="px-5 pb-5 pt-3 border-t border-slate-50/50 flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>{new Date(b.published_at || b.created_at).toLocaleDateString('en-IN')}</span>
                            <span>{b.read_time_mins} Min Read</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: BLOG INDIVIDUAL POST READING VIEW */}
          {currentView === 'blog_post' && selectedBlog && (
            <BlogPost
              blog={selectedBlog}
              settings={settings}
              onBack={() => {
                setCurrentView('blog');
                setSelectedBlog(null);
              }}
              isLiked={likedBlogs.includes(selectedBlog.id)}
              isBookmarked={bookmarkedBlogs.includes(selectedBlog.id)}
              onLikeToggle={handleLikeToggle}
              onBookmarkToggle={handleBookmarkToggle}
            />
          )}

          {/* VIEW: RESUME CENTER */}
          {currentView === 'resume' && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-10 py-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">Interactive Resume Hub</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Customize and export targeted resumes for different professional personas: Full-Stack Engineering, Technical SEO, QA, and Cybersecurity.
                </p>
              </div>

              <ResumeCenter settings={settings} />
            </motion.div>
          )}

          {/* VIEW: CERTIFICATIONS LISTING */}
          {currentView === 'certificates' && (
            <motion.div
              key="certificates"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10 py-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">Professional Certifications</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  A verification center for data modeling certifications, cybersecurity modules, and corporate software completions.
                </p>
              </div>

              <CertificateGrid certificates={certificates} />
            </motion.div>
          )}

          {/* VIEW: CONTACT CHANNELS */}
          {currentView === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto py-6 space-y-12"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">Get In Touch</h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Arrange a project consultation, transmit career reviews, or read data logs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                
                {/* Left Side: Contact details */}
                <div className="space-y-6 text-left">
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-[#0084ff] uppercase tracking-widest border-l-2 border-[#0084ff] pl-2">
                      Channels & social Coordinates
                    </h4>
                    <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                      Reach out directly on certified email routes, or connect on GitHub or professional networks.
                    </p>
                  </div>

                  {/* Physical cards */}
                  <div className="space-y-3 max-w-sm">
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-3.5 shadow-xs">
                      <div className="p-2 bg-blue-50 text-primary rounded-xl">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Direct Coordinates</span>
                        <a href={`mailto:${settings.contact_email}`} className="text-xs font-semibold text-slate-800 hover:text-primary transition-colors">
                          {settings.contact_email}
                        </a>
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-3.5 shadow-xs">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Target Location</span>
                        <span className="text-xs font-semibold text-slate-800">
                          Delhi NCR / Gunupur, India
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Google Maps Embed Location */}
                  {settings.google_maps_embed_url && (
                    <div className="rounded-3xl border border-slate-100 overflow-hidden shadow-xs aspect-16/10 max-h-60 no-print">
                      <iframe
                        src={settings.google_maps_embed_url}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Rajat Dash Location Coordinates Mapping"
                      />
                    </div>
                  )}
                </div>

                {/* Right Side: Interactive Form */}
                <ContactForm onAddContact={handleAddNewContact} />
              </div>
            </motion.div>
          )}

          {/* VIEW: CORE WEB VITALS LAB */}
          {currentView === 'vitals' && (
            <motion.div
              key="vitals"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-6"
            >
              <CoreWebVitalsLab settings={settings} onAddContact={handleAddNewContact} />
            </motion.div>
          )}

          {/* VIEW: ADMIN PANEL CRM */}
          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-4"
            >
              <AdminConsole
                settings={settings}
                onUpdateSettings={setSettingsSetState}
                projects={projects}
                onUpdateProjects={setProjects}
                blogs={blogs}
                onUpdateBlogs={setBlogs}
                certificates={certificates}
                onUpdateCertificates={setCertificates}
                contacts={contacts}
                onUpdateContacts={setContacts}
                isAdminLoggedIn={isAdminLoggedIn}
                onAdminLoginToggle={setIsAdminLoggedIn}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* GLOBAL FOOTER BRAND */}
      <Footer settings={settings} onViewChange={setCurrentView} />

      {/* SEMANTIC JSON-LD SCHEMA FOR RICH GOOGLE SERP INDEXING */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": settings?.hero_name || '',
          "url": "https://rajatkumar.dev",
          "jobTitle": "Full-Stack Developer & Technical SEO Expert",
          "worksFor": {
            "@type": "Organization",
            "name": settings?.company_name || 'QM Labs',
            "url": "https://qmlabs.tech"
          },
          "image": "https://rajatkumar.dev/assets/logo.png",
          "description": settings?.hero_bio || '',
          "sameAs": [
            settings?.social_links?.linkedin || '',
            settings?.social_links?.github || ''
          ]
        })}
      </script>
    </div>
  );

  // Helper orchestrators to set complex substates properly
  function setSettingsSetState(val: SiteSettings) {
    setSettings(val);
  }
}
