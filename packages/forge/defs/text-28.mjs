import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'text',
  icons: [
    icon('fountain-pen-leaf', 'Eco Fountain Pen', ['eco', 'green', 'sustainable', 'fountain pen', 'fountain-pen'], [body('M9.5 3.5l4.5 6-4.5 9-4.5-9Z'), line('M9.5 4v5'), line(D(9.5, 11.2)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('scroll-leaf', 'Eco Scroll', ['eco', 'green', 'sustainable', 'scroll', 'scroll'], [body(R(3.5, 3, 12, 2.3, 1.15)), body(R(5, 5.8, 9, 9.4, 0.6)), body(R(3.5, 15.7, 12, 2.3, 1.15)), line('M7 8.5h5M7 11h5M7 13h3'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
