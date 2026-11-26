// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://fwoelffel.me',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'always' },
});
