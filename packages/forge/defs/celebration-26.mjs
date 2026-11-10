import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'celebration',
  icons: [
    icon('party-popper-pencil', 'Edit Party Popper', ['edit', 'write', 'modify', 'party popper', 'party-popper'], [body(poly([[3.5, 17.5], [6.5, 8], [13, 14.5]], 0.8, true)), line('M9.5 6.5l1-3M12 8.5l3-1.5M13.8 11.5l2.4.3'), line(D(7.5, 4.5)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
