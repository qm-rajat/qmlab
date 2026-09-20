# Product & Technical Plan: "Hire Me & Freelance Services" Dynamic Page

## 1. Executive Summary
This document outlines the product requirements, architectural design, data structures, and admin management workflow for the upcoming **"Hire Me & Freelance Services"** dedicated landing page. 

The goal is to provide a high-converting, professional service offering page (accessible at `/services` or `/hire`) where potential clients can explore specialized freelance services, review featured case-study projects, read relevant expert blog posts, inspect verified technical skills, and book or inquire directly through an integrated project consultation form—**with 100% dynamic control from the Admin CRM console**.

---

## 2. Core Features & User Experience (Frontend)

### 2.1 Hero & Value Proposition Section
- **Dynamic Headline & Subheading:** Editable via admin (e.g., *"Senior Full-Stack Engineer & AI Architect available for contract & advisory"*).
- **Quick Action Call-to-Actions (CTAs):** "Book a Consultation", "View Packages", "Request Custom Quote".
- **Trust Badges & Availability Status:** Real-time availability indicator (e.g., *"🟢 Available for Q3 Projects"*), client satisfaction score, completed projects count, and years of experience.

### 2.2 Freelance Services & Offerings Matrix
- **Service Cards:** Cards displaying service titles, short descriptions, deliverables list, pricing model (Hourly, Fixed-price, Retainer), and typical turnaround time.
- **Service Categories:** E.g., Full-Stack Web Development, AI & LLM Integration (MCP, Gemini), Technical SEO & AEO Optimization, Cloud Architecture & DevOps.

### 2.3 Curated Featured Projects
- **Dynamic Selection:** Admin can toggle which portfolio projects are marked as `is_featured_service` to showcase on this page.
- **Case Study Preview:** Tech stack badges, live demo links, key metrics/results achieved.

### 2.4 Featured Expert Blog Posts
- **Thought Leadership Feed:** Dynamically displays articles tagged for freelance clients (e.g., architectural guides, scalability case studies).

### 2.5 Skills & Tech Stack Matrix
- **Categorized Expertise:** Frontend, Backend, AI/ML, Cloud & DevOps, Databases.
- **Proficiency / Years of Experience:** Visual indicators of mastery level.

### 2.6 Interactive Consultation / Booking Form
- **Project Scope Selector:** Budget range dropdown, timeline estimate, project type checkboxes.
- **Direct Lead Capture:** Submissions route directly into the existing Admin Contact CRM with priority tags (`High-Value Freelance Inquiry`).

---

## 3. Data Structures & Database Schema (Redis / JSON Store)

### 3.1 New Store Collections / Keys
1. **`qmlabs:services`**: Array of service offerings.
   ```ts
   interface FreelanceService {
     id: string;
     title: string;
     slug: string;
     short_description: string;
     full_description: string;
     icon: string;
     deliverables: string[];
     pricing_type: 'fixed' | 'hourly' | 'retainer';
     starting_price?: string;
     turnaround_time: string;
     is_active: boolean;
     sort_order: number;
   }
   ```
2. **`qmlabs:service_settings`**: Page configuration (hero title, subtitle, availability status, booking banner text, meta tags).

---

## 4. Admin CRM Management Workflow

A new tab in the Admin Console (**"Services & Freelancing"**):
- **Services Manager:** Create, edit, reorder, and toggle active status for freelance service packages.
- **Featured Items Curation:** Select which existing projects and blog posts are featured on the Services page.
- **Inquiry Analytics:** Track leads generated specifically from the `/services` page.

---

## 5. Proposed Implementation Phases

- **Phase 1:** Define TypeScript interfaces & mock/default service data.
- **Phase 2:** Build backend API routes (`GET /api/services`, `PUT /api/admin/services`).
- **Phase 3:** Build frontend public page (`/src/components/ServicesView.tsx` or `/src/pages/ServicesPage.tsx`) with routing.
- **Phase 4:** Build Admin CRM management tab (`/src/components/admin/AdminServicesTab.tsx`).
- **Phase 5:** Testing, SEO optimization, and integration with Contact CRM.
