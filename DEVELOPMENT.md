# Development Log — Wobb Frontend Assignment

> Living documentation for this submission. Update this file as work progresses; use it as the source of truth when writing the final README.

**Repository:** [Wobb vibe-coder-assignment](https://github.com/Wobb-ai/vibe-coder-assignment) (starter)  
**Deadline:** 2 July 2026, 2:00 PM IST (UTC+5:30)  
**Last updated:** 2 July 2026

---

## How to use this file

1. Add a dated entry under [Changelog](#changelog) for every meaningful change (bug fix, feature, refactor, dependency, UI pass).
2. Keep [Assignment progress](#assignment-progress) checkboxes in sync.
3. Record new libraries, assumptions, and trade-offs in their sections as decisions are made.
4. Before submission, copy the relevant sections into `README.md`.

---

## Assignment progress


| #   | Task                               | Status  | Notes                                                                                              |
| --- | ---------------------------------- | ------- | -------------------------------------------------------------------------------------------------- |
| 1   | Find and fix bugs / quality issues | Done    | B1–B11 resolved (see changelog)                                                                    |
| 2   | Redesign UI/UX                     | Done    | Cylinder deck, glass UI, video background, full-page profile                                       |
| 3   | Zustand state management           | Done    | `selectedListStore` + `rosterUiStore` with localStorage persist                                    |
| 4   | Select profile & Add to List       | Done    | Add, dedupe, view, remove, reorder, pin, download, sort                                            |
| 5   | Improve code quality & structure   | Done    | Dead starter components removed; roster/deck split into focused modules                            |
| 6   | Optimize performance               | Done    | Route-level lazy loading (React.lazy/Suspense). Initial chunk ~234 KB (gzip ~75 KB); warning removed |
| 7   | Libraries as needed                | Done    | `zustand`, `@hello-pangea/dnd`, `framer-motion`, `motion`; `vitest` for tests                      |
| —   | `npm run build` passes             | Done    | Verified 2 Jul 2026                                                                                |
| —   | `npm run lint` passes              | Done    | Verified 2 Jul 2026                                                                                |
| —   | `npm run test:run` passes          | Done    | 9 unit tests (sort/export/filter), verified 2 Jul 2026                                             |
| —   | Responsive / mobile pass           | Done    | Bottom control bar, full-width drawer, scaled typography, denser expanded card                     |
| —   | Final README (submission)          | Done    | Submission README written 2 Jul 2026                                                               |
| —   | Deploy (bonus)                     | Done    | [https://vibe-coder-assignment-ruddy.vercel.app/](https://vibe-coder-assignment-ruddy.vercel.app/) |


---

## Tech stack


| Layer       | Choice                                                                      |
| ----------- | --------------------------------------------------------------------------- |
| Framework   | React 19                                                                    |
| Language    | TypeScript                                                                  |
| Build       | Vite 8                                                                      |
| Styling     | Tailwind CSS 4                                                              |
| Routing     | React Router 7                                                              |
| State       | Zustand + persist (`selectedListStore`, `rosterUiStore`)                    |
| Drag & drop | `@hello-pangea/dnd` (roster reorder)                                        |
| Motion      | `motion` (AnimatedCounter, Typewriter), `framer-motion` (deck interactions) |


### Project structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── pages/
│   ├── SearchPage.tsx              # Video bg, deck, search controls, roster sidebar
│   └── ProfileDetailPage.tsx       # Full-page creator profile (About + Performance)
├── store/
│   ├── selectedListStore.ts        # Profiles list, add/remove/reorder/sort
│   └── rosterUiStore.ts            # Pin drawer, sort preference
├── components/
│   ├── AddToListButton.tsx
│   ├── HeroPortrait.tsx
│   ├── PlatformBadge.tsx
│   ├── PlatformBubbleFilter.tsx
│   ├── ProfilePicture.tsx
│   ├── VerifiedBadge.tsx
│   ├── RosterDrawer.tsx
│   ├── RosterDownloadDialog.tsx
│   ├── RosterIcons.tsx
│   ├── RosterPanel.tsx
│   ├── RosterSidebar.tsx
│   ├── RosterToolbar.tsx
│   ├── deck/
│   │   ├── ProfileCardDeck.tsx     # Cylinder carousel + expand overlay
│   │   ├── CylinderProfileCard.tsx
│   │   ├── ExpandedProfileShowcase.tsx
│   │   └── cylinderMath.ts
│   ├── layout/
│   │   └── VideoBackground.tsx
│   ├── motion/
│   │   ├── AnimatedCounter.tsx
│   │   └── Typewriter.tsx
│   └── search/
│       └── SearchControlPanel.tsx
├── hooks/
│   └── useHeroPortrait.ts
├── utils/
│   ├── dataHelpers.ts
│   ├── formatters.ts
│   ├── profileLoader.ts
│   ├── profileStats.ts
│   ├── rosterExport.ts
│   ├── rosterSort.ts
│   ├── selectedProfileId.ts
│   └── wikipedia.ts
├── theme/
│   └── platformThemes.ts
├── types/index.ts
├── data/wikipediaTitles.ts
└── assets/data/
    ├── search/                     # instagram, youtube, tiktok (10 profiles each)
    └── profiles/                   # 30 detail JSON files
```

### Routes


| Path                 | Page                | Description                                              |
| -------------------- | ------------------- | -------------------------------------------------------- |
| `/`                  | `SearchPage`        | Cylinder deck discovery, platform filter, search, roster |
| `/profile/:username` | `ProfileDetailPage` | Full-page creator profile; `?platform=` preserved        |


---

## Known starter issues

Issues identified during initial analysis (intentional bugs / quality gaps in the starter).


| ID  | Area     | Issue                                                                                          | File(s)                                    | Fixed                |
| --- | -------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------ | -------------------- |
| B1  | State    | Stale closure: `setClickCount(clickCount + 1)`                                                 | `SearchPage.tsx`                           | Yes                  |
| B2  | Display  | Engagement rate multiplied by `10000` instead of `100`                                         | `ProfileDetailPage.tsx`                    | Yes                  |
| B3  | Display  | "Engagements" stat uses `formatEngagementRate(rate)` instead of formatting `engagements` count | `ProfileDetailPage.tsx`                    | Yes                  |
| B4  | Search   | Username filter is case-sensitive; full name is case-insensitive                               | `dataHelpers.ts`                           | Yes                  |
| B5  | Data     | Only 6/30 search profiles have detail JSON; others show load error                             | `assets/data/profiles/`                    | Yes (24 files added) |
| B6  | DRY      | Duplicate follower formatting in card, detail page, and `formatters.ts`                        | Multiple                                   | Yes                  |
| B7  | A11y     | Images missing `alt` text                                                                      | `CylinderProfileCard`, `ProfileDetailPage` | Yes                  |
| B8  | Security | External link missing `rel="noopener noreferrer"`                                              | `ProfileDetailPage.tsx`                    | Yes                  |
| B9  | Layout   | Fixed `w-[700px]` on cards — not responsive                                                    | Replaced by deck layout                    | Yes                  |
| B10 | Debug    | `console.log` left in click handler                                                            | `SearchPage.tsx`                           | Yes                  |
| B11 | Feature  | "Add to List" disabled stub                                                                    | `AddToListButton` wired everywhere         | Yes                  |


---

## Libraries

### Added


| Package                            | Version  | Reason                                           | Date        |
| ---------------------------------- | -------- | ------------------------------------------------ | ----------- |
| `@hello-pangea/dnd`                | ^18.0.1  | Drag-to-reorder roster; React 19 compatible      | 30 Jun 2026 |
| `zustand`                          | ^5.0.14  | Selected profiles + roster UI state with persist | 30 Jun 2026 |
| `framer-motion`                    | ^12.42.1 | Deck card hover/flip animations                  | 1 Jul 2026  |
| `motion`                           | ^12.42.2 | AnimatedCounter + Typewriter on profile page     | 1 Jul 2026  |
| `vitest` (+ `@vitest/coverage-v8`) | ^4.1.9   | Unit tests for pure logic (sort/export/filter)   | 2 Jul 2026  |


### Removed / replaced


| Package               | Replaced by         | Reason                                             | Date        |
| --------------------- | ------------------- | -------------------------------------------------- | ----------- |
| `react-beautiful-dnd` | `@hello-pangea/dnd` | Peer dependency conflict with React 19; deprecated | 30 Jun 2026 |


---

## Assumptions


| Date        | Assumption                                                                                                                                      |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 30 Jun 2026 | Generated profile JSON uses search data plus estimated extended stats where the search JSON did not include them.                               |
| 30 Jun 2026 | All 30 search profiles now have detail JSON; summary fallback in `profileLoader` remains as a safety net.                                       |
| 30 Jun 2026 | Duplicate detection uses `platform + username` (case-insensitive username in ID). Same creator on different platforms can appear twice.         |
| 30 Jun 2026 | List order is user-controlled via drag-and-drop and persisted to localStorage.                                                                  |
| 1 Jul 2026  | YouTube cards show **subscribers** (not followers) in deck and roster stats.                                                                    |
| 1 Jul 2026  | Roster download: Text = abstract summary; JSON = full profile objects.                                                                          |
| 1 Jul 2026  | Roster sort options: name, subscribers, platform (IG → YT → TikTok). Hidden in compact/short roster views.                                      |
| 2 Jul 2026  | Pinned roster is discovery-page only; creator profile page has no roster chrome.                                                                |
| 2 Jul 2026  | Mobile breakpoint is `< 1024px` (`lg`): bottom control bar + full-width drawer; desktop keeps the floating right sidebar + pinned roster.       |
| 2 Jul 2026  | Tests focus on pure logic (`rosterSort`, `rosterExport`, `dataHelpers`) rather than DOM/component rendering, to stay fast and dependency-light. |


---

## Trade-offs


| Date        | Decision                                                                                  | Trade-off                                                            |
| ----------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 30 Jun 2026 | Removed unused click-tracking state from `SearchPage` instead of fixing the stale closure | Cleaner code; no analytics hook remains for profile clicks           |
| 30 Jun 2026 | Zustand over React Context                                                                | Lighter API, built-in persist middleware, no provider wrapper needed |
| 1 Jul 2026  | Cylinder deck over flat grid                                                              | Higher interaction polish; more custom math and pointer handling     |
| 1 Jul 2026  | Portal drag previews to `document.body`                                                   | Fixes invisible DnD cards; slightly more DOM complexity              |
| 1 Jul 2026  | Wikipedia hero + CSS cutout instead of WASM background removal                            | Smaller bundle; good enough visual for assignment scope              |
| 2 Jul 2026  | Deleted unused starter components instead of keeping for reference                        | Cleaner tree; history preserved in git                               |
| 2 Jul 2026  | Responsive via Tailwind breakpoints (no separate mobile components/JS)                    | Simple, low-risk before deadline; some class-level duplication       |
| 2 Jul 2026  | Vitest unit tests scoped to pure utils (no component/RTL tests yet)                       | Fast, minimal setup; UI regressions not covered by tests             |


---

## Changelog

Newest entries first.

### 2026-07-02 — Responsive / mobile pass & expanded card polish

### 2026-07-02 — Route-level code splitting (simple win)

- Lazy-loaded `SearchPage` and `ProfileDetailPage` from `App.tsx` using `React.lazy` + `Suspense` fallback.
- Build output now emits separate chunks: `index` (~234 KB), `SearchPage` (~26 KB), `ProfileDetailPage` (~139 KB).

**Verification:** `npm run build`, `npm run lint`, `npm run test:run` pass.

---

**Mobile layout (`< 1024px`)**

- `SearchPage`: search + roster moved to a fixed **bottom control bar**; floating right sidebar and pinned roster are now desktop-only (`lg`).
- `RosterDrawer`: full-width on mobile, side panel from `sm`.
- Deck: mobile orbit card sizing tuned; hint text swaps to "Swipe to browse · tap to open".

**Typography / chrome scaling**

- Reduced mobile text and control sizes across deck cards, platform bubbles, `SearchControlPanel`, `AddToListButton`, `PlatformBadge`, `RosterToolbar`, and `ProfileDetailPage`.

**Expanded showcase (`ExpandedProfileShowcase`)**

- Performance grid switched to a denser **3-column** layout on mobile to stop stat boxes eating horizontal space.
- Kept a generous card height and restored the hero image height (`h-40`) after an over-aggressive trim.

**Verification:** `npm run build`, `npm run lint`, `npm run test:run` pass.

---

### 2026-07-02 — Unit tests (Vitest)

- Added `vitest` + `@vitest/coverage-v8`; scripts `test`, `test:run`, `test:coverage`.
- Configured `vitest/config` in `vite.config.ts` (node environment, `src/**/*.test.ts`).
- Tests for pure logic: `rosterSort` (name/subscribers/platform), `rosterExport` (text + JSON shape), `dataHelpers` (filter/lookup/labels). **9 tests passing.**

---

### 2026-07-02 — Dead code cleanup & doc sync

**Removed (unused starter / superseded components)**

- `Layout.tsx`, `ProfileList.tsx`, `ProfileCard.tsx`, `SearchBar.tsx`, `PlatformFilter.tsx`, `SelectedListPanel.tsx`
- `StatCard.tsx` (replaced by inline stats on profile page)
- `layout/GlassPanel.tsx` (glass styles live in `index.css` utilities)
- `hooks/useHoverReveal.ts`, `hooks/useMediaQuery.ts` (never wired)

**Documentation**

- Synced `DEVELOPMENT.md` with current architecture, libraries, and assignment status.

**Verification:** `npm run build` and `npm run lint` pass.

---

### 2026-07-02 — Roster download & sorting

**Download**

- `RosterDownloadDialog` — portaled to `document.body` at `z-[90]`; Text (abstract) vs JSON (complete) export via `rosterExport.ts`

**Sort**

- `rosterSort.ts` + store integration; sort by name, subscribers, platform
- Sort UI in `RosterSidebar` toolbar (hidden when `compact={true}`)

---

### 2026-07-02 — Compact pinned roster

- Pinned roster shows name + username only (no follower line)
- Sort controls hidden in compact/short roster height

---

### 2026-07-01 — DnD fixes (invisible card + auto-scroll)

- Drag preview portaled to `document.body` when `snapshot.isDragging`
- Scroll container moved to Droppable `<ul>` in `RosterPanel` (not outer sidebar wrapper)

---

### 2026-07-01 — Profile page motion & stats

- `AnimatedCounter` on performance stats; `Typewriter` on bio
- `profileStats.ts` — shared stat definitions with glow on first 3 metrics
- `motion` package added

---

### 2026-07-01 — Full-page creator profile redesign

- `ProfileDetailPage` — dedicated page layout with video background and glass sections
- About section (description moved out of hero); Performance bento grid
- No roster sidebar on profile route

---

### 2026-07-01 — Roster UI rework (glass deck aesthetic)

- `RosterSidebar`, `RosterPanel`, `RosterDrawer`, `RosterToolbar` — glass outer wrapper; solid inner list rows
- Pin/unpin roster; drawer slides over search; star always opens drawer
- Fixed z-index overlap with `SearchControlPanel` (hidden when drawer open)
- Fixed horizontal scrollbar (`overflow-x-hidden`, `min-w-0` chain)
- `rosterUiStore` for pin + sort preference

---

### 2026-07-01 — Cylinder deck & expanded showcase

**Deck**

- `ProfileCardDeck` — 3D cylinder carousel with drag, click-to-expand, opacity fade (front 100% / back ~14%)
- `CylinderProfileCard`, `ExpandedProfileShowcase`, `cylinderMath.ts`
- Hover flip, performance stat glow on first 3 stats
- YouTube shows subscribers label

**Search layout**

- `VideoBackground`, `SearchControlPanel` (right glass sidebar)
- `PlatformBubbleFilter` replaces old platform pills

**Dependencies:** `framer-motion` added.

---

### 2026-06-30 — Search screen full-width redesign

- Roster moved to slide-over drawer; full-viewport discovery layout
- Poster-style grid iteration (later superseded by cylinder deck)

---

### 2026-06-30 — Showoff UI/UX redesign

- Dark theme, platform color system, Wikipedia hero portraits
- `HeroPortrait`, `useHeroPortrait`, `wikipediaTitles.ts`, `platformThemes.ts`

---

### 2026-06-30 — Zustand store & Add to List feature

- `selectedListStore` with persist; `AddToListButton`; initial `SelectedListPanel` + `Layout` (later removed)

---

### 2026-06-30 — Profile JSON data for all search cards

- 24 new profile JSON files; 3 YouTube username fixes; all 30 profiles covered

---

### 2026-06-30 — Starter bug fixes (B1–B10)

- SearchPage stale closure / console.log removed
- ProfileDetailPage engagement stats, alt text, `rel="noopener noreferrer"`
- dataHelpers case-insensitive search; shared formatters

---

### 2026-06-30 — Project setup & analysis

- Created `DEVELOPMENT.md`; replaced `react-beautiful-dnd` with `@hello-pangea/dnd`

---

## Remaining work (high level)

1. ~~Fix starter bugs (B1–B11).~~
2. ~~Implement Zustand store with localStorage persistence.~~
3. ~~Build Add to List UI with reorder, pin, download, sort.~~
4. ~~Full UI/UX redesign (cylinder deck, glass roster, profile page).~~
5. ~~Remove dead starter components.~~
6. ~~Update submission `README.md` from this file.~~
7. ~~Add unit tests (Vitest) for core utils.~~
8. ~~Responsive / mobile pass.~~
9. ~~Deploy to Vercel.~~
10. *(Optional)* Bundle chunk tuning / manual chunks (if needed beyond route-splitting).
11. *(Optional)* Expand tests to stores + a component smoke test.

---

## Submission checklist (copy to README when done)

- [x] `npm run build` passes
- [x] `npm run lint` passes
- [x] App runs without errors
- [x] Public GitHub repo URL shared before deadline
- [x] README describes: changes, libraries, assumptions, trade-offs, remaining improvements
- [x] Meaningful git commit history
- [x] *(Optional)* Live deployment URL in README