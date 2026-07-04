# Design System Guide — Signal Ledger MVP 1

Signal Ledger should feel like a calm, premium research platform for people who want to find useful technology and business insight quickly. The experience should feel sharp, elegant, and quietly powerful — less like a blog, more like a polished search workspace built around clarity, speed, and trust.

---

## 1. Product Design Intent

Signal Ledger is a SaaS-style prototype for a mock tech intelligence blog. The core experience is instant keyword search across 100 mock articles using title, description, tags, category, and content.

The UI should support one primary behaviour: helping users find the right article quickly without friction.

MVP 1 should not visually or functionally imply AI semantic search, chat, vector search, recommendations by meaning, or an “ask the archive” experience. Those belong to MVP 2.

---

## 2. Core Design Principles

### 1. Search is the product

The search field is the hero. Every major layout decision should make the search experience easier, faster, and more satisfying.

### 2. Premium, not decorative

The interface should look refined, but not over-designed. Use space, typography, contrast, and restrained detail instead of loud graphics.

### 3. Results should feel intelligent

Even though MVP 1 is keyword/index based, the result layout should make search feel useful: highlighted matches, clear metadata, tags, categories, and short excerpts.

### 4. Browsing supports search

Category and tag browsing should help users explore the article library, but should never compete with the search input.

### 5. Keep the user in context

Opening an article should use a modal so the user does not lose their current search, filters, or scroll position.

---

## 3. Visual Direction

### Overall feel

- Clean SaaS research interface
- Editorial but not magazine-like
- Calm, credible, modern
- Spacious and deliberate
- Subtle depth, soft borders, refined surfaces
- High readability across dense result lists and long modal content

### Avoid

- Generic blog card grids
- Heavy news-site layouts
- Loud gradients everywhere
- Excessive animation
- Too many competing CTAs
- Visual clutter around the search experience
- Dashboard-like complexity

---

## 4. Colour System

The colour palette should feel premium, technical, and calm. Use a light interface by default with deep ink tones, soft neutral surfaces, and one controlled accent colour.

### Primary palette

| Token | Purpose | Suggested Value |
|---|---|---|
| `background` | App background | `#F7F8FA` |
| `surface` | Cards, panels, modal | `#FFFFFF` |
| `surface-soft` | Secondary blocks | `#F1F4F8` |
| `border` | Subtle dividers | `#DDE3EA` |
| `border-soft` | Very light borders | `#EBEEF3` |
| `text-primary` | Main text | `#111827` |
| `text-secondary` | Supporting copy | `#4B5563` |
| `text-muted` | Metadata | `#7C8794` |
| `accent` | Primary interactive accent | `#2563EB` |
| `accent-soft` | Highlight background | `#DBEAFE` |
| `success-soft` | Positive state | `#ECFDF5` |
| `warning-soft` | Empty/help state | `#FFF7ED` |

### Usage rules

- Implement these colour tokens as CSS Custom Properties (CSS variables) in a global `:root` block for the Next.js application.
- Use the accent colour sparingly for focus states, active filters, links, and key interaction points.
- Use soft neutrals to create hierarchy instead of heavy shadows.
- Highlighted search terms should be visible but not aggressive.
- Avoid dark backgrounds for the MVP unless a dark mode is intentionally added later.

---

## 5. Typography System

The product needs to feel editorial and software-grade at the same time.

### Recommended font direction

Use a clean modern sans-serif for the entire MVP.

Good options:

- Inter
- Geist
- IBM Plex Sans
- Satoshi
- Manrope

### Type scale

| Style | Use | Size Guide |
|---|---|---|
| Display | Search hero headline | 40–56px desktop, 30–36px mobile |
| H1 | Modal/article title | 32–40px desktop, 26–32px mobile |
| H2 | Section headers | 22–28px |
| H3 | Card titles | 18–22px |
| Body | Descriptions/content | 15–17px |
| Small | Metadata/tags | 12–14px |
| Micro | Labels/counts | 11–12px |

### Typography rules

- Use strong line-height for readability, especially inside the article modal.
- Article content should feel calm and readable, not cramped.
- Result titles should be easy to scan quickly.
- Metadata should be clear but visually secondary.

---

## 6. Spacing and Layout System

### Spacing scale

Use a consistent 4px-based spacing system.

| Token | Value | Use |
|---|---:|---|
| `space-1` | 4px | Tiny gaps |
| `space-2` | 8px | Tag/chip spacing |
| `space-3` | 12px | Compact internal spacing |
| `space-4` | 16px | Card padding, field spacing |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Major component gaps |
| `space-12` | 48px | Hero/section spacing |
| `space-16` | 64px | Large vertical spacing |

### Layout width

- App max width: `1180–1280px`
- Search hero max width: `780–860px`
- Result list max width: `820–900px`
- Modal content max width: `760–840px`

### Grid direction

Desktop should use a premium research layout:

- Header at top
- Search hero beneath header
- Filters either horizontal below search or as a left-side panel once results are active
- Main results area centred and highly readable

Mobile should prioritise:

- Search first
- Filter chips below search
- Single-column cards
- Full-screen or near-full-screen article modal

---

## 7. App Structure

### Primary navigation

Keep navigation minimal. This is a prototype, not a full publication site.

Recommended header items:

- Signal Ledger logo/name
- Browse
- Categories
- About, optional
- Article count or small product label, optional

Avoid adding login, pricing, account, or admin navigation in MVP 1.

### Page layout

Recommended structure:

1. Header
2. Search hero
3. Category/tag discovery row
4. Results/browse area
5. Article modal

The search input should remain visually dominant throughout the experience.

---

## 8. Core Components

## 8.1 Header

### Purpose

Create trust and product identity without stealing attention from search.

### Content

- Product name: Signal Ledger
- Small descriptor: Tech Intelligence Archive, optional
- Simple navigation
- Optional article count: “100 mock articles”

### Design rules

- Height: 64–76px desktop
- Sticky header optional, but keep it subtle
- Use a bottom border instead of a heavy shadow
- Logo should feel editorial/technical, not playful

---

## 8.2 Search Hero

### Purpose

Set the tone and make the core action obvious.

### Content

- Short headline
- One supporting line
- Large search input
- Optional mini stats: “100 articles”, “7 categories”, “30+ tags”

### Suggested copy

**Search the signal behind tech, AI, startups, and market moves.**

Instantly explore 100 mock research articles by title, description, category, tags, and content.

### Design rules

- Keep the hero calm and spacious
- Search input should be the largest interactive element on the page
- Avoid multiple CTAs around the search bar
- Use subtle background treatment, not a loud hero graphic

---

## 8.3 Search Input

### Purpose

This is the main product interaction.

### Behaviour

- Search as the user types
- No search button
- Placeholder suggestions rotate or remain static
- Clear icon appears once text is entered
- Keyboard focus state must be obvious
- Debounced input behaviour: 100–200ms

### Recommended placeholder examples

- Search “AI agents”
- Search “startup funding”
- Search “SaaS pricing”
- Search “automation workflows”
- Search “market signals”

### Design rules

- Large rounded field
- Soft border
- Strong focus state
- Search icon on the left
- Clear icon on the right
- Field height: 56–68px desktop, 52–60px mobile

---

## 8.4 Category Chips

### Purpose

Allow lightweight browsing and filtering.

### Categories

- AI & Automation
- Software Trends
- Startup Moves
- Market Signals
- Product Strategy
- Digital Business
- Founder Stories

### States

- Default
- Hover
- Active
- Focus
- Disabled, rarely needed

### Design rules

- Chips should feel refined, not like loud buttons
- Active chip uses accent colour or accent-soft background
- Category filters should be easy to clear
- On mobile, chips should horizontally scroll if needed

---

## 8.5 Tag Chips

### Purpose

Support more specific discovery than category browsing.

### Example tags

- AI agents
- Automation
- SaaS
- Funding
- Product strategy
- Operations
- Workflow design
- Search
- Founder lessons
- Market shifts

### Design rules

- Tags are smaller than category chips
- Tags should wrap cleanly inside cards and modals
- Active tags should be visually distinct from inactive tags
- Do not show too many tags at once on the home view

---

## 8.6 Results Summary Bar

### Purpose

Help users understand what they are seeing.

### Content examples

- “24 results for ‘AI agents’”
- “Showing 12 articles in Product Strategy”
- “100 articles available”

### Design rules

- Place above the result list
- Keep copy short
- Include a clear reset action when filters/search are active
- Do not make this area feel like a toolbar-heavy dashboard

---

## 8.7 Article Result Card

### Purpose

Show enough information for the user to decide whether to open the article.

### Required content

- Title
- Description
- Category
- Tags
- Date
- Read time
- Highlighted excerpt when searching

### Optional content

- Author
- “Matched in title/tag/content” label

### Card hierarchy

1. Category/date metadata
2. Title
3. Description
4. Highlighted excerpt, only when search is active
5. Tags/read time

### Design rules

- Use list-style cards rather than a dense masonry blog grid
- Cards should be spacious but not oversized
- Hover state should feel premium and restrained
- The whole card should be clickable
- Do not overuse shadows; use border, background, and slight lift instead

---

## 8.8 Match Highlighting

### Purpose

Make search feel responsive and useful.

### Highlight locations

- Title
- Description
- Excerpt/content snippet (dynamically generated around body content matches)
- Tags, if practical

### Design rules

- Highlight background should be soft and readable
- Avoid bright yellow default browser-style highlights
- Highlight should not break text layout
- Use consistent treatment across all result cards
- **Dynamic Content Snippets:** When the search match is found in the article body content, dynamically extract a relevant snippet of ~150 characters around the first matched term. Wrap matching terms in a custom styled `<mark>` tag.

Recommended treatment:

- Background: `accent-soft`
- Text: `text-primary`
- Border radius: 3–4px
- Padding: 0–2px

---

## 8.9 Article Modal

### Purpose

Allow users to read articles without leaving their search context.

### Required content

- Title
- Description
- Category
- Tags
- Author
- Date
- Read time
- Full article content
- Close action

### Optional content

- Related articles
- Previous/next article controls

### Layout rules

- Desktop: centred modal with overlay
- Mobile: full-screen modal or bottom-sheet style modal
- Modal body should scroll internally
- Background page should remain visually present but inactive
- Closing the modal should preserve search and filter state
- **URL Synchronization:** Opening a modal must append the article slug to the URL query parameters (e.g. `?article=slug`). Closing the modal must remove the parameter, keeping the search state in sync.

### Design rules

- The modal should feel like a premium article reader
- Use strong typography and generous line-height
- Keep close controls obvious
- Avoid cramped content width
- Avoid opening a new page in MVP 1

---

## 8.10 Empty State

### Purpose

Make no-results moments feel helpful.

### Content

- Clear no-results message
- Suggested searches
- Popular categories/tags
- Reset search action

### Example copy

No matching articles found. Try searching for “AI agents”, “SaaS pricing”, “automation”, or “market signals”.

### Design rules

- Empty state should sit in the results area
- Keep it calm and useful
- Do not use jokey or overly playful language
- Offer 3–5 suggested next actions, not a large list

---

## 8.11 Initial Browse State

### Purpose

Give the page value before the user types.

### Content options

- Featured articles
- Latest mock articles
- Popular categories
- Popular tags

### Recommended direction

Show a curated “Featured Signals” section with 6–8 strong mock articles. This makes the product feel alive before search begins.

---

## 8.12 Loading / Indexing State

### Purpose

Handle the small moment before content/search is ready.

### Design rules

- For 100 articles, loading should be minimal
- Use skeleton cards only if there is a visible delay
- Avoid a heavy spinner-first experience
- If shown, use copy like: “Preparing search index…”

---

## 9. Interaction Rules

### Search behaviour

- Results update automatically while typing
- No submit button
- Pressing Escape should clear search or close modal depending on context
- Search query remains visible after opening and closing a modal
- Filters combine with search query
- Clear/reset should remove both search and filters when clearly labelled
- **URL Query Sync:** Synchronize the search input query (`?q=`), active category (`?category=`), and active tags (`?tags=`) to the browser URL dynamically, allowing bookmarkable and shareable search results.

### Keyboard Navigation & Shortcuts

- **Bar Focus:** Press `/` to focus the search input instantly.
- **Escape Close/Reset:** Press `Esc` to clear search text (if input is focused) or close the active modal.
- **Arrow Navigation:** Press `ArrowDown` and `ArrowUp` to navigate up and down through the list of result cards.
- **Enter Selection:** Press `Enter` to open the currently navigated result card in the article modal.
- **Visual Hints:** Render small visual keyboard shortcut badges (e.g., `[/]` in the search bar, `[ESC]` on the modal close button, and focused outlines) to guide the user.

### Filter behaviour

- Users can select one category at a time for MVP simplicity
- Users can select one or multiple tags depending on build complexity
- Active filters should be obvious
- Clear filters should always be available once filters are active

### Modal behaviour

- Card click opens modal
- Overlay click closes modal, optional
- Escape closes modal
- Close button is always visible
- Body scroll should not accidentally scroll the background page

---

## 10. Responsive Behaviour

### Desktop

- Use a spacious centred layout
- Search hero has generous breathing room
- Results can use a single premium list or two-column layout only if readability stays strong
- Filters may sit horizontally below search or in a left sidebar once results are active

### Tablet

- Keep search wide and central
- Use horizontal filter chips
- Article cards should remain one column unless there is enough room

### Mobile

- Search input should appear near the top immediately
- Chips should scroll horizontally
- Cards should be single column
- Article modal should become full-screen or near full-screen
- Avoid small tap targets

---

## 11. Component State Checklist

Each key component should be designed in these states:

### Search input

- Empty
- Focused
- Typing
- Has value
- Clear action visible

### Filter chips

- Default
- Hover
- Active
- Focus

### Result cards

- Default
- Hover
- Active/clicked
- With highlighted matches
- Without highlighted matches

### Results area

- Initial browse state
- Search results state
- Filtered results state
- Empty state
- Loading/indexing state

### Modal

- Closed
- Opening
- Open
- Scrolling content
- Closing

---

## 12. Accessibility Rules

The MVP should feel premium because it is easy to use, not just because it looks clean.

### Requirements

- Clear keyboard focus states
- Search input labelled correctly
- Modal traps focus while open
- Escape key closes modal
- Colour contrast should meet WCAG AA where practical
- Cards should be usable with keyboard navigation
- Buttons/chips need proper accessible labels
- Highlighting should not rely on colour alone if critical

---

## 13. Motion and Microinteractions

Motion should be subtle and functional.

### Recommended use

- Soft hover lift on result cards
- Quick fade/scale for modal open
- Smooth chip active state
- Slight transition on search focus
- Gentle empty state appearance

### Avoid

- Heavy page transitions
- Bouncy playful animation
- Long loading animations
- Distracting animated backgrounds

Motion duration guide:

- Fast UI transitions: 120–180ms
- Modal open/close: 180–240ms
- Hover states: 100–160ms

---

## 14. Content Style Inside UI

The writing should feel calm, intelligent, and concise.

### Voice

- Clear
- Premium
- Direct
- Editorial
- Not hype-driven

### UI copy rules

- Avoid buzzwords unless part of mock article content
- Use short labels
- Prefer “Search articles” over “Discover insights”
- Prefer “Clear filters” over “Reset experience”
- Avoid pretending the mock content is real live news

---

## 15. MVP 1 Design Acceptance Criteria

The design system is successful when:

- Search is clearly the primary action
- The page feels premium before the user searches
- Results are easy to scan
- Matching terms are visibly highlighted
- Category and tag browsing feel useful but secondary
- The article modal feels readable and polished
- Search/filter context is preserved when reading an article
- Mobile experience still feels search-first
- The interface does not imply MVP 2 AI functionality
- The product feels SaaS-ready, not like a generic blog template

---

## 16. Recommended Build Order for UI

1. App shell and header
2. Search hero
3. Content card system
4. Browse state
5. Results state
6. Highlight treatment
7. Category and tag filters
8. Article modal
9. Empty/loading states
10. Responsive polish
11. Accessibility pass
12. Final visual polish

---

## 17. Design Director Notes

The biggest design risk is making Signal Ledger look like a standard blog with a search bar attached. That would weaken the product.

The better direction is to make the app feel like a refined research tool where the article library exists to demonstrate the search experience. The UI should create confidence that the system is fast, organised, and upgradeable without overcomplicating MVP 1.
