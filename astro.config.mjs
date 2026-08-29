// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // site is required for the canonical URLs and the sitemap integration.
  site: 'https://theresia-saumu.netlify.app',
  integrations: [sitemap()],
  server: { host: true, allowedHosts: true },
  vite: {
    preview: { allowedHosts: true },
    server: { allowedHosts: true },
  },
});
