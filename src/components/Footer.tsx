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
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Explore Map
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home Page', value: 'home' },
                { label: 'Projects Gallery', value: 'projects' },
                { label: 'Technical Blogs', value: 'blog' },
                { label: 'Certifications', value: 'certificates' },
                { label: 'Get In Touch', value: 'contact' },
              ].map((link) => (
                <li key={link.value}>
                  <button
                    onClick={() => {
                      onViewChange(link.value);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-sm text-slate-500 hover:text-primary tracking-wide text-left cursor-pointer transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Career focus info */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Core Specialty
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 tracking-wide">
              <li>• Technical SEO & Audits</li>
              <li>• Core Web Vitals Refactoring</li>
              <li>• Selenium Web Automation</li>
              <li>• Predictive Health Analytics</li>
              <li>• Simulated Network Defense</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright details */}
        <div className="border-t border-slate-200/50 pt-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <p className="text-xs text-slate-400 tracking-wide">
            &copy; {currentYear} Rajat Kumar Dash. All rights reserved. Powered by React, Tailwind CSS, & QM LABS.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                onViewChange('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-slate-400 hover:text-primary transition-colors cursor-pointer"
            >
              Console Login
            </button>
            <span className="text-slate-200">|</span>
            <button
              onClick={handleBackToTop}
              className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center"
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
