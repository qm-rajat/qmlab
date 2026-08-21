# Application Architecture

## Overview
This application uses a full-stack Express + Vite architecture.
- **Frontend**: React, Tailwind CSS, Lucide Icons, Framer Motion for animations.
- **Backend**: Node.js, Express.js.
- **Database**: Dual-strategy persistence (Redis primary, Local JSON fallback).

## Data Flow (Before Refactoring)
1. `usePortfolioData.ts` initializes with `DEFAULT_*` objects from `src/data.ts`.
2. A `useEffect` hook triggers a `fetch('/api/content')`.
3. Express router calls `getSettings()`, `getProjects()`, etc., from `store.ts`.
4. `store.ts` checks Redis or Local JSON. If keys are missing, it silently falls back to `DEFAULT_*` from `data.ts`.

## Data Flow (After Refactoring)
1. `data.ts` is purely a **Seed File**.
2. On server start, `store.ts` checks if the database is empty. If it is, it executes a one-time seed from `data.ts`.
3. When the frontend requests `/api/content`, `store.ts` serves **only** the data stored in the database. There is no silent fallback during reads.
4. The Admin Console (`AdminConsole.tsx`) sends `PUT` requests to update the database. These changes are immediately reflected on the frontend.

## Key Frontend Modules
- **`App.tsx`**: Main entry and layout wrapper.
- **`OverviewView.tsx`**: Home dashboard, dynamically pulling hero stats from Settings.
- **`AdminConsole.tsx`**: Secure CRM and settings management panel.

## Phase 2: Modular Controller-Based Backend Redesign

The monolithic `server.ts` has been refactored into a scalable structure:
- **`server.ts`**: Thin entry point (Express app setup & Vite middleware).
- **`server/routes/`**: Distinct API routers (`admin.routes.ts`, `seo.routes.ts`, `contact.routes.ts`, `public.routes.ts`).
- **`server/services/`**: Encapsulated business logic for external integrations (`mail.service.ts` for SMTP, `ai.service.ts` for Gemini).
- **`server/lib/`**: Core utilities (`store.ts` for JSON database persistence, `auth.ts` for admin sessions).
