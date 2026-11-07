import { poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'celebration',
  icons: [
    icon('bunting', 'Bunting', ['garland', 'flags', 'party decoration', 'pennants', 'festival'], [line('M3 8.5c3 2 6 3 9 3s6-1 9-3'), body(poly([[4.6, 9.7], [8.4, 11], [5.4, 15]], 0.4, true)), body(poly([[10, 11.5], [14, 11.5], [12, 16]], 0.4, true)), body(poly([[15.6, 11], [19.4, 9.7], [18.6, 15]], 0.4, true))], { noAccent: true, anim: 'wiggle' }),
  ],
};
