import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'security',
  icons: [
    icon('eye-lock', 'Hidden Content', ['private view', 'locked visibility', 'hidden', 'eye', 'eye'], [body('M2.5 10c1.8-3.2 4.2-5 7-5s5.2 1.8 7 5c-1.8 3.2-4.2 5-7 5s-5.2-1.8-7-5Z'), line(C(9.5, 10, 2)), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('eye-shield', 'Privacy View', ['privacy protection', 'anti tracking', 'safe browsing', 'eye', 'eye'], [body('M2.5 10c1.8-3.2 4.2-5 7-5s5.2 1.8 7 5c-1.8 3.2-4.2 5-7 5s-5.2-1.8-7-5Z'), line(C(9.5, 10, 2)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
