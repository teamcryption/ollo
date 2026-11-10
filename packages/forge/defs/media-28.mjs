import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('headphones-gear', 'Audio Settings', ['sound settings', 'equaliser', 'headset config', 'audio', 'headphones'], [line('M4 13v-3a5.5 5.5 0 0 1 11 0v3'), body(R(3, 12, 3, 5, 1.2)), body(R(13, 12, 3, 5, 1.2)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
  ],
};
