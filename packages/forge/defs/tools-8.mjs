import { C, L, R, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'tools',
  icons: [
    icon('sprinkler', 'Sprinkler', ['lawn', 'irrigation', 'garden', 'water', 'spray'], [line('M10.3 10.6C8.6 7.6 6.2 6 3.5 6M13.7 10.6c1.7-3 4.1-4.6 6.8-4.6M12 9.7V4'), line(L(12, 13.3, 12, 17.5)), body(C(12, 11.5, 1.8)), body(R(7, 17.5, 10, 3, 1.2)), accent(D(4, 9.5) + D(20, 9.5))]),
  ],
};
