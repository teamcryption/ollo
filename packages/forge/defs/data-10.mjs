import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const hex = (cx, cy, r) => poly([0, 1, 2, 3, 4, 5].map((k) => { const a = (-90 + 60 * k) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }), 1, true);
const drop = (x) => 'M' + x + ' 9c1.4 1.8 2 3 2 4a2 2 0 0 1-4 0c0-1 .6-2.2 2-4Z';

export default {
  category: 'data',
  icons: [
    icon('chart-grouped', 'Grouped Bar Chart', ['clustered bars', 'comparison', 'graph', 'side by side', 'statistics'], [body(R(3.5, 11, 2.5, 9, 0.8)), body(R(8, 7, 2.5, 13, 0.8)), body(R(13.5, 13, 2.5, 7, 0.8)), body(R(18, 9, 2.5, 11, 0.8))], { noAccent: true }),
    icon('chart-range', 'Range Chart', ['floating bars', 'min max', 'spread', 'interval', 'graph'], [body(R(4, 9, 3.5, 7, 1)), body(R(10.25, 5, 3.5, 9, 1)), body(R(16.5, 10, 3.5, 7, 1)), line('M3.5 20.5h17')], { noAccent: true }),
    icon('chart-slope', 'Slope Chart', ['before after chart', 'change', 'comparison', 'ranking', 'graph'], [body(C(5, 8, 1.6)), body(C(19, 13, 1.6)), body(C(5, 15, 1.6)), body(C(19, 7, 1.6)), line('M6.5 8.5 17.5 12.5M6.5 14.4 17.5 7.6'), accent(L(5, 20, 19, 20))]),
  ],
};
