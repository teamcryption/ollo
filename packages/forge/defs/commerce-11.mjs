import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'commerce',
  icons: [
    icon('no-bags', 'No Bags', ['bags prohibited', 'leave bags', 'sign', 'ban', 'security'], [line('M10.5 8.8V8a1.5 1.5 0 0 1 3 0v.8'), body(R(8, 9, 8, 7.5, 1.2)), line('M6 6l12 12', { cover: true }), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
