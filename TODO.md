# Portfolio Development TODO

## 🎯 Project Tasks

### 1. Adding 3D Model Island
- [x] Create Three.js scene component
- [x] Implement mouse/touch controls for island rotation
- [x] Add placeholder 3D model for testing
- [x] Integrate 3D scene into hero section
- [x] Add loading state/spinner
- [x] Optimize performance (lazy loading, LOD)
- [x] Test responsive behavior on mobile/tablet

### 2. Update Background Color Scheme
- [x] Design new color palette (hacky/dev theme)
  - Dark mode colors
  - Light mode colors (if applicable)
  - Accent colors
- [x] Update CSS custom properties in `src/styles/global.css`
- [x] Update background images in `public/assets/backgrounds/`
- [x] Test theme toggle functionality
- [ ] Ensure accessibility (contrast ratios)

### 3. Fill In Personal Information
- [x] Update site title and name in `src/components/Nav.astro`
- [x] Update homepage hero title and tagline in `src/pages/index.astro`
- [x] Update footer copyright in `src/components/Footer.astro`
- [x] Update about page content in `src/pages/about.astro`
- [x] Add social media links in `src/components/Nav.astro`
- [ ] Add profile/portrait image
- [ ] Add personal logo
- [ ] Update meta tags and SEO information

### 4. Develop Custom 3D Island Model
- [ ] Design/sketch island concept
- [ ] Model 3D island (Blender/other tool)
- [ ] Optimize model for web (low poly, proper UVs)
- [ ] Export as GLB/GLTF format
- [ ] Add textures/materials
- [ ] Replace placeholder with custom model
- [ ] Test and optimize loading times

### 5. Adding Blog Section
- [x] Set up blog content collection in `src/content/blog/`
- [x] Define blog post schema (frontmatter)
- [x] Create blog listing page (`src/pages/blog.astro`)
- [x] Create blog post template (`src/pages/blog/[...slug].astro`)
- [x] Add blog to navigation menu
- [x] Style blog post layout
- [x] Add pagination (if needed)
- [x] Add blog preview component
- [x] Add search functionality
- [x] Add tag filtering
- [x] Add related posts
- [ ] Add suggest changes at the bottom
- [ ] Add comment section
- [ ] (Optional) Add how many views
- [x] Write first blog post

### 6. Adding CTA section
- [ ] Adding contact me section.
- [ ] Adding inst/fb message and mail

### 7. Optimize for mobile
- [ ] Bring theme toggle button out from the current button group
- [ ] Use a different mechanism for changing tab on mobile that's more creative

### 8. Optimize UI
- [ ] Make the 3d section shorter
- [ ] Bring the 3d section to all pages

---

## 📝 Notes
- Keep the portfolio focused on showcasing work
- Maintain performance with 3D elements
- Ensure mobile responsiveness throughout
- Test in multiple browsers
