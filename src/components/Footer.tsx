import React from 'react';
import { Github, Linkedin, Twitter, Instagram, ArrowUp, Briefcase } from 'lucide-react';
import QMLogo from './QMLogo';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onViewChange: (view: string) => void;
}

export default function Footer({ settings, onViewChange }: FooterProps) {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-100 py-16 px-4 sm:px-6 lg:px-8 mt-auto no-print">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 mb-12">
          {/* Logo & Manifesto Column */}
          <div className="md:col-span-2 space-y-4 flex flex-col items-start text-left">
            <QMLogo size="md" interactive={true} />
            <p className="text-sm text-slate-500 max-w-sm ml-1">
              {settings.hero_bio}
            </p>
            {/* Social Coordinates */}
            <div className="flex items-center gap-3 ml-1">
              <a
                href={settings.social_links.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white hover:bg-primary hover:text-white border border-slate-200 text-slate-500 rounded-xl transition-all shadow-xs"
                title="View GitHub source code repositories"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={settings.social_links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white hover:bg-primary hover:text-white border border-slate-200 text-slate-500 rounded-xl transition-all shadow-xs"
                title="Connect on professional LinkedIn circles"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={settings.social_links.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white hover:bg-primary hover:text-white border border-slate-200 text-slate-500 rounded-xl transition-all shadow-xs"
                title="Follow Twitter/X profiles"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={settings.social_links.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white hover:bg-primary hover:text-white border border-slate-200 text-slate-500 rounded-xl transition-all shadow-xs"
                title="Connect on Instagram channels"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Directory Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-4">
              Explore Map
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home Page', value: 'home' },
                { label: 'Services & Packages', value: 'services' },
                { label: 'Projects Gallery', value: 'projects' },
                { label: 'Technical Blogs', value: 'blog' },
                { label: 'Certifications', value: 'certificates' },
                { label: 'Interactive Resume', value: 'resume' },
                { label: 'Get In Touch', value: 'contact' },
              ].map((link) => (
                <li key={link.value}>
                  <button
                    onClick={() => {
                      onViewChange(link.value);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-sm text-slate-600 hover:text-primary tracking-wide text-left cursor-pointer transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Career focus info */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-4">
              Core Specialty & Portals
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 tracking-wide">
              <li>• Technical SEO & AEO Audits</li>
              <li>• AI Agents & MCP Server Architecture</li>
              <li>• Full-Stack Web Development</li>
              <li>• Core Web Vitals Refactoring</li>
              <li>• Cloud Architecture & DevOps</li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-200">
              <a
                href="https://rajat.qmlab.in"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Founder CV: rajat.qmlab.in ↗
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright details */}
        <div className="border-t border-slate-200/80 pt-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <p className="text-xs text-slate-500 tracking-tight sm:tracking-normal inline-flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>© {currentYear} <strong className="font-semibold text-slate-700">Rajat Kumar Dash</strong>. All rights reserved.</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50/80 border border-blue-100 text-slate-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shadow-sm" />
              Powered by QM LABS
            </span>
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                onViewChange('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-slate-600 hover:text-primary transition-colors cursor-pointer"
            >
              Console Login
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={handleBackToTop}
              className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              title="Scroll back to top of the page"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
