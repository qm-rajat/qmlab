# Product & Technical Plan: "Hire Me & Freelance Services" Dynamic Platform

**Status:** ✅ Implemented & Live in Production (v2.5.0)  
**Target Routing:** `/` (Services Landing View) & `/services` | Direct Navigation via Header & CTA links  
**Admin Controller:** Admin Console > "Freelance Services" Tab (`/admin` tab: `services`)  
**Currency Standard:** Indian Rupee (INR - `₹`) with dynamic tier ranges  

---

## 1. Executive Summary
The **"Hire Me & Freelance Services"** dynamic platform delivers a high-converting, professional service catalog where potential clients can explore specialized freelance packages, review verified client case studies, inspect technical domain competencies, browse dynamic FAQs & engineering workflow sprints, and submit structured project inquiries—**with 100% dynamic control from the Admin CRM console**.

---

## 2. Implemented Features & User Experience

### 2.1 Hero & Service Value Proposition
- **High-Impact Identity:** "Engineering Scalable AI Systems & Modern Web Platforms" with live availability indicator (e.g. *Available for Q3 Projects*).
- **Quick Action Navigation:** Direct consultation modals, package discovery, and verified portfolio routing.
- **Trust & Satisfaction Guarantees:** 4-pillar trust badge row covering 100% IP Ownership, Code Quality Audits, SLA Support, and Clear Milestone Billing.

### 2.2 Dynamic Freelance Services Catalog
- **Curated Service Packages:** Full-Stack Web Development, AI & LLM Systems (MCP/Gemini), Technical SEO & AEO Architecture, Cloud Infrastructure & DevOps.
- **Pricing Model:** Transparent INR (`₹`) fixed packages, hourly consulting, and monthly retainers.
- **Deliverables & Sprints:** Interactive pill badges for each package showing specific deliverables and estimated turnaround times.

### 2.3 Interactive Project Consultation / Inquiry Workflow
- **Service-Linked Lead Generation:** Clicking "Inquire Now" on any service card auto-populates the inquiry context with the exact service ID and estimated budget tier.
- **Seamless Admin CRM Integration:** Inquiries route into `AdminContactsTab` with priority flags, deal value tracking in INR (`₹`), canned response generators, and status workflows.

### 2.4 Dynamic Engineering Workflow & Sprints
- **4-Stage Delivery Blueprint:** Discovery & Architecture, Rapid Prototyping, Production Hardening, and Handover & Monitoring.
- **Fully Admin-Editable:** Step titles, descriptions, and deliverable badges manageable via Admin Console.

### 2.5 Dynamic FAQ & AEO Engine
- **Schema-Optimized FAQs:** Structured questions and answers addressing IP rights, source code ownership, communication cadences, and milestone billing.
- **Search Engine & LLM Crawlability:** Ingestible by AI search engines (Perplexity, ChatGPT, Claude) with rich Schema.org metadata.

---

## 3. Data Architecture & Database Schemas (`server/lib/store.ts` & `src/types.ts`)

### 3.1 Freelance Service Schema
```typescript
interface FreelanceService {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  icon: 'Code2' | 'Cpu' | 'Search' | 'Server' | string;
  deliverables: string[];
  pricing_type: 'fixed' | 'hourly' | 'retainer';
  starting_price?: string; // Standardized in INR: e.g. "₹15,000" or "₹1,500/hr"
  turnaround_time: string;
  is_active: boolean;
  sort_order: number;
}
```

### 3.2 FAQ Schema
```typescript
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: 'general' | 'pricing' | 'technical' | 'workflow';
  sort_order: number;
  is_active: boolean;
}
```

### 3.3 Workflow Step Schema
```typescript
interface WorkflowStep {
  id: string;
  step_number: number;
  title: string;
  description: string;
  deliverables: string[];
}
```

### 3.4 Trust Guarantee Schema
```typescript
interface TrustGuarantee {
  id: string;
  title: string;
  description: string;
  icon: string;
}
```

---

## 4. Admin Management Hub (`AdminServicesTab.tsx`, `AdminWorkflowTab.tsx`, `AdminTrustTab.tsx`, `AdminFaqTab.tsx`)

1. **Service Package CRUD:** Instant creation, editing, icon selection, deliverable tags, and active status toggling.
2. **One-Click Currency Conversions:** Built-in actions to batch-convert existing legacy catalog pricing to standardized INR (`₹`) tiers.
3. **Workflow & Trust Guarantees Editors:** Full single-pane editing for delivery stages and client assurance guarantees.
4. **Auto-Sanitized Data Sync:** Live bidirectional synchronization between persistent Redis store, atomic backup files, and client-side React state.

