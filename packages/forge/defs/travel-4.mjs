import { C, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

const P = (a, r = 6.5) => [12 + r * Math.cos((a * Math.PI) / 180), 10 + r * Math.sin((a * Math.PI) / 180)];

export default {
  category: 'travel',
  icons: [
    icon('ferris-wheel', 'Ferris Wheel', ['fair', 'amusement park', 'carnival', 'funfair', 'ride'], [line(C(12, 10, 6.5)), ...[0, 60, 120].map((a) => { const [x1, y1] = P(a); const [x2, y2] = P(a + 180); return line(L(x1, y1, x2, y2)); }), line('M8.5 20.5 12 10l3.5 10.5'), line(L(6.5, 20.5, 17.5, 20.5)), body(C(12, 10, 1.3))], { noAccent: true, anim: 'spin' }),
  ],
};
