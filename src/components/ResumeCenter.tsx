import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResumePersona, ResumeTheme, ResumeAccent, VisibleSections, 
  EditableContactDetails, PERSONA_META, ResumeCenterProps 
} from './resume/resumeTypes';
import { ResumeHeaderControls } from './resume/ResumeHeaderControls';
import { ResumeConfigPanel } from './resume/ResumeConfigPanel';
import { ResumeDocumentView } from './resume/ResumeDocumentView';
import { Skill, Project, DomainProfile, SiteSettings } from '../types';
import { DEFAULT_PROFILES } from './admin/AdminProfilesTab';

export default function ResumeCenter({ 
  settings, 
  projects = [], 
  certificates = [],
  isAdminLoggedIn = false,
  onUpdateSettings
}: ResumeCenterProps) {
  // Helper to extract clean display domain/handle from URLs for resume rendering
  const cleanDisplayUrl = (url?: string, fallback: string = '') => {
    if (!url) return fallback;
    return url.replace(/^https?:\/\//i, '').replace(/\/$/, '').trim() || fallback;
  };

  // Dynamically resolve contact information from site settings and custom overrides
  const resolveContactDetails = (s: SiteSettings): EditableContactDetails => {
    const custom = s.resume_contact_details || {};
    return {
      name: custom.name || s.hero_name || 'Rajat Kumar Dash',
      phone: custom.phone || s.contact_phone || '+91 8984550754',
      email: custom.email || s.contact_email || 'rajat.pilgrimpackages@gmail.com',
      location: custom.location || s.contact_location || 'New Delhi, India',
      github: custom.github || cleanDisplayUrl(s.social_links?.github, 'github.com/qm-rajat'),
      linkedin: custom.linkedin || cleanDisplayUrl(s.social_links?.linkedin, 'linkedin.com/in/rajatkudash'),
      portfolio: custom.portfolio || cleanDisplayUrl(s.custom_domain, 'qmlab-indol.vercel.app'),
    };
  };

  const allProfiles: DomainProfile[] = useMemo(() => {
    if (settings.profiles && settings.profiles.length > 0) {
      return settings.profiles;
    }
    return DEFAULT_PROFILES;
  }, [settings.profiles]);

  const defaultProfileId = useMemo(() => {
    const def = allProfiles.find(p => p.is_default);
    return def ? def.id : (allProfiles[0]?.id || 'product');
  }, [allProfiles]);

  const [selectedPersona, setSelectedPersona] = useState<ResumePersona>(defaultProfileId);
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

  // Editable contact details - dynamically initialized from settings
  const [contactDetails, setContactDetails] = useState<EditableContactDetails>(() => 
    resolveContactDetails(settings)
  );
  
  // Custom persona titles & summaries
  const [customTitles, setCustomTitles] = useState<Record<string, string>>({});
  const [customSummaries, setCustomSummaries] = useState<Record<string, string>>({});
  const [customCategoryNames, setCustomCategoryNames] = useState<Record<string, string>>({});

  // Sync titles and summaries whenever allProfiles or settings change
  useEffect(() => {
    const titlesMap: Record<string, string> = {};
    const summariesMap: Record<string, string> = {};

    allProfiles.forEach(prof => {
      titlesMap[prof.id] = settings.resume_custom_titles?.[prof.id] || prof.title || PERSONA_META[prof.id]?.title || prof.name;
      summariesMap[prof.id] = settings.resume_custom_summaries?.[prof.id] || prof.summary || PERSONA_META[prof.id]?.summary || '';
    });

    setCustomTitles(prev => ({ ...titlesMap, ...prev, ...(settings.resume_custom_titles || {}) }));
    setCustomSummaries(prev => ({ ...summariesMap, ...prev, ...(settings.resume_custom_summaries || {}) }));
    if (settings.resume_custom_categories) {
      setCustomCategoryNames(prev => ({ ...settings.resume_custom_categories, ...prev }));
    }
  }, [allProfiles, settings]);

  // Keep contact details synced with site-wide setup changes dynamically
  useEffect(() => {
    setContactDetails(resolveContactDetails(settings));
  }, [
    settings.hero_name, 
    settings.contact_email, 
    settings.contact_location, 
    settings.contact_phone, 
    settings.social_links?.github, 
    settings.social_links?.linkedin, 
    settings.custom_domain,
    settings.resume_contact_details
  ]);

  // Reset function to clear custom overrides
  const handleResetToDefault = () => {
    setContactDetails(resolveContactDetails(settings));
    setDisabledSkills([]);

    const titlesMap: Record<string, string> = {};
    const summariesMap: Record<string, string> = {};
    allProfiles.forEach(prof => {
      titlesMap[prof.id] = prof.title;
      summariesMap[prof.id] = prof.summary;
    });
    setCustomTitles(titlesMap);
    setCustomSummaries(summariesMap);
    setCustomCategoryNames({});

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
    const activeProfile = allProfiles.find(p => p.id === persona);
    let baseSkills: Skill[] = [];
    const allSkills = settings.skills || [];

    if (activeProfile?.skills_categories && activeProfile.skills_categories.length > 0) {
      baseSkills = allSkills.filter(s => 
        activeProfile.skills_categories!.some(cat => s.category.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(s.category.toLowerCase()))
      );
      if (baseSkills.length === 0) {
        baseSkills = allSkills;
      }
    } else {
      switch (persona) {
        case 'seo':
          baseSkills = allSkills.filter(s => s.category.includes('SEO') || s.category.includes('Web'));
          break;
        case 'data':
          baseSkills = allSkills.filter(s => s.category.includes('Data') || s.category.includes('Web'));
          break;
        case 'qa':
          baseSkills = allSkills.filter(s => s.category.includes('QA') || s.category.includes('Web'));
          break;
        case 'security':
          baseSkills = allSkills.filter(s => s.category.includes('Cybersecurity') || s.category.includes('QA'));
          break;
        case 'product':
          baseSkills = allSkills.filter(s => s.category.includes('Product') || s.category.includes('Web') || s.category.includes('Agile'));
          break;
        default:
          baseSkills = allSkills;
          break;
      }
    }

    return baseSkills.map(categoryObj => ({
      ...categoryObj,
      items: (categoryObj.items || []).filter(item => {
        const name = typeof item === 'string' ? item : item.name;
        return !disabledSkills.includes(name);
      })
    })).filter(categoryObj => (categoryObj.items || []).length > 0);
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
    if (visibleSections.summary && (customSummaries[selectedPersona] || "").length > 50) score += 6;
    if (visibleSections.skills && activeSkills.length >= 3) score += 8;
    if (visibleSections.experience && activeExperience.length >= 2) score += 8;
    if (visibleSections.education) score += 4;
    if (contactDetails.email && contactDetails.phone && contactDetails.linkedin) score += 4;
    return Math.min(score, 98);
  };

  // Generate copyable markdown text representation
  const getMarkdownText = () => {
    let md = `# ${contactDetails.name.toUpperCase()}\n`;
    md += `${customTitles[selectedPersona] || ""}\n\n`;
    md += `📍 ${contactDetails.location} | 📞 ${contactDetails.phone} | ✉️ ${contactDetails.email}\n`;
    md += `🔗 Portfolio: https://${contactDetails.portfolio} | GitHub: https://${contactDetails.github} | LinkedIn: https://${contactDetails.linkedin}\n\n`;
    
    if (visibleSections.summary) {
      md += `## PROFESSIONAL SUMMARY\n`;
      md += `${customSummaries[selectedPersona] || ""}\n\n`;
    }
    
    if (visibleSections.skills) {
      md += `## ${customCategoryNames["__SkillsHeading__"] || "TECHNICAL COMPETENCIES"}\n`;
      activeSkills.forEach(cat => {
        const skillNames = cat.items.map(s => typeof s === 'string' ? s : s.name);
        md += `- **${customCategoryNames[cat.category] || cat.category}**: ${skillNames.join(', ')}\n`;
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
      (settings.education || []).forEach(edu => {
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
    txt += `${customTitles[selectedPersona] || ""}\n`;
    txt += `Email: ${contactDetails.email} | Phone: ${contactDetails.phone} | Location: ${contactDetails.location}\n`;
    txt += `GitHub: https://${contactDetails.github} | LinkedIn: https://${contactDetails.linkedin}\n\n`;
    
    if (visibleSections.summary) {
      txt += `SUMMARY\n----------------------------------------\n`;
      txt += `${customSummaries[selectedPersona] || ""}\n\n`;
    }

    if (visibleSections.skills) {
      const heading = customCategoryNames["__SkillsHeading__"] || "TECHNICAL SKILLS";
      txt += `${heading.toUpperCase()}\n----------------------------------------\n`;
      activeSkills.forEach(cat => {
        const skillNames = cat.items.map(s => typeof s === 'string' ? s : s.name);
        txt += `${customCategoryNames[cat.category] || cat.category}: ${skillNames.join(', ')}\n`;
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
      (settings.education || []).forEach(edu => {
        txt += `${edu.degree} in ${edu.field} | ${edu.institution} (${edu.start_year} - ${edu.end_year || 'Present'})\n`;
      });
    }

    return txt;
  };

  const triggerTelemetryDownload = () => {
    fetch('/api/telemetry/resume-download', { method: 'POST' }).catch(() => {});
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(getMarkdownText());
    setCopied(true);
    triggerTelemetryDownload();
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
    if (downloadAnchor.parentNode) {
      downloadAnchor.parentNode.removeChild(downloadAnchor);
    }
    URL.revokeObjectURL(url);
    setCopiedText(true);
    triggerTelemetryDownload();
    setTimeout(() => setCopiedText(false), 2200);
  };

  const handlePrint = () => {
    triggerTelemetryDownload();
    window.print();
  };

  const handleDownloadJSON = () => {
    triggerTelemetryDownload();
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
      persona_title: customTitles[selectedPersona] || "",
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
    if (downloadAnchor.parentNode) {
      downloadAnchor.parentNode.removeChild(downloadAnchor);
    }
  };

  useEffect(() => {
    if (!isAdminLoggedIn) {
      setIsEditable(false);
      setShowConfigPanel(false);
    }
  }, [isAdminLoggedIn]);

  const handleToggleEditable = async () => {
    if (!isAdminLoggedIn) return;
    if (isEditable) {
      setIsEditable(false);
      try {
        const payload: Partial<SiteSettings> = {
          resume_custom_titles: customTitles,
          resume_custom_summaries: customSummaries,
          resume_custom_categories: customCategoryNames,
          hero_name: contactDetails.name,
          contact_email: contactDetails.email,
          contact_location: contactDetails.location,
          contact_phone: contactDetails.phone,
          resume_contact_details: contactDetails,
        };

        if (onUpdateSettings) {
          const updatedSocials = {
            ...(settings.social_links || {}),
            github: contactDetails.github.startsWith('http') ? contactDetails.github : `https://${contactDetails.github}`,
            linkedin: contactDetails.linkedin.startsWith('http') ? contactDetails.linkedin : `https://${contactDetails.linkedin}`,
          };
          await onUpdateSettings({
            ...settings,
            ...payload,
            social_links: updatedSocials,
            custom_domain: contactDetails.portfolio ? contactDetails.portfolio.replace(/^https?:\/\//, '') : settings.custom_domain,
          });
        } else {
          await fetch('/api/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      } catch (err) {
        console.error('Failed to save resume updates', err);
      }
    } else {
      setIsEditable(true);
    }
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
        onToggleEditable={handleToggleEditable}
        copied={copied}
        copiedText={copiedText}
        onCopyMarkdown={handleCopyMarkdown}
        onDownloadTxt={handleDownloadTxt}
        onDownloadJSON={handleDownloadJSON}
        onPrint={handlePrint}
        profiles={allProfiles}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* 2. CUSTOMIZER HUD CONFIGURATION PANEL */}
      {showConfigPanel && isAdminLoggedIn && (
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
        isEditable={isEditable && isAdminLoggedIn}
        onExitEdit={handleToggleEditable}
        activeTheme={activeTheme}
        activeAccent={activeAccent}
        selectedPersona={selectedPersona}
        contactDetails={contactDetails}
        onUpdateContactDetails={(partial) => setContactDetails(prev => ({ ...prev, ...partial }))}
        customTitles={customTitles}
        onUpdateCustomTitle={(persona, title) => setCustomTitles(prev => ({ ...prev, [persona]: title }))}
        customSummaries={customSummaries}
        onUpdateCustomSummary={(persona, summary) => setCustomSummaries(prev => ({ ...prev, [persona]: summary }))}
        customCategoryNames={customCategoryNames}
        onUpdateCategoryName={(original, newName) => setCustomCategoryNames(prev => ({ ...prev, [original]: newName }))}
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
