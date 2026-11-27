import { defineVariant } from '../types';

/**
 * Duel: a monster-duel card (name bar with an attribute medallion, level
 * stars, square art window, type line, effect box, attack and defence).
 * Every glyph is our own. The level and the stats are made up, and the card
 * says so to assistive tech.
 */
export default defineVariant({
  id: 'duel',
  label: 'Duel',
  order: 3,
  /** Attribute, spelled out for screen readers (the medallion draws "</>"). */
  attribute: 'Code',
  level: 8,
  type: 'Ingénieur / Effet',
  effect:
    'Lorsque cette carte est révélée : ouvrez l’un de ses liens. Une fois par tour, changez un café en fonctionnalité.',
  attack: 2800,
  defence: 2500,
});
