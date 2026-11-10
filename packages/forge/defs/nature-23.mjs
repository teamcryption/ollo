import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'nature',
  icons: [
    icon('no-littering', 'No Littering', ['do not litter', 'keep clean', 'rubbish', 'prohibited', 'sign'], [line('M9 9h6M9.8 9l.6 7.5h3.2l.6-7.5M11 9V8h2v1'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
