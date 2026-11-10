import { icon, body, line, accent } from '../src/dsl.mjs';
import { poly } from '../src/geo.mjs';

export default {
  category: 'energy',
  icons: [
    icon('dam', 'Dam', ['hydroelectric', 'reservoir', 'water', 'barrier', 'hydro'], [body(poly([[11, 4], [14, 4], [18, 20.5], [9, 20.5]], 0.8, true)), line('M3.5 11h5.5M3.5 15h5.5M3.5 19h5'), accent('M3.5 7.5c.8.6 1.6.6 2.4 0s1.6-.6 2.4 0')]),
  ],
};
