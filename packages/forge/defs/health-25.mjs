import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('no-smoking', 'No Smoking', ['smoking prohibited', 'smoke free', 'cigarette', 'prohibited', 'sign'], [body(R(6.5, 12, 9, 2.5, 0.6)), line('M16 12v2.5M15.5 9.5c0-1 1-1.2 1-2.2'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
