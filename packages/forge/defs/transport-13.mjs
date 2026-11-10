import { icon, body, line } from '../src/dsl.mjs';
import { R, C, poly } from '../src/geo.mjs';

export default {
  category: 'transport',
  icons: [
    icon('snowplow', 'Snowplow', ['snow plough', 'plow truck', 'winter road', 'snow removal', 'gritter'], [body(poly([[3, 11], [6, 10], [6, 19], [3, 20]], 0.6, true)), line('M6 15h2'), body(poly([[8, 16.5], [8, 10], [10.5, 7], [14, 7], [14, 16.5]], 1, true)), body(R(14, 10, 7, 6.5, 1)), body(C(10.5, 18.3, 1.8), { cover: true }), body(C(17.5, 18.3, 1.8), { cover: true })], { noAccent: true }),
  ],
};
