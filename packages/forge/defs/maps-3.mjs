import { R, C, L, A, poly, D, star } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'maps',
  icons: [
    icon('compass-rose', 'Compass Rose', ['cardinal directions', 'north', 'orientation', 'map'], [line(star(12, 12, 5.5, 1.6, 4, 0.3, -45)), body(star(12, 12, 8.8, 2.2, 4, 0.4))], { noAccent: true, anim: 'spin' }),
  ],
};
