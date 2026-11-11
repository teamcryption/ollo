import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'finance',
  icons: [
    icon('cheque-pencil', 'Edit Cheque', ['edit', 'write', 'modify', 'cheque', 'cheque'], [body(R(3, 5.5, 13, 9, 1.5)), line('M5.5 9h5M5.5 11.5h3M10.5 12c1-1.5 2-1.5 2.5-.5s1.2 1 2-.5'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
