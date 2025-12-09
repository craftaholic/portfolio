# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio built with Astro 5 and Three.js. The project uses Bun as the package manager and runtime. The portfolio includes a 3D island scene at the top of the homepage (inspired by craftz.dog), with low-poly stylized graphics and mouse/touch controls.

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
- Deploy: `bun run deploy` (requires Wrangler CLI and Cloudflare auth)
- Custom domain: `wip.tommytran.me`

### Setting up custom domain:
1. Deploy the site first: `bun run deploy`
2. In Cloudflare dashboard: Pages > portfoliov2 > Custom domains
3. Add `wip.tommytran.me` and follow DNS setup instructions
4. Or via CLI: `wrangler pages domain add wip.tommytran.me --project-name=portfoliov2`

## Architecture

### Content Collections

Portfolio projects are managed through Astro's content collections system:
- **Location**: `src/content/work/*.md`
- **Schema** (defined in `src/content.config.ts`):
  - `title`, `description`, `publishDate`
  - `tags` (array), `img`, `img_alt`
- Uses Astro's glob loader to automatically discover markdown files
- Projects are queried using `getCollection('work')`

### Layout System

- **BaseLayout.astro**: Main wrapper for all pages
  - Manages theme switching (light/dark mode)
  - Uses layered CSS backgrounds with blend modes for visual effects
  - Lazy loads below-the-fold backgrounds with `.loaded` class
  - Backgrounds: noise texture + footer gradient + header curves SVG + header image + base color

### Styling

All styling uses vanilla CSS with custom properties defined in `src/styles/global.css`:
- Color system: `--gray-0` through `--gray-999`, with full dark mode support
- Accent colors: Purple theme (`--accent-light`, `--accent-regular`, `--accent-dark`)
- Responsive backgrounds loaded at 800w and 1440w breakpoints
- Theme switching inverts gray scale and accent colors

### Three.js Integration

The 3D island scene should be integrated into the Hero section:
- Build as client-side component (use `client:load` or `client:visible` directive)
- Three.js renders to a canvas element with transparent background (`alpha: true`)
- Scene should blend with Astro's existing layered background system
- Position where the profile image currently sits in `src/pages/index.astro` (lines 41-46)

### Key Pages Structure

- `src/pages/index.astro`: Homepage with Hero, Skills, Selected Work sections
- `src/pages/work.astro`: Full portfolio listing
- `src/pages/work/[...slug].astro`: Dynamic routes for individual project pages
- `src/pages/about.astro`: About page

## Development Notes

### Adding New Portfolio Projects

Create a new markdown file in `src/content/work/` with frontmatter matching the schema. Projects auto-sort by `publishDate` descending.

### Theme System

Theme toggle component uses local storage and adds `.theme-dark` class to `:root`. All color variables are redefined in the `.theme-dark` selector. The system respects user preference and persists across sessions.

### Asset Organization

- `public/assets/`: Images for projects and portrait
- `public/assets/backgrounds/`: Layered background images (light/dark, multiple sizes)
- All public assets are served at `/assets/` path in production
