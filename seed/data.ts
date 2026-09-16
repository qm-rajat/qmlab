import { SiteSettings, Project, Blog, Certificate, Contact } from '../src/types';

export const DEFAULT_SETTINGS: SiteSettings = {
  hero_name: "Rajat Kumar Dash",
  hero_tagline: "Technical Product Manager · Full-Stack Developer · Technical SEO & Analytics",
  hero_bio: "A technology-driven Computer Science graduate pursuing an MBA in Product Management. Specializing in technical product management, PRD drafting, sprint roadmapping, full-stack web architectures, and quantifiable growth analytics.",
  profile_image_url: "", // will fall back to beautiful circular SVG or letter badge if blank
  about_text: "I am a multidisciplinary engineer and aspiring Technical Product Manager (TPM) currently pursuing an MBA with a specialization in Product Management. With a strong Computer Science foundation, I bridge business objectives, customer discovery, and engineering execution. My background spans technical search engine optimization (SEO), data science modeling, full-stack software development, and quality automation. As an MBA candidate, I leverage RICE prioritization, Agile sprint management, user journey mapping, and metric-driven PRDs to deliver high-velocity digital products that solve real customer problems and deliver measurable ROI.",
  seo_home_title: "Rajat Kumar Dash | Technical Product Manager & Software Engineer",
  seo_home_description: "Professional portfolio and CRM console for Rajat Kumar Dash — Technical Product Manager (MBA Candidate), Computer Science graduate, developer, and analytics strategist.",
  seo_home_keywords: "Rajat Kumar Dash, technical product manager, MBA product management, PRD, product strategy, full stack developer, technical SEO, data analytics, QA automation, React, Python, portfolio",
  seo_og_image_url: "",
  skills: [
    {
      category: "Product Management & Strategy",
      items: [
        { name: "Product Requirements (PRD)" },
        { name: "Agile & Scrum Sprints" },
        { name: "Roadmap Prioritization (RICE)" },
        { name: "User Research & Discovery" },
        { name: "Go-to-Market (GTM) Strategy" },
        { name: "Product Analytics (GA4 / Mixpanel)" },
        { name: "Wireframing & Journey Mapping" },
        { name: "Stakeholder Management" }
      ]
    },
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
      institution: "Amity University / Online Business School",
      degree: "MBA",
      field: "Product Management & Digital Strategy",
      start_year: 2025,
      end_year: 2027,
      grade: "Specialization: Product Management (Enrolled)"
    },
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

  hero_stats: [
    { label: "Experience", value: "3+ Years", subtext: "Production Eng" },
    { label: "Delivered", value: "15+ Systems", subtext: "Full-Stack & SEO" },
    { label: "Lighthouse", value: "100/100", subtext: "Core Web Vitals" }
  ],
  overview_fourth_stat: {
    label: "TryHackMe Context Rank",
    value: "Top 9%"
  }
};

export const DEFAULT_PROJECTS: Project[] = [];

export const DEFAULT_CERTIFICATES: Certificate[] = [];

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

export const DEFAULT_CONTACTS: Contact[] = [];
