import { defineVariant } from '../types';

/**
 * Créature: a monster-collecting card. The developer is the creature and
 * the profile links are its attacks. Every number is made up, and the card
 * says so to assistive tech.
 */
export default defineVariant({
  id: 'creature',
  label: 'Créature',
  order: 1,
  stage: 'Base',
  level: 42,
  hp: 120,
  /** The creature's original element, drawn by `Emblem.astro`. */
  element: 'Code',
  habitat: 'terminal',
  talent: {
    name: 'Café-script',
    text: 'chaque café bu devient un commit.',
  },
  weakness: { label: 'Réunions', value: '×2' },
  resistance: { label: 'Bugs', value: '−30' },
  /** Retreat cost, in coffee cups. */
  retreat: 2,
  flavor:
    'Se nourrit de café et de pull requests. Plus actif la nuit, près des terminaux allumés.',
  credit: 'Illus. avatar GitHub',
});
