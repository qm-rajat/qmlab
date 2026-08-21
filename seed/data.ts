import { SiteSettings, Project, Blog, Certificate, Contact } from '../src/types';

export const DEFAULT_SETTINGS: SiteSettings = {
  hero_name: "Rajat Kumar Dash",
  hero_tagline: "Full-Stack Developer · Technical SEO Expert · QA Automation Engineer",
  hero_bio: "A technology-driven Computer Science graduate specializing in full-stack web applications, advanced data analytics, Python automation workflows, and high-performance technical SEO architectures.",
  profile_image_url: "", // will fall back to beautiful circular SVG or letter badge if blank
  about_text: "I am a multidisciplinary computer science professional with deep expertise spanning across full-stack development, technical search engine optimization (SEO), data science modeling, automation testing, and cybersecurity. Currently performing as a Digital Marketing Executive specializing in Technical SEO & Web Analytics, I drive organic growth, optimize core web vitals, and coordinate secure technical web deployments. My analytical background enables me to build automated data pipelines, predictive machine learning models, and complex test architectures that ensure software stability and optimal performance.",
  seo_home_title: "Rajat Kumar Dash | Portfolio & CRM Console",
  seo_home_description: "Professional portfolio and content management dashboard for Rajat Kumar Dash — Computer Science graduate, developer, Technical SEO executive and analyst.",
  seo_home_keywords: "Rajat Kumar Dash, full stack developer, technical SEO, data analytics, QA automation, cybersecurity, React, Python, portfolio",
  seo_og_image_url: "",
  skills: [
    {
      category: "Web Development",
      items: [
        { name: "React/Next.js" },
        { name: "Node.js" },
        { name: "TypeScript" },
        { name: "Tailwind CSS" },
        { name: "Express.js" },
        { name: "WordPress CMS" },
        { name: "PHP" },
        { name: "SQL" }
      ]
    },
    {
      category: "Technical SEO & Web Analytics",
      items: [
        { name: "Core Web Vitals" },
        { name: "Schema Markup" },
        { name: "Sitemap & Robots.txt" },
        { name: "Crawl Error Resolution" },
        { name: "Ranking & Indexing" },
        { name: "GA4 / GSC" },
        { name: "Ahrefs / Semrush" },
        { name: "Screaming Frog" }
      ]
    },
    {
      category: "QA Automation & Scripting",
      items: [
        { name: "Selenium WebDriver" },
        { name: "PyTest" },
        { name: "Functional Testing" },
        { name: "API Integration Testing" },
        { name: "Python Debugging" },
        { name: "Web Scraping" },
        { name: "Automated Scraping" }
      ]
    },
    {
      category: "Data Science & BI",
      items: [
        { name: "Python/Pandas/NumPy" },
        { name: "Machine Learning (scikit-learn)" },
        { name: "Feature Engineering" },
        { name: "Data Visualization" },
        { name: "Microsoft Power BI" },
        { name: "Advanced Excel" }
      ]
    },
    {
      category: "Cybersecurity & Infrastructure",
      items: [
        { name: "Vulnerability Assessment" },
        { name: "Network Security Protocols" },
        { name: "Wireshark Packet Analysis" },
        { name: "Nmap Port Scanning" },
        { name: "Burp Suite Proxy" },
        { name: "Metasploit" },
        { name: "Parrot OS / Kali Linux" },
        { name: "DevSecOps / GitHub Lifecycle" },
        { name: "Linux Environments" }
      ]
    }
  ],
  experience: [
    {
      company: "DR Infosoft Pvt. Ltd.",
      role: "Digital Marketing Executive – SEO & Web Analytics",
      start_date: "Sep 2025",
      is_current: true,
      location: "New Delhi, India",
      description: "Drove 8–9% organic website traffic growth across fintech, relocation, and travel niches. Converted audits into direct code fixes on Core Web Vitals (LCP, FID, CLS), metadata, canonical configurations, schema layouts, and site architectures. Built performance reports using GA4 interface and customized Search Studio integrations."
    },
    {
      company: "HMIES Pvt. Ltd.",
      role: "Data Science Intern",
      start_date: "May 2025",
      end_date: "Jul 2025",
      is_current: false,
      location: "Bhubaneswar, India",
      description: "Collaborated on clinical healthcare datasets. Formed end-to-end classification pipelines deploying Random Forest, SVM, Decision Tree, and KNN models to perform predictive health checks for chronic diseases."
    },
    {
      company: "Labmentix",
      role: "Data Analyst Intern",
      start_date: "Apr 2025",
      end_date: "Jul 2025",
      is_current: false,
      location: "Remote, India",
      description: "Cleaned tabular data using Python scripts, extracted key operational indicators, and built reports and interactive presentations supporting decision-making."
    },
    {
      company: "Edunet Foundation (Microsoft Collaboration)",
      role: "AI Intern – Microsoft Azure Virtual",
      start_date: "May 2025",
      end_date: "Jul 2025",
      is_current: false,
      location: "Host-Virtual",
      description: "Configured cognitive service layers, integrated Microsoft Azure Machine Learning Studio workflows, and tested ethical cloud model boundaries."
    },
    {
      company: "Dabotics India",
      role: "Python Developer Intern",
      start_date: "Feb 2024",
      end_date: "Jun 2024",
      is_current: false,
      location: "Noida, India",
      description: "Developed and debugged Python scripts, custom internal CLI automations, and routine cron utility modules to improve workflow speed."
    },
    {
      company: "Unified Mentor & InternPe",
      role: "Web Development Intern",
      start_date: "Jan 2024",
      end_date: "Jul 2024",
      is_current: false,
      location: "Virtual",
      description: "Assembled reactive UI components, performed manual UI and functionality checks, tested endpoint routing, and resolved responsive rendering bugs."
    }
  ],
  education: [
    {
      institution: "Gandhi Institute of Engineering and Technology (GIET University)",
      degree: "B.Tech",
      field: "Computer Science & Engineering",
      start_year: 2022,
      end_year: 2026,
      grade: "8.4 CGPA (Current)"
    },
    {
      institution: "Padampur Public School",
      degree: "Higher Secondary Examination",
      field: "Science (CBSE)",
      start_year: 2020,
      end_year: 2022,
      grade: "82% Aggregate"
    },
    {
      institution: "Adibasi Nodal High School, Sargibahal",
      degree: "Secondary School Certificate",
      field: "BSE Odisha",
      start_year: 2019,
      end_year: 2020,
      grade: "88% Aggregate"
    }
  ],
  social_links: {
    github: "https://github.com/qm-rajat",
    linkedin: "https://www.linkedin.com/in/rajatdash-",
    twitter: "https://twitter.com/qm_rajat_mock",
    instagram: "https://instagram.com/qm_rajat_mock"
  },
  resume_storage_path: "resume/rajat_resume.pdf",
  logo_url: "",
  google_maps_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112064.93510529683!2d77.12644264663953!3d28.628929969145624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0xd5c854199617651c!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1718018501234!5m2!1sen!2sin",
  contact_email: "rajatkudash.2004@gmail.com",
  contact_location: "New Delhi, India",
  company_name: "QM Labs",
  company_tagline: "Quality Builds Trust. Momentum Drives Growth.",
  company_bio: "A premium software consulting and engineering lab specializing in secure web architecture, automated test infrastructures, and technical search engine optimization.",
  company_about_html: "<h3><strong>QM Labs — Engineering Digital Acceleration</strong></h3><p>We are a high-performance freelance and consulting agency delivering premium digital solutions to modern businesses. We combine full-stack programming, professional search engine optimization, and advanced automated testing into a singular, high-velocity delivery model.</p><ul><li><strong>Precision Engineering:</strong> We write component-driven React, TypeScript, Node.js, and Python systems structured for high uptime.</li><li><strong>Organic Growth Science:</strong> We translate search engine parameters into code, optimizing metadata, schema layouts, indexing pathways, and Core Web Vitals to increase visitor yield.</li><li><strong>Automated Stability:</strong> We formulate extensive regression suites and Page Object Model frameworks to verify that every user experience is flawless.</li></ul><p>We operate transparently, with code verified by modern telemetry, keeping your engineering momentum forward.</p>",

  hero_stats: [
    { label: "Experience", value: "3+ Years", subtext: "Production Eng" },
    { label: "Delivered", value: "15+ Systems", subtext: "Full-Stack & SEO" },
    { label: "Lighthouse", value: "100/100", subtext: "Core Web Vitals" }
  ],
  overview_fourth_stat: {
    label: "TryHackMe Context Rank",
    value: "Top 9%"
  },
  company_services: [
    { title: "Custom Web & Full-Stack Development", description: "Design and implement robust client interfaces paired with secure, light-weight server middleware (React, TypeScript, Express).", icon_name: "Cpu" },
    { title: "Technical SEO & Web Analytics Campaigns", description: "Diagnose crawl issues, configure JSON-LD Schema structures, optimize Core Web Vitals (LCP, FID, CLS), and deploy custom GA4 telemetry.", icon_name: "TrendingUp" },
    { title: "End-to-End QA Automation & Security", description: "Maintain bulletproof production builds with automated PyTest/Selenium suites and system security evaluations.", icon_name: "CheckCircle" },
    { title: "Advanced BI & Data Analysis Pipelines", description: "Formulate explanatory machine learning classifications, clean dense spreadsheets, and build custom metrics dashboards.", icon_name: "Activity" }
  ]
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj_1",
    title: "PentestSEO – Security & Vulnerability Analysis Framework",
    slug: "pentest-seo-framework",
    category: "cybersecurity",
    description: "A custom modular penetration testing and inspection framework built on Parrot OS. Integrates automated web application vulnerability scanning, SQL injection detection, XSS vectors, and SSL/TLS header auditing with end-to-end Technical SEO health diagnostics.",
    images: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800"
    ],
    technologies: ["Python", "Parrot OS", "Nmap", "Wireshark", "Technical SEO", "Security Scripting", "Shell/Bash"],
    github_url: "https://github.com/qm-rajat/PentestSEO",
    live_url: "",
    key_metric: {
      label: "Audit Coverage",
      value: "50+ Vectors"
    },
    architecture_highlights: [
      "Multi-threaded port enumeration and service banner grabber using custom Nmap wrappers.",
      "Automated HTTP security header validator (CSP, HSTS, X-Frame-Options, CORS).",
      "Dynamic XML sitemap crawler and canonical URL inconsistency detector."
    ],
    problem_statement: "Modern websites frequently suffer from hidden security vulnerabilities (unpatched ports, missing headers) alongside search engine crawl traps that drain crawl budget.",
    solution_details: "Engineered an integrated CLI diagnostic tool running on Parrot OS that executes security reconnaissance and technical SEO auditing in a single automated scan cycle.",
    features: [
      "Automated XSS and SQL injection vulnerability testing suite",
      "Full SSL/TLS certificate chain and cipher validation",
      "Crawl budget efficiency calculator and robots.txt syntax parser",
      "Exportable Markdown and JSON penetration test reports"
    ],
    is_featured: true,
    display_order: 1,
    created_at: "2025-01-15T00:00:00Z"
  },
  {
    id: "proj_2",
    title: "Heart Failure Prediction Model (Machine Learning)",
    slug: "heart-failure-prediction-ml",
    category: "machine-learning",
    description: "An analytical machine learning classification engine trained on clinical patient health records. Formulated automated data cleaning pipelines, evaluated statistical correlations, and benchmarked Random Forest, SVM, and Gradient Boosting algorithms.",
    images: [
      "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
    ],
    technologies: ["Python", "Pandas", "Scikit-Learn", "Matplotlib", "Random Forest", "GridSearchCV", "Seaborn"],
    github_url: "https://github.com/qm-rajat/heart-failure-classification",
    live_url: "https://heart-prediction-demo.example.com",
    key_metric: {
      label: "Model Accuracy",
      value: "92.57%"
    },
    architecture_highlights: [
      "Extensive feature engineering across 12 clinical indicators (ejection fraction, serum creatinine, platelets).",
      "GridSearchCV hyperparameter tuning optimizing n_estimators, max_depth, and min_samples_split.",
      "Confusion matrix evaluation and ROC-AUC curve benchmarking (0.94 AUC score)."
    ],
    problem_statement: "Early detection of cardiovascular failure requires reliable risk stratification across multifaceted biometric variables that are difficult to evaluate manually.",
    solution_details: "Built an end-to-end Python Scikit-Learn classification pipeline with robust outlier handling, MinMax scaling, and ensemble modeling that reliably predicts mortality risk.",
    features: [
      "92.57% prediction accuracy with high recall for high-risk cohorts",
      "Feature importance ranking isolating ejection fraction and serum creatinine as primary drivers",
      "Interactive prediction simulation interface with instant patient risk score visualization"
    ],
    is_featured: true,
    display_order: 2,
    created_at: "2024-11-20T00:00:00Z"
  },
  {
    id: "proj_3",
    title: "SauceDemo Automation Testing Framework",
    slug: "sauce-demo-automation-framework",
    category: "automation",
    description: "A robust, object-oriented end-to-end automated test suite developed with Selenium WebDriver and PyTest. Incorporates strict Page Object Model (POM) architecture, data-driven checkout flows, responsive cross-browser assertions, and custom HTML test execution telemetry.",
    images: [
      "https://images.unsplash.com/photo-1516116211223-5c359a36298a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
    ],
    technologies: ["Python", "Selenium WebDriver", "PyTest", "Page Object Model (POM)", "E-commerce Testing", "HTML Reporting"],
    github_url: "https://github.com/qm-rajat/SauceDemo-Automation",
    live_url: "",
    key_metric: {
      label: "POM Test Coverage",
      value: "100%"
    },
    architecture_highlights: [
      "Decoupled Page Object classes separating locator selectors from procedural test logic.",
      "PyTest fixtures providing automated browser instantiation, screenshot on failure, and clean teardowns.",
      "Headless Chrome / Firefox execution capability integrated for CI/CD pipelines."
    ],
    problem_statement: "Manual regression testing across multi-step checkout funnels and dynamic shopping carts is time-intensive and error-prone.",
    solution_details: "Created a maintainable Python testing framework covering login validation, dynamic cart state management, checkout input sanitization, and sorting edge cases.",
    features: [
      "Automated end-to-end checkout loop validation with parameterized negative tests",
      "Automated failure screenshot capture with timestamped logs",
      "Interactive HTML test execution report generation with pass/fail duration metrics"
    ],
    is_featured: true,
    display_order: 3,
    created_at: "2024-08-10T00:00:00Z"
  },
  {
    id: "proj_4",
    title: "Crop Disease Detection (Computer Vision)",
    slug: "crop-disease-cv",
    category: "machine-learning",
    description: "Deep learning convolutional neural network (CNN) model analyzing agricultural leaf images to detect bacterial, viral, or fungal infections in real-time.",
    images: [
      "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=800"
    ],
    technologies: ["Python", "TensorFlow/Keras", "OpenCV", "Deep Learning", "Image Augmentation", "NumPy"],
    github_url: "https://github.com/qm-rajat/crop-disease-detection",
    live_url: "",
    key_metric: {
      label: "Inference Speed",
      value: "<45ms"
    },
    architecture_highlights: [
      "Custom CNN architecture trained on augmented PlantVillage dataset (rotation, zoom, horizontal flip).",
      "OpenCV image pre-processing pipeline standardizing color spaces and noise filtering.",
      "Softmax multi-class classification predicting disease categories and treatment suggestions."
    ],
    problem_statement: "Crop pathogens cause significant crop yield losses when not diagnosed in their early stages by agrarian workers.",
    solution_details: "Implemented a computer vision model that classifies plant pathologies instantly from standard camera captures with high diagnostic precision.",
    features: [
      "Multi-pathogen classification across tomato, potato, and corn crops",
      "Real-time image pre-processing with Gaussian blur and color segmentation",
      "Confidence scoring output with targeted intervention recommendations"
    ],
    is_featured: false,
    display_order: 4,
    created_at: "2024-05-12T00:00:00Z"
  },
  {
    id: "proj_5",
    title: "Interactive Car Sales Analytics & BI Dashboard",
    slug: "car-sales-dashboard",
    category: "data-bi",
    description: "An executive business intelligence dashboard engineered in Power BI representing car sales volumes, brand market shares, regional performance, and price elasticity analytics.",
    images: [
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800"
    ],
    technologies: ["Power BI", "Data Cleaning", "DAX Formulas", "Advanced Excel", "Business Intelligence", "ETL"],
    github_url: "",
    live_url: "https://powerbi-mock-domain.com/car-sales",
    key_metric: {
      label: "Data Points",
      value: "100K+ Records"
    },
    architecture_highlights: [
      "Complex DAX measures calculating Year-over-Year (YoY) revenue growth and margin variances.",
      "Multi-dimensional drill-down hierarchies enabling exploration from national down to dealership tier.",
      "Automated Power Query M ETL routines normalizing disparate transaction logs."
    ],
    problem_statement: "Dealership management lacked unified visibility into customer purchase trends, inventory aging, and regional pricing discrepancies.",
    solution_details: "Architected a high-contrast interactive Power BI dashboard connecting automated ETL pipelines to deliver actionable operational insights.",
    features: [
      "Interactive KPI cards for Gross Margin, Average Unit Price, and Inventory Turnover",
      "Dynamic filtering by vehicle segment, fuel type, transmission, and state",
      "Predictive quarterly revenue forecasting visualizer"
    ],
    is_featured: false,
    display_order: 5,
    created_at: "2024-03-25T00:00:00Z"
  },
  {
    id: "proj_6",
    title: "Real-Time Trader Visualizer (J.P. Morgan Perspective)",
    slug: "jpmorgan-trader-visualizer",
    category: "web-systems",
    description: "High-frequency financial market streaming visualizer built with React, TypeScript, and JPMorgan Perspective library. Renders live ask/bid order books, price correlation graphs, and automated trading alerts with sub-millisecond chart re-renders.",
    images: [
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800"
    ],
    technologies: ["React", "TypeScript", "Perspective", "WebSockets", "Financial Data", "Tailwind CSS"],
    github_url: "https://github.com/qm-rajat/jpmc-task-3",
    live_url: "https://trader-perspective-demo.example.com",
    key_metric: {
      label: "Render Latency",
      value: "<16ms (60 FPS)"
    },
    architecture_highlights: [
      "Integrated WebAssembly-backed Perspective table to stream live price updates without thread contention.",
      "Engineered automated ratio bounds (+/- 5%) triggering historical trigger alerts for currency pairs.",
      "Custom TypeScript interfaces enforcing strict typing across WebSocket payload streams."
    ],
    problem_statement: "Traders require instant visual feedback on arbitrage ratios and upper/lower bounds without UI lag or memory leaks during high-volume market hours.",
    solution_details: "Implemented high-performance TypeScript components integrating JPMorgan Perspective's WebAssembly charting pipeline to stream live market feeds seamlessly.",
    features: [
      "Real-time ratio computation between paired equity tickers",
      "Dynamic upper and lower boundary warning visualizers",
      "Live order book telemetry stream with automatic reconnect logic"
    ],
    is_featured: true,
    display_order: 6,
    created_at: "2024-04-22T00:00:00Z"
  }
];

export const DEFAULT_CERTIFICATES: Certificate[] = [
  {
    id: "cert_1",
    title: "Data Analyst: Professional Certificate in Data Analysis",
    issuer: "Udemy",
    issue_date: "2024-11-20",
    credential_id: "UC-5bfb3e6d-2391-4d32-95f0-6126fac01a1e",
    verify_url: "https://www.udemy.com/certificate/UC-5bfb3e6d-2391-4d32-95f0-6126fac01a1e/",
    image_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600",
    category: "data-science",
    skills: ["Python", "Pandas", "NumPy", "Data Visualization", "SQL"],
    description: "Comprehensive data extraction, statistical aggregation, automated cleaning pipelines, and predictive exploratory data analysis.",
    is_featured: true,
    display_order: 1,
    created_at: "2024-11-20T00:00:00Z"
  },
  {
    id: "cert_2",
    title: "Cybersecurity Fundamentals Professional Certificate",
    issuer: "IBM",
    issue_date: "2025-02-15",
    credential_id: "IBM-SEC-99212A",
    verify_url: "https://credly.com/mock-ibm-cybersecurity",
    image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
    category: "cybersecurity",
    skills: ["Network Security", "Vulnerability Assessment", "Threat Modeling", "SIEM", "Incident Response"],
    description: "Enterprise defensive architecture, reconnaissance vector mitigation, network telemetry monitoring, and OWASP Top 10 auditing.",
    is_featured: true,
    display_order: 2,
    created_at: "2025-02-15T00:00:00Z"
  },
  {
    id: "cert_3",
    title: "Cyber Defense Certified Expert",
    issuer: "CyberYaan",
    issue_date: "2024-10-05",
    credential_id: "CY-DEF-55120",
    verify_url: "https://cyberyaan.org/verify/CY-DEF-55120",
    image_url: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=600",
    category: "cybersecurity",
    skills: ["Offensive Recon", "Nmap", "Wireshark", "Packet Analysis", "Parrot OS"],
    description: "Hands-on penetration testing, port enumeration, SSL/TLS header auditing, and offensive vulnerability exploitation methodologies.",
    is_featured: true,
    display_order: 3,
    created_at: "2024-10-05T00:00:00Z"
  },
  {
    id: "cert_4",
    title: "Active Defensive Cyber Security Specialist",
    issuer: "Cybervidyapeeth Foundation",
    issue_date: "2024-09-18",
    credential_id: "CVF-88126B",
    verify_url: "https://cybervidyapeeth.in/certificate/CVF-88126B",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
    category: "cybersecurity",
    skills: ["Firewall Configuration", "Intrusion Detection", "Linux Hardening", "Access Control"],
    description: "System perimeter defense, endpoint protection, bash script automation for log parsing, and active defense counter-measures.",
    is_featured: false,
    display_order: 4,
    created_at: "2024-09-18T00:00:00Z"
  },
  {
    id: "cert_5",
    title: "Advanced Certificate in Business & Marketing Strategy",
    issuer: "Udemy",
    issue_date: "2024-07-15",
    credential_id: "UC-ab96123e-8c81",
    verify_url: "https://www.udemy.com/certificate/UC-ab96123e-8c81/",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    category: "seo-digital-marketing",
    skills: ["Technical SEO", "Growth Analytics", "Conversion Rate Optimization", "Market Research"],
    description: "Data-driven audience acquisition, search engine crawling strategy, conversion funnel tracking, and digital market positioning.",
    is_featured: true,
    display_order: 5,
    created_at: "2024-07-15T00:00:00Z"
  },
  {
    id: "cert_6",
    title: "Hypothesis Testing Professional Validation",
    issuer: "Udemy",
    issue_date: "2024-06-11",
    credential_id: "UC-4927dcc8",
    verify_url: "https://www.udemy.com/certificate/UC-4927dcc8",
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    category: "data-science",
    skills: ["A/B Testing", "Statistical Inference", "P-Value Analysis", "Scipy", "Python"],
    description: "Formulation and parametric/non-parametric hypothesis testing, ANOVA, two-sample t-tests, and experimental design validation.",
    is_featured: false,
    display_order: 6,
    created_at: "2024-06-11T00:00:00Z"
  },
  {
    id: "cert_7",
    title: "Software Engineering Job Simulation Certificate",
    issuer: "J.P. Morgan & Forage",
    issue_date: "2024-04-20",
    credential_id: "JPMC-FORAGE-99120",
    verify_url: "https://theforage.com/verify/JPMC-FORAGE-99120",
    image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
    category: "web-development",
    skills: ["React", "TypeScript", "Perspective Library", "Live Market Feeds", "Git"],
    description: "Interfacing with real-time financial data feeds, building financial charts using JPMorgan Perspective, and fixing critical bugs in trader visualizers.",
    is_featured: true,
    display_order: 7,
    created_at: "2024-04-20T00:00:00Z"
  },
  {
    id: "cert_8",
    title: "Technical SEO & Web Crawl Optimization Certification",
    issuer: "Google Skillshop / Digital Garage",
    issue_date: "2024-12-08",
    credential_id: "GOOG-SEO-88319",
    verify_url: "https://skillshop.exceedlms.com/verify/GOOG-SEO-88319",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
    category: "seo-digital-marketing",
    skills: ["Schema Markup", "Core Web Vitals", "XML Sitemaps", "Google Search Console", "Robots.txt"],
    description: "Search engine crawling semantics, rendering budget optimization, structured JSON-LD entity graph configuration, and CWV audits.",
    is_featured: true,
    display_order: 8,
    created_at: "2024-12-08T00:00:00Z"
  }
];

export const DEFAULT_BLOGS: Blog[] = [
  {
    id: "blog_1",
    title: "The Ultimate Technical SEO Audit Checklist for Modern Architectures",
    slug: "technical-seo-audit-checklist",
    excerpt: "Discover the critical phases of a technical search engine optimization audit, tackling Core Web Vitals optimization, XML sitemaps, indexing priorities, and schema injection.",
    content_html: `<h3>Introduction to Technical SEO is Key</h3>
<p>Modern website engines are complex. Rendering frameworks like Next.js and client-side systems often struggle with crawler visibility if search bots encounter broken canonical links, recursive infinite crawl paths, or heavy static bundle payloads.</p>
<blockquote>"Technical SEO is the digital foundation. If search bots cannot efficiently crawl, render, parse, and index your asset, your creative keyword rank is practically dead."</blockquote>
<h3>Core Crawl Audit Vectors</h3>
<p>Ensure that you inspect these crucial components of your site architecture during any technical assessment:</p>
<ul>
  <li><strong>Structured Metadata & Schema Mockups:</strong> Help crawl bots fetch rich semantic relationships (JSON-LD configuration).</li>
  <li><strong>Core Web Vitals Optimization:</strong> Strive for pristine Cumulative Layout Shift (CLS), Largest Contentful Paint (LCP), and Interaction to Next Paint (INP) response standards.</li>
  <li><strong>XML Sitemap and Robots.txt Synchronization:</strong> Establish targeted exclusions for heavy administrative systems and prevent duplicate content penalties.</li>
</ul>
<p>Following this streamlined method at DR Infosoft Pvt. Ltd. generated an immediate 8-9% increase in organic reach for relocation, finance, and tourism portals!</p>`,
    cover_image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    status: "published",
    read_time_mins: 5,
    like_count: 32,
    bookmark_count: 12,
    view_count: 247,
    published_at: "2026-03-10T10:00:00Z",
    created_at: "2026-03-10T10:00:00Z",
    tags: ["SEO", "Web Performance", "Google Search Console", "Technical SEO"],
    categories: ["Search Engine Optimization"]
  },
  {
    id: "blog_2",
    title: "Building End-to-End Automation Test Suites with Selenium POM and PyTest",
    slug: "selenium-pom-pytest-automation",
    excerpt: "Learn how to structure highly stable, object-oriented test suites that prevent flaky tests and keep regression checking fast, robust, and maintainable.",
    content_html: `<h3>Why Most Automation Suites Fail</h3>
<p>Flaky UI test selectors are a silent productivity killer. When test frameworks couple selector locators directly inside individual workflow assertions, minor design modifications break the entire framework. This forces QA teams to manually rewrite assertions, undermining automation speed.</p>
<h3>The Page Object Model (POM) Salvation</h3>
<p>Under the Page Object Model architecture, each web page is modeled as a specialized class module. Web elements are mapped as private properties, while actions are structured as clean method operations. Standard regression scripts simply invoke these class components without worrying about locator syntax:</p>
<pre><code># Example POM Page Object in Python
class SauceLoginPage:
    def __init__(self, driver):
        self.driver = driver
        self.username_input = "login-button-user"
        self.password_input = "login-button-pass"
        self.submit_btn = "btn-submit"

    def enter_credentials(self, user, pwd):
        self.driver.find_element_by_id(self.username_input).send_keys(user)
        self.driver.find_element_by_id(self.password_input).send_keys(pwd)

    def click_submit(self):
        self.driver.find_element_by_id(self.submit_btn).click()
</code></pre>
<h3>Leveraging PyTest Fixtures</h3>
<p>Initialize webdriver sessions securely and cleanup memory allocations automatically on completion using scoped PyTest fixtures. This guarantees repeatable parallel executions and isolates individual tests flawlessly.</p>`,
    cover_image_url: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=600",
    status: "published",
    read_time_mins: 7,
    like_count: 18,
    bookmark_count: 9,
    view_count: 145,
    published_at: "2026-02-18T10:00:00Z",
    created_at: "2026-02-18T10:00:00Z",
    tags: ["Selenium", "PyTest", "POM", "QA Automation", "Python"],
    categories: ["Quality Assurance"]
  },
  {
    id: "blog_3",
    title: "Harnessing Scikit-Learn pipelines for Clinical Diagnostic Models",
    slug: "scikit-learn-healthcare-models",
    excerpt: "A deep dive into medical tabular datasets. Walkthrough clean feature engineering, imputations, grid searching, and evaluation using Random Forest classifications.",
    content_html: `<h3>Machine Learning in Medical Prognostics</h3>
<p>Utilizing statistical algorithms to evaluate clinical databases (such as coronary failures, kidney disorders, Parkinson's syndromes) demands exceptional preprocessing reliability. Invalid value imputations or improper scaling introduce severe predictive bias, risking patient assessment accuracy.</p>
<h3>Drafting the Data Transformation Pipeline</h3>
<p>A resilient pipeline encapsulates numerical standardization (StandardScaler), missing data imputation (SimpleImputer), and algorithm parameters, eliminating data leakage during cross-validation loops:</p>
<ul>
  <li><strong>Feature Imputation:</strong> Handle missing inputs using numerical median strategies.</li>
  <li><strong>Standardization:</strong> Scale parameters to maintain uniform deviation.</li>
  <li><strong>Cross-Validation:</strong> Perform nested StratifiedKFold validation to guarantee model reliability.</li>
</ul>
<p>Tuning the hyperparameters of a Random Forest Classifier with GridSearchCV on heart-failure datasets achieved a robust accuracy metric of 92.57%, demonstrating massive value for decision-making applications.</p>`,
    cover_image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
    status: "published",
    read_time_mins: 8,
    like_count: 45,
    bookmark_count: 15,
    view_count: 312,
    published_at: "2026-01-05T09:00:00Z",
    created_at: "2026-01-05T09:00:00Z",
    tags: ["Data Science", "Machine Learning", "Python", "Scikit-Learn"],
    categories: ["Data Science & ML"]
  },
  {
    id: "blog_4",
    title: "Optimizing Core Web Vitals (LCP, INP, CLS) in Next.js & React Applications",
    slug: "optimizing-core-web-vitals-react-nextjs",
    excerpt: "Practical architectural strategies to hit a 100/100 Google Lighthouse score. Learn how to tame font flashes, optimize critical rendering paths, and minimize main-thread execution.",
    content_html: `<h3>The Crucial Shift to Interaction to Next Paint (INP)</h3>
<p>Google officially replaced First Input Delay (FID) with <strong>Interaction to Next Paint (INP)</strong> as a Core Web Vital metric. While FID only measured the delay of the <em>first</em> user interaction, INP evaluates all user interactions across the entire lifecycle of the page.</p>
<blockquote>"A 200ms latency on button clicks or drawer toggles will directly degrade your SEO rank in competitive search categories."</blockquote>
<h3>Practical LCP & CLS Remediations</h3>
<p>Here are the highest-impact fixes applied across production clients:</p>
<ul>
  <li><strong>Eliminating Layout Shifts (CLS):</strong> Always declare explicit <code>aspect-ratio</code> or <code>width/height</code> attributes on media containers, iframes, and dynamic banners.</li>
  <li><strong>Critical Resource Preloading (LCP):</strong> Preload hero image assets with <code>rel="preload"</code> and <code>fetchpriority="high"</code> to bring sub-1.2s Largest Contentful Paint times.</li>
  <li><strong>Font Rendering Strategy:</strong> Utilize <code>font-display: optional</code> or local self-hosted variable font files to eliminate Flash of Unstyled Text (FOUT).</li>
  <li><strong>Main Thread De-janking (INP):</strong> Offload heavy non-UI computations to Web Workers and break down long tasks using <code>scheduler.yield()</code> or <code>requestIdleCallback()</code>.</li>
</ul>
<p>Adopting these strategies consistently yields green 95+ Core Web Vital scores and noticeable gains in organic ranking visibility.</p>`,
    cover_image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
    status: "published",
    read_time_mins: 6,
    like_count: 58,
    bookmark_count: 24,
    view_count: 420,
    published_at: "2026-03-25T11:00:00Z",
    created_at: "2026-03-25T11:00:00Z",
    tags: ["Core Web Vitals", "Next.js", "Performance", "React", "SEO"],
    categories: ["Web Performance", "Search Engine Optimization"]
  },
  {
    id: "blog_5",
    title: "Building a Custom Modular Recon & Penetration Testing Suite with Parrot OS",
    slug: "building-custom-pentest-suite-parrot-os",
    excerpt: "Architecting a lightweight security auditing toolchain combining Nmap port enumeration, SSL/TLS header inspections, and OWASP vulnerability scans.",
    content_html: `<h3>Why Custom Tooling Matters in Cybersecurity</h3>
<p>Commercial vulnerability scanners often produce overwhelming noise and false positives. Crafting custom, modular scripts in Python and Bash on security distributions like Parrot OS or Kali Linux gives engineers precise visibility into network posture and web endpoint exposure.</p>
<h3>Core Script Architecture</h3>
<pre><code># PentestSEO Modular Reconnaissance Snippet
import subprocess
import socket

def check_security_headers(target_domain):
    import urllib.request
    try:
        response = urllib.request.urlopen(f"https://{target_domain}", timeout=5)
        headers = response.info()
        required_headers = [
            'Strict-Transport-Security',
            'Content-Security-Policy',
            'X-Frame-Options',
            'X-Content-Type-Options'
        ]
        audit_results = {}
        for h in required_headers:
            audit_results[h] = h in headers
        return audit_results
    except Exception as e:
        return {"error": str(e)}
</code></pre>
<h3>Integrating with Technical SEO Audits</h3>
<p>By connecting security header scans with canonical and crawl validation, we ensure that client web portals are both protected against clickjacking / MITM attacks and fully accessible to verified search engine spiders.</p>`,
    cover_image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
    status: "published",
    read_time_mins: 7,
    like_count: 39,
    bookmark_count: 17,
    view_count: 285,
    published_at: "2026-02-01T14:00:00Z",
    created_at: "2026-02-01T14:00:00Z",
    tags: ["Cybersecurity", "Python", "Parrot OS", "Linux", "Nmap"],
    categories: ["Cybersecurity", "Quality Assurance"]
  }
];

export const DEFAULT_CONTACTS: Contact[] = [
  {
    id: "cont_1",
    name: "Aarav Sharma",
    email: "aarav.sharma@drinfosoft-client.com",
    message: "Hey Rajat, super impressed with your technical SEO audit results and GA4 telemetry automation. Our team is looking for a contract developer who understands both technical ranking architectures and web automation pipelines. Let's schedule a Zoom call!",
    status: "unread",
    ip_hash: "abcd1234efgh5678",
    created_at: "2026-06-08T09:12:00Z"
  },
  {
    id: "cont_2",
    name: "Jessica Miller",
    email: "j.miller@cybersecurity-recruiters.com",
    message: "Hello! I saw your PentestSEO custom tool repository on GitHub. Developing on Parrot OS with Nmap integration is exactly the kind of hands-on security scripting skill we look for in Junior Analyst roles. Do you have a copy of your cybersecurity-focused resume available for download? Thank you!",
    status: "read",
    ip_hash: "9912aabbccddeeff",
    created_at: "2026-06-05T14:30:00Z"
  }
];
