import { defineVariant } from '../types';

/**
 * Comics: a superhero card (title caption, panel with a sound-effect
 * sticker, power grid, file lines, links as action captions). The powers
 * and the threat level are made up, and the card says so to assistive tech.
 */
export default defineVariant({
  id: 'comic',
  label: 'Comics',
  order: 5,
  alias: 'Le Refactoriseur',
  /** Sound effect on the panel's starburst. */
  sticker: 'COMMIT !',
  /** Each rated out of `maxPower`. */
  powers: [
    { label: 'Force', value: 3 },
    { label: 'Intelligence', value: 6 },
    { label: 'Code', value: 7 },
    { label: 'Café', value: 7 },
  ],
  maxPower: 7,
  affiliation: 'Open Source',
  threat: 'élevé (pour les bugs)',
  issue: 'N° 1',
});
