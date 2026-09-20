import React, { useEffect } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';

// Shell & Navigation Components
import Header from './components/Header';
import Footer from './components/Footer';
import SEO from './components/SEO';
import {
  getClientBaseUrl,
  generatePersonSchema,
  generateWebSiteSchema,
  generateProfilePageSchema,
  generateBlogPostingSchema,
  generateServicesSchema,
  generateProjectsCollectionSchema,
  generateResumeSchema,
  generateCertificatesSchema,
  generateContactSchema,
} from './lib/seo';

// Views
import OverviewView from './components/views/OverviewView';
import ServicesHomePage from './components/ServicesHomePage';
import ProjectGallery from './components/ProjectGallery';
import BlogHub from './components/BlogHub';
import BlogPost from './components/BlogPost';
import ResumeCenter from './components/ResumeCenter';
import CertificateGrid from './components/CertificateGrid';
import ContactForm from './components/ContactForm';
import AdminConsole from './components/AdminConsole';
import NotFound from './components/NotFound';
import GlassCursor from './components/magic/GlassCursor';

// Custom Hook for State & Persistence
import { usePortfolioData } from './hooks/usePortfolioData';

export default function App() {
  const {
    settings,
    projects,
    blogs,
    certificates,
    services,
    likedBlogs,
    bookmarkedBlogs,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    skillSearch,
    selectedSkillCat,
    setSelectedSkillCat,
    uniqueBlogCats,
    handleUpdateSettings,
    handleUpdateProjects,
    handleUpdateBlogs,
    handleUpdateCertificates,
    handleUpdateServices,
    handleLikeToggle,
    handleBookmarkToggle,
  } = usePortfolioData();

  const location = useLocation();
  const navigate = useNavigate();
  
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const domainParam = queryParams.get('domain');

  const isServicesDomain = domainParam !== 'portfolio';
  
  // Map current pathname to active view
  const path = location.pathname;
  let currentView = 'home';
  if (path.startsWith('/projects')) currentView = 'projects';
  else if (path.startsWith('/blog')) currentView = 'blog';
  else if (path.startsWith('/resume')) currentView = 'resume';
  else if (path.startsWith('/certificates')) currentView = 'certificates';
  else if (path.startsWith('/contact')) currentView = 'contact';
  else if (path.startsWith('/admin')) currentView = 'admin';
  else if (path.startsWith('/services')) currentView = 'services';

  const baseUrl = getClientBaseUrl(settings);
  const heroName = settings.hero_name || "Rajat Kumar Dash";
  const brandName = settings.company_name || "QM Labs";
  const isServicesView = currentView === 'services' || (currentView === 'home' && isServicesDomain);

  let seoTitle = settings.seo_home_title || `${heroName} | Technical Product Manager & Software Engineer`;
  let seoDesc = settings.seo_home_description || "Technical Product Manager (MBA Candidate) & Full-Stack Software Engineer. Specializing in PRD strategy, sprint execution, web scalability, and product analytics.";
  let seoKeywords = settings.seo_home_keywords || "Technical Product Manager, MBA Product Management, PRD, Full-Stack Developer, Technical SEO, React, TypeScript, Python";
  let seoType: 'website' | 'article' | 'profile' = 'website';
  let dynamicSchemas: any[] = [
    generatePersonSchema(settings, baseUrl),
    generateWebSiteSchema(settings, baseUrl),
    generateProfilePageSchema(settings, baseUrl)
  ];

  if (isServicesView) {
    seoTitle = settings.seo_services_title || `${brandName} | Full-Stack Engineering, AI Integration & Technical Consulting`;
    seoDesc = settings.seo_services_description || "High-performance software engineering, AI/MCP server integrations, technical SEO architecture, and cloud advisory services.";
    seoKeywords = settings.seo_services_keywords || "Full-stack web engineering, AI agents, MCP integration, technical SEO, React, Node.js, Cloud Run, consulting";
    dynamicSchemas = [
      generatePersonSchema(settings, baseUrl),
      generateWebSiteSchema(settings, baseUrl),
      generateServicesSchema(services, settings, baseUrl)
    ];
  } else if (currentView === 'projects') {
    seoTitle = settings.seo_projects_title || `Case Studies & Projects Portfolio | ${heroName}`;
    seoDesc = settings.seo_projects_description || "Explore software engineering builds, product requirement documents (PRD), agile sprints, and automated test architectures.";
    seoKeywords = settings.seo_projects_keywords || "software engineering portfolio, PRD case studies, automated QA, React, TypeScript, Python, data analytics";
    dynamicSchemas = [
      generatePersonSchema(settings, baseUrl),
      generateProjectsCollectionSchema(projects, settings, baseUrl)
    ];
  } else if (currentView === 'blog') {
    seoTitle = settings.seo_blog_title || `Engineering & Product Strategy Blog | ${brandName}`;
    seoDesc = settings.seo_blog_description || "Deep-dive articles on Technical Product Management, PRD blueprints, full-stack architecture, and technical SEO performance.";
    seoKeywords = settings.seo_blog_keywords || "technical product management blog, PRD writing, software engineering, tech SEO, web scalability";
    dynamicSchemas = [
      generatePersonSchema(settings, baseUrl),
      generateWebSiteSchema(settings, baseUrl)
    ];
  } else if (currentView === 'resume') {
    seoTitle = settings.seo_resume_title || `Interactive Resume & Career Path | ${heroName}`;
    seoDesc = settings.seo_resume_description || "Explore the verified career trajectory, MBA in Product Management specialization, technical competencies, and achievements of Rajat Kumar Dash.";
    seoKeywords = settings.seo_resume_keywords || "Rajat Kumar Dash resume, Technical Product Manager CV, MBA Product Management, full stack developer credentials";
    seoType = 'profile';
    dynamicSchemas = [
      generatePersonSchema(settings, baseUrl),
      generateResumeSchema(settings, baseUrl)
    ];
  } else if (currentView === 'certificates') {
    seoTitle = settings.seo_certificates_title || `Verified Credentials & Degrees | ${heroName}`;
    seoDesc = settings.seo_certificates_description || "Official verification hub for academic degrees, MBA Product Management coursework, and professional engineering certifications.";
    seoKeywords = settings.seo_certificates_keywords || "verified credentials, degrees, GIET University, Amity University, machine learning certificates, QA testing";
    dynamicSchemas = [
      generatePersonSchema(settings, baseUrl),
      generateCertificatesSchema(certificates, settings, baseUrl)
    ];
  } else if (currentView === 'contact') {
    seoTitle = settings.seo_contact_title || `Contact & Project Inquiries | ${heroName}`;
    seoDesc = settings.seo_contact_description || "Get in touch for technical product management leadership, consulting sprints, full-stack development, or advisory roles.";
    seoKeywords = settings.seo_contact_keywords || "contact Rajat Kumar Dash, hire technical product manager, project inquiry, engineering consulting";
    dynamicSchemas = [
      generatePersonSchema(settings, baseUrl),
      generateContactSchema(settings, baseUrl)
    ];
  } else if (currentView === 'admin') {
    seoTitle = `Admin Control Console | ${brandName}`;
    seoDesc = "Secure administrator portal for managing content, projects, blogs, certificates, services, and system configuration.";
  }

  const isIndividualBlogPost = path.startsWith('/blog/') && path !== '/blog';

  const handleViewChange = (v: string) => {
    if (v === 'home') {
      navigate('/');
    } else {
      navigate(`/${v}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/40 text-slate-800 font-sans flex flex-col pt-16 sm:pt-20 tech-grid-pattern selection:bg-[#0084ff]/10">
      {!isIndividualBlogPost && (
        <SEO 
          title={seoTitle} 
          description={seoDesc} 
          keywords={seoKeywords} 
          type={seoType} 
          settings={settings} 
          schemaData={dynamicSchemas} 
        />
      )}
      <Analytics />
      <SpeedInsights />

      {/* GLOBAL SCROLLING HEADER NAVIGATION */}
      {(!settings.is_under_maintenance || path.startsWith('/admin')) && (
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        isAdminLoggedIn={isAdminLoggedIn}
        isServicesDomain={isServicesDomain}
      />
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-8">
        {settings.is_under_maintenance && !path.startsWith('/admin') ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
             <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center shadow-sm">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
             </div>
             <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">System Update in Progress</h1>
             <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
               The platform is currently undergoing scheduled maintenance to upgrade our infrastructure and improve performance. We'll be back online shortly.
             </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              isServicesDomain ? (
                <ServicesHomePage
                  settings={settings}
                  projects={projects}
                  blogs={blogs}
                  services={services}
                />
              ) : (
                <OverviewView
                  settings={settings}
                  projects={projects}
                  certificatesCount={(certificates || []).length}
                  uniqueBlogCatsCount={(uniqueBlogCats || []).length}
                  skillSearch={skillSearch}
                  selectedSkillCat={selectedSkillCat}
                  onSelectSkillCat={setSelectedSkillCat}
                  onNavigate={handleViewChange}
                />
              )
            } />

            <Route path="/projects" element={
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
            } />

            <Route path="/blog" element={
              <motion.div
                key="blog"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <BlogHub
                  blogs={blogs}
                  settings={settings}
                  onReadBlog={(b) => navigate(`/blog/${b.id}`)}
                  likedBlogs={likedBlogs}
                  bookmarkedBlogs={bookmarkedBlogs}
                  onLikeToggle={handleLikeToggle}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              </motion.div>
            } />

            <Route path="/blog/:id" element={
              <BlogPostRouteWrapper
                blogs={blogs}
                settings={settings}
                likedBlogs={likedBlogs}
                bookmarkedBlogs={bookmarkedBlogs}
                onLikeToggle={handleLikeToggle}
                onBookmarkToggle={handleBookmarkToggle}
                onBack={() => navigate('/blog')}
                onSelectBlog={(b) => navigate(`/blog/${b.id}`)}
              />
            } />

            <Route path="/resume" element={
              <motion.div
                key="resume"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-10 py-6"
              >
                <div className="text-center space-y-2 no-print">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">Interactive Resume Hub</h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Customize and export targeted resumes for different professional personas: Full-Stack Engineering, Technical SEO, QA, and Cybersecurity.
                  </p>
                </div>
                <ResumeCenter 
                  settings={settings} 
                  projects={projects}
                  certificates={certificates}
                  isAdminLoggedIn={isAdminLoggedIn}
                  onUpdateSettings={handleUpdateSettings}
                />
              </motion.div>
            } />

            <Route path="/certificates" element={
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
            } />

            <Route path="/contact" element={
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
                  <div className="space-y-6 text-left">
                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-[#0084ff] uppercase tracking-widest border-l-2 border-[#0084ff] pl-2">
                        Channels & social Coordinates
                      </h4>
                      <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                        Reach out directly on certified email routes, or connect on GitHub or professional networks.
                      </p>
                    </div>
                    <div className="space-y-3 max-w-sm">
                      <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-3.5 shadow-xs">
                        <div className="p-2 bg-blue-50 text-primary rounded-xl">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Direct Coordinates</span>
                          <a href={`mailto:${settings.contact_email || 'rajat.pilgrimpackages@gmail.com'}`} className="text-xs font-semibold text-slate-800 hover:text-primary transition-colors">
                            {settings.contact_email || 'rajat.pilgrimpackages@gmail.com'}
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
                            {settings?.contact_location || "Delhi, India"}
                          </span>
                        </div>
                      </div>
                    </div>
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
                          title="Rajat Kumar Dash Location Coordinates Mapping"
                        />
                      </div>
                    )}
                  </div>
                  <ContactForm />
                </div>
              </motion.div>
            } />

            <Route path="/admin" element={
              <motion.div
                key="admin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-4"
              >
                <AdminConsole
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  projects={projects}
                  onUpdateProjects={handleUpdateProjects}
                  blogs={blogs}
                  onUpdateBlogs={handleUpdateBlogs}
                  certificates={certificates}
                  onUpdateCertificates={handleUpdateCertificates}
                  services={services}
                  onUpdateServices={handleUpdateServices}
                  isAdminLoggedIn={isAdminLoggedIn}
                  onAdminLoginToggle={setIsAdminLoggedIn}
                />
              </motion.div>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        )}
      </main>

      <GlassCursor />

      {/* GLOBAL FOOTER BRAND */}
      {(!settings.is_under_maintenance || path.startsWith('/admin')) && (
        <Footer settings={settings} onViewChange={handleViewChange} />
      )}
    </div>
  );
}

// Wrapper component to handle finding the correct blog by ID
function BlogPostRouteWrapper({ 
  blogs, 
  settings, 
  likedBlogs, 
  bookmarkedBlogs, 
  onLikeToggle, 
  onBookmarkToggle, 
  onBack, 
  onSelectBlog 
}: any) {
  const { id } = useParams();
  const selectedBlog = blogs.find((b: any) => b.id === id);

  if (!selectedBlog) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Blog post not found</h2>
        <button onClick={onBack} className="text-primary hover:underline">Return to blog</button>
      </div>
    );
  }

  const blogBaseUrl = getClientBaseUrl(settings);
  const blogSchema = generateBlogPostingSchema(selectedBlog, settings, blogBaseUrl);

  return (
    <>
      <SEO 
        title={`${selectedBlog.title} | ${settings?.company_name || 'QM Labs'}`} 
        description={selectedBlog.excerpt || selectedBlog.seo_description}
        image={selectedBlog.cover_image_url || selectedBlog.og_image_url}
        type="article"
        settings={settings}
        schemaData={blogSchema}
      />
      <BlogPost
        blog={selectedBlog}
        settings={settings}
        allBlogs={blogs}
        onSelectBlog={onSelectBlog}
        onBack={onBack}
        isLiked={likedBlogs.includes(selectedBlog.id)}
        isBookmarked={bookmarkedBlogs.includes(selectedBlog.id)}
        onLikeToggle={onLikeToggle}
        onBookmarkToggle={onBookmarkToggle}
      />
    </>
  );
}
