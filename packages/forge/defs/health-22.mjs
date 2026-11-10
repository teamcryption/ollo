import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('pill-search', 'Drug Lookup', ['medication search', 'pharmacy', 'medicine info', 'pill', 'pill'], [body(rotateD(R(7, 2.5, 5, 13, 2.5), 45, 9.5, 9)), line(rotateD('M7.2 9h4.6', 45, 9.5, 9)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
