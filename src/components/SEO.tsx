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
  author?: string;
  twitterHandle?: string;
  themeColor?: string;
  extraMeta?: Array<{ name?: string; property?: string; content: string }>;
  settings?: SiteSettings | null;
  schemaData?: Record<string, any> | Array<Record<string, any>>;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  url,
  image,
  type = "website",
  keywords,
  author,
  twitterHandle,
  themeColor,
  extraMeta = [],
  settings,
  schemaData,
}) => {
  const baseUrl = getClientBaseUrl(settings);
  const effectiveUrl = url || (typeof window !== 'undefined' ? window.location.href : baseUrl);
  const effectiveTitle = title || settings?.seo_home_title || `${settings?.hero_name || "Rajat Kumar Dash"} | Technical Product Manager & Software Engineer`;
  const effectiveDesc = description || settings?.seo_home_description || "Technical Product Manager (MBA Candidate) & Full-Stack Engineer specializing in PRD drafting, roadmap prioritization, high-performance web systems, and analytics.";
  const ogImage = image || settings?.seo_og_image_url || `${baseUrl}/logo.png`;
  const metaKeywords = keywords || settings?.seo_home_keywords || "Technical Product Manager, MBA Product Management, PRD, Full-Stack Developer, Technical SEO, React, TypeScript, Python";
  const authorName = author || settings?.seo_author || settings?.hero_name || "Rajat Kumar Dash";
  const brandName = settings?.company_name || "QM Labs";
  const effectiveThemeColor = themeColor || settings?.seo_theme_color || "#0f172a";
  const effectiveTwitter = twitterHandle || settings?.seo_twitter_handle || (settings?.social_links?.twitter ? settings.social_links.twitter.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//i, '@') : undefined);
  const combinedExtraMeta = [...(settings?.seo_extra_meta || []), ...extraMeta];

  // Defensive cleanup: Ensure no non-Helmet static meta duplicates remain in the DOM
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      try {
        const legacyStaticTags = document.querySelectorAll(
          'head meta:not([data-rh="true"]):is([name="description"], [name="keywords"], [name="author"], [property^="og:"], [name^="twitter:"], [property^="twitter:"])'
        );
        legacyStaticTags.forEach((el) => el.remove());

        // Ensure only one title element in head
        const allTitles = document.querySelectorAll('head title');
        if (allTitles.length > 1) {
          // Remove any non-rh titles
          const nonRhTitles = document.querySelectorAll('head title:not([data-rh="true"])');
          nonRhTitles.forEach((el) => el.remove());
        }
      } catch (e) {
        // Fallback for older browsers not supporting :is()
        const metaList = Array.from(document.querySelectorAll('head meta:not([data-rh="true"])'));
        metaList.forEach((el) => {
          const name = el.getAttribute('name') || '';
          const prop = el.getAttribute('property') || '';
          if (
            name === 'description' ||
            name === 'keywords' ||
            name === 'author' ||
            prop.startsWith('og:') ||
            name.startsWith('twitter:') ||
            prop.startsWith('twitter:')
          ) {
            el.remove();
          }
        });
      }
    }
  }, [effectiveTitle, effectiveDesc]);

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{effectiveTitle}</title>
      <meta name="description" content={effectiveDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={authorName} />
      <meta name="theme-color" content={effectiveThemeColor} />
      <meta name="application-name" content={brandName} />
      <meta name="apple-mobile-web-app-title" content={brandName} />

      {/* GEO & Regional Meta Tags for Local & Generative Search Optimization */}
      <meta name="geo.region" content="IN-DL" />
      <meta name="geo.placename" content="Delhi NCR, India" />
      <meta name="geo.position" content="28.6139;77.2090" />
      <meta name="ICBM" content="28.6139, 77.2090" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="revisit-after" content="7 days" />

      {/* Canonical URL Tag (Dynamic to prevent duplicate content penalties across staging/custom domains) */}
      <link rel="canonical" href={effectiveUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={effectiveUrl} />
      <meta property="og:title" content={effectiveTitle} />
      <meta property="og:description" content={effectiveDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={brandName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={effectiveUrl} />
      <meta name="twitter:title" content={effectiveTitle} />
      <meta name="twitter:description" content={effectiveDesc} />
      <meta name="twitter:image" content={ogImage} />
      {effectiveTwitter && <meta name="twitter:creator" content={effectiveTwitter} />}
      {effectiveTwitter && <meta name="twitter:site" content={effectiveTwitter} />}

      {/* Custom & Extra User-Configured Meta Tags */}
      {combinedExtraMeta.map((metaItem, idx) => {
        if (metaItem.name) {
          return <meta key={`custom-meta-${idx}`} name={metaItem.name} content={metaItem.content} />;
        }
        if (metaItem.property) {
          return <meta key={`custom-meta-${idx}`} property={metaItem.property} content={metaItem.content} />;
        }
        return null;
      })}

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
