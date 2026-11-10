import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('curve-ahead', 'Curve Ahead', ['bend ahead', 'road sign', 'winding road', 'warning', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent('M10.5 16.5v-3c0-2 1.3-3.2 3.5-3.2M12.5 8.5l1.8 1.8-1.8 1.8')]),
    icon('road-narrows', 'Road Narrows', ['narrow road', 'road sign', 'lane ends', 'warning', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent('M9.5 8.5v2.5l1.5 1.5v3.5M14.5 8.5v2.5L13 12.5v3.5')]),
    icon('two-way-traffic', 'Two Way Traffic', ['two-way', 'road sign', 'oncoming traffic', 'warning', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent('M10 16V9M8.5 10.5 10 9l1.5 1.5M14 8v7M12.5 13.5 14 15l1.5-1.5')]),
    icon('no-u-turn', 'No U-Turn', ['u-turn prohibited', 'road sign', 'traffic', 'ban', 'driving'], [line('M10 17v-6a2.5 2.5 0 0 1 5 0v1.5M13.5 11l1.5 1.5 1.5-1.5'), line('M6 6l12 12', { cover: true }), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
