// @ts-check
import { defineConfig } from 'astro/config';
import { identity } from './src/config.ts';

export default defineConfig({
  site: identity.url,
  scopedStyleStrategy: 'class',
  build: { inlineStylesheets: 'always' },
});
