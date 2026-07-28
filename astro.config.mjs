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
      // indexable only
      // customPages filtered too
      filter: (page) =>
        [
          'https://rakshita.me',
          'https://rakshita.me/terminal',
          'https://rakshita.me/weather',
          'https://rakshita.me/RGupta-ResumeVis.pdf',
        ].includes(page.replace(/\/$/, '')),
      // static assets
      customPages: [
        'https://rakshita.me/weather',
        'https://rakshita.me/RGupta-ResumeVis.pdf',
      ],
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});