import { SiteSettings, Project, Blog, Certificate, Contact } from './types';

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
        { name: "React/Next.js", proficiency: 92 },
        { name: "Node.js", proficiency: 78 },
        { name: "TypeScript", proficiency: 70 },
        { name: "Tailwind CSS", proficiency: 85 },
        { name: "Express.js", proficiency: 68 },
        { name: "WordPress CMS", proficiency: 60 },
        { name: "PHP", proficiency: 55 },
        { name: "SQL", proficiency: 72 }
      ]
    },
    {
      category: "Technical SEO & Web Analytics",
      items: [
        { name: "Core Web Vitals", proficiency: 88 },
        { name: "Schema Markup", proficiency: 82 },
        { name: "Sitemap & Robots.txt", proficiency: 75 },
        { name: "Crawl Error Resolution", proficiency: 78 },
        { name: "Ranking & Indexing", proficiency: 72 },
        { name: "GA4 / GSC", proficiency: 80 },
        { name: "Ahrefs / Semrush", proficiency: 74 },
        { name: "Screaming Frog", proficiency: 70 }
      ]
    },
    {
      category: "QA Automation & Scripting",
      items: [
        { name: "Selenium WebDriver", proficiency: 80 },
        { name: "PyTest", proficiency: 68 },
        { name: "Functional Testing", proficiency: 72 },
        { name: "API Integration Testing", proficiency: 75 },
        { name: "Python Debugging", proficiency: 65 },
        { name: "Web Scraping", proficiency: 70 },
        { name: "Automated Scraping", proficiency: 62 }
      ]
    },
    {
      category: "Data Science & BI",
      items: [
        { name: "Python/Pandas/NumPy", proficiency: 82 },
        { name: "Machine Learning (scikit-learn)", proficiency: 65 },
        { name: "Feature Engineering", proficiency: 60 },
        { name: "Data Visualization", proficiency: 72 },
        { name: "Microsoft Power BI", proficiency: 70 },
        { name: "Advanced Excel", proficiency: 75 }
      ]
    },
    {
      category: "Cybersecurity & Infrastructure",
      items: [
        { name: "Vulnerability Assessment", proficiency: 72 },
        { name: "Network Security Protocols", proficiency: 68 },
        { name: "Wireshark Packet Analysis", proficiency: 70 },
        { name: "Nmap Port Scanning", proficiency: 75 },
        { name: "Burp Suite Proxy", proficiency: 65 },
        { name: "Metasploit", proficiency: 60 },
        { name: "Parrot OS / Kali Linux", proficiency: 72 },
        { name: "DevSecOps / GitHub Lifecycle", proficiency: 65 },
        { name: "Linux Environments", proficiency: 70 }
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
  company_name: "QM Labs",
  company_tagline: "Quality Builds Trust. Momentum Drives Growth.",
  company_bio: "A premium software consulting and engineering lab specializing in secure web architecture, automated test infrastructures, and technical search engine optimization.",
  company_about_html: "<h3><strong>QM Labs — Engineering Digital Acceleration</strong></h3><p>We are a high-performance freelance and consulting agency delivering premium digital solutions to modern businesses. We combine full-stack programming, professional search engine optimization, and advanced automated testing into a singular, high-velocity delivery model.</p><ul><li><strong>Precision Engineering:</strong> We write component-driven React, TypeScript, Node.js, and Python systems structured for high uptime.</li><li><strong>Organic Growth Science:</strong> We translate search engine parameters into code, optimizing metadata, schema layouts, indexing pathways, and Core Web Vitals to increase visitor yield.</li><li><strong>Automated Stability:</strong> We formulate extensive regression suites and Page Object Model frameworks to verify that every user experience is flawless.</li></ul><p>We operate transparently, with code verified by modern telemetry, keeping your engineering momentum forward.</p>",
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
    title: "PentestSEO – Security & Analysis Framework",
    slug: "pentest-seo-framework",
    description: "A custom modular testing and inspection framework built on Parrot OS. It integrates automated website security scanning, SQL injection testing, XSS scanning, with end-to-end Technical SEO health audits. It extracts header configurations, crawl pathways, SSL status, site maps, and robots.txt syntax. Secured on Git/GitHub command structures.",
    images: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"],
    technologies: ["Python", "Parrot OS", "Nmap", "Wireshark", "Technical SEO", "Security Scripting", "Shell/Bash"],
    github_url: "https://github.com/qm-rajat/PentestSEO",
    live_url: "",
    is_featured: true,
    display_order: 1,
    created_at: "2025-01-15T00:00:00Z"
  },
  {
    id: "proj_2",
    title: "Heart Failure Prediction Model (Machine Learning)",
    slug: "heart-failure-prediction-ml",
    description: "An analytical machine learning classification engine built on medical health parameters. Developed data cleaning pipelines, evaluated statistics, and compared Random Forest, Support Vector Machine (SVM), and Gradient Boosting algorithms. Obtained a top classification accuracy score of 92.57% utilizing Scikit-learn with rigorous GridSearchCV hyperparameter tuning.",
    images: ["https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=600"],
    technologies: ["Python", "Pandas", "Scikit-Learn", "Matplotlib", "Random Forest", "GridSearchCV"],
    github_url: "https://github.com/qm-rajat/heart-failure-classification",
    live_url: "https://heart-prediction-demo.example.com",
    is_featured: true,
    display_order: 2,
    created_at: "2024-11-20T00:00:00Z"
  },
  {
    id: "proj_3",
    title: "SauceDemo Automation Testing Framework",
    slug: "sauce-demo-automation-framework",
    description: "Designed and implemented a scalable, object-oriented end-to-end automation test suite using Selenium WebDriver and PyTest. Incorporates a strict Page Object Model (POM) architecture, automated checkout loops, responsive cross-browser validation, detailed logging, and beautiful custom HTML test reports depicting pass/fail criteria.",
    images: ["https://images.unsplash.com/photo-1516116211223-5c359a36298a?auto=format&fit=crop&q=80&w=600"],
    technologies: ["Python", "Selenium WebDriver", "PyTest", "Page Object Model (POM)", "E-commerce Testing", "HTML Reporting"],
    github_url: "https://github.com/qm-rajat/SauceDemo-Automation",
    live_url: "",
    is_featured: true,
    display_order: 3,
    created_at: "2024-08-10T00:00:00Z"
  },
  {
    id: "proj_4",
    title: "Crop Disease Detection (Computer Vision)",
    slug: "crop-disease-cv",
    description: "AI-based deep learning classifier analyzing leaf images to predict bacterial, viral, or fungal infections in crops. Leveraged OpenCV for image pre-processing, implemented data augmentation structures, and integrated real-time inference on a reactive interface, facilitating smart agronomy solutions.",
    images: ["https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600"],
    technologies: ["Python", "TensorFlow/Keras", "OpenCV", "Deep Learning", "Image Augmentation"],
    github_url: "https://github.com/qm-rajat/crop-disease-detection",
    live_url: "",
    is_featured: false,
    display_order: 4,
    created_at: "2024-05-12T00:00:00Z"
  },
  {
    id: "proj_5",
    title: "Interactive Car Sales Analytics Dashboard",
    slug: "car-sales-dashboard",
    description: "An advanced business intelligence dashboard engineered in Power BI representing car sales volumes, brand market shares, geographical performance, and price segment analytics. Translates Excel databases into interactive visualizations that assist stakeholders in technical decision-making and forecasting.",
    images: ["https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600"],
    technologies: ["Power BI", "Data Cleaning", "DAX Formulas", "Advanced Excel", "Business Intelligence"],
    github_url: "",
    live_url: "https://powerbi-mock-domain.com/car-sales",
    is_featured: false,
    display_order: 5,
    created_at: "2024-03-25T00:00:00Z"
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
    image_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400",
    category: "data-science",
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
    image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400",
    category: "cybersecurity",
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
    image_url: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=400",
    category: "cybersecurity",
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
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400",
    category: "cybersecurity",
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
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
    category: "seo-digital-marketing",
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
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400",
    category: "data-science",
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
    image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400",
    category: "web-development",
    is_featured: true,
    display_order: 7,
    created_at: "2024-04-20T00:00:00Z"
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
