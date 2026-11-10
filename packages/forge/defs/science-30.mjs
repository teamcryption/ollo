import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('planet-pencil', 'Edit Planet', ['edit', 'write', 'modify', 'planet', 'planet'], [body(C(9.5, 10.5, 4.3)), line(rotateD(E(9.5, 10.5, 7, 2), -25, 9.5, 10.5)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('ufo-pencil', 'Edit Ufo', ['edit', 'write', 'modify', 'ufo', 'ufo'], [line('M6.6 8.4a2.9 2.9 0 0 1 5.8 0'), body('M3 11.5c0-1.7 2.9-3 6.5-3s6.5 1.3 6.5 3-2.9 3-6.5 3-6.5-1.3-6.5-3Z'), line('M7 15.8l-1.5 2.7M12 15.8l1.5 2.7'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
