import { SiteSettings, Blog, Project, FreelanceService, Certificate, FAQItem } from '../types';

/**
 * Dynamically resolves the base URL on the client side.
 * Automatically adapts when the user links a custom domain,
 * or defaults dynamically to window.location.origin.
 */
export function getClientBaseUrl(settings?: SiteSettings | null): string {
  // 1. Explicit custom domain from database settings
  if (settings?.custom_domain && typeof settings.custom_domain === 'string' && settings.custom_domain.trim()) {
    let domain = settings.custom_domain.trim();
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = `https://${domain}`;
    }
    return domain.replace(/\/+$/, '');
  }

  // 2. Client environment variables
  const envDomain = import.meta.env.VITE_CUSTOM_DOMAIN || import.meta.env.VITE_SITE_URL;
  if (envDomain && typeof envDomain === 'string' && envDomain.trim()) {
    let domain = envDomain.trim();
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = `https://${domain}`;
    }
    return domain.replace(/\/+$/, '');
  }

  // 3. Dynamic browser origin (auto-adapts immediately upon domain purchase & pointing)
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }

  // 4. Safe fallback
  return 'https://qmlab.in';
}

/**
 * Dynamic Person Schema (Schema.org)
 * Includes credentials, MBA in Product Management, engineering background, and skills.
 */
export function generatePersonSchema(settings: SiteSettings, baseUrl: string) {
  const profileImg = settings.profile_image_url || `${baseUrl}/logo.png`;
  const heroName = settings.hero_name || 'Rajat Kumar Dash';
  const brandName = settings.company_name || 'QM Labs';

  const socialProfiles = [
    settings.social_links?.linkedin,
    settings.social_links?.github,
    settings.social_links?.twitter,
    settings.social_links?.instagram,
  ].filter((url): url is string => Boolean(url && url.trim()));

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/#person`,
    name: heroName,
    url: baseUrl.includes('rajat.') ? baseUrl : 'https://rajat.qmlab.in',
    image: profileImg,
    jobTitle: 'Founder, Technical Product Manager & Full-Stack Software Engineer',
    description: settings.hero_bio || settings.about_text || 'Technical Product Manager (MBA Candidate) & Full-Stack Engineer specializing in AI systems, PRD drafting, web scalability, and technical SEO.',
    email: settings.contact_email ? `mailto:${settings.contact_email}` : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.contact_location || 'Bhubaneswar, Odisha',
      addressCountry: 'India',
    },
    sameAs: socialProfiles,
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Amity University / Online Business School',
        description: 'MBA in Product Management & Digital Strategy (Enrolled)'
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'Gandhi Institute of Engineering and Technology (GIET University)',
        description: 'B.Tech in Computer Science & Engineering'
      }
    ],
    knowsAbout: [
      'Technical Product Management',
      'Product Requirements Document (PRD)',
      'Model Context Protocol (MCP)',
      'Artificial Intelligence & LLM Agents',
      'Google Gemini API Integration',
      'Agile & Scrum Sprint Execution',
      'Full-Stack Web Development',
      'React 19, TypeScript & Next.js',
      'Node.js, Express & REST APIs',
      'Technical SEO, AEO & GEO Optimization',
      'Core Web Vitals & Web Performance',
      'Cloud Run, Docker & DevOps Architecture',
      'GA4 & Product Analytics'
    ],
    worksFor: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: brandName,
      url: baseUrl,
    },
  };
}

/**
 * Dynamic Organization Schema for QM Labs (Services & Features)
 */
export function generateOrganizationSchema(settings: SiteSettings, baseUrl: string) {
  const brandName = settings.company_name || 'QM Labs';
  const heroName = settings.hero_name || 'Rajat Kumar Dash';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: brandName,
    url: baseUrl,
    logo: `${baseUrl}/assets/LOGO-BTDcmzva.png`,
    description: settings.seo_services_description || 'QM Labs by Rajat Kumar Dash delivers enterprise-grade full-stack web engineering, custom AI/MCP server integrations, technical SEO audits, and cloud DevOps consulting.',
    founder: {
      '@type': 'Person',
      '@id': `${baseUrl}/#person`,
      name: heroName,
      jobTitle: 'Founder & Principal Software Architect',
      url: 'https://rajat.qmlab.in',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Sales and Technical Consulting',
      email: settings.contact_email || 'contact@qmlab.in',
      availableLanguage: ['English', 'Hindi', 'Odia'],
      areaServed: 'Worldwide',
    },
    sameAs: [
      settings.social_links?.linkedin,
      settings.social_links?.github,
      settings.social_links?.twitter,
    ].filter(Boolean),
  };
}

/**
 * Dynamic WebSite Schema
 */
export function generateWebSiteSchema(settings: SiteSettings, baseUrl: string) {
  const isPortfolio = baseUrl.includes('rajat.');
  const heroName = settings.hero_name || 'Rajat Kumar Dash';
  const brandName = settings.company_name || 'QM Labs';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: isPortfolio ? `${heroName} | Technical Product Manager & Software Engineer` : `${brandName} | Full-Stack Engineering, AI Systems & Technical SEO`,
    description: isPortfolio ? (settings.seo_home_description || settings.hero_bio || '') : (settings.seo_services_description || ''),
    publisher: {
      '@id': isPortfolio ? `${baseUrl}/#person` : `${baseUrl}/#organization`,
    },
    inLanguage: 'en-US',
  };
}

/**
 * Dynamic ProfilePage Schema
 */
export function generateProfilePageSchema(settings: SiteSettings, baseUrl: string) {
  const heroName = settings.hero_name || 'Rajat Kumar Dash';

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${baseUrl}/`,
    url: baseUrl,
    name: `${heroName} — Technical Product Manager & Software Engineer`,
    dateCreated: '2024-01-01T00:00:00Z',
    dateModified: new Date().toISOString(),
    mainEntity: {
      '@id': `${baseUrl}/#person`,
    },
  };
}

/**
 * Dynamic FAQPage Schema for AEO (Answer Engine Optimization)
 * Allows LLMs (ChatGPT, Perplexity, Gemini, Claude) to extract verified answers
 */
export function generateFaqSchema(settings: SiteSettings, baseUrl: string, faqs?: FAQItem[]) {
  const heroName = settings.hero_name || 'Rajat Kumar Dash';
  const brandName = settings.company_name || 'QM Labs';

  const activeFaqs = (faqs && faqs.length > 0) 
    ? faqs.filter(f => f.is_active !== false)
    : [];

  const mainEntity = activeFaqs.length > 0
    ? activeFaqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    : [
        {
          '@type': 'Question',
          name: `What services does ${brandName} provide?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${brandName} specializes in Full-Stack Web Development (React, TypeScript, Node.js), Custom AI & LLM / Model Context Protocol (MCP) Server Integration, Technical SEO / AEO / GEO Optimization, Cloud Architecture & DevOps Advisory, Product Strategy & Technical PRD Sprints, and Codebase Health & Security Audits.`
          }
        },
        {
          '@type': 'Question',
          name: `Who owns the source code and intellectual property for projects built by ${brandName}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Clients retain 100% full intellectual property and commercial copyright. All Git repositories, environment credentials, and production configurations are transferred completely upon project completion.`
          }
        },
        {
          '@type': 'Question',
          name: `How do milestone contracts and payments work at ${brandName}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Engagements are structured into milestone-based deliverables (e.g., 30% kickoff/PRD, 40% mid-sprint demo, 30% final QA & production deployment) with clear scopes of work.`
          }
        },
        {
          '@type': 'Question',
          name: `Who is the founder and lead engineer of ${brandName}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${brandName} was founded and is led by ${heroName}, a Technical Product Manager and Full-Stack Software Engineer with a B.Tech in CSE and pursuing an MBA in Product Management.`
          }
        },
        {
          '@type': 'Question',
          name: `What is included in the 30-day post-launch warranty?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `All deliverables include a 30-day warranty covering bug fixes, edge-case remediation, and deployment adjustments within the agreed project scope at zero additional cost.`
          }
        },
        {
          '@type': 'Question',
          name: `Where can I view ${heroName}'s personal portfolio, resume, and credentials?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${heroName}'s personal portfolio, verified credentials, and interactive resume are available at https://rajat.qmlab.in.`
          }
        },
        {
          '@type': 'Question',
          name: `How does ${brandName} implement AI and MCP servers?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${brandName} implements Model Context Protocol (MCP) servers, Google Gemini API tools, automated RAG pipelines, and AI agent workflows with secure server-side proxying and strict token limits.`
          }
        },
        {
          '@type': 'Question',
          name: 'What is Technical SEO, AEO, and GEO Optimization?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Technical SEO ensures search engine crawlability and perfect Core Web Vitals. AEO (Answer Engine Optimization) structures content for AI answer engines like ChatGPT and Perplexity. GEO (Generative Engine Optimization) utilizes Schema.org and geo-targeted metadata.'
          }
        }
      ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${baseUrl}/#faq`,
    mainEntity
  };
}

/**
 * Dynamic BlogPosting Schema
 */
export function generateBlogPostingSchema(blog: Blog, settings: SiteSettings, baseUrl: string) {
  const blogUrl = `${baseUrl}/blog/${blog.slug || blog.id}`;
  const rawImage = blog.cover_image_url || blog.og_image_url;
  const coverImage = rawImage
    ? (rawImage.startsWith('http') ? rawImage : `${baseUrl}${rawImage}`)
    : `${baseUrl}/assets/LOGO-BTDcmzva.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${blogUrl}#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blogUrl,
    },
    headline: blog.title,
    description: blog.excerpt || blog.seo_description || '',
    image: coverImage,
    datePublished: blog.published_at || blog.created_at,
    dateModified: blog.created_at,
    author: {
      '@id': `${baseUrl}/#person`,
      name: settings.hero_name || 'Rajat Kumar Dash',
    },
    publisher: {
      '@type': 'Organization',
      name: settings.company_name || 'QM Labs',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/assets/LOGO-BTDcmzva.png`,
      },
    },
    keywords: blog.tags?.join(', '),
  };
}

/**
 * Dynamic SoftwareApplication / CreativeWork Schema
 */
export function generateProjectSchema(project: Project, settings: SiteSettings, baseUrl: string) {
  const projUrl = `${baseUrl}/projects/${project.slug || project.id}`;
  const screenshot = project.image_url || (project.images && project.images[0]);

  return {
    '@context': 'https://schema.org',
    '@type': project.category === 'product-management' ? 'CreativeWork' : 'SoftwareApplication',
    '@id': `${projUrl}#project`,
    name: project.title,
    description: project.description,
    url: projUrl,
    author: {
      '@id': `${baseUrl}/#person`,
    },
    ...(screenshot && {
      image: screenshot.startsWith('http') ? screenshot : `${baseUrl}${screenshot}`,
    }),
    keywords: project.technologies?.join(', '),
  };
}

/**
 * Dynamic ProfessionalService / OfferCatalog Schema for Services Page
 */
export function generateServicesSchema(services: FreelanceService[], settings: SiteSettings, baseUrl: string) {
  const serviceUrl = `${baseUrl}/services`;
  const activeServices = (services || []).filter(s => s.is_active);
  const brandName = settings.company_name || 'QM Labs';
  const heroName = settings.hero_name || 'Rajat Kumar Dash';

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${serviceUrl}#service`,
    name: `${brandName} — Engineering & Consulting Services`,
    description: settings.seo_services_description || settings.company_tagline || 'Full-stack engineering, AI & MCP integration, technical SEO, and cloud DevOps consulting services.',
    url: serviceUrl,
    founder: {
      '@type': 'Person',
      '@id': `${baseUrl}/#person`,
      name: heroName,
    },
    provider: {
      '@id': `${baseUrl}/#organization`,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Worldwide' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'United Kingdom' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Consulting & Engineering Packages',
      itemListElement: activeServices.map((srv, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: srv.title,
          description: srv.short_description || srv.full_description,
        },
        price: srv.starting_price?.replace(/[^0-9.]/g, '') || undefined,
        priceCurrency: 'USD',
        position: idx + 1,
      })),
    },
  };
}

/**
 * Dynamic CollectionPage & ItemList Schema for Projects Hub
 */
export function generateProjectsCollectionSchema(projects: Project[], settings: SiteSettings, baseUrl: string) {
  const projectsUrl = `${baseUrl}/projects`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${projectsUrl}#collection`,
    name: settings.seo_projects_title || `Engineering Portfolio & Technical Case Studies | ${settings.hero_name || 'Rajat Kumar Dash'}`,
    description: settings.seo_projects_description || 'High-end catalog of data classification dashboards, automated QA suites, technical SEO implementations, and full-stack software systems.',
    url: projectsUrl,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: (projects || []).slice(0, 20).map((proj, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${baseUrl}/projects#${proj.id}`,
        name: proj.title,
      })),
    },
  };
}

/**
 * Dynamic Resume / ProfilePage Schema
 */
export function generateResumeSchema(settings: SiteSettings, baseUrl: string) {
  const resumeUrl = `${baseUrl}/resume`;
  const heroName = settings.hero_name || 'Rajat Kumar Dash';

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${resumeUrl}#resume-profile`,
    url: resumeUrl,
    name: settings.seo_resume_title || `Interactive Resume & Career Path | ${heroName}`,
    description: settings.seo_resume_description || `Verified career trajectory, MBA Product Management coursework, software engineering experience, and technical competencies for ${heroName}.`,
    mainEntity: {
      '@id': `${baseUrl}/#person`,
    },
  };
}

/**
 * Dynamic Credentials Schema for Certificates
 */
export function generateCertificatesSchema(certificates: Certificate[], settings: SiteSettings, baseUrl: string) {
  const certsUrl = `${baseUrl}/certificates`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${certsUrl}#credentials`,
    url: certsUrl,
    name: settings.seo_certificates_title || `Verified Professional Credentials & Certifications | ${settings.hero_name || 'Rajat Kumar Dash'}`,
    description: settings.seo_certificates_description || 'Official verification hub for degrees, machine learning coursework, cybersecurity modules, and engineering certifications.',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: (certificates || []).map((c, idx) => ({
        '@type': 'EducationalOccupationalCredential',
        position: idx + 1,
        name: c.title,
        credentialCategory: c.issuer,
        dateCreated: c.issue_date,
      })),
    },
  };
}

/**
 * Dynamic ContactPage Schema
 */
export function generateContactSchema(settings: SiteSettings, baseUrl: string) {
  const contactUrl = `${baseUrl}/contact`;
  const heroName = settings.hero_name || 'Rajat Kumar Dash';

  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${contactUrl}#contact-page`,
    url: contactUrl,
    name: settings.seo_contact_title || `Contact & Project Inquiries | ${heroName}`,
    description: settings.seo_contact_description || 'Get in touch for technical product management leadership, consulting sprints, full-stack development, or advisory roles.',
    mainEntity: {
      '@type': 'ContactPoint',
      contactType: 'technical inquiries',
      email: settings.contact_email ? `mailto:${settings.contact_email}` : undefined,
      telephone: settings.contact_phone || undefined,
      areaServed: 'Worldwide',
      availableLanguage: ['English', 'Hindi', 'Odia'],
    },
  };
}
