import React, { useState, useEffect } from 'react';
import { 
  ResumePersona, ResumeTheme, ResumeAccent, VisibleSections, 
  EditableContactDetails, PERSONA_META, ResumeCenterProps 
} from './resume/resumeTypes';
import { ResumeHeaderControls } from './resume/ResumeHeaderControls';
import { ResumeConfigPanel } from './resume/ResumeConfigPanel';
import { ResumeDocumentView } from './resume/ResumeDocumentView';
import { Skill, Project } from '../types';

export default function ResumeCenter({ settings, projects = [], certificates = [] }: ResumeCenterProps) {
  const [selectedPersona, setSelectedPersona] = useState<ResumePersona>('general');
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  
  // Customization HUD states
  const [activeTheme, setActiveTheme] = useState<ResumeTheme>('sans');
  const [activeAccent, setActiveAccent] = useState<ResumeAccent>('blue');
  const [isEditable, setIsEditable] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  
  // Section visibility toggles
  const [visibleSections, setVisibleSections] = useState<VisibleSections>({
    summary: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
    certificates: true,
  });

  // Excluded individual/category-level skills for custom targeting
  const [disabledSkills, setDisabledSkills] = useState<string[]>([]);

  // Editable contact details
  const [contactDetails, setContactDetails] = useState<EditableContactDetails>({
    name: settings.hero_name || 'Rajat Kumar Dash',
    phone: '+91 8984550754',
    email: settings.contact_email || 'rajat.pilgrimpackages@gmail.com',
    location: 'New Delhi, India',
    github: 'github.com/qm-rajat',
    linkedin: 'linkedin.com/in/rajatdash-',
    portfolio: 'rajatkumar.dev',
  });
  
  // Custom persona titles & summaries
  const [customTitles, setCustomTitles] = useState<Record<ResumePersona, string>>({
    general: PERSONA_META.general.title,
    seo: PERSONA_META.seo.title,
    data: PERSONA_META.data.title,
    qa: PERSONA_META.qa.title,
    security: PERSONA_META.security.title,
  });

  const [customSummaries, setCustomSummaries] = useState<Record<ResumePersona, string>>({
    general: PERSONA_META.general.summary,
    seo: PERSONA_META.seo.summary,
    data: PERSONA_META.data.summary,
    qa: PERSONA_META.qa.summary,
    security: PERSONA_META.security.summary,
  });

  // Keep contact details synced with site-wide setup changes
  useEffect(() => {
    setContactDetails(prev => ({
      ...prev,
      name: settings.hero_name || prev.name,
      email: settings.contact_email || prev.email,
    }));
  }, [settings.hero_name, settings.contact_email]);

  // Reset function to clear custom overrides
  const handleResetToDefault = () => {
    setContactDetails({
      name: settings.hero_name || 'Rajat Kumar Dash',
      phone: '+91 8984550754',
      email: settings.contact_email || 'rajat.pilgrimpackages@gmail.com',
      location: 'New Delhi, India',
      github: 'github.com/qm-rajat',
      linkedin: 'linkedin.com/in/rajatdash-',
      portfolio: 'rajatkumar.dev',
    });
    setDisabledSkills([]);
    setCustomTitles({
      general: PERSONA_META.general.title,
      seo: PERSONA_META.seo.title,
      data: PERSONA_META.data.title,
      qa: PERSONA_META.qa.title,
      security: PERSONA_META.security.title,
    });
    setCustomSummaries({
      general: PERSONA_META.general.summary,
      seo: PERSONA_META.seo.summary,
      data: PERSONA_META.data.summary,
      qa: PERSONA_META.qa.summary,
      security: PERSONA_META.security.summary,
    });
    setActiveTheme('sans');
    setActiveAccent('blue');
    setVisibleSections({
      summary: true,
      skills: true,
      experience: true,
      projects: true,
      education: true,
      certificates: true,
    });
  };

  // Filter skills based on persona and exclude disabled skills
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

    return baseSkills.map(categoryObj => ({
      ...categoryObj,
      items: categoryObj.items.filter(item => {
        const name = typeof item === 'string' ? item : item.name;
        return !disabledSkills.includes(name);
      })
    })).filter(categoryObj => categoryObj.items.length > 0);
  };

  // Filter projects by relevance
  const getFilteredProjects = (persona: ResumePersona): Project[] => {
    if (!projects || projects.length === 0) return [];
    switch (persona) {
      case 'seo':
        return projects.filter(p => p.technologies?.some(t => t.toLowerCase().includes('seo') || t.toLowerCase().includes('analytics') || t.toLowerCase().includes('wordpress')) || p.title.toLowerCase().includes('seo')).slice(0, 3);
      case 'data':
        return projects.filter(p => p.technologies?.some(t => t.toLowerCase().includes('python') || t.toLowerCase().includes('data') || t.toLowerCase().includes('machine') || t.toLowerCase().includes('sql')) || p.title.toLowerCase().includes('ml') || p.title.toLowerCase().includes('data')).slice(0, 3);
      case 'qa':
        return projects.filter(p => p.technologies?.some(t => t.toLowerCase().includes('selenium') || t.toLowerCase().includes('pytest') || t.toLowerCase().includes('test') || t.toLowerCase().includes('automation'))).slice(0, 3);
      case 'security':
        return projects.filter(p => p.technologies?.some(t => t.toLowerCase().includes('security') || t.toLowerCase().includes('linux') || t.toLowerCase().includes('wireshark') || t.toLowerCase().includes('network'))).slice(0, 3);
      default:
        return projects.slice(0, 3);
    }
  };

  const activeSkills = getFilteredSkills(selectedPersona);
  const activeExperience = settings.experience || [];
  const activeProjects = getFilteredProjects(selectedPersona);
  const activeCertificates = certificates.slice(0, 4);

  // Toggle active/inactive state of a skill chip
  const handleToggleSkill = (skill: string) => {
    if (disabledSkills.includes(skill)) {
      setDisabledSkills(disabledSkills.filter(s => s !== skill));
    } else {
      setDisabledSkills([...disabledSkills, skill]);
    }
  };

  // Calculate ATS Compatibility Score
  const calculateAtsScore = () => {
    let score = 70;
    if (visibleSections.summary && customSummaries[selectedPersona].length > 50) score += 6;
    if (visibleSections.skills && activeSkills.length >= 3) score += 8;
    if (visibleSections.experience && activeExperience.length >= 2) score += 8;
    if (visibleSections.education) score += 4;
    if (contactDetails.email && contactDetails.phone && contactDetails.linkedin) score += 4;
    return Math.min(score, 98);
  };

  // Generate copyable markdown text representation
  const getMarkdownText = () => {
    let md = `# ${contactDetails.name.toUpperCase()}\n`;
    md += `${customTitles[selectedPersona]}\n\n`;
    md += `📍 ${contactDetails.location} | 📞 ${contactDetails.phone} | ✉️ ${contactDetails.email}\n`;
    md += `🔗 Portfolio: https://${contactDetails.portfolio} | GitHub: https://${contactDetails.github} | LinkedIn: https://${contactDetails.linkedin}\n\n`;
    
    if (visibleSections.summary) {
      md += `## PROFESSIONAL SUMMARY\n`;
      md += `${customSummaries[selectedPersona]}\n\n`;
    }
    
    if (visibleSections.skills) {
      md += `## TECHNICAL COMPETENCIES\n`;
      activeSkills.forEach(cat => {
        const skillNames = cat.items.map(s => typeof s === 'string' ? s : s.name);
        md += `- **${cat.category}**: ${skillNames.join(', ')}\n`;
      });
      md += `\n`;
    }

    if (visibleSections.experience) {
      md += `## PROFESSIONAL EXPERIENCE\n`;
      activeExperience.forEach(exp => {
        md += `### ${exp.role} | ${exp.company} (${exp.start_date} – ${exp.end_date || 'Present'})\n`;
        md += `*${exp.location}*\n`;
        md += `${exp.description}\n\n`;
      });
    }

    if (visibleSections.projects && activeProjects.length > 0) {
      md += `## NOTABLE PROJECTS\n`;
      activeProjects.forEach(proj => {
        md += `### ${proj.title}\n`;
        md += `${proj.description}\n`;
        if (proj.technologies && proj.technologies.length > 0) {
          md += `*Technologies: ${proj.technologies.join(', ')}*\n\n`;
        }
      });
    }

    if (visibleSections.education) {
      md += `## EDUCATION\n`;
      settings.education.forEach(edu => {
        md += `- **${edu.degree} in ${edu.field}** | ${edu.institution} (${edu.start_year} – ${edu.end_year || 'Present'})\n`;
        if (edu.grade) md += `  Grade / Status: ${edu.grade}\n`;
      });
      md += `\n`;
    }

    if (visibleSections.certificates && activeCertificates.length > 0) {
      md += `## CERTIFICATIONS\n`;
      activeCertificates.forEach(cert => {
        md += `- **${cert.title}** - ${cert.issuer} (${cert.issue_date})\n`;
      });
    }

    return md;
  };

  // Generate plain text format
  const getPlainText = () => {
    let txt = `${contactDetails.name.toUpperCase()}\n`;
    txt += `${customTitles[selectedPersona]}\n`;
    txt += `Email: ${contactDetails.email} | Phone: ${contactDetails.phone} | Location: ${contactDetails.location}\n`;
    txt += `GitHub: https://${contactDetails.github} | LinkedIn: https://${contactDetails.linkedin}\n\n`;
    
    if (visibleSections.summary) {
      txt += `SUMMARY\n----------------------------------------\n`;
      txt += `${customSummaries[selectedPersona]}\n\n`;
    }

    if (visibleSections.skills) {
      txt += `TECHNICAL SKILLS\n----------------------------------------\n`;
      activeSkills.forEach(cat => {
        const skillNames = cat.items.map(s => typeof s === 'string' ? s : s.name);
        txt += `${cat.category}: ${skillNames.join(', ')}\n`;
      });
      txt += `\n`;
    }

    if (visibleSections.experience) {
      txt += `EXPERIENCE\n----------------------------------------\n`;
      activeExperience.forEach(exp => {
        txt += `${exp.role.toUpperCase()}\n${exp.company} - ${exp.location} (${exp.start_date} - ${exp.end_date || 'Present'})\n`;
        txt += `${exp.description}\n\n`;
      });
    }

    if (visibleSections.education) {
      txt += `EDUCATION\n----------------------------------------\n`;
      settings.education.forEach(edu => {
        txt += `${edu.degree} in ${edu.field} | ${edu.institution} (${edu.start_year} - ${edu.end_year || 'Present'})\n`;
      });
    }

    return txt;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(getMarkdownText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadTxt = () => {
    const textData = getPlainText();
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `${contactDetails.name.replace(/\s+/g, '_')}_Resume.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2200);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      candidate: contactDetails.name,
      contact: {
        phone: contactDetails.phone,
        email: contactDetails.email,
        github: contactDetails.github,
        linkedin: contactDetails.linkedin,
        portfolio: contactDetails.portfolio,
        location: contactDetails.location
      },
      selected_persona: selectedPersona,
      persona_title: customTitles[selectedPersona],
      summary_proposal: customSummaries[selectedPersona],
      visible_sections: visibleSections,
      rendered_theme: activeTheme,
      skills: activeSkills,
      experience: activeExperience,
      projects: activeProjects,
      education: settings.education,
      certificates: activeCertificates
    }, null, 2));
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${contactDetails.name.replace(/\s+/g, '_')}_Resume_${selectedPersona}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const atsScore = calculateAtsScore();

  return (
    <div className="space-y-6 max-w-6xl mx-auto" id="resume-hub-root">
      {/* 1. TOP CONTROL BAR */}
      <ResumeHeaderControls
        atsScore={atsScore}
        selectedPersona={selectedPersona}
        onSelectPersona={setSelectedPersona}
        showConfigPanel={showConfigPanel}
        onToggleConfigPanel={() => setShowConfigPanel(!showConfigPanel)}
        isEditable={isEditable}
        onToggleEditable={() => setIsEditable(!isEditable)}
        copied={copied}
        copiedText={copiedText}
        onCopyMarkdown={handleCopyMarkdown}
        onDownloadTxt={handleDownloadTxt}
        onDownloadJSON={handleDownloadJSON}
        onPrint={handlePrint}
      />

      {/* 2. CUSTOMIZER HUD CONFIGURATION PANEL */}
      {showConfigPanel && (
        <ResumeConfigPanel
          settings={settings}
          activeTheme={activeTheme}
          onSelectTheme={setActiveTheme}
          activeAccent={activeAccent}
          onSelectAccent={setActiveAccent}
          visibleSections={visibleSections}
          onToggleSection={(key) => setVisibleSections({ ...visibleSections, [key]: !visibleSections[key] })}
          disabledSkills={disabledSkills}
          onToggleSkill={handleToggleSkill}
          onRestoreAllSkills={() => setDisabledSkills([])}
          onResetToDefault={handleResetToDefault}
        />
      )}

      {/* 3. THE INTERACTIVE RESUME PREVIEW SHEET */}
      <ResumeDocumentView
        isEditable={isEditable}
        onExitEdit={() => setIsEditable(false)}
        activeTheme={activeTheme}
        activeAccent={activeAccent}
        selectedPersona={selectedPersona}
        contactDetails={contactDetails}
        onUpdateContactDetails={(partial) => setContactDetails(prev => ({ ...prev, ...partial }))}
        customTitles={customTitles}
        onUpdateCustomTitle={(persona, title) => setCustomTitles(prev => ({ ...prev, [persona]: title }))}
        customSummaries={customSummaries}
        onUpdateCustomSummary={(persona, summary) => setCustomSummaries(prev => ({ ...prev, [persona]: summary }))}
        visibleSections={visibleSections}
        activeSkills={activeSkills}
        activeExperience={activeExperience}
        activeProjects={activeProjects}
        education={settings.education}
        activeCertificates={activeCertificates}
        onToggleSkill={handleToggleSkill}
      />
    </div>
  );
}
