import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const hex = (cx, cy, r) => poly([0, 1, 2, 3, 4, 5].map((k) => { const a = (-90 + 60 * k) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }), 1, true);
const drop = (x) => 'M' + x + ' 9c1.4 1.8 2 3 2 4a2 2 0 0 1-4 0c0-1 .6-2.2 2-4Z';

export default {
  category: 'development',
  icons: [
    icon('git-tag', 'Git Tag', ['release tag', 'version', 'tag', 'commit', 'release'], [line('M7 3.5v17'), body(C(7, 12, 2.2), { cover: true }), body(poly([[11.5, 9], [17, 9], [20, 12], [17, 15], [11.5, 15]], 1, true)), line(D(16.8, 12))], { noAccent: true }),
  ],
};
