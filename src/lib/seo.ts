import { SiteSettings, Blog, Project } from '../types';

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
  return 'https://qmlab.dev';
}

/**
 * Dynamic Person Schema (Schema.org)
 * Includes credentials, MBA in Product Management, engineering background, and skills.
 */
export function generatePersonSchema(settings: SiteSettings, baseUrl: string) {
  const profileImg = settings.profile_image_url || `${baseUrl}/logo.png`;
  const heroName = settings.hero_name || 'Rajat Kumar Dash';

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
    url: baseUrl,
    image: profileImg,
    jobTitle: 'Technical Product Manager & Full-Stack Software Engineer',
    description: settings.hero_bio || settings.about_text || '',
    email: settings.contact_email ? `mailto:${settings.contact_email}` : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.contact_location || 'India',
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
      'Agile & Scrum Sprints',
      'RICE Prioritization',
      'Full-Stack Web Development',
      'React & Next.js',
      'TypeScript & Node.js',
      'Technical SEO Architecture',
      'Core Web Vitals Optimization',
      'GA4 & Product Analytics',
      'Test Automation & QA Suites',
      'Cybersecurity & Vulnerability Assessment'
    ],
    worksFor: {
      '@type': 'Organization',
      name: settings.company_name || 'QM Labs',
      url: baseUrl,
    },
  };
}

/**
 * Dynamic WebSite Schema
 */
export function generateWebSiteSchema(settings: SiteSettings, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: `${settings.hero_name || 'Rajat Kumar Dash'} | Portfolio & Tech Console`,
    description: settings.seo_home_description || settings.hero_bio || '',
    publisher: {
      '@id': `${baseUrl}/#person`,
    },
    inLanguage: 'en-US',
  };
}

/**
 * Dynamic ProfilePage Schema
 */
export function generateProfilePageSchema(settings: SiteSettings, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${baseUrl}/`,
    url: baseUrl,
    name: `${settings.hero_name || 'Rajat Kumar Dash'} — Technical Product Manager & Software Engineer`,
    dateCreated: '2024-01-01T00:00:00Z',
    dateModified: new Date().toISOString(),
    mainEntity: {
      '@id': `${baseUrl}/#person`,
    },
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
    : `${baseUrl}/logo.png`;

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
        url: `${baseUrl}/logo.png`,
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
