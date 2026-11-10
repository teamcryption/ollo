import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'nature',
  icons: [
    icon('river', 'River', ['stream', 'creek', 'waterway', 'flow', 'nature'], [line('M7 3.5c0 4 6 4 6 8.5s-6 4.5-6 8.5M13 3.5c0 4 6 4 6 8.5s-6 4.5-6 8.5'), accent('M15 12c.5-.5 1-.5 1.5 0')]),
  ],
};
