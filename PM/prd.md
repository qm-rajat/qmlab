# Product Requirement Document (PRD)

**Product Name:** Rajat Portfolio & Technical PM Intelligence Platform  
**Document Version:** v2.5.0  
**Product Owner:** Rajat Kumar Dash (Technical Product Lead & AI Systems Engineer)  
**Status:** Approved & Active  
**Target Release:** Production GA  

---

## 1. Executive Summary & Vision

### 1.1 Product Vision
To build the industry’s first **AI-Native, Autonomous Technical Product Management Platform** that seamlessly bridges human stakeholders (Hiring Managers, Engineering Leaders, Enterprise Clients, VCs) with autonomous AI agents (OpenAI ChatGPT, Anthropic Claude, Cursor IDE, LangChain, AutoGPT) via the **Model Context Protocol (MCP)**.

### 1.2 Mission
Transform the static developer/PM portfolio into a dynamic, production-grade operating system featuring real-time headless CMS capabilities, sub-100ms response times, 100/100 Core Web Vitals, enterprise telemetry, and bidirectional AI agent interoperability.

---

## 2. Problem Statement & Opportunity

### 2.1 The Problem
1. **Static & Outdated Portfolios:** Traditional portfolios are dead HTML/PDF artifacts that fail to prove real-time full-stack technical product craftsmanship.
2. **Disconnected from the AI Ecosystem:** Modern technical evaluation increasingly occurs through AI agents, yet portfolios lack machine-readable schemas or agent protocols.
3. **High Overhead for Updates:** Updating case studies, work history, and verified credentials requires code deployments rather than instant, authenticated CMS controls.
4. **Lack of Verified Attribution:** Case studies rarely connect to live APIs, GitHub repos, or verified credential registries.

### 2.2 The Solution
A full-stack, responsive platform combining:
- **Interactive Public Front:** Ultra-fast case study gallery, interactive multi-persona resume builder (defaulting to Technical PM), dynamic skill matrix, technical blog CMS, and verified credential showcase.
- **Enterprise Admin Console:** Secure, authenticated single-pane-of-glass management for projects, profiles/personas, typewriter taglines, blogs, credentials, SMTP mailers, analytics, and platform configuration.
- **Model Context Protocol (MCP) Server:** Native JSON-RPC 2.0 HTTP & Server-Sent Events (SSE) gateway exposing 18+ tools for AI agents to inspect, query, and manage portfolio entities.
- **Dual Persistence Architecture:** Hybrid in-memory JSON and Redis data layer with instantaneous seeding and atomic updates.

---

## 3. Target User Personas

| Persona | Primary Goal | Key Friction / Need | Platform Solution |
| :--- | :--- | :--- | :--- |
| **Tech Recruiter / Talent Lead** | Fast vetting of experience, credentials, and contact info | Wading through unformatted resumes without proof | 1-Click Tailored PDF Resume, verified credentials, direct contact portal |
| **VP of Product / CTO** | Evaluating system architecture, PM depth, and engineering skills | Superficial buzzwords without technical evidence | Detailed case studies with architecture highlights, live URLs, repo links, and metrics |
| **Autonomous AI Agent (Claude/ChatGPT)** | Querying candidate experience, skills, and projects | Inability to parse unstructured HTML cleanly | Model Context Protocol (`/api/mcp`) with strict JSON-RPC 2.0 tool discovery |
| **Product Lead (Rajat - Admin)** | Effortlessly maintaining case studies, blogs, and settings | Complex redeployments for minor updates | Secure Admin Console with real-time markdown editors, lead CRM, and MCP tester |

---

## 4. Functional Requirements

### 4.1 Public Portfolio Experience (P0)
- **FR-1.1 Hero & Identity Matrix:** Dynamic taglines with Admin-controlled typewriter rotating roles (e.g., Technical Product Manager, Full-Stack Developer, Technical SEO, IT Support), bio, avatar, social links, and real-time operational stats.
- **FR-1.2 Featured Projects & Deep Case Studies:** Categorized by domain (*Product Management, AI/ML, Automation, Cybersecurity, Web Systems, Data BI*). Includes problem statements, solution architecture, live links, and key business metrics.
- **FR-1.3 Technical Skills Matrix:** Categorized competencies (*AI Systems, Backend Engineering, Cloud Infrastructure, Product Analytics*) with interactive filtering.
- **FR-1.4 Interactive Resume Center:** 
  - Persona switching defaulting to **Technical Product Manager (TPM)**, with Full-Stack, Technical SEO, QA, and Cybersecurity.
  - Experience timeline, MBA & B.Tech education cards, and inline draft customization.
  - Pixel-perfect ATS print & "Save as PDF" engine with `@page { size: A4 portrait }`, CSS print shields (`.no-print`, `print-page`), automatic heading break avoidance, and formatted print-friendly contact links.
  - Direct exports to Markdown, TXT, and JSON.
- **FR-1.5 Verified Credentials & Certifications:** Official badge verification, credential IDs, issuing authority links, and expiration trackers.
- **FR-1.6 Technical Blog Engine:** Markdown/HTML rendering with prose formatting, reading time calculation, tag filtering, bookmarking, view counters, reader notes scratchpad, and clean author attribution.
- **FR-1.7 Contact & Lead Capture:** Anti-spam rate-limited contact form with SMTP email dispatch and admin inbox synchronization.

### 4.2 Admin Console & CMS (P0)
- **FR-2.1 Secure Authentication:** Session-based bcrypt/token verification with brute-force rate limiting.
- **FR-2.2 Real-time Dashboard:** Live analytics overview, top page paths, lead counts, and content volume telemetry.
- **FR-2.3 Project & Blog CRUD:** Rich markdown editor, SEO metadata injectors, tag managers, and instant publishing.
- **FR-2.4 Site & Hero Configuration:** Zero-downtime editing of typewriter rotating tagline roles via comma-separated input (`#set-tagline`), hero text, experience history, skills, contact coordinates, and brand assets.
- **FR-2.5 Career Profiles & Personas Manager:** Add, customize, and set default resume persona (e.g., Product Manager, Full-Stack, Technical SEO) with customized summaries and category mappings.
- **FR-2.6 Contact CRM:** Lead management with priority tagging, note taking, status workflows (*unread, read, replied, archived*), and estimated deal values.

### 4.3 Model Context Protocol (MCP) AI Server (P0)
- **FR-3.1 Dual Transport Engine:** Support for both HTTP POST (JSON-RPC 2.0) and Server-Sent Events (SSE) on `/api/mcp` and `/api/sse`.
- **FR-3.2 Tool Registry:** 18+ registered tools covering:
  - `get_portfolio_overview`
  - `list_projects`, `create_project`, `update_project`, `delete_project`
  - `list_blogs`, `create_blog`, `update_blog`, `delete_blog`
  - `list_certificates`, `create_certificate`, `update_certificate`, `delete_certificate`
  - `get_resume`, `add_work_experience`, `update_work_experience`, `add_education`, `update_education`, `update_skills`
  - `update_site_settings`
- **FR-3.3 Live Protocol Simulator:** In-browser JSON-RPC execution interface with latency timers, formatters, and status inspectors.
- **FR-3.4 Client Setup Manifests:** Copy-paste configurations for OpenAI ChatGPT Connectors, Claude Desktop JSON, and Cursor IDE settings.

---

## 5. Non-Functional Requirements (NFRs)

### 5.1 Performance
- **Time to First Byte (TTFB):** < 80ms on global edge.
- **First Contentful Paint (FCP):** < 0.6s.
- **Core Web Vitals:** 100/100 Performance, 100/100 Accessibility, 100/100 Best Practices, 100/100 SEO.
- **Bundle Footprint:** < 180kB initial gzip payload.

### 5.2 Security & Compliance
- **Authentication:** Salted PBKDF2 / bcrypt password hashing with constant-time comparison.
- **API Protection:** IP-based token bucket rate limiting (100 req/min for general routes, 5 req/min for auth/contact).
- **Headers:** Strict Content Security Policy (CSP), X-Content-Type-Options, X-Frame-Options, Referrer-Policy.
- **Sanitization:** Strict XSS scrubbing for rich text and markdown inputs.

### 5.3 Reliability & Availability
- **Uptime SLA:** 99.95% availability.
- **Persistence Fallback:** Automatic failover between Redis database and atomic filesystem JSON store.

---

## 6. Success Metrics & North Star KPIs

```
                          ┌─────────────────────────────┐
                          │     NORTH STAR METRIC       │
                          │ Qualified Inbound Engagements│
                          │   (Recruiter / Client Leads)│
                          └──────────────┬──────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
      ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
      │  Agent Discovery   │  │ Portfolio Virality │  │ Conversion Velocity│
      │  MCP API Calls/Mo  │  │ Blog Shares / Likes│  │ Lead-to-Meeting Rate│
      │    Target: > 500   │  │   Target: > 25% MoM│  │    Target: > 18%   │
      └────────────────────┘  └────────────────────┘  └────────────────────┘
```

1. **Inbound Recruiter / Client Inquiries:** > 25 qualified conversations per month.
2. **AI Agent Tool Invocations:** > 500 successful JSON-RPC tool calls per month.
3. **Resume Downloads & Prints:** > 150 downloads/month.
4. **Average Session Duration:** > 2.5 minutes for human visitors.
5. **Admin Operational Efficiency:** < 30 seconds to publish new case studies or articles.

---

## 7. Release Roadmap & Milestones

| Milestone | Scope | Target Date | Status |
| :--- | :--- | :--- | :--- |
| **M1: Core Engine** | Full-stack architecture, Redis/JSON store, portfolio UI, admin CRUD | Q1 2026 | Completed |
| **M2: MCP Agent Gateway** | JSON-RPC 2.0 server, 18+ tools, live admin protocol simulator | Q1 2026 | Completed |
| **M3: Core Web Vitals Lab** | Performance telemetry, SEO audit tools, dynamic sitemap generator | Q2 2026 | In Progress |
| **M4: Multi-Agent AI Co-pilot**| Autonomous blog summarization, project impact scoring | Q3 2026 | Planned |
