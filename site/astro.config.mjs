// @ts-check
import { defineConfig } from 'astro/config';
import { identity } from './src/config.ts';

export default defineConfig({
  site: identity.url,
  build: { inlineStylesheets: 'always' },
});
