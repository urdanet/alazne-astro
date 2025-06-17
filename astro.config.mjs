// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import preact from '@astrojs/preact';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  // ...
  integrations: [
    preact(),
    tailwind(), // aquí es donde va la integración de Astro + Tailwind
  ],
  vite: {
    plugins: [
      Icons({
        compiler: 'jsx',        // genera componentes para JSX/TSX
        jsx: 'preact',          // usa Preact (o 'react' si fuera React)
        autoInstall: true,      // instala packs faltantes al vuelo
      }),
    ],
  },
  adapter: node({
    mode: 'standalone',
  }),
});