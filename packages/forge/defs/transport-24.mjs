import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('no-left-turn', 'No Left Turn', ['left turn prohibited', 'traffic', 'road', 'prohibited', 'sign'], [line('M14 17v-4.5a2 2 0 0 0-2-2H8.5M10.5 8.5l-2 2 2 2'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
    icon('no-right-turn', 'No Right Turn', ['right turn prohibited', 'traffic', 'road', 'prohibited', 'sign'], [line('M10 17v-4.5a2 2 0 0 1 2-2h3.5M13.5 8.5l2 2-2 2'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
    icon('signal-ahead', 'Signal Ahead', ['traffic light ahead', 'signals', 'intersection', 'road sign', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent('M10.5 8h3v8h-3ZM12 10h.01M12 12h.01M12 14h.01')]),
    icon('yield-ahead', 'Yield Ahead', ['give way ahead', 'yield', 'junction', 'road sign', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(poly([[9, 10], [15, 10], [12, 15]], 0.5, true))]),
    icon('low-clearance', 'Low Clearance', ['height limit', 'bridge', 'overhead', 'road sign', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(scaleD('M9 8.5h6M9 15.5h6M12 9.5v5M10.5 11l1.5-1.5 1.5 1.5M10.5 13l1.5 1.5 1.5-1.5', 0.75, 12, 12))]),
  ],
};
