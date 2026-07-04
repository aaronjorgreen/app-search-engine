# MVP 1 — Blog Search Engine SaaS Prototype

## Product Concept

Build a premium, elegant research-style blog search platform using fully mocked content.

The product is not a normal blog first. It is a search-first SaaS prototype that demonstrates how fast, useful, and polished a client-side searchable content experience can feel.

The MVP should focus on instant keyword-based search across a fixed mock content library.

MVP 2 will introduce AI semantic search, vector embeddings, and deeper intent-based discovery. That functionality should not be introduced into MVP 1.

---

## Working Product Name

**Signal Ledger**

### Persona

Signal Ledger is a mock premium tech intelligence publication covering:

- AI and automation
- Software trends
- Startup moves
- Market signals
- Product strategy
- Digital business stories
- Founder/operator insights

The tone should feel calm, sharp, credible, and modern — closer to a premium research platform than a casual blog.

---

## MVP 1 Goal

Create a functional SaaS-style prototype where users can instantly search and browse a mock library of 100 tech/business articles.

The main goal is to prove the search experience:

- Fast
- Clean
- Useful
- Visually premium
- Easy to browse
- Clear enough to upgrade later into semantic AI search

---

## MVP 1 Scope

### Included

- 100 dummy/mock blog posts
- Client-side searchable index
- Search across:
  - Title
  - Description
  - Tags
  - Category
  - Content
- Instant results while typing
- No search button required
- Highlight matching keywords in results
- Category browsing
- Tag filtering
- Article preview modal
- URL state synchronization (sync search query, category, tags, and active article to URL query params)
- Keyboard shortcuts (`/` to focus search, `Esc` to clear search or close modal, `Up`/`Down`/`Enter` to navigate and select search results)
- Dynamic match excerpt snippet generation (showing relevant snippet of content body around match)
- Elegant empty states
- Responsive desktop and mobile layout

### Excluded From MVP 1

- AI semantic search
- Vector embeddings
- Database search queries per keystroke
- User accounts
- Saved searches
- Admin publishing tools
- Real blog CMS
- Real market/news data
- Comments
- Payments
- Personalisation

---

## Recommended Stack

Use Next.js for a polished SaaS-style prototype.

For MVP 1, content should live in a local JSON file or static data module.

No backend database is required for search.

---

## Recommended Search Library

Use **MiniSearch** for MVP 1.

Why:

- Free
- Browser-friendly
- Designed for in-memory full-text search
- Supports field-based search
- Supports prefix search
- Supports fuzzy matching
- Fast enough for 100 mock articles
- Easy to upgrade or replace later

Alternative: Fuse.js is acceptable if the build needs a simpler fuzzy-search setup, but MiniSearch is the cleaner default for this product direction.

---

## Content Model

Each article should use a consistent structure.

```json
{
  "id": "post-001",
  "title": "AI Agents Are Moving From Demos to Daily Operations",
  "slug": "ai-agents-daily-operations",
  "description": "A practical look at how mock companies are using AI agents across support, sales, and internal workflows.",
  "category": "AI & Automation",
  "tags": ["AI agents", "automation", "operations", "SaaS"],
  "author": "Maya Chen",
  "date": "2026-06-18",
  "readTime": "5 min read",
  "content": "Full mock article body goes here..."
}
```

---

## Content Requirements

Create **100 mock articles** across 6–7 categories.

Recommended categories:

1. AI & Automation
2. Software Trends
3. Startup Moves
4. Market Signals
5. Product Strategy
6. Digital Business
7. Founder Stories

Each article should include:

- Strong title
- Short description
- Category
- 3–6 tags
- Author
- Date
- Read time
- 400–800 words of mock article content

The content does not need to be real news. It should feel realistic enough to make search meaningful.

---

## Core User Experience

### Primary Experience

The user lands on a refined research-style search interface.

They can:

1. Start typing immediately
2. See results update in real time
3. See matching words highlighted
4. Filter by category or tag
5. Open an article in a modal
6. Return to search without losing context
7. Share search results and specific articles directly via bookmarkable URLs (URL state synchronization)
8. Navigate search results and control the UI fully via keyboard shortcuts

The experience should feel like a mix between:

- A premium blog archive
- A command palette
- A lightweight research database

---

## Main Screens and Components

### 1. Search Home

Purpose: Make the product feel focused and premium immediately.

Include:

- Large search input
- Short positioning line
- Category chips
- Popular tags
- Featured or recent articles
- Total article count

Suggested hero copy:

> Search mock technology, AI, startup, and market intelligence articles in real time.

---

### 2. Instant Results Area

Purpose: Show immediate search feedback.

Each result card should show:

- Article title
- Description
- Category
- Tags
- Date
- Read time
- Highlighted matching excerpt

Results should update as the user types.

No search button.

---

### 3. Browse View

Purpose: Let users explore without searching.

Include:

- Category browsing
- Tag-based filtering
- Recent/mock featured posts
- Clear reset filters option

Browsing should support the search experience, not compete with it.

---

### 4. Article Modal

Purpose: Avoid building 100 individual article pages during MVP 1.

When a user selects a result, open a standardised modal that displays:

- Title
- Description
- Category
- Tags
- Author
- Date
- Read time
- Full article content
- Related article suggestions, optional

The modal should be clean, readable, and easy to close.

---

### 5. Empty State

Purpose: Make no-results feel useful, not broken.

Show:

- Friendly no-results message
- Suggested tags
- Popular categories
- Clear search reset action

Example:

> No matching articles found. Try searching for “AI agents”, “SaaS pricing”, “automation”, or “market signals”.

---

## Search Behaviour

Search should index these fields:

- `title`
- `description`
- `tags`
- `category`
- `content`

### Ranking Priority

Search results should favour matches in this order:

1. Title
2. Tags
3. Description
4. Category
5. Content

Title and tag matches should feel more important than body/content matches.

### Search Features

MVP 1 should support:

- Search as you type
- Highlighted matching keywords
- Prefix matching
- Light fuzzy matching
- Case-insensitive search
- Category filtering
- Tag filtering
- Result count
- Clear/reset search

### Debounce

Use a small debounce so results feel instant without unnecessary processing.

Recommended: 100–200ms.

---

## UI Direction

The interface should feel premium, calm, and research-grade.

Design direction:

- Clean SaaS layout
- Spacious search area
- Refined typography
- Minimal borders
- Soft cards
- Clear hierarchy
- Subtle hover states
- Elegant modal experience
- Strong mobile responsiveness

Avoid:

- Generic blog templates
- Loud news-site styling
- Overly playful visuals
- Heavy dashboards
- Too many filters
- Cluttered article cards

The product should feel like a focused tool, not a content dump.

---

## Suggested Layout

### Desktop

- Top navigation/header
- Hero search area
- Left-side category/tag filter panel or horizontal filter row
- Main results grid/list
- Article modal overlay

### Mobile

- Search first
- Filter chips below search
- Single-column result cards
- Full-screen article modal or bottom-sheet style modal

---

## MVP Build Roadmap

### Step 1 — Define Content System & Specialized Mock Generation

Establish the blog persona, categories, tags, authors, and article structure. Run a specialized generation script to programmatically generate 100 high-quality, realistic technology and business intelligence articles using varied, curated paragraph templates.

Output:

- Final content model
- 100 programmatically generated mock articles with realistic content
- Category/tag list

---

### Step 2 — Build Static App Shell

Create the basic app structure and layout.

Output:

- Header
- Search hero
- Browse/filter area
- Results area
- Modal component shell

---

### Step 3 — Load Mock Content

Import the 100 article dataset into the app.

Output:

- Local content loaded successfully
- Article cards rendering from data
- Browse view working without search

---

### Step 4 — Add Search Index

Use MiniSearch to create the client-side index.

Output:

- Search index built from local article data
- Search runs across title, description, tags, category, and content
- Results update while typing

---

### Step 5 — Add Result Highlighting

Highlight matching keywords in visible result fields.

Output:

- Highlighted matches in title, description, and excerpt
- Clean visual treatment for highlighted text

---

### Step 6 — Add Filters

Add category and tag filters.

Output:

- Filter by category
- Filter by tag
- Combine filters with search query
- Clear filters/search action

---

### Step 7 — Add Article Modal

Create one reusable modal component for all article previews.

Output:

- Click article card to open modal
- Full article content visible
- Modal can close cleanly
- Search state remains preserved

---

### Step 8 — Polish UX States

Refine the product feel.

Output:

- Empty state
- Initial state
- Loading/indexing state if needed
- Mobile responsiveness
- Result count
- Smooth interactions

---

## MVP Acceptance Criteria

The MVP is complete when:

- 100 mock articles are loaded
- Users can search without pressing a button
- Results update as the user types
- Search covers title, description, tags, category, and content
- Matching terms are highlighted
- Users can browse by category and tag
- Users can open any article in a modal
- Search/filter state is preserved when modal opens and closes
- The interface feels premium, clean, and SaaS-ready
- No MVP 2 semantic/vector functionality is included

---

## Future MVP 2 Direction

MVP 2 should upgrade the search experience with AI-powered semantic retrieval.

Potential MVP 2 additions:

- Vector embeddings
- Semantic search
- Natural language queries
- “Ask the archive” AI answer mode
- Related articles by meaning, not just tags
- Query intent detection
- Search result summaries
- Hybrid keyword + vector ranking

MVP 2 should build on the clean content model created in MVP 1.

---

## Final MVP 1 Summary

Build a polished client-side blog search prototype using 100 mock tech/business articles.

The user should be able to search instantly across titles, descriptions, tags, categories, and content, with highlighted matches and simple browsing through categories and tags.

Use MiniSearch, local JSON content, and a reusable article modal to keep the product focused, fast, and easy to upgrade later.
