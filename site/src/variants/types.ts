import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

/** What every variant's `index.ts` exports by default. */
export interface VariantMeta {
  /** Folder name, CSS hook (`data-variant`) and URL hash (`#id`). */
  readonly id: string;
  /** Name shown in the style selector (French). */
  readonly label: string;
  /** Position in the deck; the variant with order 0 is the default. */
  readonly order: number;
}

/**
 * Types a variant's metadata while keeping its own fields (stats, edition…)
 * and their literal types: `export default defineVariant({ id, label, order,
 * ...data })`.
 */
export const defineVariant = <const T extends VariantMeta>(meta: T): T => meta;

/** A registered variant: its metadata plus the two faces it renders. */
export interface Variant extends VariantMeta {
  /** Front face content. Takes no props. */
  readonly Front: AstroComponentFactory;
  /** Back face content. Takes no props. */
  readonly Back: AstroComponentFactory;
}
