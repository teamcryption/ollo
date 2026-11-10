import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'people',
  icons: [
    icon('user-pencil', 'Edit User', ['edit', 'write', 'modify', 'user', 'user'], [body(C(9.5, 8, 3.5)), body(translateD('M5.5 19c.4-2.7 3.1-4.5 6.5-4.5s6.1 1.8 6.5 4.5c.1.6-.4 1-.9 1H6.4c-.5 0-1-.4-.9-1Z', -2.5, 0)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('baby-bottle-pencil', 'Edit Baby Bottle', ['edit', 'write', 'modify', 'baby bottle', 'baby-bottle'], [body('M8 3.5h3v2l1.5 2V16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 16V7.5L8 5.5Z'), line('M6.7 10.5h5.6'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
