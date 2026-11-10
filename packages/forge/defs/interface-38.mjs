import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('edit-lock', 'Locked Editing', ['read only', 'edit protected', 'locked document', 'pencil', 'edit'], [body(poly([[12.5, 3.5], [15.5, 6.5], [7, 15], [3.5, 16], [4.5, 12.5]], 0.8, true)), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('edit-clock', 'Edit History', ['revision history', 'changes', 'versions', 'pencil', 'edit'], [body(poly([[12.5, 3.5], [15.5, 6.5], [7, 15], [3.5, 16], [4.5, 12.5]], 0.8, true)), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('eye-clock', 'Recently Viewed', ['view history', 'seen', 'recent', 'eye', 'eye'], [body('M2.5 10c1.8-3.2 4.2-5 7-5s5.2 1.8 7 5c-1.8 3.2-4.2 5-7 5s-5.2-1.8-7-5Z'), line(C(9.5, 10, 2)), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
  ],
};
