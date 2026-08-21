# Project Refactoring Plan

## Phase 1: Clean Up Unused Fields
- **Goal:** Remove obsolete backend fields that are no longer used in the frontend.
- **Action:** Remove `proficiency` from `SkillItem` in `src/types.ts` and clean up `src/data.ts` accordingly.

## Phase 2: Expand SiteSettings for Hardcoded Content
- **Goal:** Make all remaining static texts fully dynamic and manageable via the Admin Console.
- **Action:** Update `SiteSettings` in `src/types.ts` with new fields:
  - Hero Stats (e.g. "3+ Years Experience", "15+ Systems Delivered", "100/100 Core Web Vitals").
  - Fourth Overview Stat (e.g. "Top 9% TryHackMe Context Rank").
- **Action:** Add these new fields to `DEFAULT_SETTINGS` in `src/data.ts`.

## Phase 3: Update Backend Store Logic
- **Goal:** Establish a pure database connection. Remove the `DEFAULT_*` fallback during regular reads so the application strictly runs off the database.
- **Action:** Modify `server-lib/store.ts`. If `database.json` (or Redis) is completely empty (initial run), seed it precisely once from `data.ts`. Afterwards, exclusively return database data (or null/error if missing), removing the live fallback.
- **Action:** Keep `data.ts` as a pure initial seed payload (fallback after proper testing).

## Phase 4: Map Frontend and Backend (UI Updates)
- **Goal:** Connect the UI and Admin Panel to the newly dynamic fields.
- **Action:** Update `AdminSettingsTab.tsx` to include input fields for the new stats.
- **Action:** Refactor `OverviewView.tsx` to pull these stats directly from `settings` instead of hardcoded strings.

## Phase 5: Final Review & Test
- **Goal:** Ensure the app compiles and runs perfectly with pure DB fetching.
