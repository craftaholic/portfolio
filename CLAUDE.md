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
- Custom domain: `wip.tommytran.me`
- **Automatic deployment**: Pushes to `main` branch trigger automatic deployments to Cloudflare Pages

## Architecture

### Project Structure

```
src/
├── assets/               # Images and static assets
│   ├── images/          # Blog and project images
│   └── socialIcons.ts   # Social media icon definitions
├── components/          # Reusable Astro components
│   ├── layout/         # Page structure components
│   ├── ui/             # Reusable UI elements
│   ├── sections/       # Page section components
│   ├── three/          # 3D graphics components
│   └── blog/           # Blog-specific components
├── content/            # Content collections (Markdown)
│   ├── blog/           # Blog posts
│   └── work/           # Work experience entries
├── layouts/            # Page layouts
├── pages/              # Route pages (pure composition, no CSS)
├── styles/             # Global CSS only
├── utils/              # Utility functions
├── config.ts           # Site-wide constants and configuration
└── content.config.ts   # Content collection schemas
```

### Content Collections

Content is managed through Astro's content collections system:

**Work Collection** (`src/content/work/*.md`):
- Schema: `title`, `description`, `publishDate`, `tags`, `img`, `img_alt`
- Auto-sorted by publish date (descending)
- Queried using `getCollection('work')`

**Blog Collection** (`src/content/blog/**/*.md`):
- Schema: `title`, `description`, `pubDatetime`, `modDatetime`, `tags`, `author`, `draft`, `featured`
- Filters out drafts in production
- Auto-sorted by modified/publish date (descending)
- Queried using `getCollection('blog')`

### Component System

Components are organized by purpose into subfolders:

**Layout Components** (`src/components/layout/`):
- **Nav.astro**: Main navigation with theme toggle
- **Footer.astro**: Site footer with social links
- **PageContainer.astro**: Consistent max-width container (42rem for portfolio, 65rem for blog)
- **MainHead.astro**: HTML head with meta tags and font loading

**UI Components** (`src/components/ui/`):
- **Icon.astro**: SVG icon component with path definitions
- **Pill.astro**: Tag/badge UI element
- **ThemeToggle.astro**: Dark/light mode switcher
- **Grid.astro**: Responsive grid layout
- **LinksList.astro**: List of links with arrow indicators
- **SimpleText.astro**: Text with consistent styling

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
- **PortfolioPreview.astro**: Card preview for work/blog items
- **WorkDetailLayout.astro**: Layout wrapper for work details
- **Placeholder.astro**: "Coming soon" placeholder text

### Utility Functions

**Location**: `src/utils/`

- **slugify.ts**: Convert strings to URL-safe slugs
- **getSortedPosts.ts**: Sort blog posts by date
- **getUniqueTags.ts**: Extract unique tags from posts
- **getPostsByTag.ts**: Filter posts by tag
- **dateFormat.ts**: Date formatting utilities

### Configuration

**Site Config** (`src/config.ts`):
```typescript
export const SITE = {
  website: 'https://wip.tommytran.me',
  author: 'Tommy Tran',
  postPerPage: 5,
  socialLinks: [...],
}

export const NAV_LINKS = [...]
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
- **`src/pages/work/[...slug].astro`**: Individual work experience detail pages
- **`src/pages/blog.astro`**: Blog posts listing with grid
- **`src/pages/blog/[...slug].astro`**: Individual blog post pages (wider container, progress bar)
- **`src/pages/awards.astro`**: Awards page (placeholder)
- **`src/pages/uses.astro`**: Uses/setup page (placeholder)
- **`src/pages/404.astro`**: Custom 404 error page

### Blog Features

**Implemented:**
- Blog post listing with draft filtering
- Individual blog post pages with progress bar
- Wider content container (65rem vs 42rem) for better readability
- Table styling with horizontal scroll
- Code block styling
- Content from external blog repository integrated locally

**Utilities for future features:**
- `getSortedPosts()` - Sort posts by date
- `getUniqueTags()` - Extract all unique tags
- `getPostsByTag()` - Filter posts by tag
- `slugify()` - URL-safe slug generation

## Development Notes

### Adding New Pages

When creating a new page:
1. Import `BaseLayout` and `PageContainer`
2. Import necessary section components (`Section`, `Hero`, etc.)
3. Compose the page using components only - NO `<style>` blocks allowed
4. Use placeholder components for "coming soon" sections

Example:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageContainer from '../components/PageContainer.astro';
import Section from '../components/Section.astro';
---

<BaseLayout>
  <PageContainer>
    <Section title="My Section">
      <p>Content here</p>
    </Section>
  </PageContainer>
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
6. Update imports in files using the component

### Adding New Portfolio Projects

Create a new markdown file in `src/content/work/` with frontmatter matching the schema. Projects auto-sort by `publishDate` descending.

### Theme System

- **Default**: Dark mode
- **Toggle**: ThemeToggle.astro component in navigation
- **Storage**: Uses localStorage to persist preference
- **Implementation**: Adds `.theme-dark` class to `:root`
- **Initialization**: Inline script in BaseLayout.astro ensures no flash of unstyled content

### Asset Organization

- `public/assets/`: Images for projects
- All public assets are served at `/assets/` path in production
