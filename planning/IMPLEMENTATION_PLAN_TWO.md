# Implementation Plan Two — Signal Ledger MVP 2 (Semantic Search)

This document outlines the detailed execution steps and progress checklists for building **Signal Ledger MVP 2.0**, integrating AI-powered semantic search, OpenAI embeddings, and Supabase pgvector.

---

## Progress Summary

- **Phase 1: Environment & Dependencies** — `[ ]` Planned
- **Phase 2: Database Migration & Schema Setup** — `[ ]` Planned
- **Phase 3: Seeding Database with OpenAI Embeddings** — `[ ]` Planned
- **Phase 4: Next.js Search Route Handler** — `[ ]` Planned
- **Phase 5: Search Hook Integration (Toggle & State)** — `[ ]` Planned
- **Phase 6: UI Refinement & Aesthetics** — `[ ]` Planned
- **Phase 7: Polish & Verification** — `[ ]` Planned

---

## Phase 1: Environment & Dependencies
**Goal:** Setup Supabase and OpenAI client dependencies and secure environment keys.

### Tasks
- [ ] Install `@supabase/supabase-js` package.
- [ ] Install `openai` package.
- [ ] Install dev dependency `tsx` (if not already present, to run the TypeScript seeding script).
- [ ] Create/configure `.env.local` containing:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENAI_API_KEY`
- [ ] Create a local `.env.example` in the workspace to document required variables.
- [ ] Verify Supabase client initialized correctly in server/client files.

---

## Phase 2: Database Migration & Schema Setup
**Goal:** Prepare the Supabase database instance with pgvector and custom RPC function for similarity search.

### Tasks
- [ ] Create `planning/supabase_schema.sql` file.
- [ ] Write schema statements to:
  - Enable `vector` extension if not exists.
  - Create `articles` table matching the schema fields (`id`, `title`, `slug`, `description`, `category`, `tags`, `author`, `date`, `read_time`, `content`, `embedding`).
  - Set column `embedding` as type `vector(1536)` (OpenAI standard dimensions).
  - Create HNSW index on the `embedding` column for cosine distance optimization.
- [ ] Write SQL function `match_articles` to perform cosine similarity calculations, apply threshold, handle category filter, and handle tags filter on-database.
- [ ] Instruct user to execute the script in Supabase SQL editor.

---

## Phase 3: Seeding Database with OpenAI Embeddings
**Goal:** Run a Node script to generate embeddings for all 100 mock articles and upload them to the Supabase database.

### Tasks
- [ ] Create seeding script `scripts/seed-supabase.ts`.
- [ ] Implement OpenAI embedding generation in the seed script using model `text-embedding-3-small`.
- [ ] Implement batched upload logic to upsert all 100 articles with vectors to Supabase.
- [ ] Add `"db:seed": "tsx scripts/seed-supabase.ts"` script to `package.json`.
- [ ] Run the seed script and verify database population in Supabase table view.

---

## Phase 4: Next.js Search Route Handler
**Goal:** Build a secure API Route Handler in Next.js to handle query embedding generation and similarity searches.

### Tasks
- [ ] Create Route Handler file `app/api/search/route.ts`.
- [ ] Handle query params/JSON body parsing: `query`, `category`, `tags`.
- [ ] Call OpenAI embedding API to convert user search query string into a 1536-dimensional vector.
- [ ] Perform Supabase RPC query using `match_articles` and passing the vector, category, tags, and similarity parameters.
- [ ] Configure similarity threshold (e.g., 0.25) to prevent completely unrelated matches.
- [ ] Implement proper error handling, empty query fallbacks, and response status codes.

---

## Phase 5: Search Hook Integration (Toggle & State)
**Goal:** Integrate the semantic search API route into `hooks/useArticleSearch.ts` and coordinate state.

### Tasks
- [ ] Extend hook state to include:
  - `searchMode` (state: `'keyword' | 'semantic'`)
  - `isLoading` (state: `boolean`)
- [ ] Update category/tag trigger functions to trigger fetch requests when `searchMode` is set to `'semantic'`.
- [ ] Implement debounced API requests to `/api/search` when typing inside the query bar in semantic mode.
- [ ] Support empty-query state (if query is empty, query all articles directly without calling embedding APIs).
- [ ] Integrate error handling and fallback states.

---

## Phase 6: UI Refinement & Aesthetics
**Goal:** Build premium UI components for search mode toggle, loading feedback, similarity badges, and hybrid highlighting.

### Tasks
- [ ] Create search mode toggle inside `components/SearchHero.tsx`:
  - Visual layout matching our premium visual direction.
  - Slidable background indicator pill with spring animation or clean CSS transitions.
- [ ] Build loading skeletons:
  - Pulsing gradients showing cards shape while fetching semantic matches.
- [ ] Modify `components/ResultCard.tsx` to:
  - Accept an optional `similarityScore` prop.
  - Display a badge with percentage match (e.g. `94% Match`) using appropriate premium colored styling (teal/green).
- [ ] Integrate hybrid highlighting:
  - Apply exact keyword matching to highlight titles and snippets if query terms exist, otherwise keep text plain.

---

## Phase 7: Polish & Verification
**Goal:** Execute complete responsiveness, accessibility, and build verification runs.

### Tasks
- [ ] Verify keyboard navigation:
  - Press `/` to focus the input bar.
  - Ensure arrow keys up/down navigate results list cleanly in both keyword and semantic search modes.
- [ ] Verify accessibility compliance:
  - Accessible contrast ratios for the toggle switch and the similarity score badge.
  - Keyboard access for the search mode toggle.
- [ ] Run `npm run build` to verify Next.js builds successfully.
- [ ] Perform visual audit of the app.
