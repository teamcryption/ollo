import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'weather',
  icons: [
    icon('rainbow-pencil', 'Edit Rainbow', ['edit', 'write', 'modify', 'rainbow', 'rainbow'], [line('M3 15.5a6.5 6.5 0 0 1 13 0'), line('M5.5 15.5a4 4 0 0 1 8 0'), line('M8 15.5a1.5 1.5 0 0 1 3 0'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
