// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  server: { host: true, allowedHosts: true },
  vite: {
    preview: { allowedHosts: true },
    server: { allowedHosts: true },
  },
});
