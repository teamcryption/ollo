import { C, L, poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'navigation',
  icons: [
    icon('waypoint', 'Waypoint', ['checkpoint', 'stop', 'marker', 'gps point', 'via'], [body(poly([[12, 3.5], [18, 10], [12, 16.5], [6, 10]], 1, true)), line(L(12, 16.5, 12, 20.5)), line(L(9, 20.5, 15, 20.5)), accent(C(12, 10, 1.5))]),
  ],
};
