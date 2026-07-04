# Implementation Plan One — Signal Ledger MVP 1

This document outlines the detailed execution steps and progress checklists for building **Signal Ledger**, a premium research-grade search engine prototype for mock tech intelligence articles.

---

## Progress Summary

- **Phase 1: Mock Content Generation** — `[x]` Completed
- **Phase 2: Project Setup & Next.js Init** — `[ ]` Not Started
- **Phase 3: Core Search & URL Sync Hook** — `[ ]` Not Started
- **Phase 4: Base Layout & UI Shell** — `[ ]` Not Started
- **Phase 5: Search Results & Keyboard Controls** — `[ ]` Not Started
- **Phase 6: Premium Article Modal** — `[ ]` Not Started
- **Phase 7: Visual Polish & Verification** — `[ ]` Not Started

---

## Phase 1: Mock Content Generation
**Goal:** Create a robust, programmatic generation engine to output 100 high-quality, realistic technology and business intelligence articles, securing all content before building any UI.

### Tasks
- [x] Create `scripts/generate-mock-articles.js` in the workspace root.
- [x] Curate 7 sets of headline templates, introductions, analysis paragraphs, and conclusions matching our core categories:
  1. AI & Automation
  2. Software Trends
  3. Startup Moves
  4. Market Signals
  5. Product Strategy
  6. Digital Business
  7. Founder Stories
- [x] Implement a generation routine that combines these components dynamically to produce 100 unique articles, each with:
  - `id` (e.g. `post-001`)
  - `title` (realistic tech journalism title)
  - `slug` (URL-friendly string)
  - `description` (short, punchy summary)
  - `category` (one of the 7 above)
  - `tags` (3–6 highly relevant tags)
  - `author` (from a list of mock research authors)
  - `date` (realistic publication dates in 2026)
  - `readTime` (calculated or matched e.g. `4 min read`)
  - `content` (400–800 words of readable tech journalism content)
- [x] Output the final array of 100 articles to `planning/mock-articles.json`.
- [x] Verify content quality and diversity (ensuring multiple keywords can be searched across different fields).

---

## Phase 2: Project Setup & Next.js Init
**Goal:** Initialize the Next.js repository with TypeScript, global CSS design systems, and key search dependencies.

### Tasks
- [ ] Run `npx create-next-app@latest --help` to identify flags for non-interactive setup.
- [ ] Initialize the Next.js application in the root directory (excluding Tailwind CSS, using App Router, TypeScript, and ESLint).
- [ ] Install `minisearch` as a dependency.
- [ ] Relocate the generated `mock-articles.json` into the `public/` directory (or configure a local import module) so it's accessible client-side.
- [ ] Configure `app/globals.css` with the visual design system tokens (CSS properties like `--background: #F7F8FA`, `--surface: #FFFFFF`, `--accent: #2563EB`, and standard spacing tokens).
- [ ] Confirm baseline Next.js development server runs using `npm run dev`.

---

## Phase 3: Core Search & URL Sync Hook
**Goal:** Create the client-side search engine and query-state synchronizer using MiniSearch and Next.js routers.

### Tasks
- [ ] Create a utility hook `hooks/useArticleSearch.ts` that loads the 100 mock articles.
- [ ] Initialize MiniSearch:
  - Search fields: `title`, `tags`, `description`, `category`, `content`.
  - Boost factors: Title (3.0), Tags (2.0), Description (1.5).
  - Search options: Prefix match enabled, fuzzy matching tolerance configured.
- [ ] Implement a highlight utility function that wraps matching terms inside `<mark>` tags based on MiniSearch match metadata.
- [ ] Implement a dynamic snippet extractor: if the search match lies within the content body, extract a ~150-character window around the first match and highlight it.
- [ ] Sync search inputs (`q`), category filters (`category`), and selected tags (`tags`) with the URL address bar via Next.js `useSearchParams` and `useRouter`.
- [ ] Add a 150ms debounce to prevent indexing lag on rapid typing.

---

## Phase 4: Base Layout & UI Shell
**Goal:** Build the outer shell layout conforming to the calm, research-style Visual Direction.

### Tasks
- [ ] Build the layout wrapper with `app/layout.tsx`.
- [ ] Create the `components/Header.tsx` showing the "Signal Ledger" logo, "Tech Intelligence Archive" label, and total article count ("100 mock articles").
- [ ] Create the `components/SearchHero.tsx` containing the hero text and the primary search bar.
- [ ] Build the styling for the large Search Input:
  - High focus contrast.
  - Large rounded border.
  - Interactive "Clear" (X) button when query has content.
  - Keyboard hint badge (`[/]` to focus).
- [ ] Design the horizontal category filter chips and popular tags selector.

---

## Phase 5: Search Results & Keyboard Controls
**Goal:** Implement the instant results area with match highlights and full keyboard usability.

### Tasks
- [ ] Create the list-style `components/ResultCard.tsx` following the exact hierarchy:
  1. Category/date metadata line.
  2. Title (with highlighted matches).
  3. Description or dynamic content snippet (with highlighted matches).
  4. Tags list and read time.
- [ ] Render the Results Summary Bar displaying query results counts (e.g. `24 results for "AI agents"` or `100 articles available`) with a visible "Clear filters" link.
- [ ] Build keyboard navigation inside `components/SearchInput.tsx` and the results wrapper:
  - Press `/` to focus the search bar.
  - Press `ArrowDown` / `ArrowUp` to change selection focus among result cards.
  - Press `Enter` to open the currently selected card.
  - Press `Esc` to clear search or close the modal.
- [ ] Render clear focused outline styles on active cards.

---

## Phase 6: Premium Article Modal
**Goal:** Create a high-readability modal overlay to preview articles without losing navigation context.

### Tasks
- [ ] Build `components/ArticleModal.tsx`.
- [ ] Implement scroll lock on the underlying body element when the modal is active.
- [ ] Build standard article layout: large title, author metadata, read-time, date, categories, and spaced out typographic styling for paragraphs.
- [ ] Trap keyboard focus inside the modal for accessibility.
- [ ] Sync modal open state to URL slug parameter `?article=slug`.
- [ ] Add closing actions: close button click, escape key, and background overlay click.

---

## Phase 7: Visual Polish & Verification
**Goal:** Implement final responsive design checks, empty states, and compile verification.

### Tasks
- [ ] Design the Empty State view shown when no results match: display a friendly message and 3–4 interactive search recommendations.
- [ ] Verify responsiveness: ensure horizontal scrolling chips on mobile, correct padding scales, and full-screen modal behavior.
- [ ] Perform a full accessibility run: check contrast ratios, keyboard-only navigation flow, and screen reader labels.
- [ ] Run `npm run build` to confirm zero compilation errors.
