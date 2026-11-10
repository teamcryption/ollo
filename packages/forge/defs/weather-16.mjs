import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'weather',
  icons: [
    icon('no-umbrellas', 'No Umbrellas', ['umbrellas prohibited', 'stadium', 'venue', 'prohibited', 'sign'], [line('M7.5 12a4.5 4.5 0 0 1 9 0ZM12 12v4a1.2 1.2 0 0 0 2.4 0'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
