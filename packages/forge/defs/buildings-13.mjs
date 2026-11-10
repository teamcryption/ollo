import { icon, body, line } from '../src/dsl.mjs';
import { R, poly } from '../src/geo.mjs';

export default {
  category: 'buildings',
  icons: [
    icon('well', 'Well', ['wishing well', 'water', 'village', 'rural', 'bucket'], [body(poly([[4, 8], [12, 3.5], [20, 8]], 1, true)), line('M6.5 8v6M17.5 8v6M12 8v2'), body(R(10.5, 10, 3, 2.3, 0.6)), body(R(4.5, 14, 15, 6.5, 1.5))], { noAccent: true }),
    icon('tipi', 'Tipi', ['teepee', 'tent', 'camp', 'native dwelling', 'shelter'], [line('M12 6 9.5 3M12 6l2.5-3'), body(poly([[12, 6], [19.5, 20.5], [4.5, 20.5]], 1, true)), line('M10 20.3 12 15.5l2 4.8')], { noAccent: true }),
    icon('yurt', 'Yurt', ['ger', 'nomad', 'tent', 'glamping', 'dwelling'], [body('M3.5 13c2-4 5-7 8.5-7s6.5 3 8.5 7v7.5h-17Z'), line('M4.5 12.5h15M10.5 20.3v-4h3v4')], { noAccent: true }),
    icon('log-cabin', 'Log Cabin', ['cabin', 'lodge', 'woods', 'chalet', 'retreat'], [line('M16.5 7.5V4.5'), body(poly([[3.5, 11], [12, 4], [20.5, 11], [20.5, 20.5], [3.5, 20.5]], 1, true)), line('M3.7 14h16.6M3.7 17.5h16.6')], { noAccent: true }),
  ],
};
