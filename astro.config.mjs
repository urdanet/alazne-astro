// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // ...
  integrations: [
    tailwind(), // aquí es donde va la integración de Astro + Tailwind
  ],
});
