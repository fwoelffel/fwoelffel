import { defineVariant } from '../types';

/**
 * Sport: the default card, in the style of football trading cards. Its
 * stats are made up, and the card says so to assistive tech.
 */
export default defineVariant({
  id: 'sport',
  label: 'Sport',
  order: 0,
  rating: 92,
  rank: 'ING',
  edition: '★ Holo',
  stats: [
    { value: 90, label: 'PRO' },
    { value: 91, label: 'ARC' },
    { value: 93, label: 'QUA' },
    { value: 89, label: 'LIV' },
    { value: 86, label: 'COM' },
    { value: 94, label: 'CUR' },
  ],
});
