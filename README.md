# Tommy Tran's Portfolio

My personal portfolio at [craftaholic.sh](https://craftaholic.sh), built with Astro 5 and Three.js.

Feel free to use this as a template for your own portfolio!

![Astro](https://img.shields.io/badge/Astro-5.x-ff5d01?style=flat-square&logo=astro)
![Three.js](https://img.shields.io/badge/Three.js-0.181-black?style=flat-square&logo=three.js)
![Bun](https://img.shields.io/badge/Bun-1.x-fbf0df?style=flat-square&logo=bun)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

- **Interactive 3D Model** - Three.js powered voxel model with touch/mouse controls
- **Vim-Inspired Design** - Terminal aesthetic with syntax highlighting
- **9 Color Themes** - Tokyo Night, Nord, Gruvbox, Cyberpunk, and more
- **Blog with Search** - Full-text search, tags, reading progress bar
- **SEO Optimized** - Open Graph, Twitter Cards, JSON-LD, sitemap
- **Mobile First** - Responsive design with bottom navigation on mobile
- **Fast** - Static site generation, optimized assets, Cloudflare Pages ready
- **Comments** - Giscus integration for blog discussions

## Tech Stack

- **Framework**: Astro 5
- **3D Graphics**: Three.js
- **Runtime**: Bun
- **Deployment**: Cloudflare Pages

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build for production
bun run build

# Preview production build
bun preview

# Deploy to Cloudflare Pages
bun run deploy
```

---

# Using This as a Template

Want to create your own portfolio based on this? This guide will walk you through everything step by step.

## Table of Contents

- [Quick Start](#quick-start)
- [What to Change First](#what-to-change-first)
- [Configuration Files](#configuration-files)
- [Adding Your Content](#adding-your-content)
- [Customizing the Look](#customizing-the-look)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Customization Tips](#customization-tips)

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Git
- A code editor (VS Code recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/craftaholic/portfolio.git my-portfolio
cd my-portfolio

# Remove my git history and start fresh
rm -rf .git
git init

# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

## What to Change First

Here's the order I recommend for customizing this template:

### Step 1: Update Site Configuration

Edit `src/config.ts` - this is the single source of truth for your site:

```typescript
export const SITE = {
  website: 'https://yourdomain.com',        // Your domain
  author: 'Your Name',                       // Your name
  title: 'Your Name',                        // Site title (shows in browser tab)
  description: 'Your professional tagline',  // Shows in search results
  locale: 'en-US',                           // Your locale
  terminalUser: 'yourname',                  // Shows in terminal-style UI

  postPerPage: 5,                            // Blog posts per page

  socialLinks: [
    { href: 'https://github.com/yourusername', label: 'GitHub', icon: 'github-logo' },
    { href: 'https://linkedin.com/in/yourprofile', label: 'LinkedIn', icon: 'linkedin-logo' },
    { href: 'https://twitter.com/yourhandle', label: 'Twitter', icon: 'twitter-logo' },
    // Available icons: github-logo, linkedin-logo, twitter-logo, instagram-logo
    // See src/components/ui/Icon.astro for all available icons
  ],
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Products', href: '/products/' },
  // Add or remove navigation items as needed
] as const;

// Optional: Giscus comments (see Comments section below)
export const GISCUS = {
  repo: 'yourusername/yourrepo',
  repoId: 'R_xxx',
  category: 'Blog Comments',
  categoryId: 'DIC_xxx',
} as const;
```

### Step 2: Update Homepage Content

Edit `src/pages/index.astro`:

```astro
---
import { SITE } from '../config';
// ... other imports
---

<BaseLayout>
  <PageContainer>

    <!-- Your hero section with profile image -->
    <VimHero
      name={SITE.author}           <!-- Uses name from config -->
      role={SITE.description}      <!-- Uses description from config -->
      imageSrc="/assets/images/profile.webp"  <!-- Your profile photo -->
    />

    <!-- About section - edit your bio here -->
    <Section title="About">
      <BioSection>
        <p>
          Write your first paragraph here. Introduce yourself and what you do.
        </p>
        <p>
          Write your second paragraph here. What are you currently working on?
        </p>
      </BioSection>
    </Section>

    <!-- Timeline section - your career milestones -->
    <Section title="Bio">
      <Timeline>
        <TimelineItem
          year="2024"
          text="Company Name - Your role and achievement"
        />
        <TimelineItem
          year="2023"
          text="Another milestone in your career"
        />
        <!-- Add more TimelineItems as needed -->
      </Timeline>
    </Section>

    <!-- Interests section -->
    <Section title="I ♥">
      <SimpleText>
        Your interests, hobbies, technologies you love
      </SimpleText>
    </Section>

    <!-- Social links - automatically uses SITE.socialLinks from config -->
    <Section title="On the web">
      <LinksList links={[...SITE.socialLinks]} />
    </Section>

  </PageContainer>
</BaseLayout>
```

### Step 3: Replace Your Assets

```
public/
├── assets/
│   ├── images/
│   │   └── profile.webp      <-- Replace with your photo (square, 400x400px min)
│   └── model/
│       └── voxel_3d.glb      <-- Replace with your 3D model (or remove feature)
├── favicon.svg               <-- Your favicon (SVG supports dark mode)
├── favicon.ico               <-- Fallback for old browsers
├── favicon-16x16.png         <-- Browser tab icon
├── favicon-32x32.png         <-- Browser tab icon (high DPI)
├── apple-touch-icon.png      <-- iOS home screen icon (180x180px)
├── og-image.png              <-- Social sharing image (1200x630px)
└── robots.txt                <-- Usually no changes needed
```

### Step 4: Delete My Content

Remove my personal content and add yours:

```bash
# Remove my blog posts
rm -rf src/content/blog/*

# Remove my work experience
rm -rf src/content/work/*

# Remove my products
rm -rf src/content/products/*
```

## Configuration Files

### astro.config.mjs

Update the site URL:

```javascript
export default defineConfig({
  site: 'https://yourdomain.com',  // Your domain
  integrations: [sitemap()],
  // ... rest of config
});
```

### src/content.config.ts

This defines the schema for your content. You usually don't need to change this unless you want to add new fields.

## Adding Your Content

### Blog Posts

Create a new file in `src/content/blog/`:

**File**: `src/content/blog/my-first-post.md`

```markdown
---
title: My First Blog Post
author: Your Name
pubDatetime: 2024-01-15T00:00:00Z
featured: true
draft: false
tags:
  - tutorial
  - javascript
description: A brief description that appears in search results and social shares.
---

## Introduction

Your blog content starts here. You can use all standard Markdown:

- Bullet points
- **Bold text**
- *Italic text*
- [Links](https://example.com)

### Code Blocks

```javascript
const greeting = "Hello, World!";
console.log(greeting);
```

### Images

![Alt text](/assets/images/your-image.png)
```

**Frontmatter Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title |
| `pubDatetime` | date | Yes | Publish date in ISO format |
| `description` | string | Yes | Short description (SEO + social) |
| `tags` | string[] | No | Tags for categorization |
| `author` | string | No | Author name (defaults to SITE.author) |
| `featured` | boolean | No | Show in featured section |
| `draft` | boolean | No | Set `true` to hide in production |
| `modDatetime` | date | No | Last modified date |
| `canonicalURL` | string | No | Original URL if cross-posted |

**Organizing Blog Posts:**

You can organize posts in subdirectories:

```
src/content/blog/
├── tutorials/
│   ├── getting-started.md
│   └── advanced-tips.md
├── thoughts/
│   └── my-journey.md
└── my-first-post.md
```

### Work Experience

Create files in `src/content/work/`:

**File**: `src/content/work/company-project.md`

```markdown
---
title: Project Name
description: One-line description of what you did
publishDate: 2024-01-01
tags:
  - TypeScript
  - React
  - AWS
  - Kubernetes
role: Senior Software Engineer
company: Company Name
duration: Jan 2024 - Present
highlight: Reduced deployment time by 80%
location: San Francisco, CA
---

## Overview

Describe the project and your role in 2-3 paragraphs.

## Key Achievements

- Achievement 1 with measurable impact
- Achievement 2 with specific numbers
- Achievement 3 showing leadership or innovation

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, PostgreSQL
- **Infrastructure**: AWS, Kubernetes, Terraform

## Challenges & Solutions

Describe a challenge you faced and how you solved it.
```

**Frontmatter Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Project/role title |
| `description` | string | Yes | Brief description |
| `publishDate` | date | Yes | Start date (for sorting) |
| `tags` | string[] | Yes | Technologies used |
| `role` | string | Yes | Your job title |
| `company` | string | Yes | Company name |
| `duration` | string | Yes | e.g., "Jan 2024 - Present" |
| `highlight` | string | No | Key achievement (shown prominently) |
| `location` | string | No | e.g., "Remote", "New York" |
| `img` | string | No | Project image path |
| `img_alt` | string | No | Image alt text |

### Products/Projects

Create files in `src/content/products/`:

**File**: `src/content/products/my-project.md`

```markdown
---
title: My Open Source Project
description: A tool that helps developers do X faster
publishDate: 2024-01-01
tags:
  - Go
  - Docker
  - CLI
github: https://github.com/yourusername/project
demo: https://demo.yourproject.com
status: mature
icon: "🚀"
features:
  - "Fast Performance: 10x faster than alternatives"
  - "Easy Setup: Single command installation"
  - "Cross-Platform: Works on Windows, Mac, and Linux"
journey:
  - date: "15-03-2024"
    title: "v2.0 Release"
    content: "Major rewrite with new features and improved performance."
  - date: "01-01-2024"
    title: "Initial Release"
    content: "Launched the first public version."
---

## About

Detailed description of your project. What problem does it solve? Who is it for?

## Installation

```bash
npm install your-project
```

## Usage

```javascript
import { yourProject } from 'your-project';

yourProject.doSomething();
```

## Why I Built This

Share your motivation and what you learned.
```

**Frontmatter Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Project name |
| `description` | string | Yes | Brief description |
| `publishDate` | date | Yes | Launch/creation date |
| `tags` | string[] | No | Technologies used |
| `github` | string | No | GitHub repository URL |
| `demo` | string | No | Live demo URL |
| `status` | enum | No | `mature`, `wip`, or `archived` |
| `icon` | string | No | Emoji icon for the project |
| `features` | string[] | No | Key features list |
| `journey` | array | No | Development timeline |

## Customizing the Look

### Changing the Color Theme

Edit `src/styles/global.css` and change the import:

```css
/* Choose one of these themes */
@import './themes/midnight-teal.css';    /* Default - teal accents on dark */
@import './themes/tokyo-night.css';      /* Purple/blue tones */
@import './themes/nord.css';             /* Cool, muted blues */
@import './themes/gruvbox.css';          /* Warm, retro colors */
@import './themes/cyberpunk-muted.css';  /* Cyan/magenta neon */
@import './themes/frost-terminal.css';   /* Blue frost */
@import './themes/neon-dusk.css';        /* Purple sunset */
@import './themes/soft-grove.css';       /* Natural greens */
@import './themes/original.css';         /* Classic teal */
```

### Creating Your Own Theme

1. Copy an existing theme from `src/styles/themes/`
2. Rename it (e.g., `my-theme.css`)
3. Edit the CSS variables:

```css
:root {
  /* Background colors (light mode) */
  --gray-0: #ffffff;        /* Lightest - text on dark bg */
  --gray-100: #f5f5f5;
  --gray-200: #e5e5e5;
  --gray-300: #d4d4d4;
  --gray-400: #a3a3a3;
  --gray-500: #737373;
  --gray-600: #525252;
  --gray-700: #404040;
  --gray-800: #262626;
  --gray-900: #171717;
  --gray-999: #0a0a0a;      /* Darkest - background */

  /* Accent colors */
  --accent-light: #7ee7fc;   /* Hover states, highlights */
  --accent-regular: #00d9ff; /* Primary buttons, links */
  --accent-dark: #0891b2;    /* Darker variant */

  /* Terminal glow effects */
  --terminal-glow-color: rgba(0, 217, 255, 0.15);
  --terminal-glow-color-strong: rgba(0, 217, 255, 0.08);
}

/* Dark mode overrides */
.theme-dark {
  --gray-0: #0a0a0a;
  --gray-999: #ffffff;
  /* ... invert the scale */
}
```

4. Import your theme in `src/styles/global.css`

### Customizing the 3D Model

The 3D model appears in the navigation header. To use your own:

1. Create or download a GLB/GLTF model
2. Optimize it (low poly, < 2MB recommended)
3. Replace `public/assets/model/voxel_3d.glb`

**Model Requirements:**
- Format: GLB or GLTF
- Centered at origin (0, 0, 0)
- Reasonable size (the loader scales it automatically)

**To disable the 3D model entirely:**

Edit `src/components/layout/Nav.astro` and remove the `Model3DScene` component.

### Customizing the Vim Hero

The VimHero component shows a terminal-style introduction. Edit `src/components/sections/VimHero.astro` to change:

- Tab names and content
- Terminal styling
- Syntax highlighting colors

## Comments with Giscus

Enable comments on your blog posts:

1. **Enable GitHub Discussions** on your repository:
   - Go to your repo → Settings → General → Features
   - Check "Discussions"

2. **Install Giscus app**:
   - Visit [github.com/apps/giscus](https://github.com/apps/giscus)
   - Click "Install" and select your repository

3. **Get your configuration**:
   - Go to [giscus.app](https://giscus.app/)
   - Enter your repo and configure options
   - Copy the `data-repo`, `data-repo-id`, `data-category`, and `data-category-id`

4. **Update your config**:

```typescript
// src/config.ts
export const GISCUS = {
  repo: 'yourusername/yourrepo',
  repoId: 'R_kgDOxxxxxx',
  category: 'Blog Comments',
  categoryId: 'DIC_kwDOxxxxxx',
} as const;
```

## Deployment

### Cloudflare Pages (Recommended)

**Option 1: Automatic deploys via GitHub**

1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Configure build settings:
   - Build command: `bun run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION` = `18`

Every push to `main` will automatically deploy.

**Option 2: Manual deploy**

```bash
# Build and deploy
bun run deploy
```

### Vercel

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build first
bun run build

# Deploy
bunx netlify deploy --prod --dir=dist
```

### GitHub Pages

1. Add to `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://username.github.io',
  base: '/repo-name',  // Only if not using custom domain
});
```

2. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - uses: actions/upload-pages-artifact@v2
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v3
        id: deployment
```

3. In repo Settings → Pages, set source to "GitHub Actions"

## Project Structure

```
├── public/                     # Static assets (copied as-is)
│   ├── assets/
│   │   ├── images/            # Your images
│   │   │   └── profile.webp   # Your profile photo
│   │   └── model/
│   │       └── voxel_3d.glb   # 3D model file
│   ├── favicon.svg            # Main favicon
│   ├── favicon.ico            # Legacy favicon
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png   # iOS icon
│   ├── og-image.png           # Social sharing image
│   ├── robots.txt             # Search engine rules
│   └── site.webmanifest       # PWA manifest
│
├── src/
│   ├── components/
│   │   ├── blog/              # Blog-specific components
│   │   │   ├── Comments.astro        # Giscus comments
│   │   │   ├── ContentArticle.astro  # Blog post layout
│   │   │   ├── RelatedPosts.astro    # Related posts
│   │   │   ├── SearchBox.astro       # Search functionality
│   │   │   └── TableOfContents.astro # Auto-generated TOC
│   │   │
│   │   ├── layout/            # Page structure
│   │   │   ├── Nav.astro             # Navigation + 3D model
│   │   │   ├── Footer.astro          # Site footer
│   │   │   ├── BottomTabBar.astro    # Mobile navigation
│   │   │   ├── MainHead.astro        # SEO meta tags
│   │   │   └── PageContainer.astro   # Content wrapper
│   │   │
│   │   ├── sections/          # Page sections
│   │   │   ├── VimHero.astro         # Terminal-style hero
│   │   │   ├── Section.astro         # Reusable section
│   │   │   ├── BioSection.astro      # Bio paragraphs
│   │   │   ├── Timeline.astro        # Timeline container
│   │   │   └── TimelineItem.astro    # Timeline entry
│   │   │
│   │   ├── seo/               # SEO components
│   │   │   └── JsonLd.astro          # Structured data
│   │   │
│   │   ├── three/             # 3D model
│   │   │   ├── Model3D.ts            # Three.js logic
│   │   │   └── Model3DScene.astro    # Component wrapper
│   │   │
│   │   └── ui/                # Reusable UI
│   │       ├── Icon.astro            # SVG icons
│   │       ├── Pill.astro            # Tag badges
│   │       ├── BackToTop.astro       # Scroll button
│   │       └── ThemeToggle.astro     # Dark/light switch
│   │
│   ├── content/               # Your content (Markdown)
│   │   ├── blog/              # Blog posts
│   │   ├── products/          # Products/projects
│   │   └── work/              # Work experience
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro   # Main HTML wrapper
│   │
│   ├── pages/                 # Routes (file = URL)
│   │   ├── index.astro        # Homepage (/)
│   │   ├── blog.astro         # Blog listing (/blog)
│   │   ├── blog/
│   │   │   └── [...slug].astro  # Blog posts (/blog/post-name)
│   │   ├── work.astro         # Work listing (/work)
│   │   ├── work/
│   │   │   └── [...slug].astro  # Work details (/work/project-name)
│   │   ├── products.astro     # Products listing (/products)
│   │   ├── products/
│   │   │   └── [...slug].astro  # Product details (/products/project-name)
│   │   └── 404.astro          # 404 page
│   │
│   ├── styles/
│   │   ├── global.css         # Global styles + theme import
│   │   └── themes/            # Color themes
│   │       ├── midnight-teal.css
│   │       ├── tokyo-night.css
│   │       ├── nord.css
│   │       └── ...
│   │
│   ├── utils/                 # Utility functions
│   │   ├── slugify.ts         # URL slug generation
│   │   ├── getSortedPosts.ts  # Sort posts by date
│   │   └── getRelatedPosts.ts # Find related posts
│   │
│   ├── config.ts              # Site configuration
│   └── content.config.ts      # Content schemas
│
├── astro.config.mjs           # Astro configuration
├── package.json
└── tsconfig.json
```

## Customization Tips

### Adding a New Page

1. Create the page file:

**File**: `src/pages/uses.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageContainer from '../components/layout/PageContainer.astro';
import Section from '../components/sections/Section.astro';
---

<BaseLayout title="Uses" description="Tools and software I use daily">
  <PageContainer>
    <Section title="What I Use">
      <ul>
        <li><strong>Editor:</strong> Neovim</li>
        <li><strong>Terminal:</strong> WezTerm</li>
        <li><strong>Browser:</strong> Arc</li>
      </ul>
    </Section>
  </PageContainer>
</BaseLayout>
```

2. Add to navigation in `src/config.ts`:

```typescript
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Uses', href: '/uses/' },  // Add this
] as const;
```

### Adding New Social Icons

1. Find the icon SVG path (e.g., from [Phosphor Icons](https://phosphoricons.com/))

2. Add to `src/components/ui/Icon.astro`:

```astro
const icons: Record<string, string> = {
  // ... existing icons
  'youtube-logo': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.2c-.14.53-.52.89-1.04 1-.9.24-4.52.24-4.52.24s-3.62 0-4.52-.24c-.52-.11-.9-.47-1.04-1C5.28 15.44 5.28 12 5.28 12s0-3.44.24-4.2c.14-.53.52-.89 1.04-1 .9-.24 4.52-.24 4.52-.24s3.62 0 4.52.24c.52.11.9.47 1.04 1 .24.76.24 4.2.24 4.2s0 3.44-.24 4.2zM10.08 14.52L14.4 12l-4.32-2.52v5.04z',
};
```

3. Use in config:

```typescript
socialLinks: [
  { href: 'https://youtube.com/@yourchannel', label: 'YouTube', icon: 'youtube-logo' },
],
```

### Removing Features

**Remove 3D Model:**
```bash
# Delete the Three.js components
rm -rf src/components/three/

# Edit src/components/layout/Nav.astro
# Remove the Model3DScene import and component
```

**Remove Blog:**
```bash
rm -rf src/pages/blog/
rm -rf src/pages/blog.astro
rm -rf src/content/blog/
# Remove from NAV_LINKS in src/config.ts
```

**Remove Products:**
```bash
rm -rf src/pages/products/
rm -rf src/pages/products.astro
rm -rf src/content/products/
# Remove from NAV_LINKS in src/config.ts
```

**Remove Comments:**
```bash
rm src/components/blog/Comments.astro
# Edit src/pages/blog/[...slug].astro
# Remove <Comments /> component
```

### Changing Fonts

1. Edit `src/components/layout/MainHead.astro`:

```astro
<!-- Replace Google Fonts link -->
<link
  href="https://fonts.googleapis.com/css2?family=Your+Font:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

2. Edit `src/styles/global.css`:

```css
:root {
  --font-body: 'Your Font', system-ui, sans-serif;
  --font-heading: 'Your Font', system-ui, sans-serif;
}
```

## Performance

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1s
- **Static Generation**: All pages pre-rendered at build time
- **Image Optimization**: Automatic WebP conversion
- **Font Loading**: Preconnect + swap strategy

## Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

## Troubleshooting

### Build Errors

**"Cannot find module" errors:**
```bash
rm -rf node_modules bun.lockb
bun install
```

**Content schema errors:**
Check your frontmatter matches the schema in `src/content.config.ts`

### 3D Model Not Loading

- Check browser console for errors
- Ensure GLB file is under 5MB
- Verify file path is correct

### Comments Not Showing

- Verify Giscus app is installed on your repo
- Check that Discussions are enabled
- Verify GISCUS config values in `src/config.ts`

## Credits

- Design inspired by [craftz.dog](https://www.craftz.dog/)
- Built with [Astro](https://astro.build/)
- 3D rendering with [Three.js](https://threejs.org/)
- Icons from [Phosphor Icons](https://phosphoricons.com/)

## License

MIT License - feel free to use this as a template for your own portfolio!

---

If you use this template, I'd love to see what you build! Feel free to reach out on [Twitter](https://twitter.com/tommy_tran28) or open an issue if you have questions.
