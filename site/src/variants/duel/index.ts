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
  level: 13,
  effect:
    'Lorsque cette carte est révélée : invoquez un module NestJS. Tant qu’elle est sur le terrain, aucun job en file d’attente n’est perdu.',
  attack: 2800,
  defence: 2500,
});
