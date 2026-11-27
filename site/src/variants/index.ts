/**
 * Variant registry. Every folder in `src/variants/` holding an `index.ts`
 * (default export: `defineVariant({...})`), a `Front.astro` and a
 * `Back.astro` is a card variant: adding a folder adds a card to the deck.
 */
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { Variant, VariantMeta } from './types';

const metas = import.meta.glob<VariantMeta>('./*/index.ts', {
  eager: true,
  import: 'default',
});
const fronts = import.meta.glob<AstroComponentFactory>('./*/Front.astro', {
  eager: true,
  import: 'default',
});
const backs = import.meta.glob<AstroComponentFactory>('./*/Back.astro', {
  eager: true,
  import: 'default',
});

/** "002/003": the card at `index` (0-based) in a deck of `count`. */
export const collectorNumber = (index: number, count: number) =>
  [index + 1, count].map((n) => String(n).padStart(3, '0')).join('/');

/** All variants, sorted by `order`. The first one shows without JavaScript. */
export const variants: Variant[] = Object.entries(metas)
  .map(([path, meta]) => {
    const dir = path.slice(0, path.lastIndexOf('/'));
    const Front = fronts[`${dir}/Front.astro`];
    const Back = backs[`${dir}/Back.astro`];
    if (!Front || !Back)
      throw new Error(
        `Variant ${dir}: Front.astro and Back.astro are required`,
      );
    if (dir !== `./${meta.id}`)
      throw new Error(`Variant ${dir}: its id must be "${dir.slice(2)}"`);
    return { ...meta, Front, Back };
  })
  .sort((a, b) => a.order - b.order);

if (variants[0]?.order !== 0)
  throw new Error(
    'Exactly one variant needs order 0 (the card shown without JavaScript)',
  );
if (new Set(variants.map((v) => v.order)).size !== variants.length)
  throw new Error('Variant orders must be unique');
