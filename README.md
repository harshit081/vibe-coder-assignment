# Wobb Frontend Assignment — Submission

Influencer discovery app rebuilt as a polished React experience: 3D cylinder deck browsing, glassmorphism UI, persistent campaign roster, and full-page creator profiles.

**Repository:** https://github.com/harshit081/vibe-coder-assignment  
**Live demo:** _(not deployed — optional bonus)_

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run lint     # ESLint
```

Verified **2 July 2026**: `npm run build` and `npm run lint` both pass.

---

## What the app does

| Route | Experience |
|-------|------------|
| `/` | Discover creators on a draggable 3D cylinder deck. Filter by platform (Instagram, YouTube, TikTok), search by name/username, expand cards inline, and build a campaign roster. |
| `/profile/:username` | Full-page creator profile with video background, Wikipedia hero portrait, animated stats, and typewriter bio. `?platform=` query param is preserved. |

**Campaign roster** (discovery page):
- Add / remove creators with duplicate detection (`platform + username`)
- Drag-to-reorder, pin sidebar or open slide-over drawer
- Sort by name, subscribers, or platform
- Export as text summary or full JSON
- Persists to `localStorage` across sessions

Sample data:
- `src/assets/data/search/` — 10 profiles per platform
- `src/assets/data/profiles/` — detail JSON for all 30 searchable creators

---

## Assignment tasks — summary

### 1. Bugs & quality issues — **Done**

Fixed all identified starter issues (B1–B11):

| ID | Fix |
|----|-----|
| B1, B10 | Removed stale-closure click counter and debug `console.log` from `SearchPage` |
| B2, B3 | Corrected engagement rate (`×100`) and engagements count formatting on profile page |
| B4 | Case-insensitive, trimmed search for username and full name |
| B5 | Added 24 missing profile JSON files; all 30 search results now have detail data |
| B6 | Consolidated follower formatting into shared `formatters.ts` |
| B7, B8 | Added image `alt` text and `rel="noopener noreferrer"` on external links |
| B9 | Replaced fixed-width cards with responsive deck layout |
| B11 | Implemented working Add to List flow |

Full bug log: [`DEVELOPMENT.md`](DEVELOPMENT.md#known-starter-issues)

### 2. UI/UX redesign — **Done**

- **Discovery:** looping video background, glass control panel, platform bubble filter, 3D cylinder carousel with expand overlay, opacity depth fade, hover flip, click-to-open detail
- **Profile page:** dedicated full-page layout (not a modal), About + Performance sections, platform-themed glass UI
- **Roster:** glass outer shell, compact pinned mode, accessible drawer with backdrop dismiss
- **Motion:** animated stat counters, typewriter bio, deck interactions

### 3. Zustand state management — **Done**

Two focused stores (no React Context):

- `selectedListStore` — profiles, add/remove/clear, reorder, sort; persisted to `localStorage`
- `rosterUiStore` — pin state, sort preference

### 4. Select profile & Add to List — **Done**

- `AddToListButton` on deck cards, expanded showcase, and profile page
- Duplicate prevention with visual "Added" state
- Roster panel with remove, clear all, drag reorder
- Pin / drawer modes, download, and sort (extras beyond minimum)

### 5. Code quality & structure — **Done**

- Removed unused starter components (`Layout`, `ProfileList`, `ProfileCard`, `SearchBar`, `PlatformFilter`, `SelectedListPanel`, etc.)
- Split UI into focused modules: `deck/`, `search/`, `motion/`, roster components, shared `utils/`
- Typed stores and profile models in `types/index.ts`

### 6. Performance — **Partial**

- Profile JSON lazy-loaded per file via Vite `import.meta.glob` (each profile is its own chunk)
- Main JS bundle ~532 KB gzip ~169 KB — acceptable for assignment scope; route-level `React.lazy` would be the next optimization

### 7. Libraries — **Done**

See [Libraries added](#libraries-added) below.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| React 19 + TypeScript | UI |
| Vite 8 | Build |
| Tailwind CSS 4 | Styling |
| React Router 7 | `/` and `/profile/:username` |
| Zustand 5 | State + `persist` middleware |
| `@hello-pangea/dnd` | Roster drag-and-drop (React 19 compatible) |
| `framer-motion` | Deck card animations |
| `motion` | `AnimatedCounter`, `Typewriter` on profile page |

### Libraries added

| Package | Why |
|---------|-----|
| `zustand` | Selected list + roster UI state with localStorage persistence |
| `@hello-pangea/dnd` | Reorder roster; replaces deprecated `react-beautiful-dnd` (React 19 peer conflict) |
| `framer-motion` | Deck hover/flip and interaction polish |
| `motion` | Number and text animations on profile page |

---

## Architecture (high level)

```
SearchPage
├── VideoBackground
├── ProfileCardDeck          → CylinderProfileCard, ExpandedProfileShowcase
├── SearchControlPanel       → platform filter, search input
└── RosterSidebar / Drawer   → RosterPanel, download, sort, DnD

ProfileDetailPage
├── Hero (Wikipedia portrait + platform theme)
├── About (Typewriter bio)
└── Performance (AnimatedCounter stats)

Stores: selectedListStore, rosterUiStore
```

Detailed structure and changelog: [`DEVELOPMENT.md`](DEVELOPMENT.md)

---

## Assumptions

- **Duplicate IDs** use `platform + username` (username compared case-insensitively). The same person on two platforms can appear twice.
- **Generated profile JSON** (24 new files) extends search data with estimated fields (`posts_count`, `avg_likes`, etc.) where the starter search JSON lacked them. The original 6 rich profiles are unchanged.
- **YouTube** displays **subscribers**, not followers, in deck and roster.
- **Roster download:** Text = human-readable summary; JSON = complete profile objects.
- **Roster sort:** name, subscribers, or platform (Instagram → YouTube → TikTok). Sort UI hidden in compact pinned roster.
- **Roster UI** appears on the discovery page only; the profile page is a clean full-page view.
- **Wikipedia** REST API provides hero portraits where mapped in `wikipediaTitles.ts`; falls back to social avatar.

---

## Trade-offs

| Decision | Rationale |
|----------|-----------|
| Cylinder deck over flat grid | Stronger visual identity and delight; more custom pointer/drag math |
| Zustand over Context | Smaller API, built-in persist, no provider tree |
| Wikipedia + CSS cutout vs WASM background removal | Avoids heavy `@imgly/background-removal` bundle for assignment scope |
| Portal DnD previews to `document.body` | Fixes invisible drag clones inside `overflow: hidden` glass containers |
| Deleted starter components | Cleaner codebase; history preserved in git commits |
| No deployment yet | Core assignment complete; deploy is optional bonus |

---

## AI usage

AI tools (Cursor) were used during development for exploration, implementation, and documentation. All architectural decisions, trade-offs, and final code were reviewed and iterated on in this repository with meaningful commit history.

---

## Remaining improvements

If I had more time:

1. **Route lazy loading** — `React.lazy` for `SearchPage` / `ProfileDetailPage` to reduce initial bundle below 500 KB
2. **Deploy** — Vercel/Netlify with preview URL
3. **Tests** — unit tests for `rosterSort`, `rosterExport`, `dataHelpers` filter logic
4. **Accessibility pass** — keyboard navigation for cylinder deck, focus trap audit on drawer/dialog
5. **Image optimization** — responsive `srcset` for hero portraits

---

## Project layout

```
src/
├── pages/           SearchPage, ProfileDetailPage
├── components/
│   ├── deck/        Cylinder carousel + expanded showcase
│   ├── search/      SearchControlPanel
│   ├── motion/      AnimatedCounter, Typewriter
│   └── layout/      VideoBackground
├── store/           selectedListStore, rosterUiStore
├── utils/           formatters, profileLoader, rosterExport, rosterSort, …
└── assets/data/     search + profile JSON
```

---

## Submission checklist

- [x] `npm run build` passes
- [x] `npm run lint` passes
- [x] App runs without errors
- [x] Public GitHub repository: https://github.com/harshit081/vibe-coder-assignment
- [x] README documents changes, libraries, assumptions, trade-offs, and remaining work
- [x] Meaningful git commit history
- [ ] Live deployment URL _(optional bonus)_

---

## Further reading

- [`DEVELOPMENT.md`](DEVELOPMENT.md) — full changelog, bug tracker, interview prep notes
