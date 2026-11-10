import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'fashion',
  icons: [
    icon('sun-hat', 'Sun Hat', ['beach hat', 'summer', 'wide brim', 'straw hat', 'holiday'], [body(E(12, 15, 9, 2.5)), body('M7.5 14.5c0-4 2-6.5 4.5-6.5s4.5 2.5 4.5 6.5Z', { cover: true }), line('M7.6 12.5h8.8')], { noAccent: true }),
  ],
};
