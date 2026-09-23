import { useState, useEffect } from 'react';
import { SiteSettings, Project, Blog, Certificate, FreelanceService, FAQItem, WorkflowStep, TrustGuarantee } from '../types';

const EMPTY_SETTINGS: SiteSettings = {
  hero_name: "",
  hero_tagline: "",
  hero_bio: "",
  profile_image_url: "",
  about_text: "",
  seo_home_title: "",
  seo_home_description: "",
  seo_home_keywords: "",
  seo_og_image_url: "",
  skills: [],
  experience: [],
  education: [],
  social_links: {},
  resume_storage_path: "",
  logo_url: "",
  is_under_maintenance: false,
  google_maps_embed_url: "",
  contact_email: "",
  contact_location: "",
  company_name: "",
  company_tagline: "",
  hero_stats: [],
  overview_fourth_stat: { label: "", value: "" },
  overview_fifth_stat: { label: "", value: "" },
  overview_sixth_stat: { label: "", value: "" }
};

const DEFAULT_SERVICES: FreelanceService[] = [
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

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Who owns the intellectual property (IP) and source code?',
    answer: 'You retain 100% full intellectual property and commercial ownership. Upon project delivery and final milestone sign-off, all Git repositories, infrastructure configs, deployment keys, and documentation are transferred completely to your team with no vendor lock-in or recurring licensing fees.',
    category: 'Legal & Ownership',
    is_active: true,
    sort_order: 1
  },
  {
    id: 'faq-2',
    question: 'How do contract milestones and payments work?',
    answer: 'Engagements are structured into transparent, deliverables-based milestones (typically 30% upfront upon PRD sign-off, 40% mid-sprint MVP demo, and 30% upon production deployment and QA verification). Invoicing is conducted with strict milestone agreements.',
    category: 'Billing & Contracts',
    is_active: true,
    sort_order: 2
  },
  {
    id: 'faq-3',
    question: 'Can you integrate AI / Gemini agents and MCP into our existing codebase?',
    answer: 'Yes. Whether you are building from scratch or extending an existing React, Node.js, Python, or Next.js application, I integrate secure Model Context Protocol (MCP) servers, Google Gemini 2.5/3.0 APIs, and custom RAG pipelines directly with your existing database and authentication systems.',
    category: 'Technical & AI',
    is_active: true,
    sort_order: 3
  },
  {
    id: 'faq-4',
    question: 'Do you sign Non-Disclosure Agreements (NDAs)?',
    answer: 'Absolutely. Client confidentiality and proprietary data security are fundamental. I am happy to sign your standard company NDA or provide a mutual NDA prior to our initial technical discovery call.',
    category: 'Legal & Ownership',
    is_active: true,
    sort_order: 4
  },
  {
    id: 'faq-5',
    question: 'What is included in the 30-day post-launch warranty?',
    answer: 'Every engineering package includes 30 days of comprehensive post-launch warranty support. If any bug, edge-case defect, or configuration discrepancy arises within the agreed scope, it is diagnosed and resolved promptly at zero additional cost.',
    category: 'Delivery & Warranty',
    is_active: true,
    sort_order: 5
  },
  {
    id: 'faq-6',
    question: 'How do you handle collaboration and international timezones?',
    answer: 'I collaborate seamlessly with founders and engineering teams across US (PST/EST), Europe (GMT/CET), and APAC timezones using structured asynchronous updates via Slack/Discord, clear Linear/Jira sprint boards, and scheduled weekly video syncs.',
    category: 'Workflow & Communication',
    is_active: true,
    sort_order: 6
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
    deliverables: ['Detailed Technical PRD', 'Database & API Architecture', 'Component & Wireframe Specs'],
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

export function usePortfolioData() {
  // --- LOCAL PERSISTENT STORAGE SYNC ENGINE ---
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...EMPTY_SETTINGS, ...parsed };
      } catch (e) {
        return EMPTY_SETTINGS;
      }
    }
    return EMPTY_SETTINGS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [blogs, setBlogs] = useState<Blog[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_blogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_certificates');
    return saved ? JSON.parse(saved) : [];
  });

  const [services, setServices] = useState<FreelanceService[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_services');
    const parsed: FreelanceService[] = saved ? JSON.parse(saved) : DEFAULT_SERVICES;
    return parsed.map(s => {
      let price = s.starting_price || '';
      if (price.includes('$2,500')) price = '₹15,000';
      else if (price.includes('$3,000')) price = '₹18,000';
      else if (price.includes('$1,500')) price = '₹8,000';
      else if (price.includes('$150/hr')) price = '₹1,500/hr';
      else if (price.includes('$1,800')) price = '₹10,000';
      else if (price.includes('$1,200')) price = '₹5,000';
      else if (price.includes('$')) price = price.replace(/\$/g, '₹');
      return { ...s, starting_price: price };
    });
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_faqs');
    return saved ? JSON.parse(saved) : DEFAULT_FAQS;
  });

  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_workflow_steps');
    return saved ? JSON.parse(saved) : DEFAULT_WORKFLOW_STEPS;
  });

  const [trustGuarantees, setTrustGuarantees] = useState<TrustGuarantee[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_trust_guarantees');
    return saved ? JSON.parse(saved) : DEFAULT_TRUST_GUARANTEES;
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

  // Navigation & Active Item State
  const [currentView, setCurrentView] = useState('home'); // home, projects, blog, certificates, contact, resume, admin
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Filters
  const [blogCatFilter, setBlogCatFilter] = useState<string | null>(null);
  const [blogSearch, setBlogSearch] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedSkillCat, setSelectedSkillCat] = useState<string | null>(null);

  // Sync to local storage
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
    localStorage.setItem('qmlabs_portfolio_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_faqs', JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_workflow_steps', JSON.stringify(workflowSteps));
  }, [workflowSteps]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_trust_guarantees', JSON.stringify(trustGuarantees));
  }, [trustGuarantees]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_liked_blogs', JSON.stringify(likedBlogs));
  }, [likedBlogs]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_bookmarked_blogs', JSON.stringify(bookmarkedBlogs));
  }, [bookmarkedBlogs]);

  // Load live content from the server on mount (if KV store configured)
  useEffect(() => {
    let isMounted = true;
    let retries = 0;
    const maxRetries = 3;

    const loadContent = () => {
      fetch('/api/content')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (!isMounted) return;
          if (!data.success || !data.storeConfigured) return;
          setSettings({ ...EMPTY_SETTINGS, ...data.settings });
          setProjects(data.projects || []);
          setBlogs(data.blogs || []);
          setCertificates(data.certificates || []);
          if (data.services && data.services.length > 0) {
            const mappedServices: FreelanceService[] = data.services.map((s: FreelanceService) => {
              let price = s.starting_price || '';
              if (price.includes('$2,500')) price = '₹15,000';
              else if (price.includes('$3,000')) price = '₹18,000';
              else if (price.includes('$1,500')) price = '₹8,000';
              else if (price.includes('$150/hr')) price = '₹1,500/hr';
              else if (price.includes('$1,800')) price = '₹10,000';
              else if (price.includes('$1,200')) price = '₹5,000';
              else if (price.includes('$')) price = price.replace(/\$/g, '₹');
              return { ...s, starting_price: price };
            });
            setServices(mappedServices);
          }
          if (data.faqs && data.faqs.length > 0) setFaqs(data.faqs);
          if (data.workflowSteps && data.workflowSteps.length > 0) setWorkflowSteps(data.workflowSteps);
          if (data.trustGuarantees && data.trustGuarantees.length > 0) setTrustGuarantees(data.trustGuarantees);
        })
        .catch(err => {
          if (!isMounted) return;
          if (retries < maxRetries) {
            retries++;
            setTimeout(loadContent, 1200 * retries);
          } else {
            console.warn('Live content server not reachable, using cached copy:', err?.message || err);
          }
        });
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  // Restore admin login state from the server session cookie after a page refresh.
  useEffect(() => {
    fetch('/api/admin/session', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setIsAdminLoggedIn(!!data.loggedIn))
      .catch(() => {});
  }, []);

  // Persist admin edits to server (plus optimistic local update)
  const persistUpdate = <T,>(setter: (v: T) => void, endpoint: string) => (value: T) => {
    setter(value);
    fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(value)
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Save failed (${res.status})`);
        }
      })
      .catch(err => {
        console.error(`Failed to save to ${endpoint}:`, err);
        window.alert(`Your change didn't save to the server: ${err.message}\n\nIt's only kept locally in this browser until you retry.`);
      });
  };

  const handleUpdateSettings = persistUpdate<SiteSettings>(setSettings, '/api/admin/settings');
  const handleUpdateProjects = persistUpdate<Project[]>(setProjects, '/api/admin/projects');
  const handleUpdateBlogs = persistUpdate<Blog[]>(setBlogs, '/api/admin/blogs');
  const handleUpdateCertificates = persistUpdate<Certificate[]>(setCertificates, '/api/admin/certificates');
  const handleUpdateServices = persistUpdate<FreelanceService[]>(setServices, '/api/admin/services');
  const handleUpdateFaqs = persistUpdate<FAQItem[]>(setFaqs, '/api/admin/faqs');
  const handleUpdateWorkflowSteps = persistUpdate<WorkflowStep[]>(setWorkflowSteps, '/api/admin/workflow-steps');
  const handleUpdateTrustGuarantees = persistUpdate<TrustGuarantee[]>(setTrustGuarantees, '/api/admin/trust-guarantees');

  // Route Telemetry Tracking: record real page views
  useEffect(() => {
    const routePath = currentView === 'home' ? '/' : `/${currentView}`;
    fetch('/api/telemetry/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: routePath, referrer: document.referrer || '' })
    }).catch(() => {});
  }, [currentView]);

  // Liking Toggle with Real Server Sync
  const handleLikeToggle = (id: string) => {
    const isCurrentlyLiked = likedBlogs.includes(id);
    const newLikedList = isCurrentlyLiked
      ? likedBlogs.filter(bId => bId !== id)
      : [...likedBlogs, id];
    
    setLikedBlogs(newLikedList);
    setBlogs(blogs.map(b => b.id === id ? { ...b, like_count: Math.max(0, (b.like_count || 0) + (isCurrentlyLiked ? -1 : 1)) } : b));

    fetch(`/api/blogs/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ increment: !isCurrentlyLiked })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && typeof data.like_count === 'number') {
          setBlogs(prev => prev.map(b => b.id === id ? { ...b, like_count: data.like_count } : b));
        }
      })
      .catch(() => {});
  };

  // Bookmarking Toggle
  const handleBookmarkToggle = (id: string) => {
    if (bookmarkedBlogs.includes(id)) {
      setBookmarkedBlogs(bookmarkedBlogs.filter(bId => bId !== id));
    } else {
      setBookmarkedBlogs([...bookmarkedBlogs, id]);
    }
  };

  // Trigger telemetry views on reading a blog post with real server recording
  const handleReadBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setCurrentView('blog_post');
    const newViewCount = (blog.view_count || 0) + 1;
    setBlogs(blogs.map(b => b.id === blog.id ? { ...b, view_count: newViewCount } : b));
    window.scrollTo({ top: 0, behavior: 'instant' });

    fetch(`/api/blogs/${blog.id}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && typeof data.view_count === 'number') {
          setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, view_count: data.view_count } : b));
        }
      })
      .catch(() => {});

    fetch('/api/telemetry/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: `/blog/${blog.slug || blog.id}` })
    }).catch(() => {});
  };

  const uniqueBlogCats = Array.from(new Set(blogs.flatMap(b => b.categories || [])));
  const filteredBlogs = blogs.filter(b => {
    const matchesCat = blogCatFilter ? b.categories?.includes(blogCatFilter) : true;
    const matchesSearch = b.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
                          b.excerpt?.toLowerCase().includes(blogSearch.toLowerCase());
    return matchesCat && matchesSearch && b.status === "published";
  });

  return {
    settings,
    setSettings,
    projects,
    setProjects,
    blogs,
    setBlogs,
    certificates,
    setCertificates,
    services,
    setServices,
    faqs,
    setFaqs,
    workflowSteps,
    setWorkflowSteps,
    trustGuarantees,
    setTrustGuarantees,
    likedBlogs,
    bookmarkedBlogs,
    currentView,
    setCurrentView,
    selectedBlog,
    setSelectedBlog,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    blogCatFilter,
    setBlogCatFilter,
    blogSearch,
    setBlogSearch,
    skillSearch,
    setSkillSearch,
    selectedSkillCat,
    setSelectedSkillCat,
    uniqueBlogCats,
    filteredBlogs,
    handleUpdateSettings,
    handleUpdateProjects,
    handleUpdateBlogs,
    handleUpdateCertificates,
    handleUpdateServices,
    handleUpdateFaqs,
    handleUpdateWorkflowSteps,
    handleUpdateTrustGuarantees,
    handleLikeToggle,
    handleBookmarkToggle,
    handleReadBlog
  };
}
