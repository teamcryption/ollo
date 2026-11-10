import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, poly } from '../src/geo.mjs';

const AXIS = 'M3.5 3.5v15a2 2 0 0 0 2 2h15';

export default {
  category: 'data',
  icons: [
    icon('box-plot', 'Box Plot', ['box and whisker', 'distribution', 'quartiles', 'statistics', 'median'], [line('M8 4v4M8 15v5M16 6v5M16 16.5V19'), body(R(5.5, 8, 5, 7, 1)), line('M5.7 11.5h4.6'), body(R(13.5, 11, 5, 5.5, 1)), line('M13.7 13.5h4.6')], { noAccent: true }),
    icon('chart-lollipop', 'Lollipop Chart', ['dot plot', 'ranking chart', 'graph', 'comparison', 'statistics'], [line('M3.5 20.5h17M7 20.5v-8.2M12 20.5V7.3M17 20.5v-6.2'), body(C(7, 10.5, 1.8)), body(C(12, 5.5, 1.8)), body(C(17, 12.5, 1.8))], { noAccent: true }),
    icon('sparkline', 'Sparkline', ['mini chart', 'trend', 'inline chart', 'micro chart', 'kpi trend'], [line(poly([[3.5, 15], [7, 11], [10, 14], [13.5, 8], [16.5, 12]], 0.8)), accent(C(19.5, 9, 1.2))]),
    icon('chart-forecast', 'Forecast', ['prediction', 'projection', 'trend forecast', 'estimate', 'future'], [line(AXIS), line(poly([[7, 16], [10, 12.5], [13, 14]], 0.8)), accent('M14.8 12.2l1.2-1.2M17.5 9.5 19 8')]),
    icon('chart-step', 'Step Chart', ['step line', 'staircase chart', 'graph', 'changes', 'levels'], [line(AXIS), line('M7 16h3v-4h3.5v2.5H17V8'), accent(D(19.5, 5.5))]),
    icon('pivot-table', 'Pivot Table', ['pivot', 'spreadsheet', 'cross tab', 'summarise', 'rotate data'], [body(R(3.5, 3.5, 17, 17, 2.5)), line('M3.7 9h16.6M9 3.7v16.6'), accent('M12.5 17.5c0-2.8 2.2-5 5-5M15.8 11l1.7 1.5-1.7 1.5')]),
  ],
};
