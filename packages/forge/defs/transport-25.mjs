import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('side-road', 'Side Road', ['junction', 'side street', 'turn off', 'road sign', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(scaleD('M11 16V8M11 12h4', 0.85, 12, 12))]),
    icon('y-junction', 'Y Junction', ['fork in road', 'junction', 'split', 'road sign', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(scaleD('M12 16v-4M12 12 9 8.5M12 12l3-3.5', 0.85, 12, 12))]),
  ],
};
