import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const AXIS = 'M3.5 3.5v15a2 2 0 0 0 2 2h15';

export default {
  category: 'data',
  icons: [
    icon('chart-pyramid', 'Pyramid Chart', ['hierarchy', 'levels', 'funnel', 'tiers'], [accent(poly([[12, 3.5], [14.8, 8], [9.2, 8]], 0.4, true)), body(poly([[8.2, 10], [15.8, 10], [18, 14.5], [6, 14.5]], 0.4, true)), body(poly([[5.2, 16.2], [18.8, 16.2], [20.5, 20.5], [3.5, 20.5]], 0.4, true))]),
    icon('chart-treemap', 'Treemap', ['treemap', 'proportions', 'blocks', 'hierarchy'], [body(R(3.5, 3.5, 17, 17, 2)), line(L(11, 3.7, 11, 20.3)), line(L(11.2, 11, 20.3, 11)), line(L(15.5, 11.2, 15.5, 20.3)), line(L(3.7, 14.5, 10.8, 14.5))], { noAccent: true }),
    icon('chart-points', 'Data Points', ['line chart', 'plot', 'series', 'markers'], [line(AXIS), line(poly([[7.5, 15.5], [11, 11], [14, 13.5], [18, 8]], 0.4)), body(C(7.5, 15.5, 1.4)), body(C(11, 11, 1.4)), body(C(14, 13.5, 1.4)), body(C(18, 8, 1.4))], { noAccent: true }),
  ],
};
