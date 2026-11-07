import { R, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'data',
  icons: [
    icon('chart-stacked', 'Stacked Bar Chart', ['stacked', 'segments', 'composition', 'bar chart', 'breakdown'], [body(R(4.5, 10, 4, 10.5, 1)), line(L(4.7, 14, 8.3, 14)), body(R(10, 5, 4, 15.5, 1)), line(L(10.2, 11, 13.8, 11)), body(R(15.5, 8, 4, 12.5, 1)), line(L(15.7, 15, 19.3, 15))], { noAccent: true }),
  ],
};
