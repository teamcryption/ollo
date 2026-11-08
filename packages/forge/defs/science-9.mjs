import { icon, body, line, accent } from '../src/dsl.mjs';
import { C, L, poly, star } from '../src/geo.mjs';

const P = [[5, 17], [9, 9], [13.5, 13], [18.5, 5.5], [17.5, 18]];
const E2 = [[0, 1, 2.2], [1, 2, 2.2], [2, 3, 3.6], [2, 4, 2.2]];
const edge = ([a, b, g]) => {
  const [x1, y1] = P[a]; const [x2, y2] = P[b];
  const d = Math.hypot(x2 - x1, y2 - y1); const ux = (x2 - x1) / d; const uy = (y2 - y1) / d;
  const g2 = b === 3 ? 4.4 : 2.2;
  return L(x1 + ux * 2.2, y1 + uy * 2.2, x2 - ux * g2, y2 - uy * g2);
};

export default {
  category: 'science',
  icons: [
    icon('asteroid', 'Asteroid', ['space rock', 'meteoroid', 'crater', 'space', 'impact'], [body(poly([[6, 6], [12, 4], [18, 7], [20, 13], [16, 19], [9, 20], [4, 15], [4, 9]], 2.5, true)), line(C(10, 10, 1.8) + C(14.5, 14, 2.3))], { noAccent: true }),
    icon('constellation', 'Constellation', ['stars', 'astronomy', 'zodiac', 'night sky', 'star map'], [...[0, 1, 2, 4].map((i) => body(C(P[i][0], P[i][1], 1.2))), line(E2.map(edge).join('')), accent(star(18.5, 5.5, 2.4, 1.1, 5, 0.3))]),
  ],
};
