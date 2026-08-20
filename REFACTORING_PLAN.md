# Portfolio Codebase Modularization & Refactoring Plan

## Overview
This document outlines the systematic decomposition of monolithic files in the portfolio codebase into modular, single-responsibility components and custom hooks.

---

## Phase 1: Application Shell & Overview Architecture (Current)
- [x] **State Extraction (`src/hooks/usePortfolioData.ts`)**:
  - Extract all localStorage synchronization, initial seeding, and CRUD update handlers (`updateProjects`, `updateBlogs`, `updateCertificates`, `updateContacts`, `updateSettings`, `resetData`).
  - Encapsulate search states, category filters, and bookmark/like toggles.
- [x] **Overview View Extraction (`src/components/views/OverviewView.tsx`)**:
  - Extract Hero presentation, dynamic micro-stats, brand strip, interactive statistics, academic and professional timelines, and collaboration CTA into a standalone view component.
- [x] **`App.tsx` Refactoring**:
  - Streamline `App.tsx` to serve purely as the top-level router, layout shell (Header, Main, Footer, Admin modal trigger), and schema markup provider.

---

## Phase 2: Core Web Vitals Lab Modularization (`/src/components/vitals/`)
- [x] `vitalsTypes.ts` — Type definitions for scores, metrics, sitemaps, AI reports, and URL detail helpers.
- [x] `VitalsLighthouseTab.tsx` — Performance gauges, Core Web Vitals threshold matrix (LCP, INP, CLS, FCP, TTFB), crawl directives (robots.txt), JSON-LD preview, and Speed Insights integration guide.
- [x] `VitalsAiOptimizerTab.tsx` — Google Gemini AI Technical SEO metadata strategist, CTR title recommendations, meta descriptions, and semantic NLP keywords.
- [x] `VitalsOnPageSandboxTab.tsx` — Live on-page content editor, length meters, real-time keyword density grader, and SEO checklist.
- [x] `VitalsSitemapBuilderTab.tsx` — Interactive XML route builder, validator, and XML output exporter.
- [x] `VitalsExportModal.tsx` — Standalone HTML report generator, CRM lead logger, and download modal.

---

## Phase 3: Admin Console Modularization (`/src/components/admin/`)
- [x] `AdminLoginView.tsx` — Secure developer authorization interface and access credentials form.
- [x] `AdminDashboardTab.tsx` — Telemetry metrics, inquiries viewer, pageview charts, and pipeline overview.
- [x] `AdminProjectsTab.tsx` — Project manager, tech stack tagger, section designation, and edit/create modal.
- [x] `AdminBlogsTab.tsx` — Blog post manager, HTML/Markdown preview, and authoring form.
- [x] `AdminCertificatesTab.tsx` — Certification manager, credential IDs, and issuer manager.
- [x] `AdminContactsTab.tsx` — Inbound CRM leads hub, priority tagging, search filters, and canned responses engine.
- [x] `AdminSmtpTab.tsx` — SMTP diagnostics, Google App Passwords setup instructions, and transmission tester.
- [x] `AdminSettingsTab.tsx` — Live settings control, hero/bio editor, company services manager, skill matrix sliders, and social coordinates.
- [x] `AdminDeleteModal.tsx` — Reusable deletion confirmation modal.

---

## Phase 4: Resume Center & Solar Skills Map Decomposition
- [x] **Resume Center (`/src/components/resume/`)**:
  - `resumeTypes.ts` — Shared TypeScript types, persona meta presets, font themes, and accent interfaces.
  - `ResumeHeaderControls.tsx` — Persona switcher, ATS score badge, live draft edit trigger, markdown/text/JSON/PDF export triggers.
  - `ResumeConfigPanel.tsx` — Typography and accent customizer, visible section toggles, individual skill filter toggles, reset defaults.
  - `ResumeDocumentView.tsx` — Standard printable and exportable CV document layout with live inline draft editing.
- [x] **Solar Skills Map (`/src/components/skills/`)**:
  - `skillsTypes.ts` — Orbit definitions, category details, and intelligent Lucide icon resolver (`getSkillIcon`).
  - `SolarCanvas.tsx` — Concentric orbital animation, planetary node math, rotating satellites, hover tooltips, and pause/resume.
  - `SkillsLayerSelector.tsx` — Layer switcher buttons, active pulse indicators, and live telemetry terminal box.
  - `SkillsTelemetryPanel.tsx` — Target-locked HUD readout, active category telemetry list, and verified sync status.
  - `MatrixCategoryCard.tsx` — Alternative animated grid view with hover-to-reveal skill tags and search matching.

---

## Phase 5: Verification & Quality Assurance
- [x] Full TypeScript type check via `lint_applet` (`tsc --noEmit`).
- [x] Complete production bundle build verification via `compile_applet`.
- [x] UI component rendering and interaction integrity check.
