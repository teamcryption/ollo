import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const hex = (cx, cy, r) => poly([0, 1, 2, 3, 4, 5].map((k) => { const a = (-90 + 60 * k) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }), 1, true);
const drop = (x) => 'M' + x + ' 9c1.4 1.8 2 3 2 4a2 2 0 0 1-4 0c0-1 .6-2.2 2-4Z';

export default {
  category: 'home',
  icons: [
    icon('picture-frame', 'Picture Frame', ['wall art', 'hanging frame', 'painting', 'gallery', 'decor'], [line('M8.5 7 12 3.5 15.5 7'), body(R(4, 7, 16, 13.5, 1.5)), line(R(7, 10, 10, 7.5, 0.8))], { noAccent: true }),
    icon('rocking-chair', 'Rocking Chair', ['rocker', 'porch', 'relax', 'furniture', 'nursery'], [line('M8 4.5 9.5 14h7.5M10 14l-1.5 5M16 14l1 5M9 10.5h6'), line('M4.5 18.5c4 2.5 11 2.5 15 0')], { noAccent: true }),
  ],
};
