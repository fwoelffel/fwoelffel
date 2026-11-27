import { defineVariant } from '../types';

/**
 * Héros: a digital collectible card (cost crystal, arched portrait, name
 * banner, rules text, attack and health medallions). Every shape is our
 * own. The numbers are made up, and the card says so to assistive tech.
 */
export default defineVariant({
  id: 'hero',
  label: 'Héros',
  order: 4,
  cost: 7,
  attack: 5,
  health: 8,
  rarity: 'légendaire',
  keyword: { name: 'Riposte', text: 'corrige le bug adverse.' },
});
