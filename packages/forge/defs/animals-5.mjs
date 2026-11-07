import { C, D, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'animals',
  icons: [
    icon('fox', 'Fox', ['vixen', 'wild animal', 'clever', 'forest animal', 'cunning'], [body(poly([[3.5, 4.5], [8.5, 8], [15.5, 8], [20.5, 4.5], [18, 13], [12, 20], [6, 13]], 0.8, true)), line(D(9.5, 12)), line(D(14.5, 12)), line(C(12, 16.3, 0.9))], { noAccent: true }),
  ],
};
