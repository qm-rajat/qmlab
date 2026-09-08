import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SiteSettings } from '../types';
import { getClientBaseUrl } from '../lib/seo';

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string;
  settings?: SiteSettings | null;
  schemaData?: Record<string, any> | Array<Record<string, any>>;
}

const SEO: React.FC<SEOProps> = ({
  title = "Rajat Kumar Dash | Technical Product Manager & Software Engineer",
  description = "Technical Product Manager (MBA Candidate) & Full-Stack Engineer specializing in PRD drafting, roadmap prioritization, high-performance web systems, and analytics.",
  url,
  image,
  type = "website",
  keywords,
  settings,
  schemaData,
}) => {
  const baseUrl = getClientBaseUrl(settings);
  const effectiveUrl = url || (typeof window !== 'undefined' ? window.location.href : baseUrl);
  const ogImage = image || settings?.seo_og_image_url || `${baseUrl}/logo.png`;
  const metaKeywords = keywords || settings?.seo_home_keywords || "Technical Product Manager, MBA Product Management, PRD, Full-Stack Developer, Technical SEO, React, TypeScript, Python";

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={settings?.hero_name || "Rajat Kumar Dash"} />

      {/* Canonical URL Tag (Dynamic to prevent duplicate content penalties across staging/custom domains) */}
      <link rel="canonical" href={effectiveUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={effectiveUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={settings?.company_name || "QM Labs"} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={effectiveUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
