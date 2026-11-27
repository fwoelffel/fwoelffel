import { defineVariant } from '../types';

/**
 * Duel: a monster-duel card (name bar with an attribute medallion, square
 * art window, role line, effect box, level/attack/defence badges). Every
 * glyph is our own. The stats are made up, and the card says so to
 * assistive tech.
 */
export default defineVariant({
  id: 'duel',
  label: 'Duel',
  order: 3,
  /** Attribute, spelled out for screen readers (the medallion draws "</>"). */
  attribute: 'Code',
  level: 8,
  effect:
    'Lorsque cette carte est révélée : ouvrez l’un de ses liens. Chaque matin, changez un café en fonctionnalité.',
  attack: 2800,
  defence: 2500,
});
