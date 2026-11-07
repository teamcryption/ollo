import { poly } from '../src/geo.mjs';
import { icon, body, accent } from '../src/dsl.mjs';

export default {
  category: 'education',
  icons: [
    icon('set-square', 'Set Square', ['triangle ruler', 'geometry', 'drafting', 'angle', 'maths'], [body(poly([[4, 20], [4, 4], [20, 20]], 0.8, true)), accent(poly([[7.5, 16.5], [7.5, 12], [12, 16.5]], 0.4, true))]),
  ],
};
