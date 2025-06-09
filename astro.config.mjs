// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import node from '@astrojs/node';

export default defineConfig({
  // ...
  integrations: [
    tailwind(), // aquí es donde va la integración de Astro + Tailwind
  ],

  adapter: node({
    mode: 'standalone',
  }),
});