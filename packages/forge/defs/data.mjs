import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'data',
  icons: [
    icon('chart-bar', 'Bar Chart', ['graph', 'statistics', 'analytics', 'report'], [body(R(4, 12, 4, 8, 1.2)), body(R(10, 7, 4, 13, 1.2)), body(R(16, 4, 4, 16, 1.2))], { noAccent: true, anim: { preset: 'bounce', dist: -1.5 } }),
    icon('chart-line', 'Line Chart', ['graph', 'trend', 'analytics', 'growth'], [line('M3.5 3.5v15a2 2 0 0 0 2 2h15'), line(poly([[7.5, 15], [11, 10.5], [14, 13], [16.8, 9.7]], 1)), accent(D(19.5, 6.5))], { anim: 'pop-draw' }),
    icon('chart-pie', 'Pie Chart', ['graph', 'share', 'percentage', 'breakdown'], [body('M11 4.1A8 8 0 1 0 19.9 13H11Z'), accent('M14 3.5a7 7 0 0 1 6.5 6.5H14Z')], { anim: 'pulse' }),
    icon('chart-donut', 'Donut Chart', ['graph', 'ratio', 'progress', 'percentage'], [line(C(12, 12, 8)), line(A(12, 12, 8, -90, 45), { cover: true }), accent(C(12, 12, 3.5))], { anim: 'spin' }),
    icon('chart-area', 'Area Chart', ['graph', 'volume', 'analytics', 'trend'], [line('M3.5 3.5v15a2 2 0 0 0 2 2h15'), body(poly([[7, 17.5], [7, 13], [10.5, 9.5], [14, 12], [19.5, 7], [19.5, 17.5]], 0.8, true))], { noAccent: true }),
    icon('chart-scatter', 'Scatter Chart', ['plot', 'correlation', 'points', 'distribution'], [line('M3.5 3.5v15a2 2 0 0 0 2 2h15'), body(C(8.5, 14.5, 1.3)), body(C(12, 10.5, 1.3)), body(C(16, 13, 1.3)), body(C(18, 7, 1.3)), accent(D(14, 17))]),
    icon('dashboard-gauge', 'Gauge', ['speedometer', 'performance', 'meter', 'kpi'], [line(A(12, 14, 8.5, 160, 380)), line(L(12, 14, 15.5, 9.5)), body(C(12, 14, 1.4))], { noAccent: true, anim: 'wiggle' }),
    icon('table', 'Table', ['grid', 'spreadsheet', 'rows', 'columns', 'data'], [body(R(3, 4, 18, 16, 2.5)), line(L(3.2, 9, 20.8, 9)), line(L(3.2, 14.5, 20.8, 14.5)), line(L(9.5, 9.2, 9.5, 19.8))], { noAccent: true }),
    icon('funnel-chart', 'Funnel', ['conversion', 'pipeline', 'sales funnel', 'stages'], [body(R(3, 4, 18, 4, 1.5)), body(R(5.5, 10, 13, 4, 1.5)), body(R(8.5, 16, 7, 4, 1.5))], { noAccent: true, anim: { preset: 'bounce', dist: 1.5 } }),
    icon('kpi', 'KPI', ['metric', 'target', 'goal', 'objective', 'performance'], [body(R(3, 5, 18, 14, 2.5)), line(poly([[6.5, 15], [9.5, 11.5], [12, 13.5], [15, 9.5]], 0.6)), accent(D(17.5, 9))]),
    icon('presentation', 'Presentation', ['slides', 'board', 'pitch', 'meeting', 'chart'], [line(L(2.5, 4, 21.5, 4)), body(R(4, 4.5, 16, 11, 1.5)), line(L(12, 15.7, 12, 18)), line(L(9, 20.5, 12, 18)), line(L(15, 20.5, 12, 18)), accent(poly([[7.5, 12], [10, 9.5], [12, 11], [15.5, 8]], 0.5))]),
    icon('sitemap', 'Hierarchy', ['org chart', 'structure', 'tree', 'sitemap'], [body(R(9, 3, 6, 4.5, 1.2)), body(R(3, 16.5, 6, 4.5, 1.2)), body(R(15, 16.5, 6, 4.5, 1.2)), line('M12 7.7v3.3H6a.5.5 0 0 0 0 0v5.3'), line('M12 11h6v5.3')], { noAccent: true }),
  ],
};
