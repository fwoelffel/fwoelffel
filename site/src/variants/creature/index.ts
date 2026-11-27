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
  level: 13,
  hp: 120,
  /** The creature's original element, drawn by `Emblem.astro`. */
  element: 'Code',
  habitat: 'terminal',
  talent: {
    name: 'File d’attente',
    text: 'aucune tâche qu’on lui confie n’est jamais perdue.',
  },
  weakness: { label: 'Réunions', value: '×2' },
  resistance: { label: 'Bugs', value: '−30' },
  /** Retreat cost, in coffee cups. */
  retreat: 2,
  flavor:
    'Éclose dans la recherche en imagerie médicale, elle a migré vers la fintech puis l’industrie. Se nourrit de café et de pull requests.',
  credit: 'Illus. avatar GitHub',
});
