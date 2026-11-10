import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'travel',
  icons: [
    icon('bed-star', 'Hotel Rating', ['room rating', 'accommodation review', 'stay', 'bed', 'bed'], [line('M3 17V6M3 13h13v4'), body('M8 8.5h6a2 2 0 0 1 2 2V13H8Z'), body(C(5.5, 10.8, 1.4)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('tent-pin', 'Campsite', ['camping location', 'camp ground', 'outdoors', 'tent', 'tent'], [body(poly([[9.5, 4], [16, 16.5], [3, 16.5]], 0.8, true)), line('M9.5 10.5v6'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
  ],
};
