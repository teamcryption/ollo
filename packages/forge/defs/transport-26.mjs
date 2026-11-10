import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('no-horn', 'No Horn', ['no honking', 'quiet zone', 'hospital zone', 'prohibited', 'sign'], [body('M7 10.5h2.5L15 7.5v9l-5.5-3H7Z'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
    icon('hairpin-curve', 'Hairpin Curve', ['sharp bend', 'switchback', 'turn', 'road sign', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(scaleD('M9.5 16V11a2.5 2.5 0 0 1 5 0v1.5M13 11l1.5 1.5L16 11', 0.85, 12, 12))]),
    icon('flood-zone', 'Flood Zone', ['flooding', 'water on road', 'ford', 'road sign', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(scaleD('M8.5 11c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0M8.5 14c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0', 0.85, 12, 12))]),
    icon('tunnel-ahead', 'Tunnel Ahead', ['tunnel', 'underpass', 'headlights', 'road sign', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(scaleD('M8.5 16v-3a3.5 3.5 0 0 1 7 0v3', 0.85, 12, 12))]),
    icon('lane-ends', 'Lane Ends', ['merge left', 'lane closed', 'narrowing', 'road sign', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(scaleD('M9.5 16V8M14.5 16v-3.5L12 10V8', 0.85, 12, 12))]),
  ],
};
