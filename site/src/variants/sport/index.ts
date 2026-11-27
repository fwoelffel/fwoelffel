import { defineVariant } from '../types';

/**
 * Sport: in the style of football trading cards. Its stats are made up, and
 * the card says so to assistive tech.
 */
export default defineVariant({
  id: 'sport',
  label: 'Sport',
  order: 0,
  rating: 92,
  rank: 'SNR',
  edition: '★ Holo',
  stats: [
    { value: 94, label: 'TS' },
    { value: 93, label: 'NODE' },
    { value: 95, label: 'NEST' },
    { value: 91, label: 'ARCH' },
    { value: 89, label: 'TEST' },
    { value: 88, label: 'DDD' },
  ],
});
