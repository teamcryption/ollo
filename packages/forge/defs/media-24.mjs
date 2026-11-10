import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('polaroid', 'Instant Photo', ['polaroid', 'snapshot', 'print', 'memories', 'photo'], [body(R(4.5, 3.5, 15, 17, 2)), line(R(7, 6, 10, 10, 0.8)), accent(L(9, 18, 15, 18))]),
  ],
};
