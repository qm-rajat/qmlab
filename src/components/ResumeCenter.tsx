import React, { useState } from 'react';
import { Download, Printer, Copy, Check, Briefcase, FileCode, Search, Award, Database, ShieldAlert } from 'lucide-react';
import { SiteSettings, Skill, Experience, Education } from '../types';

interface ResumeCenterProps {
  settings: SiteSettings;
}

type ResumePersona = 'general' | 'seo' | 'data' | 'qa' | 'security';

export default function ResumeCenter({ settings }: ResumeCenterProps) {
  const [selectedPersona, setSelectedPersona] = useState<ResumePersona>('general');
  const [copied, setCopied] = useState(false);

  // Resume Titles & Taglines for different profiles
  const personaMeta = {
    general: {
      title: 'Full-Stack Developer & Multi-Disciplinary Professional',
      summary: 'Versatile technology professional with hands-on experience spanning Technical SEO, Data Science, Cybersecurity, and Full-Stack Development. Proficient in database layers, automation, and diagnostic systems.',
      icon: FileCode,
      color: 'border-blue-500'
    },
    seo: {
      title: 'Technical SEO Executive & Web Analytics Specialist',
      summary: 'Results-driven Technical SEO Auditor and Web Analyst with a proven record of driving 8–9% organic web traffic hikes. Expert in crawl debugs, Core Web Vitals (LCP, FID, CLS), Schema markups, GA4 telemetry, and WordPress optimization.',
      icon: Search,
      color: 'border-indigo-500'
    },
    data: {
      title: 'Data Science & Business Intelligence Analyst',
      summary: 'Data-driven analyst with hands-on experience designing machine learning classifications and interactive dashboards. Skilled at EDA, feature engineering, and deploying Random Forest Models yielding 92.57% prediction accuracies.',
      icon: Database,
      color: 'border-emerald-500'
    },
    qa: {
      title: 'Automation QA Engineer & Test Infrastructure Architect',
      summary: 'QA professional expert in manual checking and end-to-end automation. Experienced in Selenium WebDriver and PyTest architectures under strict Page Object Model (POM) object-oriented standards.',
      icon: Briefcase,
      color: 'border-amber-500'
    },
    security: {
      title: 'Cybersecurity Analyst & Penetration Tester',
      summary: 'Security specialist on Linux systems and Parrot OS. Expert in vulnerability assessments, Wireshark packet capture, Nmap scanning, Burp Suite proxy interceptors, and simulated active defense environments.',
      icon: ShieldAlert,
      color: 'border-rose-500'
    }
  };

  // Filter skills specifically based on the persona
  const getFilteredSkills = (persona: ResumePersona): Skill[] => {
    switch (persona) {
      case 'seo':
        return settings.skills.filter(s => s.category.includes('SEO') || s.category.includes('Web'));
      case 'data':
        return settings.skills.filter(s => s.category.includes('Data') || s.category.includes('Web'));
      case 'qa':
        return settings.skills.filter(s => s.category.includes('QA') || s.category.includes('Web'));
      case 'security':
        return settings.skills.filter(s => s.category.includes('Cybersecurity') || s.category.includes('QA'));
      default:
        return settings.skills;
    }
  };

  // Filter experience highlights specifically for the selected persona
  const getFilteredExperience = (persona: ResumePersona): Experience[] => {
    if (persona === 'general') return settings.experience;
    
    // We can highlight specific responsibilities or sort experiences
    return settings.experience;
  };

  const currentMeta = personaMeta[selectedPersona];
  const activeSkills = getFilteredSkills(selectedPersona);
  const activeExperience = getFilteredExperience(selectedPersona);

  // Generate copyable markdown representation of the selected resume
  const getMarkdownText = () => {
    let md = `# RAJAT KUMAR DASH\n`;
    md += `Phone: +91 8984550754 | Email: ${settings.contact_email}\n`;
    md += `Web: ${settings.social_links.github} | LinkedIn: ${settings.social_links.linkedin}\n\n`;
    md += `## PROFESSIONAL PROPOSAL: ${currentMeta.title}\n`;
    md += `${currentMeta.summary}\n\n`;
    
    md += `## TECHNICAL SKILLS\n`;
    activeSkills.forEach(cat => {
      md += `- **${cat.category}**: ${cat.items.join(', ')}\n`;
    });
    md += `\n`;

    md += `## WORK HISTORY\n`;
    activeExperience.forEach(exp => {
      md += `### ${exp.role} | ${exp.company} (${exp.start_date} - ${exp.end_date || 'Present'})\n`;
      md += `${exp.location}\n`;
      md += `${exp.description}\n\n`;
    });

    md += `## B.TECH EDUCATION\n`;
    settings.education.forEach(edu => {
      md += `- **${edu.degree} in ${edu.field}** (${edu.start_year} - ${edu.end_year || 'Present'})\n`;
      md += `  ${edu.institution} | GPA/Result: ${edu.grade || 'Ongoing'}\n`;
    });

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getMarkdownText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      candidate: "Rajat Kumar Dash",
      contact: {
        phone: "+91 8984550754",
        email: settings.contact_email,
        github: settings.social_links.github,
        linkedin: settings.social_links.linkedin
      },
      persona: currentMeta.title,
      summary: currentMeta.summary,
      skills: activeSkills,
      experience: activeExperience,
      education: settings.education
    }, null, 2));
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Rajat_Dash_Resume_${selectedPersona}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden" id="resume-section">
      {/* Action panel has borders styled in logo gradient color scheme */}
      <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 no-print">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            Resume Customizer & Download Center
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Choose a professional profile persona below to tailor Rajat's experience for matching requirements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Copy ATS-friendly text format"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 animate-scale" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>
          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Download formatted JSON structure"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Download JSON
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
            title="Print to hardcopy or Save as local PDF file"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[600px]">
        {/* Profile Navigator */}
        <div className="lg:col-span-1 p-4 md:p-6 bg-slate-50/50 border-r border-slate-100 flex flex-row lg:flex-col overflow-x-auto gap-2 scrollbar-none no-print">
          {(Object.keys(personaMeta) as ResumePersona[]).map((key) => {
            const meta = personaMeta[key];
            const Icon = meta.icon;
            const isSelected = selectedPersona === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedPersona(key)}
                className={`flex-shrink-0 flex items-center lg:w-full gap-3 px-4 py-3 text-left rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-primary text-slate-900 shadow-xs ring-4 ring-blue-500/5 font-semibold'
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-primary-light text-primary' : 'bg-slate-100 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="hidden sm:block lg:block text-xs uppercase tracking-wider">
                  {key === 'general' ? 'Full-Stack' : key.toUpperCase()}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Executive Sheet Mockup */}
        <div className="lg:col-span-3 p-6 md:p-10 bg-white print-page">
          <div className={`border-l-4 pl-4 md:pl-6 ${currentMeta.color} mb-8`}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">RAJAT KUMAR DASH</h1>
                <p className="text-primary font-bold text-sm tracking-widest uppercase mt-1">
                  {currentMeta.title}
                </p>
              </div>
              <div className="text-xs text-slate-500 space-y-1 md:text-right no-print">
                <p>New Delhi, India</p>
                <p>+91 8984550754</p>
                <p className="text-primary font-medium">{settings.contact_email}</p>
                <div className="flex items-center gap-2 mt-1 md:justify-end">
                  <a href={settings.social_links.github} target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a>
                  <span>•</span>
                  <a href={settings.social_links.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary">LinkedIn</a>
                </div>
              </div>
              {/* Printed Header contact info */}
              <div className="hidden print-only text-xs text-slate-800 grid grid-cols-2 gap-x-6 gap-y-1 w-full border-t border-slate-100 pt-3">
                <p><strong>Email:</strong> {settings.contact_email}</p>
                <p><strong>Phone:</strong> +91 8984550754</p>
                <p><strong>GitHub:</strong> github.com/qm-rajat</p>
                <p><strong>LinkedIn:</strong> linkedin.com/in/rajatdash-</p>
                <p><strong>Location:</strong> Delhi NCR, India</p>
              </div>
            </div>
          </div>

          {/* Section: Executive Summary */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2">
              Executive Proposal
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {currentMeta.summary}
            </p>
          </div>

          {/* Section: Skills Stack */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2">
              Core Competencies
            </h4>
            <div className="space-y-2.5">
              {activeSkills.map((cat, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-1">
                  <span className="text-xs font-bold text-slate-600 col-span-1">{cat.category}:</span>
                  <div className="col-span-3 flex flex-wrap gap-1.5">
                    {cat.items.map((skill, sIdx) => (
                      <span key={sIdx} className="text-xs text-slate-700 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md print:bg-white print:border-none print:px-0">
                        {skill}{sIdx < cat.items.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Experience History */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-3">
              Professional Milestones
            </h4>
            <div className="space-y-4">
              {activeExperience.map((exp, idx) => {
                // Determine if we should customize details based on persona
                return (
                  <div key={idx} className="relative group">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-bold text-slate-800">{exp.role}</span>
                      <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 rounded-md px-2 py-0.5 print:border-none">
                        {exp.start_date} – {exp.end_date || 'Present'}
                      </span>
                    </div>
                    <div className="text-xs text-primary font-medium mt-0.5">
                      {exp.company} <span className="text-slate-400">• {exp.location}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Academic Background */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-3">
              Academic Background
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.education.map((edu, idx) => (
                <div key={idx} className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 print:bg-white print:border-none print:p-0">
                  <div className="text-xs font-bold text-slate-800">{edu.degree} inside {edu.field}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{edu.institution}</div>
                  <div className="flex items-center justify-between mt-2 text-[10px]">
                    <span className="text-primary font-semibold">Value: {edu.grade || 'Validated'}</span>
                    <span className="text-slate-400 font-medium">{edu.start_year} – {edu.end_year || 'Ongoing'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
