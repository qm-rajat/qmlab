# Product Technical Specification & Architecture

**Document Version:** v2.3.0  
**Authors:** Rajat (Lead Product Engineer & Architect)  
**Target System:** Full-Stack Node.js / Express + React 18 + Model Context Protocol (MCP)  

---

## 1. System Architecture Overview

```
                      ┌──────────────────────────────────────────┐
                      │              CLIENT LAYER                │
                      │  • React 18 + Tailwind CSS SPA          │
                      │  • OpenAI ChatGPT / Claude Desktop Agent │
                      │  • Cursor IDE / LangChain MCP Clients    │
                      └────────────────────┬─────────────────────┘
                                           │
                    HTTPS / TLS (Port 3000 / Reverse Proxy)
                                           │
                      ┌────────────────────▼─────────────────────┐
                      │             EXPRESS SERVER               │
                      │  • Helmet & CSP Security Middleware      │
                      │  • Token Bucket Rate Limiting (IP Hash)  │
                      │  • Session Authentication Guard          │
                      ├────────────────────┬─────────────────────┤
                      │   REST API ROUTES  │  MCP JSON-RPC 2.0   │
                      │   • /api/content   │  • /api/mcp (HTTP)  │
                      │   • /api/contact   │  • /api/sse (Stream)│
                      │   • /api/admin/*   │  • 18+ Tool Handlers│
                      └──────────────┬─────┴──────────────┬──────┘
                                     │                    │
                      ┌──────────────▼────────────────────▼──────┐
                      │         STORAGE & SERVICE LAYER          │
                      │  • Dual-Persistence (Redis + JSON store) │
                      │  • SMTP Mailer Service (Nodemailer)      │
                      │  • Telemetry & Analytics Aggregator      │
                      └──────────────────────────────────────────┘
```

---

## 2. Core Data Models (`src/types.ts`)

### 2.1 Project Schema
```typescript
interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category?: 'automation' | 'machine-learning' | 'cybersecurity' | 'data-bi' | 'web-systems' | 'product-management' | string;
  images: string[];
  image_url?: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  prd_url?: string;
  target_audience?: string;
  key_metric?: { label: string; value: string } | string;
  architecture_highlights?: string[];
  problem_statement?: string;
  solution_details?: string;
  features?: string[];
  is_featured: boolean;
  display_order: number;
  created_at: string;
  project_type?: 'company' | 'portfolio' | 'both';
}
```

### 2.2 Site Settings Schema
```typescript
interface SiteSettings {
  hero_name: string;
  hero_tagline: string; // Comma-separated roles fed to animated TypewriterRoles (e.g. "Technical Product Manager, Full-Stack Developer, Technical SEO, IT Support")
  hero_bio: string;
  profile_image_url: string;
  about_text: string;
  seo_home_title: string;
  seo_home_description: string;
  seo_home_keywords: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  social_links: SocialLinks;
  contact_email: string;
  contact_location: string;
  hero_stats: HeroStat[];
  overview_fourth_stat: { label: string; value: string };
}
```

### 2.3 Career Profile Schema (`CareerProfile`)
```typescript
interface CareerProfile {
  id: string; // e.g. 'product', 'general', 'seo', 'qa', 'cybersecurity'
  name: string; // e.g. 'Product Manager (TPM)'
  title: string; // e.g. 'Technical Product Manager & Product Strategist'
  summary: string;
  icon_name: string; // Lucide icon mapping e.g. 'Target', 'Code2', 'Search'
  accent_color: string; // 'amber' | 'blue' | 'indigo' | 'emerald' | 'purple'
  skills_categories: string[];
  is_default: boolean; // Defaults to true for 'product'
}
```

---

## 3. High-Fidelity Resume Print Engine
- **Media Query:** Dedicated `@media print` layout rules inside `src/index.css`.
- **Page Geometry:** `@page { size: A4 portrait; margin: 12mm 14mm; }` with exact background graphic color fidelity (`-webkit-print-color-adjust: exact`).
- **Print Shielding:** All interactive navigation (`header`, `footer`, `nav`, `.no-print`, hero cursor, action toolbars) are suppressed.
- **Break Avoidance:** `break-inside: avoid` and `break-after: avoid` rules prevent ugly splits across job experiences and headings.
- **Link Formatter:** Raw contact URLs rendered in clean, printable monospace text.

---

## 4. Model Context Protocol (MCP) Contract

### 3.1 JSON-RPC 2.0 Ingress Specification
- **Endpoint:** `POST /api/mcp`
- **Headers:** `Content-Type: application/json`
- **Supported Methods:** `initialize`, `ping`, `tools/list`, `tools/call`

#### Example `tools/call` Payload:
```json
{
  "jsonrpc": "2.0",
  "id": "req_1710002",
  "method": "tools/call",
  "params": {
    "name": "list_projects",
    "arguments": {
      "category": "product-management"
    }
  }
}
```

#### Example Response Payload:
```json
{
  "jsonrpc": "2.0",
  "id": "req_1710002",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Found 4 projects in category 'product-management'..."
      }
    ]
  }
}
```

---

## 5. Media Library & Backup / Restore Specifications

### 5.1 Local Storage Media Manager
- **Upload Directory:** `/public/uploads/`
- **Endpoints:**
  - `GET /api/admin/media`: Returns array of uploaded files (`filename`, `url`, `sizeBytes`, `createdAt`).
  - `DELETE /api/admin/media`: Deletes specified file from disk and repository.
- **Cross-Reference In-Use Detection:** Compares uploaded file URLs against active references in settings, projects, blogs, and certificates to categorize files as `In Use` or `Unused`.

### 5.2 Backup & Restore Endpoints
- `POST /api/admin/backup`: Dumps all Redis/JSON store state into `.data/backups/latest.json`.
- `POST /api/admin/restore`: Restores site state from `.data/backups/latest.json` into active storage.

---

## 4. Security & Performance Directives

1. **Strict Input Sanitization:** All markdown inputs processed through unified DOMPurify pipelines.
2. **Rate Limiting:**
   - General API: 120 requests / minute per IP.
   - Admin Login & Contact Form: 5 requests / minute per IP.
3. **Session Integrity:** Cryptographically secure session tokens stored with HttpOnly, SameSite=Lax flags.
4. **Zero Client Secrets:** All Gemini API keys, SMTP credentials, and database secrets remain strictly server-side.
