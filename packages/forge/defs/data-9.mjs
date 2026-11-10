import { icon, body, line } from '../src/dsl.mjs';
import { R, poly } from '../src/geo.mjs';

const AXIS = 'M3.5 3.5v15a2 2 0 0 0 2 2h15';

export default {
  category: 'data',
  icons: [
    icon('chart-line-multi', 'Multi-line Chart', ['compare series', 'trend lines', 'line graph', 'benchmark', 'series'], [line(AXIS), line(poly([[7, 14], [10.5, 10], [14, 12], [18.5, 6]], 0.8)), line(poly([[7, 17.5], [10.5, 15.5], [14, 16.5], [18.5, 12.5]], 0.8))], { noAccent: true }),
  ],
};
