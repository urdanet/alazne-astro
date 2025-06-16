// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import preact from '@astrojs/preact';

export default defineConfig({
  // ...
  integrations: [
    preact(),
    tailwind(), // aquí es donde va la integración de Astro + Tailwind
  ],

  adapter: node({
    mode: 'standalone',
  }),
});