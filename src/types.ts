export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];         // array of image URLs
  technologies: string[];
  github_url?: string;
  live_url?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  project_type?: 'company' | 'portfolio' | 'both';
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
  credential_id?: string;
  verify_url?: string;
  image_url?: string;
  category: 'cybersecurity' | 'web-development' | 'data-science' |
            'machine-learning' | 'seo-digital-marketing' | 'cloud' | 'other';
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  ip_hash?: string;
  created_at: string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  estimated_value?: string;
}

export interface SkillItem {
  name: string;
  proficiency?: number;  // 1 to 5
}

export interface Skill {
  category: string;      // e.g. "Web Development"
  items: (string | SkillItem)[];       // e.g. ["Next.js", { name: "React", proficiency: 5 }]
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

export interface CompanyService {
  title: string;
  description: string;
  icon_name: string;
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
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  social_links: SocialLinks;
  resume_storage_path: string;
  logo_url: string;
  google_maps_embed_url: string;
  contact_email: string;
  company_name: string;
  company_tagline: string;
  company_bio: string;
  company_about_html: string;
  company_services?: CompanyService[];
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
