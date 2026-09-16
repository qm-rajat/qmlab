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
} from './lib/seo';

// Views
import OverviewView from './components/views/OverviewView';
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
    handleLikeToggle,
    handleBookmarkToggle,
  } = usePortfolioData();

  const location = useLocation();
  const navigate = useNavigate();
  
  // Map current pathname to old 'currentView' logic for backwards compatibility in Header/Footer if needed, or we just pass location.pathname
  const path = location.pathname;
  let currentView = 'home';
  if (path.startsWith('/projects')) currentView = 'projects';
  else if (path.startsWith('/blog')) currentView = 'blog';
  else if (path.startsWith('/resume')) currentView = 'resume';
  else if (path.startsWith('/certificates')) currentView = 'certificates';
  else if (path.startsWith('/contact')) currentView = 'contact';
  else if (path.startsWith('/admin')) currentView = 'admin';

  const baseUrl = getClientBaseUrl(settings);
  const heroName = settings.hero_name || "Rajat Kumar Dash";
  const brandName = settings.company_name || "QM Labs";

  let seoTitle = `${heroName} | Technical Product Manager & Software Engineer`;
  let seoDesc = settings.seo_home_description || "Technical Product Manager (MBA Candidate) & Full-Stack Software Engineer. Specializing in PRD strategy, sprint execution, web scalability, and product analytics.";
  
  if (currentView === 'blog') {
    seoTitle = `Engineering & Product Strategy Blog | ${brandName}`;
    seoDesc = "Deep-dive articles on Technical Product Management, PRD blueprints, full-stack architecture, and technical SEO performance.";
  } else if (currentView === 'projects') {
    seoTitle = `Case Studies & Projects | ${heroName}`;
    seoDesc = "Explore software engineering builds, product requirement documents (PRD), agile sprints, and automated test architectures.";
  } else if (currentView === 'resume') {
    seoTitle = `Interactive Resume & Career Path | ${heroName}`;
    seoDesc = "Explore the verified career trajectory, MBA in Product Management specialization, technical competencies, and achievements of Rajat Kumar Dash.";
  } else if (currentView === 'contact') {
    seoTitle = `Contact & Project Inquiries | ${heroName}`;
    seoDesc = "Get in touch for technical product management leadership, consulting sprints, full-stack development, or advisory roles.";
  } else if (currentView === 'certificates') {
    seoTitle = `Verified Credentials & Degrees | ${heroName}`;
    seoDesc = "Official verification hub for academic degrees, MBA Product Management coursework, and professional engineering certifications.";
  }

  const rootSchemas = [
    generatePersonSchema(settings, baseUrl),
    generateWebSiteSchema(settings, baseUrl),
    generateProfilePageSchema(settings, baseUrl)
  ];

  const handleViewChange = (v: string) => {
    if (v === 'home') navigate('/');
    else navigate(`/${v}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/40 text-slate-800 font-sans flex flex-col pt-24 sm:pt-28 tech-grid-pattern selection:bg-[#0084ff]/10">
      <SEO title={seoTitle} description={seoDesc} settings={settings} schemaData={rootSchemas} />
      <Analytics />
      <SpeedInsights />
      
      {/* GLOBAL SCROLLING HEADER NAVIGATION */}
      {(!settings.is_under_maintenance || path.startsWith('/admin')) && (
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        isAdminLoggedIn={isAdminLoggedIn}
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
                          title="Rajat Dash Location Coordinates Mapping"
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
