import { defineVariant } from '../types';

/**
 * Comics: a superhero card (title caption, panel with a sound-effect
 * sticker, power gauges, file lines, links as action captions). The powers
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
    { label: 'TypeScript', value: 5 },
    { label: 'Node.js', value: 5 },
    { label: 'Architecture', value: 4 },
    { label: 'Café', value: 5 },
  ],
  maxPower: 5,
  affiliation: 'Open Source (NestJS)',
  origin: 'labos d’imagerie médicale',
  base: 'Strasbourg',
  threat: 'élevé (pour les bugs)',
  issue: 'Nº\u00a01',
});
