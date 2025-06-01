import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';
import type { PluginOption } from 'vite';
import ssrPlugin from 'vite-ssr-components/plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), cloudflare(), ssrPlugin()] as PluginOption[],
});
