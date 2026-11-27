import { defineVariant } from '../types';

/**
 * Héros: a digital collectible card (arched portrait, name ribbon, rules
 * text, cost, attack and health badges). Every shape is our own. The
 * numbers are made up, and the card says so to assistive tech.
 */
export default defineVariant({
  id: 'hero',
  label: 'Héros',
  order: 4,
  cost: 13,
  attack: 5,
  health: 8,
  keyword: { name: 'Mainteneur', text: '242 commits sur @nestjs/bull.' },
});
