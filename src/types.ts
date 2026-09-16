export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category?: 'automation' | 'machine-learning' | 'cybersecurity' | 'data-bi' | 'web-systems' | 'product-management' | string;
  images: string[];         // array of image URLs
  image_url?: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  prd_url?: string;
  target_audience?: string;
  key_metric?: {
    label: string;
    value: string;
  } | string;
  architecture_highlights?: string[];
  problem_statement?: string;
  solution_details?: string;
  features?: string[];
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content_html?: string;
  cover_image_url?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_image_url?: string;
  canonical_url?: string;
  status: 'draft' | 'published' | 'archived';
  read_time_mins: number;
  like_count: number;
  bookmark_count: number;
  view_count: number;
  published_at?: string;
  created_at: string;
  tags?: string[];
  categories?: string[];
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  verify_url?: string;
  image_url?: string;
  category: 'cybersecurity' | 'web-development' | 'data-science' |
            'machine-learning' | 'seo-digital-marketing' | 'cloud' | 'other' | (string & {});
  skills?: string[];
  description?: string;
  score_or_grade?: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived' | 'unsubscribed';
  ip_hash?: string;
  created_at: string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  estimated_value?: string;
  inquiry_type?: 'freelance_project' | 'general' | 'newsletter' | 'unsubscribe';
}

export interface SkillItem {
  name: string;
}

export interface Skill {
  category: string;      // e.g. "Web Development"
  items: (string | SkillItem)[];       // e.g. ["Next.js", { name: "React" }]
}

export interface Experience {
  company: string;
  role: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string;
  location: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  start_year: number;
  end_year?: number;
  grade?: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface HeroStat {
  label: string;
  value: string;
  subtext: string;
}

export interface DomainProfile {
  id: string; // e.g. 'general', 'product', 'seo', 'data', 'qa', 'security', or custom
  name: string; // e.g. 'Product Manager (TPM)'
  title: string; // e.g. 'Technical Product Manager & Product Strategist'
  summary: string;
  icon_name?: string; // 'Code2', 'Target', 'Search', 'Database', 'Briefcase', 'ShieldAlert', 'Cpu', 'Globe', 'Zap'
  accent_color?: string; // 'blue', 'amber', 'indigo', 'emerald', 'rose', 'purple'
  skills_categories?: string[]; // categories associated with this profile
  is_default?: boolean;
}

export interface SiteSettings {
  hero_name: string;
  hero_tagline: string;
  hero_bio: string;
  profile_image_url: string;
  about_text: string;
  seo_home_title: string;
  seo_home_description: string;
  seo_home_keywords: string;
  seo_og_image_url: string;
  custom_domain?: string;
  ai_api_key?: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  social_links: SocialLinks;
  resume_storage_path: string;
  logo_url: string;
  is_under_maintenance?: boolean;
  google_maps_embed_url: string;
  contact_email: string;
  contact_location: string;
  contact_phone?: string;
  resume_contact_details?: {
    name?: string;
    phone?: string;
    email?: string;
    location?: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  company_name: string;
  company_tagline: string;
  profiles?: DomainProfile[];
  resume_custom_titles?: Record<string, string>;
  resume_custom_summaries?: Record<string, string>;
  resume_custom_categories?: Record<string, string>;
  hero_stats: HeroStat[];
  overview_fourth_stat: {
    label: string;
    value: string;
  };
  overview_fifth_stat: {
    label: string;
    value: string;
  };
  overview_sixth_stat: {
    label: string;
    value: string;
  };
}

export interface AnalyticsSummary {
  total_views: number;
  today_views: number;
  top_pages: { page_path: string; count: number }[];
  views_last_7_days: { date: string; count: number }[];
}

export interface DashboardStats {
  total_projects: number;
  total_blogs: number;
  unread_messages: number;
  total_certificates: number;
  total_resume_downloads: number;
  analytics: AnalyticsSummary;
}
