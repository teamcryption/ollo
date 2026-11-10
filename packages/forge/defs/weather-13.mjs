import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const hex = (cx, cy, r) => poly([0, 1, 2, 3, 4, 5].map((k) => { const a = (-90 + 60 * k) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }), 1, true);
const drop = (x) => 'M' + x + ' 9c1.4 1.8 2 3 2 4a2 2 0 0 1-4 0c0-1 .6-2.2 2-4Z';

export default {
  category: 'weather',
  icons: [
    icon('icicle', 'Icicles', ['ice', 'freezing', 'winter', 'frozen', 'cold'], [line('M3.5 4.5h17'), body(poly([[5, 5], [9, 5], [7, 14]], 0.6, true)), body(poly([[10, 5], [13, 5], [11.5, 19]], 0.6, true)), body(poly([[14.5, 5], [18.5, 5], [16.5, 11]], 0.6, true)), accent(D(16.5, 14))]),
    icon('dust-storm', 'Dust Storm', ['sandstorm', 'haboob', 'desert wind', 'dust', 'gale'], [line('M3.5 8h11a2.5 2.5 0 1 0-2.5-2.5M3.5 12h15a2.5 2.5 0 1 1-2.5 2.5'), line(D(6, 16) + D(9.5, 18.5) + D(5, 20) + D(13, 20.5))], { noAccent: true }),
  ],
};
