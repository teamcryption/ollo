import { R, C, L, A, poly, D, star } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'navigation',
  icons: [
    icon('traffic-cone', 'Traffic Cone', ['roadworks', 'construction', 'caution', 'detour'], [body(poly([[10.5, 4], [13.5, 4], [17.5, 18], [6.5, 18]], 0.6, true)), line(L(9.6, 8.5, 14.4, 8.5)), line(L(8.4, 13, 15.6, 13)), line(L(4, 20, 20, 20))], { noAccent: true }),
    icon('crosswalk', 'Crosswalk', ['zebra crossing', 'pedestrian', 'crossing', 'street'], [body(R(4, 5, 2.5, 14, 1)), body(R(8.5, 5, 2.5, 14, 1)), body(R(13, 5, 2.5, 14, 1)), body(R(17.5, 5, 2.5, 14, 1))], { noAccent: true }),
  ],
};
