# Development Log — Wobb Frontend Assignment

> Living documentation for this submission. Update this file as work progresses; use it as the source of truth when writing the final README.

**Repository:** [Wobb vibe-coder-assignment](https://github.com/Wobb-ai/vibe-coder-assignment) (starter)  
**Deadline:** 2 July 2026, 2:00 PM IST (UTC+5:30)  
**Last updated:** 30 June 2026 (starter bug fixes)

---

## How to use this file

1. Add a dated entry under [Changelog](#changelog) for every meaningful change (bug fix, feature, refactor, dependency, UI pass).
2. Keep [Assignment progress](#assignment-progress) checkboxes in sync.
3. Record new libraries, assumptions, and trade-offs in their sections as decisions are made.
4. Before submission, copy the relevant sections into `README.md`.

---

## Assignment progress

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Find and fix bugs / quality issues | Done | B1–B10 resolved (see changelog) |
| 2 | Redesign UI/UX | Not started | Current UI is minimal starter layout |
| 3 | Zustand state management | Done | `selectedListStore` with localStorage persist |
| 4 | Select profile & Add to List | Done | Add, dedupe, view, remove, reorder, persist |
| 5 | Improve code quality & structure | Not started | |
| 6 | Optimize performance | Not started | |
| 7 | Libraries as needed | In progress | `@hello-pangea/dnd` added (see changelog) |
| — | `npm run build` passes | Done | Verified 30 Jun 2026 |
| — | `npm run lint` passes | Done | Verified 30 Jun 2026 |
| — | Final README (submission) | Not started | Derive from this file |
| — | Deploy (bonus) | Not started | Optional |

---

## Tech stack (baseline)

| Layer | Choice |
|-------|--------|
| Framework | React 19 |
| Language | TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| State (current) | Zustand + persist |
| Drag & drop | `@hello-pangea/dnd` (selected list reorder) |

### Project structure (baseline)

```
src/
├── App.tsx                 # Routes: /, /profile/:username
├── main.tsx
├── index.css
├── pages/
│   ├── SearchPage.tsx      # Platform filter, search, profile list
│   └── ProfileDetailPage.tsx
├── store/
│   └── selectedListStore.ts  # Zustand + localStorage persist
├── components/
│   ├── AddToListButton.tsx
│   ├── SelectedListPanel.tsx
│   ├── Layout.tsx
│   ├── PlatformFilter.tsx
│   ├── ProfileList.tsx
│   ├── ProfileCard.tsx
│   ├── SearchBar.tsx       # (unused in current wiring)
│   └── VerifiedBadge.tsx
├── utils/
│   ├── dataHelpers.ts      # Platform data, filter, labels
│   ├── profileLoader.ts    # Dynamic JSON load via import.meta.glob
│   └── formatters.ts
├── types/index.ts
└── assets/data/
    ├── search/             # instagram, youtube, tiktok (10 profiles each)
    └── profiles/           # 30 detail JSON files (all search profiles)
```

### Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | `SearchPage` | Browse and search influencers by platform |
| `/profile/:username` | `ProfileDetailPage` | Detail view; `?platform=` query param preserved |

---

## Known starter issues

Issues identified during initial analysis (intentional bugs / quality gaps in the starter).

| ID | Area | Issue | File(s) | Fixed |
|----|------|-------|---------|-------|
| B1 | State | Stale closure: `setClickCount(clickCount + 1)` | `SearchPage.tsx` | Yes |
| B2 | Display | Engagement rate multiplied by `10000` instead of `100` | `ProfileDetailPage.tsx` | Yes |
| B3 | Display | "Engagements" stat uses `formatEngagementRate(rate)` instead of formatting `engagements` count | `ProfileDetailPage.tsx` | Yes |
| B4 | Search | Username filter is case-sensitive; full name is case-insensitive | `dataHelpers.ts` | Yes |
| B5 | Data | Only 6/30 search profiles have detail JSON; others show load error | `assets/data/profiles/` | Yes (24 files added) |
| B6 | DRY | Duplicate follower formatting in card, detail page, and `formatters.ts` | Multiple | Yes |
| B7 | A11y | Images missing `alt` text | `ProfileCard`, `ProfileDetailPage` | Yes |
| B8 | Security | External link missing `rel="noopener noreferrer"` | `ProfileDetailPage.tsx` | Yes |
| B9 | Layout | Fixed `w-[700px]` on cards — not responsive | `ProfileCard.tsx` | Yes |
| B10 | Debug | `console.log` left in click handler | `SearchPage.tsx` | Yes |
| B11 | Feature | "Add to List" disabled stub | `ProfileCard`, `ProfileDetailPage` | Yes |

---

## Libraries

### Added

| Package | Version | Reason | Date |
|---------|---------|--------|------|
| `@hello-pangea/dnd` | ^18.0.1 | Drop-in replacement for deprecated `react-beautiful-dnd`; supports React 19. Intended for reordering the selected list. | 30 Jun 2026 |

### Removed / replaced

| Package | Replaced by | Reason | Date |
|---------|-------------|--------|------|
| `react-beautiful-dnd` | `@hello-pangea/dnd` | Peer dependency conflict with React 19; package is deprecated | 30 Jun 2026 |

| `zustand` | ^5.x | Selected profiles list with `persist` middleware (localStorage) | 30 Jun 2026 |

---

## Assumptions

_Document decisions here as they are made._

| Date | Assumption |
|------|------------|
| 30 Jun 2026 | Generated profile JSON uses search data plus estimated extended stats where the search JSON did not include them. |
| 30 Jun 2026 | All 30 search profiles now have detail JSON; summary fallback in `profileLoader` remains as a safety net. |
| 30 Jun 2026 | Duplicate detection uses `platform + username` (case-insensitive username in ID). Same creator on different platforms can appear twice. |
| 30 Jun 2026 | List order is user-controlled via drag-and-drop and persisted to localStorage. |

---

## Trade-offs

_Document deliberate compromises here._

| Date | Decision | Trade-off |
|------|----------|-----------|
| 30 Jun 2026 | Removed unused click-tracking state from `SearchPage` instead of fixing the stale closure | Cleaner code; no analytics hook remains for profile clicks |
| 30 Jun 2026 | Zustand over React Context | Lighter API, built-in persist middleware, no provider wrapper needed |

---

## Changelog

Newest entries first.

### 2026-06-30 — Zustand store & Add to List feature

**Dependencies**
- Added `zustand` with `persist` middleware.

**Store** (`src/store/selectedListStore.ts`)
- `addProfile(profile, platform)` — returns `false` if duplicate
- `removeProfile(id)`, `clearList()`, `reorderProfiles(start, end)`
- `isSelected(platform, username)` for button state
- Persisted to `localStorage` key `wobb-selected-profiles`

**Components**
- `AddToListButton` — wired in `ProfileCard` and `ProfileDetailPage`; shows "Added" when duplicate
- `SelectedListPanel` — sidebar list with remove, clear all, drag-to-reorder (`@hello-pangea/dnd`)
- `Layout` — two-column layout with sticky list panel + selected count in header

**Types**
- `SelectedProfile` interface in `types/index.ts`
- `getSelectedProfileId()` helper for stable dedupe keys

**Verification:** `npm run build` and `npm run lint` pass.

---

### 2026-06-30 — Profile JSON data for all search cards

**Data**
- Added **24 new profile detail JSON files** under `src/assets/data/profiles/` for every search result that was missing one (21 on first pass + 3 YouTube channels).
- Fixed **3 YouTube search entries** (`VladandNiki`, `KidsDianaShow`, `LikeNastyaofficial`) that had no `username` field — cards could not link to a detail page.
- Added `scripts/generate-missing-profiles.mjs` to regenerate missing files from search data if needed.

**Coverage:** All **30** searchable profiles (10 per platform) now have matching detail JSON.

**Note:** Generated profiles use search data as the source of truth and include estimated fields (`posts_count`, `avg_likes`, `avg_comments`) where the starter search JSON did not provide them. Original 6 profiles retain their full rich datasets.

**Verification:** `npm run build` passes; Vite code-splits each new profile JSON.

---

### 2026-06-30 — Starter bug fixes (B1–B10)

**SearchPage**
- Removed unused `clickCount` state, stale-closure bug, and debug `console.log` (B1, B10).
- Removed unused `onProfileClick` prop from `ProfileList` / `ProfileCard`.

**ProfileDetailPage**
- Fixed engagement rate display to use `formatEngagementRate` (`× 100`, not `× 10000`) (B2).
- Fixed "Engagements" stat to format the engagements count via `formatFollowers` (B3).
- Added `alt` text on profile image (B7).
- Added `rel="noopener noreferrer"` on external profile link (B8).
- Fixed stale data on navigation by deriving loading state from `loadedUsername !== username`.
- Validates `platform` query param; shows summary banner when detail JSON is unavailable.

**ProfileCard**
- Replaced fixed `w-[700px]` with responsive `w-full`; list container uses `max-w-3xl` (B9).
- Added `alt` text on avatar (B7).
- Uses shared `formatFollowersLabel` formatter (B6).

**dataHelpers**
- Search filter is now case-insensitive for both username and full name; trims whitespace (B4).
- Added `findProfileByUsername` helper for profile lookup by platform.

**formatters**
- Added `formatFollowersLabel`; consolidated follower formatting (B6).
- Uses `toLocaleString()` for raw counts under 1K.

**profileLoader**
- Case-insensitive JSON file lookup (fixes `MrBeast6000` vs path mismatches).
- Falls back to search summary data when no detail JSON exists (B5).
- Exported `isDetailedProfile` to distinguish full vs summary views.

**Verification:** `npm run build` and `npm run lint` pass.

---

### 2026-06-30 — Project setup & analysis

**Documentation**
- Created `DEVELOPMENT.md` as the living log for all assignment work.
- Completed full codebase and assignment document review.

**Dependencies**
- Replaced `react-beautiful-dnd` with `@hello-pangea/dnd@^18.0.1` to resolve `npm install` ERESOLVE conflict with React 19.
- `npm install` succeeds; build and lint pass.

**Analysis notes (no code changes yet)**
- Assignment requires Zustand for selected-list state; starter has no React Context to replace.
- `@hello-pangea/dnd` is in dependencies but not yet used in source.
- Profile detail JSON exists for only 6 usernames: `cristiano`, `instagram`, `khaby.lame`, `mrbeast`, `MrBeast6000`, `tseries`.

---

## Remaining work (high level)

1. ~~Fix starter bugs (B1–B10).~~
2. ~~Implement Zustand store with localStorage persistence for selected profiles.~~
3. ~~Build Add to List UI: add, dedupe, view, remove, optional drag reorder.~~
4. Full UI/UX redesign (responsive, accessible, polished).
5. Refactor structure, consolidate formatters, add memoization where useful.
6. Update submission `README.md` from this file.
7. _(Optional)_ Deploy to Vercel / Netlify / GitHub Pages.

---

## Submission checklist (copy to README when done)

- [ ] `npm run build` passes
- [ ] App runs without errors
- [ ] Public GitHub repo URL shared before deadline
- [ ] README describes: changes, libraries, assumptions, trade-offs, remaining improvements
- [ ] Meaningful git commit history
- [ ] _(Optional)_ Live deployment URL in README

---

## Interview prep notes

_Brief bullets on why key decisions were made — useful if asked to explain the submission._

- _To be filled as implementation proceeds._
