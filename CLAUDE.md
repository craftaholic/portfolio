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

### Content Collections

Portfolio projects are managed through Astro's content collections system:
- **Location**: `src/content/work/*.md`
- **Schema** (defined in `src/content.config.ts`):
  - `title`, `description`, `publishDate`
  - `tags` (array), `img`, `img_alt`
- Uses Astro's glob loader to automatically discover markdown files
- Projects are queried using `getCollection('work')`

### Component System

The codebase uses a modular component architecture:

**Layout Components:**
- **BaseLayout.astro**: Main wrapper for all pages, manages theme switching (dark mode default)
- **PageContainer.astro**: Consistent max-width container with responsive padding (2rem mobile, 3rem desktop)

**Section Components:**
- **Section.astro**: Reusable section wrapper with optional title and underline styling
- **BioSection.astro**: Biography paragraphs with indentation and justified text
- **Timeline.astro**: Container for timeline entries
- **TimelineItem.astro**: Individual timeline entries (year + description)

**UI Components:**
- **Hero.astro**: Hero section with greeting text and image slot
- **SimpleText.astro**: Text with consistent styling and indentation
- **LinksList.astro**: List of links with arrow indicators
- **Placeholder.astro**: "Coming soon" placeholder text
- **WorkDetailLayout.astro**: Layout for individual work/project detail pages

**3D Graphics:**
- **Island3DScene.astro**: Three.js 3D island component (loads immediately, no lazy loading)
- **Island3D.ts**: Three.js scene implementation with low-poly island and controls

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

- **`src/pages/index.astro`**: Homepage with Hero, Work, Bio, I ♥, and On the web sections
- **`src/pages/work.astro`**: Full portfolio listing
- **`src/pages/blog.astro`**: Blog page (placeholder)
- **`src/pages/awards.astro`**: Awards page (placeholder)
- **`src/pages/uses.astro`**: Uses/setup page (placeholder)
- **`src/pages/work/[...slug].astro`**: Dynamic routes for individual project pages

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
1. Create in `src/components/` with descriptive name
2. Define TypeScript interface for props (if needed)
3. Include all styling in component's `<style>` block
4. Use global CSS custom properties for colors, fonts, spacing
5. Make it reusable - avoid hardcoding content

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
