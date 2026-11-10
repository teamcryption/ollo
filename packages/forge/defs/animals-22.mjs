import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'animals',
  icons: [
    icon('paw-star', 'Best in Show', ['top pet', 'award', 'champion', 'paw', 'paw'], [body(C(9.5, 12.5, 2.8)), body(C(5.5, 9, 1.3)), body(C(8.3, 6.2, 1.3)), body(C(11.7, 6.2, 1.3)), body(C(13.5, 9, 1.3)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
  ],
};
