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
    { value: 94, label: 'TS', name: 'TypeScript' },
    { value: 93, label: 'NODE', name: 'Node.js' },
    { value: 95, label: 'NEST', name: 'NestJS' },
    { value: 91, label: 'ARCH', name: 'Architecture' },
    { value: 89, label: 'TEST', name: 'Tests' },
    { value: 88, label: 'ORM', name: 'TypeORM' },
  ],
});
