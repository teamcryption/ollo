import { C, E, L, R } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'media',
  icons: [
    icon('drum', 'Drum', ['snare', 'percussion', 'music', 'instrument', 'beat', 'band'], [line(L(10, 6.2, 6.5, 3.5)), line(L(14, 6.2, 17.5, 3.5)), body(E(12, 10, 7, 2.5)), line('M5 10v7c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-7'), line('M5 14.5l3.5 3 3.5-3 3.5 3 3.5-3')], { noAccent: true }),
    icon('guitar', 'Guitar', ['acoustic', 'music', 'instrument', 'strings', 'band', 'song'], [line(L(12, 5.5, 12, 7.2)), body(R(10.6, 3, 2.8, 2.6, 0.9)), body('M14.7 12.4A4.5 4.5 0 1 1 9.3 12.4A3.3 3.3 0 1 1 14.7 12.4Z'), line(L(10.5, 18, 13.5, 18)), accent(C(12, 14.6, 1.3))]),
  ],
};
