# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio built with Astro 5 and Three.js. The project uses Bun as the package manager and runtime. The portfolio includes a 3D island scene at the top of the homepage (inspired by craftz.dog), with low-poly stylized graphics and mouse/touch controls.

## Coding Principles

**IMPORTANT**: Follow these principles strictly when making changes to this codebase:

### 1. CSS Organization
- **Global styles only in `src/styles/global.css`**: Utility classes, resets, typography, colors, layout helpers
- **Component-specific styles in component files**: Each `.astro` component contains its own scoped styles
- **ZERO CSS in page files**: Pages under `src/pages/` should contain NO `<style>` tags or inline styles
- **Pages are pure composition**: Page files should only import and compose components

### 2. Component Architecture
- **Create reusable components**: Extract common patterns into components in `src/components/`
- **Component organization**: Group related components (e.g., `Section.astro`, `SectionHeader.astro`, `TimelineItem.astro`)
- **Single Responsibility Principle**: Each component should have one clear purpose
- **Prop interfaces**: Always define TypeScript interfaces for component props

### 3. DRY (Don't Repeat Yourself)
- **No duplicate CSS**: If a style pattern appears more than once, create a component or utility class
- **Shared constants**: Extract repeated values (colors, breakpoints, navigation links) to constants
- **Reusable components over copy-paste**: Always create a component instead of copying markup

### 4. Separation of Concerns
- **Logic in frontmatter**: Keep TypeScript/JavaScript in the frontmatter section
- **Markup in template**: Keep template clean and semantic
- **Styles in style block**: Component styles stay in the component, never leak to pages
- **No inline styles**: Use classes or component props instead

### 5. Maintainability
- **Modular over monolithic**: Break large components into smaller, focused ones
- **Clear naming**: Use descriptive names for components, props, and classes
- **Consistent patterns**: Follow existing patterns in the codebase
- **Documentation**: Add comments for complex logic, but prefer self-documenting code

### 6. Single Source of Truth
- **Configuration in `src/config.ts`**: All site-wide constants (nav links, social links, site metadata) must be defined in `config.ts`
- **Import from config**: Components must import `NAV_LINKS`, `SITE.socialLinks`, etc. from config - never hardcode these values
- **No duplicate data**: If the same data appears in multiple places, consolidate to `config.ts`

## Commands

All commands use Bun:

```bash
bun install              # Install dependencies
bun dev                  # Start dev server at localhost:4321
bun build                # Build production site to ./dist/
bun preview              # Preview production build locally
bun run deploy           # Build and deploy to Cloudflare Pages
bun astro ...            # Run Astro CLI commands (e.g., bun astro add, bun astro check)
```

## Deployment

This site deploys to **Cloudflare Pages** as a static site:
- Build command: `bun run build`
- Output directory: `dist`
- Custom domain: `craftaholic.sh`
- **Automatic deployment**: Pushes to `main` branch trigger automatic deployments to Cloudflare Pages

## Architecture

### Project Structure

```
src/
├── assets/               # Images and static assets
│   └── images/          # Blog and project images
├── components/          # Reusable Astro components
│   ├── layout/         # Page structure components
│   ├── ui/             # Reusable UI elements
│   ├── sections/       # Page section components
│   ├── three/          # 3D graphics components
│   ├── blog/           # Blog-specific components
│   └── products/       # Product-specific components
├── content/            # Content collections (Markdown)
│   ├── blog/           # Blog posts
│   ├── journals/       # Development journals (per product)
│   ├── products/       # Product showcases
│   └── work/           # Work experience entries
├── layouts/            # Page layouts
├── pages/              # Route pages (pure composition, no CSS)
├── styles/             # Global CSS only
├── utils/              # Utility functions
├── config.ts           # Site-wide constants and configuration (SINGLE SOURCE OF TRUTH)
└── content.config.ts   # Content collection schemas
```

### Content Collections

Content is managed through Astro's content collections system:

**Work Collection** (`src/content/work/*.md`):
- Schema: `title`, `description`, `publishDate`, `tags`, `role`, `company`, `duration`, `highlight`, `location`
- Auto-sorted by publish date (descending)
- Queried using `getCollection('work')`

**Blog Collection** (`src/content/blog/**/*.md`):
- Schema: `title`, `description`, `pubDatetime`, `modDatetime`, `tags`, `author`, `draft`, `pinned`
- Filters out drafts in production
- Auto-sorted by modified/publish date (descending)
- Queried using `getCollection('blog')`

**Products Collection** (`src/content/products/*.md`):
- Schema: `title`, `description`, `publishDate`, `tags`, `github`, `demo`, `status`, `opensource`, `pinned`, `icon`, `features`
- Status options: `mature`, `wip`, `archived`
- Queried using `getCollection('products')`

**Journals Collection** (`src/content/journals/{product-slug}/*.md`):
- Schema: `title`, `date`, `overview`
- Linked to products via directory name (e.g., `journals/portfolio/` → `products/portfolio.md`)
- `overview` field provides short summary shown in the accordion list
- Full markdown content shown in lightbox overlay
- Auto-sorted by date (descending)
- Queried using `getCollection('journals')`

### Component System

Components are organized by purpose into subfolders:

**Layout Components** (`src/components/layout/`):
- **Nav.astro**: Main navigation with theme toggle (imports `NAV_LINKS` from config)
- **Footer.astro**: Site footer with social links (imports `SITE.socialLinks` from config)
- **PageContainer.astro**: Consistent max-width container with `wide` prop
  - Default: `max-width: 42rem` for portfolio pages
  - `wide={true}`: `max-width: 65rem` for blog content
- **MainHead.astro**: HTML head with meta tags and font loading

**UI Components** (`src/components/ui/`):
- **Icon.astro**: SVG icon component with path definitions
- **Pill.astro**: Tag/badge UI element
- **ThemeToggle.astro**: Dark/light mode switcher (persists to localStorage)
- **Grid.astro**: Responsive grid layout
- **LinksList.astro**: List of links with arrow indicators
- **SimpleText.astro**: Text with consistent styling
- **ReadingProgressBar.astro**: Scroll progress indicator for blog posts

**Section Components** (`src/components/sections/`):
- **Hero.astro**: Hero section (supports greeting or title/tagline patterns)
- **Section.astro**: Reusable section wrapper with optional title
- **BioSection.astro**: Biography paragraphs with indentation
- **Timeline.astro**: Container for timeline entries
- **TimelineItem.astro**: Individual timeline items (year + text)
- **Skills.astro**: Skills showcase section
- **CallToAction.astro**: CTA section
- **ContactCTA.astro**: Contact call-to-action

**Three.js Components** (`src/components/three/`):
- **Island3DScene.astro**: 3D island wrapper component
- **Island3D.ts**: Three.js scene implementation with low-poly island

**Blog Components** (`src/components/blog/`):
- **ContentArticle.astro**: Shared layout for blog/work detail pages with markdown styling
  - Props: `title`, `description`, `tags`, `backLink`, `wide`
  - Includes all markdown content styling (headings, code, tables, blockquotes, etc.)
- **PortfolioPreview.astro**: Card preview for work/blog items
- **Placeholder.astro**: "Coming soon" placeholder text
- **Comments.astro**: Giscus comments integration

**Product Components** (`src/components/products/`):
- **JournalOverlay.astro**: Lightbox overlay for displaying journal entry details
- **ProductCard.astro**: Card preview for product items with GitHub stars

### Utility Functions

**Location**: `src/utils/`

- **slugify.ts**: Convert strings to URL-safe slugs
- **getSortedPosts.ts**: Sort blog posts by date
- **getUniqueTags.ts**: Extract unique tags from posts
- **getPostsByTag.ts**: Filter posts by tag
- **dateFormat.ts**: Date formatting utilities
- **github-stars.ts**: Fetch and cache GitHub repository stars
- **product-status.ts**: Product status labels and CSS classes

### Configuration (Single Source of Truth)

**Site Config** (`src/config.ts`):
```typescript
export const SITE = {
  website: 'https://craftaholic.sh',
  author: 'Tommy Tran',
  title: 'Tommy Tran',
  description: 'Senior Cloud/DevOps/Platform Engineer based in Vietnam',
  locale: 'en-US',
  postPerPage: 5,
  socialLinks: [
    { href: 'https://github.com/craftaholic', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/tranthangportfolio/', label: 'LinkedIn' },
  ],
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Awards', href: '/awards/' },
  { label: 'Products', href: '/products/' },
] as const;
```

**Usage in components**:
```astro
---
import { SITE, NAV_LINKS } from '../config';
---
<!-- Use SITE.socialLinks, NAV_LINKS, SITE.author, etc. -->
```

### Styling

**Global Styles** (`src/styles/global.css`):
- **Color system**: `--gray-0` through `--gray-999`, with full dark mode support
- **Accent colors**: Teal/cyan theme (`--accent-light`, `--accent-regular`, `--accent-dark`)
- **Typography**: JetBrains Mono monospace font for all text (body and headings)
- **Theme**: Dark mode by default, light mode available via toggle
- **Utility classes**: `.wrapper`, `.stack`, `.gap-*`, `.sr-only`, `.padding-block`
- **Breakpoints**: Primary breakpoint at `50em` (800px)

**Component Styles**:
- Each component has its own scoped `<style>` block
- Use CSS custom properties from global.css for colors, fonts, spacing
- Responsive design using `@media (min-width: 50em)` breakpoint

### Three.js Integration

The 3D island is integrated into the homepage Hero section:
- **Component**: `Island3DScene.astro` with `Island3D.ts` class
- **Loading**: Loads immediately on page load (no lazy loading)
- **Rendering**: Canvas with transparent background (`alpha: true`)
- **Controls**: Mouse/touch controls for rotation, auto-rotation when idle
- **Cleanup**: Properly disposes scene on navigation using `astro:before-swap` event

### Key Pages Structure

All pages are pure component composition with ZERO CSS:

- **`src/pages/index.astro`**: Homepage with Hero (3D island), Bio timeline, Skills, Social links
- **`src/pages/work.astro`**: Work experience listing with grid
- **`src/pages/work/[...slug].astro`**: Individual work detail pages (uses `ContentArticle`)
- **`src/pages/blog.astro`**: Blog posts listing with grid
- **`src/pages/blog/[...slug].astro`**: Individual blog post pages (uses `ContentArticle` with `wide` prop, includes `ReadingProgressBar`)
- **`src/pages/awards.astro`**: Awards page (placeholder)
- **`src/pages/products.astro`**: Products listing with pinned items and grid
- **`src/pages/products/[...slug].astro`**: Individual product pages with journal accordion and lightbox
- **`src/pages/404.astro`**: Custom 404 error page

### Blog Features

**Implemented:**
- Blog post listing with draft filtering
- Individual blog post pages with progress bar (`ReadingProgressBar` component)
- Wider content container (65rem vs 42rem) via `PageContainer wide` prop
- Shared markdown styling via `ContentArticle` component
- Table styling with horizontal scroll
- Code block styling
- Content from external blog repository integrated locally

**Utilities for future features:**
- `getSortedPosts()` - Sort posts by date
- `getUniqueTags()` - Extract all unique tags
- `getPostsByTag()` - Filter posts by tag
- `slugify()` - URL-safe slug generation

### Product Journal System

Products can have development journals that document progress over time:

**Structure:**
- Journals live in `src/content/journals/{product-slug}/` directory
- Each journal is a markdown file named `{YYYY-MM-DD}.md`
- Journals are automatically linked to products by matching directory name to product slug

**Schema:**
```yaml
---
title: Feature implementation
date: 2024-12-30
overview: Short summary for the accordion list
---

Full markdown content shown in lightbox...
```

**Display:**
- Journal accordion in product detail page shows all entries sorted by date (newest first)
- `overview` field shown as summary in the list
- Clicking an entry opens a lightbox overlay with full content
- JournalOverlay component handles the lightbox UI

## Development Notes

### Adding New Pages

When creating a new page:
1. Import `BaseLayout` and `PageContainer`
2. Import necessary section components (`Section`, `Hero`, etc.)
3. Compose the page using components only - NO `<style>` blocks allowed
4. Use `PageContainer wide` prop for content-heavy pages (like blog posts)
5. Use placeholder components for "coming soon" sections

Example:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageContainer from '../components/layout/PageContainer.astro';
import Section from '../components/sections/Section.astro';
---

<BaseLayout>
  <PageContainer>
    <Section title="My Section">
      <p>Content here</p>
    </Section>
  </PageContainer>
</BaseLayout>
```

### Creating Content Detail Pages

For pages that display markdown content (blog posts, work details):
1. Use `ContentArticle` component - it handles all markdown styling
2. Pass `wide={true}` for blog posts (longer content needs more width)
3. Add `ReadingProgressBar` for long-form content

Example:
```astro
---
import ContentArticle from '../components/blog/ContentArticle.astro';
import ReadingProgressBar from '../components/ui/ReadingProgressBar.astro';
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title={entry.data.title}>
  <ReadingProgressBar />
  <ContentArticle
    title={entry.data.title}
    description={entry.data.description}
    tags={entry.data.tags}
    backLink={{ href: '/blog/', label: 'Blog' }}
    wide
  >
    <Content />
  </ContentArticle>
</BaseLayout>
```

### Creating New Components

When extracting a new component:
1. Create in appropriate `src/components/` subfolder:
   - `layout/` for page structure
   - `ui/` for reusable UI elements
   - `sections/` for page sections
   - `three/` for 3D graphics
   - `blog/` for blog-specific components
2. Define TypeScript interface for props (if needed)
3. Include all styling in component's `<style>` block
4. Use global CSS custom properties for colors, fonts, spacing
5. Make it reusable - avoid hardcoding content
6. Import shared data from `config.ts` instead of hardcoding
7. Update imports in files using the component

### Adding New Portfolio Projects

Create a new markdown file in `src/content/work/` with frontmatter matching the schema. Projects auto-sort by `publishDate` descending.

### Theme System

- **Default**: Dark mode
- **Toggle**: ThemeToggle.astro component in navigation
- **Storage**: Uses localStorage to persist preference (key: `theme`, values: `dark`/`light`)
- **Implementation**: Adds `.theme-dark` class to `:root`
- **Initialization**: Inline script in MainHead.astro reads from localStorage on page load
- **View Transitions**: Theme persists across Astro View Transitions via `astro:after-swap` event

### Asset Organization

- `public/assets/`: Images for projects
- All public assets are served at `/assets/` path in production
