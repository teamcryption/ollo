import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const hex = (cx, cy, r) => poly([0, 1, 2, 3, 4, 5].map((k) => { const a = (-90 + 60 * k) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }), 1, true);
const drop = (x) => 'M' + x + ' 9c1.4 1.8 2 3 2 4a2 2 0 0 1-4 0c0-1 .6-2.2 2-4Z';

export default {
  category: 'animals',
  icons: [
    icon('starfish', 'Starfish', ['sea star', 'ocean', 'beach', 'marine', 'sea life'], [body(star(12, 12.5, 9, 4, 5, 2.5)), line(D(12, 10) + D(10, 13) + D(14, 13))], { noAccent: true }),
    icon('caterpillar', 'Caterpillar', ['larva', 'bug', 'insect', 'garden', 'crawl'], [body(R(3.5, 12.5, 11, 5, 2.5)), line('M7.3 12.7v4.6M10.8 12.7v4.6'), body(C(17.5, 12, 3), { cover: true }), line('M16.5 9.2 15.5 6.5M18.6 9.2l1.2-2.6'), line(D(18.3, 11.6))], { noAccent: true }),
  ],
};
