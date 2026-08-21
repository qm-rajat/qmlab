import { Code2, Search, Database, Briefcase, ShieldAlert } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { SiteSettings, Project, Certificate } from '../../types';

export type ResumePersona = 'general' | 'seo' | 'data' | 'qa' | 'security';
export type ResumeTheme = 'sans' | 'serif' | 'mono';
export type ResumeAccent = 'blue' | 'indigo' | 'emerald' | 'slate';

export interface PersonaMetadata {
  title: string;
  summary: string;
  icon: LucideIcon;
  accentColor: string;
  badgeColor: string;
}

export const PERSONA_META: Record<ResumePersona, PersonaMetadata> = {
  general: {
    title: 'Full-Stack Developer & Multi-Disciplinary Engineer',
    summary: 'High-performing Software Engineer and Computer Science graduate specializing in modern React/Next.js architectures, TypeScript, Node.js API services, and Technical SEO infrastructure. Proven background in architecting end-to-end applications, real-time analytics pipelines, and automated test environments that drive quantifiable business growth and optimal Core Web Vitals.',
    icon: Code2,
    accentColor: 'border-blue-600 text-blue-600',
    badgeColor: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  seo: {
    title: 'Technical SEO Specialist & Web Analytics Engineer',
    summary: 'Results-driven Technical SEO Auditor and Web Analyst with a proven record of driving 8–9% organic web traffic hikes across fintech, relocation, and travel niches. Expert in crawl error debugging, Core Web Vitals optimization (LCP, INP, CLS), JSON-LD Schema markups, GA4 telemetry, sitemap architecture, and high-performance WordPress CMS infrastructure.',
    icon: Search,
    accentColor: 'border-indigo-600 text-indigo-600',
    badgeColor: 'bg-indigo-50 border-indigo-200 text-indigo-700'
  },
  data: {
    title: 'Data Science & Machine Learning Analyst',
    summary: 'Analytical Data Scientist with hands-on experience designing machine learning classification pipelines and interactive business intelligence dashboards. Skilled in exploratory data analysis (EDA), statistical feature engineering, and deploying Random Forest, SVM, and KNN classifiers delivering up to 92.57% prediction accuracy on multi-variable diagnostic datasets.',
    icon: Database,
    accentColor: 'border-emerald-600 text-emerald-600',
    badgeColor: 'bg-emerald-50 border-emerald-200 text-emerald-700'
  },
  qa: {
    title: 'QA Automation Engineer & SDET Specialist',
    summary: 'Software Development Engineer in Test (SDET) proficient in building scalable automated testing frameworks. Expert in Selenium WebDriver and PyTest architectures implementing Page Object Model (POM) standards, automated web scrapers, REST API validation, and continuous quality assurance pipelines.',
    icon: Briefcase,
    accentColor: 'border-amber-600 text-amber-600',
    badgeColor: 'bg-amber-50 border-amber-200 text-amber-700'
  },
  security: {
    title: 'Cybersecurity Analyst & Systems Auditor',
    summary: 'Hands-on Security Specialist proficient in Linux and Parrot OS security distributions. Experienced in vulnerability assessments, Wireshark network packet inspection, Nmap network mapping, Burp Suite proxy interceptors, OWASP Top 10 mitigation, and active system hardening across cloud environments.',
    icon: ShieldAlert,
    accentColor: 'border-rose-600 text-rose-600',
    badgeColor: 'bg-rose-50 border-rose-200 text-rose-700'
  }
};

export interface VisibleSections {
  summary: boolean;
  skills: boolean;
  experience: boolean;
  projects: boolean;
  education: boolean;
  certificates: boolean;
}

export interface EditableContactDetails {
  name: string;
  phone: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
  portfolio: string;
}

export interface ResumeCenterProps {
  settings: SiteSettings;
  projects?: Project[];
  certificates?: Certificate[];
}
