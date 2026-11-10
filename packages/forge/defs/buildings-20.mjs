import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'buildings',
  icons: [
    icon('bricks', 'Bricks', ['brick stack', 'masonry', 'building materials', 'construction', 'wall'], [body(R(3.5, 13, 8, 6.5, 1)), body(R(12.5, 13, 8, 6.5, 1)), body(R(8, 5.5, 8, 6.5, 1))], { noAccent: true }),
    icon('cement-bag', 'Cement Bag', ['concrete', 'mortar', 'building materials', 'sack', 'construction'], [body('M6 4h12l1 2.5-1 2.5v9.5A1.5 1.5 0 0 1 16.5 20h-9A1.5 1.5 0 0 1 6 18.5V9L5 6.5Z'), line(R(8.5, 11, 7, 5, 0.8))], { noAccent: true }),
    icon('i-beam', 'Steel Beam', ['girder', 'i-beam', 'steel', 'structure', 'construction'], [body('M5 4h14v3h-5v10h5v3H5v-3h5V7H5Z')], { noAccent: true }),
  ],
};
