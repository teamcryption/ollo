import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('toothbrush-pencil', 'Edit Toothbrush', ['edit', 'write', 'modify', 'toothbrush', 'toothbrush'], [body(R(7.5, 3.5, 4, 6, 1.2)), line('M5 4.8h1.5M5 6.5h1.5M5 8.2h1.5'), line('M9.5 9.7V18'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
