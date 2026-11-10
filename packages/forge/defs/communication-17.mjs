import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'communication',
  icons: [
    icon('phone-search', 'Find Contact', ['contact search', 'lookup', 'directory', 'phone', 'phone'], [body('M5.5 3.5h2.5l1.3 3.2-1.8 1.3a8 8 0 0 0 3.5 3.5l1.3-1.8 3.2 1.3v2.5A1.5 1.5 0 0 1 14 15c-6 0-10-4-10-10a1.5 1.5 0 0 1 1.5-1.5Z'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('phone-star', 'Starred Contact', ['favourite contact', 'vip', 'speed dial', 'phone', 'phone'], [body('M5.5 3.5h2.5l1.3 3.2-1.8 1.3a8 8 0 0 0 3.5 3.5l1.3-1.8 3.2 1.3v2.5A1.5 1.5 0 0 1 14 15c-6 0-10-4-10-10a1.5 1.5 0 0 1 1.5-1.5Z'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
  ],
};
