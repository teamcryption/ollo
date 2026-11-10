import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const hex = (cx, cy, r) => poly([0, 1, 2, 3, 4, 5].map((k) => { const a = (-90 + 60 * k) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }), 1, true);
const drop = (x) => 'M' + x + ' 9c1.4 1.8 2 3 2 4a2 2 0 0 1-4 0c0-1 .6-2.2 2-4Z';

export default {
  category: 'design',
  icons: [
    icon('pixelate', 'Pixelate', ['pixel', 'mosaic', 'blur', 'retro', 'censor'], [body(poly([[9, 4], [15, 4], [15, 6], [18, 6], [18, 9], [20, 9], [20, 15], [18, 15], [18, 18], [15, 18], [15, 20], [9, 20], [9, 18], [6, 18], [6, 15], [4, 15], [4, 9], [6, 9], [6, 6], [9, 6]], 0.4, true)), accent(R(10.5, 10.5, 3, 3, 0.5))]),
  ],
};
