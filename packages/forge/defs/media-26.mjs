import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('no-music', 'No Music', ['music prohibited', 'quiet zone', 'silence', 'prohibited', 'sign'], [line('M13 15.5V8l2.5-.8'), body(C(11.5, 15.5, 1.6)), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
