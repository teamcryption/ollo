import { L, poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'education',
  icons: [
    icon('glue', 'Glue', ['adhesive', 'paste', 'craft', 'stick', 'school supplies'], [line(L(12, 6.5, 12, 3.5)), body(poly([[9.5, 11], [10.5, 6.5], [13.5, 6.5], [14.5, 11]], 0.4, true)), body('M8 11h8v8.5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 19.5Z'), accent(L(10.5, 15.5, 13.5, 15.5))]),
  ],
};
