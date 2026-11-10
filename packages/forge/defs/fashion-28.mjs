import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'fashion',
  icons: [
    icon('hanger-star', 'Featured Hanger', ['featured', 'top rated', 'best', 'hanger', 'hanger'], [line('M9.5 5.5a1.5 1.5 0 1 1 1.5 1.5c-.6 0-1.5.5-1.5 1.5v.5L3.5 13.5h12L9.5 9'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('shirt-alert', 'Shirt Alert', ['alert', 'warning', 'problem', 'shirt', 'shirt'], [body(poly([[6, 3.5], [13, 3.5], [16, 6.5], [14, 9], [13, 8], [13, 16.5], [6, 16.5], [6, 8], [5, 9], [3, 6.5]], 0.8, true)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('scissors-alert', 'Scissors Alert', ['alert', 'warning', 'problem', 'scissors', 'scissors'], [line('M7.3 11.5 14 4M11.7 11.5 5 4'), body(C(5.5, 14, 2.2)), body(C(13.5, 14, 2.2)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('hanger-alert', 'Hanger Alert', ['alert', 'warning', 'problem', 'hanger', 'hanger'], [line('M9.5 5.5a1.5 1.5 0 1 1 1.5 1.5c-.6 0-1.5.5-1.5 1.5v.5L3.5 13.5h12L9.5 9'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
