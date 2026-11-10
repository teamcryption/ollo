import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('road-merge', 'Merging Traffic', ['merge', 'road sign', 'lanes join', 'warning', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent('M13 16.5V8.5M9.5 15c0-2.2 3.5-2.6 3.5-4.8')]),
    icon('dead-end', 'Dead End', ['no through road', 'road sign', 'cul de sac', 'warning', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent('M9 9h6M12 9v7')]),
    icon('steep-grade', 'Steep Grade', ['steep hill', 'road sign', 'gradient', 'warning', 'incline'], [body(poly([[12, 3.5], [21, 19.5], [3, 19.5]], 1.5, true)), accent(poly([[9.5, 16.5], [14.5, 12.5], [14.5, 16.5]], 0.6, true))]),
  ],
};
