import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'buildings',
  icons: [
    icon('castle-pencil', 'Edit Castle', ['edit', 'write', 'modify', 'castle', 'castle'], [body(poly([[3.5, 18], [3.5, 5.5], [6, 5.5], [6, 7.5], [8.2, 7.5], [8.2, 5.5], [10.8, 5.5], [10.8, 7.5], [13, 7.5], [13, 5.5], [15.5, 5.5], [15.5, 18]], 0.5, true)), line('M8 17.8V15a1.5 1.5 0 0 1 3 0v2.8'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
