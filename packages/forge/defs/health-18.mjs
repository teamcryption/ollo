import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const hex = (cx, cy, r) => poly([0, 1, 2, 3, 4, 5].map((k) => { const a = (-90 + 60 * k) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }), 1, true);
const drop = (x) => 'M' + x + ' 9c1.4 1.8 2 3 2 4a2 2 0 0 1-4 0c0-1 .6-2.2 2-4Z';

export default {
  category: 'health',
  icons: [
    icon('inhaler', 'Inhaler', ['asthma', 'puffer', 'respiratory', 'medicine', 'breathing'], [body(poly([[8, 11], [17, 11], [17, 20.5], [11, 20.5], [11, 17], [4, 17], [4, 13.5]], 1.2, true)), body(R(9.5, 3.5, 5, 8.5, 1.5), { cover: true }), accent(D(5.5, 9) + D(3.5, 11))]),
  ],
};
