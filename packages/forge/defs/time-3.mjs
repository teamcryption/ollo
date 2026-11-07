import { R, C, L, A, poly, D, E, arcArrow } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const RINGS = [line(L(8, 3, 8, 6)), line(L(16, 3, 16, 6))];
const CAL = R(3.5, 4.5, 17, 16, 3);
const HEADER = L(3.7, 9.5, 20.3, 9.5);

export default {
  category: 'time',
  icons: [
    icon('calendar-repeat', 'Recurring Event', ['repeat', 'recurring', 'weekly', 'routine', 'series'], [...RINGS, body(CAL), line(HEADER), accent(arcArrow(12, 14.8, 2.7, 240, 500, 2).join(''))]),
    icon('world-clock', 'World Clock', ['time zone', 'global time', 'international', 'utc'], [body(C(10, 10, 6.5)), line(E(10, 10, 2.6, 6.3)), line(L(3.7, 10, 16.3, 10)), body(C(16.5, 16.5, 4.5), { cover: true }), accent(poly([[16.5, 14.5], [16.5, 16.5], [18, 17.5]], 0.4))]),
  ],
};
