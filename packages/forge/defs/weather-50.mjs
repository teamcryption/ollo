import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'weather',
  icons: [
    icon('cloud-2', 'Cloud Alt', ['weather', 'sky', 'storage', 'online'], [body('M7 18.5a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 17.6 8a5.3 5.3 0 0 1-.6 10.5Z'), accent('M9.5 12a2.6 2.6 0 0 1 2.5-2')]),
  ],
};
