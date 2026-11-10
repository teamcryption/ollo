import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'animals',
  icons: [
    icon('paw-alert', 'Pet Alert', ['alert', 'warning', 'problem', 'pet', 'paw'], [body(C(9.5, 12.5, 2.8)), body(C(5.5, 9, 1.3)), body(C(8.3, 6.2, 1.3)), body(C(11.7, 6.2, 1.3)), body(C(13.5, 9, 1.3)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
