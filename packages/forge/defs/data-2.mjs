import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const AXIS = 'M3.5 3.5v15a2 2 0 0 0 2 2h15';
const ngon = (cx, cy, rs, rot = -90) => rs.map((r, i) => {
  const a = ((rot + (i * 360) / rs.length) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
});
const HEAT = [3.4, 9.8, 16.2];

export default {
  category: 'data',
  icons: [
    icon('chart-bar-horizontal', 'Horizontal Bar Chart', ['bar graph', 'ranking', 'comparison', 'statistics'], [line(L(3.5, 3, 3.5, 21)), body(R(6, 4.5, 8, 3.5, 1.2)), body(R(6, 10.25, 14, 3.5, 1.2)), accent(R(6, 16, 11, 3.5, 1.2))], { anim: { preset: 'nudge', dir: [1, 0], dist: 1.5 } }),
    icon('chart-candles', 'Candlestick Chart', ['stocks', 'trading', 'market', 'ohlc', 'price'], [line(L(5.5, 3.5, 5.5, 7)), body(R(3.75, 7, 3.5, 8, 1)), line(L(5.5, 15, 5.5, 20.5)), line(L(12, 4, 12, 9)), body(R(10.25, 9, 3.5, 5, 1)), line(L(12, 14, 12, 17)), line(L(18.5, 6, 18.5, 9.5)), body(R(16.75, 9.5, 3.5, 7, 1)), line(L(18.5, 16.5, 18.5, 19.5))], { noAccent: true }),
    icon('chart-radar', 'Radar Chart', ['spider chart', 'skills', 'comparison', 'web chart'], [body(poly(ngon(12, 12.5, [8.5, 8.5, 8.5, 8.5, 8.5]), 1, true)), ...ngon(12, 12.5, [8.3, 8.3, 8.3, 8.3, 8.3]).map(([x, y]) => line(L(12, 12.5, x, y))), line(poly(ngon(12, 12.5, [5.5, 4.5, 3, 4, 3.5]), 0.5, true))], { noAccent: true }),
    icon('chart-bubble', 'Bubble Chart', ['bubbles', 'scatter', 'volume', 'analytics'], [line(AXIS), line(C(9, 14, 2.2)), accent(C(15.5, 8, 3)), line(C(16.5, 15.5, 1.3))]),
    icon('chart-histogram', 'Histogram', ['distribution', 'frequency', 'bins', 'statistics'], [body(poly([[4, 20], [4, 14], [8, 14], [8, 9], [12, 9], [12, 5], [16, 5], [16, 11], [20, 11], [20, 20]], 0.6, true)), line(L(8, 14, 8, 19.8)), line(L(12, 9, 12, 19.8)), line(L(16, 11, 16, 19.8))], { noAccent: true }),
    icon('heatmap', 'Heatmap', ['matrix', 'density', 'grid', 'intensity'], HEAT.flatMap((y, r) => HEAT.map((x, c) => {
      const d = R(x, y, 4.4, 4.4, 1);
      if (r === 1 && c === 1) return accent(d);
      return (r + c) % 2 ? body(d) : line(d);
    }))),
    icon('chart-waterfall', 'Waterfall Chart', ['bridge chart', 'cash flow', 'variance', 'breakdown'], [body(R(3.5, 12, 3.2, 8, 0.8)), body(R(7.9, 7, 3.2, 5, 0.8)), body(R(12.3, 7, 3.2, 3.5, 0.8)), body(R(16.7, 10.5, 3.2, 9.5, 0.8))], { noAccent: true }),
    icon('chart-gantt', 'Gantt Chart', ['timeline', 'project plan', 'schedule', 'tasks'], [line(L(3.5, 3.5, 3.5, 20.5)), body(R(6, 5, 8, 3, 1.2)), body(R(10, 10.5, 9, 3, 1.2)), accent(R(8, 16, 7, 3, 1.2))]),
    icon('chart-mixed', 'Combo Chart', ['bar and line', 'combination', 'analytics', 'report'], [body(R(4, 13, 3.5, 7, 1)), body(R(10.25, 10, 3.5, 10, 1)), body(R(16.5, 12, 3.5, 8, 1)), accent(poly([[4.5, 9], [12, 5], [19.5, 7.5]], 0.8))]),
  ],
};
