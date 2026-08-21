# TODO List

- [x] Remove `proficiency` from `SkillItem` in `src/types.ts`.
- [x] Remove all `proficiency` references from `src/data.ts`.
- [x] Add `hero_stats` and `overview_fourth_stat` to `SiteSettings` in `src/types.ts`.
- [x] Populate new settings fields in `DEFAULT_SETTINGS` in `src/data.ts`.
- [x] Update `server-lib/store.ts` to implement a strict one-time seed and remove the live fallback to `data.ts`.
- [x] Update `AdminSettingsTab.tsx` to allow editing of the new dynamic stats.
- [x] Update `OverviewView.tsx` to map to the new dynamic `settings` fields instead of hardcoded strings.
- [x] Restart dev server and verify the UI functions identically, but powered by the database.
- [x] Fix DB seed logic in store.ts to seed individual missing keys
- [x] Add 'contact_location' to SiteSettings and Admin CRM to remove hardcoded location string in App.tsx
