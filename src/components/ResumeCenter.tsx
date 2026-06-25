import React, { useState, useEffect } from 'react';
import { 
  Download, Printer, Copy, Check, Briefcase, FileCode, Search, Award, 
  Database, ShieldAlert, Settings, Eye, EyeOff, Edit3, CheckSquare, 
  Square, RefreshCcw, Type, Sparkles, ChevronRight, CheckCircle, HelpCircle
} from 'lucide-react';
import { SiteSettings, Skill, Experience, Education } from '../types';

interface ResumeCenterProps {
  settings: SiteSettings;
}

type ResumePersona = 'general' | 'seo' | 'data' | 'qa' | 'security';
type ResumeTheme = 'sans' | 'serif' | 'mono';

export default function ResumeCenter({ settings }: ResumeCenterProps) {
  const [selectedPersona, setSelectedPersona] = useState<ResumePersona>('general');
  const [copied, setCopied] = useState(false);
  
  // Customization HUD states
  const [activeTheme, setActiveTheme] = useState<ResumeTheme>('sans');
  const [isEditable, setIsEditable] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(true);
  
  // Section visibility toggles
  const [visibleSections, setVisibleSections] = useState({
    summary: true,
    skills: true,
    experience: true,
    education: true,
  });

  // Excluded individual/category-level skills for custom targeting
  const [disabledSkills, setDisabledSkills] = useState<string[]>([]);

  // Base Personas Data Configuration
  const personaMeta = {
    general: {
      title: 'Full-Stack Developer & Multi-Disciplinary Professional',
      summary: 'Versatile technology professional with hands-on experience spanning Technical SEO, Data Science, Cybersecurity, and Full-Stack Development. Proficient in database layers, automation, and diagnostic systems.',
      icon: FileCode,
      color: 'border-blue-500',
      badgeColor: 'bg-blue-50 border-blue-100 text-blue-700'
    },
    seo: {
      title: 'Technical SEO Executive & Web Analytics Specialist',
      summary: 'Results-driven Technical SEO Auditor and Web Analyst with a proven record of driving 8–9% organic web traffic hikes. Expert in crawl debugs, Core Web Vitals (LCP, FID, CLS), Schema markups, GA4 telemetry, and WordPress optimization.',
      icon: Search,
      color: 'border-indigo-500',
      badgeColor: 'bg-indigo-50 border-indigo-100 text-indigo-700'
    },
    data: {
      title: 'Data Science & Business Intelligence Analyst',
      summary: 'Data-driven analyst with hands-on experience designing machine learning classifications and interactive dashboards. Skilled at EDA, feature engineering, and deploying Random Forest Models yielding 92.57% prediction accuracies.',
      icon: Database,
      color: 'border-emerald-500',
      badgeColor: 'bg-emerald-50 border-emerald-100 text-emerald-700'
    },
    qa: {
      title: 'Automation QA Engineer & Test Infrastructure Architect',
      summary: 'QA professional expert in manual checking and end-to-end automation. Experienced in Selenium WebDriver and PyTest architectures under strict Page Object Model (POM) object-oriented standards.',
      icon: Briefcase,
      color: 'border-amber-500',
      badgeColor: 'bg-amber-50 border-amber-100 text-amber-700'
    },
    security: {
      title: 'Cybersecurity Analyst & Penetration Tester',
      summary: 'Security specialist on Linux systems and Parrot OS. Expert in vulnerability assessments, Wireshark packet capture, Nmap scanning, Burp Suite proxy interceptors, and simulated active defense environments.',
      icon: ShieldAlert,
      color: 'border-rose-500',
      badgeColor: 'bg-rose-50 border-rose-100 text-rose-700'
    }
  };

  // Editable fields local state with fallback sync (loads original values as defaults)
  const [editedName, setEditedName] = useState('RAJAT KUMAR DASH');
  const [editedPhone, setEditedPhone] = useState('+91 8984550754');
  const [editedEmail, setEditedEmail] = useState(settings.contact_email);
  const [editedLocation, setEditedLocation] = useState('New Delhi, India');
  const [editedGithub, setEditedGithub] = useState('github.com/qm-rajat');
  const [editedLinkedin, setEditedLinkedin] = useState('linkedin.com/in/rajatdash-');
  
  // Custom persona titles & summaries (keeps custom edits persistent across toggling)
  const [customTitles, setCustomTitles] = useState<Record<ResumePersona, string>>({
    general: personaMeta.general.title,
    seo: personaMeta.seo.title,
    data: personaMeta.data.title,
    qa: personaMeta.qa.title,
    security: personaMeta.security.title,
  });

  const [customSummaries, setCustomSummaries] = useState<Record<ResumePersona, string>>({
    general: personaMeta.general.summary,
    seo: personaMeta.seo.summary,
    data: personaMeta.data.summary,
    qa: personaMeta.qa.summary,
    security: personaMeta.security.summary,
  });

  // Keep contact details synced with site-wide setup changes
  useEffect(() => {
    setEditedEmail(settings.contact_email);
  }, [settings.contact_email]);

  // Reset function to clear custom overrides
  const handleResetToDefault = () => {
    setEditedName('RAJAT KUMAR DASH');
    setEditedPhone('+91 8984550754');
    setEditedEmail(settings.contact_email);
    setEditedLocation('New Delhi, India');
    setEditedGithub('github.com/qm-rajat');
    setEditedLinkedin('linkedin.com/in/rajatdash-');
    setDisabledSkills([]);
    setCustomTitles({
      general: personaMeta.general.title,
      seo: personaMeta.seo.title,
      data: personaMeta.data.title,
      qa: personaMeta.qa.title,
      security: personaMeta.security.title,
    });
    setCustomSummaries({
      general: personaMeta.general.summary,
      seo: personaMeta.seo.summary,
      data: personaMeta.data.summary,
      qa: personaMeta.qa.summary,
      security: personaMeta.security.summary,
    });
    setActiveTheme('sans');
    setVisibleSections({
      summary: true,
      skills: true,
      experience: true,
      education: true,
    });
  };

  // Filter skills based on persona and exclude the clicked exclusion list
  const getFilteredSkills = (persona: ResumePersona): Skill[] => {
    let baseSkills: Skill[] = [];
    switch (persona) {
      case 'seo':
        baseSkills = settings.skills.filter(s => s.category.includes('SEO') || s.category.includes('Web'));
        break;
      case 'data':
        baseSkills = settings.skills.filter(s => s.category.includes('Data') || s.category.includes('Web'));
        break;
      case 'qa':
        baseSkills = settings.skills.filter(s => s.category.includes('QA') || s.category.includes('Web'));
        break;
      case 'security':
        baseSkills = settings.skills.filter(s => s.category.includes('Cybersecurity') || s.category.includes('QA'));
        break;
      default:
        baseSkills = settings.skills;
        break;
    }

    // Filter out disabled individual values or full empty categories
    return baseSkills.map(categoryObj => ({
      ...categoryObj,
      items: categoryObj.items.filter(item => !disabledSkills.includes(item))
    })).filter(categoryObj => categoryObj.items.length > 0);
  };

  const getFilteredExperience = (persona: ResumePersona): Experience[] => {
    return settings.experience;
  };

  const currentMeta = personaMeta[selectedPersona];
  const activeSkills = getFilteredSkills(selectedPersona);
  const activeExperience = getFilteredExperience(selectedPersona);

  // Toggle active/inactive state of a skill chip
  const handleToggleSkill = (skill: string) => {
    if (disabledSkills.includes(skill)) {
      setDisabledSkills(disabledSkills.filter(s => s !== skill));
    } else {
      setDisabledSkills([...disabledSkills, skill]);
    }
  };

  // Generate copyable markdown text representation of the selected resume
  const getMarkdownText = () => {
    let md = `# ${editedName}\n`;
    md += `Phone: ${editedPhone} | Email: ${editedEmail}\n`;
    md += `Web: ${editedGithub} | LinkedIn: ${editedLinkedin}\n\n`;
    md += `## PROFESSIONAL PROPOSAL: ${customTitles[selectedPersona]}\n`;
    
    if (visibleSections.summary) {
      md += `${customSummaries[selectedPersona]}\n\n`;
    }
    
    if (visibleSections.skills) {
      md += `## TECHNICAL SKILLS\n`;
      activeSkills.forEach(cat => {
        const skillNames = cat.items.map(s => typeof s === 'string' ? s : s.name);
        md += `- **${cat.category}**: ${skillNames.join(', ')}\n`;
      });
      md += `\n`;
    }

    if (visibleSections.experience) {
      md += `## WORK HISTORY\n`;
      activeExperience.forEach(exp => {
        md += `### ${exp.role} | ${exp.company} (${exp.start_date} - ${exp.end_date || 'Present'})\n`;
        md += `${exp.location}\n`;
        md += `${exp.description}\n\n`;
      });
    }

    if (visibleSections.education) {
      md += `## B.TECH EDUCATION\n`;
      settings.education.forEach(edu => {
        md += `- **${edu.degree} in ${edu.field}** (${edu.start_year} - ${edu.end_year || 'Present'})\n`;
        md += `  ${edu.institution} | GPA/Result: ${edu.grade || 'Ongoing'}\n`;
      });
    }

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
      candidate: editedName,
      contact: {
        phone: editedPhone,
        email: editedEmail,
        github: editedGithub,
        linkedin: editedLinkedin,
        location: editedLocation
      },
      selected_persona: selectedPersona,
      persona_title: customTitles[selectedPersona],
      summary_proposal: customSummaries[selectedPersona],
      visible_sections: visibleSections,
      rendered_theme: activeTheme,
      skills: activeSkills,
      experience: activeExperience,
      education: settings.education
    }, null, 2));
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${editedName.replace(/\s+/g, '_')}_Resume_${selectedPersona}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Font family assignments based on activeTheme
  const getThemeFontClass = () => {
    switch (activeTheme) {
      case 'serif':
        return 'font-serif tracking-normal text-slate-900';
      case 'mono':
        return 'font-mono tracking-tight text-slate-955 text-[13px]';
      default:
        return 'font-sans tracking-tight text-slate-900';
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-150 shadow-sm overflow-hidden" id="resume-section">
      
2.      {/* ACTION HEADER BAR */}
      <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-150 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 no-print select-none">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-200/40 text-primary rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-1 shadow-2xs">
            <Sparkles className="w-3 h-3 animate-pulse" />
            Resume Customizer Lab v2.0
          </div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Adaptive Resume Customizer & Export Suite
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Select a target profile, use interactive controls to hide sections or toggle specific skill flags, and customize copy directly in edit mode.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Visibility Config Panel Access Button */}
          <button
            onClick={() => setShowConfigPanel(!showConfigPanel)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl active:scale-95 transition-all flex items-center gap-1.5 shadow-2xs border cursor-pointer ${
              showConfigPanel 
                ? 'bg-slate-800 text-white border-slate-950' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle Customizer Settings Panel"
          >
            <Settings className={`w-3.5 h-3.5 ${showConfigPanel ? 'animate-spin-slow' : ''}`} />
            {showConfigPanel ? 'Hide Controls' : 'Show Designer Hub'}
          </button>

          {/* Inline Edit Switcher */}
          <button
            onClick={() => setIsEditable(!isEditable)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl active:scale-95 transition-all flex items-center gap-1.5 shadow-2xs border cursor-pointer ${
              isEditable 
                ? 'bg-indigo-600 text-white border-indigo-700 ring-4 ring-indigo-500/15' 
                : 'bg-white text-slate-750 border-slate-200 hover:bg-slate-50'
            }`}
            title="Enable/Disable Double Click or Direct Editing on Resume"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditable ? 'Editing Draft Mode' : 'Enable Live Edit'}
          </button>

          {/* Reset button */}
          <button
            onClick={handleResetToDefault}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Restore default layout, values, and full skill definitions"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reset Custom
          </button>

          <span className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Copy markdown text format */}
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Copy ATS-friendly copy-ready markdown text format to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            {copied ? 'Copied MD Code' : 'Copy MD'}
          </button>

          {/* JSON Export */}
          <button
            onClick={handleDownloadJSON}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Download fully structured JSON schema matching HR systems format"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export JSON
          </button>

          {/* Print PDF trigger */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
            title="Print to hardcopy or Save as locally cached PDF document"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* CUSTOMIZATION EXPANSION CONTROLS HUD PANEL */}
      {showConfigPanel && (
        <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-150 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 no-print select-none">
          {/* COLUMN 1: INTERACTIVE TYPOGRAPHY PRESETS */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-primary" />
              Typography Presets
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { type: 'sans', label: 'Neo Sans', desc: 'Inter Clean' },
                { type: 'serif', label: 'Executive', desc: 'Editorial font' },
                { type: 'mono', label: 'Terminal', desc: 'Fira Tech Mono' }
              ].map((style) => (
                <button
                  key={style.type}
                  onClick={() => setActiveTheme(style.type as ResumeTheme)}
                  className={`p-2 border rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    activeTheme === style.type
                      ? 'bg-white border-primary text-slate-900 shadow-2xs font-semibold scale-102 ring-2 ring-blue-500/10'
                      : 'bg-white/40 border-slate-250 text-slate-550 hover:bg-white hover:text-slate-800'
                  }`}
                >
                  <span className="text-xs font-semibold">{style.label}</span>
                  <span className="text-[8px] opacity-70 block">{style.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* COLUMN 2: CUSTOM SECTION TOGGLE VISIBILITY */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              Show/Hide Sections
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { key: 'summary', label: 'Executive Summary', icon: Sparkles },
                { key: 'skills', label: 'Competencies', icon: CodeBlockIcon },
                { key: 'experience', label: 'Milestones', icon: BriefcaseIcon },
                { key: 'education', label: 'Academia', icon: EducationIcon }
              ].map((sect) => {
                const IconComponent = sect.icon;
                const isSelected = (visibleSections as any)[sect.key];
                return (
                  <button
                    key={sect.key}
                    onClick={() => setVisibleSections({
                      ...visibleSections,
                      [sect.key]: !isSelected
                    })}
                    className={`px-3 py-1.5 border rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-indigo-200 text-indigo-950 font-bold shadow-2xs'
                        : 'bg-white/40 border-slate-200 text-slate-400/80 hover:bg-white'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-indigo-500' : 'text-slate-350'}`} />
                    <span className="text-[11px] font-medium">{sect.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLUMN 3: LIVE SKILLS DE-SELECTOR / CUSTOM TARGET FILTER */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-emerald-500" />
                Deselect Skills to Hide from Document
              </label>
              {disabledSkills.length > 0 && (
                <button 
                  onClick={() => setDisabledSkills([])} 
                  className="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCcw className="w-2.5 h-2.5" />
                  Clear Filters ({disabledSkills.length})
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 max-h-[85px] overflow-y-auto bg-white/40 border border-slate-150 p-2 rounded-xl border-dashed">
              {(settings.skills.flatMap(s => s.items)).map((sk, skIdx) => {
                const skName = typeof sk === 'string' ? sk : sk.name;
                const isDisabled = disabledSkills.includes(skName);
                return (
                  <button
                    key={skIdx}
                    onClick={() => handleToggleSkill(skName)}
                    className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                      isDisabled
                        ? 'bg-slate-200/50 border border-slate-300 text-slate-400 line-through scale-95'
                        : 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-150/60 text-emerald-800'
                    }`}
                  >
                    <span className={`w-1 h-1 rounded-full ${isDisabled ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'}`} />
                    {skName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CORE MOCKUP CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[600px] relative">
        {/* Profile Navigator Side-Rail */}
        <div className="lg:col-span-1 p-4 md:p-6 bg-slate-50 border-r border-slate-150 flex flex-row lg:flex-col overflow-x-auto gap-2 scrollbar-none no-print select-none">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 hidden lg:block border-b border-slate-200 pb-1.5">
            1. CHOOSE ROLE TARGET
          </span>
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
                    ? 'bg-white border-primary text-slate-900 shadow-2xs ring-4 ring-blue-500/5 font-bold scale-[1.01]'
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-850 hover:bg-slate-100/70'
                }`}
              >
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${isSelected ? 'bg-primary-light text-primary' : 'bg-slate-100 text-slate-400'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs uppercase tracking-wider font-extrabold truncate">
                  {key === 'general' ? 'Full Stack' : key === 'seo' ? 'Tech SEO' : key.toUpperCase()}
                </div>
              </button>
            );
          })}
          
          <div className="mt-auto pt-6 border-t border-slate-200 hidden lg:block text-slate-400 font-mono text-[9px] leading-relaxed">
            <p className="font-extrabold text-slate-500">PRINT TIP:</p>
            <p>1. Check "Background graphics" & turn on headers in browser parameters.</p>
            <p className="mt-1">2. Use Neo-Sans (sans-serif) for high compatibility ATS readability check.</p>
          </div>
        </div>

        {/* Executive Printed Mockup Sheet */}
        <div className={`lg:col-span-3 p-6 md:p-12 bg-white print-page relative ${getThemeFontClass()} select-text`}>
          
          {/* LIVE CUSTOM EDITOR INDICATOR BADGE */}
          {isEditable && (
            <div className="absolute top-2 right-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-md z-15 select-none no-print">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Double-click texts inside mockup to edit directly
            </div>
          )}

          {/* PRINT-ONLY HEADER INFORMATION BLOCK */}
          <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-4 select-none">
            <h1 className="text-2xl font-black text-slate-950 uppercase tracking-widest">{editedName}</h1>
            <p className="text-xs font-semibold text-slate-650 tracking-wider uppercase mt-1">
              {customTitles[selectedPersona]}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[10px] text-slate-700 font-mono mt-2">
              <span><strong>Phone:</strong> {editedPhone}</span>
              <span>•</span>
              <span><strong>Email:</strong> {editedEmail}</span>
              <span>•</span>
              <span><strong>Location:</strong> {editedLocation}</span>
              <span>•</span>
              <span><strong>GitHub:</strong> {editedGithub}</span>
              <span>•</span>
              <span><strong>LinkedIn:</strong> {editedLinkedin}</span>
            </div>
          </div>

          {/* DESKTOP RESPONSIVE DYNAMIC DISPLAY HEADER */}
          <div className={`border-l-4 pl-4 md:pl-6 ${currentMeta.color} mb-8 print:hidden`}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-1 w-full max-w-sm md:max-w-md lg:max-w-lg">
                {isEditable ? (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest font-black block">INTERACTIVE NAME</span>
                    <input 
                      type="text" 
                      value={editedName} 
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-4xl font-extrabold text-slate-900 tracking-tight bg-slate-50 border border-indigo-200 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    />
                  </div>
                ) : (
                  <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{editedName}</h1>
                )}
                
                {isEditable ? (
                  <div className="space-y-1 pt-1.5">
                    <span className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest font-black block">JOB TITLE TARGET</span>
                    <input 
                      type="text" 
                      value={customTitles[selectedPersona]} 
                      onChange={(e) => setCustomTitles({ ...customTitles, [selectedPersona]: e.target.value })}
                      className="text-primary font-bold text-xs tracking-widest uppercase bg-slate-50 border border-indigo-250 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    />
                  </div>
                ) : (
                  <p className="text-primary font-bold text-xs tracking-widest uppercase">
                    {customTitles[selectedPersona]}
                  </p>
                )}
              </div>

              {/* Contacts Widget details block (Editable inputs vs Styled display) */}
              <div className="text-xs text-slate-500 space-y-1 md:text-right flex-shrink-0">
                {isEditable ? (
                  <div className="space-y-1 border border-indigo-200/50 p-2.5 rounded-xl bg-slate-50 text-left md:text-right no-print">
                    <input 
                      type="text" 
                      value={editedLocation} 
                      onChange={(e) => setEditedLocation(e.target.value)}
                      placeholder="Location"
                      className="border border-slate-200 bg-white px-2 py-0.5 rounded-md text-[10px] w-full focus:ring-1 focus:ring-blue-500" 
                    />
                    <input 
                      type="text" 
                      value={editedPhone} 
                      onChange={(e) => setEditedPhone(e.target.value)}
                      placeholder="Phone"
                      className="border border-slate-200 bg-white px-2 py-0.5 rounded-md text-[10px] w-full focus:ring-1 focus:ring-blue-500" 
                    />
                    <input 
                      type="text" 
                      value={editedEmail} 
                      onChange={(e) => setEditedEmail(e.target.value)}
                      placeholder="Email"
                      className="border border-slate-200 bg-white px-2 py-0.5 rounded-md text-[10px] w-full focus:ring-1 focus:ring-blue-500" 
                    />
                    <input 
                      type="text" 
                      value={editedGithub} 
                      onChange={(e) => setEditedGithub(e.target.value)}
                      placeholder="GitHub Link"
                      className="border border-slate-200 bg-white px-2 py-0.5 rounded-md text-[10px] w-full focus:ring-1 focus:ring-blue-500" 
                    />
                    <input 
                      type="text" 
                      value={editedLinkedin} 
                      onChange={(e) => setEditedLinkedin(e.target.value)}
                      placeholder="LinkedIn Link"
                      className="border border-slate-200 bg-white px-2 py-0.5 rounded-md text-[10px] w-full focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                ) : (
                  <>
                    <p>{editedLocation}</p>
                    <p>{editedPhone}</p>
                    <p className="text-primary font-medium">{editedEmail}</p>
                    <div className="flex items-center gap-2 mt-1 md:justify-end text-[10px] font-semibold text-slate-400 no-print">
                      <a href={`https://${editedGithub}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-all flex items-center gap-1">GITHUB <ChevronRight className="w-2.5 h-2.5" /></a>
                      <span>•</span>
                      <a href={`https://${editedLinkedin}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-all flex items-center gap-1">LINKEDIN <ChevronRight className="w-2.5 h-2.5" /></a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* SECTION: Executive Proposal Summary */}
          {visibleSections.summary && (
            <div className="mb-6 relative group">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2 select-none flex items-center justify-between">
                Executive Profile Summary
                {isEditable && <span className="text-[8px] font-mono font-bold text-indigo-500">EDITABLE SECTION</span>}
              </h4>
              {isEditable ? (
                <textarea 
                  value={customSummaries[selectedPersona]}
                  onChange={(e) => setCustomSummaries({ ...customSummaries, [selectedPersona]: e.target.value })}
                  className="text-xs text-slate-650 bg-slate-50 border border-indigo-250 rounded-xl px-3 py-2 w-full min-h-[100px] font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                  placeholder="Insert custom summary proposal details..."
                />
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                  {customSummaries[selectedPersona]}
                </p>
              )}
            </div>
          )}

          {/* SECTION: Core Competencies Skills list */}
          {visibleSections.skills && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2.5 select-none">
                Core Tech Competencies & Stack Matrix
              </h4>
              <div className="space-y-1.5 print:space-y-1 font-sans">
                {activeSkills.map((cat, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-1.5 md:gap-4 border-l border-slate-100 pl-2.5">
                    <span className="text-[11px] font-bold text-slate-600/90 tracking-wide translate-y-0.5">{cat.category}:</span>
                    <div className="col-span-3 flex flex-wrap gap-1 md:gap-1.5">
                      {cat.items.map((skill, sIdx) => {
                        const skillName = typeof skill === 'string' ? skill : skill.name;
                        const isDeselected = disabledSkills.includes(skillName);
                        return (
                          <span 
                            key={sIdx} 
                            onClick={() => isEditable && handleToggleSkill(skillName)}
                            className={`text-[10px] px-2 py-0.5 rounded-md transition-all ${
                              isDeselected 
                                ? 'hidden' 
                                : 'text-slate-800 bg-slate-50 border border-slate-150/40 font-mono print:bg-white print:border-none print:px-0 print:py-0 print:mr-1 cursor-pointer'
                            }`}
                            title={isEditable ? "Click to toggle hide style" : ""}
                          >
                            {skillName}{sIdx < cat.items.length - 1 ? ',' : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: Experience Milestones */}
          {visibleSections.experience && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-3.5 select-none">
                Core Accomplishments & Employment History
              </h4>
              <div className="space-y-5 print:space-y-3 font-sans">
                {activeExperience.map((exp, idx) => (
                  <div key={idx} className="relative group pl-3.5 border-l-2 border-slate-100 hover:border-slate-350 transition-colors">
                    <div className="absolute w-2 h-2 rounded-full bg-slate-200 group-hover:bg-primary -left-[5px] top-1.5 transition-colors border border-white" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 tracking-tight">{exp.role}</span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-50 border border-slate-100 rounded-md px-2 py-0.5 group-hover:border-slate-300 transition-colors print:border-none">
                        {exp.start_date} – {exp.end_date || 'Present'}
                      </span>
                    </div>
                    
                    <div className="text-[10px] text-primary font-bold mt-0.5 flex items-center gap-1">
                      <span>{exp.company}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400 font-normal">{exp.location}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: Academic Background timeline */}
          {visibleSections.education && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-4 select-none">
                Academic Accreditations & Baseline
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                {settings.education.map((edu, idx) => (
                  <div key={idx} className="bg-slate-50/50 p-3.5 rounded-2xl border border-slate-150/40 relative hover:border-slate-250 transition-all cursor-help print:bg-white print:border-none print:p-0">
                    <div className="text-xs font-extrabold text-slate-800">{edu.degree} inside {edu.field}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{edu.institution}</div>
                    <div className="flex items-center justify-between mt-3 text-[10px]">
                      <span className="text-primary font-black bg-blue-50/50 px-2 py-0.5 border border-blue-200/30 rounded-md print:bg-white print:border-none print:px-0">Value: {edu.grade || 'Validated'}</span>
                      <span className="text-slate-400 font-bold font-mono">{edu.start_year} – {edu.end_year || 'Ongoing'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple fallback mock icon markers
function CodeBlockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function EducationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}
