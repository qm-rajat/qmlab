import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "QM LABS - Full-Stack Engineering & Technical SEO", 
  description = "Explore the engineering portfolio and consultancy of Rajat Kumar Dash. Specializing in high-performance web applications, Technical SEO, and backend automation.",
  url = "https://qmlab-indol.vercel.app"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {/* Twitter Card */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;
