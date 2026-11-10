import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'data',
  icons: [
    icon('chart-spline', 'Spline Chart', ['smooth line', 'curve chart', 'trend', 'graph', 'analytics'], [line('M3.5 3.5v15a2 2 0 0 0 2 2h15'), line('M7 15c2-6 4-6 5.5-2s3.5 3 5.5-5')], { noAccent: true }),
    icon('chart-area-stacked', 'Stacked Area', ['area chart', 'layers', 'cumulative', 'graph', 'analytics'], [line('M3.5 3.5v15a2 2 0 0 0 2 2h15'), line('M7 16l3-4 3 2 5-6M7 16l3-2 3 1 5-3')], { noAccent: true }),
    icon('chart-growth', 'Growth Chart', ['growth', 'increase', 'progress', 'revenue', 'up'], [body(R(5, 14, 3, 6, 0.8)), body(R(10, 11, 3, 9, 0.8)), body(R(15, 9.5, 3, 10.5, 0.8)), accent('M5 9.5l4-3 3 2 4.5-4.5M14 3.8h2.5v2.5')]),
    icon('chart-decline', 'Decline Chart', ['decrease', 'loss', 'drop', 'revenue', 'down'], [body(R(5, 9.5, 3, 10.5, 0.8)), body(R(10, 11, 3, 9, 0.8)), body(R(15, 14, 3, 6, 0.8)), accent('M5 4.3l4.5 3 3-2 4.5 4.2M17 7v2.5h-2.5')]),
    icon('chart-sankey', 'Sankey Diagram', ['flow chart', 'sankey', 'distribution', 'graph', 'analytics'], [line('M3.5 5v14M20.5 5v14'), line('M4 7c6 0 8 10 16 10M4 12c6 0 8-5 16-5M4 17c8 0 8-5 16-5')], { noAccent: true }),
  ],
};
