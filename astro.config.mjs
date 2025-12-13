// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  // Static site generation (default)
  // Deploy to Cloudflare Pages: bun run build && npx wrangler pages deploy dist
  vite: {
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },
  },
});
