import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'security',
  icons: [
    icon('lock-3', 'Lock Round', ['secure', 'private', 'padlock', 'protected'], [line('M8.5 9.5V7a3.5 3.5 0 0 1 7 0v2.5'), body(C(12, 15, 6)), accent(L(12, 13.5, 12, 16.5))]),
  ],
};
