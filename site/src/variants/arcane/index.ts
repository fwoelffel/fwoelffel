import { defineVariant } from '../types';

/**
 * Arcane: a fantasy trading card (title bar with a casting cost, art box,
 * type line, rules text with activated abilities, strength box). Every
 * symbol is our own. The cost and the strength are made up, and the card
 * says so to assistive tech.
 */
export default defineVariant({
  id: 'arcane',
  label: 'Arcane',
  order: 2,
  /** Casting cost: one glyph per entry, drawn by Front.astro. */
  cost: ['gear', 'code', 'bean'],
  /** The same cost, spelled out for screen readers. */
  costLabel: 'un engrenage, une balise et un grain de café',
  type: 'Arcaniste',
  keywords: 'Curiosité, Refactorisation',
  flavor: 'Il ne lance pas de sorts : il les compile.',
  power: 4,
  toughness: 5,
  /** Printed after the collector number. */
  language: 'FR',
});
