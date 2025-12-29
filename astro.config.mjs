// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://craftaholic.sh',
  integrations: [sitemap()],
  // Static site generation (default)
  // Deploy to Cloudflare Pages: bun run build && npx wrangler pages deploy dist
  prefetch: {
    // Prefetch links on hover (desktop) and tap start (mobile)
    defaultStrategy: 'hover',
    // Also prefetch links as they become visible
    prefetchAll: true,
  },
  vite: {
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },
  },
});
