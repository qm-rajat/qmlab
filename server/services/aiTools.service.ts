import {
  getProjects,
  saveProjects,
  getBlogs,
  saveBlogs,
  getCertificates,
  saveCertificates,
  getSettings,
  saveSettings,
  getContacts,
  saveContacts,
} from "../lib/store.js";
import { Project, Blog, Certificate, SiteSettings, Experience, Education, Skill, Contact } from "../../src/types.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const aiTools = {
  // -------------------------------------------------------------
  // GLOBAL OVERVIEW
  // -------------------------------------------------------------
  async getOverview() {
    const [settings, projects, blogs, certificates, contacts] = await Promise.all([
      getSettings(),
      getProjects(),
      getBlogs(),
      getCertificates(),
      getContacts(),
    ]);

    return {
      success: true,
      profile: {
        name: settings.hero_name,
        title: settings.hero_tagline,
        bio: settings.hero_bio,
        company: settings.company_name,
        location: settings.contact_location,
        socials: settings.social_links,
      },
      counts: {
        projects: projects.length,
        blogs: blogs.length,
        certificates: certificates.length,
        experience_items: settings.experience?.length || 0,
        education_items: settings.education?.length || 0,
        skills_categories: settings.skills?.length || 0,
        contact_messages: contacts.length,
      },
      projects_summary: projects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        technologies: p.technologies,
      })),
      blogs_summary: blogs.map((b) => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        status: b.status,
        published_at: b.published_at,
      })),
      certificates_summary: certificates.map((c) => ({
        id: c.id,
        title: c.title,
        issuer: c.issuer,
      })),
    };
  },

  // -------------------------------------------------------------
  // PROJECTS CRUD
  // -------------------------------------------------------------
  async listProjects(filter?: { category?: string; query?: string }) {
    let projects = await getProjects();
    if (filter?.category) {
      const cat = filter.category.toLowerCase();
      projects = projects.filter((p) => p.category?.toLowerCase() === cat);
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.technologies?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return { success: true, count: projects.length, projects };
  },

  async getProject(idOrSlug: string) {
    const projects = await getProjects();
    const proj = projects.find(
      (p) => p.id === idOrSlug || p.slug === idOrSlug || p.title.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (!proj) return { success: false, error: `Project not found with identifier: ${idOrSlug}` };
    return { success: true, project: proj };
  },

  async createProject(input: Partial<Project> & { title: string }) {
    if (!input.title?.trim()) {
      return { success: false, error: "Project 'title' is required." };
    }

    const projects = await getProjects();
    const baseSlug = input.slug ? slugify(input.slug) : slugify(input.title);
    let finalSlug = baseSlug || `project-${Date.now()}`;
    if (projects.some((p) => p.slug === finalSlug)) {
      finalSlug = `${finalSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title: input.title.trim(),
      slug: finalSlug,
      description: input.description || "",
      category: input.category || "web-systems",
      images: input.images && input.images.length > 0 ? input.images : input.image_url ? [input.image_url] : [],
      image_url: input.image_url || (input.images && input.images[0]) || "",
      technologies: input.technologies || [],
      github_url: input.github_url || "",
      live_url: input.live_url || "",
      prd_url: input.prd_url || "",
      target_audience: input.target_audience || "",
      key_metric: input.key_metric || { label: "Performance", value: "+100%" },
      architecture_highlights: input.architecture_highlights || [],
      problem_statement: input.problem_statement || "",
      solution_details: input.solution_details || "",
      features: input.features || [],
      seo_title: input.seo_title || `${input.title} | Case Study`,
      seo_description: input.seo_description || input.description || "",
      seo_keywords: input.seo_keywords || "",
      is_featured: input.is_featured ?? true,
      display_order: input.display_order ?? (projects.length + 1),
      created_at: new Date().toISOString(),
      project_type: input.project_type || "both",
    };

    projects.unshift(newProject);
    await saveProjects(projects);

    return {
      success: true,
      message: `Project '${newProject.title}' created successfully.`,
      project: newProject,
    };
  },

  async updateProject(idOrSlug: string, updates: Partial<Project>) {
    const projects = await getProjects();
    const idx = projects.findIndex(
      (p) => p.id === idOrSlug || p.slug === idOrSlug || p.title.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (idx === -1) {
      return { success: false, error: `Project not found matching '${idOrSlug}'` };
    }

    const current = projects[idx];
    const updated: Project = {
      ...current,
      ...updates,
      id: current.id, // Immutable ID
      slug: updates.slug ? slugify(updates.slug) : current.slug,
      images: updates.images || (updates.image_url ? [updates.image_url, ...current.images.slice(1)] : current.images),
    };

    projects[idx] = updated;
    await saveProjects(projects);

    return {
      success: true,
      message: `Project '${updated.title}' updated successfully.`,
      project: updated,
    };
  },

  async deleteProject(idOrSlug: string) {
    const projects = await getProjects();
    const idx = projects.findIndex(
      (p) => p.id === idOrSlug || p.slug === idOrSlug || p.title.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (idx === -1) {
      return { success: false, error: `Project not found matching '${idOrSlug}'` };
    }

    const removed = projects.splice(idx, 1)[0];
    await saveProjects(projects);

    return {
      success: true,
      message: `Project '${removed.title}' (${removed.id}) has been deleted.`,
    };
  },

  // -------------------------------------------------------------
  // BLOGS CRUD
  // -------------------------------------------------------------
  async listBlogs(filter?: { status?: string; tag?: string }) {
    let blogs = await getBlogs();
    if (filter?.status) {
      blogs = blogs.filter((b) => b.status === filter.status);
    }
    if (filter?.tag) {
      const t = filter.tag.toLowerCase();
      blogs = blogs.filter((b) => b.tags?.some((tg) => tg.toLowerCase() === t));
    }
    return { success: true, count: blogs.length, blogs };
  },

  async getBlog(idOrSlug: string) {
    const blogs = await getBlogs();
    const blog = blogs.find(
      (b) => b.id === idOrSlug || b.slug === idOrSlug || b.title.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (!blog) return { success: false, error: `Blog not found with identifier: ${idOrSlug}` };
    return { success: true, blog };
  },

  async createBlog(input: Partial<Blog> & { title: string; content_html: string }) {
    if (!input.title?.trim() || !input.content_html?.trim()) {
      return { success: false, error: "Both 'title' and 'content_html' are required." };
    }

    const blogs = await getBlogs();
    const baseSlug = input.slug ? slugify(input.slug) : slugify(input.title);
    let finalSlug = baseSlug || `article-${Date.now()}`;
    if (blogs.some((b) => b.slug === finalSlug)) {
      finalSlug = `${finalSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    // Rough read time calculation
    const wordsCount = input.content_html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordsCount / 200));

    const status = input.status || "published";

    const newBlog: Blog = {
      id: `blog_${Date.now()}`,
      title: input.title.trim(),
      slug: finalSlug,
      excerpt: input.excerpt || input.content_html.replace(/<[^>]*>/g, " ").slice(0, 160).trim() + "...",
      content_html: input.content_html,
      cover_image_url: input.cover_image_url || "/assets/blog-default.jpg",
      og_image_url: input.og_image_url || input.cover_image_url || "/assets/blog-default.jpg",
      seo_title: input.seo_title || input.title,
      seo_description: input.seo_description || input.excerpt || "",
      seo_keywords: input.seo_keywords || (input.tags?.join(", ") || ""),
      canonical_url: input.canonical_url || "",
      status,
      read_time_mins: input.read_time_mins || readTime,
      like_count: input.like_count || 0,
      bookmark_count: 0,
      view_count: 0,
      published_at: status === "published" ? new Date().toISOString() : undefined,
      created_at: new Date().toISOString(),
      tags: input.tags || ["Engineering", "Web"],
      categories: input.categories || ["General Web"],
    };

    blogs.unshift(newBlog);
    await saveBlogs(blogs);

    return {
      success: true,
      message: `Blog post '${newBlog.title}' created (${status}).`,
      blog: newBlog,
    };
  },

  async updateBlog(idOrSlug: string, updates: Partial<Blog>) {
    const blogs = await getBlogs();
    const idx = blogs.findIndex(
      (b) => b.id === idOrSlug || b.slug === idOrSlug || b.title.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (idx === -1) {
      return { success: false, error: `Blog not found matching '${idOrSlug}'` };
    }

    const current = blogs[idx];
    const willPublish = updates.status === "published" && current.status !== "published";

    const updated: Blog = {
      ...current,
      ...updates,
      id: current.id,
      slug: updates.slug ? slugify(updates.slug) : current.slug,
      published_at: willPublish ? new Date().toISOString() : (updates.published_at || current.published_at),
    };

    blogs[idx] = updated;
    await saveBlogs(blogs);

    return {
      success: true,
      message: `Blog post '${updated.title}' updated successfully.`,
      blog: updated,
    };
  },

  async deleteBlog(idOrSlug: string) {
    const blogs = await getBlogs();
    const idx = blogs.findIndex(
      (b) => b.id === idOrSlug || b.slug === idOrSlug || b.title.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (idx === -1) {
      return { success: false, error: `Blog not found matching '${idOrSlug}'` };
    }

    const removed = blogs.splice(idx, 1)[0];
    await saveBlogs(blogs);

    return {
      success: true,
      message: `Blog post '${removed.title}' (${removed.id}) deleted successfully.`,
    };
  },

  // -------------------------------------------------------------
  // CERTIFICATES CRUD
  // -------------------------------------------------------------
  async listCertificates() {
    const certificates = await getCertificates();
    return { success: true, count: certificates.length, certificates };
  },

  async createCertificate(input: Partial<Certificate> & { title: string; issuer: string }) {
    if (!input.title?.trim() || !input.issuer?.trim()) {
      return { success: false, error: "Certificate 'title' and 'issuer' are required." };
    }

    const certificates = await getCertificates();
    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      title: input.title.trim(),
      issuer: input.issuer.trim(),
      issue_date: input.issue_date || new Date().toISOString().split("T")[0],
      expiry_date: input.expiry_date || "",
      credential_id: input.credential_id || "",
      verify_url: input.verify_url || "",
      image_url: input.image_url || "",
      category: input.category || "web-development",
      skills: input.skills || [],
      description: input.description || "",
      score_or_grade: input.score_or_grade || "",
      is_featured: input.is_featured ?? true,
      display_order: input.display_order ?? (certificates.length + 1),
      created_at: new Date().toISOString(),
    };

    certificates.unshift(newCert);
    await saveCertificates(certificates);

    return {
      success: true,
      message: `Certificate '${newCert.title}' from ${newCert.issuer} added.`,
      certificate: newCert,
    };
  },

  async updateCertificate(idOrTitle: string, updates: Partial<Certificate>) {
    const certificates = await getCertificates();
    const idx = certificates.findIndex(
      (c) => c.id === idOrTitle || c.title.toLowerCase() === idOrTitle.toLowerCase()
    );
    if (idx === -1) {
      return { success: false, error: `Certificate not found matching '${idOrTitle}'` };
    }

    const current = certificates[idx];
    const updated: Certificate = {
      ...current,
      ...updates,
      id: current.id,
    };

    certificates[idx] = updated;
    await saveCertificates(certificates);

    return {
      success: true,
      message: `Certificate '${updated.title}' updated.`,
      certificate: updated,
    };
  },

  async deleteCertificate(idOrTitle: string) {
    const certificates = await getCertificates();
    const idx = certificates.findIndex(
      (c) => c.id === idOrTitle || c.title.toLowerCase() === idOrTitle.toLowerCase()
    );
    if (idx === -1) {
      return { success: false, error: `Certificate not found matching '${idOrTitle}'` };
    }

    const removed = certificates.splice(idx, 1)[0];
    await saveCertificates(certificates);

    return {
      success: true,
      message: `Certificate '${removed.title}' deleted.`,
    };
  },

  // -------------------------------------------------------------
  // RESUME (EXPERIENCE, EDUCATION, SKILLS)
  // -------------------------------------------------------------
  async getResume() {
    const settings = await getSettings();
    return {
      success: true,
      name: settings.hero_name,
      title: settings.hero_tagline,
      bio: settings.hero_bio,
      location: settings.contact_location,
      experience: settings.experience || [],
      education: settings.education || [],
      skills: settings.skills || [],
    };
  },

  async addExperience(exp: Experience) {
    if (!exp.company || !exp.role) {
      return { success: false, error: "Experience requires 'company' and 'role'." };
    }
    const settings = await getSettings();
    const currentExp = settings.experience || [];
    const newExp: Experience = {
      company: exp.company.trim(),
      role: exp.role.trim(),
      start_date: exp.start_date || "Present",
      end_date: exp.end_date || (exp.is_current ? "Present" : ""),
      is_current: exp.is_current ?? true,
      description: exp.description || "",
      location: exp.location || "Remote",
    };

    settings.experience = [newExp, ...currentExp];
    await saveSettings(settings);

    return {
      success: true,
      message: `Added experience: ${newExp.role} at ${newExp.company}`,
      experience: settings.experience,
    };
  },

  async updateExperience(identifier: string | number, updates: Partial<Experience>) {
    const settings = await getSettings();
    const currentExp = settings.experience || [];

    let idx = -1;
    if (typeof identifier === "number") {
      idx = identifier;
    } else {
      idx = currentExp.findIndex(
        (e) =>
          e.company.toLowerCase().includes(identifier.toLowerCase()) ||
          e.role.toLowerCase().includes(identifier.toLowerCase())
      );
    }

    if (idx < 0 || idx >= currentExp.length) {
      return { success: false, error: `Experience item not found matching '${identifier}'` };
    }

    currentExp[idx] = { ...currentExp[idx], ...updates };
    settings.experience = currentExp;
    await saveSettings(settings);

    return {
      success: true,
      message: `Updated experience at index ${idx} (${currentExp[idx].role} at ${currentExp[idx].company})`,
      experience: settings.experience,
    };
  },

  async deleteExperience(identifier: string | number) {
    const settings = await getSettings();
    const currentExp = settings.experience || [];

    let idx = -1;
    if (typeof identifier === "number") {
      idx = identifier;
    } else {
      idx = currentExp.findIndex(
        (e) =>
          e.company.toLowerCase().includes(identifier.toLowerCase()) ||
          e.role.toLowerCase().includes(identifier.toLowerCase())
      );
    }

    if (idx < 0 || idx >= currentExp.length) {
      return { success: false, error: `Experience item not found matching '${identifier}'` };
    }

    const removed = currentExp.splice(idx, 1)[0];
    settings.experience = currentExp;
    await saveSettings(settings);

    return {
      success: true,
      message: `Deleted experience: ${removed.role} at ${removed.company}`,
      experience: settings.experience,
    };
  },

  async addEducation(edu: Education) {
    if (!edu.institution || !edu.degree) {
      return { success: false, error: "Education requires 'institution' and 'degree'." };
    }
    const settings = await getSettings();
    const currentEdu = settings.education || [];
    const newEdu: Education = {
      institution: edu.institution.trim(),
      degree: edu.degree.trim(),
      field: edu.field || "",
      start_year: edu.start_year || new Date().getFullYear(),
      end_year: edu.end_year,
      grade: edu.grade || "",
    };

    settings.education = [newEdu, ...currentEdu];
    await saveSettings(settings);

    return {
      success: true,
      message: `Added education: ${newEdu.degree} in ${newEdu.field} from ${newEdu.institution}`,
      education: settings.education,
    };
  },

  async updateEducation(identifier: string | number, updates: Partial<Education>) {
    const settings = await getSettings();
    const currentEdu = settings.education || [];

    let idx = -1;
    if (typeof identifier === "number") {
      idx = identifier;
    } else {
      idx = currentEdu.findIndex(
        (e) =>
          e.institution.toLowerCase().includes(identifier.toLowerCase()) ||
          e.degree.toLowerCase().includes(identifier.toLowerCase()) ||
          e.field.toLowerCase().includes(identifier.toLowerCase())
      );
    }

    if (idx < 0 || idx >= currentEdu.length) {
      return { success: false, error: `Education item not found matching '${identifier}'` };
    }

    currentEdu[idx] = { ...currentEdu[idx], ...updates };
    settings.education = currentEdu;
    await saveSettings(settings);

    return {
      success: true,
      message: `Updated education at index ${idx} (${currentEdu[idx].degree})`,
      education: settings.education,
    };
  },

  async deleteEducation(identifier: string | number) {
    const settings = await getSettings();
    const currentEdu = settings.education || [];

    let idx = -1;
    if (typeof identifier === "number") {
      idx = identifier;
    } else {
      idx = currentEdu.findIndex(
        (e) =>
          e.institution.toLowerCase().includes(identifier.toLowerCase()) ||
          e.degree.toLowerCase().includes(identifier.toLowerCase())
      );
    }

    if (idx < 0 || idx >= currentEdu.length) {
      return { success: false, error: `Education item not found matching '${identifier}'` };
    }

    const removed = currentEdu.splice(idx, 1)[0];
    settings.education = currentEdu;
    await saveSettings(settings);

    return {
      success: true,
      message: `Deleted education: ${removed.degree} from ${removed.institution}`,
      education: settings.education,
    };
  },

  async updateSkills(newSkills: Skill[]) {
    if (!Array.isArray(newSkills)) {
      return { success: false, error: "Skills must be an array of categories with items." };
    }
    const settings = await getSettings();
    settings.skills = newSkills;
    await saveSettings(settings);

    return {
      success: true,
      message: `Updated skills with ${newSkills.length} categories.`,
      skills: settings.skills,
    };
  },

  // -------------------------------------------------------------
  // SITE SETTINGS & HERO / BIO / BRAND
  // -------------------------------------------------------------
  async getSettings() {
    const settings = await getSettings();
    return { success: true, settings };
  },

  async updateSettings(updates: Partial<SiteSettings>) {
    const settings = await getSettings();
    const merged: SiteSettings = {
      ...settings,
      ...updates,
      // Deep merge social links if provided
      social_links: {
        ...settings.social_links,
        ...(updates.social_links || {}),
      },
      // Deep merge fourth stat if provided
      overview_fourth_stat: {
        ...settings.overview_fourth_stat,
        ...(updates.overview_fourth_stat || {}),
      },
    };

    await saveSettings(merged);

    return {
      success: true,
      message: "Site settings and profile successfully updated.",
      settings: merged,
    };
  },

  // -------------------------------------------------------------
  // CONTACTS & LEADS
  // -------------------------------------------------------------
  async listContacts() {
    const contacts = await getContacts();
    return { success: true, count: contacts.length, contacts };
  },

  async createContactLead(input: { name: string; email: string; message: string; inquiry_type?: string }) {
    if (!input.name || !input.email || !input.message) {
      return { success: false, error: "Lead requires 'name', 'email', and 'message'." };
    }

    const contacts = await getContacts();
    const newContact: Contact = {
      id: `lead_${Date.now()}`,
      name: input.name,
      email: input.email,
      message: input.message,
      status: "unread",
      priority: "high",
      inquiry_type: (input.inquiry_type as any) || "freelance_project",
      created_at: new Date().toISOString(),
      notes: "Received via ChatGPT / AI Agent MCP Integration",
    };

    contacts.unshift(newContact);
    await saveContacts(contacts);

    return {
      success: true,
      message: `Lead recorded from ${newContact.name} (${newContact.email}).`,
      contact: newContact,
    };
  },
};
