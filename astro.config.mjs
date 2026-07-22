import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory'
  }),
  // Explicitly force a flat, unified output directory for manual uploads
  outDir: './dist',
  server: {
    port: 4321
  }
});