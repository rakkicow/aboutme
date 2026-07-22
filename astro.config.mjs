import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rakshita.me',
  base: process.env.ASTRO_BASE || '/',
  trailingSlash: 'ignore',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // The vanity redirects (/ig, /rv, …) and the OG render target are all
      // noindex — listing them here would contradict that. Homepage only.
      filter: (page) => page === 'https://rakshita.me/',
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});